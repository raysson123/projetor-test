import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Estrutura fiel ao site, arrays editáveis e campos reais
const SESSOES_SITE = [
  { value: 'hero', label: 'Início' },
  { value: 'cursos', label: 'Cursos' },
  { value: 'ebooks', label: 'eBooks' },
  { value: 'sobre', label: 'Sobre' },
  { value: 'contato', label: 'Contato' },
  { value: 'rodape', label: 'Rodapé' }
];
const SECTIONS = [
  {
    section: 'hero', label: 'Início', fields: [
      { key: 'titulo', label: 'Título principal', type: 'text' },
      { key: 'titulo_azul', label: 'Título azul/destaque', type: 'text' },
      { key: 'subtitulo', label: 'Subtítulo', type: 'text' },
      { key: 'botao_texto', label: 'Texto do botão', type: 'text' },
      { key: 'botao_link', label: 'Link do botão', type: 'text' },
      { key: 'botao_sessao', label: 'Sessão de destino', type: 'dropdown', options: SESSOES_SITE },
      { key: 'imagem', label: 'Imagem do banner', type: 'file', fileType: 'image' },
      { key: 'video_url', label: 'Vídeo de destaque', type: 'file', fileType: 'video' },
      { key: 'stats', label: 'Estatísticas', type: 'array', itemFields: [
        { key: 'valor', label: 'Valor', type: 'text' },
        { key: 'descricao', label: 'Descrição', type: 'text' }
      ]}
    ]
  },
  {
    section: 'cursos', label: 'Cursos', fields: [
      { key: 'badge', label: 'Badge/topo', type: 'text' },
      { key: 'titulo', label: 'Título principal', type: 'text' },
      { key: 'subtitulo', label: 'Subtítulo', type: 'text' },
      { key: 'cta_titulo', label: 'Título CTA final', type: 'text' },
      { key: 'cta_texto', label: 'Texto CTA final', type: 'text' },
      { key: 'cta_botao', label: 'Texto do botão CTA', type: 'text' },
      { key: 'cta_botao_link', label: 'Link do botão CTA', type: 'text' },
      { key: 'cta_botao_sessao', label: 'Sessão de destino do botão CTA', type: 'dropdown', options: SESSOES_SITE }
    ]
  },
  {
    section: 'ebooks', label: 'eBooks', fields: [
      { key: 'badge', label: 'Badge/topo', type: 'text' },
      { key: 'titulo', label: 'Título principal', type: 'text' },
      { key: 'subtitulo', label: 'Subtítulo', type: 'text' },
      { key: 'stats', label: 'Estatísticas', type: 'array', itemFields: [
        { key: 'valor', label: 'Valor', type: 'text' },
        { key: 'descricao', label: 'Descrição', type: 'text' }
      ]},
      { key: 'oferta_titulo', label: 'Título oferta especial', type: 'text' },
      { key: 'oferta_texto', label: 'Texto oferta especial', type: 'text' },
      { key: 'oferta_preco', label: 'Preço do pacote', type: 'text' },
      { key: 'oferta_preco_riscado', label: 'Preço original riscado', type: 'text' },
      { key: 'oferta_botao', label: 'Texto do botão oferta', type: 'text' },
      { key: 'oferta_botao_link', label: 'Link do botão oferta', type: 'text' },
      { key: 'oferta_botao_sessao', label: 'Sessão de destino do botão oferta', type: 'dropdown', options: SESSOES_SITE }
    ]
  },
  {
    section: 'sobre', label: 'Sobre Nós', fields: [
      { key: 'badge', label: 'Badge/topo', type: 'text' },
      { key: 'titulo', label: 'Título principal', type: 'text' },
      { key: 'nome', label: 'Nome do especialista', type: 'text' },
      { key: 'paragrafo1', label: 'Parágrafo 1', type: 'textarea' },
      { key: 'paragrafo2', label: 'Parágrafo 2', type: 'textarea' },
      { key: 'certificacoes', label: 'Certificações', type: 'array', itemFields: [
        { key: 'texto', label: 'Certificação', type: 'text' }
      ]},
      { key: 'botao', label: 'Texto do botão', type: 'text' },
      { key: 'botao_link', label: 'Link do botão', type: 'text' },
      { key: 'botao_sessao', label: 'Sessão de destino do botão', type: 'dropdown', options: SESSOES_SITE },
      { key: 'imagem', label: 'Imagem do especialista', type: 'file', fileType: 'image' },
      { key: 'stats', label: 'Estatísticas', type: 'array', itemFields: [
        { key: 'valor', label: 'Valor', type: 'text' },
        { key: 'descricao', label: 'Descrição', type: 'text' }
      ]},
      { key: 'conquistas', label: 'Conquistas', type: 'array', itemFields: [
        { key: 'icone', label: 'Ícone (nome do ícone ou emoji)', type: 'text' },
        { key: 'titulo', label: 'Título', type: 'text' },
        { key: 'descricao', label: 'Descrição', type: 'text' }
      ]},
      { key: 'depoimentos', label: 'Depoimentos', type: 'array', itemFields: [
        { key: 'nome', label: 'Nome', type: 'text' },
        { key: 'cargo', label: 'Cargo', type: 'text' },
        { key: 'texto', label: 'Depoimento', type: 'textarea' },
        { key: 'avatar', label: 'Avatar', type: 'file', fileType: 'image' },
        { key: 'nota', label: 'Nota', type: 'number' }
      ]}
    ]
  },
  {
    section: 'contato', label: 'Contato', fields: [
      { key: 'badge', label: 'Badge/topo', type: 'text' },
      { key: 'titulo', label: 'Título principal', type: 'text' },
      { key: 'subtitulo', label: 'Subtítulo', type: 'text' },
      { key: 'email', label: 'E-mail', type: 'text' },
      { key: 'telefone', label: 'Telefone', type: 'text' },
      { key: 'localizacao', label: 'Localização', type: 'text' },
      { key: 'horarioAtendimento', label: 'Horário de atendimento', type: 'text' },
      { key: 'faq', label: 'FAQ', type: 'array', itemFields: [
        { key: 'pergunta', label: 'Pergunta', type: 'text' },
        { key: 'resposta', label: 'Resposta', type: 'textarea' }
      ]},

    ]
  },
  {
    section: 'rodape', label: 'Rodapé', fields: [
      { key: 'empresa', label: 'Nome da empresa', type: 'text' },
      { key: 'slogan', label: 'Slogan', type: 'text' },
      { key: 'descricao', label: 'Descrição institucional', type: 'textarea' },
      { key: 'email', label: 'E-mail', type: 'text' },
      { key: 'telefone', label: 'Telefone', type: 'text' },
      { key: 'endereco', label: 'Endereço', type: 'text' },
      { key: 'newsletter_botao', label: 'Texto do botão newsletter', type: 'text' },
      { key: 'newsletter_botao_link', label: 'Link do botão newsletter', type: 'text' },
      { key: 'newsletter_botao_sessao', label: 'Sessão de destino do botão newsletter', type: 'dropdown', options: SESSOES_SITE },
      { key: 'whatsapp_botao', label: 'Texto do botão WhatsApp', type: 'text' },
      { key: 'whatsapp_botao_link', label: 'Link do botão WhatsApp', type: 'text' },
      { key: 'whatsapp_botao_sessao', label: 'Sessão de destino do botão WhatsApp', type: 'dropdown', options: SESSOES_SITE },
      { key: 'aluno_botao', label: 'Texto do botão Área do Aluno', type: 'text' },
      { key: 'aluno_botao_link', label: 'Link do botão Área do Aluno', type: 'text' },
      { key: 'aluno_botao_sessao', label: 'Sessão de destino do botão Área do Aluno', type: 'dropdown', options: SESSOES_SITE },
      { key: 'ajuda_botao', label: 'Texto do botão Central de Ajuda', type: 'text' },
      { key: 'ajuda_botao_link', label: 'Link do botão Central de Ajuda', type: 'text' },
      { key: 'ajuda_botao_sessao', label: 'Sessão de destino do botão Central de Ajuda', type: 'dropdown', options: SESSOES_SITE },
      { key: 'copyright', label: 'Copyright', type: 'text' },
      { key: 'links_rapidos', label: 'Links rápidos', type: 'array', itemFields: [
        { key: 'titulo', label: 'Título', type: 'text' },
        { key: 'href', label: 'URL', type: 'text' }
      ]},
      { key: 'links_legais', label: 'Links legais', type: 'array', itemFields: [
        { key: 'titulo', label: 'Título', type: 'text' },
        { key: 'href', label: 'URL', type: 'text' }
      ]},
      { key: 'stats', label: 'Stats de atendimento', type: 'array', itemFields: [
        { key: 'valor', label: 'Valor', type: 'text' },
        { key: 'descricao', label: 'Descrição', type: 'text' }
      ]}
    ]
  }
];

