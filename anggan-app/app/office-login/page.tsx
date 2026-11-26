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
// Premium two-panel login (26 Nov 2026): dark-navy brand panel
// with the full logo and tagline on desktop, clean sign-in card
// on the right, compact brand header on mobile. Show/hide password,
// custom inline validation errors only, never native HTML5 browser
// tooltips (the form is noValidate), and a Back to anngan.com link.
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth";

export default function OfficeLoginPage() {
  const { user, loading, signInEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.push("/admin");
  }, [loading, user, router]);

  // While auth resolves, show the same branded screen as the form,
  // never a bare "Loading..." on white.
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="text-center">
          <Image src="/img/logo.png" alt="Anngan logo" width={1200} height={231} priority className="h-12 w-auto mx-auto" />
          <div className="mx-auto mt-6 h-8 w-8 rounded-full border-4 border-slate-200 border-t-[#0a2540] animate-spin" aria-hidden="true" />
          <p className="text-sm text-gray-600 mt-4">Opening the office login...</p>
        </div>
      </div>
    );
  }
  if (user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="text-center">
          <Image src="/img/logo.png" alt="Anngan logo" width={1200} height={231} priority className="h-12 w-auto mx-auto" />
          <div className="mx-auto mt-6 h-8 w-8 rounded-full border-4 border-slate-200 border-t-[#0a2540] animate-spin" aria-hidden="true" />
          <p className="text-sm text-gray-600 mt-4">Signed in. Opening the dashboard...</p>
        </div>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    let ok = true;
    const emailTrim = email.trim();
    if (!emailTrim) {
      setEmailErr("Enter your office email.");
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      setEmailErr("That email does not look right. Check it and try again.");
      ok = false;
    } else {
      setEmailErr("");
    }
    if (!password) {
      setPasswordErr("Enter your password.");
      ok = false;
    } else if (password.length < 6) {
      setPasswordErr("The password is at least 6 characters.");
      ok = false;
    } else {
      setPasswordErr("");
    }
    if (!ok) return;
    setBusy(true);
    setError("");
    const err = await signInEmail(emailTrim, password);
    setBusy(false);
    if (err) setError(err);
  }

  // PREMIUM LOGIN, 26 Nov 2026 (user order, the plain card was not
  // professional): a branded two-panel layout on desktop, a dark-navy
  // brand panel on the left with the full logo, tagline and office
  // details, and the sign-in card on the right. On mobile the brand
  // shows as a compact header above the card. Still hidden, still
  // email and password only, still no Continue with Google, still
  // no public link anywhere. Focus rings and error states included.
  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside className="hidden lg:flex lg:w-[400px] xl:w-[440px] shrink-0 bg-[#0a2540] text-white flex-col justify-between p-10" aria-label="About the Anngan office">
        <div>
          <div className="bg-white rounded-2xl px-5 py-4 w-fit shadow-lg">
            <Image src="/img/logo.png" alt="Anngan logo" width={1200} height={231} priority className="h-12 w-auto" />
          </div>
          <h1 className="text-3xl font-bold mt-8 leading-tight">Anngan office</h1>
          <p className="urdu-tagline urdu-tagline-light text-lg mt-3" lang="ur">بنائے خواب حقیقت</p>
          <p className="text-white/80 mt-4 leading-relaxed">The office dashboard for Anngan Technologies Pvt Ltd. Manage listings, projects and the whole website in one place, no developer needed.</p>
        </div>
        <div className="text-sm text-white/70 space-y-1 border-t border-white/15 pt-5">
          <p className="font-semibold text-white">Anngan Technologies Pvt Ltd</p>
          <p>57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore</p>
          <p>Call +92 304 1111 698 · info@anngan.com</p>
          <p className="pt-2 text-white/50">Office team only. CEO and SEO sign in here.</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="lg:hidden w-full max-w-md text-center mb-6">
          <div className="bg-white rounded-2xl px-5 py-4 w-fit mx-auto shadow-md border border-gray-200">
            <Image src="/img/logo.png" alt="Anngan logo" width={1200} height={231} priority className="h-10 w-auto" />
          </div>
          <p className="urdu-tagline text-base mt-3" lang="ur">بنائے خواب حقیقت</p>
        </div>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-navy">Office login</h2>
          <p className="text-gray-600 text-sm mt-1">Office team only. Sign in with your office email and password.</p>

          {error ? (
            <p role="alert" className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg p-3 mt-4">{error}</p>
          ) : null}

          <form className="grid gap-4 mt-5" noValidate onSubmit={submit}>
            <div>
              <label htmlFor="office-email" className="text-sm font-semibold">Office email</label>
              <input
                id="office-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (emailErr) setEmailErr(""); }}
                placeholder="ceo@anngan.com"
                aria-invalid={!!emailErr}
                aria-describedby={emailErr ? "office-email-error" : undefined}
                className="border border-gray-300 rounded-lg px-3 py-2.5 w-full min-w-0 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2540]/30 focus:border-[#0a2540]"
              />
              {emailErr ? <span id="office-email-error" role="alert" className="text-red-700 text-sm block mt-1">{emailErr}</span> : null}
            </div>
            <div>
              <label htmlFor="office-password" className="text-sm font-semibold">Password</label>
              <div className="relative mt-1">
                <input
                  id="office-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (passwordErr) setPasswordErr(""); }}
                  placeholder="Your office password"
                  aria-invalid={!!passwordErr}
                  aria-describedby={passwordErr ? "office-password-error" : undefined}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 pr-12 w-full min-w-0 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2540]/30 focus:border-[#0a2540]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-2 min-h-[40px] min-w-[44px] inline-flex items-center justify-center text-navy font-semibold text-sm rounded-lg hover:bg-slate-100"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {passwordErr ? <span id="office-password-error" role="alert" className="text-red-700 text-sm block mt-1">{passwordErr}</span> : null}
            </div>
            <button type="submit" disabled={busy} className="bg-anngan hover:bg-[#c22d2d] text-white px-3 py-3 rounded-lg min-h-[48px] inline-flex items-center justify-center text-sm font-semibold w-full disabled:opacity-50 shadow-sm">
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="text-center text-sm mt-5">
            <Link href="/" className="text-navy font-semibold underline underline-offset-2">Back to anngan.com</Link>
          </p>
        </div>
        <p className="text-center text-xs text-gray-500 mt-5">Anngan Technologies Pvt Ltd · Paragon City, Lahore</p>
      </div>
    </div>
  );
}
