import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price: number;
  duration: string;
  students: number;
  rating: number;
  level: string;
  featured: boolean;
  image_url?: string;
  category_id?: string;
  created_at: string;
  updated_at: string;
  course_categories?: {
    name: string;
    color: string;
    icon: string;
  };
}

export interface CourseCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface CourseLesson {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  video_url?: string;
  duration_minutes: number;
  order_index: number;
  is_free: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at?: string;
  progress_percentage: number;
  courses?: Course;
}

// Hook para buscar cursos
export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          course_categories(name, color, icon)
        `)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }
      
      return data as Course[];
    },
  });
};

// Hook para buscar categorias
export const useCourseCategories = () => {
  return useQuery({
    queryKey: ['course-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      return data as CourseCategory[];
    },
  });
};

// Hook para buscar aulas de um curso
export const useCourseLessons = (courseId: string) => {
  return useQuery({
    queryKey: ['course-lessons', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');
      
      if (error) {
        console.error('Error fetching lessons:', error);
        throw error;
      }
      
      return data as CourseLesson[];
    },
    enabled: !!courseId,
  });
};

// Hook para buscar matrículas do usuário
export const useUserEnrollments = (userId?: string) => {
  return useQuery({
    queryKey: ['user-enrollments', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses(*)
        `)
        .eq('user_id', userId)
        .order('enrolled_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching enrollments:', error);
        throw error;
      }
      
      return data as CourseEnrollment[];
    },
    enabled: !!userId,
  });
};

// Hook para criar curso
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at' | 'students' | 'rating'>) => {
      const { data, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating course:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Curso criado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar curso: ${error.message}`);
    },
  });
};

// Hook para atualizar curso
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...courseData }: Partial<Course> & { id: string }) => {
      const { data, error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating course:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Curso atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar curso: ${error.message}`);
    },
  });
};

// Hook para deletar curso
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
      
      if (error) {
        console.error('Error deleting course:', error);
        throw error;
      }
      
      return courseId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Curso deletado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao deletar curso: ${error.message}`);
    },
  });
};

// Hook para matricular em curso
export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, courseId }: { userId: string; courseId: string }) => {
      const { data, error } = await supabase
        .from('course_enrollments')
        .insert([{ user_id: userId, course_id: courseId }])
        .select()
        .single();
      
      if (error) {
        console.error('Error enrolling in course:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-enrollments'] });
      toast.success('Matriculado no curso com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao se matricular: ${error.message}`);
    },
  });
};

// Hook para criar aula
export const useCreateLesson = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (lessonData: Omit<CourseLesson, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('course_lessons')
        .insert([lessonData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating lesson:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['course-lessons', data.course_id] });
      toast.success('Aula criada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar aula: ${error.message}`);
    },
  });
};

// Hook para atualizar aula
export const useUpdateLesson = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...lessonData }: Partial<CourseLesson> & { id: string }) => {
      const { data, error } = await supabase
        .from('course_lessons')
        .update(lessonData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating lesson:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['course-lessons', data.course_id] });
      toast.success('Aula atualizada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar aula: ${error.message}`);
    },
  });
};

// Hook para deletar aula
export const useDeleteLesson = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ lessonId, courseId }: { lessonId: string; courseId: string }) => {
      const { error } = await supabase
        .from('course_lessons')
        .delete()
        .eq('id', lessonId);
      
      if (error) {
        console.error('Error deleting lesson:', error);
        throw error;
      }
      
      return { lessonId, courseId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['course-lessons', data.courseId] });
      toast.success('Aula deletada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao deletar aula: ${error.message}`);
    },
  });
};
