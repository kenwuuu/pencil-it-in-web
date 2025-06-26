import 'src/startup-scripts/alpine-script.ts'; // Alpine code
import 'src/startup-scripts/theming-script.ts'; // THEME AND APPEARANCE CODE
import 'src/startup-scripts/notifications-script.ts'; // START CAPACITOR NOTIFICATION SETUP
import 'src/startup-scripts/web-push-notifications.js'; // START PWA NOTIFICATION SETUP
import { App } from '@capacitor/app';

App.addListener('appUrlOpen', data => {
  const url = data.url;
  console.log('App opened with URL:', url);

  // Check if the universal link matches what you want
  if (url.includes('/events.html')) {
    // Redirect the current page inside the WebView
    window.location.href = '/events.html';
  }
});
