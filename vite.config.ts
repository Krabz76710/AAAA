import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/insee': {
        target: 'https://api.insee.fr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/insee/, ''),
        secure: false
      },
      '/api/data-gouv': {
        target: 'https://entreprise.data.gouv.fr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/data-gouv/, ''),
        secure: false
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
