import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js';
import {
  initializeFirestore,
  persistentLocalCache,
} from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey:            '__FIREBASE_API_KEY__',
  authDomain:        '__FIREBASE_AUTH_DOMAIN__',
  projectId:         '__FIREBASE_PROJECT_ID__',
  storageBucket:     '__FIREBASE_STORAGE_BUCKET__',
  messagingSenderId: '__FIREBASE_MESSAGING_SENDER_ID__',
  appId:             '__FIREBASE_APP_ID__',
};
 
const app = initializeApp(firebaseConfig);

// persistentLocalCache → offline support via IndexedDB
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});
