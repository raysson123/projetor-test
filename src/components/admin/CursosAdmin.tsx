import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Video, FileText } from 'lucide-react';
import { useRef } from 'react';

const CursosAdmin = ({ cursoExterno }: { cursoExterno?: any }) => {
  const [cursos, setCursos] = useState<any[]>([]);
  const [cursoSelecionado, setCursoSelecionado] = useState<any | null>(cursoExterno || null);
  const [modulos, setModulos] = useState<any[]>([]);
  const [moduloSelecionado, setModuloSelecionado] = useState<any | null>(null);
  const [aulas, setAulas] = useState<any[]>([]);

  // Modais e estados para CRUD
  const [showCursoModal, setShowCursoModal] = useState(false);
  const [cursoForm, setCursoForm] = useState({ title: '', description: '', id: null });
  const [showModuloModal, setShowModuloModal] = useState(false);
  const [moduloForm, setModuloForm] = useState({ title: '', description: '', id: null });
  const [showAulaModal, setShowAulaModal] = useState(false);
  const [aulaForm, setAulaForm] = useState({ title: '', description: '', video_url: '', pdf_url: '', id: null });

  // Estados para upload de arquivos
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingPDF, setUploadingPDF] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Buscar cursos
  useEffect(() => {
    if (cursoExterno) {
      setCursoSelecionado(cursoExterno);
      setCursos([cursoExterno]);
      return;
    }
    const fetchCursos = async () => {
      const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      setCursos(data || []);
    };
    fetchCursos();
  }, [cursoExterno]);

  // Buscar módulos do curso selecionado
  useEffect(() => {
    if (!cursoSelecionado) return;
    const fetchModulos = async () => {
      const { data } = await supabase.from('course_modules').select('*').eq('course_id', cursoSelecionado.id).order('order_index');
      setModulos(data || []);
      setModuloSelecionado(null);
      setAulas([]);
    };
    fetchModulos();
  }, [cursoSelecionado]);

  // Buscar aulas do módulo selecionado
  useEffect(() => {
    if (!moduloSelecionado) return;
    const fetchAulas = async () => {
      const { data } = await supabase.from('course_lessons').select('*').eq('module_id', moduloSelecionado.id).order('order_index');
      setAulas(data || []);
    };
    fetchAulas();
  }, [moduloSelecionado]);

  // CRUD Cursos
  const handleOpenCursoModal = (curso = null) => {
    if (curso) setCursoForm({ title: curso.title, description: curso.description, id: curso.id });
    else setCursoForm({ title: '', description: '', id: null });
    setShowCursoModal(true);
  };
  const handleSaveCurso = async () => {
    if (!cursoForm.title) return toast.error('Título obrigatório');
    if (cursoForm.id) {
      // Editar
      await supabase.from('courses').update({ title: cursoForm.title, description: cursoForm.description }).eq('id', cursoForm.id);
      toast.success('Curso atualizado!');
    } else {
      // Novo
      await supabase.from('courses').insert([{ title: cursoForm.title, description: cursoForm.description }]);
      toast.success('Curso criado!');
    }
    setShowCursoModal(false);
    // Atualizar lista
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    setCursos(data || []);
  };
  const handleDeleteCurso = async (curso) => {
    if (!window.confirm('Tem certeza que deseja remover este curso?')) return;
    await supabase.from('courses').delete().eq('id', curso.id);
    setCursoSelecionado(null);
    toast.success('Curso removido!');
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    setCursos(data || []);
  };

  // CRUD Módulos
  const handleOpenModuloModal = (modulo = null) => {
    if (modulo) setModuloForm({ title: modulo.title, description: modulo.description, id: modulo.id });
    else setModuloForm({ title: '', description: '', id: null });
    setShowModuloModal(true);
  };
  const handleSaveModulo = async () => {
    if (!moduloForm.title) return toast.error('Título obrigatório');
    if (!cursoSelecionado) return toast.error('Selecione um curso');
    if (moduloForm.id) {
      await supabase.from('course_modules').update({ title: moduloForm.title, description: moduloForm.description }).eq('id', moduloForm.id);
      toast.success('Módulo atualizado!');
    } else {
      // Novo
      const order_index = modulos.length;
      const { data, error } = await supabase.from('course_modules').insert([{ title: moduloForm.title, description: moduloForm.description, course_id: cursoSelecionado.id, order_index }]).select();
      if (error) {
        toast.error('Erro ao criar módulo: ' + error.message);
        return;
      }
      toast.success('Módulo criado! Agora adicione as aulas deste módulo.');
      if (data && data[0]) setModuloSelecionado(data[0]);
    }
    setShowModuloModal(false);
    // Atualizar lista
    const { data } = await supabase.from('course_modules').select('*').eq('course_id', cursoSelecionado.id).order('order_index');
    setModulos(data || []);
  };
  const handleDeleteModulo = async (modulo) => {
    if (!window.confirm('Tem certeza que deseja remover este módulo?')) return;
    await supabase.from('course_modules').delete().eq('id', modulo.id);
    setModuloSelecionado(null);
    toast.success('Módulo removido!');
    const { data } = await supabase.from('course_modules').select('*').eq('course_id', cursoSelecionado.id).order('order_index');
    setModulos(data || []);
  };

  // CRUD Aulas
  const handleOpenAulaModal = (aula = null) => {
    if (aula) setAulaForm({ title: aula.title, description: aula.description, video_url: aula.video_url, pdf_url: aula.pdf_url, id: aula.id });
    else setAulaForm({ title: '', description: '', video_url: '', pdf_url: '', id: null });
    setShowAulaModal(true);
  };
  const handleSaveAula = async () => {
    if (!aulaForm.title) return toast.error('Título obrigatório');
    if (!moduloSelecionado) return toast.error('Selecione um módulo');
    if (!cursoSelecionado) return toast.error('Selecione um curso');
    const baseData = {
      title: aulaForm.title,
      course_id: cursoSelecionado.id,
      module_id: moduloSelecionado.id,
      order_index: aulas.length,
      is_free: false,
      duration_minutes: 0,
      description: aulaForm.description || null,
      video_url: aulaForm.video_url || null,
      pdf_url: aulaForm.pdf_url || null
    };
    console.log('Dados enviados para o insert/update de aula:', baseData);
    if (aulaForm.id) {
      await supabase.from('course_lessons').update(baseData).eq('id', aulaForm.id);
      toast.success('Aula atualizada!');
    } else {
      await supabase.from('course_lessons').insert([baseData]);
      toast.success('Aula criada!');
    }
    setShowAulaModal(false);
    // Atualizar lista
    const { data } = await supabase.from('course_lessons').select('*').eq('module_id', moduloSelecionado.id).order('order_index');
    setAulas(data || []);
  };
  const handleDeleteAula = async (aula) => {
    if (!window.confirm('Tem certeza que deseja remover esta aula?')) return;
    await supabase.from('course_lessons').delete().eq('id', aula.id);
    toast.success('Aula removida!');
    const { data } = await supabase.from('course_lessons').select('*').eq('module_id', moduloSelecionado.id).order('order_index');
    setAulas(data || []);
  };

  const handleUploadFile = async (file: File, type: 'video' | 'pdf') => {
    const ext = file.name.split('.').pop();
    const path = `${type}s/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const bucket = 'course-content';
    if (type === 'video') setUploadingVideo(true);
    if (type === 'pdf') setUploadingPDF(true);
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
    if (type === 'video') setUploadingVideo(false);
    if (type === 'pdf') setUploadingPDF(false);
    if (error) {
      toast.error(`Erro ao enviar ${type === 'video' ? 'vídeo' : 'PDF'}: ` + error.message);
      return;
    }
    const url = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    setAulaForm(f => ({ ...f, [type === 'video' ? 'video_url' : 'pdf_url']: url }));
    toast.success(`${type === 'video' ? 'Vídeo' : 'PDF'} enviado com sucesso!`);
  };

  return (
    <div>
      {!cursoExterno && (
        <>
          <h2 className="text-2xl font-bold mb-4">Cursos</h2>
          <div className="flex gap-4 mb-8">
            {cursos.map((curso) => (
              <Button key={curso.id} variant={cursoSelecionado?.id === curso.id ? 'default' : 'outline'} onClick={() => setCursoSelecionado(curso)}>
                {curso.title}
              </Button>
            ))}
            <Button variant="default" onClick={() => handleOpenCursoModal()}>+ Novo Curso</Button>
          </div>
        </>
      )}
      {cursoSelecionado && (
        <div className="mb-8">
          {/* Cabeçalho visual do curso */}
          <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow">
            {cursoSelecionado.image_url ? (
              <img src={cursoSelecionado.image_url} alt={cursoSelecionado.title} className="w-24 h-24 rounded-lg object-cover shadow" />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center shadow">
                <FileText className="h-10 w-10 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{cursoSelecionado.title}</h3>
              <p className="text-gray-600 mb-2">{cursoSelecionado.description}</p>
              <div className="flex items-center gap-4">
                {cursoSelecionado.category && (
                  <Badge variant="outline" className="text-blue-700 border-blue-400 bg-blue-100">{cursoSelecionado.category}</Badge>
                )}
                {cursoSelecionado.duration && (
                  <span className="text-sm text-gray-700">⏱ {cursoSelecionado.duration}</span>
                )}
              </div>
            </div>
          </div>
          {/* Módulos em cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold">Módulos</h4>
              <Button variant="default" onClick={() => handleOpenModuloModal()} className="flex items-center gap-2"><Plus className="h-4 w-4" /> Novo Módulo</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modulos.map((modulo) => (
                <Card key={modulo.id} className={`cursor-pointer border-2 ${moduloSelecionado?.id === modulo.id ? 'border-blue-500 shadow-lg' : 'border-gray-200'} transition-all`} onClick={() => setModuloSelecionado(modulo)}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-bold text-gray-900">{modulo.title}</CardTitle>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" onClick={e => { e.stopPropagation(); handleOpenModuloModal(modulo); }}><Edit className="h-4 w-4" /></Button>
                      <Button size="icon" variant="destructive" onClick={e => { e.stopPropagation(); handleDeleteModulo(modulo); }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-2">{modulo.description}</CardDescription>
                    <div className="flex items-center gap-2 text-xs text-gray-500">{modulo.order_index !== undefined && <>Ordem: {modulo.order_index + 1}</>}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          {/* Se não houver módulo selecionado, mostrar mensagem e não exibir aulas */}
          {!moduloSelecionado && modulos.length > 0 && (
            <div className="mt-8 text-gray-500 italic">Selecione um módulo para gerenciar as aulas.</div>
          )}
          {/* Aulas em cards/lista visual */}
          {moduloSelecionado && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Aulas do módulo: <span className="text-blue-700">{moduloSelecionado.title}</span></h4>
                <Button variant="default" onClick={() => handleOpenAulaModal()} className="flex items-center gap-2"><Plus className="h-4 w-4" /> Nova Aula</Button>
              </div>
              {aulas.length === 0 ? (
                <div className="text-gray-500 italic mb-4">Nenhuma aula cadastrada neste módulo.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aulas.map((aula, idx) => (
                    <Card key={aula.id} className="border-2 border-gray-200 hover:border-blue-400 transition-all">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                          {aula.title}
                          {aula.video_url && <Video className="h-4 w-4 text-blue-500" />}
                          {aula.pdf_url && <FileText className="h-4 w-4 text-green-500" />}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button size="icon" variant="outline" onClick={e => { e.stopPropagation(); handleOpenAulaModal(aula); }}><Edit className="h-4 w-4" /></Button>
                          <Button size="icon" variant="destructive" onClick={e => { e.stopPropagation(); handleDeleteAula(aula); }}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-gray-600 mb-2">{aula.description}</CardDescription>
                        <div className="flex items-center gap-2 text-xs text-gray-500">Ordem: {aula.order_index !== undefined ? aula.order_index + 1 : idx + 1}</div>
                        {aula.video_url && (
                          <a href={aula.video_url} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline text-xs mt-2">Assistir vídeo</a>
                        )}
                        {aula.pdf_url && (
                          <a href={aula.pdf_url} target="_blank" rel="noopener noreferrer" className="block text-green-600 hover:underline text-xs mt-1">Ver PDF</a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal Curso */}
      <Dialog open={showCursoModal} onOpenChange={setShowCursoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{cursoForm.id ? 'Editar Curso' : 'Novo Curso'}</DialogTitle>
            <DialogDescription>Preencha os dados do curso e salve para cadastrar ou editar um curso na plataforma.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Título do curso"
            value={cursoForm.title}
            onChange={e => setCursoForm(f => ({ ...f, title: e.target.value }))}
            className="mb-2"
          />
          <Textarea
            placeholder="Descrição"
            value={cursoForm.description}
            onChange={e => setCursoForm(f => ({ ...f, description: e.target.value }))}
            className="mb-2"
          />
          <DialogFooter>
            {cursoForm.id && <Button variant="destructive" onClick={() => handleDeleteCurso(cursos.find(c => c.id === cursoForm.id))}>Remover</Button>}
            <Button onClick={handleSaveCurso}>{cursoForm.id ? 'Salvar' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Módulo */}
      <Dialog open={showModuloModal} onOpenChange={setShowModuloModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{moduloForm.id ? 'Editar Módulo' : 'Novo Módulo'}</DialogTitle>
            <DialogDescription>Preencha os dados do módulo e salve para cadastrar ou editar um módulo deste curso.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Título do módulo"
            value={moduloForm.title}
            onChange={e => setModuloForm(f => ({ ...f, title: e.target.value }))}
            className="mb-2"
          />
          <Textarea
            placeholder="Descrição"
            value={moduloForm.description}
            onChange={e => setModuloForm(f => ({ ...f, description: e.target.value }))}
            className="mb-2"
          />
          <DialogFooter>
            {moduloForm.id && <Button variant="destructive" onClick={() => handleDeleteModulo(modulos.find(m => m.id === moduloForm.id))}>Remover</Button>}
            <Button onClick={handleSaveModulo}>{moduloForm.id ? 'Salvar' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Aula */}
      <Dialog open={showAulaModal} onOpenChange={setShowAulaModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{aulaForm.id ? 'Editar Aula' : 'Nova Aula'}</DialogTitle>
            <DialogDescription>Preencha os dados da aula, faça upload do vídeo e do PDF, e salve para cadastrar ou editar uma aula deste módulo.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Título da aula"
            value={aulaForm.title}
            onChange={e => setAulaForm(f => ({ ...f, title: e.target.value }))}
            className="mb-2"
          />
          <Textarea
            placeholder="Descrição"
            value={aulaForm.description}
            onChange={e => setAulaForm(f => ({ ...f, description: e.target.value }))}
            className="mb-2"
          />
          {/* Upload de vídeo */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Vídeo da aula</label>
            {aulaForm.video_url ? (
              <div className="flex items-center gap-2 mb-1">
                <a href={aulaForm.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">Ver vídeo enviado</a>
                <Button size="sm" variant="destructive" onClick={() => setAulaForm(f => ({ ...f, video_url: '' }))}>Remover</Button>
              </div>
            ) : null}
            <input
              type="file"
              accept="video/*"
              ref={videoInputRef}
              style={{ display: 'none' }}
              onChange={e => {
                if (e.target.files && e.target.files[0]) handleUploadFile(e.target.files[0], 'video');
              }}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => videoInputRef.current?.click()}
              disabled={uploadingVideo}
              className="mt-1"
            >
              {uploadingVideo ? 'Enviando vídeo...' : (aulaForm.video_url ? 'Trocar vídeo' : 'Enviar vídeo')}
            </Button>
          </div>
          {/* Upload de PDF */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Material PDF</label>
            {aulaForm.pdf_url ? (
              <div className="flex items-center gap-2 mb-1">
                <a href={aulaForm.pdf_url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-xs">Ver PDF enviado</a>
                <Button size="sm" variant="destructive" onClick={() => setAulaForm(f => ({ ...f, pdf_url: '' }))}>Remover</Button>
              </div>
            ) : null}
            <input
              type="file"
              accept="application/pdf"
              ref={pdfInputRef}
              style={{ display: 'none' }}
              onChange={e => {
                if (e.target.files && e.target.files[0]) handleUploadFile(e.target.files[0], 'pdf');
              }}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => pdfInputRef.current?.click()}
              disabled={uploadingPDF}
              className="mt-1"
            >
              {uploadingPDF ? 'Enviando PDF...' : (aulaForm.pdf_url ? 'Trocar PDF' : 'Enviar PDF')}
            </Button>
          </div>
          <DialogFooter>
            {aulaForm.id && <Button variant="destructive" onClick={() => handleDeleteAula(aulas.find(a => a.id === aulaForm.id))}>Remover</Button>}
            <Button onClick={handleSaveAula}>{aulaForm.id ? 'Salvar' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CursosAdmin; 