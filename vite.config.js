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
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
    // Anything larger than this stays a separate request instead of being
    // inlined as a base64 data URI. CRA's default inlining is what put
    // multi-megabyte images into the JS bundle.
    assetsInlineLimit: 4096,
  },
});
