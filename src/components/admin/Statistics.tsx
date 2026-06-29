import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Users, BookOpen, Mail, DollarSign, RefreshCw, TrendingUp, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Statistics = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['site-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_stats')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching site stats:', error);
        throw error;
      }
      
      return data;
    },
  });

  const updateStatsMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('update_site_stats');
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-stats'] });
      toast({
        title: 'Estatísticas atualizadas',
        description: 'As estatísticas foram atualizadas com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar',
        description: 'Erro ao atualizar as estatísticas.',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-lg text-gray-600">Carregando estatísticas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span>Estatísticas da Plataforma</span>
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Visão geral dos dados da plataforma
              </CardDescription>
            </div>
            <Button 
              onClick={() => updateStatsMutation.mutate()}
              disabled={updateStatsMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
            >
              {updateStatsMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Atualizando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Atualizar</span>
                </div>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-md border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-blue-800">Total de Usuários</CardTitle>
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900">{stats?.total_users || 0}</div>
                <p className="text-sm text-blue-700 mt-1">usuários registrados</p>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-green-800">Total de Cursos</CardTitle>
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">{stats?.total_courses || 0}</div>
                <p className="text-sm text-green-700 mt-1">cursos disponíveis</p>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-purple-800">Total de eBooks</CardTitle>
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900">{stats?.total_ebooks || 0}</div>
                <p className="text-sm text-purple-700 mt-1">eBooks disponíveis</p>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-orange-800">Mensagens de Contato</CardTitle>
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-900">{stats?.total_contacts || 0}</div>
                <p className="text-sm text-orange-700 mt-1">contatos recebidos</p>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-emerald-800">Receita Total</CardTitle>
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-900">
                  R$ {stats?.total_revenue ? Number(stats.total_revenue).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                </div>
                <p className="text-sm text-emerald-700 mt-1">receita acumulada</p>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-gray-800">Última Atualização</CardTitle>
                <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-gray-900">
                  {stats?.updated_at ? new Date(stats.updated_at).toLocaleString('pt-BR') : 'Nunca'}
                </div>
                <p className="text-sm text-gray-700 mt-1">dados atualizados</p>
              </CardContent>
            </Card>
          </div>

          {/* Informações adicionais */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900">Resumo Geral</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <p className="text-blue-600 font-medium">Crescimento</p>
                <p className="text-gray-900 font-semibold">+12% este mês</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <p className="text-green-600 font-medium">Engajamento</p>
                <p className="text-gray-900 font-semibold">85% ativo</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <p className="text-purple-600 font-medium">Satisfação</p>
                <p className="text-gray-900 font-semibold">4.8/5.0</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
