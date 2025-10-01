import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@src': '/src'
    }
  },
    server: {
    port: 3000,  // порт для разработки
    host: 'localhost'
  },
})
