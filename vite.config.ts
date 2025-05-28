import {defineConfig} from 'vite';
import {resolve} from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        events: resolve(__dirname, 'events.html'),
        login: resolve(__dirname, 'src/auth/login.html'),
      },
      // Ensure all JS modules are properly bundled
      external: [],
    },
    // Make sure assets are copied correctly
    assetsDir: 'assets',
  },
  // Important for component loading
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // Ensure proper serving of static assets
  publicDir: 'public',
});