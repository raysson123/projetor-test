import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://gabyteyblfmddvamhcow.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhYnl0ZXlibGZtZGR2YW1oY293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzAzOTcsImV4cCI6MjA2NzMwNjM5N30.l6aoUXwGK4DC4HBcrmCgDtYdB67q2ztEwTcF0WwT3vc";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function setupDatabase() {
  console.log('🚀 Configurando banco de dados...');
  
  try {
    // Testar conexão básica
    console.log('\n1️⃣ Testando conexão...');
    const { data, error } = await supabase.from('courses').select('count').limit(1);
    
    if (!error) {
      console.log('✅ Tabelas já existem!');
      await showData();
      return;
    }
    
    console.log('📝 Tabelas não existem. Criando estrutura...');
    
    // Como não podemos executar DDL via cliente público, vou apenas testar a conexão
    // e mostrar que precisamos executar as migrações via Supabase CLI ou dashboard
    
    console.log('\n⚠️  Para criar as tabelas, você precisa:');
    console.log('1. Acessar o dashboard do Supabase');
    console.log('2. Ir para SQL Editor');
    console.log('3. Executar as migrações manualmente');
    console.log('\n📁 Arquivos de migração em: supabase/migrations/');
    
    console.log('\n🔗 Dashboard: https://supabase.com/dashboard/project/gabyteyblfmddvamhcow');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

async function showData() {
  try {
    console.log('\n📊 Dados atuais:');
    
    const { count: coursesCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
    const { count: ebooksCount } = await supabase.from('ebooks').select('*', { count: 'exact', head: true });
    const { count: contactsCount } = await supabase.from('contacts').select('*', { count: 'exact', head: true });
    
    console.log(`📚 Cursos: ${coursesCount || 0}`);
    console.log(`📖 eBooks: ${ebooksCount || 0}`);
    console.log(`📧 Contatos: ${contactsCount || 0}`);
    
    if (coursesCount > 0) {
      console.log('\n📋 Últimos cursos:');
      const { data: courses } = await supabase.from('courses').select('title, price').limit(3);
      courses?.forEach(course => {
        console.log(`  - ${course.title} (R$ ${course.price})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao carregar dados:', error.message);
  }
}

setupDatabase(); 