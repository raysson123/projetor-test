const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

// Use sua chave secreta do Stripe
const stripe = Stripe('sk_test_51RhhqEHYosclZhAMWX2nsw1RWXVRN9gHU0ctP7bP8wyaKKfPg7VVHjswniYmORU4ayPVcWK1r1OXrHt1w6KRhrTB00zxI69Mrn');

const app = express();
app.use(express.json());
app.use(cors());

// Endpoint para criar sessão de checkout
app.post('/create-checkout-session', async (req, res) => {
  const { line_items, success_url, cancel_url } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'pix', 'boleto'],
      mode: 'payment',
      line_items,
      success_url,
      cancel_url,
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Stripe server running on http://localhost:${PORT}`);
}); 