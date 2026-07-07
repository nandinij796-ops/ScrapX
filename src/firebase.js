import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCB20th39jiClzGnvqW10jY-xY2C942amc",
  authDomain: "scrapx-37e3e.firebaseapp.com",
  projectId: "scrapx-37e3e",
  storageBucket: "scrapx-37e3e.firebasestorage.app",
  messagingSenderId: "275662064062",
  appId: "1:275662064062:web:31ebf113ad78586e7d11ef",
  measurementId: "G-MB9ZQZEMBF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;