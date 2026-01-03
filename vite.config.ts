import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        // main HTML entry points
        index: resolve(__dirname, 'index.html'),
        landing: resolve(__dirname, 'landing.html'),
        events: resolve(__dirname, 'events.html'),
        email_confirmation: resolve(__dirname, 'email-confirmation.html'),
        login: resolve(__dirname, 'src/auth/login.html'),
        create_account: resolve(__dirname, 'src/auth/create-account.html'),
        // auth entry points
        auth_redirect_to_app: resolve(
          __dirname,
          'src/auth/auth-redirect-to-app.html',
        ),
        // main JS file
        main: resolve(__dirname, 'main.ts'),
        // top level services, constants, misc, etc
        constants: resolve(__dirname, 'constants.js'),
        // supabase
        supabase: resolve(__dirname, 'src/supabase-client/supabase-client.ts'),
        // components folder
        main_content_container: resolve(
          __dirname,
          'src/components/main-content-container.js',
        ),
        bottom_menu: resolve(__dirname, 'src/components/bottom-menu.js'),
        sidebar_menu: resolve(__dirname, 'src/components/sidebar-menu.js'),
        site_header: resolve(__dirname, 'src/components/site-header.js'),
        // profile
        profile: resolve(__dirname, 'vue-app/src/profile/profile.vue'),
        // friends
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
      src: resolve(__dirname, './src'),
    },
  },
  // Ensure proper serving of static assets
  publicDir: 'public',
});