// Estado inicial fiel ao conteúdo real do site (todos os campos de todas as seções)
const initialContent = {
  // Início (Hero)
  hero_titulo: 'Especialista em',
  hero_titulo_azul: 'Gestão da Saúde',
  hero_subtitulo: 'Cursos e eBooks especializados em faturamento médico, administração hospitalar e gestão na área da saúde. Transforme sua carreira com conhecimento prático e atualizado.',
  hero_botao_texto: 'Ver Cursos Disponíveis',
  hero_botao_link: '#cursos',
  hero_botao_sessao: 'cursos',
  hero_imagem: '/placeholder.svg',
  hero_video_url: '',
  hero_stats: [
    { valor: '15+', descricao: 'Anos de Experiência' },
    { valor: '50+', descricao: 'Cursos Criados' },
    { valor: '5k+', descricao: 'Alunos Formados' }
  ],
  // Cursos
  cursos_badge: 'Cursos Especializados',
  cursos_titulo: 'Transforme sua Carreira na Área da Saúde',
  cursos_subtitulo: 'Cursos práticos e atualizados, desenvolvidos por especialistas com mais de 15 anos de experiência em gestão e administração da saúde.',
  cursos_cta_titulo: 'Não encontrou o curso ideal?',
  cursos_cta_texto: 'Entre em contato conosco e vamos criar um treinamento personalizado para suas necessidades.',
  cursos_cta_botao: 'Falar com Especialista',
  cursos_cta_botao_link: '#contato',
  cursos_cta_botao_sessao: 'contato',
  // eBooks
  ebooks_badge: 'eBooks Especializados',
  ebooks_titulo: 'Conhecimento Prático em suas Mãos',
  ebooks_subtitulo: 'eBooks desenvolvidos com base em anos de experiência prática, contendo templates, checklists e ferramentas que você pode aplicar imediatamente.',
  ebooks_stats: [
    { valor: '15+', descricao: 'eBooks Publicados' },
    { valor: '9.5k+', descricao: 'Downloads' },
    { valor: '4.8', descricao: 'Avaliação Média' },
    { valor: '100%', descricao: 'Satisfação' }
  ],
  ebooks_oferta_titulo: 'Pacote Completo de eBooks',
  ebooks_oferta_texto: 'Todos os 6 eBooks por um preço especial. Economize mais de 40% comprando o pacote completo.',
  ebooks_oferta_preco: 'R$ 297,00',
  ebooks_oferta_preco_riscado: 'R$ 562,00',
  ebooks_oferta_botao: 'Comprar Pacote Completo',
  ebooks_oferta_botao_link: '#ebooks',
  ebooks_oferta_botao_sessao: 'ebooks',
  // Sobre
  sobre_badge: 'Sobre o Especialista',
  sobre_titulo: 'Conheça o Especialista',
  sobre_nome: 'Dr. João Martinez',
  sobre_paragrafo1: 'Especialista em Gestão da Saúde com mais de 15 anos de experiência prática em hospitais, clínicas e operadoras de saúde. Formado em Administração com MBA em Gestão de Saúde pela FGV, é reconhecido como um dos principais especialistas em faturamento médico e administração hospitalar do país.',
  sobre_paragrafo2: 'Já treinou mais de 5.000 profissionais e ajudou centenas de instituições a otimizar seus processos, reduzir custos e aumentar a receita através de gestão eficiente e faturamento otimizado.',
  sobre_certificacoes: [
    { texto: 'MBA em Gestão de Saúde - FGV' },
    { texto: 'Certificação ISO 9001 Lead Auditor' },
    { texto: 'Especialização em Auditoria Médica' },
    { texto: 'Certificação Six Sigma Black Belt' },
    { texto: 'Pós-graduação em Faturamento SUS' }
  ],
  sobre_botao: 'Falar com o Especialista',
  sobre_botao_link: '#contato',
  sobre_botao_sessao: 'contato',
  sobre_imagem: '/placeholder.svg',
  sobre_stats: [
    { valor: '15+', descricao: 'Anos' },
    { valor: '5k+', descricao: 'Alunos' }
  ],
  sobre_conquistas: [
    { icone: 'Award', titulo: 'Especialista Certificado', descricao: 'MBA em Gestão de Saúde e certificações internacionais' },
    { icone: 'Users', titulo: '5.000+ Alunos', descricao: 'Profissionais capacitados em toda América Latina' },
    { icone: 'BookOpen', titulo: '15+ Anos de Experiência', descricao: 'Atuação prática em hospitais e clínicas de grande porte' },
    { icone: 'Star', titulo: '98% de Aprovação', descricao: 'Índice de satisfação dos alunos e leitores' }
  ],
  sobre_depoimentos: [
    { nome: 'Dra. Maria Silva', cargo: 'Diretora Administrativa - Hospital São Lucas', texto: 'Os cursos transformaram completamente nossa gestão financeira. Conseguimos reduzir custos em 30% e aumentar a eficiência operacional.', avatar: '/placeholder.svg', nota: 5 },
    { nome: 'Carlos Santos', cargo: 'Auditor Médico - Unimed', texto: 'Material prático e atualizado. Apliquei os conhecimentos imediatamente no meu trabalho e os resultados foram excepcionais.', avatar: '/placeholder.svg', nota: 5 },
    { nome: 'Ana Carolina', cargo: 'Gestora de Qualidade - Clínica Premium', texto: 'O eBook de indicadores de qualidade é uma ferramenta indispensável. Uso diariamente nas minhas análises.', avatar: '/placeholder.svg', nota: 5 }
  ],
  // Contato
  contato_badge: 'Entre em Contato',
  contato_titulo: 'Vamos Conversar sobre seu Futuro',
  contato_subtitulo: 'Estamos aqui para tirar suas dúvidas e ajudá-lo a escolher o melhor caminho para sua carreira na área da saúde.',
  contato_email: 'contato@especialistagestao.com.br',
  contato_telefone: '(11) 99999-9999',
  contato_localizacao: 'São Paulo - SP, Brasil',
  contato_horarioAtendimento: 'Segunda a Sexta: 9h às 18h',
  contato_faq: [
    { pergunta: 'Como funciona o acesso aos cursos?', resposta: 'Após a compra, você recebe acesso imediato à plataforma com login próprio.' },
    { pergunta: 'Os certificados são reconhecidos?', resposta: 'Sim, todos os cursos oferecem certificado de conclusão reconhecido.' },
    { pergunta: 'Posso fazer os cursos no meu ritmo?', resposta: 'Sim, o acesso é vitalício e você estuda no seu próprio ritmo.' }
  ],
  // Rodapé
  rodape_empresa: 'MedCursos',
  rodape_slogan: 'Especialista em Saúde',
  rodape_descricao: 'Especialista em cursos e eBooks para profissionais da área da saúde. Transformando carreiras através de conhecimento prático e atualizado.',
  rodape_email: 'contato@medcursos.com.br',
  rodape_telefone: '(11) 99999-9999',
  rodape_endereco: 'São Paulo, SP - Brasil',
  rodape_newsletter_botao: 'Inscrever-se',
  rodape_newsletter_botao_link: '#rodape',
  rodape_newsletter_botao_sessao: 'rodape',
  rodape_whatsapp_botao: 'WhatsApp',
  rodape_whatsapp_botao_link: '#whatsapp',
  rodape_whatsapp_botao_sessao: 'whatsapp',
  rodape_aluno_botao: 'Área do Aluno',
  rodape_aluno_botao_link: '#aluno',
  rodape_aluno_botao_sessao: 'aluno',
  rodape_ajuda_botao: 'Central de Ajuda',
  rodape_ajuda_botao_link: '#ajuda',
  rodape_ajuda_botao_sessao: 'ajuda',
  rodape_copyright: '© 2024 MedCursos. Todos os direitos reservados.',
  rodape_links_rapidos: [
    { titulo: 'Início', href: '#inicio' },
    { titulo: 'Cursos', href: '#cursos' },
    { titulo: 'eBooks', href: '#ebooks' },
    { titulo: 'Sobre', href: '#sobre' },
    { titulo: 'Contato', href: '#contato' }
  ],
  rodape_links_legais: [
    { titulo: 'Política de Privacidade', href: '#' },
    { titulo: 'Termos de Uso', href: '#' },
    { titulo: 'Política de Reembolso', href: '#' },
    { titulo: 'Cookies', href: '#' }
  ],
  rodape_stats: [
    { valor: 'Online agora', descricao: '' },
    { valor: 'Seg-Sex: 8h às 18h', descricao: 'Atendimento' },
    { valor: '24 horas', descricao: 'Resposta média' }
  ]
};

