"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Firebase Auth is only needed for the office dashboard, the office
// login, the public sign-in and the create-listing page. On every
// other page the auth JavaScript is not loaded at all, so public
// visitors never download it. The office login is the hidden
// /office-login page (email and password, no Google): it MUST be in
// needsAuth, or the page falls back to the default context (loading
// forever) and never shows its form. That was a real bug, found by
// the 25 Nov 2026 round test: /office-login showed "Loading..."
// forever because this list did not include it.
const AuthProvider = dynamic(
  () => import("../lib/auth").then((m) => m.AuthProvider),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const needsAuth =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/office-login" ||
    pathname.startsWith("/create-listing") ||
    pathname.startsWith("/signin");
  if (!needsAuth) return <>{children}</>;
  return <AuthProvider>{children}</AuthProvider>;
}
