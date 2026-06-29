import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://gabyteyblfmddvamhcow.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhYnl0ZXlibGZtZGR2YW1oY293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzAzOTcsImV4cCI6MjA2NzMwNjM5N30.l6aoUXwGK4DC4HBcrmCgDtYdB67q2ztEwTcF0WwT3vc";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...');
  
  try {
    // Teste 1: Conexão básica
    console.log('\n1️⃣ Testando conexão básica...');
    const { data, error } = await supabase.from('courses').select('count').limit(1);
    
    if (error) {
      console.error('❌ Erro na conexão:', error.message);
      return;
    }
    
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Teste 2: Verificar tabelas
    console.log('\n2️⃣ Verificando tabelas disponíveis...');
    
    const tables = ['courses', 'ebooks', 'contacts', 'profiles', 'site_settings', 'site_stats'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('count').limit(1);
        if (error) {
          console.log(`❌ Tabela ${table}: ${error.message}`);
        } else {
          console.log(`✅ Tabela ${table}: Acessível`);
        }
      } catch (err) {
        console.log(`❌ Tabela ${table}: ${err.message}`);
      }
    }
    
    // Teste 3: Contar registros
    console.log('\n3️⃣ Contando registros...');
    
    const { count: coursesCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
    const { count: ebooksCount } = await supabase.from('ebooks').select('*', { count: 'exact', head: true });
    const { count: contactsCount } = await supabase.from('contacts').select('*', { count: 'exact', head: true });
    
    console.log(`📊 Cursos: ${coursesCount || 0}`);
    console.log(`📊 eBooks: ${ebooksCount || 0}`);
    console.log(`📊 Contatos: ${contactsCount || 0}`);
    
    console.log('\n🎉 Teste de conexão concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

testConnection(); 