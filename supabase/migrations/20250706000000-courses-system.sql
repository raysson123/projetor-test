-- =====================================================
-- MIGRAÇÃO: SISTEMA COMPLETO DE CURSOS
-- =====================================================

-- 1. Criar tabela de categorias de cursos
CREATE TABLE public.course_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT DEFAULT 'book',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Adicionar coluna category_id na tabela courses
ALTER TABLE public.courses 
ADD COLUMN category_id UUID REFERENCES public.course_categories(id) ON DELETE SET NULL;

-- 3. Criar tabela de aulas dos cursos
CREATE TABLE public.course_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_free BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Criar tabela de matrículas dos alunos
CREATE TABLE public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- 5. Criar tabela de progresso das aulas
CREATE TABLE public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  watched_seconds INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- 6. Criar tabela de avaliações dos cursos
CREATE TABLE public.course_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- 7. Criar tabela de certificados
CREATE TABLE public.course_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  certificate_url TEXT,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- =====================================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_certificates ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS DE SEGURANÇA
-- =====================================================

-- Políticas para course_categories (leitura pública, escrita apenas admin)
CREATE POLICY "Anyone can view course categories" 
  ON public.course_categories 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage course categories" 
  ON public.course_categories 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para course_lessons (leitura pública, escrita apenas admin)
CREATE POLICY "Anyone can view course lessons" 
  ON public.course_lessons 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage course lessons" 
  ON public.course_lessons 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para course_enrollments
CREATE POLICY "Users can view own enrollments" 
  ON public.course_enrollments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own enrollments" 
  ON public.course_enrollments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments" 
  ON public.course_enrollments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all enrollments" 
  ON public.course_enrollments 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para lesson_progress
CREATE POLICY "Users can view own lesson progress" 
  ON public.lesson_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress" 
  ON public.lesson_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress" 
  ON public.lesson_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all lesson progress" 
  ON public.lesson_progress 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para course_reviews
CREATE POLICY "Anyone can view course reviews" 
  ON public.course_reviews 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert own reviews" 
  ON public.course_reviews 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" 
  ON public.course_reviews 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" 
  ON public.course_reviews 
  FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews" 
  ON public.course_reviews 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para course_certificates
CREATE POLICY "Users can view own certificates" 
  ON public.course_certificates 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all certificates" 
  ON public.course_certificates 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar progresso do curso automaticamente
CREATE OR REPLACE FUNCTION public.update_course_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  progress_percentage DECIMAL(5,2);
BEGIN
  -- Contar total de aulas do curso
  SELECT COUNT(*) INTO total_lessons
  FROM public.course_lessons
  WHERE course_id = (
    SELECT course_id FROM public.course_lessons WHERE id = NEW.lesson_id
  );
  
  -- Contar aulas completadas pelo usuário
  SELECT COUNT(*) INTO completed_lessons
  FROM public.lesson_progress lp
  JOIN public.course_lessons cl ON lp.lesson_id = cl.id
  WHERE lp.user_id = NEW.user_id 
    AND cl.course_id = (
      SELECT course_id FROM public.course_lessons WHERE id = NEW.lesson_id
    )
    AND lp.is_completed = true;
  
  -- Calcular porcentagem de progresso
  IF total_lessons > 0 THEN
    progress_percentage := (completed_lessons::DECIMAL / total_lessons::DECIMAL) * 100;
  ELSE
    progress_percentage := 0;
  END IF;
  
  -- Atualizar progresso na matrícula
  UPDATE public.course_enrollments
  SET progress_percentage = progress_percentage,
      completed_at = CASE 
        WHEN progress_percentage = 100 THEN now()
        ELSE completed_at
      END
  WHERE user_id = NEW.user_id 
    AND course_id = (
      SELECT course_id FROM public.course_lessons WHERE id = NEW.lesson_id
    );
  
  RETURN NEW;
END;
$$;

-- Trigger para atualizar progresso quando aula é completada
CREATE TRIGGER on_lesson_progress_update
  AFTER UPDATE ON public.lesson_progress
  FOR EACH ROW
  WHEN (OLD.is_completed = false AND NEW.is_completed = true)
  EXECUTE FUNCTION public.update_course_progress();

