import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://gabyteyblfmddvamhcow.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhYnl0ZXlibGZtZGR2YW1oY293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzAzOTcsImV4cCI6MjA2NzMwNjM5N30.l6aoUXwGK4DC4HBcrmCgDtYdB67q2ztEwTcF0WwT3vc";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testResetFinal() {
  console.log('🔧 Testando reset de senha - VERSÃO FINAL');
  console.log('==========================================');
  
  // ⚠️ ALTERE PARA SEU EMAIL REAL
  const testEmail = 'pablo@exemplo.com'; // SUBSTITUA AQUI
  
  try {
    console.log(`\n📧 Enviando email de recuperação para: ${testEmail}`);
    console.log('🔗 URL de redirecionamento: http://localhost:3000/reset-password');
    
    const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
      redirectTo: 'http://localhost:3000/reset-password'
    });
    
    if (error) {
      console.log(`❌ Erro: ${error.message}`);
    } else {
      console.log(`✅ Email enviado com sucesso!`);
      console.log('\n📋 INSTRUÇÕES PARA TESTE:');
      console.log('1. Verifique o email recebido');
      console.log('2. Clique no link de recuperação');
      console.log('3. Observe a URL no navegador');
      console.log('4. Abra o console do navegador (F12)');
      console.log('5. Veja os logs detalhados da verificação');
      console.log('\n🔍 MELHORIAS IMPLEMENTADAS:');
      console.log('• Verificação robusta de tokens');
      console.log('• Suporte a diferentes formatos de URL');
      console.log('• Estados de loading e erro claros');
      console.log('• Logs detalhados para debug');
      console.log('• Tratamento de tokens expirados');
      console.log('\n💡 DICA: Se o link expirar, solicite um novo!');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testResetFinal(); 