const EditarSite = () => {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState(SECTIONS[0].section);
  // Substituir os estados globais por estados individuais por campo
  const [fieldStatus, setFieldStatus] = useState({}); // { 'section_key': { loading, success, error } }
  const { toast } = useToast();

  // Buscar dados do Supabase ao abrir
  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from('site_content').select('*');
      if (data && data.length > 0) {
        const map = { ...initialContent };
        data.forEach(item => {
          // Se for array salvo como JSON, faz parse
          try {
            map[`${item.section}_${item.key}`] = JSON.parse(item.value);
          } catch {
            map[`${item.section}_${item.key}`] = item.value;
          }
        });
        setContent(map);
      }
    };
    fetchContent();
  }, []);

  const handleChange = (section, key, value) => {
    setContent(prev => ({ ...prev, [`${section}_${key}`]: value }));
  };

  // Função para upload de arquivo (imagem ou vídeo)
  const handleFileUpload = async (section, key, file) => {
    if (!file) return;
    setFieldStatus(prev => ({
      ...prev,
      [`${section}_${key}`]: { loading: true, success: '', error: '' }
    }));
    try {
      // Define bucket correto
      const bucket = 'site-conteudos';
      const ext = file.name.split('.').pop();
      // Path seguro: sem espaços/caracteres especiais
      const safeSection = section.replace(/[^a-zA-Z0-9_-]/g, '');
      const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
      const path = `${safeSection}/${safeKey}-${Date.now()}.${ext}`;
      // Upload para o Storage
      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (uploadError) {
        alert('Erro no upload: ' + uploadError.message);
        throw uploadError;
      }
      // Pega a URL pública
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      const url = data.publicUrl;
      setContent(prev => ({ ...prev, [`${section}_${key}`]: url }));
      // Salva no banco
      await handleSave(section, key, url);
      toast({ title: 'Upload concluído', description: 'Arquivo enviado com sucesso!', duration: 3000 });
    } catch (err) {
      setFieldStatus(prev => ({
        ...prev,
        [`${section}_${key}`]: { loading: false, success: '', error: err.message || 'Erro no upload' }
      }));
      toast({ title: 'Erro no upload', description: err.message || 'Falha ao enviar arquivo', duration: 4000 });
    }
  };

  // Modificar handleSave para serializar arrays como JSON
  const handleSave = async (section, key, valueOverride) => {
    setFieldStatus(prev => ({
      ...prev,
      [`${section}_${key}`]: { loading: true, success: '', error: '' }
    }));
    let value = valueOverride !== undefined ? valueOverride : content[`${section}_${key}`];
    // Se for array, salvar como JSON
    if (Array.isArray(value)) {
      value = JSON.stringify(value);
    }
    const { error } = await supabase
      .from('site_content')
      .upsert([
        { section, key, value, updated_at: new Date().toISOString() }
      ], { onConflict: ['section', 'key'] });
    if (!error) {
      setFieldStatus(prev => ({
        ...prev,
        [`${section}_${key}`]: { loading: false, success: 'Salvo com sucesso!', error: '' }
      }));
      setTimeout(() => setFieldStatus(prev => ({
        ...prev,
        [`${section}_${key}`]: { ...prev[`${section}_${key}`], success: '' }
      })), 2000);
    } else {
      setFieldStatus(prev => ({
        ...prev,
        [`${section}_${key}`]: { loading: false, success: '', error: error.message || 'Erro ao salvar' }
      }));
      setTimeout(() => setFieldStatus(prev => ({
        ...prev,
        [`${section}_${key}`]: { ...prev[`${section}_${key}`], error: '' }
      })), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 w-full">
      <h1 className="text-4xl font-bold mb-10 text-center">Editar Página Principal do Site</h1>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="flex flex-wrap justify-center gap-2 mb-8">
          {SECTIONS.map(sec => (
            <TabsTrigger key={sec.section} value={sec.section} className="px-6 py-2 rounded-lg text-lg font-semibold">
              {sec.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {SECTIONS.map(sec => (
          <TabsContent key={sec.section} value={sec.section} className="w-full">
            <Card className="w-full mx-auto">
              <CardHeader>
                <CardTitle>{sec.label}</CardTitle>
              </CardHeader>
              <CardContent>
                {sec.fields.map(field => (
                  <div key={field.key} className="mb-4">
                    <label className="block font-medium mb-1">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        className="input w-full"
                        value={content[`${sec.section}_${field.key}`] || ''}
                        onChange={e => handleChange(sec.section, field.key, e.target.value)}
                      />
                    ) : field.type === 'file' ? (
                      <div className="flex flex-col gap-2">
                        {/* Preview se for imagem ou vídeo */}
                        {content[`${sec.section}_${field.key}`] && (
                          field.fileType === 'image' && content[`${sec.section}_${field.key}`].match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <img src={content[`${sec.section}_${field.key}`]} alt="preview" className="max-h-40 rounded border" />
                          ) : field.fileType === 'video' && content[`${sec.section}_${field.key}`].match(/\.(mp4|webm|ogg)$/i) ? (
                            <video src={content[`${sec.section}_${field.key}`]} controls className="max-h-40 rounded border" />
                          ) : null
                        )}
                        {/* Upload de arquivo */}
                        <input
                          type="file"
                          accept={field.fileType === 'image' ? 'image/*' : 'video/*'}
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(sec.section, field.key, file);
                          }}
                          className="input w-full"
                        />
                        {/* Ou colar link manualmente */}
                        <input
                          type="text"
                          className="input w-full"
                          placeholder={field.fileType === 'image' ? 'Ou cole um link direto de imagem' : 'Ou cole um link direto de vídeo'}
                          value={content[`${sec.section}_${field.key}`] || ''}
                          onChange={e => handleChange(sec.section, field.key, e.target.value)}
                        />
                      </div>
                    ) : field.type === 'array' ? (
                      <div className="flex flex-col gap-2">
                        {content[`${sec.section}_${field.key}`] && Array.isArray(content[`${sec.section}_${field.key}`]) ? (
                          content[`${sec.section}_${field.key}`].map((item, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                              {field.itemFields.map(itemField => (
                                <div key={itemField.key} className="flex-1">
                                  <label className="block font-medium mb-1">{itemField.label}</label>
                                  {itemField.type === 'text' ? (
                                    <input
                                      type="text"
                                      className="input w-full"
                                      value={item[itemField.key] || ''}
                                      onChange={e => {
                                        const newItems = [...content[`${sec.section}_${field.key}`]];
                                        newItems[index] = { ...newItems[index], [itemField.key]: e.target.value };
                                        setContent(prev => ({ ...prev, [`${sec.section}_${field.key}`]: newItems }));
                                      }}
                                    />
                                  ) : itemField.type === 'textarea' ? (
                                    <textarea
                                      className="input w-full"
                                      value={item[itemField.key] || ''}
                                      onChange={e => {
                                        const newItems = [...content[`${sec.section}_${field.key}`]];
                                        newItems[index] = { ...newItems[index], [itemField.key]: e.target.value };
                                        setContent(prev => ({ ...prev, [`${sec.section}_${field.key}`]: newItems }));
                                      }}
                                    />
                                  ) : itemField.type === 'file' ? (
                                    <div className="flex flex-col gap-2">
                                      {/* Preview se for imagem */}
                                      {item[itemField.key] && item[itemField.key].match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                                        <img src={item[itemField.key]} alt="avatar" className="max-h-20 rounded border" />
                                      )}
                                      {/* Upload de arquivo */}
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async e => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            const bucket = 'site-conteudos';
                                            const ext = file.name.split('.').pop();
                                            const path = `sobre/depoimento-avatar-${index}-${Date.now()}.${ext}`;
                                            const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
                                            if (!uploadError) {
                                              const { data } = supabase.storage.from(bucket).getPublicUrl(path);
                                              const url = data.publicUrl;
                                              const newItems = [...content[`${sec.section}_${field.key}`]];
                                              newItems[index] = { ...newItems[index], [itemField.key]: url };
                                              setContent(prev => ({ ...prev, [`${sec.section}_${field.key}`]: newItems }));
                                            }
                                          }
                                        }}
                                        className="input w-full"
                                      />
                                      {/* Ou colar link manualmente */}
                                      <input
                                        type="text"
                                        className="input w-full"
                                        placeholder="Ou cole um link direto de imagem"
                                        value={item[itemField.key] || ''}
                                        onChange={e => {
                                          const newItems = [...content[`${sec.section}_${field.key}`]];
                                          newItems[index] = { ...newItems[index], [itemField.key]: e.target.value };
                                          setContent(prev => ({ ...prev, [`${sec.section}_${field.key}`]: newItems }));
                                        }}
                                      />
                                    </div>
                                  ) : itemField.type === 'number' ? (
                                    <input
                                      type="number"
                                      className="input w-full"
                                      value={item[itemField.key] || ''}
                                      onChange={e => {
                                        const newItems = [...content[`${sec.section}_${field.key}`]];
                                        newItems[index] = { ...newItems[index], [itemField.key]: parseFloat(e.target.value) };
                                        setContent(prev => ({ ...prev, [`${sec.section}_${field.key}`]: newItems }));
                                      }}
                                    />
                                  ) : null}
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newItems = [...content[`${sec.section}_${field.key}`]];
                                  newItems.splice(index, 1);
                                  setContent(prev => ({ ...prev, [`${sec.section}_${field.key}`]: newItems }));
                                }}
                                className="mt-2"
                              >
                                Remover item
                              </Button>
                            </div>
                          ))
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => {
                              const newItems = [...(content[`${sec.section}_${field.key}`] || [])];
                              newItems.push({});
                              setContent(prev => ({ ...prev, [`${sec.section}_${field.key}`]: newItems }));
                            }}
                            className="mt-2"
                          >
                            Adicionar item
                          </Button>
                        )}
                      </div>
                    ) : field.type === 'dropdown' ? (
                      <select
                        className="input w-full"
                        value={content[`${sec.section}_${field.key}`] || ''}
                        onChange={e => handleChange(sec.section, field.key, e.target.value)}
                      >
                        <option value="">Selecione uma opção</option>
                        {field.options.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="input w-full"
                        value={content[`${sec.section}_${field.key}`] || ''}
                        onChange={e => handleChange(sec.section, field.key, e.target.value)}
                      />
                    )}
                    <Button
                      className="mt-2"
                      onClick={() => handleSave(sec.section, field.key)}
                      disabled={fieldStatus[`${sec.section}_${field.key}`]?.loading}
                    >
                      {fieldStatus[`${sec.section}_${field.key}`]?.loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                    {fieldStatus[`${sec.section}_${field.key}`]?.success && (
                      <div className="text-green-600 mt-1 text-sm">{fieldStatus[`${sec.section}_${field.key}`].success}</div>
                    )}
                    {fieldStatus[`${sec.section}_${field.key}`]?.error && (
                      <div className="text-red-600 mt-1 text-sm">{fieldStatus[`${sec.section}_${field.key}`].error}</div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default EditarSite; 