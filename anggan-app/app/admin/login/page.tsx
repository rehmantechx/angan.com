"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../lib/auth";

export default function LoginPage() {
  const { user, loading, signInGoogle, signInEmail } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    const em = email.trim();
    let ok = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setEmailError("Please enter a valid email address.");
      ok = false;
    } else {
      setEmailError("");
    }
    if (password.length < 6) {
      setPasswordError("Please enter your password, at least 6 characters.");
      ok = false;
    } else {
      setPasswordError("");
    }
    if (!ok) return;
    setBusy(true);
    setError("");
    const err = await signInEmail(em, password);
    setBusy(false);
    if (err) setError(err);
  }

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
      <p className="text-gray-600 mt-1">Office team only. Sign in with Google, or with your office email and password.</p>

      {error ? <p className="bg-red-50 text-red-800 text-sm rounded p-3 mt-4">{error}</p> : null}

      <div className="grid gap-3 mt-4">
        <button
          disabled={busy}
          className="bg-navy text-white px-4 py-2.5 rounded min-h-[48px] inline-flex items-center justify-center gap-2 disabled:opacity-50"
          onClick={async () => {
            setBusy(true);
            setError("");
            const err = await signInGoogle();
            setBusy(false);
            if (err) setError(err);
          }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="shrink-0"><path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.3h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.2 3.7-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.8-5.1L1.3 17.2C3.3 21.2 7.3 24 12 24z"/><path fill="#FBBC05" d="M5.2 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.3 6.8C.5 8.4 0 10.1 0 12s.5 3.6 1.3 5.2l3.9-2.9z"/><path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.3 0 3.3 2.8 1.3 6.8l3.9 2.9c.9-2.9 3.6-5 6.8-5z"/></svg>
          Continue with Google
        </button>
      </div>

      <form onSubmit={submitEmail} noValidate className="grid gap-3 mt-6 border-t pt-4">
        <label className="text-sm font-semibold text-navy">
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value.trim())) setEmailError("");
            }}
            placeholder="Your office email"
            className="border border-gray-300 rounded px-3 py-2 w-full mt-1 min-h-[48px] font-normal"
          />
        </label>
        {emailError ? <p className="text-red-700 text-sm">{emailError}</p> : null}
        <label className="text-sm font-semibold text-navy">
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (e.target.value.length >= 6) setPasswordError("");
            }}
            placeholder="Your password"
            className="border border-gray-300 rounded px-3 py-2 w-full mt-1 min-h-[48px] font-normal"
          />
        </label>
        {passwordError ? <p className="text-red-700 text-sm">{passwordError}</p> : null}
        <button disabled={busy} className="bg-anngan text-white px-4 py-2.5 rounded min-h-[48px] inline-flex items-center justify-center disabled:opacity-50">
          Sign in with email
        </button>
      </form>
    </div>
  );
}
