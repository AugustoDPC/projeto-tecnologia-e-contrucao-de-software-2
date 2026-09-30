import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// As chamadas para /backend são repassadas ao NestJS (porta 3000).
// Assim o navegador só precisa acessar a porta do frontend, inclusive no Codespaces.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/backend': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, ''),
      },
    },
  },
});
