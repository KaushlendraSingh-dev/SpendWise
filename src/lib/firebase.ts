
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

// Client-side diagnostic logging
// This will run in the browser and can help verify if client-side env vars are present.
if (typeof window !== 'undefined') {
  console.log("Firebase Config Check (Client-Side):");
  if (!firebaseConfig.apiKey) {
    console.error("CRITICAL DIAGNOSTIC (Client): NEXT_PUBLIC_FIREBASE_API_KEY is NOT SET or UNDEFINED in the client-side environment. Firebase cannot initialize properly.");
  } else {
    // console.log("NEXT_PUBLIC_FIREBASE_API_KEY (Client): SET"); // Value hidden for security
  }
} else {
  // Basic server-side check for logging purposes (will appear in server logs).
  console.log("Firebase Config Check (Server-Side):");
  if (!firebaseConfig.apiKey) {
    console.error("CRITICAL DIAGNOSTIC (Server): NEXT_PUBLIC_FIREBASE_API_KEY is MISSING or UNDEFINED on the server. Firebase initialization will likely fail, leading to 'auth/invalid-api-key' errors.");
  } else {
    // console.log("NEXT_PUBLIC_FIREBASE_API_KEY (Server): SET"); // Value hidden for security
  }
}

// Initialize Firebase
let app: FirebaseApp;

if (!getApps().length) {
  // If firebaseConfig.apiKey is missing or invalid here,
  // initializeApp might not throw an error immediately, but getAuth almost certainly will.
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// getAuth will throw "auth/invalid-api-key" if the app instance was initialized with an invalid API key.
export const auth = getAuth(app);
export default app;
