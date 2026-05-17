import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    cssCodeSplit: false,        // Single CSS bundle — prevents missing styles on Vercel
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined, // Let Vite handle chunking
      },
    },
  },
});
