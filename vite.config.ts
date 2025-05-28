import {defineConfig} from 'vite';
import {resolve} from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  // root: 'src',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index1: resolve(__dirname, 'index1.html'),
        index: resolve(__dirname, 'index.html'), // Assuming app.html is in the root
        login: resolve(__dirname, 'src/auth/login.html'), // <--- Add this line for login.html
      },
    },
  },
});
