
import { BookOpen, Mail, Phone, MapPin, MessageCircle, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Footer = () => {
  const [content, setContent] = useState({});
  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from('site_content').select('*').eq('section', 'rodape');
      const map = {};
      data?.forEach(item => { map[item.key] = item.value; });
      setContent(map);
    };
    fetchContent();
  }, []);

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { title: "Início", href: "#inicio" },
    { title: "Cursos", href: "#cursos" },
    { title: "eBooks", href: "#ebooks" },
    { title: "Sobre", href: "#sobre" },
    { title: "Contato", href: "#contato" }
  ];

  const courses = [
    { title: "Faturamento Médico", href: "#" },
    { title: "Administração Hospitalar", href: "#" },
    { title: "Auditoria Médica", href: "#" },
    { title: "Gestão da Qualidade", href: "#" }
  ];

  const legalLinks = [
    { title: "Política de Privacidade", href: "#" },
    { title: "Termos de Uso", href: "#" },
    { title: "Política de Reembolso", href: "#" },
    { title: "Cookies", href: "#" }
  ];

  const links_rapidos = JSON.parse(content.links_rapidos || '[]');
  const links_legais = JSON.parse(content.links_legais || '[]');
  const stats = JSON.parse(content.rodape_stats || '[]');

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
                {content.newsletter_botao}
              </Button>
            </div>
          </div>
        </div>
      </div>

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
            
            <p className="text-gray-400 mb-6 leading-relaxed">{content.descricao}</p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">{content.telefone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">{content.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">{content.endereco}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              {links_rapidos.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.titulo}
                  </a>
                </li>
              ))}
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
                  {content.aluno_botao}
                </Button>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Cursos Populares</h4>
            <ul className="space-y-3">
              {courses.map((course, index) => (
                <li key={index}>
                  <a 
                    href={course.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center space-x-2"
                  >
                    <FileText className="h-3 w-3" />
                    <span>{course.title}</span>
                  </a>
                </li>
              ))}
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
                {content.whatsapp_botao}
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
                {content.ajuda_botao}
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
              {links_legais.map((link, index) => (
                <a 
                  key={index}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {link.titulo}
                </a>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">Online agora</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
