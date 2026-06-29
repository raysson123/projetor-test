import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, ShoppingCart, Calendar, BarChart3, BookOpen, FileText } from 'lucide-react';

const Revenue = () => {
  // Dados mockados para demonstração
  const revenueData = [
    { month: 'Janeiro', courses: 1200, ebooks: 800, total: 2000 },
    { month: 'Fevereiro', courses: 1500, ebooks: 900, total: 2400 },
    { month: 'Março', courses: 1800, ebooks: 1200, total: 3000 },
    { month: 'Abril', courses: 2100, ebooks: 1400, total: 3500 },
    { month: 'Maio', courses: 2400, ebooks: 1600, total: 4000 },
    { month: 'Junho', courses: 2700, ebooks: 1800, total: 4500 },
  ];

  const totalRevenue = revenueData.reduce((sum, month) => sum + month.total, 0);
  const totalCourses = revenueData.reduce((sum, month) => sum + month.courses, 0);
  const totalEbooks = revenueData.reduce((sum, month) => sum + month.ebooks, 0);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <span>Receitas e Vendas</span>
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Acompanhe o desempenho financeiro da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-md border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-emerald-800">Receita Total</CardTitle>
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-900">
                  R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-emerald-700 mt-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-blue-800">Vendas de Cursos</CardTitle>
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900">
                  R$ {totalCourses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-blue-700 mt-2">
                  {((totalCourses / totalRevenue) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-purple-800">Vendas de eBooks</CardTitle>
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900">
                  R$ {totalEbooks.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-purple-700 mt-2">
                  {((totalEbooks / totalRevenue) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-md border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Receita Mensal</span>
              </CardTitle>
              <CardDescription className="text-gray-600">
                Breakdown das vendas por mês
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {revenueData.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-900 text-lg">{month.month}</span>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Cursos</p>
                        <p className="font-semibold text-blue-900">R$ {month.courses.toLocaleString('pt-BR')}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">eBooks</p>
                        <p className="font-semibold text-purple-900">R$ {month.ebooks.toLocaleString('pt-BR')}</p>
                      </div>
                      <div className="text-center">
                        <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 px-4 py-2 text-base">
                          R$ {month.total.toLocaleString('pt-BR')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resumo adicional */}
          <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-900">Tendência de Crescimento</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <p className="text-emerald-600 font-medium">Crescimento Mensal</p>
                <p className="text-gray-900 font-semibold">+15%</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <p className="text-blue-600 font-medium">Melhor Mês</p>
                <p className="text-gray-900 font-semibold">Junho</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <p className="text-purple-600 font-medium">Meta Anual</p>
                <p className="text-gray-900 font-semibold">85%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Revenue;
