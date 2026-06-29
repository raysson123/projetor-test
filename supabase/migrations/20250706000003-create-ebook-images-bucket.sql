-- Criar bucket para imagens de eBooks
-- Data: 2025-07-06

-- Criar o bucket ebook-images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ebook-images',
  'ebook-images',
  true,
  5242880, -- 5MB em bytes
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Política para permitir upload de imagens (apenas admins)
CREATE POLICY "Admins can upload ebook images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'ebook-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Política para permitir visualização pública das imagens
CREATE POLICY "Anyone can view ebook images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'ebook-images');

-- Política para permitir atualização de imagens (apenas admins)
CREATE POLICY "Admins can update ebook images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'ebook-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Política para permitir exclusão de imagens (apenas admins)
CREATE POLICY "Admins can delete ebook images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'ebook-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  ); 