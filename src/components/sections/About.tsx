
import { Award, Users, BookOpen, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ContentType {
  conquistas?: string;
  depoimentos?: string;
  stats?: string;
  badge?: string;
  titulo?: string;
  nome?: string;
  paragrafo1?: string;
  paragrafo2?: string;
  botao_link?: string;
  botao_sessao?: string;
  botao?: string;
  imagem?: string;
}

const About = () => {
  const [content, setContent] = useState<ContentType>({});
  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from('site_content').select('*').eq('section', 'sobre');
      const map = {};
      data?.forEach(item => { map[item.key] = item.value; });
      setContent(map);
    };
    fetchContent();
  }, []);

  const conquistas = JSON.parse(content.conquistas || '[]');
  const depoimentos = JSON.parse(content.depoimentos || '[]');
  const stats = JSON.parse(content.stats || '[]');

  return (
    <section id="sobre" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 text-blue-600 border-blue-600">
            {content.badge}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.titulo}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Content */}
          <div className="animate-fade-in">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              {content.nome}
            </h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {content.paragrafo1}
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {content.paragrafo2}
            </p>
            

            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300"
              onClick={() => {
                if (content.botao_link) {
                  window.location.href = content.botao_link;
                } else if (content.botao_sessao) {
                  document.getElementById(content.botao_sessao)?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {content.botao}
            </Button>
          </div>

          {/* Image */}
          <div className="relative animate-scale-in">
            <div className="relative">
              <img 
                src={content.imagem} 
                alt={content.nome} 
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              
              {/* Floating Achievement Cards */}
              {stats[0] && (
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg p-4 shadow-lg animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats[0].valor}</div>
                    <div className="text-sm text-gray-600">{stats[0].descricao}</div>
                  </div>
                </div>
              )}
              
              {stats[1] && (
              <div className="absolute -top-6 -right-6 bg-white rounded-lg p-4 shadow-lg animate-fade-in" style={{ animationDelay: '1s' }}>
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats[1].valor}</div>
                    <div className="text-sm text-gray-600">{stats[1].descricao}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {conquistas.map((conq, i) => (
            <Card 
              key={i} 
              className="text-center p-6 hover:shadow-lg transition-shadow duration-300 animate-fade-in border-0"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{conq.titulo}</h4>
                <p className="text-gray-600">{conq.descricao}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="animate-fade-in">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              O que dizem nossos alunos
            </h3>
            <p className="text-xl text-gray-600">
              Depoimentos reais de profissionais que transformaram suas carreiras
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {depoimentos.map((dep, i) => (
              <Card 
                key={i} 
                className="p-6 hover:shadow-lg transition-shadow duration-300 animate-fade-in border-0"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    {[...Array(dep.nota)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{dep.texto}"</p>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={dep.avatar} 
                      alt={dep.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{dep.nome}</div>
                      <div className="text-sm text-gray-600">{dep.cargo}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
