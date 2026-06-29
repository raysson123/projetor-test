-- Corrigir políticas do bucket ebook-images
-- Data: 2025-07-06

-- Remover políticas problemáticas
DROP POLICY IF EXISTS "Admins can upload ebook images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update ebook images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete ebook images" ON storage.objects;

-- Criar políticas mais simples e eficientes
CREATE POLICY "Enable upload for authenticated users"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'ebook-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Enable update for authenticated users"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'ebook-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Enable delete for authenticated users"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'ebook-images' AND
    auth.role() = 'authenticated'
  );

-- Manter a política de visualização pública
-- (já deve existir, mas vamos garantir)
CREATE POLICY "Anyone can view ebook images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'ebook-images'); 