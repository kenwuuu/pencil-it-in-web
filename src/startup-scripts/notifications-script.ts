import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { upsertNotificationToken } from 'src/push_notifications/services/upsert-notification-token';
import Alpine from 'alpinejs';

// Request permission to use push notifications
// iOS will prompt user and return if they granted permission or not
// Android will just grant without prompting
// todo delay this ask until user adds their first friend. then hit them with "Would you like to be notified when your friends invite you to an event?"
PushNotifications.requestPermissions().then(result => {
  if (result.receive === 'granted') {
    // Register with Apple / Google to receive push via APNS/FCM
    PushNotifications.register();
  }
});

// todo one time use: force registration of devices with apps from before notification implementation
// delete this after building. do not commit
PushNotifications.register();

// On success, we should be able to receive notifications
PushNotifications.addListener('registration', (token: Token) => {
  console.log('Push registration success, token: ' + token.value);
  upsertNotificationToken(token.value, true);
  Alpine.store('notificationToken', token.value);
});

// Some issue with our setup and push will not work
PushNotifications.addListener('registrationError', (error: any) => {
  console.log('Error on registration: ' + JSON.stringify(error));
});

// Show us the notification payload if the app is open on our device
PushNotifications.addListener(
  'pushNotificationReceived',
  (notification: PushNotificationSchema) => {
    console.log('Push received: ' + JSON.stringify(notification));
  },
);

// Method called when tapping on a notification
PushNotifications.addListener(
  'pushNotificationActionPerformed',
  (notification: ActionPerformed) => {
    console.log('Push action performed: ' + JSON.stringify(notification));
  },
);
