-- Correção simples das políticas de segurança para courses
-- Permitir que admins insiram, atualizem e deletem cursos

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Admins can insert courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can update courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can delete courses" ON public.courses;

-- Criar políticas para admins gerenciarem cursos
CREATE POLICY "Admins can insert courses" 
  ON public.courses 
  FOR INSERT 
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update courses" 
  ON public.courses 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete courses" 
  ON public.courses 
  FOR DELETE 
  USING (public.is_admin(auth.uid())); 