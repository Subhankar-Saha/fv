import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js';
import {
  initializeFirestore,
  persistentLocalCache,
} from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey:            'AIzaSyARMZZD-PQjjn3VdYRHIcCQieICRbq7bio',
  authDomain:        'family-vault-a4705.firebaseapp.com',
  projectId:         'family-vault-a4705',
  storageBucket:     'family-vault-a4705.firebasestorage.app',
  messagingSenderId: '253991738206',
  appId:             '1:253991738206:web:1a1cc61f9c545bbc614dcf',
};

const app = initializeApp(firebaseConfig);

// persistentLocalCache → offline support via IndexedDB
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});
