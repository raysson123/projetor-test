import { useState } from 'react';
import { Tabs, Tab } from '@/components/ui/tabs';
import CursosAdmin from '@/components/admin/CursosAdmin';
import EBooksAdmin from '@/components/admin/EBooksAdmin';

const AdminConteudo = () => {
  const [tab, setTab] = useState<'cursos' | 'ebooks'>('cursos');

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Painel de Conteúdo</h1>
      <Tabs value={tab} onValueChange={setTab} className="mb-8">
        <Tab value="cursos" label="Cursos" />
        <Tab value="ebooks" label="eBooks" />
      </Tabs>
      {tab === 'cursos' && <CursosAdmin />}
      {tab === 'ebooks' && <EBooksAdmin />}
    </div>
  );
};

export default AdminConteudo; 