"use client";
import { useState } from "react";
import { useAuth } from "../../lib/auth";
import { saveListing } from "../../lib/db";
import Link from "next/link";

const inputCls = "border border-gray-300 rounded px-3 py-2 w-full";

export default function CreateListingPage() {
  const { user, loading } = useAuth();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [beds, setBeds] = useState("3");
  const [baths, setBaths] = useState("3");
  const [size, setSize] = useState("5 Marla");
  const [city, setCity] = useState("Lahore");
  const [loc, setLoc] = useState("");
  const [type, setType] = useState("House");
  const [status, setStatus] = useState("sale");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-navy">List a property</h1>
        <p className="mt-2">You need an account to list a property. Sign in first, then your listing goes to the office for approval.</p>
        <p className="mt-2 text-sm text-gray-600">Nothing goes live without office approval.</p>
        <Link href="/admin/login" className="inline-block bg-anngan text-white px-4 py-2 rounded mt-4">Sign in</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-navy">Sent to the office</h1>
        <p className="mt-2">Your listing is saved as pending. The office will check it and approve it before it shows on the public site.</p>
        <Link href="/properties" className="inline-block bg-navy text-white px-4 py-2 rounded mt-4">See public properties</Link>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const n = parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
    const id = "user-" + Date.now().toString(36);
    await saveListing({
      id,
      title: title.trim(),
      price: n > 0 ? "Rs " + n.toLocaleString("en-PK") + (status === "rent" ? " per month" : "") : "Price on call",
      n,
      beds: parseInt(beds, 10),
      baths: parseInt(baths, 10),
      size,
      city,
      loc: loc.trim() || city,
      type,
      status: status as "sale" | "rent",
      img: "",
      badge: "Pending approval",
      url: "",
      liveStatus: "pending",
      visible: true,
      createdAt: new Date().toISOString().slice(0, 10),
      submittedBy: user ? user.email : "",
    });
    setBusy(false);
    setDone(true);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">List a property</h1>
      <p className="text-gray-600 mt-1">
        Signed in as {user.email}. Your listing goes to the office for approval and does not go live until approved.
      </p>
      <form onSubmit={submit} className="grid gap-3 mt-4 max-w-xl">
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title, for example 5 Marla house for sale in DHA Lahore" className={inputCls} />
        <input required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price in Rs, numbers only" inputMode="numeric" className={inputCls} />
        <div className="grid grid-cols-2 gap-3">
          <select value={beds} onChange={(e) => setBeds(e.target.value)} className={inputCls}>
            {[1, 2, 3, 4, 5, 6].map((b) => <option key={b} value={b}>{b} beds</option>)}
          </select>
          <select value={baths} onChange={(e) => setBaths(e.target.value)} className={inputCls}>
            {[1, 2, 3, 4, 5, 6, 7].map((b) => <option key={b} value={b}>{b} baths</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select value={size} onChange={(e) => setSize(e.target.value)} className={inputCls}>
            {["4 Marla", "5 Marla", "6 Marla", "10 Marla", "1 Kanal"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
            {["House", "Flat", "Portion", "Plot", "Shop"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select value={city} onChange={(e) => setCity(e.target.value)} className={inputCls}>
            {["Lahore", "Karachi", "Rawalpindi", "Multan", "Islamabad"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
            <option value="sale">For sale</option>
            <option value="rent">For rent</option>
          </select>
        </div>
        <input required value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Area or society, for example DHA Phase 7" className={inputCls} />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone number" className={inputCls} />
        <p className="text-sm text-gray-600">Photos are added by the office after approval. Do not upload photos here yet.</p>
        <button disabled={busy} className="bg-anngan text-white px-4 py-2 rounded w-fit">
          {busy ? "Sending..." : "Send to office for approval"}
        </button>
      </form>
    </div>
  );
}
