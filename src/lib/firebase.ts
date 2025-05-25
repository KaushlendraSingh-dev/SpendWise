
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
if (typeof window !== 'undefined') {
  if (!firebaseConfig.apiKey) {
    console.error("CRITICAL DIAGNOSTIC (Client): NEXT_PUBLIC_FIREBASE_API_KEY is NOT SET or UNDEFINED in the client-side environment.");
  } else {
    // console.log("Firebase Config Check (Client): NEXT_PUBLIC_FIREBASE_API_KEY is SET.");
  }
  if (!firebaseConfig.projectId) {
    // console.error("Firebase Config Check (Client): NEXT_PUBLIC_FIREBASE_PROJECT_ID is NOT SET or UNDEFINED.");
  } else {
    // console.log("Firebase Config Check (Client): NEXT_PUBLIC_FIREBASE_PROJECT_ID is SET.");
  }
}

// Initialize Firebase
let app: FirebaseApp;

if (!getApps().length) {
  // Server-side check for API Key presence before attempting initialization
  // This log helps confirm if the server environment is providing the key.
  if (typeof window === 'undefined' && !firebaseConfig.apiKey) {
    console.error("Firebase Config Check (Server-Side): NEXT_PUBLIC_FIREBASE_API_KEY is MISSING or UNDEFINED. Firebase initialization will likely fail.");
    // We do not throw an error here; we let initializeApp attempt and fail if config is truly bad.
  }
  try {
    app = initializeApp(firebaseConfig);
  } catch (error: any) {
    console.error("Firebase initializeApp failed. This usually means your NEXT_PUBLIC_FIREBASE_... environment variables are not set correctly in your environment (e.g., Firebase Studio settings or .env.local), OR they are set but INVALID (e.g., wrong API key, incorrect project ID, or domain not authorized for this key). Please verify your environment configuration and RESTART your development server/environment. Original error:", error.message);
    // If on the server, re-throw to make it clear initialization failed,
    // as this is critical for server-side operations relying on Firebase.
    if (typeof window === 'undefined') {
        throw error;
    }
    // On the client, the console error is shown, and subsequent Firebase calls will fail.
    // app will remain undefined, and getAuth(app!) will likely throw.
  }
} else {
  app = getApp();
}

// @ts-ignore - app could be undefined if initializeApp fails catastrophically above.
// getAuth itself will throw if app is not a valid FirebaseApp instance or is undefined.
export const auth = getAuth(app!);
export default app;
