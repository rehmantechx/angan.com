// OFFICE LOGIN, hidden URL (user order 2026-11-25): the office
// signs in with email and password only. No Continue with Google
// here, and this page is not linked from the public navbar, footer
// or any public page, so only someone who knows the address can
// find it. Only the two fixed office accounts in OFFICE_EMAILS
// (lib/auth-context.tsx) can sign in; a signed-in account that is
// not one of those two is signed straight out again by signInEmail.
// No password is stored in the code or the repo, the repo is public.
// The accounts must be created in the Firebase console first
// (Authentication, Email/Password provider on, Add user, then a users
// document with role "Full access"). Until then, sign-in fails with
// a plain wrong-email-or-password error.
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth";

export default function OfficeLoginPage() {
  const { user, loading, signInEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.push("/admin");
  }, [loading, user, router]);

  if (loading) return <p>Loading...</p>;
  if (user) {
    return <p>Signed in. Opening the dashboard...</p>;
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-navy">Office login</h1>
      <p className="text-gray-600 mt-1">Office team only. Sign in with your office email and password.</p>

      {error ? <p className="bg-red-50 text-red-800 text-sm rounded p-3 mt-4">{error}</p> : null}

      <form
        className="grid gap-3 mt-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (busy) return;
          setBusy(true);
          setError("");
          const err = await signInEmail(email, password);
          setBusy(false);
          if (err) setError(err);
        }}
      >
        <label className="text-sm font-semibold">Office email
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ceo@anngan.com"
            required
            className="border border-gray-300 rounded px-3 py-2 w-full min-w-0 mt-1 font-normal"
          />
        </label>
        <label className="text-sm font-semibold">Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your office password"
            required
            className="border border-gray-300 rounded px-3 py-2 w-full min-w-0 mt-1 font-normal"
          />
        </label>
        <button type="submit" disabled={busy} className="bg-anngan text-white px-3 py-2.5 rounded min-h-[48px] inline-flex items-center text-sm w-fit disabled:opacity-50">
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
