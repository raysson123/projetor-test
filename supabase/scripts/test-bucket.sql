-- Teste do bucket ebook-images
-- Execute este SQL no Supabase SQL Editor

-- 1. Verificar se o bucket existe
SELECT * FROM storage.buckets WHERE name = 'ebook-images';

-- 2. Verificar políticas do bucket
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%ebook%';

-- 3. Verificar se há arquivos no bucket
SELECT * FROM storage.objects WHERE bucket_id = 'ebook-images';

-- 4. Testar inserção de um arquivo de teste (se necessário)
-- INSERT INTO storage.objects (bucket_id, name, owner, metadata)
-- VALUES ('ebook-images', 'test.txt', auth.uid(), '{"size": 0, "mimetype": "text/plain"}');

-- 5. Verificar configurações do bucket
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE name = 'ebook-images'; 