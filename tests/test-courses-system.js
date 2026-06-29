import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://gabyteyblfmddvamhcow.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhYnl0ZXlibGZtZGR2YW1oY293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzAzOTcsImV4cCI6MjA2NzMwNjM5N30.l6aoUXwGK4DC4HBcrmCgDtYdB67q2ztEwTcF0WwT3vc";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testCoursesSystem() {
  console.log('🧪 Testando Sistema de Cursos');
  console.log('================================');
  
  try {
    // 1. Testar categorias
    console.log('\n📂 Testando categorias...');
    const { data: categories, error: categoriesError } = await supabase
      .from('course_categories')
      .select('*')
      .order('name');
    
    if (categoriesError) {
      console.log('❌ Erro ao buscar categorias:', categoriesError.message);
    } else {
      console.log(`✅ ${categories.length} categorias encontradas:`);
      categories.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.color})`);
      });
    }

    // 2. Testar cursos
    console.log('\n📚 Testando cursos...');
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select(`
        *,
        course_categories(name, color)
      `)
      .order('featured', { ascending: false });
    
    if (coursesError) {
      console.log('❌ Erro ao buscar cursos:', coursesError.message);
    } else {
      console.log(`✅ ${courses.length} cursos encontrados:`);
      courses.forEach(course => {
        console.log(`   - ${course.title} (R$ ${course.price}) - ${course.course_categories?.name || 'Sem categoria'}`);
      });
    }

    // 3. Testar aulas
    console.log('\n🎥 Testando aulas...');
    const { data: lessons, error: lessonsError } = await supabase
      .from('course_lessons')
      .select(`
        *,
        courses(title)
      `)
      .order('order_index');
    
    if (lessonsError) {
      console.log('❌ Erro ao buscar aulas:', lessonsError.message);
    } else {
      console.log(`✅ ${lessons.length} aulas encontradas:`);
      lessons.forEach(lesson => {
        console.log(`   - ${lesson.title} (${lesson.courses.title}) - ${lesson.duration_minutes}min`);
      });
    }

    // 4. Testar estrutura das tabelas
    console.log('\n🔍 Verificando estrutura das tabelas...');
    
    const tables = [
      'course_categories',
      'course_lessons', 
      'course_enrollments',
      'lesson_progress',
      'course_reviews',
      'course_certificates'
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Erro na tabela ${table}:`, error.message);
      } else {
        console.log(`✅ Tabela ${table} está funcionando`);
      }
    }

    console.log('\n🎉 Sistema de cursos testado com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Execute o SQL no Supabase Dashboard');
    console.log('2. Teste as funcionalidades no frontend');
    console.log('3. Implemente o CRUD de cursos');
    console.log('4. Adicione sistema de upload de vídeos');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testCoursesSystem(); 