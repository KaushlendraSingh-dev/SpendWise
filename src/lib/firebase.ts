
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Log environment variables to help debug configuration issues
// This will run on both server and client, but only log specific messages for each
if (typeof window === 'undefined') { // Server-side logging
  console.log("--- Firebase Configuration Check (Server-Side) ---");
  if (!firebaseConfig.apiKey) {
    console.error("CRITICAL DIAGNOSTIC (Server): Firebase API Key is MISSING in firebaseConfig. process.env.NEXT_PUBLIC_FIREBASE_API_KEY was likely undefined or empty. Firebase cannot initialize. Ensure this env var is set correctly in your Firebase Studio environment AND THE ENVIRONMENT WAS RESTARTED.");
  } else {
    console.log("DIAGNOSTIC (Server): Firebase API Key IS PRESENT in firebaseConfig. Value (first 5 chars for verification):", firebaseConfig.apiKey.substring(0,5) + "...");
  }
  console.log("DIAGNOSTIC (Server): Project ID in firebaseConfig:", firebaseConfig.projectId || "NOT SET or UNDEFINED");
  console.log("DIAGNOSTIC (Server): Auth Domain in firebaseConfig:", firebaseConfig.authDomain || "NOT SET or UNDEFINED");
  console.log("--- End of Server-Side Firebase Configuration Check ---");
}

if (typeof window !== 'undefined') { // Client-side logging
  console.log("--- Firebase Configuration Check (Client-Side) ---");
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    console.error("CRITICAL DIAGNOSTIC (Client): NEXT_PUBLIC_FIREBASE_API_KEY is NOT SET or UNDEFINED in the client-side environment. Firebase cannot initialize. Please ensure this environment variable is correctly configured in your Firebase Studio settings and the environment has been restarted.");
  } else {
    console.log("DIAGNOSTIC (Client): NEXT_PUBLIC_FIREBASE_API_KEY is SET. Value (first 5 chars for verification):", process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0,5) + "...");
  }
  console.log("DIAGNOSTIC (Client): NEXT_PUBLIC_FIREBASE_PROJECT_ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "NOT SET or UNDEFINED");
  console.log("DIAGNOSTIC (Client): NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "NOT SET or UNDEFINED");
  console.log("DIAGNOSTIC (Client): NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "NOT SET or UNDEFINED");
  console.log("DIAGNOSTIC (Client): NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:", process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "NOT SET or UNDEFINED");
  console.log("DIAGNOSTIC (Client): NEXT_PUBLIC_FIREBASE_APP_ID:", process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "NOT SET or UNDEFINED");
  console.log("--- End of Client-Side Firebase Configuration Check ---");
}


// Initialize Firebase
let app;
if (!getApps().length) {
  // If firebaseConfig.apiKey is not set or is an empty string, initializeApp will throw an error.
  // Firebase's own error is usually descriptive.
  try {
    if (!firebaseConfig.apiKey) {
      // This specific check helps to be very explicit if the API key is truly empty before Firebase tries.
      const apiKeyMissingError = "CRITICAL Firebase Initialization Error: API key is missing or empty in the firebaseConfig object. This means process.env.NEXT_PUBLIC_FIREBASE_API_KEY was not resolved. Check environment variable settings in Firebase Studio and RESTART the environment.";
      console.error(apiKeyMissingError);
      if (typeof window === 'undefined') { // On server, make this fatal.
        throw new Error(apiKeyMissingError);
      }
      // On client, error is logged, further Firebase ops will fail.
    }
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("CRITICAL Firebase Initialization Error during initializeApp. This often means your NEXT_PUBLIC_FIREBASE_API_KEY (and other config) environment variables are not set correctly, OR are set but INVALID (e.g., wrong key, wrong project, domain not authorized). Please check your environment settings, ensure they match your Firebase project, and restart. Original error:", error);
    // Re-throw to make it very visible and stop execution if init fails
    throw error;
  }
} else {
  app = getApp();
}

// If app initialization failed catastrophically above, `app` might not be a valid FirebaseApp.
// getAuth will throw if app is not a valid FirebaseApp instance.
export const auth = getAuth(app);
export default app;
