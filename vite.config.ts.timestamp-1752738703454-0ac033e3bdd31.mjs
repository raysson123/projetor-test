// vite.config.ts
import { defineConfig } from "file:///C:/Users/Pablo/Downloads/Nova%20pasta/sitedenis-principal/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Pablo/Downloads/Nova%20pasta/sitedenis-principal/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///C:/Users/Pablo/Downloads/Nova%20pasta/sitedenis-principal/node_modules/lovable-tagger/dist/index.js";
import Stripe from "file:///C:/Users/Pablo/Downloads/Nova%20pasta/sitedenis-principal/node_modules/stripe/esm/stripe.esm.node.js";
import express from "file:///C:/Users/Pablo/Downloads/Nova%20pasta/sitedenis-principal/node_modules/express/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Pablo\\Downloads\\Nova pasta\\sitedenis-principal";
var stripe = new Stripe("sk_test_51RhhqEHYosclZhAMWX2nsw1RWXVRN9gHU0ctP7bP8wyaKKfPg7VVHjswniYmORU4ayPVcWK1r1OXrHt1w6KRhrTB00zxI69Mrn", { apiVersion: "2024-04-10" });
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3e3,
    middlewareMode: true,
    setupMiddlewares: (middlewares, devServer) => {
      const app = express();
      app.use(express.json());
      app.post("/create-checkout-session", async (req, res) => {
        const { line_items, success_url, cancel_url } = req.body;
        try {
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card", "pix", "boleto"],
            mode: "payment",
            line_items,
            success_url,
            cancel_url
          });
          res.json({ url: session.url });
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      });
      devServer.app.use(app);
      return middlewares;
    }
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxQYWJsb1xcXFxEb3dubG9hZHNcXFxcTm92YSBwYXN0YVxcXFxzaXRlZGVuaXMtcHJpbmNpcGFsXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxQYWJsb1xcXFxEb3dubG9hZHNcXFxcTm92YSBwYXN0YVxcXFxzaXRlZGVuaXMtcHJpbmNpcGFsXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9QYWJsby9Eb3dubG9hZHMvTm92YSUyMHBhc3RhL3NpdGVkZW5pcy1wcmluY2lwYWwvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcclxuaW1wb3J0IFN0cmlwZSBmcm9tICdzdHJpcGUnO1xyXG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuXHJcbmNvbnN0IHN0cmlwZSA9IG5ldyBTdHJpcGUoJ3NrX3Rlc3RfNTFSaGhxRUhZb3NjbFpoQU1XWDJuc3cxUldYVlJOOWdIVTBjdFA3YlA4d3lhS0tmUGc3VlZIanN3bmlZbU9SVTRheVBWY1dLMXIxT1hySHQxdzZLUmhyVEIwMHp4STY5TXJuJywgeyBhcGlWZXJzaW9uOiAnMjAyNC0wNC0xMCcgfSk7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCI6OlwiLFxyXG4gICAgcG9ydDogMzAwMCxcclxuICAgIG1pZGRsZXdhcmVNb2RlOiB0cnVlLFxyXG4gICAgc2V0dXBNaWRkbGV3YXJlczogKG1pZGRsZXdhcmVzLCBkZXZTZXJ2ZXIpID0+IHtcclxuICAgICAgY29uc3QgYXBwID0gZXhwcmVzcygpO1xyXG4gICAgICBhcHAudXNlKGV4cHJlc3MuanNvbigpKTtcclxuICAgICAgYXBwLnBvc3QoJy9jcmVhdGUtY2hlY2tvdXQtc2Vzc2lvbicsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGluZV9pdGVtcywgc3VjY2Vzc191cmwsIGNhbmNlbF91cmwgfSA9IHJlcS5ib2R5O1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgc3RyaXBlLmNoZWNrb3V0LnNlc3Npb25zLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgIHBheW1lbnRfbWV0aG9kX3R5cGVzOiBbJ2NhcmQnLCAncGl4JywgJ2JvbGV0byddLFxyXG4gICAgICAgICAgICBtb2RlOiAncGF5bWVudCcsXHJcbiAgICAgICAgICAgIGxpbmVfaXRlbXMsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3NfdXJsLFxyXG4gICAgICAgICAgICBjYW5jZWxfdXJsLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICByZXMuanNvbih7IHVybDogc2Vzc2lvbi51cmwgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBlcnIubWVzc2FnZSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBkZXZTZXJ2ZXIuYXBwLnVzZShhcHApO1xyXG4gICAgICByZXR1cm4gbWlkZGxld2FyZXM7XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIG1vZGUgPT09ICdkZXZlbG9wbWVudCcgJiZcclxuICAgIGNvbXBvbmVudFRhZ2dlcigpLFxyXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG59KSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVcsU0FBUyxvQkFBb0I7QUFDbFksT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUNoQyxPQUFPLFlBQVk7QUFDbkIsT0FBTyxhQUFhO0FBTHBCLElBQU0sbUNBQW1DO0FBT3pDLElBQU0sU0FBUyxJQUFJLE9BQU8sK0dBQStHLEVBQUUsWUFBWSxhQUFhLENBQUM7QUFHckssSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixnQkFBZ0I7QUFBQSxJQUNoQixrQkFBa0IsQ0FBQyxhQUFhLGNBQWM7QUFDNUMsWUFBTSxNQUFNLFFBQVE7QUFDcEIsVUFBSSxJQUFJLFFBQVEsS0FBSyxDQUFDO0FBQ3RCLFVBQUksS0FBSyw0QkFBNEIsT0FBTyxLQUFLLFFBQVE7QUFDdkQsY0FBTSxFQUFFLFlBQVksYUFBYSxXQUFXLElBQUksSUFBSTtBQUNwRCxZQUFJO0FBQ0YsZ0JBQU0sVUFBVSxNQUFNLE9BQU8sU0FBUyxTQUFTLE9BQU87QUFBQSxZQUNwRCxzQkFBc0IsQ0FBQyxRQUFRLE9BQU8sUUFBUTtBQUFBLFlBQzlDLE1BQU07QUFBQSxZQUNOO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxVQUNGLENBQUM7QUFDRCxjQUFJLEtBQUssRUFBRSxLQUFLLFFBQVEsSUFBSSxDQUFDO0FBQUEsUUFDL0IsU0FBUyxLQUFLO0FBQ1osY0FBSSxPQUFPLEdBQUcsRUFBRSxLQUFLLEVBQUUsT0FBTyxJQUFJLFFBQVEsQ0FBQztBQUFBLFFBQzdDO0FBQUEsTUFDRixDQUFDO0FBQ0QsZ0JBQVUsSUFBSSxJQUFJLEdBQUc7QUFDckIsYUFBTztBQUFBLElBQ1Q7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixTQUFTLGlCQUNULGdCQUFnQjtBQUFBLEVBQ2xCLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDaEIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
