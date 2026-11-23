// Shared data layer used by BOTH the public site and the dashboard.
// One source of truth, no second copy. When Firebase is configured it reads
// and writes Firestore. When it is not configured it reads the real seed
// data and saves changes in the browser (localStorage), with a clear notice.
import { getDb, isFirebaseConfigured } from "./firebase";
import type { Firestore } from "firebase/firestore";

// The Firestore SDK is loaded only when a read or write actually runs,
// so public pages never download it. All callers below are async.
let fsMod: typeof import("firebase/firestore") | null = null;
async function fs(): Promise<typeof import("firebase/firestore")> {
  if (!fsMod) fsMod = await import("firebase/firestore");
  return fsMod;
}
import {
  LISTINGS,
  PROJECTS,
  BLOGS,
  AGENCIES,
  SERVICES,
  SETTINGS,
  Listing,
  Project,
  Blog,
  Agency,
  Service,
  Enquiry,
  OfficeSettings,
} from "./seed";

export const firebaseOn = () => isFirebaseConfigured();

// Demo mode: read-only, View only, seed data only, no Firestore at all.
// Set by the dashboard when the signed-in user is a demo user. Reads
// return the pure seed data (no local test edits), writes throw.
let demoMode = false;
export function setDemoMode(v: boolean) {
  demoMode = v;
}
export function isDemoMode() {
  return demoMode;
}
function demoStore(): LocalStore {
  return seedStore();
}

const LOCAL_KEY = "anngan-local-v1";

type LocalStore = {
  listings: Listing[];
  projects: Project[];
  blogs: Blog[];
  agencies: Agency[];
  services: Service[];
  enquiries: Enquiry[];
  settings: OfficeSettings;
};

function seedStore(): LocalStore {
  return {
    listings: LISTINGS,
    projects: PROJECTS,
    blogs: BLOGS,
    agencies: AGENCIES,
    services: SERVICES,
    enquiries: [],
    settings: SETTINGS,
  };
}

function loadLocal(): LocalStore {
  if (typeof window === "undefined") return seedStore();
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    if (!raw) return seedStore();
    const parsed = JSON.parse(raw) as Partial<LocalStore>;
    const seed = seedStore();
    return {
      listings: parsed.listings ?? seed.listings,
      projects: parsed.projects ?? seed.projects,
      blogs: parsed.blogs ?? seed.blogs,
      agencies: parsed.agencies ?? seed.agencies,
      services: parsed.services ?? seed.services,
      enquiries: parsed.enquiries ?? [],
      settings: parsed.settings ?? seed.settings,
    };
  } catch {
    return seedStore();
  }
}

function saveLocal(store: LocalStore) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event("anngan-data"));
}

export function resetLocalData() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LOCAL_KEY);
  window.dispatchEvent(new Event("anngan-data"));
}

// A Firestore write that cannot reach the backend retries forever in the
// SDK and never answers, so a form would sit on "Sending..." with no error.
// Race every write against a timeout so the user gets a clear error
// instead of a stuck form. A write that lands after the timeout still
// shows up on the next reload.
function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              label +
                " timed out after " +
                ms / 1000 +
                " seconds. Check your connection and try again."
            )
          ),
        ms
      )
    ),
  ]);
}

const WRITE_TIMEOUT_MS = 15000;
const READ_TIMEOUT_MS = 8000;

// ---- Firestore helpers ----
async function readCollection<T>(name: string): Promise<T[] | null> {
  const db = await getDb();
  if (!db) return null;
  const { collection, getDocs } = await fs();
  try {
    const snap = await withTimeout(getDocs(collection(db, name)), READ_TIMEOUT_MS, "Reading " + name);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) }) as T);
  } catch {
    return null;
  }
}

