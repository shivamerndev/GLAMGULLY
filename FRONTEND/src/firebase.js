import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAu3AnDWfL7KMRdGky02cjUFd1CCDjT6Hw",
  authDomain: "glamgully-e861c.firebaseapp.com",
  projectId: "glamgully-e861c",
  storageBucket: "glamgully-e861c.firebasestorage.app",
  messagingSenderId: "736934255995",
  appId: "1:736934255995:web:be2364419590fb845871de",
  // measurementId: "G-PDWHRLB7S3"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Permission lene aur token fetch karne ka function
export const getOrRenewToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const currentToken = await getToken(messaging, {
        vapidKey: "BKoV1qja0tzUN_d-LH3yMUv7YJEEsmgmS4UVA0_53v1wTpX9XgL0PwExMSmXvMLsU5FLTnXUtkd0elE5mVvRYLI" // Yahan VAPID public key daalein
      });
      console.log("FCM :", currentToken.slice(0,10));
      return currentToken;
    } else {
      console.log('Permission denied for notifications.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token.', error);
    return null;
  }
};

// Foreground messages handle karne ke liye
export const onForegroundMessage = () => {
  onMessage(messaging, (payload) => {
    console.log('Fg message:', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
    };
    new Notification(notificationTitle, notificationOptions);
  });
};