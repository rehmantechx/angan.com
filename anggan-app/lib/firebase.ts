// Firebase setup. Config comes only from environment variables
// (NEXT_PUBLIC_FIREBASE_*). No keys are committed. If the variables are
// empty or still placeholders, Firebase stays off and the app runs on the
// real seed data with a clear notice.
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { Firestore, initializeFirestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

export function isFirebaseConfigured(): boolean {
  // NOTE: access each variable with a static literal key. Next.js only
  // inlines NEXT_PUBLIC_* values into the browser bundle for static
  // process.env.NEXT_PUBLIC_... access. A dynamic lookup such as
  // process.env[key] is NOT replaced, so it reads as empty in the browser
  // and the app always thinks Firebase is off. That was a real bug: the
  // config was baked into the bundle but this check still returned false.
  const apiKey = (process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "").trim();
  const projectId = (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "").trim();
  if (!apiKey || !projectId) return false;
  if (apiKey.includes("YOUR_") || projectId.includes("YOUR_")) return false;
  return true;
}

let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0];
    return app;
  }
  app = initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
  return app;
}

let db: Firestore | null = null;

export function getDb(): Firestore | null {
  const a = getFirebaseApp();
  if (!a) return null;
  if (db) return db;
  // Forced long polling: the Firestore SDK normally streams over a
  // long-lived WebChannel connection. Some networks and proxies block that
  // stream, and the SDK then retries forever without ever answering, so
  // reads and writes hang. Long polling uses regular requests instead, so
  // the app works on those networks too. Auto-detect was tried first and
  // did not switch the write stream over, so polling is forced.
  db = initializeFirestore(a, { experimentalForceLongPolling: true });
  return db;
}

export function getFirebaseAuth(): Auth | null {
  const a = getFirebaseApp();
  return a ? getAuth(a) : null;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  const a = getFirebaseApp();
  return a ? getStorage(a) : null;
}
