-- =====================================================
-- CONFIGURAÇÃO DO STORAGE PARA IMAGENS DOS CURSOS
-- =====================================================

-- 1. Criar bucket para imagens dos cursos
INSERT INTO storage.buckets (id, name, public) VALUES 
('course-images', 'course-images', true);

-- 2. Política para permitir upload de imagens (apenas admins)
CREATE POLICY "Admins can upload course images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'course-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 3. Política para permitir visualização pública das imagens
CREATE POLICY "Anyone can view course images" ON storage.objects
FOR SELECT USING (bucket_id = 'course-images');

-- 4. Política para permitir atualização de imagens (apenas admins)
CREATE POLICY "Admins can update course images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'course-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 5. Política para permitir exclusão de imagens (apenas admins)
CREATE POLICY "Admins can delete course images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'course-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 6. Configurar CORS para o bucket (opcional - para upload direto do frontend)
-- Esta configuração permite upload direto do navegador
-- Você pode configurar isso no dashboard do Supabase se necessário 