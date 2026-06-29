import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useCourses, useCourseCategories, useDeleteCourse, Course } from '@/hooks/useCourses';
import { Edit, Trash2, Plus, Star, Users, Clock, Eye, Search, Filter, BookOpen, Play } from 'lucide-react';
import CourseForm from './CourseForm';
import { toast } from 'sonner';
import CursosAdmin from './CursosAdmin';

const CoursesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseDetails, setShowCourseDetails] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [contentCourse, setContentCourse] = useState<Course | null>(null);

  const { data: courses, isLoading, error } = useCourses();
  const { data: categories } = useCourseCategories();
  const deleteCourse = useDeleteCourse();

  // Filtrar cursos
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || !categoryFilter || course.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse.mutateAsync(courseId);
    } catch (error) {
      console.error('Erro ao deletar curso:', error);
    }
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseDetails(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-lg text-gray-600">Carregando cursos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg border-red-200 bg-red-50">
        <CardContent className="py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-lg font-medium text-red-800">Erro ao carregar cursos</p>
            <p className="text-red-600 mt-2">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Total de Cursos</p>
                <p className="text-3xl font-bold text-blue-900">{courses?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800">Cursos Destacados</p>
                <p className="text-3xl font-bold text-yellow-900">{courses?.filter(c => c.featured).length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Total de Alunos</p>
                <p className="text-3xl font-bold text-green-900">{courses?.reduce((sum, c) => sum + c.students, 0) || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Play className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-800">Média de Rating</p>
                <p className="text-3xl font-bold text-purple-900">
                  {courses?.length ? (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1) : '0.0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e busca */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Gerenciamento de Cursos</CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Gerencie todos os cursos da plataforma
              </CardDescription>
            </div>
            <CourseForm />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar cursos por título ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="w-full sm:w-56">
              <Select value={categoryFilter || undefined} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
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
          </div>

          {/* Tabela */}
          <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-900">Curso</TableHead>
                  <TableHead className="font-semibold text-gray-900">Categoria</TableHead>
                  <TableHead className="font-semibold text-gray-900">Preço</TableHead>
                  <TableHead className="font-semibold text-gray-900">Alunos</TableHead>
                  <TableHead className="font-semibold text-gray-900">Avaliação</TableHead>
                  <TableHead className="font-semibold text-gray-900">Status</TableHead>
                  <TableHead className="text-right font-semibold text-gray-900">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses?.map((course) => (
                  <TableRow key={course.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        {course.image_url ? (
                          <img 
                            src={course.image_url} 
                            alt={course.title}
                            className="w-12 h-12 rounded-lg object-cover shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center shadow-sm">
                            <BookOpen className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{course.title}</p>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {course.duration} • {course.level}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {course.course_categories && (
                        <Badge 
                          variant="outline"
                          className="font-medium"
                          style={{ 
                            borderColor: course.course_categories.color,
                            color: course.course_categories.color,
                            backgroundColor: `${course.course_categories.color}10`
                          }}
                        >
                          {course.course_categories.name}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-semibold text-gray-900">R$ {course.price.toFixed(2)}</span>
                        {course.original_price > course.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            R$ {course.original_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{course.students}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium text-gray-900">{course.rating.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {course.featured ? (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
                          Destacado
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                          Regular
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewCourse(course)}
                          className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditCourse(course)}
                          className="hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => { setContentCourse(course); setShowContentModal(true); }}
                          className="hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                          title="Gerenciar Conteúdo"
                        >
                          <BookOpen className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl font-bold text-gray-900">Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-600">
                                Tem certeza que deseja excluir o curso "{course.title}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCourse(course.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredCourses?.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-xl font-medium text-gray-600 mb-2">Nenhum curso encontrado</p>
              <p className="text-gray-500">Tente ajustar os filtros de busca</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalhes do curso */}
      <Dialog open={showCourseDetails} onOpenChange={setShowCourseDetails}>
        <DialogContent className="max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Detalhes do Curso</DialogTitle>
            <DialogDescription className="text-gray-600">
              Informações completas sobre o curso
            </DialogDescription>
          </DialogHeader>
          
          {selectedCourse && (
            <div className="space-y-6">
              <div className="flex items-start space-x-6">
                {selectedCourse.image_url ? (
                  <img 
                    src={selectedCourse.image_url} 
                    alt={selectedCourse.title}
                    className="w-32 h-32 rounded-xl object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpen className="h-12 w-12 text-gray-500" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedCourse.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">Categoria</p>
                  <p className="font-semibold text-gray-900">{selectedCourse.course_categories?.name || 'Sem categoria'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">Nível</p>
                  <p className="font-semibold text-gray-900">{selectedCourse.level}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">Duração</p>
                  <p className="font-semibold text-gray-900">{selectedCourse.duration}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">Preço</p>
                  <p className="font-semibold text-gray-900">R$ {selectedCourse.price.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">Alunos</p>
                  <p className="font-semibold text-gray-900">{selectedCourse.students}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">Avaliação</p>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-900">{selectedCourse.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setShowCourseDetails(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Fechar
                </Button>
                <Button
                  onClick={() => {
                    setShowCourseDetails(false);
                    handleEditCourse(selectedCourse);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Editar Curso
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de edição */}
      {selectedCourse && (
        <CourseForm 
          course={selectedCourse}
          onSuccess={() => setSelectedCourse(null)}
          onCancel={() => setSelectedCourse(null)}
        />
      )}

      {/* Modal de gerenciamento de conteúdo */}
      <Dialog open={showContentModal} onOpenChange={setShowContentModal}>
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0 bg-white flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Gerenciar Conteúdo do Curso</DialogTitle>
            <DialogDescription className="text-gray-600">Cadastre, edite e remova módulos e aulas deste curso</DialogDescription>
          </DialogHeader>
          {contentCourse && (
            <div className="flex-1 overflow-auto p-6">
              <CursosAdmin cursoExterno={contentCourse} />
            </div>
          )}
          <div className="flex justify-end p-4 border-t">
            <Button variant="outline" onClick={() => setShowContentModal(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoursesManagement;
