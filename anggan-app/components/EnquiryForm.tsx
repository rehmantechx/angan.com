"use client";
import { useState } from "react";
import { addEnquiry } from "../lib/db";

// Pakistani phone: digits only after stripping spaces, hyphens and a
// leading +. Must be a real mobile (03xx) or the office format, 10 to
// 13 digits. Letters are rejected, never silently accepted.
export function isValidPakPhone(raw: string): boolean {
  if (/[a-zA-Z]/.test(raw)) return false;
  const d = raw.replace(/[^0-9]/g, "");
  if (d.length < 10 || d.length > 13) return false;
  if (d.startsWith("92")) return d.length === 12 && d[2] === "3";
  if (d.startsWith("0")) return d.length === 11 && d[1] === "3";
  return d.length === 10 && d.startsWith("3");
}

export function EnquiryForm({ asked, compact, heading }: { asked: string; compact?: boolean; heading?: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    const p = phone.trim();
    let ok = true;
    if (n.length < 2) { setNameErr("Please write your name."); ok = false; } else setNameErr("");
    if (!isValidPakPhone(p)) { setPhoneErr("Please write a valid Pakistani mobile number, for example 0304 1111698."); ok = false; } else setPhoneErr("");
    if (!ok) { setError("Please fix the highlighted fields, then send again."); return; }
    setError("");
    setBusy(true);
    try {
      await addEnquiry({ name: n, phone: p, asked, how: "Website form", next: note.trim() || "Call back" });
      setDone(true);
    } catch (err) {
      const e2 = err as { message?: string };
      setError("Could not send the enquiry: " + (e2.message || "please try again or call the office on +92 304 1111 698."));
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="border border-green-300 bg-green-50 rounded p-4 text-sm" role="status">
        Thank you, {name.trim()}. Your enquiry is saved and the office will call you back.
      </div>
    );
  }

  const isGeneral = asked === "General enquiry";
  return (
    <form onSubmit={submit} noValidate className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <h3 className="font-bold">{heading || (isGeneral ? "Send an enquiry" : "Ask about this property")}</h3>
      <p className="text-sm text-gray-600 mt-1">{isGeneral ? "General enquiry" : `Asking about: ${asked}`}</p>
      <div className={compact ? "grid gap-2 mt-3" : "grid gap-2 mt-3 sm:grid-cols-2"}>
        <div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" aria-label="Your name" aria-invalid={!!nameErr} aria-describedby={nameErr ? "name-error" : undefined} className="border border-gray-300 rounded px-3 py-2 w-full min-h-[48px]" />
          {nameErr ? <p id="name-error" role="alert" className="text-red-700 text-sm mt-1">{nameErr}</p> : null}
        </div>
        <div>
          <input type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (e.g. 0304 1111698)" aria-label="Your phone number" aria-invalid={!!phoneErr} aria-describedby={phoneErr ? "phone-error" : undefined} className="border border-gray-300 rounded px-3 py-2 w-full min-h-[48px]" />
          {phoneErr ? <p id="phone-error" role="alert" className="text-red-700 text-sm mt-1">{phoneErr}</p> : null}
        </div>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything else (optional)" aria-label="Anything else, optional" className="border border-gray-300 rounded px-3 py-2 w-full sm:col-span-2 min-h-[48px]" />
      </div>
      <button disabled={busy} className="btn btn-red mt-3">
        {busy ? "Sending..." : "Send enquiry"}
      </button>
      {error ? <p role="alert" className="bg-red-50 text-red-800 text-sm rounded p-3 mt-3">{error}</p> : null}
    </form>
  );
}
