import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Copy .env.example to .env and paste your Firebase Web App config values.
// Firebase Authentication > Sign-in method: enable Email/Password.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log("Firebase project:", firebaseConfig.projectId);
console.log("API key loaded:", Boolean(firebaseConfig.apiKey));
console.log("API key starts with AIza:", firebaseConfig.apiKey?.startsWith("AIza"));
console.log("API key length:", firebaseConfig.apiKey?.length);


const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId
);

const app = hasFirebaseConfig ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const firebaseConfigured = hasFirebaseConfig;
