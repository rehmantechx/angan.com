// Light auth context: types and context only, NO Firebase imports.
// Site.tsx (the header, on every public page) uses this file, so the
// Firebase SDK is never bundled into a public page. The real provider
// lives in lib/auth.tsx and is only loaded on /admin and /create-listing.
"use client";
import { createContext, useContext } from "react";

export type Role = "Full access" | "Staff" | "View only";

// Email of the demo account created in the Firebase console
// (Email/Password provider + users document, role View only).
// No password is stored here or anywhere in the code. The dashboard and
// the create-listing page use this only to recognise that signed-in
// account and keep it read only. Remove the demo user from Firebase
// Auth and Firestore when testing is done, and remove this constant
// and the checks that use it.
export const DEMO_EMAIL = "demo@anngan.com";

export type SessionUser = {
  uid: string;
  email: string;
  name: string;
  role: Role;
  demo: boolean;
};

// PUBLIC TEST MODE was true for a short test on 2026-11-24 (user
// order 17:52 PKT: /admin public, no Google sign-in). REVERTED
// 2026-11-24: false again, Google-only login restored. The public
// test user below is removed. The Firestore rules in the repo file
// were also restored to the 8891e08 office-only version; the rules
// still need publishing in the Firebase console to take effect live.
export const PUBLIC_TEST_MODE = false;

type AuthCtx = {
  user: SessionUser | null;
  loading: boolean;
  firebaseOn: boolean;
  signInGoogle: () => Promise<string | null>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  firebaseOn: false,
  signInGoogle: async () => "Firebase is not connected.",
  signOut: async () => {},
});

export const AuthContext = Ctx;

export function useAuth() {
  return useContext(Ctx);
}
