// VAPID public key
const VAPID_PUBLIC_KEY =
  'BMXpx1jn2nJWELZLizV-Z40lkazJcSfVDqBsdkSanUi9tyP44sT2YLeJXeX8vudzSCr4YCNE5sAXQycNn204kz0';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function subscribeUserToPush() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    console.log('User is subscribed:', subscription);
    // Send the subscription object to your server
  } catch (error) {
    console.error('Failed to subscribe the user: ', error);
  }
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.ready.then(registration => {
      registration.pushManager.getSubscription().then(subscription => {
        if (subscription === null) {
          // We aren't subscribed yet, so we need to ask for permission
          // and then subscribe
          // todo we need a button to trigger this
          // subscribeUserToPush();
        }
      });
    });
  });
}
