import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Mail, Calendar, Shield, User, Trash2, UserCheck, UserX } from 'lucide-react';

const StudentsManagement = () => {
  const queryClient = useQueryClient();

  const { data: students, isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching students:', error);
        throw error;
      }
      
      return data;
    },
  });

  const toggleAdminMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: 'student' | 'admin' }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-lg text-gray-600">Carregando alunos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg border-red-200 bg-red-50">
        <CardContent className="py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-lg font-medium text-red-800">Erro ao carregar alunos</p>
            <p className="text-red-600 mt-2">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const adminCount = students?.filter(s => s.role === 'admin').length || 0;
  const studentCount = students?.filter(s => s.role === 'student').length || 0;

  return (
    <div className="space-y-8">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Total de Usuários</p>
                <p className="text-3xl font-bold text-blue-900">{students?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Alunos</p>
                <p className="text-3xl font-bold text-green-900">{studentCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-800">Administradores</p>
                <p className="text-3xl font-bold text-purple-900">{adminCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de usuários */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Gerenciamento de Alunos</CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Visualize e gerencie todos os usuários da plataforma
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
              {students?.length || 0} usuários
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {students && students.length > 0 ? (
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-900">Usuário</TableHead>
                    <TableHead className="font-semibold text-gray-900">Contato</TableHead>
                    <TableHead className="font-semibold text-gray-900">Função</TableHead>
                    <TableHead className="font-semibold text-gray-900">Data de Registro</TableHead>
                    <TableHead className="text-right font-semibold text-gray-900">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{student.full_name || 'Nome não informado'}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                              <span>ID: {student.id.slice(0, 8)}...</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-900">{student.email}</span>
                          </div>
                          {student.phone && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>{student.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {student.role === 'admin' ? (
                            <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 flex items-center space-x-1">
                              <Shield className="h-3 w-3" />
                              <span>Administrador</span>
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 border-0 flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>Aluno</span>
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-900 font-medium">
                            {new Date(student.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleAdminMutation.mutate({
                              userId: student.id,
                              newRole: student.role === 'admin' ? 'student' : 'admin'
                            })}
                            disabled={toggleAdminMutation.isPending}
                            className={
                              student.role === 'admin' 
                                ? "hover:bg-red-50 hover:text-red-600 hover:border-red-200" 
                                : "hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                            }
                          >
                            {toggleAdminMutation.isPending ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            ) : student.role === 'admin' ? (
                              <>
                                <UserX className="h-4 w-4 mr-1" />
                                Remover Admin
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Tornar Admin
                              </>
                            )}
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
                <Users className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-xl font-medium text-gray-600 mb-2">Nenhum usuário encontrado</p>
              <p className="text-gray-500">Ainda não há usuários registrados na plataforma</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsManagement;
