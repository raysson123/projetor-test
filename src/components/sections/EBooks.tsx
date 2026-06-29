
import { Download, FileText, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEBooks } from '@/hooks/useEBooks';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// Removido Stripe do handleStripeCheckout. Pronto para integração Mercado Pago.
// Corrigido: NÃO chame useAuth aqui!
const handleMercadoPagoCheckout = async (ebook) => {
  const { profile } = useAuth();
  if (!profile || !profile.email) {
    alert('Você precisa estar logado para comprar!');
    return;
  }
  const success_url = window.location.origin.startsWith('http') ? window.location.origin + '/sucesso' : 'https://sitedenis-principal.vercel.app/sucesso';
  const cancel_url = window.location.origin.startsWith('http') ? window.location.origin + '/cancelado' : 'https://sitedenis-principal.vercel.app/cancelado';
  const response = await fetch('/create-mercadopago-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product: {
        id: ebook.id,
        name: ebook.title,
        price: Math.round(ebook.price * 100),
        type: 'ebook',
        image: ebook.thumbnail_url
      },
      payer: { id: profile.id, email: profile.email },
      success_url,
      cancel_url
    })
  });
  let data;
  try {
    data = await response.json();
  } catch (e) {
    const text = await response.text();
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

const handleStripeCheckoutBundle = async () => {
  const response = await fetch('http://localhost:3000/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: { name: 'Pacote Completo de eBooks' },
            unit_amount: 29700,
          },
          quantity: 1,
        }
      ],
      success_url: window.location.origin + '/sucesso',
      cancel_url: window.location.origin + '/cancelado'
    })
  });
  const data = await response.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert('Erro ao criar checkout: ' + data.error);
  }
};

const EBooks = () => {
  const { data: ebooks, isLoading, error } = useEBooks();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { profile } = useAuth();
  const [content, setContent] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from('site_content').select('*').eq('section', 'ebooks');
      const map = {};
      data?.forEach(item => { map[item.key] = item.value; });
      setContent(map);
    };
    fetchContent();
  }, []);

  // Corrigido: use profile do hook acima
  const handleMercadoPagoCheckout = async (ebook) => {
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
          id: ebook.id,
          name: ebook.title,
          price: Math.round(ebook.price * 100),
          type: 'ebook',
          image: ebook.thumbnail_url
        },
        payer: { id: profile.id, email: profile.email },
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
      <section id="ebooks" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando eBooks...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="ebooks" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Erro ao carregar eBooks. Tente novamente.</p>
          </div>
        </div>
      </section>
    );
  }

  const stats = JSON.parse(content.stats || '[]');

  return (
    <section id="ebooks" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 text-blue-600 border-blue-600">
            {content.badge || 'eBooks Especializados'}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.titulo || 'Conhecimento Prático em suas Mãos'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.subtitulo || 'eBooks desenvolvidos com base em anos de experiência prática, contendo templates, checklists e ferramentas que você pode aplicar imediatamente.'}
          </p>
        </div>

        {/* eBooks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ebooks?.map((ebook, index) => (
            <Card 
              key={ebook.id} 
              className={`group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in border-0 ${
                ebook.bestseller ? 'ring-2 ring-green-500 relative' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {ebook.bestseller && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-1">
                    Best Seller
                  </Badge>
                </div>
              )}
              
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  {ebook.thumbnail_url ? (
                    <img 
                      src={ebook.thumbnail_url} 
                      alt={ebook.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex items-center justify-center">
                      <div className="relative">
                        <div className="w-32 h-40 bg-white rounded-lg shadow-lg transform rotate-6 group-hover:rotate-12 transition-transform duration-500">
                          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-4 flex flex-col">
                            <FileText className="h-8 w-8 text-white mb-2" />
                            <div className="text-white text-xs font-medium leading-tight">
                              {ebook.title.split(' ').slice(0, 3).join(' ')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-900 text-xs">
                      {ebook.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {ebook.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {ebook.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>{ebook.pages} pág.</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="h-4 w-4" />
                    <span>{ebook.downloads.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span>{ebook.rating}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-6 pt-0">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl font-bold text-blue-600">
                      R$ {ebook.price.toFixed(2).replace('.', ',')}
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      R$ {ebook.original_price.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform group-hover:scale-105"
                    onClick={() => handleMercadoPagoCheckout(ebook)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Comprar e Baixar
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-fade-in">
          {stats.map((stat, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
          </div>
          ))}
        </div>

        {/* Bundle Offer */}
        <div className="mt-16 animate-fade-in">
          <Card className="bg-gradient-to-r from-purple-600 to-purple-800 text-white border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            <CardContent className="p-8 md:p-12 relative z-10">
              <div className="text-center">
                <Badge className="bg-yellow-500 text-yellow-900 mb-4">
                  Oferta Especial
                </Badge>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  {content.oferta_titulo || 'Pacote Completo de eBooks'}
                </h3>
                <p className="text-xl mb-6 text-purple-100">
                  {content.oferta_texto || 'Todos os 6 eBooks por um preço especial. Economize mais de 40% comprando o pacote completo.'}
                </p>
                <div className="flex items-center justify-center space-x-4 mb-8">
                  <div className="text-4xl font-bold">{content.oferta_preco || 'R$ 297,00'}</div>
                  <div className="text-xl text-purple-200 line-through">{content.oferta_preco_riscado || 'R$ 562,00'}</div>
                </div>
                <Button 
                  size="lg" 
                  className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                  onClick={() => {
                    if (content.oferta_botao_link) {
                      window.location.href = content.oferta_botao_link;
                    } else if (content.oferta_botao_sessao) {
                      document.getElementById(content.oferta_botao_sessao)?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {content.oferta_botao}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EBooks;
