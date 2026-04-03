import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration for web
const firebaseConfig = {
  apiKey: "AIzaSyA4656zK8fVs_yGIK5pZ7xC6ymv6n2nQ14",
  authDomain: "safehire-09.firebaseapp.com",
  projectId: "safehire-09",
  storageBucket: "safehire-09.firebasestorage.app",
  messagingSenderId: "362128839530",
  appId: "1:362128839530:web:0c4fb0a5f2b6d7e8"
};

let app: any = null;
let authInstance: any = null;
let dbInstance: any = null;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);

  // Initialize Firebase Authentication
  authInstance = getAuth(app);
  
  // Set persistence
  setPersistence(authInstance, browserLocalPersistence).catch(err => {
    console.error('Persistence error:', err);
  });

  // Initialize Firestore Database
  dbInstance = getFirestore(app);
  
  console.log('✓ Firebase initialized successfully');
} catch (error: any) {
  console.error('Firebase initialization error:', error.message);
}

export const auth = authInstance;
export const db = dbInstance;
export default app;
