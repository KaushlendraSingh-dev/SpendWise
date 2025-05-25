
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// These values are read from environment variables.
// IMPORTANT: Ensure these NEXT_PUBLIC_... variables are correctly set in your
// Firebase Studio environment settings or .env.local file,
// AND that you have RESTARTED your development server/environment after setting them.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Client-side diagnostic check for the API key.
// Check your browser's developer console for this message if issues persist.
if (typeof window !== 'undefined' && !firebaseConfig.apiKey) {
  console.error(
    "CRITICAL CLIENT-SIDE DIAGNOSTIC: NEXT_PUBLIC_FIREBASE_API_KEY is NOT SET or UNDEFINED in the client-side environment. " +
    "Firebase cannot initialize properly. " +
    "Please ensure this environment variable is correctly set in your Firebase Studio environment settings (or .env.local if applicable) AND that you have RESTARTED your development server/environment."
  );
}

// Initialize Firebase
let app: FirebaseApp;

if (!getApps().length) {
  // If firebaseConfig.apiKey is undefined here, initializeApp might not throw immediately in all cases,
  // but subsequent calls like getAuth() will fail if the API key was invalid.
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// If 'app' was initialized with an invalid/missing API key, getAuth() will typically throw an error.
export const auth = getAuth(app);
export default app;
