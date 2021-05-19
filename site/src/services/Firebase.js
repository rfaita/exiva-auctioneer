import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCg1tnNVYHGSshENr_D1Ge6AQOmOFzeZuA",
  authDomain: "exiva-auctioneer.firebaseapp.com",
  projectId: "exiva-auctioneer",
  storageBucket: "exiva-auctioneer.appspot.com",
  messagingSenderId: "263165882249",
  appId: "1:263165882249:web:310bfe7acc88c6d66c3b58"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
//export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
  return auth.signInWithPopup(provider);
};

export const signInWithEmailAndPassword = (email, pass) => {
  return auth.signInWithEmailAndPassword(email, pass);
}

export const createUserWithEmailAndPassword = (email, pass) => {
  return auth.createUserWithEmailAndPassword(email, pass);
}

export const signOut = (email, pass) => {
  return auth.signOut();
}

const messaging = firebase.messaging();

export const getToken = (setToken) => {
  return messaging.getToken({ vapidKey: 'BFAXqFZULES9K5oQzx2UQMuBcbZNIXR7Ru3-IKqpnEWVVl2j3N4u9qRq6S-3z83nmPBI7FmGFQWLLvWzIQNhSrU' }).then((currentToken) => {
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      setToken(currentToken);
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log('No registration token available. Request permission to generate one.');
      setToken(null);
      // shows on the UI that permission is required 
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // catch error while creating client token
  });
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });