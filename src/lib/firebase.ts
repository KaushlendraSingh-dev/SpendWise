
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// These values are read from environment variables.
// IMPORTANT: Ensure these NEXT_PUBLIC_... variables are correctly set in your
// Firebase Studio environment settings (or .env.local file if used by Studio for server & client)
// AND that you have RESTARTED your development server/environment after setting them.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Perform a check for client-side context
if (typeof window !== 'undefined') {
  // Client-side
  if (!firebaseConfig.apiKey) {
    console.error("CRITICAL DIAGNOSTIC (Client): NEXT_PUBLIC_FIREBASE_API_KEY is NOT SET or UNDEFINED in the client-side environment. Firebase cannot initialize properly.");
  }
}


// Initialize Firebase
let app: FirebaseApp;

if (!getApps().length) {
  if (!firebaseConfig.apiKey) {
    // This check is primarily for the server-side during build or SSR,
    // as the client-side check above would catch it for browser environment.
    console.error("CRITICAL Firebase Config (Build/Server-Side): NEXT_PUBLIC_FIREBASE_API_KEY is MISSING or empty. Firebase initialization will likely fail.");
    // We don't throw here to allow the app to potentially proceed if only client-side Firebase is intended,
    // though in this app structure, it's needed on both.
  }
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Use the already initialized app
}

// @ts-ignore - app could be undefined if initializeApp fails catastrophically above,
// but getAuth/getFirestore themselves will throw if app is not a valid FirebaseApp instance.
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
