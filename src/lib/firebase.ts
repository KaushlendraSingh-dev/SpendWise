
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// These values are read from environment variables.
// IMPORTANT: Ensure these NEXT_PUBLIC_... variables are correctly set in your
// Firebase Studio environment settings (or .env.local file if used by Studio for server & client)
// AND that you have RESTARTED your development server/environment after setting them.

// Perform a check for server-side rendering (SSR) context vs. client-side
if (typeof window === 'undefined') {
  // Server-side
  // console.log("Firebase Config Check (Server-Side):");
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    // console.error("CRITICAL Firebase Config (Server-Side): NEXT_PUBLIC_FIREBASE_API_KEY is MISSING or empty. Firebase might not initialize correctly on the server.");
    // It's generally better not to throw here on server, as client-side init might still be intended
  } else {
    // console.log("NEXT_PUBLIC_FIREBASE_API_KEY (Server): SET"); // Value hidden for security
  }
} else {
  // Client-side
  // console.log("Firebase Config Check (Client-Side):");
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    console.error("CRITICAL DIAGNOSTIC (Client): NEXT_PUBLIC_FIREBASE_API_KEY is NOT SET or UNDEFINED in the client-side environment. Firebase cannot initialize properly.");
  } else {
    // console.log("NEXT_PUBLIC_FIREBASE_API_KEY (Client): SET"); // Value hidden for security
  }
}


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Use the already initialized app
}

export const auth = getAuth(app!);
export const db = getFirestore(app!); // Initialize and export Firestore
export default app;
