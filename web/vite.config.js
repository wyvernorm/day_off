import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://shift-manager.iplusview.workers.dev',
        changeOrigin: true,
        secure: true,
      },
      '/auth': {
        target: 'https://shift-manager.iplusview.workers.dev',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
