import {defineConfig} from 'vite';
import {dirname, resolve} from 'path';
import tailwindcss from '@tailwindcss/vite';
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        events: resolve(__dirname, 'events.html'), // Assuming app.html is in the root
        login: resolve(__dirname, 'src/auth/login.html'), // <--- Add this line for login.html
        main_content_container: 'src/components/main-content-container.js',
        sidebar_menu: 'src/components/sidebar-menu.js',
        events_container: 'src/events/events-container.js',
        friends_container: 'src/friends/friends-container.js',
        profile_container: 'src/profile/profile-container.js',
        settings_container: 'src/settings/settings-container.js',

        // Add any other top-level HTML files here
      },
    },
  },

});
