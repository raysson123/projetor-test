
import { Clock, Users, Star, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCourses } from '@/hooks/useCourses';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// Removido Stripe do handleStripeCheckout. Pronto para integração Mercado Pago.
// Corrigido: NÃO chame useAuth aqui!
const handleMercadoPagoCheckout = async (course) => {
  const { profile } = useAuth();
  if (!profile || !profile.email) {
    alert('Você precisa estar logado para comprar!');
    return;
  }
  const success_url = window.location.origin.startsWith('http') ? window.location.origin + '/sucesso' : 'https://sitedenis-principal.vercel.app/sucesso';
  const cancel_url = window.location.origin.startsWith('http') ? window.location.origin + '/cancelado' : 'https://sitedenis-principal.vercel.app/cancelado';
  const endpoint =
    window.location.hostname === 'localhost'
      ? '/create-mercadopago-checkout'
      : '/api/create-mercadopago-checkout';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product: {
        id: course.id,
        name: course.title,
        price: Math.round(course.price * 100),
        type: 'course',
        image: course.image_url
      },
      payer: { email: profile.email },
      success_url,
      cancel_url
    })
  });
  const data = await response.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert('Erro ao criar checkout Mercado Pago: ' + data.error);
  }
};

const Courses = () => {
  const { data: courses, isLoading, error } = useCourses();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { profile } = useAuth();
  const [content, setContent] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from('site_content').select('*').eq('section', 'cursos');
      const map = {};
      data?.forEach(item => { map[item.key] = item.value; });
      setContent(map);
    };
    fetchContent();
  }, []);

  // Corrigido: use profile do hook acima
  const handleMercadoPagoCheckout = async (course) => {
    if (!profile || !profile.email) {
      alert('Você precisa estar logado para comprar!');
      return;
    }
    const success_url = window.location.origin.startsWith('http') ? window.location.origin + '/sucesso' : 'https://sitedenis-principal.vercel.app/sucesso';
    const cancel_url = window.location.origin.startsWith('http') ? window.location.origin + '/cancelado' : 'https://sitedenis-principal.vercel.app/cancelado';
    const endpoint =
      window.location.hostname === 'localhost'
        ? '/create-mercadopago-checkout'
        : '/api/create-mercadopago-checkout';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product: {
          id: course.id,
          name: course.title,
          price: Math.round(course.price * 100),
          type: 'course',
          image: course.image_url
        },
        payer: { id: profile.id, email: profile.email }, // Corrigido: envia id do usuário
        success_url,
        cancel_url
      })
    });
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      alert('Erro inesperado na resposta do servidor. Veja o console para detalhes.');
      console.error('Resposta recebida:', text);
      return;
    }
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Erro ao criar checkout Mercado Pago: ' + data.error);
    }
  };

  if (isLoading) {
    return (
      <section id="cursos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando cursos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="cursos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Erro ao carregar cursos. Tente novamente.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="cursos" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 text-blue-600 border-blue-600">
            {content.badge || 'Cursos Especializados'}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.titulo || 'Transforme sua Carreira na Área da Saúde'}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800"> Área da Saúde</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.subtitulo || 'Cursos práticos e atualizados, desenvolvidos por especialistas com mais de 15 anos de experiência em gestão e administração da saúde.'}
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses?.map((course, index) => (
            <div key={course.id} className="relative">
              {course.featured && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1 shadow-lg">
                    Mais Popular
                  </Badge>
                </div>
              )}
              <Card 
                className={`group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in border-0 ${
                  course.featured ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
              
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={course.image_url || "/placeholder.svg"} 
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-900">
                      {course.level}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-black/70 text-white px-2 py-1 rounded text-sm">
                      R$ {course.original_price.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span>{course.rating}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-6 pt-0">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl font-bold text-blue-600">
                      R$ {course.price.toFixed(2).replace('.', ',')}
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      R$ {course.original_price.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform group-hover:scale-105"
                    onClick={() => handleMercadoPagoCheckout(course)}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Matricular Agora
                  </Button>
                </div>
              </CardFooter>
            </Card>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {content.cta_titulo || 'Não encontrou o curso ideal?'}
            </h3>
            <p className="text-xl mb-8 text-blue-100">
              {content.cta_texto || 'Entre em contato conosco e vamos criar um treinamento personalizado para suas necessidades.'}
            </p>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 bg-white/10 backdrop-blur-sm"
              onClick={() => {
                if (content.cta_botao_link) {
                  window.location.href = content.cta_botao_link;
                } else if (content.cta_botao_sessao) {
                  document.getElementById(content.cta_botao_sessao)?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {content.cta_botao}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;
