import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? undefined,
};

type FirebaseConfig = typeof firebaseConfig;

export const isFirebaseConfigured = (config: Partial<FirebaseConfig> = firebaseConfig) => {
  const requiredKeys = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ] as const;

  return requiredKeys.every((key) => Boolean(config[key]));
};

export const getFirebaseService = <T>(factory: () => T): T | null => {
  try {
    return factory();
  } catch {
    return null;
  }
};

const isBrowserRuntime = typeof window !== "undefined";

export const firebaseApp = isBrowserRuntime && isFirebaseConfigured()
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const auth = firebaseApp ? getFirebaseService(() => getAuth(firebaseApp)) : null;
export const storage = firebaseApp ? getFirebaseService(() => getStorage(firebaseApp)) : null;
export const analytics = firebaseApp ? getFirebaseService(() => getAnalytics(firebaseApp)) : null;
