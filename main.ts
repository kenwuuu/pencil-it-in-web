import Alpine from 'alpinejs';
import { supabase } from '@/supabase-client/supabase-client.js';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';

// Ensure Alpine is available globally
(window as any).Alpine = Alpine;

// Define Alpine store types
type ProfilePhotoStore = {
  url: string;
  set: (newUrl: string) => void;
};

type UserIdStore = string | null;

// Initialize Alpine global state
Alpine.store('profile_photo', {
  url: '',
  set(newUrl: string) {
    this.url = newUrl;
  },
} as ProfilePhotoStore);

// hacky way around "Top level await not available"
(async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error('Failed to fetch user', error);
    Alpine.store('userId', null);
    return;
  }

  Alpine.store('userId', user.id as UserIdStore);
})();

Alpine.start();
// end mandatory alpine stuff

// START CAPACITOR NOTIFICATION SETUP
// Request permission to use push notifications
// iOS will prompt user and return if they granted permission or not
// Android will just grant without prompting
PushNotifications.requestPermissions().then(result => {
  if (result.receive === 'granted') {
    // Register with Apple / Google to receive push via APNS/FCM
    PushNotifications.register();
  } else {
    // Show some error
  }
});

// On success, we should be able to receive notifications
PushNotifications.addListener('registration', (token: Token) => {
  // alert('Push registration success, token: ' + token.value);
});

// Some issue with our setup and push will not work
PushNotifications.addListener('registrationError', (error: any) => {
  // alert('Error on registration: ' + JSON.stringify(error));
});

// Show us the notification payload if the app is open on our device
PushNotifications.addListener(
  'pushNotificationReceived',
  (notification: PushNotificationSchema) => {
    // alert('Push received: ' + JSON.stringify(notification));
  },
);

// Method called when tapping on a notification
PushNotifications.addListener(
  'pushNotificationActionPerformed',
  (notification: ActionPerformed) => {
    // alert('Push action performed: ' + JSON.stringify(notification));
  },
);
// END CAPACITOR NOTIFICATION SETUP

// START THEME AND APPEARANCE CODE
// hacky way to make DaisyUI button animations work on iOS
document.addEventListener('touchstart', () => {}, true);

// dark mode script
const setTheme = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute(
    'data-theme',
    prefersDark ? 'cupcake_dark' : 'cupcake',
  );
};

// auto switch when system switches
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', setTheme);

// Initial load
setTheme();
//
