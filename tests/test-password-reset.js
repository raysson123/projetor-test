import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://gabyteyblfmddvamhcow.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhYnl0ZXlibGZtZGR2YW1oY293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzAzOTcsImV4cCI6MjA2NzMwNjM5N30.l6aoUXwGK4DC4HBcrmCgDtYdB67q2ztEwTcF0WwT3vc";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testPasswordReset() {
  console.log('🔐 Testando sistema de recuperação de senha...');
  
  try {
    // Testar envio de email de recuperação
    console.log('\n1️⃣ Testando envio de email de recuperação...');
    
    const testEmail = 'teste@exemplo.com'; // Substitua por um email real
    
    const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
      redirectTo: 'http://localhost:3000/reset-password'
    });
    
    if (error) {
      console.log(`❌ Erro ao enviar email: ${error.message}`);
    } else {
      console.log(`✅ Email de recuperação enviado para: ${testEmail}`);
      console.log('📧 Verifique a caixa de entrada do email');
    }
    
    console.log('\n📋 Para testar completamente:');
    console.log('1. Use um email real no script');
    console.log('2. Clique no link do email recebido');
    console.log('3. Teste a página de redefinição de senha');
    console.log('4. Verifique se a senha foi atualizada');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

testPasswordReset(); 