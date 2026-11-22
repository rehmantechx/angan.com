"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../lib/auth";

export default function LoginPage() {
  const { user, loading, signInGoogle, signInEmail, signInDemo } = useAuth();
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
      setEmailError("Please write a valid email address.");
      ok = false;
    } else {
      setEmailError("");
    }
    if (password.length < 6) {
      setPasswordError("Please write your password, at least 6 characters.");
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
          className="bg-navy text-white px-4 py-2.5 rounded min-h-[48px] inline-flex items-center disabled:opacity-50"
          onClick={async () => {
            setBusy(true);
            setError("");
            const err = await signInGoogle();
            setBusy(false);
            if (err) setError(err);
          }}
        >
          Continue with Google
        </button>
      </div>

      <form onSubmit={submitEmail} className="grid gap-3 mt-6 border-t pt-4">
        <label className="text-sm font-semibold text-navy">
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="demo@anngan.com"
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
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="border border-gray-300 rounded px-3 py-2 w-full mt-1 min-h-[48px] font-normal"
          />
        </label>
        {passwordError ? <p className="text-red-700 text-sm">{passwordError}</p> : null}
        <button disabled={busy} className="bg-anngan text-white px-4 py-2.5 rounded min-h-[48px] inline-flex items-center justify-center disabled:opacity-50">
          Sign in with email
        </button>
        <p className="text-sm text-gray-600 text-center">Testing demo account: demo@anngan.com. It is view only, and it will be removed when testing is done.</p>
      </form>

      <div className="grid gap-3 mt-6 border-t pt-4">
        <button
          type="button"
          className="bg-white border-2 border-navy text-navy font-semibold px-4 py-2.5 rounded min-h-[48px] inline-flex items-center justify-center"
          onClick={() => {
            signInDemo();
            router.push("/admin");
          }}
        >
          Try demo dashboard
        </button>
        <p className="text-sm text-gray-600 text-center">No sign-in, no password. View only, for testing. Nothing is saved.</p>
      </div>
    </div>
  );
}
