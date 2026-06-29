import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Phone, Calendar, Trash2, MessageSquare, User } from 'lucide-react';

const ContactsManagement = () => {
  const { data: contacts, isLoading, error } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching contacts:', error);
        throw error;
      }
      
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-lg text-gray-600">Carregando contatos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg border-red-200 bg-red-50">
        <CardContent className="py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-lg font-medium text-red-800">Erro ao carregar contatos</p>
            <p className="text-red-600 mt-2">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const todayContacts = contacts?.filter(c => {
    const today = new Date().toDateString();
    const contactDate = new Date(c.created_at).toDateString();
    return today === contactDate;
  }).length || 0;

  const thisWeekContacts = contacts?.filter(c => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(c.created_at) > weekAgo;
  }).length || 0;

  return (
    <div className="space-y-8">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Total de Mensagens</p>
                <p className="text-3xl font-bold text-blue-900">{contacts?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Hoje</p>
                <p className="text-3xl font-bold text-green-900">{todayContacts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-800">Esta Semana</p>
                <p className="text-3xl font-bold text-purple-900">{thisWeekContacts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de contatos */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Gerenciamento de Contatos</CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Visualize e gerencie todas as mensagens recebidas
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
              {contacts?.length || 0} mensagens
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {contacts && contacts.length > 0 ? (
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-900">Contato</TableHead>
                    <TableHead className="font-semibold text-gray-900">Assunto</TableHead>
                    <TableHead className="font-semibold text-gray-900">Mensagem</TableHead>
                    <TableHead className="font-semibold text-gray-900">Data</TableHead>
                    <TableHead className="text-right font-semibold text-gray-900">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="space-y-2">
                            <p className="font-semibold text-gray-900">{contact.name}</p>
                            <div className="flex items-center space-x-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-700">{contact.email}</span>
                            </div>
                            {contact.phone && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-700">{contact.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-full text-sm">
                          {contact.subject}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-700 max-w-xs line-clamp-2 leading-relaxed">
                          {contact.message}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-900 font-medium">
                            {new Date(contact.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-xl font-medium text-gray-600 mb-2">Nenhuma mensagem encontrada</p>
              <p className="text-gray-500">Ainda não há mensagens de contato recebidas</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactsManagement;
