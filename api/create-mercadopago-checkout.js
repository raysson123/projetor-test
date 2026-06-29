import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: 'APP_USR-1165285295088255-071414-79191f8eb0f2cfe977b7b04374de2efe-298752940' });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
      return;
    }
  }
  if (!body || !body.product || !body.payer || !body.payer.id) {
    res.status(400).json({ error: 'Missing product or user_id in request body' });
    return;
  }

  const { product, payer, success_url, cancel_url } = body;
  // URLs reais do domínio e rotas existentes
  const successUrl = (success_url || 'https://sitedenis-principal.vercel.app/sucesso') + `?product_id=${product.id}`;
  const pendingUrl = 'https://sitedenis-principal.vercel.app/pendente';
  const failureUrl = 'https://sitedenis-principal.vercel.app/falha';

  try {
    const preference = new Preference(client);
    const response = await preference.create({
      body: {
        items: [
          {
            id: product.id,
            title: product.name,
            description: product.type === 'course' ? 'Curso' : 'eBook',
            picture_url: product.image || undefined,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: product.price / 100
          }
        ],
        payment_methods: {
          excluded_payment_types: [],
        },
        payer: payer || {},
        back_urls: {
          success: successUrl,
          pending: pendingUrl,
          failure: failureUrl
        },
        auto_return: 'approved',
        external_reference: JSON.stringify({
          user_id: payer.id, // Agora garantido que sempre existe
          product_id: product.id,
          product_type: product.type
        })
      }
    });
    res.status(200).json({ url: response.init_point });
  } catch (err) {
    console.error('Erro Mercado Pago:', err);
    res.status(500).json({ error: err.message || 'Erro desconhecido no Mercado Pago' });
  }
} 