// ---- Listings ----
export async function getListings(): Promise<Listing[]> {
  if (demoMode) return demoStore().listings;

  const db = await getDb();
  if (db) {
    const { collection, getDocs, query, where, doc, getDoc } = await fs();
    try {
      // Root cause of the live bug: an unfiltered getDocs(listings) is
      // denied by the published rules whenever any doc is not live,
      // because Firestore rules are not filters. The read then fell back
      // to the static 12-item seed, so Firestore-created listings never
      // showed in /admin Listings even though /properties (which uses the
      // liveStatus == 'live' query) showed them. Query by liveStatus,
      // which the rules can prove, and merge the three statuses.
      const byStatus = async (s: string): Promise<Listing[]> => {
        const snap = await withTimeout(
          getDocs(query(collection(db, "listings"), where("liveStatus", "==", s))),
          READ_TIMEOUT_MS,
          "Reading listings"
        );
        return snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) }) as Listing);
      };
      const settled = await Promise.allSettled([byStatus("live"), byStatus("pending"), byStatus("hidden")]);
      const seen = new Set<string>();
      const rows: Listing[] = [];
      for (const r of settled) {
        if (r.status !== "fulfilled") continue;
        for (const l of r.value) {
          if (!seen.has(l.id)) {
            seen.add(l.id);
            rows.push(l);
          }
        }
      }
      // Best-effort unfiltered read, merged in. A listing whose
      // liveStatus is missing or holds some other value is invisible to
      // the three by-status queries above, so it would silently vanish
      // from /admin (11 instead of 12) with no clue. The published
      // rules file now allows an office list, so when the published
      // rules allow it this catches those rows; when they deny it the
      // read fails and is ignored, exactly as before.
      try {
        const allSnap = await withTimeout(getDocs(collection(db, "listings")), READ_TIMEOUT_MS, "Reading listings");
        for (const d of allSnap.docs) {
          const l = { id: d.id, ...(d.data() as object) } as Listing;
          if (!seen.has(l.id)) {
            seen.add(l.id);
            rows.push(l);
          }
        }
      } catch {
        // Unfiltered list denied by the published rules, ignore.
      }
      if (rows.length > 0) return rows;
      // Firestore reachable but no listings. If the settings document
      // exists, the seed was uploaded and the empty result is real, so do
      // not fall back to the local seed and resurrect deleted listings.
      const seeded = await withTimeout(getDoc(doc(db, "settings", "office")), READ_TIMEOUT_MS, "Reading settings");
      if (seeded.exists()) return [];
      return loadLocal().listings;
    } catch {
      return loadLocal().listings;
    }
  }
  return loadLocal().listings;
}

// One listing by id, for /properties/[id]. Seed first, then a Firestore
// document read (public read of a live listing is allowed), then the
// local store (local test mode). Returns null when it does not exist.
export async function getListingById(id: string): Promise<Listing | null> {
  const seed = LISTINGS.find((l) => l.id === id);
  if (seed) return seed;
  if (demoMode) return null;
  const db = await getDb();
  if (db) {
    const { doc, getDoc } = await fs();
    try {
      const snap = await withTimeout(getDoc(doc(db, "listings", id)), READ_TIMEOUT_MS, "Reading listing");
      if (snap.exists()) return { id: snap.id, ...(snap.data() as object) } as Listing;
      return null;
    } catch {
      // fall through to local store below
    }
  }
  const local = loadLocal().listings.find((l) => l.id === id);
  return local || null;
}

// True when Firestore already has seed data, meaning the seed was
// uploaded. Used to hide the seed button once data is already online.
// Fixed 2026-11-22: the old version read ONLY the settings/office
// document, but that document does not exist in live Firestore (REST
// check 22 Nov: 404) even though listings, projects, blogs, services
// and agencies are all live there and the seed upload reported success,
// so the button never hid. A settings read that is denied or times out
// also used to read as "not seeded". Now seeded is true when the
// settings document exists OR any seed collection has at least one
// document. Each collection read runs in parallel and a failure of one
// read counts as "no data from that collection", never as proof the
// database is empty, so the button only shows when nothing is found.
export async function firestoreHasSeedData(
  db: Firestore,
  fns: typeof import("firebase/firestore")
): Promise<boolean> {
  const { collection, doc, getDoc, getDocs, query, where } = fns;
  const one = async <T>(p: Promise<T>, ok: (v: T) => boolean): Promise<boolean> => {
    try {
      return ok(await withTimeout(p, READ_TIMEOUT_MS, "Reading seed data"));
    } catch {
      return false;
    }
  };
  const checks: Promise<boolean>[] = [
    one(getDoc(doc(db, "settings", "office")), (s) => s.exists()),
    // Listings use the same by-liveStatus queries as getListings, because
    // the Firestore rules deny an unfiltered listings list whenever any
    // document is not live (rules are not filters).
    ...(["live", "pending", "hidden"] as const).map((s) =>
      one(
        getDocs(query(collection(db, "listings"), where("liveStatus", "==", s))),
        (snap) => snap.docs.length > 0
      )
    ),
    // The other seed collections allow public read in the rules.
    ...(["projects", "blogs", "agencies", "services"] as const).map((name) =>
      one(getDocs(collection(db, name)), (snap) => snap.docs.length > 0)
    ),
  ];
  const results = await Promise.all(checks);
  return results.some(Boolean);
}

