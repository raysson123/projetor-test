
-- Criar tabela para cursos
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

-- Criar tabela para eBooks
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

-- Criar tabela para contatos
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

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
