import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, Mail, Settings, LogOut, BarChart3, DollarSign, ShoppingCart, Shield } from 'lucide-react';
import CoursesManagement from './CoursesManagement';
import EBooksManagement from './EBooksManagement';
import ContactsManagement from './ContactsManagement';
import StudentsManagement from './StudentsManagement';
import SiteSettings from './SiteSettings';
import Statistics from './Statistics';
import Revenue from './Revenue';
import AdminRelatorio from './AdminRelatorio';

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-600">Bem-vindo, {profile?.full_name || profile?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={signOut}
              className="flex items-center space-x-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-8 bg-white shadow-sm border border-gray-200 p-1 rounded-xl">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="statistics"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all"
            >
              Estatísticas
            </TabsTrigger>
            <TabsTrigger 
              value="students"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all"
            >
              Alunos
            </TabsTrigger>
            <TabsTrigger 
              value="courses"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all"
            >
              Cursos
            </TabsTrigger>
            <TabsTrigger 
              value="ebooks"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all"
            >
              eBooks
            </TabsTrigger>
            <TabsTrigger 
              value="revenue"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all"
            >
              Receitas
            </TabsTrigger>
            <TabsTrigger 
              value="contacts"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all"
            >
              Contatos
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all"
            >
              Configurações
            </TabsTrigger>
            <TabsTrigger 
              value="relatorio" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all"
            >
              Relatório
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Cards de estatísticas */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800">Total de Alunos</CardTitle>
                  <Users className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900">-</div>
                  <p className="text-xs text-blue-700">alunos registrados</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800">Total de Cursos</CardTitle>
                  <BookOpen className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">-</div>
                  <p className="text-xs text-green-700">cursos disponíveis</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-800">Receita Total</CardTitle>
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900">R$ -</div>
                  <p className="text-xs text-purple-700">receita acumulada</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-800">Mensagens</CardTitle>
                  <Mail className="h-5 w-5 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-900">-</div>
                  <p className="text-xs text-orange-700">contatos recebidos</p>
                </CardContent>
              </Card>
            </div>

            {/* Ações rápidas */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-gray-900">Ações Rápidas</CardTitle>
                <CardDescription className="text-gray-600">
                  Gerenciar conteúdo da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    onClick={() => setActiveTab('students')}
                    className="flex flex-col items-center space-y-2 h-24 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                  >
                    <Users className="h-6 w-6" />
                    <span className="text-sm font-medium">Gerenciar Alunos</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('courses')}
                    className="flex flex-col items-center space-y-2 h-24 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg border-0"
                  >
                    <BookOpen className="h-6 w-6" />
                    <span className="text-sm font-medium">Gerenciar Cursos</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('revenue')}
                    className="flex flex-col items-center space-y-2 h-24 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg border-0"
                  >
                    <DollarSign className="h-6 w-6" />
                    <span className="text-sm font-medium">Ver Receitas</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('settings')}
                    className="flex flex-col items-center space-y-2 h-24 bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg border-0"
                  >
                    <Settings className="h-6 w-6" />
                    <span className="text-sm font-medium">Configurações</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/editar-site'}
                    className="flex flex-col items-center space-y-2 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg border-0"
                  >
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-sm font-medium">Editar Site</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="bg-white rounded-xl shadow-lg p-6">
            <Statistics />
          </TabsContent>

          <TabsContent value="students" className="bg-white rounded-xl shadow-lg p-6">
            <StudentsManagement />
          </TabsContent>

          <TabsContent value="courses" className="bg-white rounded-xl shadow-lg p-6">
            <CoursesManagement />
          </TabsContent>

          <TabsContent value="ebooks" className="bg-white rounded-xl shadow-lg p-6">
            <EBooksManagement />
          </TabsContent>

          <TabsContent value="revenue" className="bg-white rounded-xl shadow-lg p-6">
            <Revenue />
          </TabsContent>

          <TabsContent value="contacts" className="bg-white rounded-xl shadow-lg p-6">
            <ContactsManagement />
          </TabsContent>

          <TabsContent value="settings" className="bg-white rounded-xl shadow-lg p-6">
            <SiteSettings />
          </TabsContent>

          <TabsContent value="relatorio" className="space-y-8">
            <AdminRelatorio />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
