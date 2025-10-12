importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyAu3AnDWfL7KMRdGky02cjUFd1CCDjT6Hw",
  authDomain: "glamgully-e861c.firebaseapp.com",
  projectId: "glamgully-e861c",
  storageBucket: "glamgully-e861c.firebasestorage.app",
  messagingSenderId: "736934255995",
  appId: "1:736934255995:web:be2364419590fb845871de",
  // measurementId: "G-PDWHRLB7S3"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('bg msg :', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icons/icon-512x512.png' // Yahan ek icon image do
    };
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('glamgully-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/icons/icon-192x192.png',
        '/icons/icon-512x512.png'
      ]);
    })
  );
  console.log("SW Installed");
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});