import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://gabyteyblfmddvamhcow.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhYnl0ZXlibGZtZGR2YW1oY293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzAzOTcsImV4cCI6MjA2NzMwNjM5N30.l6aoUXwGK4DC4HBcrmCgDtYdB67q2ztEwTcF0WwT3vc";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testMigration() {
  console.log('🔍 Testando migração do banco de dados...');
  
  const tables = [
    'profiles',
    'courses', 
    'ebooks',
    'contacts',
    'site_settings',
    'site_stats'
  ];
  
  console.log('\n📋 Verificando tabelas:');
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('count').limit(1);
      
      if (error) {
        console.log(`❌ Tabela ${table}: ${error.message}`);
      } else {
        console.log(`✅ Tabela ${table}: Criada com sucesso`);
      }
    } catch (err) {
      console.log(`❌ Tabela ${table}: ${err.message}`);
    }
  }
  
  console.log('\n📊 Verificando dados iniciais:');
  
  try {
    // Verificar cursos
    const { count: coursesCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
    console.log(`📚 Cursos: ${coursesCount || 0} registros`);
    
    // Verificar eBooks
    const { count: ebooksCount } = await supabase.from('ebooks').select('*', { count: 'exact', head: true });
    console.log(`📖 eBooks: ${ebooksCount || 0} registros`);
    
    // Verificar configurações
    const { count: settingsCount } = await supabase.from('site_settings').select('*', { count: 'exact', head: true });
    console.log(`⚙️  Configurações: ${settingsCount || 0} registros`);
    
    // Verificar estatísticas
    const { data: stats } = await supabase.from('site_stats').select('*').single();
    if (stats) {
      console.log(`📈 Estatísticas: ${stats.total_courses} cursos, ${stats.total_ebooks} eBooks`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar dados:', error.message);
  }
  
  console.log('\n🎯 Próximos passos:');
  console.log('1. Execute a migração no SQL Editor do Supabase');
  console.log('2. Teste o registro de usuários');
  console.log('3. Crie um usuário admin');
  
  console.log('\n🔗 Dashboard: https://supabase.com/dashboard/project/gabyteyblfmddvamhcow');
}

testMigration(); 