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
        // main_content_container: resolve(__dirname, 'src/components/main-content-container.js'),
        // sidebar_menu: resolve(__dirname, 'src/components/sidebar-menu.js'),
        // events_container: resolve(__dirname, 'src/events/events-container.js'),
        // friends_container: resolve(__dirname, 'src/friends/friends-container.js'),
        // profile_container: resolve(__dirname, 'src/profile/profile-container.js'),
        // settings_container: resolve(__dirname, 'src/settings/settings-container.js'),

        // Add any other top-level HTML files here
      },
    },
  },

});
