import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCB20th39jiClzGnvqW10jY-xY2C942amc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "scrapx-37e3e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "scrapx-37e3e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "scrapx-37e3e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "275662064062",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:275662064062:web:31ebf113ad78586e7d11ef",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-MB9ZQZEMBF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;