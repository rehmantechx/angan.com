// Shared data layer used by BOTH the public site and the dashboard.
// One source of truth, no second copy. When Firebase is configured it reads
// and writes Firestore. When it is not configured it reads the real seed
// data and saves changes in the browser (localStorage), with a clear notice.
import { getDb, isFirebaseConfigured } from "./firebase";

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

  const rows = await readCollection<Listing>("listings");
  if (rows && rows.length > 0) return rows;
  if (rows && rows.length === 0) return loadLocal().listings;
  return loadLocal().listings;
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
export async function getProjects(): Promise<Project[]> {
  if (demoMode) return demoStore().projects;

  const rows = await readCollection<Project>("projects");
  return rows && rows.length > 0 ? rows : loadLocal().projects;
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
    const store = loadLocal();
    for (const l of store.listings) {
      const { id, ...rest } = l;
      await setDoc(doc(db, "listings", id), rest);
    }
    for (const p of store.projects) {
      const { id, ...rest } = p;
      await setDoc(doc(db, "projects", id), rest);
    }
    for (const b of store.blogs) {
      const { id, ...rest } = b;
      await setDoc(doc(db, "blogs", id), rest);
    }
    for (const a of store.agencies) {
      const { id, ...rest } = a;
      await setDoc(doc(db, "agencies", id), rest);
    }
    for (const s of store.services) {
      const { id, ...rest } = s;
      await setDoc(doc(db, "services", id), rest);
    }
    await setDoc(doc(db, "settings", "office"), store.settings);
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
