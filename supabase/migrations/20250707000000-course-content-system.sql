-- Sistema de Conteúdo para Cursos e eBooks
-- Migration: 20250707000000-course-content-system.sql

-- ========================================
-- TABELAS PARA CURSOS
-- ========================================

-- Módulos dos cursos
CREATE TABLE public.course_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Aulas dentro dos módulos
CREATE TABLE public.course_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  pdf_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_free BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Progresso do aluno nas aulas
CREATE TABLE public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  watched_time_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Exercícios/Quiz das aulas
CREATE TABLE public.lesson_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array de opções
  correct_answer INTEGER NOT NULL, -- Índice da resposta correta
  explanation TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Respostas dos alunos nos exercícios
CREATE TABLE public.exercise_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.lesson_exercises(id) ON DELETE CASCADE,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, exercise_id)
);

-- ========================================
-- TABELAS PARA EBOOKS
-- ========================================

-- Capítulos dos eBooks
CREATE TABLE public.ebook_chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ebook_id UUID NOT NULL REFERENCES public.ebooks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT, -- Conteúdo em texto (opcional)
  page_start INTEGER,
  page_end INTEGER,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Progresso de leitura dos eBooks
CREATE TABLE public.ebook_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ebook_id UUID NOT NULL REFERENCES public.ebooks(id) ON DELETE CASCADE,
  current_page INTEGER DEFAULT 1,
  total_pages_read INTEGER DEFAULT 0,
  bookmarks JSONB DEFAULT '[]', -- Array de páginas marcadas
  notes JSONB DEFAULT '[]', -- Array de anotações
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, ebook_id)
);

-- ========================================
-- ÍNDICES PARA PERFORMANCE
-- ========================================

CREATE INDEX idx_course_modules_course_id ON public.course_modules(course_id);
CREATE INDEX idx_course_modules_order ON public.course_modules(course_id, order_index);
CREATE INDEX idx_course_lessons_module_id ON public.course_lessons(module_id);
CREATE INDEX idx_course_lessons_order ON public.course_lessons(module_id, order_index);
CREATE INDEX idx_lesson_progress_user_lesson ON public.lesson_progress(user_id, lesson_id);
CREATE INDEX idx_lesson_progress_user ON public.lesson_progress(user_id);
CREATE INDEX idx_lesson_exercises_lesson_id ON public.lesson_exercises(lesson_id);
CREATE INDEX idx_exercise_answers_user_exercise ON public.exercise_answers(user_id, exercise_id);
CREATE INDEX idx_ebook_chapters_ebook_id ON public.ebook_chapters(ebook_id);
CREATE INDEX idx_ebook_chapters_order ON public.ebook_chapters(ebook_id, order_index);
CREATE INDEX idx_ebook_progress_user_ebook ON public.ebook_progress(user_id, ebook_id);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebook_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebook_progress ENABLE ROW LEVEL SECURITY;

-- Políticas para course_modules (leitura pública, escrita apenas admin)
CREATE POLICY "Anyone can view course modules" ON public.course_modules FOR SELECT USING (true);
CREATE POLICY "Only admins can insert course modules" ON public.course_modules FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can update course modules" ON public.course_modules FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can delete course modules" ON public.course_modules FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Políticas para course_lessons (leitura pública, escrita apenas admin)
CREATE POLICY "Anyone can view course lessons" ON public.course_lessons FOR SELECT USING (true);
CREATE POLICY "Only admins can insert course lessons" ON public.course_lessons FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can update course lessons" ON public.course_lessons FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can delete course lessons" ON public.course_lessons FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Políticas para lesson_progress (usuário só vê/edita seu próprio progresso)
CREATE POLICY "Users can view their own lesson progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own lesson progress" ON public.lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own lesson progress" ON public.lesson_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own lesson progress" ON public.lesson_progress FOR DELETE USING (auth.uid() = user_id);

-- Políticas para lesson_exercises (leitura pública, escrita apenas admin)
CREATE POLICY "Anyone can view lesson exercises" ON public.lesson_exercises FOR SELECT USING (true);
CREATE POLICY "Only admins can insert lesson exercises" ON public.lesson_exercises FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can update lesson exercises" ON public.lesson_exercises FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can delete lesson exercises" ON public.lesson_exercises FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Políticas para exercise_answers (usuário só vê/edita suas próprias respostas)
CREATE POLICY "Users can view their own exercise answers" ON public.exercise_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own exercise answers" ON public.exercise_answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own exercise answers" ON public.exercise_answers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own exercise answers" ON public.exercise_answers FOR DELETE USING (auth.uid() = user_id);

-- Políticas para ebook_chapters (leitura pública, escrita apenas admin)
CREATE POLICY "Anyone can view ebook chapters" ON public.ebook_chapters FOR SELECT USING (true);
CREATE POLICY "Only admins can insert ebook chapters" ON public.ebook_chapters FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can update ebook chapters" ON public.ebook_chapters FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Only admins can delete ebook chapters" ON public.ebook_chapters FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Políticas para ebook_progress (usuário só vê/edita seu próprio progresso)
CREATE POLICY "Users can view their own ebook progress" ON public.ebook_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own ebook progress" ON public.ebook_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own ebook progress" ON public.ebook_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own ebook progress" ON public.ebook_progress FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- FUNÇÕES ÚTEIS
-- ========================================

-- Função para calcular progresso do curso
CREATE OR REPLACE FUNCTION get_course_progress(course_uuid UUID, user_uuid UUID)
RETURNS TABLE(
  total_lessons INTEGER,
  completed_lessons INTEGER,
  progress_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(l.id)::INTEGER as total_lessons,
    COUNT(lp.id)::INTEGER as completed_lessons,
    CASE 
      WHEN COUNT(l.id) > 0 THEN 
        ROUND((COUNT(lp.id)::NUMERIC / COUNT(l.id)::NUMERIC) * 100, 2)
      ELSE 0 
    END as progress_percentage
  FROM public.courses c
  JOIN public.course_modules cm ON c.id = cm.course_id
  JOIN public.course_lessons l ON cm.id = l.module_id
  LEFT JOIN public.lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = user_uuid AND lp.completed = true
  WHERE c.id = course_uuid
  GROUP BY c.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para calcular progresso do eBook
CREATE OR REPLACE FUNCTION get_ebook_progress(ebook_uuid UUID, user_uuid UUID)
RETURNS TABLE(
  total_pages INTEGER,
  pages_read INTEGER,
  progress_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.pages::INTEGER as total_pages,
    COALESCE(ep.total_pages_read, 0)::INTEGER as pages_read,
    CASE 
      WHEN e.pages > 0 THEN 
        ROUND((COALESCE(ep.total_pages_read, 0)::NUMERIC / e.pages::NUMERIC) * 100, 2)
      ELSE 0 
    END as progress_percentage
  FROM public.ebooks e
  LEFT JOIN public.ebook_progress ep ON e.id = ep.ebook_id AND ep.user_id = user_uuid
  WHERE e.id = ebook_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 