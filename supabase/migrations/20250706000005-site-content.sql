-- =====================================================
-- MIGRAÇÃO: TABELA DE CONTEÚDO DO SITE
-- =====================================================

-- 1. Criar tabela de conteúdo do site
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  type TEXT DEFAULT 'text', -- text, json, url
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(section, key)
);

-- =====================================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS DE SEGURANÇA
-- =====================================================

-- Políticas para site_content (leitura pública, escrita apenas admin)
CREATE POLICY "Anyone can view site content" 
  ON public.site_content 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admin can insert site content" 
  ON public.site_content 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can update site content" 
  ON public.site_content 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can delete site content" 
  ON public.site_content 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- DADOS PADRÃO DO FOOTER (RODAPE)
-- =====================================================

INSERT INTO public.site_content (section, key, value, type) VALUES
-- Informações de contato
('rodape', 'descricao', 'Especialista em Gestão de Saúde com foco em educação continuada de profissionais da área médica.', 'text'),
('rodape', 'telefone', '(11) 98765-4321', 'text'),
('rodape', 'email', 'contato@denismarques.com', 'text'),
('rodape', 'endereco', 'São Paulo, SP - Brasil', 'text'),

-- Newsletter
('rodape', 'newsletter_botao', 'Inscrever-se', 'text'),
('rodape', 'newsletter_botao_link', 'https://api.whatsapp.com/send?phone=5511987654321', 'url'),
('rodape', 'newsletter_botao_sessao', '', 'text'),

-- Botão de aluno
('rodape', 'aluno_botao', 'Área do Aluno', 'text'),
('rodape', 'aluno_botao_link', '/dashboard', 'url'),
('rodape', 'aluno_botao_sessao', '', 'text'),

-- Botão WhatsApp
('rodape', 'whatsapp_botao', 'Suporte WhatsApp', 'text'),
('rodape', 'whatsapp_botao_link', 'https://api.whatsapp.com/send?phone=5511987654321', 'url'),
('rodape', 'whatsapp_botao_sessao', '', 'text'),

-- Botão de ajuda
('rodape', 'ajuda_botao', 'Central de Ajuda', 'text'),
('rodape', 'ajuda_botao_link', '/contato', 'url'),
('rodape', 'ajuda_botao_sessao', '', 'text'),

-- Copyright
('rodape', 'copyright', '© 2025 Denis Marques. Todos os direitos reservados.', 'text'),

-- Links rápidos (JSON array)
('rodape', 'links_rapidos', '[{"titulo": "Início", "href": "#inicio"}, {"titulo": "Cursos", "href": "#cursos"}, {"titulo": "eBooks", "href": "#ebooks"}, {"titulo": "Sobre", "href": "#sobre"}]', 'json'),

-- Links legais (JSON array)
('rodape', 'links_legais', '[{"titulo": "Política de Privacidade", "href": "/privacidade"}, {"titulo": "Termos de Uso", "href": "/termos"}, {"titulo": "Política de Reembolso", "href": "/reembolso"}]', 'json'),

-- Estatísticas do rodapé (JSON array)
('rodape', 'rodape_stats', '[{"titulo": "Alunos Satisfeitos", "valor": "2500+"}, {"titulo": "Cursos Disponíveis", "valor": "15+"}, {"titulo": "Certificados Emitidos", "valor": "8000+"}]', 'json');
