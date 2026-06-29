
-- Primeiro, vamos remover as políticas problemáticas existentes
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Criar uma função auxiliar para verificar se o usuário é admin sem causar recursão
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- Recriar as políticas usando a função auxiliar
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

-- Corrigir também as políticas das outras tabelas que podem ter o mesmo problema
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can view site stats" ON public.site_stats;
DROP POLICY IF EXISTS "Admins can update site stats" ON public.site_stats;

CREATE POLICY "Admins can manage site settings" 
  ON public.site_settings 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view site stats" 
  ON public.site_stats 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update site stats" 
  ON public.site_stats 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));
