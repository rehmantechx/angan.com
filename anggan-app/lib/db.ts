// Shared data layer used by BOTH the public site and the dashboard.
// One source of truth, no second copy. When Firebase is configured it reads
// and writes Firestore. When it is not configured it reads the real seed
// data and saves changes in the browser (localStorage), with a clear notice.
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "./firebase";
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

// ---- Firestore helpers ----
async function readCollection<T>(name: string): Promise<T[] | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const snap = await getDocs(collection(db, name));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) }) as T);
  } catch {
    return null;
  }
}

// ---- Listings ----
export async function getListings(): Promise<Listing[]> {
  const rows = await readCollection<Listing>("listings");
  if (rows && rows.length > 0) return rows;
  if (rows && rows.length === 0) return loadLocal().listings;
  return loadLocal().listings;
}

// Only live, visible listings show on the public site.
export async function getPublicListings(): Promise<Listing[]> {
  const all = await getListings();
  return all.filter((l) => l.liveStatus === "live" && l.visible !== false);
}

export async function saveListing(l: Listing): Promise<void> {
  const db = getDb();
  if (db) {
    const { id, ...rest } = l;
    await setDoc(doc(db, "listings", id), rest, { merge: true });
    return;
  }
  const store = loadLocal();
  const i = store.listings.findIndex((x) => x.id === l.id);
  if (i >= 0) store.listings[i] = l;
  else store.listings.unshift(l);
  saveLocal(store);
}

export async function deleteListing(id: string): Promise<void> {
  const db = getDb();
  if (db) {
    await deleteDoc(doc(db, "listings", id));
    return;
  }
  const store = loadLocal();
  store.listings = store.listings.filter((x) => x.id !== id);
  saveLocal(store);
}

// ---- Projects, blogs, agencies, services ----
export async function getProjects(): Promise<Project[]> {
  const rows = await readCollection<Project>("projects");
  return rows && rows.length > 0 ? rows : loadLocal().projects;
}

export async function getBlogs(): Promise<Blog[]> {
  const rows = await readCollection<Blog>("blogs");
  return rows && rows.length > 0 ? rows : loadLocal().blogs;
}

export async function getAgencies(): Promise<Agency[]> {
  const rows = await readCollection<Agency>("agencies");
  return rows && rows.length > 0 ? rows : loadLocal().agencies;
}

export async function getServices(): Promise<Service[]> {
  const rows = await readCollection<Service>("services");
  return rows && rows.length > 0 ? rows : loadLocal().services;
}

// ---- Enquiries ----
export async function getEnquiries(): Promise<Enquiry[]> {
  const db = getDb();
  if (db) {
    try {
      const snap = await getDocs(query(collection(db, "enquiries"), orderBy("date", "desc")));
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) }) as Enquiry);
      return rows;
    } catch {
      return loadLocal().enquiries;
    }
  }
  return loadLocal().enquiries;
}

export async function addEnquiry(e: Omit<Enquiry, "id" | "date" | "stage"> & { stage?: Enquiry["stage"] }): Promise<Enquiry> {
  const full: Enquiry = {
    ...e,
    id: "enq-" + Date.now().toString(36),
    date: new Date().toISOString().slice(0, 10),
    stage: e.stage || "New",
  };
  const db = getDb();
  if (db) {
    const { id, ...rest } = full;
    await setDoc(doc(db, "enquiries", id), rest);
    return full;
  }
  const store = loadLocal();
  store.enquiries.unshift(full);
  saveLocal(store);
  return full;
}

export async function updateEnquiryStage(id: string, stage: Enquiry["stage"], next: string): Promise<void> {
  const db = getDb();
  if (db) {
    await updateDoc(doc(db, "enquiries", id), { stage, next });
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
  const db = getDb();
  if (db) {
    try {
      const snap = await getDoc(doc(db, "settings", "office"));
      if (snap.exists()) return { ...SETTINGS, ...(snap.data() as OfficeSettings) };
    } catch {
      // fall through to local
    }
  }
  return loadLocal().settings;
}

export async function saveSettings(s: OfficeSettings): Promise<void> {
  const db = getDb();
  if (db) {
    await setDoc(doc(db, "settings", "office"), s, { merge: true });
    return;
  }
  const store = loadLocal();
  store.settings = s;
  saveLocal(store);
}

// ---- Seed upload helper (used once from the dashboard when Firebase is connected) ----
export async function seedFirestore(): Promise<string> {
  const db = getDb();
  if (!db) return "Firebase is not connected.";
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
}
