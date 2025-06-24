const CACHE_NAME = 'my-pwa-cache-v1';

const FILES_TO_CACHE = [
  // HTML entry points
  '/',
  '/index.html',
  '/landing.html',
  '/events.html',
  '/email-confirmation.html',
  '/src/auth/login.html',
  '/src/auth/create-account.html',

  // Main JS bundle
  '/main.ts',

  // Utilities and constants
  '/constants.js',
  '/src/supabase-client/supabase-client.js',

  // Components
  '/src/components/main-content-container.js',
  '/src/components/bottom-menu.js',
  '/src/components/sidebar-menu.js',
  '/src/components/site-header.js',

  // Events
  '/src/events/events-container.js',
  '/src/events/events-feed/components/events-feed.js',
  '/src/events/events-feed/components/participants-modal.js',
  '/src/events/event-creator/event-creation-component.js',
  '/src/events/events-action-menu.js',
  '/src/events/events-feed/services/get-upcoming-events.js',

  // Profile and Friends
  '/src/profile/profile-container.js',
  '/src/friends/friends-container.js',

  // Assets (optional: icons, logos, etc.)
  '/assets/icon-192x192.png',
  '/assets/icon-512x512.png',
];

self.addEventListener('install', event => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    }),
  );
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', event => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removing old cache', key);
            return caches.delete(key);
          }
        }),
      );
    }),
  );
  self.clients.claim(); // Control all clients immediately
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then(response => {
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic'
          ) {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Offline fallback (optional)
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
    }),
  );
});
