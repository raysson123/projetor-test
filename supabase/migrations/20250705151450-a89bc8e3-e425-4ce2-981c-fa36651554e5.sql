
-- Criar tabela para configurações do site
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir configurações iniciais
INSERT INTO public.site_settings (key, value, description) VALUES
('site_name', 'MedCursos', 'Nome do site'),
('site_description', 'Especialista em Saúde', 'Descrição do site'),
('contact_email', 'contato@medcursos.com', 'Email de contato'),
('contact_phone', '(11) 99999-9999', 'Telefone de contato'),
('maintenance_mode', 'false', 'Modo de manutenção'),
('registration_enabled', 'true', 'Permitir novos registros');

-- Criar tabela para estatísticas do site
CREATE TABLE public.site_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_users INTEGER DEFAULT 0,
  total_courses INTEGER DEFAULT 0,
  total_ebooks INTEGER DEFAULT 0,
  total_contacts INTEGER DEFAULT 0,
  total_revenue NUMERIC DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir registro inicial de estatísticas
INSERT INTO public.site_stats (total_users, total_courses, total_ebooks, total_contacts, total_revenue) 
VALUES (0, 0, 0, 0, 0);

-- Políticas RLS para site_settings (apenas admins)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage site settings" 
  ON public.site_settings 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Políticas RLS para site_stats (apenas admins)
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view site stats" 
  ON public.site_stats 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can update site stats" 
  ON public.site_stats 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

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