export async function isFirestoreSeeded(): Promise<boolean> {
  if (demoMode) return false;
  const db = await getDb();
  if (!db) return false;
  try {
    return await firestoreHasSeedData(db, await fs());
  } catch {
    return false;
  }
}

// Only live, visible listings show on the public site.
// The query filters liveStatus == 'live' because the Firestore rules only
// allow public reads of live listings. An unfiltered read is denied even
// when the collection is empty, so the filter is required, not optional.
export async function getPublicListings(): Promise<Listing[]> {
  if (demoMode) return demoStore().listings.filter((l) => l.liveStatus === "live" && l.visible !== false);

  const db = await getDb();
  if (db) {
    const { collection, doc, getDoc, getDocs, query, where } = await fs();
    try {
      const snap = await withTimeout(
        getDocs(query(collection(db, "listings"), where("liveStatus", "==", "live"))),
        READ_TIMEOUT_MS,
        "Reading live listings"
      );
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) }) as Listing);
      if (rows.length > 0) return rows.filter((l) => l.visible !== false);
      // No live listings in Firestore yet. If the settings document exists,
      // the seed was uploaded and the empty result is real, so do not fall
      // back to the local seed and resurrect deleted listings. If it does
      // not exist, the seed has not been uploaded yet, so show the local
      // real seed data instead of an empty site.
      const seeded = await withTimeout(getDoc(doc(db, "settings", "office")), READ_TIMEOUT_MS, "Reading settings");
      if (seeded.exists()) return [];
      return loadLocal().listings.filter((l) => l.liveStatus === "live" && l.visible !== false);
    } catch {
      // fall through to local seed data below
    }
  }
  const all = await getListings();
  return all.filter((l) => l.liveStatus === "live" && l.visible !== false);
}

export async function saveListing(l: Listing): Promise<void> {
  if (demoMode) throw new Error("Demo mode, view only. Changes are not saved.");

  const db = await getDb();
  if (db) {
    const { doc, setDoc } = await fs();
    const { id, ...rest } = l;
    await withTimeout(setDoc(doc(db, "listings", id), rest, { merge: true }), WRITE_TIMEOUT_MS, "Saving the listing");
    return;
  }
  const store = loadLocal();
  const i = store.listings.findIndex((x) => x.id === l.id);
  if (i >= 0) store.listings[i] = l;
  else store.listings.unshift(l);
  saveLocal(store);
}

export async function deleteListing(id: string): Promise<void> {
  if (demoMode) throw new Error("Demo mode, view only. Changes are not saved.");

  const db = await getDb();
  if (db) {
    const { deleteDoc, doc } = await fs();
    await withTimeout(deleteDoc(doc(db, "listings", id)), WRITE_TIMEOUT_MS, "Deleting the listing");
    return;
  }
  const store = loadLocal();
  store.listings = store.listings.filter((x) => x.id !== id);
  saveLocal(store);
}

// ---- Projects, blogs, agencies, services ----
// Live-verification fix (23 Nov): Firestore project docs were seeded
// before lib/seed.ts gained cardImg, so a live doc has no cardImg and
// the public pages rendered p.img instead, the old Al Ghani green
// banner and the dense Global Homes flyer. The seed is the source of
// truth for the clean card photo, so merge it in whenever a loaded row
// omits it. Fields the row actually has are never overridden, and a
// row with no seed match passes through unchanged.
function mergeSeedProjects(rows: Project[]): Project[] {
  return rows.map((r) => {
    const seed = PROJECTS.find((p) => p.id === r.id);
    if (!seed) return r;
    return { ...seed, ...r, cardImg: r.cardImg || seed.cardImg, img: r.img || seed.img };
  });
}

export async function getProjects(): Promise<Project[]> {
  if (demoMode) return demoStore().projects;

  const rows = await readCollection<Project>("projects");
  if (rows && rows.length > 0) return mergeSeedProjects(rows);
  return mergeSeedProjects(loadLocal().projects);
}

