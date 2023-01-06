// async function notifPermission() {
//     return await Notification.requestPermission();
// };


// function isServiceWorkerSupported() {
//     if ('serviceWorker' in navigator) return true;


//     return false;
// }

const VAPID_PUBLIC_KEY1 = 'BO1HaUoJThYJsetJmFK2YLeN9P3scsLLm4Ol3Z2a7BZANdX3IIj4mb6RQsHlDJjkZ18HIxwHUtKoJPcRjl7wq4U'

async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      const register = await navigator.serviceWorker.register('/worker1.js', {
        scope: '/'
      });
  
      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY1
      });
  
      await fetch('/webpush/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      console.error('Service workers are not supported in this browser');
    }
  }

registerServiceWorker();
