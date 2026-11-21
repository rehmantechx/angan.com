"use client";
import dynamic from "next/dynamic";

// Firebase Auth is only needed for the office dashboard and login. Loading it
// lazily keeps its JavaScript out of the first paint of the public pages.
// It still loads after hydration, so a signed-in office user still sees
// the Dashboard link in the header on every page.
const AuthProvider = dynamic(
  () => import("../lib/auth").then((m) => m.AuthProvider),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
