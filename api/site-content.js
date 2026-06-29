import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || "https://gabyteyblfmddvamhcow.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY || '');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Buscar todos os conteúdos
    const { data, error } = await supabase
      .from('site_content')
      .select('*');
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ content: data });
    return;
  }
  if (req.method === 'POST') {
    const { section, key, value, extra } = req.body;
    if (!section || !key) {
      res.status(400).json({ error: 'Missing section or key' });
      return;
    }
    // Atualizar ou inserir (upsert) o conteúdo
    const { data, error } = await supabase
      .from('site_content')
      .upsert([
        { section, key, value, extra, updated_at: new Date().toISOString() }
      ], { onConflict: ['section', 'key'] })
      .select();
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ success: true, content: data });
    return;
  }
  res.status(405).json({ error: 'Method Not Allowed' });
} 