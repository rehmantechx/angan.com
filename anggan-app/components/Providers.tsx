"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Firebase Auth is only needed for the office dashboard, login and the
// create-listing page. On every other page the auth JavaScript is not
// loaded at all, so public visitors never download it. A signed-in office
// user on a public page sees Office login in the header instead of
// Dashboard; tapping it signs them straight through to the dashboard,
// because the login page redirects a signed-in user to /admin.
const AuthProvider = dynamic(
  () => import("../lib/auth").then((m) => m.AuthProvider),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const needsAuth =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/create-listing");
  if (!needsAuth) return <>{children}</>;
  return <AuthProvider>{children}</AuthProvider>;
}