export async function getBlogs(): Promise<Blog[]> {
  if (demoMode) return demoStore().blogs;

  const rows = await readCollection<Blog>("blogs");
  return rows && rows.length > 0 ? rows : loadLocal().blogs;
}

export async function getAgencies(): Promise<Agency[]> {
  if (demoMode) return demoStore().agencies;

  const rows = await readCollection<Agency>("agencies");
  return rows && rows.length > 0 ? rows : loadLocal().agencies;
}

export async function getServices(): Promise<Service[]> {
  if (demoMode) return demoStore().services;

  const rows = await readCollection<Service>("services");
  return rows && rows.length > 0 ? rows : loadLocal().services;
}

// ---- Agencies ----
export async function saveAgency(a: Agency): Promise<void> {
  if (demoMode) throw new Error("Demo mode, view only. Changes are not saved.");

  const db = await getDb();
  if (db) {
    const { doc, setDoc } = await fs();
    const { id, ...rest } = a;
    await withTimeout(setDoc(doc(db, "agencies", id), rest, { merge: true }), WRITE_TIMEOUT_MS, "Saving the agency");
    return;
  }
  const store = loadLocal();
  const i = store.agencies.findIndex((x) => x.id === a.id);
  if (i >= 0) store.agencies[i] = a;
  else store.agencies.unshift(a);
  saveLocal(store);
}

export async function deleteAgency(id: string): Promise<void> {
  if (demoMode) throw new Error("Demo mode, view only. Changes are not saved.");

  const db = await getDb();
  if (db) {
    const { deleteDoc, doc } = await fs();
    await withTimeout(deleteDoc(doc(db, "agencies", id)), WRITE_TIMEOUT_MS, "Deleting the agency");
    return;
  }
  const store = loadLocal();
  store.agencies = store.agencies.filter((x) => x.id !== id);
  saveLocal(store);
}

// FIX-01: which of the 12 real seed listings are missing from the
// loaded list, by id. The admin page shows this, so a missing listing
// is named instead of silently showing 11 of 12.
export function missingSeedListings(loaded: Listing[]): Listing[] {
  const have = new Set(loaded.map((l) => l.id));
  return LISTINGS.filter((l) => !have.has(l.id));
}

// FIX-01: restore only the missing seed listings, by id, no duplicates.
// Writes the canonical seed rows (LISTINGS), never the browser local
// store, so a polluted local store cannot re-seed a short list.
export async function restoreMissingSeedListings(missing: Listing[]): Promise<string> {
  if (missing.length === 0) return "No real listing is missing.";
  if (demoMode) throw new Error("Demo mode, view only. Changes are not saved.");
  const db = await getDb();
  if (db) {
    const { doc, setDoc } = await fs();
    for (const l of missing) {
      const { id, ...rest } = l;
      await withTimeout(setDoc(doc(db, "listings", id), rest), WRITE_TIMEOUT_MS, "Restoring the listing");
    }
  } else {
    const store = loadLocal();
    for (const l of missing) {
      if (!store.listings.some((x) => x.id === l.id)) store.listings.unshift(l);
    }
    saveLocal(store);
  }
  return "Restored " + missing.length + " missing real listing" + (missing.length > 1 ? "s" : "") + ": " + missing.map((l) => l.title).join("; ");
}

// ---- Enquiries ----
export async function getEnquiries(): Promise<Enquiry[]> {
  if (demoMode) return demoStore().enquiries;

  const db = await getDb();
  if (db) {
    const { collection, getDocs, orderBy, query } = await fs();
    try {
      const snap = await withTimeout(
        getDocs(query(collection(db, "enquiries"), orderBy("date", "desc"))),
        READ_TIMEOUT_MS,
        "Reading enquiries"
      );
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) }) as Enquiry);
      return rows;
    } catch {
      return loadLocal().enquiries;
    }
  }
  return loadLocal().enquiries;
}

