// Create a listing: plain and simple, for a dealer, not a developer.
// Three steps only: 1) add at least 3 photos, 2) write the details,
// 3) send it to the office for approval. Nothing goes live until the
// office approves it. Photos are upload only (free Cloudinary upload,
// already wired in lib/upload.ts). There is NO photo-link field here:
// the user asked for upload only, at least 3 photos, on 26 Nov 2026.
"use client";
import { useRef, useState } from "react";
import { useAuth } from "../../lib/auth";
import { DEMO_EMAIL } from "../../lib/auth-context";
import { saveListing } from "../../lib/db";
import { isValidPakPhone } from "../../components/EnquiryForm";
import { GoogleButton } from "../../components/GoogleButton";
import { uploadImage } from "../../lib/upload";
import Link from "next/link";

function ListSteps() {
  const steps = [
    { n: "1", t: "Photos", d: "Add at least 3 photos" },
    { n: "2", t: "Details", d: "Title, price, city" },
    { n: "3", t: "Approval", d: "Office checks it, then it goes live" },
  ];
  return (
    <ol className="grid gap-2 sm:grid-cols-3 mt-4">
      {steps.map((s) => (
        <li key={s.n} className="border border-gray-200 rounded-lg p-3 bg-white flex gap-3 items-start">
          <span className="bg-navy text-white font-bold rounded-full w-8 h-8 shrink-0 flex items-center justify-center">{s.n}</span>
          <span>
            <span className="block font-bold text-navy">{s.t}</span>
            <span className="block text-sm text-gray-600">{s.d}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

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
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(0);
  const [photoErr, setPhotoErr] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [error, setError] = useState("");
  const [priceErr, setPriceErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function onPick(files: FileList | null) {
    if (!files || files.length === 0) return;
    setPhotoErr("");
    const list = Array.from(files);
    setUploading((n) => n + list.length);
    let added = 0;
    for (const file of list) {
      try {
        const url = await uploadImage(file, "listings");
        setPhotos((prev) => [...prev, url]);
        added++;
      } catch (e) {
        const err = e as { message?: string };
        setPhotoErr(err.message || "That photo did not upload. Try again.");
      } finally {
        setUploading((n) => Math.max(0, n - 1));
      }
    }
    // The "fix the highlighted fields" message from a blocked send
    // must go away the moment the photo rule is met, not only on the
    // next submit, or the dealer sees an error next to a fixed form.
    if (photos.length + added >= 3) setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-navy">List a property</h1>
        <p className="mt-2">You need an account to list a property. Sign in first, then your listing goes to the office for approval.</p>
        <p className="mt-2 text-sm text-gray-600">Nothing goes live without office approval.</p>
        <ListSteps />
        <div className="mt-4">
          <GoogleButton label="Sign in with Google" href="/signin?return=/create-listing" />
        </div>
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
    let ok = true;
    const n = parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
    if (!/^[0-9][0-9, ]*$/.test(price.trim()) || n <= 0) { setPriceErr("Please write a price in Rs, numbers only, above zero."); ok = false; } else setPriceErr("");
    if (phone.trim() && !isValidPakPhone(phone.trim())) { setPhoneErr("Please write a valid Pakistani mobile number, for example 0304 1111698."); ok = false; } else setPhoneErr("");
    // PHOTOS 26 Nov 2026 (user order): at least 3 photos, upload
    // only. Fewer than 3 blocks the send with a plain message.
    if (photos.length < 3) { setPhotoErr(`Add at least 3 photos. You have ${photos.length} now.`); ok = false; } else setPhotoErr("");
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
        img: photos[0],
        photos,
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
      <ListSteps />
      {user.demo || user.email === DEMO_EMAIL ? (
        <p className="bg-amber-100 text-amber-900 text-sm rounded p-3 mt-3">Demo, view only. You can see the form, but you cannot send a listing. Sign in with an authorized office account to send one.</p>
      ) : null}
      <p className="text-gray-600 mt-1 break-words">
        Signed in as {user.email}. Your listing goes to the office for approval and does not go live until approved.
      </p>
      <form onSubmit={submit} noValidate className="grid gap-3 mt-4 w-full max-w-xl min-w-0">
        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <p className="text-sm font-semibold">Photos, at least 3 <span className="text-gray-600 font-normal">({photos.length} of 3 added{photos.length >= 3 ? ", done" : ""})</span></p>
          {photos.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {photos.map((src, i) => (
                <figure key={src + i} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={"Photo " + (i + 1)} className="w-full aspect-square object-cover rounded-lg bg-gray-100 border border-gray-200" />
                  <button type="button" onClick={() => setPhotos(photos.filter((_, j) => j !== i))} aria-label={"Remove photo " + (i + 1)} className="absolute top-1 right-1 bg-white text-navy text-xs font-bold px-2 py-1 rounded shadow min-h-[32px]">Remove</button>
                </figure>
              ))}
            </div>
          ) : null}
          <div className="flex gap-2 items-center flex-wrap mt-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={busy || user.demo || user.email === DEMO_EMAIL}
              aria-label="Choose photos to upload"
              className="text-sm"
              onChange={(e) => onPick(e.target.files)}
            />
            <span className="text-sm text-gray-600">{uploading > 0 ? `Uploading ${uploading} photo${uploading > 1 ? "s" : ""}...` : "Choose photos from your phone or computer."}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">JPG, PNG or WebP, up to 5 MB each. The first photo is the main photo buyers see first.</p>
          {photoErr ? <p role="alert" className="text-red-700 text-sm font-semibold mt-2">{photoErr}</p> : null}
        </div>
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
        <button disabled={busy || user.demo || user.email === DEMO_EMAIL} className="bg-anngan text-white px-4 py-2.5 rounded min-h-[48px] inline-flex items-center w-fit disabled:opacity-50">
          {busy ? "Sending..." : "Send to office for approval"}
        </button>
        {error ? <p className="bg-red-50 text-red-800 text-sm rounded p-3">{error}</p> : null}
      </form>
    </div>
  );
}
