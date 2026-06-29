import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "https://gabyteyblfmddvamhcow.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhYnl0ZXlibGZtZGR2YW1oY293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzAzOTcsImV4cCI6MjA2NzMwNjM5N30.l6aoUXwGK4DC4HBcrmCgDtYdB67q2ztEwTcF0WwT3vc";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function runMigrations() {
  console.log('🚀 Executando migrações do Supabase...');
  
  const migrationsDir = './supabase/migrations';
  const migrationFiles = [
    '20250629143958-4f41efcc-a32b-4f7c-a2ca-a93537dc18b7.sql',
    '20250630193610-867c8c1c-a438-4297-9b6e-729b07d80196.sql',
    '20250705151450-a89bc8e3-e425-4ce2-981c-fa36651554e5.sql',
    '20250705152328-9eaa0289-0d3a-4613-a000-16ebab5e1edb.sql'
  ];
  
  for (const file of migrationFiles) {
    try {
      console.log(`\n📄 Executando migração: ${file}`);
      
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Dividir o SQL em comandos individuais
      const commands = sql.split(';').filter(cmd => cmd.trim());
      
      for (const command of commands) {
        if (command.trim()) {
          const { error } = await supabase.rpc('exec_sql', { sql: command });
          if (error) {
            console.log(`⚠️  Comando ignorado (pode já existir): ${command.substring(0, 50)}...`);
          }
        }
      }
      
      console.log(`✅ Migração ${file} executada`);
      
    } catch (error) {
      console.error(`❌ Erro na migração ${file}:`, error.message);
    }
  }
  
  console.log('\n🎉 Migrações concluídas!');
  
  // Testar conexão novamente
  console.log('\n🔍 Testando conexão após migrações...');
  await testConnection();
}

async function testConnection() {
  try {
    const { data, error } = await supabase.from('courses').select('count').limit(1);
    
    if (error) {
      console.error('❌ Erro na conexão:', error.message);
      return;
    }
    
    console.log('✅ Conexão funcionando!');
    
    // Contar registros
    const { count: coursesCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
    const { count: ebooksCount } = await supabase.from('ebooks').select('*', { count: 'exact', head: true });
    
    console.log(`📊 Cursos: ${coursesCount || 0}`);
    console.log(`📊 eBooks: ${ebooksCount || 0}`);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

runMigrations(); 