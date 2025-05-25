
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// These values are read from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Client-side diagnostic check for the API key
if (typeof window !== 'undefined' && !firebaseConfig.apiKey) {
  console.error(
    "CRITICAL DIAGNOSTIC (Client): NEXT_PUBLIC_FIREBASE_API_KEY is NOT SET or UNDEFINED in the client-side environment. " +
    "Firebase cannot initialize properly. " +
    "Ensure this environment variable is correctly set (e.g., in .env.local or Firebase Studio settings) and the Next.js development server was restarted."
  );
}

// Initialize Firebase
let app: FirebaseApp;

if (!getApps().length) {
  // initializeApp will use the firebaseConfig. If apiKey is missing/invalid (especially if undefined),
  // getAuth() called later will likely throw the 'auth/invalid-api-key' error.
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// The non-null assertion operator (!) assumes 'app' will be a valid FirebaseApp.
// If initializeApp failed due to critically missing config (like apiKey being undefined),
// 'app' might not be a valid FirebaseApp instance, and getAuth(app!) would then correctly throw an error.
export const auth = getAuth(app!);
export default app;
