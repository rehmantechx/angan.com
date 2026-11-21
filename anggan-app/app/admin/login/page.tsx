"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../lib/auth";

export default function LoginPage() {
  const { user, loading, signInGoogle } = useAuth();
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

      {error ? <p className="bg-red-50 text-red-800 text-sm rounded p-3 mt-4">{error}</p> : null}

      <div className="grid gap-3 mt-4">
        <button
          disabled={busy}
          className="bg-navy text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={async () => {
            setBusy(true);
            setError("");
            const err = await signInGoogle();
            setBusy(false);
            if (err) setError("Sign-in is not available right now. Please call the office.");
          }}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
