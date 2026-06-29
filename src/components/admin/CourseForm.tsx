import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCourseCategories, useCreateCourse, useUpdateCourse, Course } from '@/hooks/useCourses';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Upload, X, Save, ArrowLeft, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface CourseFormProps {
  course?: Course;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ course, onSuccess, onCancel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(course?.image_url || null);
  
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    price: course?.price || 0,
    original_price: course?.original_price || 0,
    duration: course?.duration || '',
    level: course?.level || 'Iniciante',
    featured: course?.featured || false,
    category_id: course?.category_id || '',
    image_url: course?.image_url || ''
  });

  const { data: categories } = useCourseCategories();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();

  const levels = ['Iniciante', 'Intermediário', 'Avançado'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `course-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('course-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('course-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      // Upload da imagem se houver arquivo novo
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const courseData = {
        ...formData,
        image_url: imageUrl,
        price: Number(formData.price),
        original_price: Number(formData.original_price)
      };

      if (course) {
        // Atualizar curso existente
        await updateCourse.mutateAsync({
          id: course.id,
          ...courseData
        });
      } else {
        // Criar novo curso
        await createCourse.mutateAsync(courseData);
      }

      setIsOpen(false);
      onSuccess?.();
      
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: course?.title || '',
      description: course?.description || '',
      price: course?.price || 0,
      original_price: course?.original_price || 0,
      duration: course?.duration || '',
      level: course?.level || 'Iniciante',
      featured: course?.featured || false,
      category_id: course?.category_id || '',
      image_url: course?.image_url || ''
    });
    setImageFile(null);
    setImagePreview(course?.image_url || null);
  };

  useEffect(() => {
    resetForm();
  }, [course]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
          <Plus className="h-4 w-4" />
          <span>{course ? 'Editar Curso' : 'Novo Curso'}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg p-6 -m-6 mb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span>{course ? 'Editar Curso' : 'Criar Novo Curso'}</span>
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {course ? 'Atualize as informações do curso' : 'Preencha as informações do novo curso'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Imagem do Curso */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">Imagem do Curso</Label>
            <div className="flex items-center space-x-6">
              {imagePreview && (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-xl shadow-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-8 w-8 p-0 rounded-full shadow-lg"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                      handleInputChange('image_url', '');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex-1">
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Clique para selecionar uma imagem
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Formatos aceitos: JPG, PNG, GIF. Máximo 5MB.
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Título do Curso *</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Digite o título do curso"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Categoria</Label>
              <Select value={formData.category_id || undefined} onValueChange={(value) => handleInputChange('category_id', value)}>
                <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Nível</Label>
              <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Duração</Label>
              <Input
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="Ex: 10 horas"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Preço (R$) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0.00"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Preço Original (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.original_price}
                onChange={(e) => handleInputChange('original_price', e.target.value)}
                placeholder="0.00"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">Descrição *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva o conteúdo do curso..."
              className="min-h-32 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Configurações */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-gray-700">Configurações</Label>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Curso Destacado</p>
                <p className="text-sm text-gray-600">Exibir este curso como destaque na plataforma</p>
              </div>
              <Switch
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', checked)}
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                onCancel?.();
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Salvando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>{course ? 'Atualizar' : 'Criar'} Curso</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseForm; 