
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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

// Initialize Firebase
let app: FirebaseApp;

// Check if Firebase app has already been initialized to avoid re-initialization errors
if (!getApps().length) {
  // A very basic check. If the API key is obviously not set,
  // initializeApp will likely fail or lead to issues later.
  if (!firebaseConfig.apiKey) {
    console.error(
      "CRITICAL CLIENT-SIDE DIAGNOSTIC: NEXT_PUBLIC_FIREBASE_API_KEY is NOT SET or UNDEFINED in the client-side environment. " +
      "Firebase cannot initialize properly. " +
      "Please ensure this environment variable is correctly set in your Firebase Studio environment settings (or .env.local if applicable for client-side bundling) AND that you have RESTARTED your development server/environment."
    );
    // Note: We let initializeApp proceed to see Firebase's own error,
    // but this console error should prompt checking environment variables.
  }
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Use the already initialized app
}

// If 'app' was initialized with an invalid/missing API key, 
// getAuth() will typically throw an error like "auth/invalid-api-key"
export const auth = getAuth(app); 
export default app;
