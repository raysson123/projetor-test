import { useState } from 'react';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface AuthError {
  message: string;
  field?: string;
}

export const useAuth = () => {
  const auth = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  // Validação de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validação de senha
  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push('A senha deve ter pelo menos 6 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra maiúscula');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra minúscula');
    }
    
    if (!/\d/.test(password)) {
      errors.push('A senha deve conter pelo menos um número');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Validação de nome
  const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  // Login com validação
  const signInWithValidation = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Validações
      if (!email.trim()) {
        throw { message: 'Email é obrigatório', field: 'email' };
      }

      if (!validateEmail(email)) {
        throw { message: 'Email inválido', field: 'email' };
      }

      if (!password.trim()) {
        throw { message: 'Senha é obrigatória', field: 'password' };
      }

      const result = await auth.signIn(email, password);
      
      if (result.error) {
        // Mapear erros do Supabase para mensagens amigáveis
        let message = 'Erro ao fazer login';
        
        if (result.error.message.includes('Invalid login credentials')) {
          message = 'Email ou senha incorretos';
        } else if (result.error.message.includes('Email not confirmed')) {
          message = 'Email não confirmado. Verifique sua caixa de entrada';
        } else if (result.error.message.includes('Too many requests')) {
          message = 'Muitas tentativas. Tente novamente em alguns minutos';
        }
        
        throw { message, field: 'general' };
      }

      return { success: true };
    } catch (err: any) {
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Registro com validação
  const signUpWithValidation = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    setError(null);

    try {
      // Validações
      if (!email.trim()) {
        throw { message: 'Email é obrigatório', field: 'email' };
      }

      if (!validateEmail(email)) {
        throw { message: 'Email inválido', field: 'email' };
      }

      if (!fullName.trim()) {
        throw { message: 'Nome é obrigatório', field: 'fullName' };
      }

      if (!validateName(fullName)) {
        throw { message: 'Nome deve ter pelo menos 2 caracteres', field: 'fullName' };
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw { 
          message: passwordValidation.errors.join(', '), 
          field: 'password' 
        };
      }

      const result = await auth.signUp(email, password, fullName);
      
      if (result.error) {
        let message = 'Erro ao criar conta';
        
        if (result.error.message.includes('User already registered')) {
          message = 'Este email já está cadastrado';
        } else if (result.error.message.includes('Password should be at least')) {
          message = 'Senha muito fraca';
        }
        
        throw { message, field: 'general' };
      }

      return { success: true };
    } catch (err: any) {
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Recuperação de senha
  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      if (!email.trim()) {
        throw { message: 'Email é obrigatório', field: 'email' };
      }

      if (!validateEmail(email)) {
        throw { message: 'Email inválido', field: 'email' };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw { message: 'Erro ao enviar email de recuperação', field: 'general' };
      }

      return { success: true };
    } catch (err: any) {
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Atualizar perfil
  const updateProfile = async (updates: { full_name?: string; phone?: string }) => {
    setLoading(true);
    setError(null);

    try {
      if (!auth.user) {
        throw { message: 'Usuário não autenticado', field: 'general' };
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', auth.user.id);

      if (error) {
        throw { message: 'Erro ao atualizar perfil', field: 'general' };
      }

      // Recarregar perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', auth.user.id)
        .single();

      return { success: true, profile };
    } catch (err: any) {
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Verificar se email está confirmado
  const checkEmailConfirmation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.email_confirmed_at !== null;
    } catch {
      return false;
    }
  };

  return {
    ...auth,
    loading,
    error,
    setError,
    signInWithValidation,
    signUpWithValidation,
    resetPassword,
    updateProfile,
    checkEmailConfirmation,
    validateEmail,
    validatePassword,
    validateName
  };
}; 