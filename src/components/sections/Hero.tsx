
import React, { useEffect, useState } from 'react';
import { ArrowDown, Play, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const Hero = () => {
  const [content, setContent] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'hero');
      const map: Record<string, any> = {};
      data?.forEach(item => { map[item.key] = item.value; });
      setContent(map);
    };
    fetchContent();
  }, []);

  const stats = JSON.parse(content.hero_stats || '[]');

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent animate-pulse"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {content.titulo}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                {content.titulo_azul}
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              {content.subtitulo}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                onClick={() => {
                  if (content.botao_link) {
                    window.location.href = content.botao_link;
                  } else if (content.botao_sessao) {
                    document.getElementById(content.botao_sessao)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {content.botao_texto}
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-8 text-center">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-bold text-white mb-2">{stat.valor}</div>
                  <div className="text-gray-400 text-sm">{stat.descricao}</div>
              </div>
              ))}
            </div>
          </div>
          {/* Image/Video Area */}
          <div className="relative animate-scale-in">
            <div className="relative aspect-video bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {content.video_url ? (
                  <video
                    src={content.video_url}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover rounded-2xl shadow-2xl"
                    style={{ background: '#000' }}
                  />
                ) : (
                  <img src={content.imagem} alt={content.titulo} className="w-full h-full object-cover rounded-2xl shadow-2xl" />
                )}
              </div>
              <img 
                src={content.imagem} 
                alt={content.titulo} 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Cards */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg p-4 shadow-lg animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">Live agora</span>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-lg p-4 shadow-lg animate-fade-in" style={{ animationDelay: '1s' }}>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">98%</div>
                <div className="text-xs text-gray-600">Aprovação</div>
              </div>
            </div>
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-white/70" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
