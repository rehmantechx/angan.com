"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth";
import { DEMO_EMAIL } from "../../lib/auth-context";
import {
  getListings,
  getProjects,
  getBlogs,
  getAgencies,
  getServices,
  getEnquiries,
  getSettings,
  saveListing,
  deleteListing,
  addEnquiry,
  updateEnquiryStage,
  saveSettings,
  seedFirestore,
  firebaseOn,
  setDemoMode,
} from "../../lib/db";
import { Listing, Project, Blog, Agency, Service, Enquiry, OfficeSettings } from "../../lib/seed";

type Tab = "Overview" | "Listings" | "Enquiries" | "Projects" | "Blogs" | "Agencies" | "Services" | "Settings";

const inputCls = "border border-gray-300 rounded px-3 py-2 w-full";
const btnRed = "bg-anngan text-white px-3 py-2.5 rounded min-h-[48px] inline-flex items-center text-sm";
const btnNavy = "bg-navy text-white px-3 py-2.5 rounded min-h-[48px] inline-flex items-center text-sm";
const btnLine = "border border-navy text-navy px-3 py-2.5 rounded min-h-[48px] inline-flex items-center text-sm";

const STAGES: Enquiry["stage"][] = ["New", "Called", "Visit", "Deal Done"];

export default function AdminPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Overview");
  const [listings, setListings] = useState<Listing[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [settings, setSettings] = useState<OfficeSettings | null>(null);
  const [msg, setMsg] = useState("");
  const [edit, setEdit] = useState<Listing | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  async function reload() {
    setListings(await getListings());
    setProjects(await getProjects());
    setBlogs(await getBlogs());
    setAgencies(await getAgencies());
    setServices(await getServices());
    setEnquiries(await getEnquiries());
    setSettings(await getSettings());
  }

  useEffect(() => {
    if (!loading && !user) router.push("/admin/login");
  }, [loading, user, router]);

  useEffect(() => {
    setDemoMode(user?.demo === true);
    return () => setDemoMode(false);
  }, [user]);

  useEffect(() => {
    if (loading || !user) return;
    reload();
    const h = () => reload();
    window.addEventListener("anngan-data", h);
    return () => window.removeEventListener("anngan-data", h);
  }, [loading, user]);

  if (loading || !user) return <p>Loading...</p>;

  const canEdit = user.role === "Full access" || user.role === "Staff";
  // Temporary demo credential (demo@anngan.com, created in the Firebase
  // console, role View only). Remove it from Firebase when testing is done.
  const isDemo = user.demo === true || user.email === DEMO_EMAIL;
  const live = listings.filter((l) => l.liveStatus === "live" && l.visible !== false);
  const pending = listings.filter((l) => l.liveStatus === "pending");
  const hidden = listings.filter((l) => l.liveStatus === "hidden" || l.visible === false);
  const newEnq = enquiries.filter((e) => e.stage === "New").length;

  async function doSave(l: Listing) {
    if (isDemo) {
      setMsg("Demo mode, view only. Changes are not saved.");
      return;
    }
    try {
      await saveListing(l);
      setEdit(null);
      setShowAdd(false);
      setMsg("Saved. The public site uses the same data, so it updates too.");
    } catch (err) {
      const e = err as { message?: string };
      setMsg("Could not save: " + (e.message || "permission denied") + " The signed-in user needs the Full access or Staff role.");
    }
    await reload();
  }

  async function doDelete(id: string, title: string) {
    if (isDemo) {
      setMsg("Demo mode, view only. Changes are not saved.");
      return;
    }
    if (!window.confirm("Delete this listing: " + title + "?")) return;
    try {
      await deleteListing(id);
      setMsg("Deleted. It is gone from the public site too.");
    } catch (err) {
      const e = err as { message?: string };
      setMsg("Could not delete: " + (e.message || "permission denied") + " The signed-in user needs the Full access or Staff role.");
    }
    await reload();
  }

  return (
    <div>
      <div className="flex items-baseline gap-3 flex-wrap">
        <h1 className="text-3xl font-bold text-navy">Dashboard</h1>
        <span className="text-sm text-gray-600">
          Signed in as {user.name} ({user.email}) : {user.role}
          {isDemo ? " : Demo user, view only" : ""}
        </span>
        <span className="text-xs text-gray-600">Your user id: {user.uid}</span>
      </div>
      {isDemo ? (
        <div className="bg-amber-100 text-amber-900 text-sm rounded p-3 mt-3 flex gap-3 items-center flex-wrap">
          <span className="flex-1 min-w-[220px]">Demo mode, view only. Changes are not saved. Sign in with Google for the real office dashboard.</span>
          <button
            className="bg-navy text-white px-3 py-2 rounded min-h-[48px] inline-flex items-center text-sm"
            onClick={async () => { await signOut(); router.push("/admin/login"); }}
          >
            Exit demo
          </button>
        </div>
      ) : null}
      {user.role === "View only" && !isDemo && firebaseOn() ? (
        <p className="bg-amber-100 text-amber-900 text-sm rounded p-3 mt-3">
          Your role is View only. To change listings, the owner must raise your role in the Firebase console:
          Firestore, collection users, document {user.uid}, field role, set to Full access or Staff.
        </p>
      ) : null}
      {!isDemo && !firebaseOn() ? (
        <p className="bg-amber-100 text-amber-900 text-sm rounded p-3 mt-3">
          Firebase is not connected. Changes are saved in this browser only (local test mode).
          Connect Firebase with .env.local to save online.
        </p>
      ) : null}
      {!isDemo && firebaseOn() ? (
        <p className="bg-green-50 text-green-900 text-sm rounded p-3 mt-3">
          Firebase is connected. Changes save to Firestore and show on the public site.
        </p>
      ) : null}
      {msg ? <p className="bg-green-50 text-green-900 text-sm rounded p-3 mt-3">{msg}</p> : null}

      <div className="flex gap-2 mt-4 flex-wrap">
        {(["Overview", "Listings", "Enquiries", "Projects", "Blogs", "Agencies", "Services", "Settings"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? "bg-navy text-white px-3 py-2.5 rounded min-h-[48px] inline-flex items-center text-sm" : "border border-navy text-navy px-3 py-2.5 rounded min-h-[48px] inline-flex items-center text-sm"}
          >
            {t}
            {t === "Enquiries" && newEnq > 0 ? ` (${newEnq} new)` : ""}
            {t === "Listings" && pending.length > 0 ? ` (${pending.length} pending)` : ""}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border rounded p-4"><p className="text-2xl font-bold">{live.length}</p><p>Live listings on the public site</p></div>
          <div className="border rounded p-4"><p className="text-2xl font-bold">{pending.length}</p><p>Waiting for approval</p></div>
          <div className="border rounded p-4"><p className="text-2xl font-bold">{enquiries.length}</p><p>Enquiries ({newEnq} new)</p></div>
          <div className="border rounded p-4"><p className="text-2xl font-bold">{projects.length}</p><p>Projects | {blogs.length} blogs | {agencies.length} agencies</p></div>
          <div className="border rounded p-4 sm:col-span-2">
            <p className="font-bold">Enquiries by stage</p>
            <p className="text-sm mt-1">{STAGES.map((s) => `${s}: ${enquiries.filter((e) => e.stage === s).length}`).join(" | ")}</p>
          </div>
          <div className="border rounded p-4 sm:col-span-2">
            <p className="font-bold">Listings by city</p>
            <p className="text-sm mt-1">
              {["Lahore", "Rawalpindi", "Multan", "Islamabad", "Karachi"].map((c) => `${c}: ${listings.filter((l) => l.city === c).length}`).join(" | ")}
            </p>
            {firebaseOn() && !isDemo ? (
              <button className={btnNavy + " mt-3"} onClick={async () => { setMsg(await seedFirestore()); await reload(); }}>
                Upload seed data to Firestore
              </button>
            ) : null}
          </div>
        </div>
      )}

      {tab === "Listings" && (
        <div className="mt-4">
          <div className="flex gap-2 flex-wrap items-center">
            {canEdit ? (
              <button className={btnRed} onClick={() => { setEdit(null); setShowAdd(true); }}>Add listing</button>
            ) : (
              <p className="text-sm text-gray-600">Your role is View only. You can see listings but not change them.</p>
            )}
            <Link href="/properties" className={btnLine}>See public site</Link>
          </div>
          {pending.length > 0 ? (
            <div className="mt-4">
              <h2 className="font-bold text-lg">Waiting for approval ({pending.length})</h2>
              <p className="text-sm text-gray-600">These do not show on the public site until approved.</p>
              {pending.map((l) => (
                <div key={l.id} className="border rounded p-3 mt-2 flex gap-2 items-center flex-wrap">
                  <span className="font-semibold flex-1">{l.title} : {l.price} ({l.city})</span>
                  {canEdit ? (
                    <>
                      <button className={btnNavy} onClick={() => doSave({ ...l, liveStatus: "live", badge: "For Sale" })}>Approve and show live</button>
                      <button className={btnLine} onClick={() => doDelete(l.id, l.title)}>Delete</button>
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
          <h2 className="font-bold text-lg mt-6">All listings ({listings.length})</h2>
          <div className="grid gap-3 mt-2">
            {listings.map((l) => (
              <div key={l.id} className="border rounded p-3 flex gap-2 items-center flex-wrap">
                <span className="flex-1 min-w-[200px]">
                  <span className="font-semibold">{l.title}</span>
                  <span className="text-sm text-gray-600 block">{l.price} | {l.city} | {l.size} | {l.status} | {l.liveStatus === "live" && l.visible !== false ? "Live" : l.liveStatus === "pending" ? "Pending" : "Hidden"}</span>
                </span>
                {canEdit ? (
                  <>
                    <button className={btnLine} onClick={() => { setShowAdd(false); setEdit(l); }}>Edit</button>
                    {l.liveStatus === "live" && l.visible !== false ? (
                      <button className={btnLine} onClick={() => doSave({ ...l, liveStatus: "hidden", visible: false })}>Hide</button>
                    ) : l.liveStatus === "hidden" || l.visible === false ? (
                      <button className={btnNavy} onClick={() => doSave({ ...l, liveStatus: "live", visible: true })}>Show live</button>
                    ) : null}
                    <button className={btnLine} onClick={() => doDelete(l.id, l.title)}>Delete</button>
                  </>
                ) : null}
              </div>
            ))}
          </div>
          {hidden.length > 0 ? <p className="text-sm text-gray-600 mt-2">{hidden.length} hidden listings do not show on the public site.</p> : null}
          {(showAdd || edit) && canEdit ? (
            <ListingForm
              initial={edit || undefined}
              onCancel={() => { setEdit(null); setShowAdd(false); }}
              onSave={doSave}
            />
          ) : null}
        </div>
      )}

      {tab === "Enquiries" && (
        <div className="mt-4">
          <h2 className="font-bold text-lg">Enquiries ({enquiries.length})</h2>
          <p className="text-sm text-gray-600">Enquiries from the website form appear here. Change the stage as you work them.</p>
          {enquiries.length === 0 ? <p className="text-sm mt-2">No enquiries yet. Send one from the home page form to test.</p> : null}
          <div className="grid gap-3 mt-2">
            {enquiries.map((e) => (
              <div key={e.id} className="border rounded p-3">
                <p className="font-semibold">{e.name} : {e.phone}</p>
                <p className="text-sm text-gray-600">Asked: {e.asked} | From: {e.how} | Date: {e.date}</p>
                <p className="text-sm">Next: {e.next || "Not set"}</p>
                <div className="flex gap-2 mt-2 flex-wrap items-center">
                  <select
                    value={e.stage}
                    disabled={!canEdit}
                    onChange={async (ev) => {
                      await updateEnquiryStage(e.id, ev.target.value as Enquiry["stage"], e.next);
                      setMsg("Enquiry stage updated.");
                      await reload();
                    }}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    {STAGES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <input
                    value={e.next}
                    disabled={!canEdit}
                    placeholder="Next step and date"
                    onBlur={async (ev) => {
                      if (ev.target.value !== e.next) {
                        await updateEnquiryStage(e.id, e.stage, ev.target.value);
                        await reload();
                      }
                    }}
                    onChange={() => {}}
                    className="border border-gray-300 rounded px-2 py-1 text-sm flex-1 min-w-[180px]"
                  />
                </div>
              </div>
            ))}
          </div>
          {canEdit ? (
            <div className="mt-4 border-t pt-3">
              <p className="font-semibold text-sm">Add a test enquiry (phone or WhatsApp)</p>
              <TestEnquiryForm onDone={async () => { setMsg("Test enquiry added."); await reload(); }} />
            </div>
          ) : null}
        </div>
      )}

      {tab === "Projects" && (
        <div className="mt-4 grid gap-3">
          {projects.map((p) => (
            <div key={p.id} className="border rounded p-3">
              <p className="font-semibold">{p.name} : {p.loc}</p>
              <p className="text-sm text-gray-600">{p.note}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "Blogs" && (
        <div className="mt-4 grid gap-2">
          {blogs.map((b) => (
            <div key={b.id} className="border rounded p-3 text-sm">
              <span className="text-gray-600">{b.date} : </span>
              <a href={b.url} target="_blank" rel="noopener" className="text-navy underline">{b.title}</a>
            </div>
          ))}
        </div>
      )}

      {tab === "Agencies" && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {agencies.map((a) => (
            <div key={a.id} className="border rounded p-3 flex items-center gap-3">
              <img src={`/img/${a.logo}`} alt={a.name} width={500} height={438} className="max-h-10 w-auto" />
              <span className="font-semibold">{a.name}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "Services" && (
        <div className="mt-4 grid gap-3">
          {services.map((s) => (
            <div key={s.id} className="border rounded p-3">
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm text-gray-600">{s.note}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "Settings" && settings && (
        <SettingsForm
          initial={settings}
          canEdit={canEdit}
          onSave={async (s) => {
            await saveSettings(s);
            setSettings(s);
            setMsg("Settings saved" + (firebaseOn() ? " to Firestore." : " in this browser (local test mode)."));
          }}
        />
      )}
    </div>
  );
}

function ListingForm({ initial, onCancel, onSave }: { initial?: Listing; onCancel: () => void; onSave: (l: Listing) => void }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [price, setPrice] = useState(initial ? String(initial.n) : "");
  const [beds, setBeds] = useState(String(initial?.beds ?? 3));
  const [baths, setBaths] = useState(String(initial?.baths ?? 3));
  const [size, setSize] = useState(initial?.size || "5 Marla");
  const [city, setCity] = useState(initial?.city || "Lahore");
  const [loc, setLoc] = useState(initial?.loc || "");
  const [type, setType] = useState(initial?.type || "House");
  const [status, setStatus] = useState(initial?.status || "sale");
  const [photo, setPhoto] = useState(initial?.img || "");
  const REAL_PHOTOS = [
    "",
    "lst-karachi-shamsi.jpg",
    "lst-dha-stunning.jpg",
    "lst-dha-defence4.jpg",
    "lst-dha-u7.jpg",
    "lst-dha-1kanal.jpg",
    "lst-bahria-luxury.jpg",
    "lst-alhafeez.jpg",
    "lst-bahria-rwp.jpg",
    "lst-citi-multan.jpg",
    "lst-orchard-rent.jpg",
    "lst-bahria8-rent.jpg",
    "lst-kuri-rent.jpg",
  ];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
    onSave({
      id: initial?.id || "admin-" + Date.now().toString(36),
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
      img: photo.trim(),
      badge: status === "rent" ? "For Rent" : "For Sale",
      url: initial?.url || "",
      liveStatus: initial?.liveStatus || "live",
      visible: initial?.visible !== false,
      createdAt: initial?.createdAt || new Date().toISOString().slice(0, 10),
    });
  }

  return (
    <form onSubmit={submit} className="border border-navy rounded-lg p-4 mt-4 bg-white grid gap-3 max-w-xl">
      <h3 className="font-bold">{initial ? "Edit listing" : "Add listing"}</h3>
      <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className={inputCls} />
      <input required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price in Rs, numbers only" inputMode="numeric" className={inputCls} />
      <div className="grid grid-cols-2 gap-3">
        <input value={beds} onChange={(e) => setBeds(e.target.value)} placeholder="Beds" inputMode="numeric" className={inputCls} />
        <input value={baths} onChange={(e) => setBaths(e.target.value)} placeholder="Baths" inputMode="numeric" className={inputCls} />
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
        <select value={status} onChange={(e) => setStatus(e.target.value as "sale" | "rent")} className={inputCls}>
          <option value="sale">For sale</option>
          <option value="rent">For rent</option>
        </select>
      </div>
      <input required value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Area or society" className={inputCls} />
      <select value={REAL_PHOTOS.includes(photo) ? photo : ""} onChange={(e) => setPhoto(e.target.value)} className={inputCls}>
        <option value="">No photo, or paste a photo link below</option>
        {REAL_PHOTOS.filter(Boolean).map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      <input value={REAL_PHOTOS.includes(photo) ? "" : photo} onChange={(e) => setPhoto(e.target.value)} placeholder="Photo link, optional, for example https://example.com/photo.jpg" className={inputCls} />
      <p className="text-sm text-gray-600">Photo upload is not built yet, because Firebase Storage is not enabled. Pick a real photo from the site, or paste a photo link.</p>
      <div className="flex gap-2">
        <button className={btnRed}>Save listing</button>
        <button type="button" className={btnLine} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function TestEnquiryForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("Test Buyer");
  const [phone, setPhone] = useState("+92 300 000 0000");
  return (
    <div className="flex gap-2 mt-2 flex-wrap">
      <input value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-300 rounded px-3 py-2" />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} className="border border-gray-300 rounded px-3 py-2" />
      <button
        className={btnNavy}
        onClick={async () => {
          await addEnquiry({ name, phone, asked: "Test listing", how: "Dashboard test", next: "Call back" });
          onDone();
        }}
      >
        Add test enquiry
      </button>
    </div>
  );
}

function SettingsForm({ initial, canEdit, onSave }: { initial: OfficeSettings; canEdit: boolean; onSave: (s: OfficeSettings) => void }) {
  const [phone, setPhone] = useState(initial.phone);
  const [email, setEmail] = useState(initial.email);
  const [address, setAddress] = useState(initial.address);
  const [ceo, setCeo] = useState(initial.ceo);
  return (
    <form
      className="mt-4 grid gap-3 max-w-xl"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...initial, phone, email, address, ceo });
      }}
    >
      <h2 className="font-bold text-lg">Office settings</h2>
      <label className="text-sm">Phone<input disabled={!canEdit} value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} /></label>
      <label className="text-sm">Email<input disabled={!canEdit} value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} /></label>
      <label className="text-sm">Office address<input disabled={!canEdit} value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} /></label>
      <label className="text-sm">CEO<input disabled={!canEdit} value={ceo} onChange={(e) => setCeo(e.target.value)} className={inputCls} /></label>
      {canEdit ? <button className={btnRed + " w-fit"}>Save settings</button> : <p className="text-sm text-gray-600">Your role is View only. You can see settings but not change them.</p>}
    </form>
  );
}
