"use client";
import { useRef, useState } from "react";
import { useAuth } from "../../lib/auth";
import { DEMO_EMAIL } from "../../lib/auth-context";
import { saveListing } from "../../lib/db";
import { isValidPakPhone } from "../../components/EnquiryForm";
import Link from "next/link";

const inputCls = "border border-gray-300 rounded px-3 py-2 w-full min-w-0";

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
  const [photo, setPhoto] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [error, setError] = useState("");
  // FIX-06: per-field errors, so an invalid price or phone is named
  // next to its own field instead of only in one banner at the bottom.
  const [priceErr, setPriceErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-navy">List a property</h1>
        <p className="mt-2">You need an account to list a property. Sign in first, then your listing goes to the office for approval.</p>
        <p className="mt-2 text-sm text-gray-600">Nothing goes live without office approval.</p>
        <Link href="/signin?return=/create-listing" className="inline-block bg-anngan text-white px-4 py-2.5 rounded min-h-[48px] inline-flex items-center mt-4">Sign in with Google</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-navy">Sent to the office</h1>
        <p className="mt-2">Your listing is saved as pending. The office will check it and approve it before it shows on the public site.</p>
        <Link href="/properties" className="inline-block bg-navy text-white px-4 py-2.5 rounded min-h-[48px] inline-flex items-center mt-4">See public properties</Link>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busyRef.current) return;
    if (user?.demo || user?.email === DEMO_EMAIL) { setError("Demo, view only. Sign in with an authorized office account to send a listing."); return; }
    if (!title.trim() || !loc.trim()) { setError("Please write a title and an area or society for the property."); return; }
    // FIX-06: price must be a number above zero, Rs prefix shown next
    // to the field. Letters or an empty price no longer slip through
    // as "Price on call". Phone is optional, but when filled it must
    // pass the same Pakistani mobile check as /contact.
    let ok = true;
    const n = parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
    if (!/^[0-9][0-9, ]*$/.test(price.trim()) || n <= 0) { setPriceErr("Please write a price in Rs, numbers only, above zero."); ok = false; } else setPriceErr("");
    if (phone.trim() && !isValidPakPhone(phone.trim())) { setPhoneErr("Please write a valid Pakistani mobile number, for example 0304 1111698."); ok = false; } else setPhoneErr("");
    if (!ok) { setError("Please fix the highlighted fields, then send again."); return; }
    busyRef.current = true;
    setBusy(true);
    setError("");
    const id = "user-" + Date.now().toString(36);
    try {
      await saveListing({
        id,
        title: title.trim(),
        price: "Rs " + n.toLocaleString("en-PK") + (status === "rent" ? " per month" : ""),
        n,
        beds: parseInt(beds, 10),
        baths: parseInt(baths, 10),
        size,
        city,
        loc: loc.trim() || city,
        type,
        status: status as "sale" | "rent",
        img: photo.trim(),
        badge: "Pending approval",
        url: "",
        liveStatus: "pending",
        visible: true,
        createdAt: new Date().toISOString().slice(0, 10),
        submittedBy: user ? user.email : "",
      });
      setDone(true);
    } catch (err) {
      const e2 = err as { message?: string };
      setError("Could not send the listing: " + (e2.message || "please try again or call the office."));
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-full min-w-0">
      <h1 className="text-3xl font-bold text-navy">List a property</h1>
      {user.demo || user.email === DEMO_EMAIL ? (
        <p className="bg-amber-100 text-amber-900 text-sm rounded p-3 mt-3">Demo, view only. You can see the form, but you cannot send a listing. Sign in with an authorized office account to send one.</p>
      ) : null}
      <p className="text-gray-600 mt-1 break-words">
        Signed in as {user.email}. Your listing goes to the office for approval and does not go live until approved.
      </p>
      {/* FIX-05: every field has a persistent visible label above it,
          so once a user types, the field is still named. Placeholders
          are hints only, never the only label. */}
      <form onSubmit={submit} noValidate className="grid gap-3 mt-4 w-full max-w-xl min-w-0">
        <label className="text-sm font-semibold">Title
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title, for example 5 Marla house for sale in DHA Lahore" aria-label="Title" className={inputCls + " mt-1 font-normal"} />
        </label>
        <label className="text-sm font-semibold">Price (Rs)
          <span className="flex items-center gap-1 mt-1">
            <span aria-hidden="true" className="text-sm text-gray-600 shrink-0">Rs</span>
            <input required value={price} onChange={(e) => { setPrice(e.target.value); if (priceErr) setPriceErr(""); }} placeholder="Price in Rs, numbers only" inputMode="numeric" aria-label="Price in Rs" aria-invalid={!!priceErr} aria-describedby={priceErr ? "price-error" : undefined} className={inputCls + " font-normal"} />
          </span>
          {priceErr ? <span id="price-error" role="alert" className="text-red-700 text-sm font-normal block mt-1">{priceErr}</span> : null}
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-semibold">Beds
            <select value={beds} onChange={(e) => setBeds(e.target.value)} aria-label="Beds" className={inputCls + " mt-1 font-normal"}>
              {[1, 2, 3, 4, 5, 6].map((b) => <option key={b} value={b}>{b} beds</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">Baths
            <select value={baths} onChange={(e) => setBaths(e.target.value)} aria-label="Baths" className={inputCls + " mt-1 font-normal"}>
              {[1, 2, 3, 4, 5, 6, 7].map((b) => <option key={b} value={b}>{b} baths</option>)}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-semibold">Size
            <select value={size} onChange={(e) => setSize(e.target.value)} aria-label="Size" className={inputCls + " mt-1 font-normal"}>
              {["4 Marla", "5 Marla", "6 Marla", "10 Marla", "1 Kanal"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">Type
            <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Type" className={inputCls + " mt-1 font-normal"}>
              {["House", "Flat", "Portion", "Plot", "Shop"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-semibold">City
            <select value={city} onChange={(e) => setCity(e.target.value)} aria-label="City" className={inputCls + " mt-1 font-normal"}>
              {["Lahore", "Karachi", "Rawalpindi", "Multan", "Islamabad"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">Status
            <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status" className={inputCls + " mt-1 font-normal"}>
              <option value="sale">For sale</option>
              <option value="rent">For rent</option>
            </select>
          </label>
        </div>
        <label className="text-sm font-semibold">Area or society
          <input required value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Area or society, for example DHA Phase 7" aria-label="Area or society" className={inputCls + " mt-1 font-normal"} />
        </label>
        <label className="text-sm font-semibold">Your phone number, optional
          <input type="tel" inputMode="tel" value={phone} onChange={(e) => { setPhone(e.target.value); if (phoneErr) setPhoneErr(""); }} placeholder="Your phone number, for example 0304 1111698" aria-label="Your phone number" aria-invalid={!!phoneErr} aria-describedby={phoneErr ? "phone-error" : undefined} className={inputCls + " mt-1 font-normal"} />
          {phoneErr ? <span id="phone-error" role="alert" className="text-red-700 text-sm font-normal block mt-1">{phoneErr}</span> : null}
        </label>
        <label className="text-sm font-semibold">Photo link, optional
          <input value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="Photo link, optional, for example https://example.com/photo.jpg" aria-label="Photo link, optional" className={inputCls + " mt-1 font-normal"} />
        </label>
        <p className="text-sm text-gray-600">Photo is optional. You can paste a photo link, or leave it empty and the office adds a real photo after approval.</p>
        <button disabled={busy || user.demo || user.email === DEMO_EMAIL} className="bg-anngan text-white px-4 py-2.5 rounded min-h-[48px] inline-flex items-center w-fit disabled:opacity-50">
          {busy ? "Sending..." : "Send to office for approval"}
        </button>
        {error ? <p className="bg-red-50 text-red-800 text-sm rounded p-3">{error}</p> : null}
      </form>
    </div>
  );
}
