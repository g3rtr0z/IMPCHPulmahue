import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Environment variables are preferred, but if they are missing (build-time), 
// we fall back to the hardcoded keys to ensure the production site works.
// This allows the user to have a functioning site while they learn to manage Vercel ENV.
export const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAt0laOz0zbdMwHe7pK6janSqCzbN1UwoU",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "proyecto-xyz-bdc27.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "proyecto-xyz-bdc27",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "proyecto-xyz-bdc27.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "448998154501",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:448998154501:web:104f67386a6941bf1d176c"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
