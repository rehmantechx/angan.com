"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../lib/auth";

export default function LoginPage() {
  const { user, loading, firebaseOn, signInGoogle, signInDemo } = useAuth();
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
      <p className="text-gray-600 mt-1">Office team only. Sign in with Google.</p>

      {!firebaseOn ? (
        <div className="bg-amber-100 text-amber-900 text-sm rounded p-3 mt-4">
          Firebase is not connected yet. Real Google sign-in needs the Firebase
          project first (see README). For local testing you can use the demo
          office login below. Demo login is not a real account and never
          touches Firebase.
        </div>
      ) : (
        <div className="bg-green-50 text-green-900 text-sm rounded p-3 mt-4">
          Firebase is connected. Sign in with your office Google account. Your
          role (Full access, Staff or View only) is read from the users
          collection in Firestore.
        </div>
      )}

      {error ? <p className="bg-red-50 text-red-800 text-sm rounded p-3 mt-4">{error}</p> : null}

      <div className="grid gap-3 mt-4">
        <button
          disabled={busy || !firebaseOn}
          className="bg-navy text-white px-4 py-2 rounded disabled:opacity-50"
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
        {!firebaseOn ? (
          <button
            className="border border-navy text-navy px-4 py-2 rounded"
            onClick={() => {
              signInDemo();
            }}
          >
            Demo office login (local test only)
          </button>
        ) : null}
      </div>
      <p className="text-sm text-gray-600 mt-4">
        New office members: after your first Google sign-in, the owner adds
        your user document in Firestore (collection users, your uid as the
        document id, role Full access, Staff or View only). Until then you can
        only view.
      </p>
    </div>
  );
}
