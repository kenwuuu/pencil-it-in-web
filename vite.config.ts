import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        // main HTML entry points
        events: resolve(__dirname, 'events.html'),
        index: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'src/auth/login.html'),
        // main JS file
        main: resolve(__dirname, 'main.js'),
        // top level services, constants, misc, etc
        constants: resolve(__dirname, 'constants.js'),
        // supabase
        supabase: resolve(__dirname, 'src/supabase-client/supabase-client.js'),
        // components folder
        main_content_container: resolve(__dirname, 'src/components/main-content-container.js'),
        bottom_menu: resolve(__dirname, 'src/components/bottom-menu.js'),
        sidebar_menu: resolve(__dirname, 'src/components/sidebar-menu.js'),
        site_header: resolve(__dirname, 'src/components/site-header.js'),
        // events
        events_container: resolve(__dirname, 'src/events/events-container.js'),
        event_creation_component: resolve(__dirname, 'src/events/event-creation-component.js'),
        event_action_menu: resolve(__dirname, 'src/events/events-action-menu.js'),
        get_upcoming_events: resolve(__dirname, 'src/events/services/get-upcoming-events.js'),
        // profile
        profile: resolve(__dirname, 'src/profile/profile-container.js'),
        // settings
        settings: resolve(__dirname, 'src/settings/settings-container.js'),
        // friends
        friends: resolve(__dirname, 'src/friends/friends-container.js')
      },
      // Ensure all JS modules are properly bundled
      external: []
    },
    // Make sure assets are copied correctly
    assetsDir: 'assets'
  },
  // Important for component loading
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  // Ensure proper serving of static assets
  publicDir: 'public'
});