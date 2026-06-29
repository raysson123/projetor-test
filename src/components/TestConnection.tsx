import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TestConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [courses, setCourses] = useState<any[]>([]);
  const [ebooks, setEbooks] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Testar conexão básica
      const { data, error } = await supabase.from('courses').select('count').limit(1);
      
      if (error) {
        console.error('Erro na conexão:', error);
        setConnectionStatus('error');
        return;
      }

      setConnectionStatus('success');
      
      // Carregar dados das tabelas
      await loadData();
      
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      setConnectionStatus('error');
    }
  };

  const loadData = async () => {
    try {
      // Carregar cursos
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (coursesData) setCourses(coursesData);

      // Carregar eBooks
      const { data: ebooksData } = await supabase
        .from('ebooks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (ebooksData) setEbooks(ebooksData);

      // Carregar contatos
      const { data: contactsData } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (contactsData) setContacts(contactsData);

      // Carregar estatísticas
      const { data: statsData } = await supabase
        .from('site_stats')
        .select('*')
        .single();
      
      if (statsData) setStats(statsData);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'success': return 'Conectado';
      case 'error': return 'Erro na Conexão';
      default: return 'Testando...';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Status da Conexão Supabase
            <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant={connectionStatus === 'success' ? 'default' : 'destructive'}>
              {getStatusText()}
            </Badge>
            <Button onClick={testConnection} size="sm">
              Testar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>

      {connectionStatus === 'success' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Estatísticas */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas do Site</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total de Cursos:</span>
                    <Badge>{stats.total_courses || 0}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Total de eBooks:</span>
                    <Badge>{stats.total_ebooks || 0}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Total de Contatos:</span>
                    <Badge>{stats.total_contacts || 0}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Total de Usuários:</span>
                    <Badge>{stats.total_users || 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cursos */}
          <Card>
            <CardHeader>
              <CardTitle>Cursos ({courses.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {courses.length > 0 ? (
                <div className="space-y-2">
                  {courses.map((course) => (
                    <div key={course.id} className="p-2 border rounded">
                      <div className="font-medium">{course.title}</div>
                      <div className="text-sm text-gray-600">
                        R$ {course.price} - {course.duration}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Nenhum curso encontrado</p>
              )}
            </CardContent>
          </Card>

          {/* eBooks */}
          <Card>
            <CardHeader>
              <CardTitle>eBooks ({ebooks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {ebooks.length > 0 ? (
                <div className="space-y-2">
                  {ebooks.map((ebook) => (
                    <div key={ebook.id} className="p-2 border rounded">
                      <div className="font-medium">{ebook.title}</div>
                      <div className="text-sm text-gray-600">
                        R$ {ebook.price} - {ebook.pages} páginas
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Nenhum eBook encontrado</p>
              )}
            </CardContent>
          </Card>

          {/* Contatos */}
          <Card>
            <CardHeader>
              <CardTitle>Contatos ({contacts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {contacts.length > 0 ? (
                <div className="space-y-2">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="p-2 border rounded">
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-gray-600">{contact.email}</div>
                      <div className="text-xs text-gray-500">{contact.subject}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Nenhum contato encontrado</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TestConnection; 