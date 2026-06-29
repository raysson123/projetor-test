import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://gabyteyblfmddvamhcow.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhYnl0ZXlibGZtZGR2YW1oY293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzAzOTcsImV4cCI6MjA2NzMwNjM5N30.l6aoUXwGK4DC4HBcrmCgDtYdB67q2ztEwTcF0WwT3vc";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testAuth() {
  console.log('🔐 Testando sistema de autenticação...');
  
  try {
    // 1. Testar registro de usuário
    console.log('\n1️⃣ Testando registro de usuário...');
    
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'Test123456!';
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Usuário Teste'
        }
      }
    });
    
    if (signUpError) {
      console.log(`❌ Erro no registro: ${signUpError.message}`);
    } else {
      console.log(`✅ Usuário registrado: ${testEmail}`);
      console.log(`📧 Verifique o email para confirmar a conta`);
    }
    
    // 2. Verificar se o perfil foi criado
    console.log('\n2️⃣ Verificando criação do perfil...');
    
    if (signUpData.user) {
      // Aguardar um pouco para o trigger executar
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', signUpData.user.id)
        .single();
      
      if (profileError) {
        console.log(`❌ Erro ao buscar perfil: ${profileError.message}`);
      } else {
        console.log(`✅ Perfil criado: ${profile.full_name} (${profile.role})`);
      }
    }
    
    // 3. Testar login
    console.log('\n3️⃣ Testando login...');
    
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (signInError) {
      console.log(`❌ Erro no login: ${signInError.message}`);
    } else {
      console.log(`✅ Login realizado com sucesso`);
      
      // 4. Verificar dados do usuário logado
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log(`👤 Usuário logado: ${user.email}`);
        
        // 5. Buscar perfil do usuário logado
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (userProfile) {
          console.log(`📋 Perfil: ${userProfile.full_name} - ${userProfile.role}`);
        }
      }
    }
    
    // 6. Testar logout
    console.log('\n4️⃣ Testando logout...');
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      console.log(`❌ Erro no logout: ${signOutError.message}`);
    } else {
      console.log(`✅ Logout realizado com sucesso`);
    }
    
    console.log('\n🎉 Teste de autenticação concluído!');
    console.log('\n📝 Para criar um usuário admin:');
    console.log('1. Registre um usuário via frontend');
    console.log('2. Execute no SQL: UPDATE public.profiles SET role = \'admin\' WHERE email = \'SEU_EMAIL\';');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

testAuth(); 