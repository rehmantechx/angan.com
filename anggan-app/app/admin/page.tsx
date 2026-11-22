"use client";
import { useEffect, useRef, useState } from "react";
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
  saveAgency,
  deleteAgency,
  missingSeedListings,
  restoreMissingSeedListings,
  addEnquiry,
  updateEnquiryStage,
  deleteEnquiry,
  saveSettings,
  seedFirestore,
  isFirestoreSeeded,
  firebaseOn,
  setDemoMode,
} from "../../lib/db";
import { Listing, Project, Blog, Agency, Service, Enquiry, OfficeSettings } from "../../lib/seed";

type Tab = "Overview" | "Listings" | "Enquiries" | "Projects" | "Blogs" | "Agencies" | "Services" | "Settings";

const inputCls = "border border-gray-300 rounded px-3 py-2 w-full min-w-0";
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
  const [seeded, setSeeded] = useState(false);
  const [msg, setMsg] = useState("");
  const [edit, setEdit] = useState<Listing | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [q, setQ] = useState("");
  const [cityF, setCityF] = useState("All");
  const [typeF, setTypeF] = useState("All");
  const [statusF, setStatusF] = useState("All");
  const [sort, setSort] = useState("newest");
  const [detail, setDetail] = useState<Listing | null>(null);
  // In-app delete confirmation. The old code used window.confirm, which
  // is the root cause of the live failure: an automated browser
  // auto-dismisses native dialogs, so confirm returned false, the delete
  // never ran, and no message ever appeared. A real dialog in the page
  // cannot be auto-dismissed, and its Yes button is a normal click.
  const [confirmDelete, setConfirmDelete] = useState<{ kind: "listing" | "enquiry" | "agency"; id: string; label: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [msgError, setMsgError] = useState(false);
  // FIX-08: agency add/edit form state, same pattern as ListingForm.
  const [agencyEdit, setAgencyEdit] = useState<Agency | null>(null);
  const [showAgencyAdd, setShowAgencyAdd] = useState(false);
  // FIX-07: a success toast auto-dismisses after 5 seconds. Error
  // messages stay until closed, so a failed save is never missed.
  useEffect(() => {
    if (!msg || msgError) return;
    const t = setTimeout(() => setMsg(""), 5000);
    return () => clearTimeout(t);
  }, [msg, msgError]);

  async function reload() {
    // Parallel, not sequential: the old version awaited 8 reads one after
    // another, so a refresh after Delete/Hide took many seconds and the
    // page looked unchanged. All reads have their own timeouts.
    const [l, p, b, a, s, e, st, sd] = await Promise.all([
      getListings(),
      getProjects(),
      getBlogs(),
      getAgencies(),
      getServices(),
      getEnquiries(),
      getSettings(),
      isFirestoreSeeded(),
    ]);
    setListings(l);
    setProjects(p);
    setBlogs(b);
    setAgencies(a);
    setServices(s);
    setEnquiries(e);
    setSettings(st);
    setSeeded(sd);
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

  // Listings search, filters and sort. Size sorts by area: 1 Kanal is 20 Marla.
  function sizeMarla(size: string): number {
    const n = parseFloat(size) || 0;
    return /kanal/i.test(size) ? n * 20 : n;
  }
  const filtered = listings.filter((l) => {
    const needle = q.trim().toLowerCase();
    if (needle && (l.title + " " + l.loc + " " + l.city).toLowerCase().indexOf(needle) === -1) return false;
    if (cityF !== "All" && l.city !== cityF) return false;
    if (typeF !== "All" && l.type !== typeF) return false;
    if (statusF !== "All" && l.status !== statusF) return false;
    return true;
  });
  const shown = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.n - b.n;
    if (sort === "price-desc") return b.n - a.n;
    if (sort === "size") return sizeMarla(b.size) - sizeMarla(a.size);
    return b.createdAt.localeCompare(a.createdAt) || a.title.localeCompare(b.title);
  });
  const cities = ["All", ...Array.from(new Set(listings.map((l) => l.city)))];
  const types = ["All", ...Array.from(new Set(listings.map((l) => l.type)))];

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

  // Delete flow: the Delete button only opens the in-app dialog above.
  // Confirming removes the row from state immediately (optimistic), so
  // the change is visible at once, then deletes in Firestore, then
  // reloads to sync. If the delete fails, the message says so in red
  // and the reload puts the row back, so a failed delete is never silent.
  async function confirmDeleteNow() {
    const target = confirmDelete;
    if (!target || deletingId) return;
    setConfirmDelete(null);
    if (isDemo) {
      setMsgError(false);
      setMsg("Demo mode, view only. Changes are not saved.");
      return;
    }
    setDeletingId(target.id);
    if (target.kind === "listing") setListings((prev) => prev.filter((l) => l.id !== target.id));
    else if (target.kind === "agency") setAgencies((prev) => prev.filter((a) => a.id !== target.id));
    else setEnquiries((prev) => prev.filter((e) => e.id !== target.id));
    setMsgError(false);
    setMsg("Deleting...");
    try {
      if (target.kind === "listing") await deleteListing(target.id);
      else if (target.kind === "agency") await deleteAgency(target.id);
      else await deleteEnquiry(target.id);
      setMsgError(false);
      setMsg(target.kind === "listing" ? "Deleted. It is gone from the public site too." : target.kind === "agency" ? "Agency deleted." : "Enquiry deleted.");
    } catch (err) {
      const e = err as { message?: string };
      setMsgError(true);
      setMsg(
        "Could not delete " +
          (target.kind === "listing" ? "the listing" : target.kind === "agency" ? "the agency" : "the enquiry") +
          ": " +
          (e.message || "permission denied") +
          " The signed-in user needs the Full access or Staff role. The item is still there, try again."
      );
    } finally {
      setDeletingId(null);
    }
    await reload();
  }

  // FIX-01: the 12 real seed listings, by id, and any that are missing
  // from the loaded list. Shown in the Listings tab, never auto-fixed.
  const missing = missingSeedListings(listings);

  return (
    <div className="w-full max-w-full min-w-0">
      <div className="flex items-baseline gap-3 flex-wrap min-w-0">
        <h1 className="text-3xl font-bold text-navy">Dashboard</h1>
        <span className="text-sm text-gray-600 min-w-0 break-words">
          Signed in as {user.email} · {user.role}
        </span>
      </div>
      {isDemo ? (
        <div className="bg-amber-100 text-amber-900 text-sm rounded p-3 mt-3 flex gap-3 items-center flex-wrap">
          <span className="flex-1 min-w-0 break-words">Demo mode, view only. Changes are not saved. Sign in with an authorized office account for the real office dashboard.</span>
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
          Firestore, collection users, your user document, field role, set to Full access or Staff.
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
      {/* FIX-07: the toast has a close button and a success toast
          auto-dismisses after 5 seconds, so it never stacks under the
          permanent "Firebase is connected" banner forever. */}
      {msg ? (
        <p role="status" className={(msgError ? "bg-red-50 text-red-900 " : "bg-green-50 text-green-900 ") + "text-sm rounded p-3 mt-3 flex gap-3 items-start"}>
          <span className="flex-1 min-w-0 break-words">{msg}</span>
          <button type="button" onClick={() => setMsg("")} aria-label="Close message" className="shrink-0 px-2 py-0.5 rounded hover:bg-black/10 font-bold min-h-[32px] min-w-[32px]">
            &#10005;
          </button>
        </p>
      ) : null}

      <div className="flex gap-2 mt-4 flex-wrap w-full max-w-full min-w-0">
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
          <div className="border rounded p-4"><p className="text-2xl font-bold">{projects.length}</p><p>Projects</p></div>
          <div className="border rounded p-4"><p className="text-2xl font-bold">{blogs.length}</p><p>Blogs</p></div>
          <div className="border rounded p-4"><p className="text-2xl font-bold">{agencies.length}</p><p>Agencies</p></div>
          <div className="border rounded p-4 sm:col-span-2">
            <p className="font-bold">Enquiries by stage</p>
            <p className="text-sm mt-1">{STAGES.map((s) => `${s}: ${enquiries.filter((e) => e.stage === s).length}`).join(" | ")}</p>
          </div>
          <div className="border rounded p-4 sm:col-span-2">
            <p className="font-bold">Listings by city</p>
            <p className="text-sm mt-1">
              {["Lahore", "Rawalpindi", "Multan", "Islamabad", "Karachi"].map((c) => `${c}: ${listings.filter((l) => l.city === c).length}`).join(" | ")}
            </p>
            {firebaseOn() && !isDemo && !seeded ? (
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
                <div key={l.id} className="border rounded p-3 mt-2 flex gap-2 items-center flex-wrap w-full max-w-full min-w-0">
                  <span className="font-semibold flex-1 min-w-0 break-words">{l.title} · {l.price} ({l.city})</span>
                  {canEdit ? (
                    <>
                      <button className={btnNavy} onClick={() => doSave({ ...l, liveStatus: "live", badge: "For Sale" })}>Approve and show live</button>
                      <button type="button" className={btnLine} disabled={deletingId === l.id} onClick={() => setConfirmDelete({ kind: "listing", id: l.id, label: l.title })}>Delete</button>
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
          <h2 className="font-bold text-lg mt-6">All listings ({listings.length})</h2>
          {/* FIX-01: name the missing real listing instead of silently
              showing 11 of 12. Restore writes only that seed row, by id,
              so no existing record is duplicated. */}
          {missing.length > 0 ? (
            <div className="bg-amber-100 text-amber-900 text-sm rounded p-3 mt-3">
              <p className="font-semibold">{missing.length} real listing{missing.length > 1 ? "s are" : " is"} missing from Firestore: {missing.map((l) => l.title + " (" + l.id + ")").join("; ")}.</p>
              <p className="mt-1">This is a data gap, not a filter. Nothing was duplicated.</p>
              {canEdit ? (
                <button
                  className={btnNavy + " mt-2"}
                  onClick={async () => {
                    try {
                      setMsg(await restoreMissingSeedListings(missing));
                      setMsgError(false);
                    } catch (err) {
                      const e2 = err as { message?: string };
                      setMsgError(true);
                      setMsg("Could not restore the missing listing: " + (e2.message || "permission denied"));
                    }
                    await reload();
                  }}
                >
                  Restore missing listing{missing.length > 1 ? "s" : ""}
                </button>
              ) : null}
            </div>
          ) : null}
          <div className="flex gap-2 mt-2 flex-wrap items-center w-full max-w-full min-w-0">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title or area"
              aria-label="Search listings"
              className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 min-w-0 max-w-full"
            />
            <select value={cityF} onChange={(e) => setCityF(e.target.value)} aria-label="Filter by city" className="border border-gray-300 rounded px-2 py-2 text-sm min-w-0 max-w-full">
              {cities.map((c) => <option key={c} value={c}>{c === "All" ? "All cities" : c}</option>)}
            </select>
            <select value={typeF} onChange={(e) => setTypeF(e.target.value)} aria-label="Filter by type" className="border border-gray-300 rounded px-2 py-2 text-sm min-w-0 max-w-full">
              {types.map((t) => <option key={t} value={t}>{t === "All" ? "All types" : t}</option>)}
            </select>
            <select value={statusF} onChange={(e) => setStatusF(e.target.value)} aria-label="Filter by status" className="border border-gray-300 rounded px-2 py-2 text-sm min-w-0 max-w-full">
              <option value="All">For sale and rent</option>
              <option value="sale">For sale</option>
              <option value="rent">For rent</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort listings" className="border border-gray-300 rounded px-2 py-2 text-sm min-w-0 max-w-full">
              <option value="newest">Newest first</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="size">Size: largest first</option>
            </select>
          </div>
          <p className="text-sm text-gray-600 mt-2">Showing {shown.length} of {listings.length} listings</p>
          {shown.length === 0 ? <p className="text-sm mt-2">No listings match these filters.</p> : null}
          <div className="grid gap-3 mt-2">
            {shown.map((l) => (
              <div key={l.id} className="border rounded p-3 flex gap-2 items-center flex-wrap w-full max-w-full min-w-0">
                <span className="flex-1 min-w-0 break-words">
                  <button type="button" onClick={() => setDetail(l)} className="font-semibold text-left text-navy underline underline-offset-2">{l.title}</button>
                  <span className="text-sm text-gray-600 block">{l.price} | {l.city} | {l.size} | {l.status === "sale" ? "Sale" : "Rent"} | {l.liveStatus === "live" && l.visible !== false ? "Live" : l.liveStatus === "pending" ? "Pending" : "Hidden"}</span>
                </span>
                <button className={btnLine} onClick={() => setDetail(l)}>Details</button>
                {canEdit ? (
                  <>
                    <button className={btnLine} onClick={() => { setShowAdd(false); setEdit(l); }}>Edit</button>
                    {l.liveStatus === "live" && l.visible !== false ? (
                      <button className={btnLine} onClick={() => doSave({ ...l, liveStatus: "hidden", visible: false })}>Hide</button>
                    ) : l.liveStatus === "hidden" || l.visible === false ? (
                      <button className={btnNavy} onClick={() => doSave({ ...l, liveStatus: "live", visible: true })}>Show live</button>
                    ) : null}
                    <button type="button" className={btnLine} disabled={deletingId === l.id} onClick={() => setConfirmDelete({ kind: "listing", id: l.id, label: l.title })}>{deletingId === l.id ? "Deleting..." : "Delete"}</button>
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
          <p className="text-sm text-gray-600">Enquiries from the website form appear here.{canEdit ? " Change the stage as you work them." : ""}</p>
          {enquiries.length === 0 ? <p className="text-sm mt-2">No enquiries yet.</p> : null}
          <div className="grid gap-3 mt-2">
            {enquiries.map((e) => (
              <div key={e.id} className="border rounded p-3">
                <p className="font-semibold">{e.name} · {e.phone}</p>
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
                    className="border border-gray-300 rounded px-2 py-1 text-sm flex-1 min-w-0 max-w-full"
                  />
                  {canEdit ? (
                    <button type="button" className="border border-navy text-navy px-2 py-1 rounded text-sm min-h-[40px]" disabled={deletingId === e.id} onClick={() => setConfirmDelete({ kind: "enquiry", id: e.id, label: e.name })}>{deletingId === e.id ? "Deleting..." : "Delete"}</button>
                  ) : null}
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
        <div className="mt-4">
          <h2 className="font-bold text-lg">Projects ({projects.length})</h2>
          <div className="grid gap-3 mt-2">
          {projects.map((p) => (
            <div key={p.id} className="border rounded p-3">
              <p className="font-semibold">{p.name} · {p.loc}</p>
              <p className="text-sm text-gray-600">{p.note}</p>
            </div>
          ))}
        </div>
        </div>
      )}

      {tab === "Blogs" && (
        <div className="mt-4">
          <h2 className="font-bold text-lg">Blogs ({blogs.length})</h2>
          <div className="grid gap-2 mt-2">
          {blogs.map((b) => (
            <div key={b.id} className="border rounded p-3 text-sm">
              <span className="text-gray-600">{b.date} · </span>
              <a href={`/blogs/${b.id}`} target="_blank" rel="noopener noreferrer" className="text-navy underline">{b.title}<span aria-hidden="true"> ↗</span><span className="sr-only"> (opens in a new tab)</span></a>
            </div>
          ))}
        </div>
        </div>
      )}

      {tab === "Agencies" && (
        <div className="mt-4">
          <h2 className="font-bold text-lg">Agencies ({agencies.length})</h2>
          {/* FIX-08: Agencies were read-only for a Full-access user.
              They now have the same Add/Edit/Delete as Listings, wired
              to Firestore, with the same in-app confirm dialog and
              optimistic removal. View only sees no buttons. */}
          {canEdit ? (
            <div className="flex gap-2 mt-2 flex-wrap">
              <button className={btnRed} onClick={() => { setAgencyEdit(null); setShowAgencyAdd(true); }}>Add agency</button>
            </div>
          ) : (
            <p className="text-sm text-gray-600 mt-2">Your role is View only. You can see agencies but not change them.</p>
          )}
          <div className="grid gap-3 mt-2 sm:grid-cols-2 w-full max-w-full min-w-0">
          {agencies.map((a) => (
            <div key={a.id} className="border rounded p-3 flex items-center gap-3 min-w-0 flex-wrap">
              <AgencyAvatar agency={a} />
              <span className="font-semibold min-w-0 break-words flex-1">{a.name}</span>
              {canEdit ? (
                <span className="flex gap-2 shrink-0">
                  <button className={btnLine} onClick={() => { setShowAgencyAdd(false); setAgencyEdit(a); }}>Edit</button>
                  <button type="button" className={btnLine} disabled={deletingId === a.id} onClick={() => setConfirmDelete({ kind: "agency", id: a.id, label: a.name })}>{deletingId === a.id ? "Deleting..." : "Delete"}</button>
                </span>
              ) : null}
            </div>
          ))}
        </div>
          {(showAgencyAdd || agencyEdit) && canEdit ? (
            <AgencyForm
              initial={agencyEdit || undefined}
              onCancel={() => { setAgencyEdit(null); setShowAgencyAdd(false); }}
              onSave={async (a) => {
                if (isDemo) { setMsg("Demo mode, view only. Changes are not saved."); return; }
                try {
                  await saveAgency(a);
                  setMsg("Agency saved.");
                  setMsgError(false);
                } catch (err) {
                  const e2 = err as { message?: string };
                  setMsgError(true);
                  setMsg("Could not save the agency: " + (e2.message || "permission denied"));
                }
                setAgencyEdit(null);
                setShowAgencyAdd(false);
                await reload();
              }}
            />
          ) : null}
        </div>
      )}

      {tab === "Services" && (
        <div className="mt-4">
          <h2 className="font-bold text-lg">Services ({services.length})</h2>
          {!canEdit ? <p className="text-sm text-gray-600 mt-1">Your role is View only. You can see services but not change them.</p> : null}
          <div className="grid gap-3 mt-2">
          {services.map((s) => (
            <div key={s.id} className="border rounded p-3">
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm text-gray-600">{s.note}</p>
              <a href={`/services/${s.id}`} target="_blank" rel="noopener noreferrer" className="text-navy underline text-sm inline-block mt-2">View service<span aria-hidden="true"> ↗</span><span className="sr-only"> (opens in a new tab)</span></a>
            </div>
          ))}
        </div>
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

      {detail ? (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-label="Listing details">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDetail(null)} />
          <div className="relative bg-white w-full max-w-md h-full overflow-y-auto p-4 min-w-0">
            <div className="flex gap-2 items-start justify-between">
              <h2 className="font-bold text-lg text-navy min-w-0 break-words">{detail.title}</h2>
              <button className={btnLine} onClick={() => setDetail(null)}>Close</button>
            </div>
            {detail.img ? (
              <img src={`/img/${detail.img}`} alt={detail.title} className="w-full rounded mt-3" />
            ) : null}
            <dl className="grid gap-2 mt-3 text-sm">
              <div className="flex gap-2 flex-wrap"><dt className="font-semibold">Price:</dt><dd>{detail.price}</dd></div>
              <div className="flex gap-2 flex-wrap"><dt className="font-semibold">City:</dt><dd>{detail.city}</dd></div>
              <div className="flex gap-2 flex-wrap"><dt className="font-semibold">Area:</dt><dd>{detail.loc}</dd></div>
              <div className="flex gap-2 flex-wrap"><dt className="font-semibold">Type:</dt><dd>{detail.type}</dd></div>
              <div className="flex gap-2 flex-wrap"><dt className="font-semibold">Status:</dt><dd>{detail.status === "sale" ? "For sale" : "For rent"}</dd></div>
              <div className="flex gap-2 flex-wrap"><dt className="font-semibold">Size:</dt><dd>{detail.size}</dd></div>
              <div className="flex gap-2 flex-wrap"><dt className="font-semibold">Beds:</dt><dd>{detail.beds}</dd><dt className="font-semibold">Baths:</dt><dd>{detail.baths}</dd></div>
              <div className="flex gap-2 flex-wrap"><dt className="font-semibold">Visibility:</dt><dd>{detail.liveStatus === "live" && detail.visible !== false ? "Live" : detail.liveStatus === "pending" ? "Pending" : "Hidden"}</dd></div>
              <div className="flex gap-2 flex-wrap"><dt className="font-semibold">Added:</dt><dd>{detail.createdAt}</dd></div>
            </dl>
            {canEdit ? (
              <div className="flex gap-2 mt-4 flex-wrap">
                <button className={btnLine} onClick={() => { setEdit(detail); setShowAdd(false); setDetail(null); }}>Edit</button>
                {detail.liveStatus === "live" && detail.visible !== false ? (
                  <button className={btnLine} onClick={async () => { await doSave({ ...detail, liveStatus: "hidden", visible: false }); setDetail(null); }}>Hide</button>
                ) : detail.liveStatus === "hidden" || detail.visible === false ? (
                  <button className={btnNavy} onClick={async () => { await doSave({ ...detail, liveStatus: "live", visible: true }); setDetail(null); }}>Show live</button>
                ) : null}
                <button type="button" className={btnLine} disabled={deletingId === detail.id} onClick={() => { setConfirmDelete({ kind: "listing", id: detail.id, label: detail.title }); setDetail(null); }}>{deletingId === detail.id ? "Deleting..." : "Delete"}</button>
              </div>
            ) : (
              <p className="text-sm text-gray-600 mt-4">Your role is View only. You can see this listing but not change it.</p>
            )}
          </div>
        </div>
      ) : null}

      {confirmDelete ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="alertdialog" aria-label={confirmDelete.kind === "listing" ? "Delete this listing?" : confirmDelete.kind === "agency" ? "Delete this agency?" : "Delete this enquiry?"}>
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-lg p-5 w-full max-w-sm min-w-0">
            <h2 className="font-bold text-lg text-navy">{confirmDelete.kind === "listing" ? "Delete this listing?" : confirmDelete.kind === "agency" ? "Delete this agency?" : "Delete this enquiry?"}</h2>
            <p className="text-sm text-gray-600 mt-2 break-words">
              {confirmDelete.kind === "listing"
                ? "Delete listing: " + confirmDelete.label + "? It will be gone from the public site too. This cannot be undone."
                : confirmDelete.kind === "agency"
                  ? "Delete agency: " + confirmDelete.label + "? This cannot be undone."
                  : "Delete enquiry from " + confirmDelete.label + "? This cannot be undone."}
            </p>
            <div className="flex gap-2 mt-4 flex-wrap">
              <button type="button" className={btnRed} disabled={deletingId === confirmDelete.id} onClick={confirmDeleteNow}>Yes, delete</button>
              <button type="button" className={btnLine} onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function agencyInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  const first = words[0] ? words[0][0] : "";
  const second = words.length > 1 && words[1] ? words[1][0] : "";
  return (first + second).toUpperCase();
}

// Fixed-size agency mark. A real logo shows in a fixed 40px square box;
// when no logo is stored, or the logo file fails to load, a navy
// circular monogram with the agency initials shows instead, so every
// row aligns. No fake logos are invented.
function AgencyAvatar({ agency }: { agency: Agency }) {
  const [failed, setFailed] = useState(false);
  const src = agency.logoUrl || (agency.logo ? `/img/${agency.logo}` : "");
  if (!src || failed) {
    return (
      <span aria-hidden="true" className="w-10 h-10 shrink-0 rounded-full bg-navy text-white inline-flex items-center justify-center text-sm font-bold">
        {agencyInitials(agency.name)}
      </span>
    );
  }
  return <img src={src} alt="" width={40} height={40} onError={() => setFailed(true)} className="w-10 h-10 shrink-0 rounded object-contain bg-white" />;
}

// FIX-08: agency add/edit form. Logo is a file name from the site
// (partner-*.png/jpg in public/img) or a photo link, both optional;
// a missing logo shows the navy monogram, never a fake logo.
function AgencyForm({ initial, onCancel, onSave }: { initial?: Agency; onCancel: () => void; onSave: (a: Agency) => Promise<void> | void }) {
  const [name, setName] = useState(initial?.name || "");
  const [logo, setLogo] = useState(initial?.logo || "");
  const [logoUrl, setLogoUrl] = useState(initial?.logoUrl || "");
  const [saving, setSaving] = useState(false);
  const [newId] = useState(() => "agency-" + Date.now().toString(36));
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true);
    Promise.resolve(onSave({ id: initial?.id || newId, name: name.trim(), logo: logo.trim(), logoUrl: logoUrl.trim() || undefined })).finally(() => setSaving(false));
  }
  return (
    <form onSubmit={submit} className="border border-navy rounded-lg p-4 mt-4 bg-white grid gap-3 w-full max-w-xl min-w-0">
      <h3 className="font-bold">{initial ? "Edit agency" : "Add agency"}</h3>
      <label className="text-sm font-semibold">Agency name
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Agency name, for example ADARSH Associates" className={inputCls + " mt-1 font-normal"} />
      </label>
      <label className="text-sm font-semibold">Logo file, optional
        <input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="Logo file, for example partner-adarsh.png" className={inputCls + " mt-1 font-normal"} />
      </label>
      <label className="text-sm font-semibold">Logo link, optional
        <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="Photo link, optional, for example https://example.com/logo.png" className={inputCls + " mt-1 font-normal"} />
      </label>
      <p className="text-sm text-gray-600">Leave both logo fields empty and the agency shows a navy monogram with its initials.</p>
      <div className="flex gap-2">
        <button disabled={saving} className={btnRed + " disabled:opacity-50"}>{saving ? "Saving..." : "Save agency"}</button>
        <button type="button" disabled={saving} className={btnLine + " disabled:opacity-50"} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function ListingForm({ initial, onCancel, onSave }: { initial?: Listing; onCancel: () => void; onSave: (l: Listing) => Promise<void> | void }) {
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
  // In-flight submit lock. The live bug: the first save showed "Saved."
  // but the admin list still showed 12, so the form was saved a second
  // time and two identical listings were created. The button disables
  // immediately on click until the Firestore write resolves, and the
  // ref guard blocks a second submit in the same tick.
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  // FIX-05/FIX-06 (admin form): price must be a number above zero,
  // with an inline error instead of silently becoming "Price on call".
  const [priceErr, setPriceErr] = useState("");
  // One id per form, fixed when the form opens. A retry overwrites the
  // same document instead of creating a second identical listing.
  const [newId] = useState(() => "admin-" + Date.now().toString(36));
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
    if (savingRef.current) return;
    const n = parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
    if (!/^[0-9][0-9, ]*$/.test(price.trim()) || n <= 0) {
      setPriceErr("Please write a price in Rs, numbers only, above zero.");
      return;
    }
    setPriceErr("");
    savingRef.current = true;
    setSaving(true);
    Promise.resolve(onSave({
      id: initial?.id || newId,
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
      badge: status === "rent" ? "For Rent" : "For Sale",
      url: initial?.url || "",
      liveStatus: initial?.liveStatus || "live",
      visible: initial?.visible !== false,
      createdAt: initial?.createdAt || new Date().toISOString().slice(0, 10),
    })).finally(() => {
      savingRef.current = false;
      setSaving(false);
    });
  }

  return (
    <form onSubmit={submit} noValidate className="border border-navy rounded-lg p-4 mt-4 bg-white grid gap-3 w-full max-w-xl min-w-0">
      <h3 className="font-bold">{initial ? "Edit listing" : "Add listing"}</h3>
      {/* FIX-05: every field has a persistent visible label above it,
          so once a user types, the field is still named. Placeholders
          are hints only, never the only label. */}
      <label className="text-sm font-semibold">Title
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" aria-label="Title" className={inputCls + " mt-1 font-normal"} />
      </label>
      <label className="text-sm font-semibold">Price (Rs)
        <span className="flex items-center gap-1 mt-1">
          <span aria-hidden="true" className="text-sm text-gray-600 shrink-0">Rs</span>
          <input required value={price} onChange={(e) => { setPrice(e.target.value); if (priceErr) setPriceErr(""); }} placeholder="Price in Rs, numbers only" inputMode="numeric" aria-label="Price in Rs" aria-invalid={!!priceErr} aria-describedby={priceErr ? "admin-price-error" : undefined} className={inputCls + " font-normal"} />
        </span>
        {priceErr ? <span id="admin-price-error" role="alert" className="text-red-700 text-sm font-normal block mt-1">{priceErr}</span> : null}
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-semibold">Beds
          <input value={beds} onChange={(e) => setBeds(e.target.value)} placeholder="Beds" inputMode="numeric" aria-label="Beds" className={inputCls + " mt-1 font-normal"} />
        </label>
        <label className="text-sm font-semibold">Baths
          <input value={baths} onChange={(e) => setBaths(e.target.value)} placeholder="Baths" inputMode="numeric" aria-label="Baths" className={inputCls + " mt-1 font-normal"} />
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
          <select value={status} onChange={(e) => setStatus(e.target.value as "sale" | "rent")} aria-label="Status" className={inputCls + " mt-1 font-normal"}>
            <option value="sale">For sale</option>
            <option value="rent">For rent</option>
          </select>
        </label>
      </div>
      <label className="text-sm font-semibold">Area or society
        <input required value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Area or society" aria-label="Area or society" className={inputCls + " mt-1 font-normal"} />
      </label>
      <label className="text-sm font-semibold">Photo
        <select value={REAL_PHOTOS.includes(photo) ? photo : ""} onChange={(e) => setPhoto(e.target.value)} aria-label="Photo" className={inputCls + " mt-1 font-normal"}>
          <option value="">No photo, or paste a photo link below</option>
          {REAL_PHOTOS.filter(Boolean).map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </label>
      <label className="text-sm font-semibold">Photo link, optional
        <input value={REAL_PHOTOS.includes(photo) ? "" : photo} onChange={(e) => setPhoto(e.target.value)} placeholder="Photo link, optional, for example https://example.com/photo.jpg" aria-label="Photo link, optional" className={inputCls + " mt-1 font-normal"} />
      </label>
      <p className="text-sm text-gray-600">Photo upload is not built yet, because Firebase Storage is not enabled. Pick a real photo from the site, or paste a photo link.</p>
      <div className="flex gap-2">
        <button disabled={saving} className={btnRed + " disabled:opacity-50"}>{saving ? "Saving..." : "Save listing"}</button>
        <button type="button" disabled={saving} className={btnLine + " disabled:opacity-50"} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function TestEnquiryForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("Test Buyer");
  const [phone, setPhone] = useState("+92 300 000 0000");
  return (
    <div className="flex gap-2 mt-2 flex-wrap w-full max-w-full min-w-0">
      <input value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-300 rounded px-3 py-2 min-w-0 max-w-full flex-1" />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} className="border border-gray-300 rounded px-3 py-2 min-w-0 max-w-full flex-1" />
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
  // View only users see the values but cannot change them, so their
  // inputs look disabled: muted gray fill, muted text, not-allowed cursor.
  const fieldCls = canEdit ? inputCls : inputCls + " bg-gray-100 text-gray-500 cursor-not-allowed";
  return (
    <form
      className="mt-4 grid gap-3 w-full max-w-xl min-w-0"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...initial, phone, email, address, ceo });
      }}
    >
      <h2 className="font-bold text-lg">Office settings</h2>
      <label className="text-sm">Phone<input disabled={!canEdit} value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldCls} /></label>
      <label className="text-sm">Email<input disabled={!canEdit} value={email} onChange={(e) => setEmail(e.target.value)} className={fieldCls} /></label>
      <label className="text-sm">Office address<input disabled={!canEdit} value={address} onChange={(e) => setAddress(e.target.value)} className={fieldCls} /></label>
      <label className="text-sm">CEO<input disabled={!canEdit} value={ceo} onChange={(e) => setCeo(e.target.value)} className={fieldCls} /></label>
      {canEdit ? <button className={btnRed + " w-fit"}>Save settings</button> : <p className="text-sm text-gray-600">Your role is View only. You can see settings but not change them.</p>}
    </form>
  );
}
