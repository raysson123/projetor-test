import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface EBook {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price: number;
  pages: number;
  downloads: number;
  rating: number;
  category: string;
  bestseller: boolean;
  thumbnail_url?: string;
}

export interface CreateEBookData {
  title: string;
  description: string;
  price: number;
  original_price: number;
  pages: number;
  category: string;
  bestseller: boolean;
  thumbnail_url?: string;
}

export interface UpdateEBookData extends Partial<CreateEBookData> {
  id: string;
}

export const useEBooks = () => {
  return useQuery({
    queryKey: ['ebooks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .order('bestseller', { ascending: false });
      
      if (error) {
        console.error('Error fetching ebooks:', error);
        throw error;
      }
      
      return data as EBook[];
    },
  });
};

export const useCreateEBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ebookData: CreateEBookData) => {
      const { data, error } = await supabase
        .from('ebooks')
        .insert([{
          ...ebookData,
          downloads: 0,
          rating: 0
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating ebook:', error);
        throw error;
      }
      
      return data as EBook;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ebooks'] });
    },
  });
};

export const useUpdateEBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateEBookData) => {
      console.log('useUpdateEBook - ID:', id);
      console.log('useUpdateEBook - Dados para atualizar:', updateData);
      
      if (updateData.thumbnail_url === '') {
        updateData.thumbnail_url = null;
      }
      
      const { data, error } = await supabase
        .from('ebooks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating ebook:', error);
        throw error;
      }
      
      console.log('useUpdateEBook - Dados retornados:', data);
      return data as EBook;
    },
    onSuccess: (data) => {
      console.log('useUpdateEBook - onSuccess chamado, invalidando queries');
      queryClient.invalidateQueries({ queryKey: ['ebooks'] });
    },
    onError: (error) => {
      console.error('useUpdateEBook - onError:', error);
    }
  });
};

export const useDeleteEBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ebooks')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting ebook:', error);
        throw error;
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ebooks'] });
    },
  });
};
