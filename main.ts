import 'src/startup-scripts/alpine-script.ts'; // Alpine code
import 'src/startup-scripts/theming-script.ts'; // THEME AND APPEARANCE CODE
import 'src/startup-scripts/notifications-script.ts'; // START CAPACITOR NOTIFICATION SETUP

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(reg => console.log('Service Worker registered:', reg))
    .catch(err => console.error('Service Worker registration failed:', err));
}
