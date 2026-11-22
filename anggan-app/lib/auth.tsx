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

const DEMO_KEY = "anngan-demo-session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const firebaseOn = isFirebaseConfigured();

  useEffect(() => {
    if (!firebaseOn) {
      try {
        const raw = window.localStorage.getItem(DEMO_KEY);
        if (raw) setUser(JSON.parse(raw));
      } catch {
        // no demo session
      }
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

  function signInDemo() {
    const demo: SessionUser = {
      uid: "demo-office",
      email: "office@anngan.com",
      name: "Demo office user",
      role: "Full access",
      demo: true,
    };
    window.localStorage.setItem(DEMO_KEY, JSON.stringify(demo));
    setUser(demo);
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
    window.localStorage.removeItem(DEMO_KEY);
    setUser(null);
  }

  return (
    <Ctx.Provider value={{ user, loading, firebaseOn, signInGoogle, signInDemo, signOut }}>
      {children}
    </Ctx.Provider>
  );
}