-- Função para atualizar rating médio do curso
CREATE OR REPLACE FUNCTION public.update_course_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  avg_rating DECIMAL(2,1);
BEGIN
  -- Calcular rating médio
  SELECT AVG(rating) INTO avg_rating
  FROM public.course_reviews
  WHERE course_id = COALESCE(NEW.course_id, OLD.course_id);
  
  -- Atualizar rating do curso
  UPDATE public.courses
  SET rating = COALESCE(avg_rating, 0)
  WHERE id = COALESCE(NEW.course_id, OLD.course_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger para atualizar rating quando review é inserido/atualizado/deletado
CREATE TRIGGER on_course_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.course_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_course_rating();

-- Função para atualizar número de alunos do curso
CREATE OR REPLACE FUNCTION public.update_course_students()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  student_count INTEGER;
BEGIN
  -- Contar alunos matriculados
  SELECT COUNT(*) INTO student_count
  FROM public.course_enrollments
  WHERE course_id = COALESCE(NEW.course_id, OLD.course_id);
  
  -- Atualizar número de alunos
  UPDATE public.courses
  SET students = student_count
  WHERE id = COALESCE(NEW.course_id, OLD.course_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger para atualizar número de alunos quando matrícula é inserida/deletada
CREATE TRIGGER on_course_enrollment_change
  AFTER INSERT OR DELETE ON public.course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_course_students();

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Inserir categorias padrão
INSERT INTO public.course_categories (name, description, color, icon) VALUES
('Medicina', 'Cursos relacionados à medicina e saúde', '#EF4444', 'heart'),
('Enfermagem', 'Cursos de enfermagem e cuidados', '#F59E0B', 'stethoscope'),
('Fisioterapia', 'Cursos de fisioterapia e reabilitação', '#10B981', 'activity'),
('Nutrição', 'Cursos de nutrição e alimentação', '#8B5CF6', 'apple'),
('Psicologia', 'Cursos de psicologia e saúde mental', '#EC4899', 'brain'),
('Administração', 'Cursos de administração em saúde', '#06B6D4', 'briefcase');

-- Inserir cursos de exemplo
INSERT INTO public.courses (title, description, price, original_price, duration, level, featured, category_id) VALUES
('Primeiros Socorros Básicos', 'Aprenda técnicas essenciais de primeiros socorros para emergências médicas', 99.90, 149.90, '8 horas', 'Iniciante', true, (SELECT id FROM public.course_categories WHERE name = 'Medicina')),
('Anatomia Humana', 'Curso completo de anatomia humana com visualizações 3D', 199.90, 299.90, '20 horas', 'Intermediário', true, (SELECT id FROM public.course_categories WHERE name = 'Medicina')),
('Cuidados de Enfermagem', 'Fundamentos essenciais para profissionais de enfermagem', 149.90, 199.90, '15 horas', 'Iniciante', false, (SELECT id FROM public.course_categories WHERE name = 'Enfermagem')),
('Fisioterapia Esportiva', 'Técnicas avançadas de fisioterapia para atletas', 179.90, 249.90, '18 horas', 'Avançado', false, (SELECT id FROM public.course_categories WHERE name = 'Fisioterapia')),
('Nutrição Clínica', 'Nutrição aplicada ao tratamento de doenças', 129.90, 179.90, '12 horas', 'Intermediário', false, (SELECT id FROM public.course_categories WHERE name = 'Nutrição'));

-- Inserir aulas de exemplo para o primeiro curso
INSERT INTO public.course_lessons (course_id, title, description, duration_minutes, order_index, is_free) VALUES
((SELECT id FROM public.courses WHERE title = 'Primeiros Socorros Básicos'), 'Introdução aos Primeiros Socorros', 'Conceitos básicos e importância dos primeiros socorros', 45, 1, true),
((SELECT id FROM public.courses WHERE title = 'Primeiros Socorros Básicos'), 'Avaliação da Vítima', 'Como avaliar o estado de uma vítima de emergência', 60, 2, false),
((SELECT id FROM public.courses WHERE title = 'Primeiros Socorros Básicos'), 'Reanimação Cardiopulmonar', 'Técnicas de RCP para adultos e crianças', 90, 3, false),
((SELECT id FROM public.courses WHERE title = 'Primeiros Socorros Básicos'), 'Tratamento de Ferimentos', 'Como tratar diferentes tipos de ferimentos', 75, 4, false),
((SELECT id FROM public.courses WHERE title = 'Primeiros Socorros Básicos'), 'Emergências Cardíacas', 'Identificação e tratamento de emergências cardíacas', 60, 5, false);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX idx_courses_category ON public.courses(category_id);
CREATE INDEX idx_courses_featured ON public.courses(featured);
CREATE INDEX idx_lessons_course ON public.course_lessons(course_id);
CREATE INDEX idx_lessons_order ON public.course_lessons(course_id, order_index);
CREATE INDEX idx_enrollments_user ON public.course_enrollments(user_id);
CREATE INDEX idx_enrollments_course ON public.course_enrollments(course_id);
CREATE INDEX idx_progress_user ON public.lesson_progress(user_id);
CREATE INDEX idx_progress_lesson ON public.lesson_progress(lesson_id);
CREATE INDEX idx_reviews_course ON public.course_reviews(course_id);
CREATE INDEX idx_reviews_user ON public.course_reviews(user_id); 