// OLD OFFICE LOGIN URL, kept only as a redirect. The office login
// moved to the hidden /office-login page on 2026-11-25 (user order:
// no Google on the office login, two fixed email/password accounts
// only, hidden URL). /admin/login is no longer linked anywhere
// public; anyone who opens it lands on the new page instead.
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/office-login");
  }, [router]);
  return <p>Office login moved. Opening the office login...</p>;
}
