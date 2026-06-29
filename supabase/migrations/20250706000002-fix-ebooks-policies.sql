-- Adicionar políticas de CRUD para admins na tabela ebooks
-- Data: 2025-07-06

-- Política para admins inserirem eBooks
CREATE POLICY "Admins can insert ebooks"
  ON public.ebooks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Política para admins atualizarem eBooks
CREATE POLICY "Admins can update ebooks"
  ON public.ebooks
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Política para admins deletarem eBooks
CREATE POLICY "Admins can delete ebooks"
  ON public.ebooks
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  ); 