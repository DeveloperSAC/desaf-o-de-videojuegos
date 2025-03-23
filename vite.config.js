import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000, // Puerto configurado
    open: true, // Abrir automáticamente el navegador al iniciar el servidor
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});