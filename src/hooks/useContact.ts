
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const useContact = () => {
  return useMutation({
    mutationFn: async (data: ContactFormData) => {
      const { error } = await supabase
        .from('contacts')
        .insert([data]);
      
      if (error) {
        console.error('Error submitting contact:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    },
    onError: (error) => {
      console.error('Contact submission error:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    },
  });
};
