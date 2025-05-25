
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
// This helps confirm if the browser is receiving the API key.
// If this logs an error, the .env.local setup or Studio env vars are likely the issue.
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
  // it might not throw immediately, but getAuth() called later will likely throw the 'auth/invalid-api-key' error.
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // Optionally, rethrow or handle as a critical failure if app remains uninitialized
    // For now, we let getAuth handle uninitialized app scenarios.
    // @ts-ignore - app could be undefined if initializeApp fails catastrophically
    app = undefined; 
  }
} else {
  app = getApp();
}

// The non-null assertion operator (!) implies 'app' is expected to be a valid FirebaseApp.
// If 'app' is undefined due to a catastrophic failure in initializeApp (e.g., API key was so malformed
// that even the basic config object couldn't be processed, though typically it proceeds to getAuth to fail),
// getAuth(app!) would then correctly throw an error.
// If NEXT_PUBLIC_FIREBASE_API_KEY is simply undefined, initializeApp proceeds,
// but getAuth will throw 'auth/invalid-api-key'.
export const auth = getAuth(app!);
export default app;
