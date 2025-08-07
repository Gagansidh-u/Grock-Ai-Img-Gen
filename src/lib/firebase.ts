// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDh8go3P4z0u65xuljJsGY8pSXNdoJFEyM",
  authDomain: "grock-img-ai.firebaseapp.com",
  projectId: "grock-img-ai",
  storageBucket: "grock-img-ai.appspot.com",
  messagingSenderId: "317564037631",
  appId: "1:317564037631:web:c786b52c114afc650c9fca",
  measurementId: "G-EFJ4NQ1K08"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider, signInWithPopup, onAuthStateChanged };
export type { User };
