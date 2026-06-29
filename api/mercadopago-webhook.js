import { createClient } from '@supabase/supabase-js';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const SUPABASE_URL = process.env.SUPABASE_URL || "https://gabyteyblfmddvamhcow.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_KEY) {
  console.error('ERRO: SUPABASE_SERVICE_KEY não está definida no ambiente! O webhook não funcionará corretamente.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY || '');

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'APP_USR-1165285295088255-071414-79191f8eb0f2cfe977b7b04374de2efe-298752940';
const mpClient = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });

export default async function handler(req, res) {
  try {
    // Checagem explícita da chave service_role
    if (!SUPABASE_KEY) {
      res.status(200).json({ ok: false, error: 'SUPABASE_SERVICE_KEY não está definida no ambiente do backend. Configure corretamente para o webhook funcionar.' });
      return;
    }
    // Permitir GET para validação do Mercado Pago
    if (req.method === 'GET') {
      res.status(200).json({ ok: true, message: 'Webhook Mercado Pago ativo (GET)' });
      return;
    }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

    // Logar o corpo da requisição para debug
    console.log('Webhook Mercado Pago recebido:', req.body);
    const body = req.body;
    // Verificação explícita de tipo e id
    if (body.type !== 'payment' || !body.data || !body.data.id) {
      console.log('Notificação ignorada: tipo diferente de payment ou id ausente', body);
      res.status(200).json({ ok: false, message: 'Notificação ignorada: tipo diferente de payment ou id ausente' });
      return;
    }
    // Mercado Pago envia notificações com o tipo de evento e o id do pagamento
    let payment = null;
    try {
      const paymentClient = new Payment(mpClient);
      payment = await paymentClient.get({ id: body.data.id });
      // Se a resposta não for válida, retorna ok sem processar
      if (!payment || !payment.id) {
        console.error('Pagamento não encontrado ou resposta inválida do Mercado Pago:', body.data.id);
        res.status(200).json({ ok: false, error: 'Pagamento não encontrado ou resposta inválida' });
        return;
      }
    } catch (err) {
      console.error('Erro ao buscar detalhes do pagamento no Mercado Pago:', err);
      res.status(200).json({ ok: false, error: 'Erro ao buscar detalhes do pagamento' });
      return;
    }
    if (payment && payment.status === 'approved') {
      // Extrair external_reference
      let ref = {};
      try {
        ref = JSON.parse(payment.external_reference);
      } catch (e) {
        console.error('Erro ao parsear external_reference:', payment.external_reference);
      }
      const { user_id, product_id, product_type } = ref;
      const { error } = await supabase
        .from('compras')
        .insert([
          {
            payment_id: payment.id,
            status: payment.status,
            user_id,
            product_id,
            product_type
          }
        ]);
      if (error) {
        console.error('Erro ao registrar compra:', error);
      }
      res.status(200).json({ ok: true });
      return;
    }
    // Se não aprovado, apenas retorna ok
    res.status(200).json({ ok: true });
    return;
  } catch (err) {
    console.error('Erro global no webhook Mercado Pago:', err);
    // Sempre retorna 200 para evitar reenvio em loop pelo Mercado Pago
    res.status(200).json({ ok: false, error: 'Erro interno capturado, mas respondido com 200' });
    return;
  }
} 