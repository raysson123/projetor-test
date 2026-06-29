import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://gabyteyblfmddvamhcow.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhYnl0ZXlibGZtZGR2YW1oY293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzAzOTcsImV4cCI6MjA2NzMwNjM5N30.l6aoUXwGK4DC4HBcrmCgDtYdB67q2ztEwTcF0WwT3vc";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function debugResetURL() {
  console.log('🔍 Debugando URL de reset de senha...');
  
  try {
    // Testar diferentes formatos de redirectTo
    const testEmail = 'teste@exemplo.com'; // Substitua por um email real
    
    console.log('\n📧 Enviando email de recuperação...');
    console.log('🔗 RedirectTo: http://localhost:3000/reset-password?type=recovery');
    
    const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
      redirectTo: 'http://localhost:3000/reset-password?type=recovery'
    });
    
    if (error) {
      console.log(`❌ Erro: ${error.message}`);
    } else {
      console.log(`✅ Email enviado para: ${testEmail}`);
      console.log('\n📋 Instruções para debug:');
      console.log('1. Verifique o email recebido');
      console.log('2. Copie a URL completa do link');
      console.log('3. Cole aqui para analisarmos os parâmetros');
      console.log('4. Ou abra o console do navegador na página de reset');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

debugResetURL(); 