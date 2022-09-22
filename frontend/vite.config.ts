import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@cosmology/validation'],
  },
  build: {
    commonjsOptions: {
      include: [/validation/, /node_modules/],
    },
  },
});
