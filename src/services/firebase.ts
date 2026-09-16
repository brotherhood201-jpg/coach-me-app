import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  projectId: 'upheld-pathway-6lkcn',
  appId: '1:509949322028:web:0fe539dac6484c1bcbc289',
  apiKey: 'AIzaSyDSQKjoE8035f_QxZloSHv8tyhwK9LOX-U',
  authDomain: 'upheld-pathway-6lkcn.firebaseapp.com',
  firestoreDatabaseId: 'ai-studio-7723568b-2b84-45af-8c74-b641bcfa1d39',
  storageBucket: 'upheld-pathway-6lkcn.firebasestorage.app',
  messagingSenderId: '509949322028',
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app);

export default app;
