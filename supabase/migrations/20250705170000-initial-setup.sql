-- =====================================================
-- MIGRAÇÃO INICIAL - SISTEMA DE AUTENTICAÇÃO E USUÁRIOS
-- =====================================================

-- 1. Criar enum para os papéis de usuário
CREATE TYPE public.user_role AS ENUM ('student', 'admin');

-- 2. Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Criar tabela para cursos
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2) NOT NULL,
  duration TEXT NOT NULL,
  students INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0,
  level TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Criar tabela para eBooks
CREATE TABLE public.ebooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2) NOT NULL,
  pages INTEGER NOT NULL,
  downloads INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  bestseller BOOLEAN NOT NULL DEFAULT false,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Criar tabela para contatos
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Criar tabela para configurações do site
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Criar tabela para estatísticas do site
CREATE TABLE public.site_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_users INTEGER DEFAULT 0,
  total_courses INTEGER DEFAULT 0,
  total_ebooks INTEGER DEFAULT 0,
  total_contacts INTEGER DEFAULT 0,
  total_revenue NUMERIC DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS DE SEGURANÇA
-- =====================================================

-- Políticas para profiles
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para cursos (leitura pública)
CREATE POLICY "Anyone can view courses" 
  ON public.courses 
  FOR SELECT 
  USING (true);

-- Políticas para eBooks (leitura pública)
CREATE POLICY "Anyone can view ebooks" 
  ON public.ebooks 
  FOR SELECT 
  USING (true);

-- Políticas para contatos (apenas inserção pública)
CREATE POLICY "Anyone can insert contacts" 
  ON public.contacts 
  FOR INSERT 
  WITH CHECK (true);

-- Políticas para site_settings (apenas admins)
CREATE POLICY "Admins can manage site settings" 
  ON public.site_settings 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para site_stats (apenas admins)
CREATE POLICY "Admins can view site stats" 
  ON public.site_stats 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update site stats" 
  ON public.site_stats 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.email),
    'student'
  );
  RETURN new;
END;
$$;

-- Trigger para executar a função quando um novo usuário é criado
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- Função para atualizar estatísticas automaticamente
CREATE OR REPLACE FUNCTION public.update_site_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.site_stats
  SET 
    total_users = (SELECT COUNT(*) FROM public.profiles),
    total_courses = (SELECT COUNT(*) FROM public.courses),
    total_ebooks = (SELECT COUNT(*) FROM public.ebooks),
    total_contacts = (SELECT COUNT(*) FROM public.contacts),
    updated_at = now()
  WHERE id = (SELECT id FROM public.site_stats LIMIT 1);
END;
$$;

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Inserir configurações iniciais
INSERT INTO public.site_settings (key, value, description) VALUES
('site_name', 'MedCursos', 'Nome do site'),
('site_description', 'Especialista em Saúde', 'Descrição do site'),
('contact_email', 'contato@medcursos.com', 'Email de contato'),
('contact_phone', '(11) 99999-9999', 'Telefone de contato'),
('maintenance_mode', 'false', 'Modo de manutenção'),
('registration_enabled', 'true', 'Permitir novos registros');

-- Inserir registro inicial de estatísticas
INSERT INTO public.site_stats (total_users, total_courses, total_ebooks, total_contacts, total_revenue) 
VALUES (0, 0, 0, 0, 0);

-- Inserir dados iniciais dos cursos
INSERT INTO public.courses (title, description, price, original_price, duration, students, rating, level, featured) VALUES
('Faturamento Médico Completo', 'Domine todas as técnicas de faturamento médico, desde conceitos básicos até estratégias avançadas para maximizar receitas.', 497.00, 697.00, '40 horas', 1250, 4.9, 'Intermediário', true),
('Administração Hospitalar', 'Aprenda a gerenciar hospitais e clínicas com eficiência, otimizando processos e reduzindo custos operacionais.', 397.00, 597.00, '30 horas', 890, 4.8, 'Avançado', false),
('Gestão da Qualidade em Saúde', 'Implemente sistemas de qualidade em serviços de saúde seguindo normas nacionais e internacionais.', 297.00, 447.00, '25 horas', 650, 4.7, 'Básico', false),
('Auditoria Médica Prática', 'Torne-se um auditor médico qualificado com técnicas práticas e conhecimento regulatório atualizado.', 597.00, 797.00, '50 horas', 420, 4.9, 'Avançado', true),
('Regulamentação SUS', 'Entenda completamente o Sistema Único de Saúde, suas normas, processos e oportunidades profissionais.', 197.00, 297.00, '20 horas', 980, 4.6, 'Básico', false),
('Gestão Financeira na Saúde', 'Domine o controle financeiro de instituições de saúde com planilhas, indicadores e relatórios gerenciais.', 347.00, 497.00, '35 horas', 720, 4.8, 'Intermediário', false);

-- Inserir dados iniciais dos eBooks
INSERT INTO public.ebooks (title, description, price, original_price, pages, downloads, rating, category, bestseller) VALUES
('Guia Completo de Faturamento SUS', 'Manual prático com todos os procedimentos, códigos e estratégias para maximizar o faturamento no Sistema Único de Saúde.', 97.00, 147.00, 180, 2100, 4.9, 'Faturamento', true),
('Administração Hospitalar na Prática', 'eBook essencial com cases reais, planilhas e ferramentas para gestão eficiente de hospitais e clínicas.', 67.00, 97.00, 120, 1850, 4.8, 'Gestão', false),
('Auditoria Médica: Passo a Passo', 'Metodologia completa para realização de auditorias médicas com checklists, formulários e modelos prontos.', 127.00, 197.00, 250, 950, 4.9, 'Auditoria', true),
('Indicadores de Qualidade em Saúde', 'Coletânea de indicadores essenciais para monitoramento da qualidade em serviços de saúde com exemplos práticos.', 87.00, 127.00, 160, 1200, 4.7, 'Qualidade', false),
('Gestão Financeira para Clínicas', 'Planilhas, demonstrativos e ferramentas financeiras específicas para gestão econômica de clínicas médicas.', 77.00, 117.00, 95, 1680, 4.6, 'Financeiro', false),
('Regulamentação ANS Atualizada', 'Guia atualizado com todas as normas da ANS, procedimentos de compliance e adequação regulatória.', 107.00, 157.00, 200, 780, 4.8, 'Regulatório', false);

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================

-- Para criar um usuário admin, execute após criar o usuário via frontend:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@medcursos.com'; 