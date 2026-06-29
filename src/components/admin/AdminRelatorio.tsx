import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

const AdminRelatorio = () => {
  const [progresso, setProgresso] = useState<any[]>([]);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);
  const [filtroAluno, setFiltroAluno] = useState('');
  const [filtroCurso, setFiltroCurso] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Buscar alunos
      const { data: alunosData } = await supabase.from('profiles').select('id, full_name, email');
      setAlunos(alunosData || []);
      // Buscar cursos
      const { data: cursosData } = await supabase.from('courses').select('id, title');
      setCursos(cursosData || []);
      // Buscar progresso
      const { data: progData } = await supabase.from('course_progress').select('*');
      // Buscar aulas
      const { data: aulasData } = await supabase.from('course_lessons').select('id, course_id');
      // Mapear progresso por aluno/curso
      const map: any = {};
      for (const row of progData || []) {
        const aula = aulasData.find((a: any) => a.id === row.lesson_id);
        if (!aula) continue;
        const key = row.user_id + '-' + aula.course_id;
        if (!map[key]) map[key] = { user_id: row.user_id, course_id: aula.course_id, concluidas: 0, total: 0, completed_at: null };
        map[key].total++;
        if (row.completed) {
          map[key].concluidas++;
          if (!map[key].completed_at || (row.completed_at && row.completed_at > map[key].completed_at)) {
            map[key].completed_at = row.completed_at;
          }
        }
      }
      // Montar lista final
      const lista: any[] = [];
      for (const key in map) {
        const { user_id, course_id, concluidas, total, completed_at } = map[key];
        const aluno = alunosData.find((a: any) => a.id === user_id);
        const curso = cursosData.find((c: any) => c.id === course_id);
        const percentual = total > 0 ? Math.round((concluidas / total) * 100) : 0;
        lista.push({
          aluno: aluno?.full_name || aluno?.email || user_id,
          curso: curso?.title || course_id,
          percentual,
          concluidas,
          total,
          completed_at: percentual === 100 ? completed_at : null
        });
      }
      setProgresso(lista);
      setLoading(false);
    };
    fetchData();
  }, []);

  const listaFiltrada = progresso.filter((row) =>
    (!filtroAluno || row.aluno.toLowerCase().includes(filtroAluno.toLowerCase())) &&
    (!filtroCurso || row.curso.toLowerCase().includes(filtroCurso.toLowerCase()))
  );

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">Relatório de Progresso dos Alunos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Filtrar por aluno..."
            value={filtroAluno}
            onChange={e => setFiltroAluno(e.target.value)}
            className="w-full md:w-64"
          />
          <Input
            placeholder="Filtrar por curso..."
            value={filtroCurso}
            onChange={e => setFiltroCurso(e.target.value)}
            className="w-full md:w-64"
          />
        </div>
        {loading ? (
          <div className="text-center py-12 text-lg text-gray-600">Carregando relatório...</div>
        ) : listaFiltrada.length === 0 ? (
          <div className="text-center py-12 text-lg text-gray-500">Nenhum dado encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Aluno</th>
                  <th className="px-4 py-2 text-left">Curso</th>
                  <th className="px-4 py-2 text-center">Progresso</th>
                  <th className="px-4 py-2 text-center">% Concluído</th>
                  <th className="px-4 py-2 text-center">Data de Conclusão</th>
                </tr>
              </thead>
              <tbody>
                {listaFiltrada.map((row, idx) => (
                  <tr key={idx} className={row.percentual === 100 ? 'bg-green-50' : ''}>
                    <td className="px-4 py-2">{row.aluno}</td>
                    <td className="px-4 py-2">{row.curso}</td>
                    <td className="px-4 py-2 text-center">
                      <Progress value={row.percentual} />
                      <span className="text-xs text-gray-500">{row.concluidas} de {row.total} aulas</span>
                    </td>
                    <td className="px-4 py-2 text-center font-semibold">{row.percentual}%</td>
                    <td className="px-4 py-2 text-center">{row.percentual === 100 && row.completed_at ? new Date(row.completed_at).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminRelatorio; 