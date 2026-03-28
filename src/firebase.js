import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
    apiKey: "AIzaSyAt0laOz0zbdMwHe7pK6janSqCzbN1UwoU",
    authDomain: "proyecto-xyz-bdc27.firebaseapp.com",
    projectId: "proyecto-xyz-bdc27",
    storageBucket: "proyecto-xyz-bdc27.firebasestorage.app",
    messagingSenderId: "448998154501",
    appId: "1:448998154501:web:104f67386a6941bf1d176c"
};

import { getStorage } from "firebase/storage";

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