export async function addEnquiry(e: Omit<Enquiry, "id" | "date" | "stage"> & { stage?: Enquiry["stage"] }): Promise<Enquiry> {
  if (demoMode) throw new Error("Demo mode, view only. Changes are not saved.");
  const full: Enquiry = {
    ...e,
    id: "enq-" + Date.now().toString(36),
    date: new Date().toISOString().slice(0, 10),
    stage: e.stage || "New",
  };
  const db = await getDb();
  if (db) {
    const { doc, setDoc } = await fs();
    const { id, ...rest } = full;
    await withTimeout(setDoc(doc(db, "enquiries", id), rest), WRITE_TIMEOUT_MS, "Sending the enquiry");
    return full;
  }
  const store = loadLocal();
  store.enquiries.unshift(full);
  saveLocal(store);
  return full;
}

export async function updateEnquiryStage(id: string, stage: Enquiry["stage"], next: string): Promise<void> {
  if (demoMode) throw new Error("Demo mode, view only. Changes are not saved.");

  const db = await getDb();
  if (db) {
    const { doc, updateDoc } = await fs();
    await withTimeout(updateDoc(doc(db, "enquiries", id), { stage, next }), WRITE_TIMEOUT_MS, "Updating the enquiry");
    return;
  }
  const store = loadLocal();
  const item = store.enquiries.find((x) => x.id === id);
  if (item) {
    item.stage = stage;
    item.next = next;
  }
  saveLocal(store);
}

export async function deleteEnquiry(id: string): Promise<void> {
  if (demoMode) throw new Error("Demo mode, view only. Changes are not saved.");

  const db = await getDb();
  if (db) {
    const { deleteDoc, doc } = await fs();
    await withTimeout(deleteDoc(doc(db, "enquiries", id)), WRITE_TIMEOUT_MS, "Deleting the enquiry");
    return;
  }
  const store = loadLocal();
  store.enquiries = store.enquiries.filter((x) => x.id !== id);
  saveLocal(store);
}

// ---- Settings ----
export async function getSettings(): Promise<OfficeSettings> {
  if (demoMode) return demoStore().settings;

  const db = await getDb();
  if (db) {
    const { doc, getDoc } = await fs();
    try {
      const snap = await withTimeout(getDoc(doc(db, "settings", "office")), READ_TIMEOUT_MS, "Reading settings");
      if (snap.exists()) return { ...SETTINGS, ...(snap.data() as OfficeSettings) };
    } catch {
      // fall through to local
    }
  }
  return loadLocal().settings;
}

export async function saveSettings(s: OfficeSettings): Promise<void> {
  if (demoMode) throw new Error("Demo mode, view only. Changes are not saved.");

  const db = await getDb();
  if (db) {
    const { doc, setDoc } = await fs();
    await withTimeout(setDoc(doc(db, "settings", "office"), s, { merge: true }), WRITE_TIMEOUT_MS, "Saving the settings");
    return;
  }
  const store = loadLocal();
  store.settings = s;
  saveLocal(store);
}

// ---- Seed upload helper (used once from the dashboard when Firebase is connected) ----
export async function seedFirestore(): Promise<string> {
  if (demoMode) return "Demo mode, view only. Changes are not saved.";

  const db = await getDb();
  if (!db) return "Firebase is not connected.";
  const { doc, setDoc } = await fs();
  try {
    // FIX-01: seed from the canonical seed constants, not from the
    // browser local store. The old code seeded loadLocal(), so if the
    // local store in the seeding browser had lost a listing (a local
    // delete, a polluted store), the seed upload wrote only 11 listings
    // to Firestore and the 12th was silently missing everywhere.
    for (const l of LISTINGS) {
      const { id, ...rest } = l;
      await setDoc(doc(db, "listings", id), rest);
    }
    for (const p of PROJECTS) {
      const { id, ...rest } = p;
      await setDoc(doc(db, "projects", id), rest);
    }
    for (const b of BLOGS) {
      const { id, ...rest } = b;
      await setDoc(doc(db, "blogs", id), rest);
    }
    for (const a of AGENCIES) {
      const { id, ...rest } = a;
      await setDoc(doc(db, "agencies", id), rest);
    }
    for (const s of SERVICES) {
      const { id, ...rest } = s;
      await setDoc(doc(db, "services", id), rest);
    }
    await setDoc(doc(db, "settings", "office"), SETTINGS);
    return "Seed data uploaded to Firestore.";
  } catch (e) {
    const err = e as { message?: string; code?: string };
    return (
      "Seed upload failed: " +
      (err.code ? err.code + " : " : "") +
      (err.message || "permission denied") +
      " The signed-in user needs the Full access role in the users collection first."
    );
  }
}
