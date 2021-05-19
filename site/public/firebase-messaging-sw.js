// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyCg1tnNVYHGSshENr_D1Ge6AQOmOFzeZuA",
    authDomain: "exiva-auctioneer.firebaseapp.com",
    projectId: "exiva-auctioneer",
    storageBucket: "exiva-auctioneer.appspot.com",
    messagingSenderId: "263165882249",
    appId: "1:263165882249:web:310bfe7acc88c6d66c3b58"
};


firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload);

    const notificationTitle = payload.data.title;
    const notificationOptions = {
        body: payload.data.body,
        icon: 'https://exiva-auctioneer.herokuapp.com/imgs/logo.gif',
        data: payload.data
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);

    
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(`https://exiva-auctioneer.herokuapp.com/auction/${event.notification.data.auctionId}`)
    );
});