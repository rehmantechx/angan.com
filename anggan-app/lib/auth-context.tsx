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

// TEMPORARY PUBLIC TEST MODE (user order 2026-11-24 17:52 PKT, short
// test only, revert soon). When true, /admin opens with NO Google
// sign-in: the auth provider hands out the public test user below
// (Full access, not a demo user, not demo@anngan.com) and never calls
// Firebase Auth, so the login redirect on /admin never fires and
// /admin/login redirects straight to /admin. The Google sign-in code
// in lib/auth.tsx is NOT removed, it is only skipped while this flag
// is true. REVERT: set this back to false AND republish the
// pre-test firestore.rules (commit 8891e08) in the Firebase console.
// Until both are done, anyone on the internet can edit and delete
// dashboard data. See REVERT.md in
// ~/workspace/angan-e2e-evidence/admin-public-test-2026-11-24/.
export const PUBLIC_TEST_MODE = true;

export const PUBLIC_TEST_USER: SessionUser = {
  uid: "public-test",
  email: "Public test (no login)",
  name: "Public test",
  role: "Full access",
  demo: false,
};

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
