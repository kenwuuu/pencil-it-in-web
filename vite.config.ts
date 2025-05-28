import {defineConfig} from 'vite';
import {resolve} from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        events: resolve(__dirname, 'events.html'),
        index: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'src/auth/login.html'),
        // components folder
        main_content_container: resolve(__dirname, 'src/components/main-content-container.js'),
        bottom_menu: resolve(__dirname, 'src/components/bottom-menu.js'),
        sidebar_menu: resolve(__dirname, 'src/components/sidebar-menu.js'),
        site_header: resolve(__dirname, 'src/components/site-header.js'),
        events_container: resolve(__dirname, 'src/events/events-container.js'),
        profile: resolve(__dirname, 'src/profile/profile-container.js'),
        settings: resolve(__dirname, 'src/settings/settings-container.js'),
        friends: resolve(__dirname, 'src/friends/friends-container.js'),

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