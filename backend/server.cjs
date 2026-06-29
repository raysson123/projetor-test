const express = require('express');
const { createServer: createViteServer } = require('vite');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const { MercadoPagoConfig, Preference } = require('mercadopago');
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-1165285295088255-071414-79191f8eb0f2cfe977b7b04374de2efe-298752940' });

// Removido Stripe e endpoints relacionados
// Aqui você pode adicionar a integração Mercado Pago futuramente

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Endpoint para criar checkout Mercado Pago
  app.post('/create-mercadopago-checkout', async (req, res) => {
    const { product, payer } = req.body;
    // Forçar URLs públicas SEMPRE
    const successUrl = 'https://sitedenis-principal.vercel.app/sucesso';
    const cancelUrl = 'https://sitedenis-principal.vercel.app/cancelado';
    console.log('Mercado Pago URLs usadas (forçadas):', { successUrl, cancelUrl });
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
            failure: cancelUrl,
            pending: cancelUrl
          },
          auto_return: 'approved',
          external_reference: product.id + '-' + Date.now()
        }
      });
      res.json({ url: response.init_point });
    } catch (err) {
      console.error('Erro Mercado Pago:', err);
      // Garante que sempre retorna JSON, mesmo se vier HTML do Mercado Pago
      if (err.response && typeof err.response.text === 'function') {
        err.response.text().then(text => {
          res.status(500).json({ error: text });
        }).catch(() => {
          res.status(500).json({ error: err.message || 'Erro desconhecido no Mercado Pago' });
        });
      } else {
        res.status(500).json({ error: err.message || 'Erro desconhecido no Mercado Pago' });
      }
    }
  });

  // Vite middleware
  const vite = await createViteServer({
    server: { middlewareMode: 'html' },
    appType: 'custom',
  });
  app.use(vite.middlewares);

  // Fallback para SPA
  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      const indexHtml = await fs.readFile(path.resolve('index.html'), 'utf-8');
      const template = await vite.transformIndexHtml(url, indexHtml);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
  });
}

startServer(); 