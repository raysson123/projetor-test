import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Video, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import jsPDF from 'jspdf';

const Curso = () => {
  const { id } = useParams();
  const { profile } = useAuth();
  const [curso, setCurso] = useState<any>(null);
  const [modulos, setModulos] = useState<any[]>([]);
  const [aulas, setAulas] = useState<{ [moduloId: string]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [progresso, setProgresso] = useState<{ [lessonId: string]: boolean }>({});
  const [saving, setSaving] = useState<string | null>(null);
  const navigate = useNavigate();

  // Buscar progresso do usuário
  useEffect(() => {
    const fetchProgresso = async () => {
      if (!profile || !id) return;
      const { data } = await supabase
        .from('course_progress')
        .select('lesson_id, completed')
        .eq('user_id', profile.id)
        .eq('course_id', id);
      const map: { [lessonId: string]: boolean } = {};
      data?.forEach((row: any) => { map[row.lesson_id] = row.completed; });
      setProgresso(map);
    };
    fetchProgresso();
  }, [profile, id]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Buscar curso
      const { data: cursoData } = await supabase.from('courses').select('*').eq('id', id).single();
      setCurso(cursoData);
      // Buscar módulos
      const { data: modulosData } = await supabase.from('course_modules').select('*').eq('course_id', id).order('order_index');
      setModulos(modulosData || []);
      // Buscar aulas de cada módulo
      const aulasPorModulo: { [moduloId: string]: any[] } = {};
      for (const modulo of modulosData || []) {
        const { data: aulasData } = await supabase.from('course_lessons').select('*').eq('module_id', modulo.id).order('order_index');
        aulasPorModulo[modulo.id] = aulasData || [];
      }
      setAulas(aulasPorModulo);
      setLoading(false);
    };
    if (id) fetchData();
  }, [id]);

  // Função para marcar aula como concluída
  const marcarConcluida = async (lessonId: string, concluida: boolean) => {
    if (!profile || !id) return;
    setSaving(lessonId);
    // Upsert progresso
    await supabase.from('course_progress').upsert({
      user_id: profile.id,
      course_id: id,
      lesson_id: lessonId,
      completed: concluida,
      completed_at: concluida ? new Date().toISOString() : null
    });
    setProgresso((prev) => ({ ...prev, [lessonId]: concluida }));
    setSaving(null);
  };

  // Calcular progresso
  const totalAulas = Object.values(aulas).flat().length;
  const concluidas = Object.keys(progresso).filter((lid) => progresso[lid]).length;
  const percentual = totalAulas > 0 ? Math.round((concluidas / totalAulas) * 100) : 0;

  const emitirCertificado = () => {
    if (!profile || !curso) return;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    // Faixa azul no topo
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, 297, 25, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(30);
    doc.text('Certificado de Conclusão', 148.5, 17, { align: 'center' });
    // Texto de prestígio
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text('Parabenizamos', 148.5, 45, { align: 'center' });
    // Nome do aluno em destaque
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(30, 64, 175);
    doc.text(profile.full_name || profile.email, 148.5, 62, { align: 'center' });
    // Texto intermediário
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('pela dedicação e excelência ao concluir o curso', 148.5, 78, { align: 'center' });
    // Nome do curso em destaque
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(30, 64, 175);
    doc.text(curso.title, 148.5, 92, { align: 'center' });
    // Professor mencionado no texto
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(15);
    doc.setTextColor(0, 0, 0);
    doc.text('sob orientação do professor Denis Marques', 148.5, 108, { align: 'center' });
    // Data e carga horária
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text(`Data de conclusão: ${new Date().toLocaleDateString()}    Carga horária: ${curso.duration || '---'} horas`, 148.5, 125, { align: 'center' });
    // Linha e local para assinatura do aluno
    doc.setDrawColor(120, 120, 120);
    doc.line(60, 170, 130, 170);
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text('Assinatura do Aluno', 95, 178, { align: 'center' });
    // Rodapé
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text('Certificado gerado automaticamente pelo sistema.', 148.5, 200, { align: 'center' });
    doc.save(`certificado-${curso.title}.pdf`);
  };

  if (loading) return <div className="p-8 text-center text-lg">Carregando curso...</div>;
  if (!curso) return <div className="p-8 text-center text-lg text-red-600">Curso não encontrado.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-start p-0">
      <div className="w-full max-w-4xl px-4 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-semibold"
        >
          ← Voltar para Dashboard
        </button>
        {/* Botão de certificado */}
        {percentual === 100 && (
          <button
            onClick={emitirCertificado}
            className="mb-4 ml-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-semibold"
          >
            Emitir Certificado
          </button>
        )}
        <h1 className="text-3xl font-bold mb-2">{curso.title}</h1>
        <p className="text-gray-600 mb-6">{curso.description}</p>
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <span className="font-semibold text-blue-700">Progresso do curso:</span>
            <span className="text-sm text-gray-700">{concluidas} de {totalAulas} aulas ({percentual}%)</span>
          </div>
          <Progress value={percentual} />
        </div>
        <Accordion type="multiple" className="mb-8">
          {modulos.map((modulo: any) => (
            <AccordionItem key={modulo.id} value={modulo.id}>
              <AccordionTrigger>
                <span className="text-lg font-semibold">{modulo.title}</span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-500 mb-2">{modulo.description}</p>
                {aulas[modulo.id]?.length === 0 ? (
                  <div className="text-gray-400 italic">Nenhuma aula neste módulo.</div>
                ) : (
                  <div className="space-y-4">
                    {aulas[modulo.id].map((aula: any) => {
                      const concluida = !!progresso[aula.id];
                      return (
                        <Card key={aula.id} className={`border ${concluida ? 'border-green-400 bg-green-50' : 'border-gray-200'} transition-all`}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                              {aula.title}
                              {aula.video_url && <Video className="h-4 w-4 text-blue-500" />}
                              {aula.pdf_url && <FileText className="h-4 w-4 text-green-500" />}
                              {concluida && <span className="ml-2 text-green-600 text-xs font-semibold">Concluída</span>}
                            </CardTitle>
                            <CardDescription>{aula.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            {aula.video_url && (
                              <a href={aula.video_url} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline mb-2">Assistir vídeo</a>
                            )}
                            {aula.pdf_url && (
                              <a href={aula.pdf_url} target="_blank" rel="noopener noreferrer" className="block text-green-600 hover:underline">Baixar PDF</a>
                            )}
                            <div className="mt-2 flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={concluida}
                                disabled={saving === aula.id}
                                onChange={e => marcarConcluida(aula.id, e.target.checked)}
                                id={`concluida-${aula.id}`}
                              />
                              <label htmlFor={`concluida-${aula.id}`} className="text-sm">
                                Marcar como concluída
                              </label>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default Curso; 