import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import Stripe from 'stripe';
import express from 'express';

const stripe = new Stripe('sk_test_51RhhqEHYosclZhAMWX2nsw1RWXVRN9gHU0ctP7bP8wyaKKfPg7VVHjswniYmORU4ayPVcWK1r1OXrHt1w6KRhrTB00zxI69Mrn', { apiVersion: '2024-04-10' });

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    middlewareMode: true,
    setupMiddlewares: (middlewares, devServer) => {
      const app = express();
      app.use(express.json());
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
      devServer.app.use(app);
      return middlewares;
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
