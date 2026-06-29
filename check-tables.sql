-- Script para verificar tabelas existentes
-- Execute este script no Supabase SQL Editor

-- Verificar todas as tabelas do schema public
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar especificamente as tabelas do sistema de conteúdo
SELECT 
    table_name,
    CASE 
        WHEN table_name IN (
            'course_modules',
            'course_lessons', 
            'lesson_progress',
            'lesson_exercises',
            'exercise_answers',
            'ebook_chapters',
            'ebook_progress'
        ) THEN 'SISTEMA DE CONTEÚDO'
        ELSE 'OUTRAS'
    END as categoria
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN (
        'course_modules',
        'course_lessons', 
        'lesson_progress',
        'lesson_exercises',
        'exercise_answers',
        'ebook_chapters',
        'ebook_progress'
    )
ORDER BY table_name;

-- Verificar se as tabelas têm dados
SELECT 
    'course_modules' as tabela,
    COUNT(*) as registros
FROM public.course_modules
UNION ALL
SELECT 
    'course_lessons' as tabela,
    COUNT(*) as registros
FROM public.course_lessons
UNION ALL
SELECT 
    'lesson_progress' as tabela,
    COUNT(*) as registros
FROM public.lesson_progress
UNION ALL
SELECT 
    'lesson_exercises' as tabela,
    COUNT(*) as registros
FROM public.lesson_exercises
UNION ALL
SELECT 
    'exercise_answers' as tabela,
    COUNT(*) as registros
FROM public.exercise_answers
UNION ALL
SELECT 
    'ebook_chapters' as tabela,
    COUNT(*) as registros
FROM public.ebook_chapters
UNION ALL
SELECT 
    'ebook_progress' as tabela,
    COUNT(*) as registros
FROM public.ebook_progress; 