
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, LogOut } from 'lucide-react';
import ProfileManager from '@/components/ProfileManager';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [compras, setCompras] = useState([]);
  const [produtos, setProdutos] = useState({});
  const [loadingCompras, setLoadingCompras] = useState(true);

  // Redireciona admin para o painel administrativo
  useEffect(() => {
    if (profile && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [profile, isAdmin, navigate]);

  // Buscar compras aprovadas do usuário e nomes dos produtos
  useEffect(() => {
    const fetchCompras = async () => {
      if (!profile) return;
      setLoadingCompras(true);
      const { data, error } = await supabase
        .from('compras')
        .select('*')
        .eq('user_id', profile.id)
        .eq('status', 'approved');
      setCompras(data || []);
      // Buscar nomes dos produtos
      const nomes = {};
      for (const compra of data || []) {
        if (compra.product_type === 'course') {
          const { data: curso } = await supabase
            .from('courses')
            .select('title')
            .eq('id', compra.product_id)
            .maybeSingle();
          nomes[compra.product_id] = { title: curso?.title || compra.product_id };
        } else if (compra.product_type === 'ebook') {
          const { data: ebook } = await supabase
            .from('ebooks')
            .select('title, pdf_url')
            .eq('id', compra.product_id)
            .maybeSingle();
          nomes[compra.product_id] = {
            title: ebook?.title || compra.product_id,
            pdf_url: ebook?.pdf_url || ''
          };
        }
      }
      setProdutos(nomes);
      setLoadingCompras(false);
    };
    fetchCompras();
  }, [profile]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  // Se for admin, não mostra nada pois será redirecionado
  if (isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.location.href = '/'}
              className="mr-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-semibold"
            >
              ← Voltar para o Site
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard do Aluno</h1>
              <p className="text-gray-600">Bem-vindo, {profile.full_name || profile.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={signOut}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Perfil do Usuário */}
          <ProfileManager />

          {/* Meus Cursos/Ebooks */}
          <Card>
            <CardHeader>
              <CardTitle>Meus Produtos Liberados</CardTitle>
              <CardDescription>
                Acesse seus cursos e eBooks comprados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingCompras ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando seus produtos...</p>
                </div>
              ) : compras.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum curso ou eBook liberado ainda</p>
                  <Button className="mt-4" onClick={() => window.location.href = '/#cursos'}>
                    Explorar Cursos
                  </Button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {compras.map((compra) => (
                    <li key={compra.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <span className="font-semibold">{compra.product_type === 'course' ? 'Curso' : 'eBook'}:</span> {produtos[compra.product_id]?.title || compra.product_id}
                      </div>
                      {compra.product_type === 'ebook' ? (
                        <a
                          href={produtos[compra.product_id]?.pdf_url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-center"
                          style={{ minWidth: 140 }}
                        >
                          Baixar eBook
                        </a>
                      ) : (
                        <Button
                          className="mt-2 md:mt-0"
                          onClick={() => window.location.href = `/cursos/${compra.product_id}`}
                        >
                          Acessar Curso
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cursos Recomendados */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Cursos Recomendados</CardTitle>
            <CardDescription>
              Baseado no seu perfil e interesses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Explore nossos cursos especializados em saúde
              </p>
              <Button onClick={() => window.location.href = '/#cursos'}>
                Ver Todos os Cursos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
