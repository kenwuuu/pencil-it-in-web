import {defineConfig} from 'vite';
import {resolve} from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        events: resolve(__dirname, 'events.html'), // Assuming app.html is in the root
        login: resolve(__dirname, 'src/auth/login.html'), // <--- Add this line for login.html
        // Add any other top-level HTML files here
      },
    },
  },

});
