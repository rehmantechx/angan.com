// Auth: Firebase Google sign-in when connected. This file is only loaded
// on /admin and /create-listing (see Providers). It must NOT be imported
// by the header or any public page: the Firebase SDK imports below are
// dynamic, and the context lives in lib/auth-context.tsx, so public pages
// never download the Firebase SDK.
"use client";
import { useEffect, useState, ReactNode } from "react";
import { AuthContext, Role, SessionUser, useAuth } from "./auth-context";
import { getFirebaseAuth, getDb, isFirebaseConfigured } from "./firebase";

export type { Role, SessionUser };
export { useAuth };
export const Ctx = AuthContext;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const firebaseOn = isFirebaseConfigured();

  useEffect(() => {
    if (!firebaseOn) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    let unsub: (() => void) | undefined;
    (async () => {
      const auth = await getFirebaseAuth();
      const db = await getDb();
      if (cancelled) return;
      if (!auth) {
        setLoading(false);
        return;
      }
      const { onAuthStateChanged } = await import("firebase/auth");
      const { doc, getDoc, setDoc } = await import("firebase/firestore");
      if (cancelled) return;
      unsub = onAuthStateChanged(auth, async (fbUser) => {
        if (!fbUser) {
          setUser(null);
          setLoading(false);
          return;
        }
        let role: Role = "View only";
        if (db) {
          try {
            const ref = doc(db, "users", fbUser.uid);
            const snap = await getDoc(ref);
            if (snap.exists()) {
              const data = snap.data() as { role?: Role };
              if (data.role) role = data.role;
            } else {
              // First sign-in: create the user's own document as View only.
              // The rules only allow a user to create their own document with
              // role View only. The owner then raises the role to Full access
              // or Staff in the Firebase console. If this write fails (for
              // example the updated rules are not published yet), the session
              // stays View only and the owner adds the document by hand.
              try {
                await setDoc(ref, {
                  email: fbUser.email || "",
                  name: fbUser.displayName || fbUser.email || "Office user",
                  role: "View only",
                });
              } catch {
                // role stays View only until the owner adds the user document
              }
            }
          } catch {
            // role stays View only until the owner adds the user document
          }
        }
        setUser({
          uid: fbUser.uid,
          email: fbUser.email || "",
          name: fbUser.displayName || fbUser.email || "Office user",
          role,
          demo: false,
        });
        setLoading(false);
      });
    })();
    return () => {
      cancelled = true;
      if (unsub) unsub();
    };
  }, [firebaseOn]);

  async function signInGoogle(): Promise<string | null> {
    const auth = await getFirebaseAuth();
    if (!auth) return "Firebase is not connected. Fill in .env.local first.";
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      await signInWithPopup(auth, new GoogleAuthProvider());
      return null;
    } catch (e) {
      const err = e as { message?: string };
      return err.message || "Google sign-in failed.";
    }
  }

  async function signInEmail(email: string, password: string): Promise<string | null> {
    const auth = await getFirebaseAuth();
    if (!auth) return "Firebase is not connected. Fill in .env.local first.";
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return null;
    } catch (e) {
      const err = e as { message?: string; code?: string };
      // Show the real Firebase error, not a generic line, so a missing
      // provider (auth/operation-not-allowed) or a wrong password
      // (auth/invalid-credential) is diagnosable on the page.
      return err.message || "Email sign-in failed.";
    }
  }

  async function signOut() {
    const auth = await getFirebaseAuth();
    if (auth) {
      try {
        const { signOut: fbSignOut } = await import("firebase/auth");
        await fbSignOut(auth);
      } catch {
        // ignore
      }
    }
    setUser(null);
  }

  return (
    <Ctx.Provider value={{ user, loading, firebaseOn, signInGoogle, signInEmail, signOut }}>
      {children}
    </Ctx.Provider>
  );
}
