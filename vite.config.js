import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // three.js alone is ~500 kB minified.
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        solarsystem: resolve(import.meta.dirname, 'solarsystem.html'),
      },
    },
  },
});
