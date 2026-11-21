"use client";
import { useState } from "react";
import { addEnquiry } from "../lib/db";

export function EnquiryForm({ asked, compact }: { asked: string; compact?: boolean }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setBusy(true);
    setError("");
    try {
      await addEnquiry({
        name: name.trim(),
        phone: phone.trim(),
        asked,
        how: "Website form",
        next: note.trim() || "Call back",
      });
      setDone(true);
    } catch (err) {
      const e2 = err as { message?: string };
      setError("Could not send the enquiry: " + (e2.message || "please try again or call the office."));
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="border border-green-300 bg-green-50 rounded p-4 text-sm">
        Thank you, {name}. Your enquiry is saved and the office will call you back.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <h3 className="font-bold">Ask about this property</h3>
      <p className="text-sm text-gray-600 mt-1">Asking about: {asked}</p>
      <div className={compact ? "grid gap-2 mt-3" : "grid gap-2 mt-3 sm:grid-cols-2"}>
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="border border-gray-300 rounded px-3 py-2 w-full" />
        <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone number" className="border border-gray-300 rounded px-3 py-2 w-full" />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything else (optional)" className="border border-gray-300 rounded px-3 py-2 w-full sm:col-span-2" />
      </div>
      <button disabled={busy} className="bg-anngan text-white px-4 py-2 rounded mt-3">
        {busy ? "Sending..." : "Send enquiry"}
      </button>
      {error ? <p className="bg-red-50 text-red-800 text-sm rounded p-3 mt-3">{error}</p> : null}
    </form>
  );
}
