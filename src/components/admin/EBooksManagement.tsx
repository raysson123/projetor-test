import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useEBooks, useCreateEBook, useUpdateEBook, useDeleteEBook } from '@/hooks/useEBooks';
import { Edit, Trash2, Plus, Star, Download, FileText, BookOpen, TrendingUp, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog as FullDialog, DialogContent as FullDialogContent, DialogHeader as FullDialogHeader, DialogTitle as FullDialogTitle } from '@/components/ui/dialog';

const EBooksManagement = () => {
  const { data: ebooks, isLoading, error } = useEBooks();
  const createEBook = useCreateEBook();
  const updateEBook = useUpdateEBook();
  const deleteEBook = useDeleteEBook();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEBook, setEditingEBook] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    original_price: '',
    pages: '',
    category: '',
    bestseller: false,
    thumbnail_url: ''
  });

  // Adicionar estados para upload de imagem
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Função para upload da imagem no Supabase Storage
  const uploadImage = async (file: File): Promise<string> => {
    try {
      console.log('Iniciando upload da imagem:', file.name, file.size);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `ebook-images/${fileName}`;
      
      console.log('Caminho do arquivo:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('ebook-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw uploadError;
      }

      console.log('Upload realizado com sucesso');

      const { data: { publicUrl } } = supabase.storage
        .from('ebook-images')
        .getPublicUrl(filePath);

      console.log('URL pública gerada:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Erro completo no upload:', error);
      throw error;
    }
  };

  // Handler para seleção de imagem
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

  // Handler para remover imagem
  const handleRemoveImage = () => {
    console.log('=== REMOÇÃO DE IMAGEM ===');
    console.log('Estado antes da remoção:');
    console.log('- imageFile:', imageFile);
    console.log('- imagePreview:', imagePreview);
    console.log('- formData.thumbnail_url:', formData.thumbnail_url);
    console.log('- editingEBook?.thumbnail_url:', editingEBook?.thumbnail_url);
    
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => {
      const newData = { ...prev, thumbnail_url: '' };
      console.log('Novo formData após remoção:', newData);
      return newData;
    });
    
    // Limpar todos os inputs de arquivo
    const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
    fileInputs.forEach(input => {
      input.value = '';
    });
    
    console.log('=== REMOÇÃO CONCLUÍDA ===');
  };

  const handleCreateEBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.thumbnail_url;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      await createEBook.mutateAsync({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        original_price: parseFloat(formData.original_price),
        pages: parseInt(formData.pages),
        category: formData.category,
        bestseller: formData.bestseller,
        thumbnail_url: imageUrl || undefined
      });
      
      toast({
        title: "eBook criado com sucesso!",
        description: "O eBook foi adicionado à plataforma.",
      });
      
      setIsCreateDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        price: '',
        original_price: '',
        pages: '',
        category: '',
        bestseller: false,
        thumbnail_url: ''
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      toast({
        title: "Erro ao criar eBook",
        description: "Tente novamente ou verifique os dados.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEBook) return;
    
    try {
      console.log('Iniciando atualização do eBook:', editingEBook.id);
      console.log('Dados do formulário:', formData);
      console.log('Arquivo de imagem:', imageFile);
      console.log('ImagePreview:', imagePreview);
      
      let imageUrl = formData.thumbnail_url;
      
      // Se há um novo arquivo, fazer upload
      if (imageFile) {
        console.log('Fazendo upload da nova imagem...');
        imageUrl = await uploadImage(imageFile);
        console.log('URL da nova imagem:', imageUrl);
      }
      // Se não há preview mas havia imagem original, significa que foi removida
      else if (!imagePreview && editingEBook.thumbnail_url) {
        console.log('Imagem foi removida, definindo como null');
        imageUrl = null;
      }
      // Se há preview mas não há arquivo novo, manter a URL atual
      else if (imagePreview && !imageFile) {
        console.log('Mantendo imagem atual:', imageUrl);
      }
      
      const updateData = {
        id: editingEBook.id,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        original_price: parseFloat(formData.original_price),
        pages: parseInt(formData.pages),
        category: formData.category,
        bestseller: formData.bestseller,
        thumbnail_url: imageUrl
      };
      
      console.log('Dados para atualização:', updateData);
      
      const result = await updateEBook.mutateAsync(updateData);
      console.log('Resultado da atualização:', result);
      
      toast({
        title: "eBook atualizado com sucesso!",
        description: "As alterações foram salvas.",
      });
      
      setIsEditDialogOpen(false);
      setEditingEBook(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        original_price: '',
        pages: '',
        category: '',
        bestseller: false,
        thumbnail_url: ''
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Erro detalhado ao atualizar eBook:', error);
      toast({
        title: "Erro ao atualizar eBook",
        description: error instanceof Error ? error.message : "Tente novamente ou verifique os dados.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEBook = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este eBook?')) return;
    
    try {
      await deleteEBook.mutateAsync(id);
      toast({
        title: "eBook excluído com sucesso!",
        description: "O eBook foi removido da plataforma.",
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir eBook",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (ebook: any) => {
    console.log('Abrindo diálogo de edição para:', ebook);
    setEditingEBook(ebook);
    setFormData({
      title: ebook.title,
      description: ebook.description,
      price: ebook.price.toString(),
      original_price: ebook.original_price.toString(),
      pages: ebook.pages.toString(),
      category: ebook.category,
      bestseller: ebook.bestseller,
      thumbnail_url: ebook.thumbnail_url || ''
    });
    // Resetar estados de imagem
    setImageFile(null);
    setImagePreview(ebook.thumbnail_url || null);
    setIsEditDialogOpen(true);
  };

  // Resetar preview ao abrir dialogs
  useEffect(() => {
    if (isCreateDialogOpen) {
      setImageFile(null);
      setImagePreview(null);
    }
  }, [isCreateDialogOpen]);
  useEffect(() => {
    if (isEditDialogOpen && editingEBook) {
      setImageFile(null);
      setImagePreview(editingEBook.thumbnail_url || null);
    }
  }, [isEditDialogOpen, editingEBook]);

  const [showContentModal, setShowContentModal] = useState(false);
  const [contentEBook, setContentEBook] = useState<any | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploadingPDF, setUploadingPDF] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleOpenContentModal = (ebook: any) => {
    setContentEBook(ebook);
    setPdfUrl(ebook.pdf_url || null);
    setShowContentModal(true);
  };
  const handleCloseContentModal = () => {
    setShowContentModal(false);
    setContentEBook(null);
    setPdfFile(null);
    setPdfUrl(null);
  };
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPdfFile(file);
  };
  const handleUploadPDF = async () => {
    if (!pdfFile || !contentEBook) return;
    setUploadingPDF(true);
    const ext = pdfFile.name.split('.').pop();
    const path = `pdfs/${contentEBook.id}-${Date.now()}.${ext}`; // Vincula o PDF ao ID do eBook
    const bucket = 'ebook-content';
    const { data, error } = await supabase.storage.from(bucket).upload(path, pdfFile, { upsert: false });
    setUploadingPDF(false);
    if (error) {
      toast({ title: 'Erro ao enviar PDF', description: error.message, variant: 'destructive' });
      return;
    }
    const url = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    setPdfUrl(url);
    // Atualiza o campo pdf_url do eBook selecionado
    await updateEBook.mutateAsync({ ...contentEBook, pdf_url: url });
    toast({ title: 'PDF enviado!', description: 'O PDF do eBook foi atualizado.' });
    setPdfFile(null);
  };
  const handleRemovePDF = async () => {
    if (!contentEBook) return;
    await updateEBook.mutateAsync({ ...contentEBook, pdf_url: null });
    setPdfUrl(null);
    toast({ title: 'PDF removido!', description: 'O PDF do eBook foi removido.' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-lg text-gray-600">Carregando eBooks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg border-red-200 bg-red-50">
        <CardContent className="py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-lg font-medium text-red-800">Erro ao carregar eBooks</p>
            <p className="text-red-600 mt-2">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalDownloads = ebooks?.reduce((sum, ebook) => sum + ebook.downloads, 0) || 0;
  const totalRevenue = ebooks?.reduce((sum, ebook) => sum + ebook.price * ebook.downloads, 0) || 0;
  const bestsellers = ebooks?.filter(ebook => ebook.bestseller).length || 0;

  return (
    <div className="space-y-8">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-800">Total de eBooks</p>
                <p className="text-3xl font-bold text-purple-900">{ebooks?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <Download className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Total de Downloads</p>
                <p className="text-3xl font-bold text-green-900">{totalDownloads}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-800">Bestsellers</p>
                <p className="text-3xl font-bold text-orange-900">{bestsellers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de eBooks */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Gerenciamento de eBooks</CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Gerencie todos os eBooks da plataforma
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg">
                  <Plus className="h-4 w-4" />
                  <span>Novo eBook</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900">Criar Novo eBook</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do novo eBook
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateEBook} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Título do eBook"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Faturamento">Faturamento</SelectItem>
                          <SelectItem value="Gestão">Gestão</SelectItem>
                          <SelectItem value="Auditoria">Auditoria</SelectItem>
                          <SelectItem value="Qualidade">Qualidade</SelectItem>
                          <SelectItem value="Financeiro">Financeiro</SelectItem>
                          <SelectItem value="Regulatório">Regulatório</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Descrição detalhada do eBook"
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Preço (R$)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="original_price">Preço Original (R$)</Label>
                      <Input
                        id="original_price"
                        type="number"
                        step="0.01"
                        value={formData.original_price}
                        onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pages">Número de Páginas</Label>
                      <Input
                        id="pages"
                        type="number"
                        value={formData.pages}
                        onChange={(e) => setFormData({...formData, pages: e.target.value})}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Imagem do eBook</Label>
                    <div className="flex items-center space-x-6">
                      {imagePreview && (
                        <div className="relative">
                          <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg shadow" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-7 w-7 p-0 rounded-full shadow"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <label className="block">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-purple-400 transition-colors cursor-pointer">
                          <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">Clique para selecionar uma imagem</p>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="bestseller"
                      checked={formData.bestseller}
                      onCheckedChange={(checked) => setFormData({...formData, bestseller: checked})}
                    />
                    <Label htmlFor="bestseller">Marcar como Bestseller</Label>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={createEBook.isPending}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                    >
                      {createEBook.isPending ? 'Criando...' : 'Criar eBook'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {ebooks && ebooks.length > 0 ? (
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-900">eBook</TableHead>
                    <TableHead className="font-semibold text-gray-900">Preço</TableHead>
                    <TableHead className="font-semibold text-gray-900">Downloads</TableHead>
                    <TableHead className="font-semibold text-gray-900">Avaliação</TableHead>
                    <TableHead className="font-semibold text-gray-900">Categoria</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="text-right font-semibold text-gray-900">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ebooks.map((ebook) => (
                    <TableRow key={ebook.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          {ebook.thumbnail_url ? (
                            <img 
                              src={ebook.thumbnail_url} 
                              alt={ebook.title}
                              className="w-12 h-12 rounded-lg object-cover shadow-sm"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center shadow-sm">
                              <FileText className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{ebook.title}</p>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {ebook.pages} páginas
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-semibold text-gray-900">R$ {ebook.price.toFixed(2)}</span>
                          {ebook.original_price > ebook.price && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              R$ {ebook.original_price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Download className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{ebook.downloads}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium text-gray-900">{ebook.rating.toFixed(1)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                          {ebook.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {ebook.bestseller ? (
                          <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
                            Bestseller
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
                            className="hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                            onClick={() => handleOpenContentModal(ebook)}
                            title="Gerenciar Conteúdo"
                          >
                            <BookOpen className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                            onClick={() => openEditDialog(ebook)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            onClick={() => handleDeleteEBook(ebook.id)}
                            disabled={deleteEBook.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-xl font-medium text-gray-600 mb-2">Nenhum eBook encontrado</p>
              <p className="text-gray-500">Comece adicionando seu primeiro eBook</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo financeiro */}
      {ebooks && ebooks.length > 0 && (
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
            <CardTitle className="text-xl font-bold text-emerald-900 flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span>Resumo Financeiro</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-emerald-600 font-medium">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">R$ {totalRevenue.toFixed(2)}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-blue-600 font-medium">Média por eBook</p>
                <p className="text-2xl font-bold text-gray-900">R$ {(totalRevenue / (ebooks?.length || 1)).toFixed(2)}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-purple-600 font-medium">Downloads Médios</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(totalDownloads / (ebooks?.length || 1))}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diálogo de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Editar eBook</DialogTitle>
            <DialogDescription>
              Atualize os dados do eBook
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateEBook} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Título</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Título do eBook"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Categoria</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Faturamento">Faturamento</SelectItem>
                    <SelectItem value="Gestão">Gestão</SelectItem>
                    <SelectItem value="Auditoria">Auditoria</SelectItem>
                    <SelectItem value="Qualidade">Qualidade</SelectItem>
                    <SelectItem value="Financeiro">Financeiro</SelectItem>
                    <SelectItem value="Regulatório">Regulatório</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descrição detalhada do eBook"
                rows={4}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Preço (R$)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-original_price">Preço Original (R$)</Label>
                <Input
                  id="edit-original_price"
                  type="number"
                  step="0.01"
                  value={formData.original_price}
                  onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-pages">Número de Páginas</Label>
                <Input
                  id="edit-pages"
                  type="number"
                  value={formData.pages}
                  onChange={(e) => setFormData({...formData, pages: e.target.value})}
                  placeholder="0"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Imagem do eBook</Label>
              <div className="flex items-center space-x-6">
                {imagePreview && (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg shadow" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-7 w-7 p-0 rounded-full shadow"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-purple-400 transition-colors cursor-pointer">
                    <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Clique para selecionar uma imagem</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </label>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-bestseller"
                checked={formData.bestseller}
                onCheckedChange={(checked) => setFormData({...formData, bestseller: checked})}
              />
              <Label htmlFor="edit-bestseller">Marcar como Bestseller</Label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updateEBook.isPending}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                {updateEBook.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Gerenciamento de Conteúdo */}
      <FullDialog open={showContentModal} onOpenChange={setShowContentModal}>
        <FullDialogContent className="max-w-3xl w-full h-[90vh] flex flex-col">
          <FullDialogHeader>
            <FullDialogTitle>Gerenciar Conteúdo do eBook</FullDialogTitle>
          </FullDialogHeader>
          {contentEBook && (
            <div className="flex-1 flex flex-col gap-6 p-6 overflow-auto">
              <div>
                <h3 className="text-lg font-bold mb-2">PDF do eBook</h3>
                {pdfUrl ? (
                  <div className="flex items-center gap-4 mb-4">
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Visualizar PDF</a>
                    <Button variant="destructive" size="sm" onClick={handleRemovePDF}>Remover PDF</Button>
                  </div>
                ) : (
                  <div className="text-gray-500 mb-4">Nenhum PDF enviado ainda.</div>
                )}
                <div className="flex items-center gap-4">
                  <input type="file" accept="application/pdf" onChange={handlePdfChange} />
                  <Button onClick={handleUploadPDF} disabled={!pdfFile || uploadingPDF}>
                    {uploadingPDF ? 'Enviando...' : 'Enviar PDF'}
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end p-4 border-t">
            <Button variant="outline" onClick={handleCloseContentModal}>Fechar</Button>
          </div>
        </FullDialogContent>
      </FullDialog>
    </div>
  );
};

export default EBooksManagement;
