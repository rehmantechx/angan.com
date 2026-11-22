"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/auth";

// Public sign-in, for people who want to list a property. This is NOT
// the office login: it never says "Office team only", and it never sends
// a public seller to /admin/login. A signed-in seller creates a listing
// as pending, the office approves it, and nothing goes live without
// that approval. Office staff use /admin/login instead.
function SignInInner() {
  const { user, loading, signInGoogle } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const back = params.get("return") || "/create-listing";

  useEffect(() => {
    if (!loading && user) router.push(back);
  }, [loading, user, router, back]);

  if (loading) return <p>Loading...</p>;
  if (user) return <p>Signed in. Taking you back to list your property...</p>;

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-navy">Sign in to list a property</h1>
      <p className="text-gray-600 mt-2">
        Sign in with Google to send a property to the Anngan office. Your
        listing is saved as pending, the office checks it, and nothing goes
        live without office approval.
      </p>
      <p className="text-gray-600 mt-2 text-sm">
        Office staff, use the office login instead:{" "}
        <Link href="/admin/login" className="text-anngan-dark font-semibold underline">Office login</Link>
      </p>
      {error ? <p role="alert" className="bg-red-50 text-red-800 text-sm rounded p-3 mt-4">{error}</p> : null}
      <div className="grid gap-3 mt-4">
        <button
          disabled={busy}
          className="bg-navy text-white px-4 py-2.5 rounded min-h-[48px] inline-flex items-center justify-center disabled:opacity-50"
          onClick={async () => {
            setBusy(true);
            setError("");
            const err = await signInGoogle();
            setBusy(false);
            if (err) setError(err);
          }}
        >
          {busy ? "Signing in..." : "Continue with Google"}
        </button>
        <Link href="/properties" className="text-anngan-dark font-semibold text-sm text-center">Browse properties without signing in</Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SignInInner />
    </Suspense>
  );
}
