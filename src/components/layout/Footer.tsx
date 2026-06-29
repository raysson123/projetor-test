
import { BookOpen, Mail, Phone, MapPin, MessageCircle, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FooterContent {
  [key: string]: string;
}

interface Course {
  id: string;
  title: string;
  description?: string;
}

interface Stat {
  titulo: string;
  valor: string;
}

interface Link {
  titulo: string;
  href: string;
}

const Footer = () => {
  const [content, setContent] = useState<FooterContent>({});
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Buscar conteúdo do footer
        const { data: contentData, error: contentError } = await supabase
          .from('site_content')
          .select('*')
          .eq('section', 'rodape');

        if (contentError) throw contentError;

        const contentMap: FooterContent = {};
        contentData?.forEach(item => {
          contentMap[item.key] = item.value;
        });
        setContent(contentMap);

        // Buscar cursos populares (top 4)
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('id, title, description')
          .limit(4);

        if (coursesError) throw coursesError;
        setCourses(coursesData || []);
      } catch (err) {
        console.error('Erro ao buscar dados do footer:', err);
        setError('Erro ao carregar dados do footer');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentYear = new Date().getFullYear();

  const parseJsonSafe = (value: string): Link[] => {
    try {
      return JSON.parse(value || '[]');
    } catch {
      console.error('Erro ao parsear JSON:', value);
      return [];
    }
  };

  const parseStatsSafe = (value: string): Stat[] => {
    try {
      return JSON.parse(value || '[]');
    } catch {
      console.error('Erro ao parsear stats:', value);
      return [];
    }
  };

  const links_rapidos = parseJsonSafe(content.links_rapidos);
  const links_legais = parseJsonSafe(content.links_legais);
  const stats = parseStatsSafe(content.rodape_stats);

  if (isLoading) {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-gray-400">Carregando informações do footer...</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Fique por dentro das novidades
            </h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Receba dicas exclusivas, conteúdos gratuitos e seja o primeiro a saber sobre 
              novos cursos e promoções especiais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            <Button
                onClick={() => {
                  if (content.newsletter_botao_link) {
                    window.location.href = content.newsletter_botao_link;
                  } else if (content.newsletter_botao_sessao) {
                    document.getElementById(content.newsletter_botao_sessao)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {content.newsletter_botao || 'Inscrever-se'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {stats.length > 0 && (
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{stat.valor}</div>
                  <div className="text-gray-300">{stat.titulo}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex flex-col">
                <span className="text-xl font-bold">Denis Marques</span>
                <span className="text-xs text-gray-400">Especialista em Gestão</span>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">{content.descricao || 'Especialista em Gestão de Saúde'}</p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">{content.telefone || '(11) 98765-4321'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">{content.email || 'contato@example.com'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">{content.endereco || 'São Paulo, SP - Brasil'}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              {links_rapidos.length > 0 ? (
                links_rapidos.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                    >
                      {link.titulo}
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm">Nenhum link disponível</li>
              )}
              <li>
                <Button
                  onClick={() => {
                    if (content.aluno_botao_link) {
                      window.location.href = content.aluno_botao_link;
                    } else if (content.aluno_botao_sessao) {
                      document.getElementById(content.aluno_botao_sessao)?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {content.aluno_botao || 'Área do Aluno'}
                </Button>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Cursos Populares</h4>
            <ul className="space-y-3">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <li key={course.id}>
                    <a 
                      href={`/cursos/${course.id}`}
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-2"
                    >
                      <FileText className="h-3 w-3" />
                      <span>{course.title}</span>
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm">Nenhum curso disponível</li>
              )}
            </ul>
            
            <div className="mt-6">
              <Button 
                onClick={() => {
                  if (content.whatsapp_botao_link) {
                    window.location.href = content.whatsapp_botao_link;
                  } else if (content.whatsapp_botao_sessao) {
                    document.getElementById(content.whatsapp_botao_sessao)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {content.whatsapp_botao || 'Suporte WhatsApp'}
              </Button>
            </div>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Suporte</h4>
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Atendimento</div>
                <div className="text-white font-medium">Seg-Sex: 8h às 18h</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Resposta média</div>
                <div className="text-white font-medium">24 horas</div>
              </div>
              
              <Button
                onClick={() => {
                  if (content.ajuda_botao_link) {
                    window.location.href = content.ajuda_botao_link;
                  } else if (content.ajuda_botao_sessao) {
                    document.getElementById(content.ajuda_botao_sessao)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {content.ajuda_botao || 'Central de Ajuda'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              {content.copyright || `© ${currentYear} MedCursos. Todos os direitos reservados.`}
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              {links_legais.length > 0 ? (
                links_legais.map((link, index) => (
                  <a 
                    key={index}
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {link.titulo}
                  </a>
                ))
              ) : (
                <span className="text-sm text-gray-500">Nenhum link legal disponível</span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {/*<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-sm text-gray-400">Online agora</span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
