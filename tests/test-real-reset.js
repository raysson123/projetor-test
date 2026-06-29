import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://gabyteyblfmddvamhcow.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhYnl0ZXlibGZtZGR2YW1oY293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzAzOTcsImV4cCI6MjA2NzMwNjM5N30.l6aoUXwGK4DC4HBcrmCgDtYdB67q2ztEwTcF0WwT3vc";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testRealReset() {
  console.log('🔍 Testando reset de senha com email real...');
  
  // Substitua por um email real que você tenha acesso
  const testEmail = 'pablo@exemplo.com'; // ⚠️ ALTERE PARA SEU EMAIL REAL
  
  try {
    console.log(`\n📧 Enviando email de recuperação para: ${testEmail}`);
    console.log('🔗 RedirectTo: http://localhost:3000/reset-password');
    
    const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
      redirectTo: 'http://localhost:3000/reset-password'
    });
    
    if (error) {
      console.log(`❌ Erro: ${error.message}`);
    } else {
      console.log(`✅ Email enviado com sucesso!`);
      console.log('\n📋 Próximos passos:');
      console.log('1. Verifique o email recebido');
      console.log('2. Clique no link de recuperação');
      console.log('3. Observe a URL no navegador');
      console.log('4. Abra o console do navegador (F12)');
      console.log('5. Veja os logs para entender o formato da URL');
      console.log('\n💡 Dica: A URL pode ter tokens na query string ou no hash');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testRealReset(); 