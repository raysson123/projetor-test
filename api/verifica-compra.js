import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || "https://gabyteyblfmddvamhcow.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY || '');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  const { user_id, product_id } = req.body;
  if (!user_id || !product_id) {
    res.status(400).json({ error: 'Missing user_id or product_id' });
    return;
  }
  const { data, error } = await supabase
    .from('compras')
    .select('*')
    .eq('user_id', user_id)
    .eq('product_id', product_id)
    .eq('status', 'approved')
    .maybeSingle();
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(200).json({ liberado: !!data, compra: data || null });
} 