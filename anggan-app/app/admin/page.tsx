"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth";
import { DEMO_EMAIL, OFFICE_EMAILS } from "../../lib/auth-context";
import {
  getListings,
  getProjects,
  getBlogs,
  getAgencies,
  getServices,
  getEnquiries,
  getSettings,
  getOfficeUsers,
  updateOfficeUserRole,
  saveListing,
  saveProject,
  deleteProject,
  deleteListing,
  saveAgency,
  deleteAgency,
  saveService,
  deleteService,
  saveBlog,
  deleteBlog,
  saveOrder,
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
  OfficeUser,
} from "../../lib/db";
import { getSiteContent, saveSiteContent, SiteContent, DEFAULT_SITE_CONTENT, NAV_TOGGLE_LABELS } from "../../lib/siteContent";
import { Listing, Project, ProjectStatus, Blog, Agency, Service, Enquiry, OfficeSettings, HeroSlide, TeamMember, SocialLink, CityCard, SocietyGuide, CompanyCard, AboutVideo, AboutFaq, HomeSocietyChip } from "../../lib/seed";
import { ImageUploadField } from "../../components/ImageUploadField";
import { uploadConfigured } from "../../lib/upload";

type Tab = "Overview" | "Listings" | "Enquiries" | "Projects" | "Blogs" | "Agencies" | "Services" | "Hero and banners" | "About and team" | "Header and footer" | "Home page" | "Societies" | "Companies" | "Contact and legal" | "Settings" | "Staff Access";
const ALL_TABS: Tab[] = ["Overview", "Listings", "Enquiries", "Projects", "Blogs", "Agencies", "Services", "Hero and banners", "About and team", "Header and footer", "Home page", "Societies", "Companies", "Contact and legal", "Settings", "Staff Access"];

// PRO-01: the dedicated admin sidebar groups the 16 tabs into 4
// buckets, so the office finds a section without scanning 16 pills.
const TAB_GROUPS: { label: string; tabs: Tab[] }[] = [
  { label: "Operations", tabs: ["Overview", "Listings", "Enquiries"] },
  { label: "Catalog", tabs: ["Projects", "Societies", "Agencies", "Services", "Companies", "Blogs"] },
  { label: "Website CMS", tabs: ["Home page", "Hero and banners", "About and team", "Header and footer", "Contact and legal", "Settings"] },
  { label: "Office", tabs: ["Staff Access"] },
];

const PROJECT_STATUSES: ProjectStatus[] = ["Available", "Coming Soon", "Sold Out"];

const inputCls = "border border-gray-300 rounded px-3 py-2 w-full min-w-0";
const btnRed = "bg-anngan text-white px-3 py-2.5 rounded min-h-[48px] inline-flex items-center text-sm";
const btnNavy = "bg-navy text-white px-3 py-2.5 rounded min-h-[48px] inline-flex items-center text-sm";
const btnLine = "border border-navy text-navy px-3 py-2.5 rounded min-h-[48px] inline-flex items-center text-sm";

const STAGES: Enquiry["stage"][] = ["New", "Called", "Visit", "Deal Done"];

// PRO-01: one small line icon per sidebar tab, drawn in code, no
// emoji, no photos. A simple shape per section, same stroke style.
function TabIcon({ tab, size = 18 }: { tab: Tab; size?: number }) {
  const paths: Record<Tab, React.ReactNode> = {
    Overview: (<><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /><rect x="13" y="13" width="8" height="8" rx="1" /></>),
    Listings: (<><path d="M4 6h16M4 12h16M4 18h10" /></>),
    Enquiries: (<><path d="M4 5h16v11H8l-4 4V5z" /></>),
    Projects: (<><path d="M4 11 12 3l8 8" /><path d="M6 10v10h12V10" /></>),
    Blogs: (<><path d="M5 4h14v16H5z" /><path d="M9 9h6M9 13h6M9 17h4" /></>),
    Agencies: (<><circle cx="8" cy="8" r="3.5" /><circle cx="16" cy="8" r="3.5" /><path d="M3 20c0-3 2-5 5-5s5 2 5 5M11 20c0-3 2-5 5-5s5 2 5 5" /></>),
    Services: (<><path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" /></>),
    "Hero and banners": (<><rect x="3" y="4" width="18" height="12" rx="1" /><path d="M3 16l5-5 4 4 3-3 6 6" /></>),
    "About and team": (<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>),
    "Header and footer": (<><path d="M3 5h18M3 12h18M3 19h18" /></>),
    "Home page": (<><path d="M4 11 12 3l8 8" /><path d="M6 10v10h12V10" /></>),
    Societies: (<><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>),
    Companies: (<><rect x="4" y="4" width="16" height="16" rx="1" /><path d="M9 9h2M13 9h2M9 13h2M13 13h2M9 17h6" /></>),
    "Contact and legal": (<><path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></>),
    Settings: (<><circle cx="12" cy="12" r="3.5" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" /></>),
    "Staff Access": (<><rect x="4" y="10" width="16" height="10" rx="1" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>),
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      {paths[tab]}
    </svg>
  );
}

export default function AdminPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Overview");
  // FIXED SIDEBAR, 26 Nov 2026: the mobile drawer state. Desktop
  // never uses it, the sidebar is always visible there.
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [settings, setSettings] = useState<OfficeSettings | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  // Per-project admin drafts (status + card image), keyed by project
  // id, so each project row can be edited and saved on its own.
  const [projectDrafts, setProjectDrafts] = useState<Record<string, { status: ProjectStatus; cardImg: string }>>({});
  const [savingProjectId, setSavingProjectId] = useState<string | null>(null);
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
  const [confirmDelete, setConfirmDelete] = useState<{ kind: "listing" | "enquiry" | "agency" | "project" | "blog" | "service"; id: string; label: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [msgError, setMsgError] = useState(false);
  // CRUD-03: true while the first Firestore load is running. The
  // Overview shows loading skeletons instead of 0, the Seed button
  // stays hidden until loading finishes, and the missing-listings
  // warning (CRUD-05) stays hidden, so nothing flashes a false 0.
  const [loadingData, setLoadingData] = useState(true);
  // FIX-08: agency add/edit form state, same pattern as ListingForm.
  const [agencyEdit, setAgencyEdit] = useState<Agency | null>(null);
  const [showAgencyAdd, setShowAgencyAdd] = useState(false);
  // PROJECT ADD 25 Nov 2026: the office adds a project here, no code.
  const [showProjectAdd, setShowProjectAdd] = useState(false);
  const [projectEdit, setProjectEdit] = useState<Project | null>(null);
  // SERVICE EDIT 25 Nov 2026: services were display-only before.
  const [serviceEdit, setServiceEdit] = useState<Service | null>(null);
  const [showServiceAdd, setShowServiceAdd] = useState(false);
  // BLOG CRUD 25 Nov 2026: the office adds, edits and deletes posts.
  const [blogEdit, setBlogEdit] = useState<Blog | null>(null);
  const [showBlogAdd, setShowBlogAdd] = useState(false);
  // PRO-04: log a walk-in or phone lead, in a modal, never a test form.
  const [showWalkIn, setShowWalkIn] = useState(false);
  // PRO-03: the one-line photo upload notice can be dismissed.
  const [noticeDismissed, setNoticeDismissed] = useState(false);
  // CMS-04: office users, owner only (ceo@anngan.com).
  const [officeUsers, setOfficeUsers] = useState<OfficeUser[]>([]);
  // FIX-07: a success toast auto-dismisses after 5 seconds. Error
  // messages stay until closed, so a failed save is never missed.
  useEffect(() => {
    if (!msg || msgError) return;
    const t = setTimeout(() => setMsg(""), 5000);
    return () => clearTimeout(t);
  }, [msg, msgError]);

  // Save helper for the site-content tabs: one place, same toast
  // and error text everywhere, so a failed save is never silent.
  async function saveContentTab(c: SiteContent, done: string) {
    if (isDemo) { setMsg("Demo mode, view only. Changes are not saved."); return; }
    try {
      await saveSiteContent(c);
      setSiteContent(c);
      setMsgError(false);
      setMsg(done);
    } catch (err) {
      const e2 = err as { message?: string };
      setMsgError(true);
      setMsg("Could not save: " + (e2.message || "permission denied"));
    }
  }

  async function reload() {
    // Parallel, not sequential: the old version awaited 8 reads one after
    // another, so a refresh after Delete/Hide took many seconds and the
    // page looked unchanged. All reads have their own timeouts.
    setLoadingData(true);
    try {
      const [l, p, b, a, s, e, st, sd, sc] = await Promise.all([
        getListings(),
        getProjects(),
        getBlogs(),
        getAgencies(),
        getServices(),
        getEnquiries(),
        getSettings(),
        isFirestoreSeeded(),
        getSiteContent(),
      ]);
      setListings(l);
      setProjects(p);
      setBlogs(b);
      setAgencies(a);
      setServices(s);
      setEnquiries(e);
      setSettings(st);
      setSeeded(sd);
      setSiteContent(sc);
      const drafts: Record<string, { status: ProjectStatus; cardImg: string }> = {};
      for (const pr of p) drafts[pr.id] = { status: pr.status || "Available", cardImg: pr.cardImg || "" };
      setProjectDrafts(drafts);
      // CMS-04: the owner loads the staff list with the rest.
      if ((user?.email || "").toLowerCase() === "ceo@anngan.com") {
        try {
          setOfficeUsers(await getOfficeUsers());
        } catch {
          setOfficeUsers([]);
        }
      }
    } finally {
      setLoadingData(false);
    }
  }

  // OFFICE LOGIN (user order 2026-11-25): the office login is the
  // hidden /office-login page, email and password, two fixed office
  // accounts only. A signed-in account that is not one of those two
  // (for example a public seller who signed in with Google on
  // /signin) is signed straight out again here, so /admin stays
  // office only.
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/office-login");
      return;
    }
    if (!OFFICE_EMAILS.includes((user.email || "").toLowerCase())) {
      signOut();
      router.push("/office-login");
    }
  }, [loading, user, router, signOut]);

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

  // While auth resolves or the signed-out redirect runs, show a
  // branded loading screen, never a bare "Loading..." on white.
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo.png" alt="Anngan logo" className="h-12 w-auto mx-auto" />
          <div className="mx-auto mt-6 h-8 w-8 rounded-full border-4 border-slate-200 border-t-[#0a2540] animate-spin" aria-hidden="true" />
          <p className="text-sm text-gray-600 mt-4">Opening the office dashboard...</p>
        </div>
      </div>
    );
  }

  const canEdit = user.role === "Full access" || user.role === "Staff";
  // CMS-04: Staff Access is visible only to the office owner.
  const isOwner = (user.email || "").toLowerCase() === "ceo@anngan.com";
  const visibleTabs: Tab[] = ALL_TABS.filter((t) => t !== "Staff Access" || isOwner);
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
    // CRUD-02: update the row in local state at once, so Hide / Show
    // live (and Approve / Edit / Add) is visible immediately, with a
    // toast, instead of the row staying frozen until the reload.
    // If the Firestore write fails, the reload below puts the row back.
    const isHide = l.liveStatus === "hidden" || l.visible === false;
    const isShow = l.liveStatus === "live" && l.visible !== false;
    setListings((prev) => {
      if (prev.some((x) => x.id === l.id)) return prev.map((x) => (x.id === l.id ? l : x));
      return [l, ...prev];
    });
    setMsgError(false);
    if (isHide) setMsg("Listing hidden. It is gone from the public site.");
    else if (isShow) setMsg("Listing is live on the public site.");
    try {
      await saveListing(l);
      setEdit(null);
      setShowAdd(false);
      if (!isHide && !isShow) setMsg("Saved. The public site uses the same data, so it updates too.");
      else setMsg(isHide ? "Listing hidden. It is gone from the public site." : "Listing is live on the public site.");
    } catch (err) {
      const e = err as { message?: string };
      setMsgError(true);
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
    else if (target.kind === "project") setProjects((prev) => prev.filter((p) => p.id !== target.id));
    else if (target.kind === "blog") setBlogs((prev) => prev.filter((b) => b.id !== target.id));
    else if (target.kind === "service") setServices((prev) => prev.filter((s) => s.id !== target.id));
    else setEnquiries((prev) => prev.filter((e) => e.id !== target.id));
    setMsgError(false);
    setMsg("Deleting...");
    try {
      if (target.kind === "listing") await deleteListing(target.id);
      else if (target.kind === "agency") await deleteAgency(target.id);
      else if (target.kind === "project") await deleteProject(target.id);
      else if (target.kind === "blog") await deleteBlog(target.id);
      else if (target.kind === "service") await deleteService(target.id);
      else await deleteEnquiry(target.id);
      setMsgError(false);
      setMsg(target.kind === "listing" ? "Deleted. It is gone from the public site too." : target.kind === "agency" ? "Agency deleted." : target.kind === "project" ? "Project deleted. It is gone from the public site too." : target.kind === "blog" ? "Blog post deleted. It is gone from the public site too." : target.kind === "service" ? "Service deleted. It is gone from the public site too." : "Enquiry deleted.");
    } catch (err) {
      const e = err as { message?: string };
      setMsgError(true);
      setMsg(
        "Could not delete " +
          (target.kind === "listing" ? "the listing" : target.kind === "agency" ? "the agency" : target.kind === "project" ? "the project" : target.kind === "blog" ? "the blog post" : target.kind === "service" ? "the service" : "the enquiry") +
          ": " +
          (e.message || "permission denied") +
          " The signed-in user needs the Full access or Staff role. The item is still there, try again."
      );
    } finally {
      setDeletingId(null);
    }
    await reload();
  }

  // CMS-03: up/down reorder for Projects, Agencies and Services.
  // Swaps the two rows in local state at once, then saves the new
  // order, so the change is visible immediately and survives reload.
  async function moveItem(kind: "projects" | "agencies" | "services", id: string, dir: number) {
    if (isDemo) { setMsg("Demo mode, view only. Changes are not saved."); return; }
    const list = kind === "projects" ? projects : kind === "agencies" ? agencies : services;
    const i = list.findIndex((x) => x.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    if (kind === "projects") setProjects(next as Project[]);
    else if (kind === "agencies") setAgencies(next as Agency[]);
    else setServices(next as Service[]);
    try {
      await saveOrder(kind, next.map((x) => x.id));
      setMsgError(false);
      setMsg("Order saved. The public site shows the new order.");
    } catch (err) {
      const e2 = err as { message?: string };
      setMsgError(true);
      setMsg("Could not save the order: " + (e2.message || "permission denied"));
      await reload();
    }
  }

  // FIX-01: the 12 real seed listings, by id, and any that are missing
  // from the loaded list. Shown in the Listings tab, never auto-fixed.
  const missing = missingSeedListings(listings);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* PRO-01: dedicated admin shell. Slim dark-navy left sidebar,
          grouped into Operations, Catalog, Website CMS and Office,
          with icons and pending/new badges. The public header, footer
          and navbar never render here (see components/SiteChrome).
          SIDEBAR COLOUR, 26 Nov 2026 (user order): the sidebar is
          ONE constant colour, #0a2540, everywhere. No other blue is
          used inside it: group labels and the signed-in line are
          white at 60% opacity, inactive tabs are white with a white
          10% hover, the active tab is white with #0a2540 text. The
          top bar "View live site" button uses the same #0a2540, so
          the whole dashboard chrome is one navy.
          FIXED SIDEBAR, 26 Nov 2026 (user order, the sidebar was
          moving): the sidebar is position fixed, full viewport
          height, with its own scroll, so it NEVER moves when the
          main content scrolls. Desktop: always visible on the left,
          the content sits to its right (lg:pl-60 below). Mobile:
          hidden off-canvas, opens as a drawer from the menu button
          in the top bar, closes on the overlay, the close button,
          or when a tab is picked. */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileNavOpen(false)} aria-hidden="true" />
      ) : null}
      <aside className={"fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-[#0a2540] text-white p-3 transition-transform duration-200 lg:z-40 lg:w-60 lg:max-w-none " + (mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")} aria-label="Dashboard sections">
        <div className="flex items-center justify-between gap-2 shrink-0">
          <p className="px-2 pt-1 pb-2 font-bold text-base">Anngan office</p>
          <button type="button" onClick={() => setMobileNavOpen(false)} aria-label="Close dashboard menu" className="lg:hidden shrink-0 px-2 py-2 min-h-[40px] min-w-[40px] rounded-lg text-white hover:bg-white/10 inline-flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
          </button>
        </div>
        {/* The tab list alone scrolls inside the sidebar. The
            "Anngan office" header and the signed-in line never move,
            so the sidebar header can never scroll out of view. */}
        <div className="flex-1 overflow-y-auto min-h-0">
        <nav className="grid gap-4" role="tablist" aria-label="Dashboard sections">
          {TAB_GROUPS.map((g) => {
            const groupTabs = g.tabs.filter((t) => visibleTabs.includes(t));
            if (groupTabs.length === 0) return null;
            return (
              <div key={g.label}>
                <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-white/60">{g.label}</p>
                <div className="grid gap-1 mt-1">
                  {groupTabs.map((t) => (
                    <button
                      key={t}
                      role="tab"
                      aria-selected={tab === t}
                      onClick={() => { setTab(t); setMobileNavOpen(false); }}
                      className={
                        (tab === t
                          ? "bg-white text-[#0a2540] font-semibold "
                          : "text-white hover:bg-white/10 ") +
                        "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg min-h-[44px] text-sm text-left"
                      }
                    >
                      <TabIcon tab={t} />
                      <span className="flex-1 min-w-0">{t}</span>
                      {t === "Enquiries" && newEnq > 0 ? <span className="shrink-0 bg-anngan text-white text-xs font-bold rounded-full px-2 py-0.5">{newEnq} new</span> : null}
                      {t === "Listings" && pending.length > 0 ? <span className="shrink-0 bg-amber-400 text-navy text-xs font-bold rounded-full px-2 py-0.5">{pending.length} pending</span> : null}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
        </div>
        <p className="px-2 pt-3 mt-3 border-t border-white/10 text-xs text-white/60 shrink-0">Signed in as {user.email}</p>
      </aside>
      <div className="min-w-0 lg:pl-60 px-4 md:px-6 py-4 sm:py-6">
      {/* PRO-01: clean top bar with breadcrumb, View live site link,
          signed-in user pill and Sign out. On mobile the menu button
          opens the fixed sidebar drawer. */}
      <div className="flex flex-wrap items-center gap-2 justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
        <button type="button" onClick={() => setMobileNavOpen(true)} aria-label="Open dashboard menu" className="lg:hidden shrink-0 px-2 py-2 min-h-[40px] min-w-[40px] rounded-lg border border-gray-200 text-navy hover:bg-slate-100 inline-flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <nav aria-label="Breadcrumb" className="text-sm min-w-0">
          <span className="text-gray-600">Dashboard</span>
          <span className="text-gray-400 mx-1" aria-hidden="true">/</span>
          <span className="font-bold text-navy">{tab}</span>
        </nav>
        <div className="flex gap-2 items-center flex-wrap">
          <span className="text-sm text-navy bg-slate-100 border border-slate-200 rounded-full px-3 py-2 min-w-0 break-words">
            {user.email} · {user.role}
          </span>
          <Link href="/" className="bg-[#0a2540] text-white px-3 py-2 rounded-full min-h-[40px] inline-flex items-center text-sm font-semibold">View live site</Link>
          <button type="button" className="border border-navy text-navy px-3 py-2 rounded-full min-h-[40px] inline-flex items-center text-sm font-semibold" onClick={async () => { await signOut(); router.push("/office-login"); }}>Sign out</button>
        </div>
      </div>
      {/* PRO-03: photo upload notice, one concise dismissible line.
          It only shows while the free Cloudinary upload is not set
          up; once the cloud name and preset are set, uploads work
          and the notice is gone. */}
      {!noticeDismissed && !uploadConfigured() ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 text-sm rounded-xl px-4 py-2.5 mt-4 flex gap-3 items-start">
          <p className="flex-1 min-w-0">Photo upload is not set up yet, it needs a free Cloudinary account and upload preset. Until then, use the photo link field under each upload button.</p>
          <button type="button" onClick={() => setNoticeDismissed(true)} aria-label="Dismiss photo upload notice" className="shrink-0 px-2 py-1 rounded hover:bg-black/10 min-h-[32px] min-w-[32px] inline-flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
          </button>
        </div>
      ) : null}
      {/* OFFICE LOGIN (user order 2026-11-25): /admin is office
          only, email and password at the hidden /office-login page.
          The SIGN OUT link in the header only shows for a signed-in
          office user. */}
      {isDemo ? (
        <div className="bg-amber-100 text-amber-900 text-sm rounded p-3 mt-3 flex gap-3 items-center flex-wrap">
          <span className="flex-1 min-w-0 break-words">Demo mode, view only. Changes are not saved. Sign in with an authorized office account for the real office dashboard.</span>
          <button
            className="bg-navy text-white px-3 py-2 rounded min-h-[48px] inline-flex items-center text-sm"
            onClick={async () => { await signOut(); router.push("/office-login"); }}
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
      {/* CRUD-07: the toast is fixed at the bottom of the screen, so
          it never pushes the tab bar (or any content) up and down
          when it appears and auto-dismisses. */}
      {msg ? (
        <p role="status" className={(msgError ? "bg-red-50 text-red-900 " : "bg-green-50 text-green-900 ") + "fixed bottom-4 left-1/2 -translate-x-1/2 z-[70] w-[calc(100%-2rem)] max-w-xl text-sm rounded-lg p-3 shadow-lg flex gap-3 items-start"}>
          <span className="flex-1 min-w-0 break-words">{msg}</span>
          <button type="button" onClick={() => setMsg("")} aria-label="Close message" className="shrink-0 px-2 py-1 rounded hover:bg-black/10 min-h-[32px] min-w-[32px] inline-flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
          </button>
        </p>
      ) : null}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 mt-4">
      {tab === "Overview" && (
        <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* CRUD-03: while the first Firestore load is running, show
              loading skeletons, never a false 0. The counts only
              render once loading finishes. */}
          {loadingData ? (
            <>
              {["Live listings", "Waiting for approval", "Enquiries", "Projects", "Blogs", "Agencies"].map((label) => (
                <div key={label} className="border rounded p-4" aria-label={"Loading " + label}>
                  <p className="h-8 w-16 bg-gray-200 rounded animate-pulse" aria-hidden="true">&nbsp;</p>
                  <p className="text-gray-500 text-sm mt-2">Loading {label.toLowerCase()}...</p>
                </div>
              ))}
            </>
          ) : (
            <>
          <div className="border rounded p-4"><p className="text-2xl font-bold">{live.length}</p><p>Live listings on the public site</p></div>
          <div className="border rounded p-4"><p className="text-2xl font-bold">{pending.length}</p><p>Waiting for approval</p></div>
          {/* PRO-05: the Hidden count was missing, so Live 12 plus
              Waiting 1 never added up to the 14 in Listings by city.
              Live plus Waiting plus Hidden now equals All listings. */}
          <div className="border rounded p-4"><p className="text-2xl font-bold">{hidden.length}</p><p>Hidden listings</p></div>
          <div className="border rounded p-4"><p className="text-2xl font-bold">{enquiries.length}</p><p>Enquiries ({newEnq} new)</p></div>
          <div className="border rounded p-4"><p className="text-2xl font-bold">{projects.length}</p><p>Projects</p></div>
          <div className="border rounded p-4"><p className="text-2xl font-bold">{blogs.length}</p><p>Blogs</p></div>
          <div className="border rounded p-4"><p className="text-2xl font-bold">{agencies.length}</p><p>Agencies</p></div>
            </>
          )}
          <div className="border rounded p-4 sm:col-span-2">
            <p className="font-bold">Enquiries by stage</p>
            <p className="text-sm mt-1">{loadingData ? "Loading..." : STAGES.map((s) => `${s}: ${enquiries.filter((e) => e.stage === s).length}`).join(" | ")}</p>
          </div>
          <div className="border rounded p-4 sm:col-span-2">
            <p className="font-bold">All listings by city ({listings.length})</p>
            <p className="text-sm mt-1">
              {loadingData ? "Loading..." : ["Lahore", "Rawalpindi", "Multan", "Islamabad", "Karachi"].map((c) => `${c}: ${listings.filter((l) => l.city === c).length}`).join(" | ")}
            </p>
            {/* CRUD-03: the Seed button only appears once loading has
                finished AND the database is confirmed empty. It never
                shows while counts are still loading. */}
            {firebaseOn() && !isDemo && !seeded && !loadingData ? (
              <button className={btnNavy + " mt-3"} onClick={async () => { setMsg(await seedFirestore()); await reload(); }}>
                Upload seed data to Firestore
              </button>
            ) : null}
          </div>
          <div className="border rounded p-4 sm:col-span-2 lg:col-span-4">
            <p className="font-bold">Website content, no code needed</p>
            <p className="text-sm text-gray-600 mt-1">Change these here and they show on the live site straight away, no redeploy. Every photo field has an upload button: pick a real photo from your computer or phone. Upload works once the owner sets up the free Cloudinary account (see the notice at the top of this page). Until then the upload button says so honestly, and the photo link field below it still works: paste a link to a real photo, or a file already on the site such as /img/mgh-lake-aerial.jpg.</p>
            <div className="grid gap-2 mt-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="border rounded p-3 flex flex-col justify-between">
                <p className="font-semibold text-sm">Hero and banners</p>
                <p className="text-sm text-gray-600 mt-1">Home hero photos, title and tagline, and the banner photos behind the search panel.</p>
                <button className={btnNavy + " mt-auto self-start"} onClick={() => setTab("Hero and banners")}>Edit hero and banners</button>
              </div>
              <div className="border rounded p-3 flex flex-col justify-between">
                <p className="font-semibold text-sm">About and team</p>
                <p className="text-sm text-gray-600 mt-1">Our Story text and Our Team members on the About page.</p>
                <button className={btnNavy + " mt-auto self-start"} onClick={() => setTab("About and team")}>Edit About and team</button>
              </div>
              <div className="border rounded p-3 flex flex-col justify-between">
                <p className="font-semibold text-sm">Projects</p>
                <p className="text-sm text-gray-600 mt-1">Project status (Available, Coming Soon, Sold Out) and card photo. The status badge shows on home, /projects and the project page.</p>
                <button className={btnNavy + " mt-auto self-start"} onClick={() => setTab("Projects")}>Edit projects</button>
              </div>
              <div className="border rounded p-3 flex flex-col justify-between">
                <p className="font-semibold text-sm">Partner agencies</p>
                <p className="text-sm text-gray-600 mt-1">Agency name, logo link and website link. Agencies run in the circular strip on the home page.</p>
                <button className={btnNavy + " mt-auto self-start"} onClick={() => setTab("Agencies")}>Edit agencies</button>
              </div>
              <div className="border rounded p-3 flex flex-col justify-between">
                <p className="font-semibold text-sm">Header and footer</p>
                <p className="text-sm text-gray-600 mt-1">Social links, footer text and copyright, shown on every page.</p>
                <button className={btnNavy + " mt-auto self-start"} onClick={() => setTab("Header and footer")}>Edit header and footer</button>
              </div>
              <div className="border rounded p-3 flex flex-col justify-between">
                <p className="font-semibold text-sm">Home page</p>
                <p className="text-sm text-gray-600 mt-1">Section headings, city cards, societies strip and the MGH spotlight text.</p>
                <button className={btnNavy + " mt-auto self-start"} onClick={() => setTab("Home page")}>Edit home page</button>
              </div>
              <div className="border rounded p-3 flex flex-col justify-between">
                <p className="font-semibold text-sm">Societies, companies, contact and legal</p>
                <p className="text-sm text-gray-600 mt-1">Societies guide, group companies, contact intro and the privacy, terms and disclaimer texts.</p>
                <button className={btnNavy + " mt-auto self-start"} onClick={() => setTab("Societies")}>Edit societies</button>
              </div>
              <div className="border rounded p-3 flex flex-col justify-between">
                <p className="font-semibold text-sm">Services</p>
                <p className="text-sm text-gray-600 mt-1">Service names, short notes and the office long text on each service page.</p>
                <button className={btnNavy + " mt-auto self-start"} onClick={() => setTab("Services")}>Edit services</button>
              </div>
            </div>
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
          {/* CRUD-05: the missing-listings warning is gated behind
              !loadingData, so it never flashes a false "12 real
              listings are missing" while Firestore is still loading. */}
          {missing.length > 0 && !loadingData ? (
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
          {hidden.length > 0 ? <p className="text-sm text-gray-600 mt-2">{hidden.length} hidden listing{hidden.length === 1 ? "" : "s"} do{hidden.length === 1 ? "es" : ""} not show on the public site.</p> : null}
          {/* CRUD-04: the Create/Edit listing form opens as a centered
              modal, not at the bottom of the page below all 14 rows,
              so it is visible the moment Add listing or Edit is
              clicked. */}
          {(showAdd || edit) && canEdit ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-label={edit ? "Edit listing" : "Add listing"}>
              <div className="absolute inset-0 bg-black/50" onClick={() => { setEdit(null); setShowAdd(false); }} />
              <div className="relative bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-lg">
                <ListingForm
                  initial={edit || undefined}
                  onCancel={() => { setEdit(null); setShowAdd(false); }}
                  onSave={doSave}
                />
              </div>
            </div>
          ) : null}
        </div>
      )}

      {tab === "Enquiries" && (
        <div className="mt-4">
          <h2 className="font-bold text-lg">Enquiries ({enquiries.length})</h2>
          <p className="text-sm text-gray-600">Enquiries from the website form appear here.{canEdit ? " Change the stage as you work them." : ""}</p>
          {enquiries.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-xl p-6 mt-3 text-center bg-slate-50">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mx-auto text-gray-400">
                <path d="M4 5h16v11H8l-4 4V5z" />
                <path d="M8 9h8M8 12h5" />
              </svg>
              <p className="font-semibold mt-2">No enquiries yet</p>
              <p className="text-sm text-gray-600 mt-1">Enquiries from the website form, and walk-in or phone leads you log, will show here.</p>
            </div>
          ) : null}
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
              <button className={btnNavy} onClick={() => setShowWalkIn(true)}>Log walk-in / phone lead</button>
            </div>
          ) : null}
          {showWalkIn && canEdit ? (
            <WalkInLeadForm
              onCancel={() => setShowWalkIn(false)}
              onDone={async () => { setShowWalkIn(false); setMsg("Walk-in lead logged."); await reload(); }}
            />
          ) : null}
        </div>
      )}

      {tab === "Projects" && (
        <div className="mt-4">
          <h2 className="font-bold text-lg">Projects ({projects.length})</h2>
          <p className="text-sm text-gray-600">Status and card photo are editable here and show on the live site straight away: the status badge appears on the home project card, on /projects and on the project page. Sold Out shows a red SOLD OUT badge, Coming Soon an amber COMING SOON badge, Available shows no badge. Card photo: a file already on the site, for example global-zamzam-house-wide-v3.jpg, or a full photo link. Add a project, or delete one, the same way: it shows on the home page, /projects and its project page straight away, no code change.</p>
          {!canEdit ? <p className="text-sm text-gray-600 mt-1">Your role is View only. You can see projects but not change them.</p> : null}
          {canEdit && !showProjectAdd ? (
            <button className={btnRed + " mt-3"} onClick={() => setShowProjectAdd(true)}>Add project</button>
          ) : null}
          {(showProjectAdd || projectEdit) ? (
            <ProjectForm
              initial={projectEdit || undefined}
              onCancel={() => { setShowProjectAdd(false); setProjectEdit(null); }}
              onSave={async (p) => {
                if (isDemo) { setMsg("Demo mode, view only. Changes are not saved."); return; }
                try {
                  await saveProject(p);
                  setProjects((prev) => (prev.some((x) => x.id === p.id) ? prev.map((x) => (x.id === p.id ? p : x)) : [p, ...prev]));
                  setProjectDrafts((prev) => ({ ...prev, [p.id]: { status: p.status || "Available", cardImg: p.cardImg || "" } }));
                  const wasEdit = !!projectEdit;
                  setShowProjectAdd(false);
                  setProjectEdit(null);
                  setMsgError(false);
                  setMsg(wasEdit ? p.name + " saved." : p.name + " added. It now shows on the home page, /projects and its project page.");
                } catch (err) {
                  const e2 = err as { message?: string };
                  setMsgError(true);
                  setMsg("Could not save " + p.name + ": " + (e2.message || "permission denied"));
                }
              }}
            />
          ) : null}
          <div className="grid gap-3 mt-2">
          {projects.map((p, pi) => {
            const draft = projectDrafts[p.id] || { status: p.status || "Available", cardImg: p.cardImg || "" };
            return (
            <div key={p.id} className="border rounded p-3">
              <div className="flex gap-2 items-start justify-between">
                <p className="font-semibold">{p.name} · {p.loc}</p>
                <span className="flex gap-1 shrink-0">
                  <button type="button" disabled={!canEdit || pi === 0} onClick={() => moveItem("projects", p.id, -1)} aria-label={"Move " + p.name + " up"} title="Move up" className={btnLine + " disabled:opacity-40"}>&uarr;</button>
                  <button type="button" disabled={!canEdit || pi === projects.length - 1} onClick={() => moveItem("projects", p.id, 1)} aria-label={"Move " + p.name + " down"} title="Move down" className={btnLine + " disabled:opacity-40"}>&darr;</button>
                </span>
              </div>
              <p className="text-sm text-gray-600">{p.note}</p>
              <div className="grid gap-3 mt-3 sm:grid-cols-[180px_1fr] items-start">
                <label className="text-sm font-semibold">Status
                  <select
                    value={draft.status}
                    disabled={!canEdit}
                    onChange={(e) => setProjectDrafts((prev) => ({ ...prev, [p.id]: { ...draft, status: e.target.value as ProjectStatus } }))}
                    aria-label={"Status for " + p.name}
                    className={inputCls + " mt-1 font-normal"}
                  >
                    {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                <div>
                  <ImageUploadField
                    value={draft.cardImg}
                    onChange={(v) => setProjectDrafts((prev) => ({ ...prev, [p.id]: { ...draft, cardImg: v } }))}
                    folder="projects"
                    label={"Card photo for " + p.name}
                    disabled={!canEdit}
                  />
                </div>
              </div>
              {canEdit ? (
                <div className="flex gap-2 mt-3 flex-wrap">
                  <button
                    type="button"
                    className={btnLine}
                    onClick={() => { setShowProjectAdd(false); setProjectEdit(p); }}
                  >
                    Edit
                  </button>
                  <button
                    className={btnNavy}
                    disabled={savingProjectId === p.id}
                    onClick={async () => {
                      if (isDemo) { setMsg("Demo mode, view only. Changes are not saved."); return; }
                      setSavingProjectId(p.id);
                      setMsgError(false);
                      try {
                        const updated: Project = { ...p, status: draft.status, cardImg: draft.cardImg.trim() || undefined };
                        await saveProject(updated);
                        setProjects((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
                        setMsg(p.name + " saved. Status " + draft.status + " now shows on the home card, /projects and the project page.");
                      } catch (err) {
                        const e2 = err as { message?: string };
                        setMsgError(true);
                        setMsg("Could not save " + p.name + ": " + (e2.message || "permission denied"));
                      } finally {
                        setSavingProjectId(null);
                      }
                    }}
                  >
                    {savingProjectId === p.id ? "Saving..." : "Save project"}
                  </button>
                  <button
                    type="button"
                    className={btnLine}
                    disabled={deletingId === p.id}
                    onClick={() => setConfirmDelete({ kind: "project", id: p.id, label: p.name })}
                  >
                    {deletingId === p.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              ) : null}
            </div>
            );
          })}
        </div>
        </div>
      )}

      {tab === "Blogs" && (
        <div className="mt-4">
          <h2 className="font-bold text-lg">Blogs ({blogs.length})</h2>
          <p className="text-sm text-gray-600">Post market news here, no developer needed. The 23 historic 2022-2023 articles stay exactly as they are unless you edit one. A new post shows on /blogs and its own page straight away.</p>
          {!canEdit ? <p className="text-sm text-gray-600 mt-1">Your role is View only. You can see blog posts but not change them.</p> : null}
          {canEdit && !showBlogAdd && !blogEdit ? (
            <button className={btnRed + " mt-3"} onClick={() => { setBlogEdit(null); setShowBlogAdd(true); }}>Add blog post</button>
          ) : null}
          {(showBlogAdd || blogEdit) && canEdit ? (
            <BlogForm
              initial={blogEdit || undefined}
              onCancel={() => { setShowBlogAdd(false); setBlogEdit(null); }}
              onSave={async (b) => {
                if (isDemo) { setMsg("Demo mode, view only. Changes are not saved."); return; }
                try {
                  await saveBlog(b);
                  setBlogs((prev) => (prev.some((x) => x.id === b.id) ? prev.map((x) => (x.id === b.id ? b : x)) : [b, ...prev]));
                  setShowBlogAdd(false);
                  setBlogEdit(null);
                  setMsgError(false);
                  setMsg(blogEdit ? "Blog post saved." : "Blog post added. It now shows on /blogs.");
                } catch (err) {
                  const e2 = err as { message?: string };
                  setMsgError(true);
                  setMsg("Could not save the blog post: " + (e2.message || "permission denied"));
                }
              }}
            />
          ) : null}
          <div className="grid gap-2 mt-2">
          {blogs.map((b) => (
            <div key={b.id} className="border rounded p-3 text-sm">
              <span className="text-gray-600">{b.date} · </span>
              <a href={`/blogs/${b.id}`} target="_blank" rel="noopener noreferrer" className="text-navy underline">{b.title}<span aria-hidden="true"> ↗</span><span className="sr-only"> (opens in a new tab)</span></a>
              {b.coverImg ? <span className="text-gray-600"> · Cover photo set</span> : null}
              {b.body ? <p className="text-gray-600 mt-1">{b.body.slice(0, 140)}{b.body.length > 140 ? "..." : ""}</p> : null}
              {canEdit ? (
                <span className="flex gap-2 mt-2 flex-wrap">
                  <button className={btnLine} onClick={() => { setShowBlogAdd(false); setBlogEdit(b); }}>Edit</button>
                  <button type="button" className={btnLine} disabled={deletingId === b.id} onClick={() => setConfirmDelete({ kind: "blog", id: b.id, label: b.title })}>{deletingId === b.id ? "Deleting..." : "Delete"}</button>
                </span>
              ) : null}
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
          {agencies.map((a, ai) => (
            <div key={a.id} className="border rounded p-3 flex items-center gap-3 min-w-0 flex-wrap">
              <AgencyAvatar agency={a} />
              <span className="font-semibold min-w-0 break-words flex-1">{a.name}</span>
              {canEdit ? (
                <span className="flex gap-2 shrink-0">
                  <button type="button" disabled={ai === 0} onClick={() => moveItem("agencies", a.id, -1)} aria-label={"Move " + a.name + " up"} title="Move up" className={btnLine + " disabled:opacity-40"}>&uarr;</button>
                  <button type="button" disabled={ai === agencies.length - 1} onClick={() => moveItem("agencies", a.id, 1)} aria-label={"Move " + a.name + " down"} title="Move down" className={btnLine + " disabled:opacity-40"}>&darr;</button>
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
          <p className="text-sm text-gray-600">Name, short note and the office long text on each service page. A new service gets its own page at /services/&lt;page id&gt; automatically.</p>
          {!canEdit ? <p className="text-sm text-gray-600 mt-1">Your role is View only. You can see services but not change them.</p> : null}
          {canEdit && !showServiceAdd && !serviceEdit ? (
            <button className={btnRed + " mt-3"} onClick={() => { setServiceEdit(null); setShowServiceAdd(true); }}>Add service</button>
          ) : null}
          {(showServiceAdd || serviceEdit) && canEdit ? (
            <ServiceForm
              initial={serviceEdit || undefined}
              onCancel={() => { setServiceEdit(null); setShowServiceAdd(false); }}
              onSave={async (sv) => {
                if (isDemo) { setMsg("Demo mode, view only. Changes are not saved."); return; }
                try {
                  await saveService(sv);
                  setServices((prev) => (prev.some((x) => x.id === sv.id) ? prev.map((x) => (x.id === sv.id ? sv : x)) : [sv, ...prev]));
                  setServiceEdit(null);
                  setShowServiceAdd(false);
                  setMsgError(false);
                  setMsg(sv.name + " saved. It now shows on the services list and its service page.");
                } catch (err) {
                  const e2 = err as { message?: string };
                  setMsgError(true);
                  setMsg("Could not save " + sv.name + ": " + (e2.message || "permission denied"));
                }
              }}
            />
          ) : null}
          <div className="grid gap-3 mt-2">
          {services.map((s, si) => (
            <div key={s.id} className="border rounded p-3">
              <div className="flex gap-2 items-start justify-between">
                <p className="font-semibold">{s.name}</p>
                <span className="flex gap-1 shrink-0">
                  <button type="button" disabled={!canEdit || si === 0} onClick={() => moveItem("services", s.id, -1)} aria-label={"Move " + s.name + " up"} title="Move up" className={btnLine + " disabled:opacity-40"}>&uarr;</button>
                  <button type="button" disabled={!canEdit || si === services.length - 1} onClick={() => moveItem("services", s.id, 1)} aria-label={"Move " + s.name + " down"} title="Move down" className={btnLine + " disabled:opacity-40"}>&darr;</button>
                </span>
              </div>
              <p className="text-sm text-gray-600">{s.note}</p>
              {s.details ? <p className="text-sm text-gray-600 mt-1">Office text: {s.details.slice(0, 120)}{s.details.length > 120 ? "..." : ""}</p> : null}
              <div className="flex gap-2 mt-2 flex-wrap items-center">
                <a href={`/services/${s.id}`} target="_blank" rel="noopener noreferrer" className="text-navy underline text-sm inline-block">View service<span aria-hidden="true"> ↗</span><span className="sr-only"> (opens in a new tab)</span></a>
                {canEdit ? <button className={btnLine} onClick={() => { setShowServiceAdd(false); setServiceEdit(s); }}>Edit</button> : null}
                {canEdit ? <button type="button" className={btnLine} disabled={deletingId === s.id} onClick={() => setConfirmDelete({ kind: "service", id: s.id, label: s.name })}>{deletingId === s.id ? "Deleting..." : "Delete"}</button> : null}
              </div>
            </div>
          ))}
        </div>
        </div>
      )}

      {tab === "Hero and banners" && (
        <div className="mt-4">
          <h2 className="font-bold text-lg">Hero and banners</h2>
          <p className="text-sm text-gray-600">Changes here show on the home page straight away, no code change, no redeploy. Hero photos: upload a real photo or paste a photo link, remove, or move up and down. Upload works once the free Cloudinary account is set up; until then the photo link field still works.</p>
          <HeroForm
            initial={siteContent}
            canEdit={canEdit}
            isDemo={isDemo}
            onSave={async (c) => {
              if (isDemo) { setMsg("Demo mode, view only. Changes are not saved."); return; }
              try {
                await saveSiteContent(c);
                setSiteContent(c);
                setMsgError(false);
                setMsg("Hero and banners saved. The home page shows them straight away.");
              } catch (err) {
                const e2 = err as { message?: string };
                setMsgError(true);
                setMsg("Could not save the hero and banners: " + (e2.message || "permission denied"));
              }
            }}
          />
        </div>
      )}

      {tab === "About and team" && (
        <div className="mt-4">
          <h2 className="font-bold text-lg">About and team</h2>
          <p className="text-sm text-gray-600">Changes here show on the About page straight away, no code change, no redeploy. Our Team is the main team: M. Mahmood Cheema (Chairman and Chief Executive Officer), M. Talha Mahmood (Director Call Center), M. Taha Mahmood (Head Of Administration), with real photos from the old website. Change a name, role or photo link only when the office gives the real one. Nothing is invented here. Development Team is the sub team who built this website, with a LinkedIn link per member. CEO photo: leave empty to keep the built-in photos, or set a photo link to change the CEO photo on home and About.</p>
          <AboutForm
            initial={siteContent}
            canEdit={canEdit}
            isDemo={isDemo}
            onSave={async (c) => {
              if (isDemo) { setMsg("Demo mode, view only. Changes are not saved."); return; }
              try {
                await saveSiteContent(c);
                setSiteContent(c);
                setMsgError(false);
                setMsg("About page saved. The About page shows it straight away.");
              } catch (err) {
                const e2 = err as { message?: string };
                setMsgError(true);
                setMsg("Could not save the About page: " + (e2.message || "permission denied"));
              }
            }}
          />
        </div>
      )}

      {tab === "Header and footer" && (
        <div className="mt-4">
          <h2 className="font-bold text-lg">Header and footer</h2>
          <p className="text-sm text-gray-600">Social links, footer text and copyright, shown on every page. The logo is not editable here, it stays the full original logo.</p>
          <HeaderFooterForm
            initial={siteContent}
            canEdit={canEdit}
            isDemo={isDemo}
            onSave={async (c) => { await saveContentTab(c, "Header and footer saved. The header and footer show it straight away."); }}
          />
        </div>
      )}

      {tab === "Home page" && (
        <div className="mt-4">
          <h2 className="font-bold text-lg">Home page</h2>
          <p className="text-sm text-gray-600">Section headings, the MGH spotlight text, the Browse by city cards and the Societies strip on home. City card photos are real famous-landmark photos only, never stock or AI.</p>
          <HomePageForm
            initial={siteContent}
            canEdit={canEdit}
            isDemo={isDemo}
            onSave={async (c) => { await saveContentTab(c, "Home page saved. The home page shows it straight away."); }}
          />
        </div>
      )}

      {tab === "Societies" && (
        <div className="mt-4">
          <h2 className="font-bold text-lg">Societies</h2>
          <p className="text-sm text-gray-600">The Societies guide page: title, intro and the guide cards. Only real societies and projects Anngan covers, nothing invented.</p>
          <SocietiesForm
            initial={siteContent}
            canEdit={canEdit}
            isDemo={isDemo}
            onSave={async (c) => { await saveContentTab(c, "Societies saved. The Societies guide shows it straight away."); }}
          />
        </div>
      )}

      {tab === "Companies" && (
        <div className="mt-4">
          <h2 className="font-bold text-lg">Companies</h2>
          <p className="text-sm text-gray-600">The Anngan group companies on /companies. The office band under them (address, phone, email) is edited in Settings.</p>
          <CompaniesForm
            initial={siteContent}
            canEdit={canEdit}
            isDemo={isDemo}
            onSave={async (c) => { await saveContentTab(c, "Companies saved. The Companies page shows it straight away."); }}
          />
        </div>
      )}

      {tab === "Contact and legal" && (
        <div className="mt-4">
          <h2 className="font-bold text-lg">Contact and legal</h2>
          <p className="text-sm text-gray-600">The contact page intro and the privacy, terms and disclaimer texts. The office line under each legal page (address, phone, email) is edited in Settings.</p>
          <ContactLegalForm
            initial={siteContent}
            canEdit={canEdit}
            isDemo={isDemo}
            onSave={async (c) => { await saveContentTab(c, "Contact and legal saved. The pages show it straight away."); }}
          />
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

      {tab === "Staff Access" && isOwner && (
        <StaffAccessTab
          users={officeUsers}
          currentEmail={user.email || ""}
          isDemo={isDemo}
          onRoleChange={async (id, role) => {
            if (isDemo) { setMsg("Demo mode, view only. Changes are not saved."); return; }
            try {
              await updateOfficeUserRole(id, role);
              setOfficeUsers(await getOfficeUsers());
              setMsgError(false);
              setMsg("Staff role updated.");
            } catch (err) {
              const e2 = err as { message?: string };
              setMsgError(true);
              setMsg("Could not update the staff role: " + (e2.message || "permission denied"));
            }
          }}
        />
      )}

      </div>
      </div>
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="alertdialog" aria-label={confirmDelete.kind === "listing" ? "Delete this listing?" : confirmDelete.kind === "agency" ? "Delete this agency?" : confirmDelete.kind === "project" ? "Delete this project?" : confirmDelete.kind === "blog" ? "Delete this blog post?" : confirmDelete.kind === "service" ? "Delete this service?" : "Delete this enquiry?"}>
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-lg p-5 w-full max-w-sm min-w-0">
            <h2 className="font-bold text-lg text-navy">{confirmDelete.kind === "listing" ? "Delete this listing?" : confirmDelete.kind === "agency" ? "Delete this agency?" : confirmDelete.kind === "project" ? "Delete this project?" : confirmDelete.kind === "blog" ? "Delete this blog post?" : confirmDelete.kind === "service" ? "Delete this service?" : "Delete this enquiry?"}</h2>
            <p className="text-sm text-gray-600 mt-2 break-words">
              {confirmDelete.kind === "listing"
                ? "Delete listing: " + confirmDelete.label + "? It will be gone from the public site too. This cannot be undone."
                : confirmDelete.kind === "agency"
                  ? "Delete agency: " + confirmDelete.label + "? This cannot be undone."
                  : confirmDelete.kind === "project"
                    ? "Delete project: " + confirmDelete.label + "? It will be gone from the home page, /projects and its project page too. This cannot be undone."
                    : confirmDelete.kind === "blog"
                      ? "Delete blog post: " + confirmDelete.label + "? It will be gone from /blogs too. This cannot be undone."
                      : confirmDelete.kind === "service"
                        ? "Delete service: " + confirmDelete.label + "? It will be gone from the services list and its service page too. This cannot be undone."
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

// Fixed-size agency mark. A real logo shows in a fixed 56px square
// box on a light grey tile, so a pale logo (ADARSH Associates is
// mostly light grey art) and a thin black mark (ASA) both read as a
// logo instead of a blank white slot. When no logo is stored, or the
// logo file fails to load, a navy circular monogram with the agency
// initials shows instead, so every row aligns. Logo paths verified
// 2026-11-24 against live Firestore and public/img: agency-1
// partner-adarsh.png and agency-3 partner-asa.png are correct, the
// files exist and are valid PNGs. No fake logos are invented.
function AgencyAvatar({ agency }: { agency: Agency }) {
  const [failed, setFailed] = useState(false);
  const src = agency.logoUrl || (agency.logo ? `/img/${agency.logo}` : "");
  if (!src || failed) {
    return (
      <span aria-hidden="true" className="w-14 h-14 shrink-0 rounded-full bg-navy text-white inline-flex items-center justify-center text-base font-bold">
        {agencyInitials(agency.name)}
      </span>
    );
  }
  return <img src={src} alt="" width={56} height={56} onError={() => setFailed(true)} className="w-14 h-14 shrink-0 rounded-lg object-contain bg-gray-100 border border-gray-200 p-1" />;
}

// PROJECT ADD 25 Nov 2026 (user order: the office adds and deletes
// projects in /admin, no code). A new project gets its own page at
// /projects/<id> automatically. Photo: a real photo only, file
// already on the site or a photo link; leave it empty and the card
// shows "Photo coming soon" instead of any AI image.
function ProjectForm({ initial, onCancel, onSave }: { initial?: Project; onCancel: () => void; onSave: (p: Project) => Promise<void> | void }) {
  const [name, setName] = useState(initial?.name || "");
  const [city, setCity] = useState(initial?.city || "Lahore");
  const [loc, setLoc] = useState(initial?.loc || "");
  const [note, setNote] = useState(initial?.note || "");
  const [status, setStatus] = useState<ProjectStatus>(initial?.status || "Available");
  const [img, setImg] = useState(initial?.img || "");
  const [cardImg, setCardImg] = useState(initial?.cardImg || "");
  const [details, setDetails] = useState(initial?.details || "");
  const [saving, setSaving] = useState(false);
  const [newId] = useState(() => "proj-" + Date.now().toString(36));
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true);
    Promise.resolve(onSave({
      id: initial?.id || newId,
      name: name.trim(),
      loc: loc.trim() || city,
      city,
      page: initial?.page || "",
      img: img.trim(),
      note: note.trim(),
      cardImg: cardImg.trim() || undefined,
      status,
      details: details.trim() || undefined,
    })).finally(() => setSaving(false));
  }
  return (
    <form onSubmit={submit} className="border border-navy rounded-lg p-4 mt-4 bg-white grid gap-3 w-full max-w-xl min-w-0">
      <h3 className="font-bold">{initial ? "Edit project" : "Add project"}</h3>
      <label className="text-sm font-semibold">Project name
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name, for example New City Lahore" className={inputCls + " mt-1 font-normal"} />
      </label>
      <label className="text-sm font-semibold">City
        <select value={city} onChange={(e) => setCity(e.target.value)} className={inputCls + " mt-1 font-normal"}>
          {["Lahore", "Islamabad", "Karachi", "Rawalpindi", "Multan", "Mangla", "Kashmir", "Peshawar"].map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <label className="text-sm font-semibold">Area
        <input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Area, for example Bhaini Road" className={inputCls + " mt-1 font-normal"} />
      </label>
      <label className="text-sm font-semibold">Short note
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="One line, for example 25% down, 3-year installments" className={inputCls + " mt-1 font-normal"} />
      </label>
      <label className="text-sm font-semibold">Status
        <select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)} className={inputCls + " mt-1 font-normal"}>
          {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
      <div>
        <ImageUploadField value={img} onChange={setImg} folder="projects" label="Main photo, real photo only, optional" />
      </div>
      <div>
        <ImageUploadField value={cardImg} onChange={setCardImg} folder="projects" label="Card photo, optional, leave empty to use the main photo" />
      </div>
      <p className="text-sm text-gray-600">No photo, no problem: leave the photo empty and the card shows Photo coming soon. Never use an AI image.</p>
      <label className="text-sm font-semibold">Office text, shown on the project page under From the office
        <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={4} placeholder="Long text the office wants on this project page, blank line starts a new paragraph" className={inputCls + " mt-1 font-normal"} />
      </label>
      <div className="flex gap-2 flex-wrap">
        <button type="submit" disabled={saving} className={btnRed + " disabled:opacity-50"}>{saving ? "Saving..." : initial ? "Save project" : "Add project"}</button>
        <button type="button" onClick={onCancel} className={btnLine}>Cancel</button>
      </div>
    </form>
  );
}

// FIX-08: agency add/edit form. Logo is a file name from the site
// (partner-*.png/jpg in public/img) or a photo link, both optional;
// a missing logo shows the navy monogram, never a fake logo.
function AgencyForm({ initial, onCancel, onSave }: { initial?: Agency; onCancel: () => void; onSave: (a: Agency) => Promise<void> | void }) {
  const [name, setName] = useState(initial?.name || "");
  const [logo, setLogo] = useState(initial?.logo || "");
  const [logoUrl, setLogoUrl] = useState(initial?.logoUrl || "");
  const [link, setLink] = useState(initial?.link || "");
  const [saving, setSaving] = useState(false);
  const [newId] = useState(() => "agency-" + Date.now().toString(36));
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true);
    Promise.resolve(onSave({ id: initial?.id || newId, name: name.trim(), logo: logo.trim(), logoUrl: logoUrl.trim() || undefined, link: link.trim() || undefined })).finally(() => setSaving(false));
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
      <div>
        <ImageUploadField value={logoUrl} onChange={setLogoUrl} folder="agencies" label="Logo upload or link, optional" />
      </div>
      <label className="text-sm font-semibold">Website link, optional
        <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Link, optional, for example https://example.com. Empty means the agency tile links to /contact." className={inputCls + " mt-1 font-normal"} />
      </label>
      <p className="text-sm text-gray-600">Leave both logo fields empty and the agency shows a navy monogram with its initials.</p>
      <div className="flex gap-2">
        <button disabled={saving} className={btnRed + " disabled:opacity-50"}>{saving ? "Saving..." : "Save agency"}</button>
        <button type="button" disabled={saving} className={btnLine + " disabled:opacity-50"} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function HeroForm({ initial, canEdit, isDemo, onSave }: { initial: SiteContent; canEdit: boolean; isDemo: boolean; onSave: (c: SiteContent) => Promise<void> | void }) {
  const [title, setTitle] = useState(initial.heroTitle);
  const [tagline, setTagline] = useState(initial.heroTagline);
  const [slides, setSlides] = useState<HeroSlide[]>(initial.heroSlides);
  const [banners, setBanners] = useState<HeroSlide[]>(initial.bannerImages);
  const [saving, setSaving] = useState(false);
  // Keep the form in sync when the dashboard reloads fresh data.
  const [loadedFor, setLoadedFor] = useState(initial);
  if (loadedFor !== initial) {
    setLoadedFor(initial);
    setTitle(initial.heroTitle);
    setTagline(initial.heroTagline);
    setSlides(initial.heroSlides);
    setBanners(initial.bannerImages);
  }
  function move(list: HeroSlide[], setList: (v: HeroSlide[]) => void, i: number, dir: number) {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    setList(next);
  }
  // PRO-06: each slide is a clean card: a header row with the slide
  // number (Slide 1, Slide 2, ...) and tidy icon buttons for Move Up,
  // Move Down and Remove, one crisp 16:9 thumbnail preview inside
  // the photo upload field, then the description.
  function slideRows(list: HeroSlide[], setList: (v: HeroSlide[]) => void, label: string) {
    const isBanner = label.toLowerCase().indexOf("banner") !== -1;
    return (
      <div>
        <p className="font-semibold text-sm">{label} ({list.length})</p>
        <div className="grid gap-3 mt-2">
          {list.map((s, i) => (
            <div key={i} className="border rounded-lg p-3 bg-white">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-sm">{isBanner ? "Banner " + (i + 1) : "Slide " + (i + 1)}</p>
                <span className="flex gap-1 shrink-0">
                  <button type="button" disabled={!canEdit || i === 0} onClick={() => move(list, setList, i, -1)} aria-label={"Move " + (isBanner ? "banner " : "slide ") + (i + 1) + " up"} title="Move up" className={btnLine + " disabled:opacity-40"}>&uarr;</button>
                  <button type="button" disabled={!canEdit || i === list.length - 1} onClick={() => move(list, setList, i, 1)} aria-label={"Move " + (isBanner ? "banner " : "slide ") + (i + 1) + " down"} title="Move down" className={btnLine + " disabled:opacity-40"}>&darr;</button>
                  <button type="button" disabled={!canEdit} onClick={() => setList(list.filter((_, j) => j !== i))} aria-label={"Remove " + (isBanner ? "banner " : "slide ") + (i + 1)} title="Remove" className={btnLine + " disabled:opacity-40"}>Remove</button>
                </span>
              </div>
              {/* One clean preview per slide: the upload field below
                  renders the single 16:9 preview. A second standalone
                  preview used to render here too, so each slide showed
                  the same photo twice. Removed 26 Nov 2026. */}
              <div className="mt-2">
                <ImageUploadField
                  value={s.src}
                  onChange={(v) => setList(list.map((x, j) => (j === i ? { ...x, src: v } : x)))}
                  folder="hero"
                  label={(isBanner ? "Banner " : "Slide ") + (i + 1) + " photo"}
                  disabled={!canEdit}
                  widePreview
                />
              </div>
              <input
                value={s.alt}
                disabled={!canEdit}
                onChange={(e) => setList(list.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))}
                placeholder="Short description, for example Mangla Lake aerial view"
                aria-label={label + " description " + (i + 1)}
                className={inputCls + " w-full mt-2"}
              />
            </div>
          ))}
        </div>
        {canEdit ? (
          <button type="button" className={btnLine + " mt-2"} onClick={() => setList([...list, { src: "", alt: "" }])}>Add a photo</button>
        ) : null}
      </div>
    );
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (saving || isDemo) return;
    setSaving(true);
    const clean = (rows: HeroSlide[]) => rows.filter((r) => r.src.trim()).map((r) => ({ src: r.src.trim(), alt: r.alt.trim() || "Anngan project photo" }));
    Promise.resolve(onSave({ ...initial, heroTitle: title.trim(), heroTagline: tagline.trim(), heroSlides: clean(slides), bannerImages: clean(banners) })).finally(() => setSaving(false));
  }
  const fieldCls = canEdit ? inputCls : inputCls + " bg-gray-100 text-gray-500 cursor-not-allowed";
  return (
    <form onSubmit={submit} className="mt-4 grid gap-4 w-full min-w-0">
      <label className="text-sm font-semibold">Hero heading
        <input value={title} disabled={!canEdit} onChange={(e) => setTitle(e.target.value)} className={fieldCls + " mt-1 font-normal"} />
      </label>
      <label className="text-sm font-semibold">Hero tagline
        <input value={tagline} disabled={!canEdit} onChange={(e) => setTagline(e.target.value)} className={fieldCls + " mt-1 font-normal"} />
      </label>
      {slideRows(slides, setSlides, "Hero photos, in order")}
      <p className="text-sm text-gray-600">Hero photos move continuously on the home page: a slow zoom and pan on the active photo, then a smooth crossfade to the next photo every 10 seconds.</p>
      {slideRows(banners, setBanners, "Banner photos, behind the search panel")}
      <p className="text-sm text-gray-600">Banner photos rotate behind the search panel on the home page, under a dark navy overlay.</p>
      {canEdit ? <button disabled={saving} className={btnRed + " w-fit disabled:opacity-50"}>{saving ? "Saving..." : "Save hero and banners"}</button> : <p className="text-sm text-gray-600">Your role is View only. You can see the hero and banners but not change them.</p>}
    </form>
  );
}

function AboutForm({ initial, canEdit, isDemo, onSave }: { initial: SiteContent; canEdit: boolean; isDemo: boolean; onSave: (c: SiteContent) => Promise<void> | void }) {
  const [story, setStory] = useState(initial.aboutStory);
  const [team, setTeam] = useState<TeamMember[]>(initial.team);
  const [techTeam, setTechTeam] = useState<TeamMember[]>(initial.techTeam);
  const [ceoPhoto, setCeoPhoto] = useState(initial.ceoPhoto);
  const [aboutIntro, setAboutIntro] = useState(initial.aboutIntro);
  const [videos, setVideos] = useState<AboutVideo[]>(initial.aboutVideos);
  const [faq, setFaq] = useState<AboutFaq[]>(initial.aboutFaq);
  const [filesImg, setFilesImg] = useState(initial.aboutFilesImg);
  const [filesNote, setFilesNote] = useState(initial.aboutFilesNote);
  const [saving, setSaving] = useState(false);
  const [loadedFor, setLoadedFor] = useState(initial);
  if (loadedFor !== initial) {
    setLoadedFor(initial);
    setStory(initial.aboutStory);
    setTeam(initial.team);
    setTechTeam(initial.techTeam);
    setCeoPhoto(initial.ceoPhoto);
    setAboutIntro(initial.aboutIntro);
    setVideos(initial.aboutVideos);
    setFaq(initial.aboutFaq);
    setFilesImg(initial.aboutFilesImg);
    setFilesNote(initial.aboutFilesNote);
  }
  function cleanMembers(list: TeamMember[]): TeamMember[] {
    return list.filter((m) => m.name.trim()).map((m) => ({
      ...m,
      name: m.name.trim(),
      role: m.role.trim(),
      photoUrl: (m.photoUrl || "").trim() || undefined,
      linkedinUrl: (m.linkedinUrl || "").trim() || undefined,
    }));
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (saving || isDemo) return;
    setSaving(true);
    const cleanVideos = videos.filter((v) => v.id.trim()).map((v) => ({ id: v.id.trim(), title: v.title.trim() || "Anngan video", views: v.views.trim(), date: v.date.trim() }));
    const cleanFaq = faq.filter((f) => f.q.trim()).map((f) => ({ q: f.q.trim(), a: f.a.trim() }));
    Promise.resolve(onSave({ ...initial, aboutStory: story.trim(), team: cleanMembers(team), techTeam: cleanMembers(techTeam), ceoPhoto: ceoPhoto.trim(), aboutIntro: aboutIntro.trim(), aboutVideos: cleanVideos, aboutFaq: cleanFaq, aboutFilesImg: filesImg.trim(), aboutFilesNote: filesNote.trim() })).finally(() => setSaving(false));
  }
  const fieldCls = canEdit ? inputCls : inputCls + " bg-gray-100 text-gray-500 cursor-not-allowed";
  return (
    <form onSubmit={submit} className="mt-4 grid gap-4 w-full min-w-0">
      <label className="text-sm font-semibold">Intro line, under the About heading
        <input value={aboutIntro} disabled={!canEdit} onChange={(e) => setAboutIntro(e.target.value)} className={fieldCls + " mt-1 font-normal"} />
      </label>
      <label className="text-sm font-semibold">Our Story
        <textarea value={story} disabled={!canEdit} onChange={(e) => setStory(e.target.value)} rows={6} className={fieldCls + " mt-1 font-normal"} />
      </label>
      <p className="text-sm text-gray-600">Blank line between paragraphs starts a new paragraph on the About page.</p>
      <div>
        <ImageUploadField value={ceoPhoto} onChange={setCeoPhoto} folder="team" label="CEO photo, optional" disabled={!canEdit} />
      </div>
      <p className="text-sm text-gray-600">Leave empty and the site keeps its built-in CEO photos (home and About). Set a photo and home and About both use it. Real photo only, no AI face.</p>
      <div>
        <p className="font-semibold text-sm">Videos on the About page ({videos.length})</p>
        <p className="text-sm text-gray-600 mt-1">Real Anngan YouTube videos only, from the @annganpk channel. Video ID is the code after watch?v= in the YouTube link.</p>
        <div className="grid gap-2 mt-2">
          {videos.map((v, i) => (
            <div key={i} className="grid gap-2 border rounded p-3 sm:grid-cols-2 items-end">
              <label className="text-sm font-semibold">Video title
                <input value={v.title} disabled={!canEdit} onChange={(e) => setVideos(videos.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} aria-label={"Video " + (i + 1) + " title"} className={fieldCls + " mt-1 font-normal"} />
              </label>
              <label className="text-sm font-semibold">YouTube video ID
                <input value={v.id} disabled={!canEdit} onChange={(e) => setVideos(videos.map((x, j) => (j === i ? { ...x, id: e.target.value } : x)))} aria-label={"Video " + (i + 1) + " ID"} placeholder="For example McDA63SyDM0" className={fieldCls + " mt-1 font-normal"} />
              </label>
              <label className="text-sm font-semibold">Views, as shown
                <input value={v.views} disabled={!canEdit} onChange={(e) => setVideos(videos.map((x, j) => (j === i ? { ...x, views: e.target.value } : x)))} aria-label={"Video " + (i + 1) + " views"} placeholder="For example 81 views" className={fieldCls + " mt-1 font-normal"} />
              </label>
              <label className="text-sm font-semibold">Date, as shown
                <input value={v.date} disabled={!canEdit} onChange={(e) => setVideos(videos.map((x, j) => (j === i ? { ...x, date: e.target.value } : x)))} aria-label={"Video " + (i + 1) + " date"} placeholder="For example 2 Mar 2024" className={fieldCls + " mt-1 font-normal"} />
              </label>
              <button type="button" disabled={!canEdit} onClick={() => setVideos(videos.filter((_, j) => j !== i))} aria-label="Remove video" className={btnLine + " disabled:opacity-40 w-fit"}>Remove</button>
            </div>
          ))}
        </div>
        {canEdit ? <button type="button" className={btnLine + " mt-2"} onClick={() => setVideos([...videos, { id: "", title: "", views: "", date: "" }])}>Add a video</button> : null}
      </div>
      <div>
        <p className="font-semibold text-sm">Questions and answers ({faq.length})</p>
        <div className="grid gap-2 mt-2">
          {faq.map((f, i) => (
            <div key={i} className="grid gap-2 border rounded p-3 items-end">
              <label className="text-sm font-semibold">Question
                <input value={f.q} disabled={!canEdit} onChange={(e) => setFaq(faq.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))} aria-label={"FAQ " + (i + 1) + " question"} className={fieldCls + " mt-1 font-normal"} />
              </label>
              <label className="text-sm font-semibold">Answer
                <textarea value={f.a} disabled={!canEdit} onChange={(e) => setFaq(faq.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))} rows={2} aria-label={"FAQ " + (i + 1) + " answer"} className={fieldCls + " mt-1 font-normal"} />
              </label>
              <button type="button" disabled={!canEdit} onClick={() => setFaq(faq.filter((_, j) => j !== i))} aria-label="Remove question" className={btnLine + " disabled:opacity-40 w-fit"}>Remove</button>
            </div>
          ))}
        </div>
        {canEdit ? <button type="button" className={btnLine + " mt-2"} onClick={() => setFaq([...faq, { q: "", a: "" }])}>Add a question</button> : null}
      </div>
      <div>
        <ImageUploadField value={filesImg} onChange={setFilesImg} folder="about" label="Files section photo, the E-STAMP allotment letter" disabled={!canEdit} />
      </div>
      <label className="text-sm font-semibold">Files section note
        <input value={filesNote} disabled={!canEdit} onChange={(e) => setFilesNote(e.target.value)} className={fieldCls + " mt-1 font-normal"} />
      </label>
      <div>
        <p className="font-semibold text-sm">Our Team ({team.length})</p>
        {team.length === 0 ? (
          <p className="text-sm text-gray-600 mt-2 border border-gray-200 rounded-lg p-3 bg-white">No team members yet. The About page says team members will be added here. Add a member only when the office gives the real name, role and photo link.</p>
        ) : null}
        <div className="grid gap-2 mt-2">
          {team.map((m, i) => (
            <div key={m.id} className="grid gap-2 border rounded p-3 sm:grid-cols-[1fr_1fr_1fr_auto] items-end">
              <label className="text-sm font-semibold">Name
                <input value={m.name} disabled={!canEdit} onChange={(e) => setTeam(team.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} aria-label={"Team member " + (i + 1) + " name"} className={fieldCls + " mt-1 font-normal"} />
              </label>
              <label className="text-sm font-semibold">Role
                <input value={m.role} disabled={!canEdit} onChange={(e) => setTeam(team.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))} aria-label={"Team member " + (i + 1) + " role"} placeholder="For example Sales Manager" className={fieldCls + " mt-1 font-normal"} />
              </label>
              <div>
                <ImageUploadField value={m.photoUrl || ""} onChange={(v) => setTeam(team.map((x, j) => (j === i ? { ...x, photoUrl: v } : x)))} folder="team" label={"Team member " + (i + 1) + " photo, optional"} disabled={!canEdit} />
              </div>
              <button type="button" disabled={!canEdit} onClick={() => setTeam(team.filter((_, j) => j !== i))} aria-label="Remove team member" className={btnLine + " disabled:opacity-40"}>Remove</button>
            </div>
          ))}
        </div>
        {canEdit ? (
          <button type="button" className={btnLine + " mt-2"} onClick={() => setTeam([...team, { id: "team-" + Date.now().toString(36), name: "", role: "", photoUrl: "" }])}>Add a team member</button>
        ) : null}
      </div>
      <div>
        <p className="font-semibold text-sm">Development Team ({techTeam.length})</p>
        <p className="text-sm text-gray-600 mt-1">The sub team who built this website, shown on the About page under Development Team. Photos are the real photos the user sent on 26 Nov 2026; a member with no photo shows a clean initials monogram until the office adds one. Photos are clear photo links only, no blurry photo, no stock or AI face.</p>
        <div className="grid gap-2 mt-2">
          {techTeam.map((m, i) => (
            <div key={m.id} className="grid gap-2 border rounded p-3 sm:grid-cols-2 items-end">
              <label className="text-sm font-semibold">Name
                <input value={m.name} disabled={!canEdit} onChange={(e) => setTechTeam(techTeam.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} aria-label={"Tech team member " + (i + 1) + " name"} className={fieldCls + " mt-1 font-normal"} />
              </label>
              <label className="text-sm font-semibold">Role
                <input value={m.role} disabled={!canEdit} onChange={(e) => setTechTeam(techTeam.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))} aria-label={"Tech team member " + (i + 1) + " role"} placeholder="For example Founder, Zepra Tech" className={fieldCls + " mt-1 font-normal"} />
              </label>
              <div>
                <ImageUploadField value={m.photoUrl || ""} onChange={(v) => setTechTeam(techTeam.map((x, j) => (j === i ? { ...x, photoUrl: v } : x)))} folder="team" label={"Tech team member " + (i + 1) + " photo, optional"} disabled={!canEdit} />
              </div>
              <label className="text-sm font-semibold">LinkedIn link, optional
                <input value={m.linkedinUrl || ""} disabled={!canEdit} onChange={(e) => setTechTeam(techTeam.map((x, j) => (j === i ? { ...x, linkedinUrl: e.target.value } : x)))} aria-label={"Tech team member " + (i + 1) + " LinkedIn link"} placeholder="https://www.linkedin.com/in/..." className={fieldCls + " mt-1 font-normal"} />
              </label>
              <button type="button" disabled={!canEdit} onClick={() => setTechTeam(techTeam.filter((_, j) => j !== i))} aria-label="Remove tech team member" className={btnLine + " disabled:opacity-40 w-fit"}>Remove</button>
            </div>
          ))}
        </div>
        {canEdit ? (
          <button type="button" className={btnLine + " mt-2"} onClick={() => setTechTeam([...techTeam, { id: "tech-" + Date.now().toString(36), name: "", role: "", photoUrl: "", linkedinUrl: "" }])}>Add a tech team member</button>
        ) : null}
      </div>
      {canEdit ? <button disabled={saving} className={btnRed + " w-fit disabled:opacity-50"}>{saving ? "Saving..." : "Save About page"}</button> : <p className="text-sm text-gray-600">Your role is View only. You can see the About page content but not change it.</p>}
    </form>
  );
}


// HEADER AND FOOTER 25 Nov 2026: social links, footer text and
// copyright, shown on every page (header top bar, footer). The logo
// is NOT editable here, it is the full original logo, never changed
// in /admin by the owner's order.
function HeaderFooterForm({ initial, canEdit, isDemo, onSave }: { initial: SiteContent; canEdit: boolean; isDemo: boolean; onSave: (c: SiteContent) => Promise<void> | void }) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initial.socialLinks);
  const [footerAbout, setFooterAbout] = useState(initial.footerAbout);
  const [footerCopyright, setFooterCopyright] = useState(initial.footerCopyright);
  const [navHidden, setNavHidden] = useState<string[]>(initial.navHidden || ["BLOGS"]);
  const [saving, setSaving] = useState(false);
  const [loadedFor, setLoadedFor] = useState(initial);
  if (loadedFor !== initial) {
    setLoadedFor(initial);
    setSocialLinks(initial.socialLinks);
    setFooterAbout(initial.footerAbout);
    setFooterCopyright(initial.footerCopyright);
    setNavHidden(initial.navHidden || ["BLOGS"]);
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (saving || isDemo) return;
    setSaving(true);
    const clean = socialLinks.filter((l) => l.href.trim()).map((l) => ({ label: l.label.trim() || "Facebook", href: l.href.trim() }));
    Promise.resolve(onSave({ ...initial, socialLinks: clean, footerAbout: footerAbout.trim(), footerCopyright: footerCopyright.trim(), navHidden })).finally(() => setSaving(false));
  }
  const fieldCls = canEdit ? inputCls : inputCls + " bg-gray-100 text-gray-500 cursor-not-allowed";
  return (
    <form onSubmit={submit} className="mt-4 grid gap-4 w-full min-w-0">
      <div>
        <p className="font-semibold text-sm">Top navbar sections</p>
        <p className="text-sm text-gray-600 mt-1">Show or hide a section in the red top navbar. HOME is always shown, so navigation can never be broken from here. BLOGS is off until you turn it on.</p>
        <div className="grid gap-2 mt-2 sm:grid-cols-2">
          {NAV_TOGGLE_LABELS.map((label) => {
            const shown = !navHidden.includes(label);
            return (
              <label key={label} className="border rounded-lg p-3 flex items-center gap-3 text-sm font-semibold cursor-pointer bg-white">
                <input
                  type="checkbox"
                  checked={shown}
                  disabled={!canEdit}
                  onChange={() => setNavHidden(shown ? [...navHidden, label] : navHidden.filter((x) => x !== label))}
                  aria-label={"Show " + label + " in the top navbar"}
                  className="w-5 h-5 accent-[#0f2440]"
                />
                <span>{label.charAt(0) + label.slice(1).toLowerCase()}</span>
                <span className="ml-auto text-xs font-normal text-gray-600">{shown ? "Shown" : "Hidden"}</span>
              </label>
            );
          })}
        </div>
      </div>
      <div>
        <p className="font-semibold text-sm">Social links ({socialLinks.length})</p>
        <p className="text-sm text-gray-600 mt-1">Shown in the header top bar and the footer, on every page. Network is the name, for example Facebook, X, LinkedIn, Instagram, YouTube. Link is the full profile URL.</p>
        <div className="grid gap-2 mt-2">
          {socialLinks.map((l, i) => (
            <div key={i} className="grid gap-2 border rounded p-3 sm:grid-cols-[160px_1fr_auto] items-end">
              <label className="text-sm font-semibold">Network
                <input value={l.label} disabled={!canEdit} onChange={(e) => setSocialLinks(socialLinks.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} aria-label={"Social link " + (i + 1) + " network"} className={fieldCls + " mt-1 font-normal"} />
              </label>
              <label className="text-sm font-semibold">Profile link
                <input value={l.href} disabled={!canEdit} onChange={(e) => setSocialLinks(socialLinks.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)))} aria-label={"Social link " + (i + 1) + " URL"} placeholder="https://www.facebook.com/annganpk" className={fieldCls + " mt-1 font-normal"} />
              </label>
              <button type="button" disabled={!canEdit} onClick={() => setSocialLinks(socialLinks.filter((_, j) => j !== i))} aria-label="Remove social link" className={btnLine + " disabled:opacity-40"}>Remove</button>
            </div>
          ))}
        </div>
        {canEdit ? <button type="button" className={btnLine + " mt-2"} onClick={() => setSocialLinks([...socialLinks, { label: "", href: "" }])}>Add a social link</button> : null}
      </div>
      <label className="text-sm font-semibold">Footer text, under the logo
        <textarea value={footerAbout} disabled={!canEdit} onChange={(e) => setFooterAbout(e.target.value)} rows={3} className={fieldCls + " mt-1 font-normal"} />
      </label>
      <label className="text-sm font-semibold">Copyright line
        <input value={footerCopyright} disabled={!canEdit} onChange={(e) => setFooterCopyright(e.target.value)} className={fieldCls + " mt-1 font-normal"} />
      </label>
      {canEdit ? <button disabled={saving} className={btnRed + " w-fit disabled:opacity-50"}>{saving ? "Saving..." : "Save header and footer"}</button> : <p className="text-sm text-gray-600">Your role is View only. You can see this but not change it.</p>}
    </form>
  );
}

// HOME PAGE 25 Nov 2026: section headings, the MGH spotlight text,
// Browse by city cards and the Societies strip on home. The city
// cards are the famous-landmark photos; change a photo only to a
// real photo of that city, never a stock or AI image.
function HomePageForm({ initial, canEdit, isDemo, onSave }: { initial: SiteContent; canEdit: boolean; isDemo: boolean; onSave: (c: SiteContent) => Promise<void> | void }) {
  const [headings, setHeadings] = useState(initial.homeHeadings);
  const [mghTitle, setMghTitle] = useState(initial.homeMghTitle);
  const [mghText, setMghText] = useState(initial.homeMghText);
  const [cityCards, setCityCards] = useState<CityCard[]>(initial.cityCards);
  const [homeSocieties, setHomeSocieties] = useState<HomeSocietyChip[]>(initial.homeSocieties);
  const [saving, setSaving] = useState(false);
  const [loadedFor, setLoadedFor] = useState(initial);
  if (loadedFor !== initial) {
    setLoadedFor(initial);
    setHeadings(initial.homeHeadings);
    setMghTitle(initial.homeMghTitle);
    setMghText(initial.homeMghText);
    setCityCards(initial.cityCards);
    setHomeSocieties(initial.homeSocieties);
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (saving || isDemo) return;
    setSaving(true);
    const cleanCards = cityCards.filter((c) => c.name.trim() && c.img.trim()).map((c) => ({ name: c.name.trim(), landmark: c.landmark.trim(), img: c.img.trim(), alt: c.alt.trim() || c.name.trim(), href: c.href.trim() || "/properties", kind: c.kind, sub: (c.sub || "").trim() || undefined, pos: c.pos || "object-top" }));
    const cleanSoc = homeSocieties.filter((c) => c.name.trim() && c.img.trim()).map((c) => ({ name: c.name.trim(), img: c.img.trim(), href: c.href.trim() || "/properties" }));
    Promise.resolve(onSave({ ...initial, homeHeadings: headings, homeMghTitle: mghTitle.trim(), homeMghText: mghText.trim(), cityCards: cleanCards, homeSocieties: cleanSoc })).finally(() => setSaving(false));
  }
  const fieldCls = canEdit ? inputCls : inputCls + " bg-gray-100 text-gray-500 cursor-not-allowed";
  const headingFields: { key: keyof typeof headings; label: string }[] = [
    { key: "browseCities", label: "Browse by city heading" },
    { key: "featured", label: "Featured Properties heading" },
    { key: "societies", label: "Societies heading" },
    { key: "partnerAgencies", label: "Partner agencies heading" },
    { key: "ourProjects", label: "Our projects heading" },
    { key: "whoIsAnngan", label: "Who is Anngan? heading" },
  ];
  return (
    <form onSubmit={submit} className="mt-4 grid gap-4 w-full min-w-0">
      <div className="grid gap-3 sm:grid-cols-2">
        {headingFields.map((f) => (
          <label key={f.key} className="text-sm font-semibold">{f.label}
            <input value={headings[f.key]} disabled={!canEdit} onChange={(e) => setHeadings({ ...headings, [f.key]: e.target.value })} className={fieldCls + " mt-1 font-normal"} />
          </label>
        ))}
      </div>
      <label className="text-sm font-semibold">MGH spotlight title, on home
        <input value={mghTitle} disabled={!canEdit} onChange={(e) => setMghTitle(e.target.value)} className={fieldCls + " mt-1 font-normal"} />
      </label>
      <label className="text-sm font-semibold">MGH spotlight text, on home
        <textarea value={mghText} disabled={!canEdit} onChange={(e) => setMghText(e.target.value)} rows={5} className={fieldCls + " mt-1 font-normal"} />
      </label>
      <p className="text-sm text-gray-600">Blank line between paragraphs starts a new paragraph on the home page.</p>
      <div>
        <p className="font-semibold text-sm">Browse by city cards ({cityCards.length})</p>
        <p className="text-sm text-gray-600 mt-1">The photo is the famous landmark of that city. Landmark shows under the city name.</p>
        <div className="grid gap-2 mt-2">
          {cityCards.map((c, i) => (
            <div key={i} className="grid gap-2 border rounded p-3 sm:grid-cols-2 items-end">
              <label className="text-sm font-semibold">City name
                <input value={c.name} disabled={!canEdit} onChange={(e) => setCityCards(cityCards.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} aria-label={"City card " + (i + 1) + " name"} className={fieldCls + " mt-1 font-normal"} />
              </label>
              <label className="text-sm font-semibold">Famous landmark, shown under the name
                <input value={c.landmark} disabled={!canEdit} onChange={(e) => setCityCards(cityCards.map((x, j) => (j === i ? { ...x, landmark: e.target.value } : x)))} aria-label={"City card " + (i + 1) + " landmark"} className={fieldCls + " mt-1 font-normal"} />
              </label>
              <div className="sm:col-span-2">
                <ImageUploadField value={c.img} onChange={(v) => setCityCards(cityCards.map((x, j) => (j === i ? { ...x, img: v } : x)))} folder="cities" label={"City card " + (i + 1) + " photo"} disabled={!canEdit} />
              </div>
              <label className="text-sm font-semibold">Link, where the card goes
                <input value={c.href} disabled={!canEdit} onChange={(e) => setCityCards(cityCards.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)))} aria-label={"City card " + (i + 1) + " link"} placeholder="/properties?city=Lahore" className={fieldCls + " mt-1 font-normal"} />
              </label>
              <label className="text-sm font-semibold">Card type
                <select value={c.kind} disabled={!canEdit} onChange={(e) => setCityCards(cityCards.map((x, j) => (j === i ? { ...x, kind: e.target.value as CityCard["kind"] } : x)))} aria-label={"City card " + (i + 1) + " type"} className={fieldCls + " mt-1 font-normal"}>
                  <option value="listings">City listings, shows the live count</option>
                  <option value="project">Project card, shows the project name</option>
                  <option value="all">All cities, shows the total count</option>
                </select>
              </label>
              <label className="text-sm font-semibold">Project name, only for a project card
                <input value={c.sub || ""} disabled={!canEdit} onChange={(e) => setCityCards(cityCards.map((x, j) => (j === i ? { ...x, sub: e.target.value } : x)))} aria-label={"City card " + (i + 1) + " project name"} placeholder="For example Kashmir Modern City" className={fieldCls + " mt-1 font-normal"} />
              </label>
              <label className="text-sm font-semibold">Photo position
                <select value={c.pos || "object-top"} disabled={!canEdit} onChange={(e) => setCityCards(cityCards.map((x, j) => (j === i ? { ...x, pos: e.target.value } : x)))} aria-label={"City card " + (i + 1) + " photo position"} className={fieldCls + " mt-1 font-normal"}>
                  {["object-top", "object-left-top", "object-center", "object-bottom"].map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
              <button type="button" disabled={!canEdit} onClick={() => setCityCards(cityCards.filter((_, j) => j !== i))} aria-label="Remove city card" className={btnLine + " disabled:opacity-40 w-fit"}>Remove</button>
            </div>
          ))}
        </div>
        {canEdit ? <button type="button" className={btnLine + " mt-2"} onClick={() => setCityCards([...cityCards, { name: "", landmark: "", img: "", alt: "", href: "/properties", kind: "listings", pos: "object-top" }])}>Add a city card</button> : null}
      </div>
      <div>
        <p className="font-semibold text-sm">Societies strip on home ({homeSocieties.length})</p>
        <div className="grid gap-2 mt-2">
          {homeSocieties.map((c, i) => (
            <div key={i} className="grid gap-2 border rounded p-3 sm:grid-cols-2 items-end">
              <label className="text-sm font-semibold">Name
                <input value={c.name} disabled={!canEdit} onChange={(e) => setHomeSocieties(homeSocieties.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} aria-label={"Society chip " + (i + 1) + " name"} className={fieldCls + " mt-1 font-normal"} />
              </label>
              <label className="text-sm font-semibold">Link, where the chip goes
                <input value={c.href} disabled={!canEdit} onChange={(e) => setHomeSocieties(homeSocieties.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)))} aria-label={"Society chip " + (i + 1) + " link"} placeholder="/properties?q=DHA or /projects/proj-1" className={fieldCls + " mt-1 font-normal"} />
              </label>
              <div className="sm:col-span-2">
                <ImageUploadField value={c.img} onChange={(v) => setHomeSocieties(homeSocieties.map((x, j) => (j === i ? { ...x, img: v } : x)))} folder="societies" label={"Society chip " + (i + 1) + " photo"} disabled={!canEdit} />
              </div>
              <button type="button" disabled={!canEdit} onClick={() => setHomeSocieties(homeSocieties.filter((_, j) => j !== i))} aria-label="Remove society chip" className={btnLine + " disabled:opacity-40 w-fit"}>Remove</button>
            </div>
          ))}
        </div>
        {canEdit ? <button type="button" className={btnLine + " mt-2"} onClick={() => setHomeSocieties([...homeSocieties, { name: "", img: "", href: "/properties" }])}>Add a society chip</button> : null}
      </div>
      {canEdit ? <button disabled={saving} className={btnRed + " w-fit disabled:opacity-50"}>{saving ? "Saving..." : "Save home page"}</button> : <p className="text-sm text-gray-600">Your role is View only. You can see this but not change it.</p>}
    </form>
  );
}

// SOCIETIES 25 Nov 2026: the Societies guide page, title, intro and
// the 6 guide cards. The guide entries are the real societies and
// projects Anngan covers, nothing invented.
function SocietiesForm({ initial, canEdit, isDemo, onSave }: { initial: SiteContent; canEdit: boolean; isDemo: boolean; onSave: (c: SiteContent) => Promise<void> | void }) {
  const [title, setTitle] = useState(initial.societiesTitle);
  const [intro, setIntro] = useState(initial.societiesIntro);
  const [guides, setGuides] = useState<SocietyGuide[]>(initial.societies);
  const [saving, setSaving] = useState(false);
  const [loadedFor, setLoadedFor] = useState(initial);
  if (loadedFor !== initial) {
    setLoadedFor(initial);
    setTitle(initial.societiesTitle);
    setIntro(initial.societiesIntro);
    setGuides(initial.societies);
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (saving || isDemo) return;
    setSaving(true);
    const clean = guides.filter((g) => g.name.trim() && g.img.trim()).map((g) => ({ name: g.name.trim(), note: g.note.trim(), href: g.href.trim() || "/properties", label: g.label.trim() || "Open", img: g.img.trim(), caption: g.caption.trim(), contain: !!g.contain }));
    Promise.resolve(onSave({ ...initial, societiesTitle: title.trim(), societiesIntro: intro.trim(), societies: clean })).finally(() => setSaving(false));
  }
  const fieldCls = canEdit ? inputCls : inputCls + " bg-gray-100 text-gray-500 cursor-not-allowed";
  return (
    <form onSubmit={submit} className="mt-4 grid gap-4 w-full min-w-0">
      <label className="text-sm font-semibold">Page title
        <input value={title} disabled={!canEdit} onChange={(e) => setTitle(e.target.value)} className={fieldCls + " mt-1 font-normal"} />
      </label>
      <label className="text-sm font-semibold">Intro line
        <input value={intro} disabled={!canEdit} onChange={(e) => setIntro(e.target.value)} className={fieldCls + " mt-1 font-normal"} />
      </label>
      <div>
        <p className="font-semibold text-sm">Societies guide ({guides.length})</p>
        <div className="grid gap-2 mt-2">
          {guides.map((g, i) => (
            <div key={i} className="grid gap-2 border rounded p-3 sm:grid-cols-2 items-end">
              <label className="text-sm font-semibold">Society name
                <input value={g.name} disabled={!canEdit} onChange={(e) => setGuides(guides.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} aria-label={"Society " + (i + 1) + " name"} className={fieldCls + " mt-1 font-normal"} />
              </label>
              <label className="text-sm font-semibold">Link, where the card goes
                <input value={g.href} disabled={!canEdit} onChange={(e) => setGuides(guides.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)))} aria-label={"Society " + (i + 1) + " link"} placeholder="/properties?q=DHA or /projects/proj-1" className={fieldCls + " mt-1 font-normal"} />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">Short description
                <input value={g.note} disabled={!canEdit} onChange={(e) => setGuides(guides.map((x, j) => (j === i ? { ...x, note: e.target.value } : x)))} aria-label={"Society " + (i + 1) + " description"} className={fieldCls + " mt-1 font-normal"} />
              </label>
              <label className="text-sm font-semibold">Button text
                <input value={g.label} disabled={!canEdit} onChange={(e) => setGuides(guides.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} aria-label={"Society " + (i + 1) + " button text"} className={fieldCls + " mt-1 font-normal"} />
              </label>
              <label className="text-sm font-semibold">Photo caption, under the photo
                <input value={g.caption} disabled={!canEdit} onChange={(e) => setGuides(guides.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)))} aria-label={"Society " + (i + 1) + " caption"} className={fieldCls + " mt-1 font-normal"} />
              </label>
              <label className="text-sm font-semibold flex items-center gap-2">Fit whole photo in the frame
                <input type="checkbox" checked={!!g.contain} disabled={!canEdit} onChange={(e) => setGuides(guides.map((x, j) => (j === i ? { ...x, contain: e.target.checked } : x)))} aria-label={"Society " + (i + 1) + " fit whole photo"} className="w-5 h-5" />
              </label>
              <div className="sm:col-span-2">
                <ImageUploadField value={g.img} onChange={(v) => setGuides(guides.map((x, j) => (j === i ? { ...x, img: v } : x)))} folder="societies" label={"Society " + (i + 1) + " photo"} disabled={!canEdit} />
              </div>
              <button type="button" disabled={!canEdit} onClick={() => setGuides(guides.filter((_, j) => j !== i))} aria-label="Remove society" className={btnLine + " disabled:opacity-40 w-fit"}>Remove</button>
            </div>
          ))}
        </div>
        {canEdit ? <button type="button" className={btnLine + " mt-2"} onClick={() => setGuides([...guides, { name: "", note: "", href: "/properties", label: "Open", img: "", caption: "", contain: false }])}>Add a society</button> : null}
      </div>
      {canEdit ? <button disabled={saving} className={btnRed + " w-fit disabled:opacity-50"}>{saving ? "Saving..." : "Save societies"}</button> : <p className="text-sm text-gray-600">Your role is View only. You can see this but not change it.</p>}
    </form>
  );
}

// COMPANIES 25 Nov 2026: the three Anngan group companies on
// /companies. The office band under them (address, phone, email)
// comes from Settings, not from here.
function CompaniesForm({ initial, canEdit, isDemo, onSave }: { initial: SiteContent; canEdit: boolean; isDemo: boolean; onSave: (c: SiteContent) => Promise<void> | void }) {
  const [companies, setCompanies] = useState<CompanyCard[]>(initial.companies);
  const [saving, setSaving] = useState(false);
  const [loadedFor, setLoadedFor] = useState(initial);
  if (loadedFor !== initial) {
    setLoadedFor(initial);
    setCompanies(initial.companies);
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (saving || isDemo) return;
    setSaving(true);
    const clean = companies.filter((c) => c.name.trim()).map((c) => ({ id: c.id || "company-" + Date.now().toString(36), name: c.name.trim(), desc: c.desc.trim(), href: c.href.trim() || "/contact", linkLabel: c.linkLabel.trim() || "Ask the team" }));
    Promise.resolve(onSave({ ...initial, companies: clean })).finally(() => setSaving(false));
  }
  const fieldCls = canEdit ? inputCls : inputCls + " bg-gray-100 text-gray-500 cursor-not-allowed";
  return (
    <form onSubmit={submit} className="mt-4 grid gap-4 w-full min-w-0">
      <div>
        <p className="font-semibold text-sm">Group companies ({companies.length})</p>
        <div className="grid gap-2 mt-2">
          {companies.map((c, i) => (
            <div key={c.id} className="grid gap-2 border rounded p-3 sm:grid-cols-2 items-end">
              <label className="text-sm font-semibold">Company name
                <input value={c.name} disabled={!canEdit} onChange={(e) => setCompanies(companies.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} aria-label={"Company " + (i + 1) + " name"} className={fieldCls + " mt-1 font-normal"} />
              </label>
              <label className="text-sm font-semibold">Button link
                <input value={c.href} disabled={!canEdit} onChange={(e) => setCompanies(companies.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)))} aria-label={"Company " + (i + 1) + " link"} placeholder="/services or tel:+923041111698" className={fieldCls + " mt-1 font-normal"} />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">Short description
                <textarea value={c.desc} disabled={!canEdit} onChange={(e) => setCompanies(companies.map((x, j) => (j === i ? { ...x, desc: e.target.value } : x)))} rows={2} aria-label={"Company " + (i + 1) + " description"} className={fieldCls + " mt-1 font-normal"} />
              </label>
              <label className="text-sm font-semibold">Button text
                <input value={c.linkLabel} disabled={!canEdit} onChange={(e) => setCompanies(companies.map((x, j) => (j === i ? { ...x, linkLabel: e.target.value } : x)))} aria-label={"Company " + (i + 1) + " button text"} className={fieldCls + " mt-1 font-normal"} />
              </label>
              <button type="button" disabled={!canEdit} onClick={() => setCompanies(companies.filter((_, j) => j !== i))} aria-label="Remove company" className={btnLine + " disabled:opacity-40 w-fit"}>Remove</button>
            </div>
          ))}
        </div>
        {canEdit ? <button type="button" className={btnLine + " mt-2"} onClick={() => setCompanies([...companies, { id: "company-" + Date.now().toString(36), name: "", desc: "", href: "/contact", linkLabel: "Ask the team" }])}>Add a company</button> : null}
      </div>
      {canEdit ? <button disabled={saving} className={btnRed + " w-fit disabled:opacity-50"}>{saving ? "Saving..." : "Save companies"}</button> : <p className="text-sm text-gray-600">Your role is View only. You can see this but not change it.</p>}
    </form>
  );
}

// CONTACT AND LEGAL 25 Nov 2026: the contact page intro and the
// privacy, terms and disclaimer texts. The office line under each
// legal page (address, phone, email) comes from Settings, not here.
function ContactLegalForm({ initial, canEdit, isDemo, onSave }: { initial: SiteContent; canEdit: boolean; isDemo: boolean; onSave: (c: SiteContent) => Promise<void> | void }) {
  const [contactIntro, setContactIntro] = useState(initial.contactIntro);
  const [legalPrivacy, setLegalPrivacy] = useState(initial.legalPrivacy);
  const [legalTerms, setLegalTerms] = useState(initial.legalTerms);
  const [legalDisclaimer, setLegalDisclaimer] = useState(initial.legalDisclaimer);
  const [saving, setSaving] = useState(false);
  const [loadedFor, setLoadedFor] = useState(initial);
  if (loadedFor !== initial) {
    setLoadedFor(initial);
    setContactIntro(initial.contactIntro);
    setLegalPrivacy(initial.legalPrivacy);
    setLegalTerms(initial.legalTerms);
    setLegalDisclaimer(initial.legalDisclaimer);
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (saving || isDemo) return;
    setSaving(true);
    Promise.resolve(onSave({ ...initial, contactIntro: contactIntro.trim(), legalPrivacy: legalPrivacy.trim(), legalTerms: legalTerms.trim(), legalDisclaimer: legalDisclaimer.trim() })).finally(() => setSaving(false));
  }
  const fieldCls = canEdit ? inputCls : inputCls + " bg-gray-100 text-gray-500 cursor-not-allowed";
  return (
    <form onSubmit={submit} className="mt-4 grid gap-4 w-full min-w-0">
      <label className="text-sm font-semibold">Contact page intro, under Talk to Anngan
        <textarea value={contactIntro} disabled={!canEdit} onChange={(e) => setContactIntro(e.target.value)} rows={3} className={fieldCls + " mt-1 font-normal"} />
      </label>
      <label className="text-sm font-semibold">Privacy policy text
        <textarea value={legalPrivacy} disabled={!canEdit} onChange={(e) => setLegalPrivacy(e.target.value)} rows={6} className={fieldCls + " mt-1 font-normal"} />
      </label>
      <label className="text-sm font-semibold">Terms of use text
        <textarea value={legalTerms} disabled={!canEdit} onChange={(e) => setLegalTerms(e.target.value)} rows={6} className={fieldCls + " mt-1 font-normal"} />
      </label>
      <label className="text-sm font-semibold">Disclaimer text
        <textarea value={legalDisclaimer} disabled={!canEdit} onChange={(e) => setLegalDisclaimer(e.target.value)} rows={6} className={fieldCls + " mt-1 font-normal"} />
      </label>
      <p className="text-sm text-gray-600">Blank line between paragraphs starts a new paragraph on the legal pages.</p>
      {canEdit ? <button disabled={saving} className={btnRed + " w-fit disabled:opacity-50"}>{saving ? "Saving..." : "Save contact and legal"}</button> : <p className="text-sm text-gray-600">Your role is View only. You can see this but not change it.</p>}
    </form>
  );
}

// SERVICE FORM 25 Nov 2026: services were display-only before. The
// office can now edit the name, short note and long office text, and
// add a new service. A new service gets its own page at
// /services/<page id> automatically; the page id is the short slug,
// for example web-design. The structured sections (What is included,
// How it works) stay from the verified service details, only for the
// 9 original services; a new service shows its name, note, office
// text and the Call and WhatsApp band.
// CMS-02: add or edit a blog post. Title, date, cover photo and a
// short body. The 23 historic 2022-2023 articles keep their own ids
// and are only changed when the office edits that one post.
function BlogForm({ initial, onCancel, onSave }: { initial?: Blog; onCancel: () => void; onSave: (b: Blog) => Promise<void> | void }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [date, setDate] = useState(initial?.date || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }));
  const [coverImg, setCoverImg] = useState(initial?.coverImg || "");
  const [body, setBody] = useState(initial?.body || "");
  const [url, setUrl] = useState(initial?.url || "");
  const [saving, setSaving] = useState(false);
  const [newId] = useState(() => "blog-" + Date.now().toString(36));
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || saving) return;
    setSaving(true);
    Promise.resolve(onSave({
      id: initial?.id || newId,
      date: date.trim() || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      title: title.trim(),
      url: url.trim() || "",
      coverImg: coverImg.trim() || undefined,
      body: body.trim() || undefined,
    })).finally(() => setSaving(false));
  }
  return (
    <form onSubmit={submit} className="border border-navy rounded-lg p-4 mt-4 bg-white grid gap-3 w-full max-w-xl min-w-0">
      <h3 className="font-bold">{initial ? "Edit blog post" : "Add blog post"}</h3>
      <label className="text-sm font-semibold">Title
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title, for example Lahore property rates this month" className={inputCls + " mt-1 font-normal"} />
      </label>
      <label className="text-sm font-semibold">Date
        <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="For example 25 Nov 2026" className={inputCls + " mt-1 font-normal"} />
      </label>
      <div>
        <ImageUploadField value={coverImg} onChange={setCoverImg} folder="blogs" label="Cover photo, real photo only, optional" />
      </div>
      <label className="text-sm font-semibold">Short body
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} placeholder="A few lines of market news, in your own words. No invented rates or facts." className={inputCls + " mt-1 font-normal"} />
      </label>
      <label className="text-sm font-semibold">Link, optional
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Link to the full story, optional, for example https://example.com/story" className={inputCls + " mt-1 font-normal"} />
      </label>
      <div className="flex gap-2 flex-wrap">
        <button type="submit" disabled={saving} className={btnRed + " disabled:opacity-50"}>{saving ? "Saving..." : initial ? "Save blog post" : "Add blog post"}</button>
        <button type="button" onClick={onCancel} className={btnLine}>Cancel</button>
      </div>
    </form>
  );
}

// CMS-04: staff access, visible only to the office owner
// (ceo@anngan.com). Lists the authorized office emails and toggles
// Full access / View only here, instead of the Firebase console.
// The owner can never lower their own role. Firestore rules allow
// the update only for the office, so a View-only user can never
// raise their own role from here or anywhere else.
function StaffAccessTab({ users, currentEmail, isDemo, onRoleChange }: { users: OfficeUser[]; currentEmail: string; isDemo: boolean; onRoleChange: (id: string, role: OfficeUser["role"]) => Promise<void> }) {
  const [savingId, setSavingId] = useState<string | null>(null);
  return (
    <div className="mt-4">
      <h2 className="font-bold text-lg">Staff access</h2>
      <p className="text-sm text-gray-600">Staff means the office people who can sign in to this dashboard at /admin. Right now the staff are: the CEO, ceo@anngan.com; the SEO, seo@anngan.com; and the owner, pakmultilinks@gmail.com. Each person is listed below with their email and their role.</p>
      <p className="text-sm text-gray-600 mt-2"><span className="font-semibold text-navy">Full access</span> means the person can add, edit and delete listings, projects, blogs and website content. <span className="font-semibold text-navy">View only</span> means the person can look at the dashboard but cannot save any change. Only the owner sees this tab, and only the owner can change a role here.</p>
      {isDemo ? <p className="text-sm text-gray-600 mt-2">Demo mode, view only. Changes are not saved.</p> : null}
      {users.length === 0 ? <p className="text-sm mt-2">No office users found yet.</p> : null}
      <div className="grid gap-3 mt-3">
        {users.map((u) => {
          const isSelf = u.email.toLowerCase() === currentEmail.toLowerCase();
          const nextRole: OfficeUser["role"] = u.role === "Full access" ? "View only" : "Full access";
          return (
            <div key={u.id} className="border rounded p-3 flex gap-2 items-center flex-wrap">
              <span className="flex-1 min-w-0">
                <span className="font-semibold block break-words">{u.email}</span>
                <span className="text-sm text-gray-600 block">{u.name || "Office user"} · {u.role}{isSelf ? " · You, the owner" : ""}</span>
              </span>
              {isSelf ? (
                <span className="text-sm text-gray-600">The owner always keeps Full access.</span>
              ) : (
                <button
                  type="button"
                  className={btnLine}
                  disabled={isDemo || savingId === u.id}
                  onClick={async () => {
                    setSavingId(u.id);
                    try {
                      await onRoleChange(u.id, nextRole);
                    } finally {
                      setSavingId(null);
                    }
                  }}
                >
                  {savingId === u.id ? "Saving..." : "Make " + (nextRole === "Full access" ? "Full access" : "View only")}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-sm text-gray-600 mt-3">New office accounts are still created in the Firebase console first (Authentication, Add user, then a users document with the role). They appear here once created.</p>
    </div>
  );
}

function ServiceForm({ initial, onCancel, onSave }: { initial?: Service; onCancel: () => void; onSave: (s: Service) => Promise<void> | void }) {
  const [name, setName] = useState(initial?.name || "");
  const [note, setNote] = useState(initial?.note || "");
  const [page, setPage] = useState(initial?.page || "");
  const [details, setDetails] = useState(initial?.details || "");
  const [saving, setSaving] = useState(false);
  const [newId] = useState(() => "service-" + Date.now().toString(36));
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true);
    const slug = (page.trim() || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")) || "service";
    Promise.resolve(onSave({
      id: initial?.id || newId,
      name: name.trim(),
      note: note.trim(),
      page: slug,
      details: details.trim() || undefined,
    })).finally(() => setSaving(false));
  }
  return (
    <form onSubmit={submit} className="border border-navy rounded-lg p-4 mt-4 bg-white grid gap-3 w-full max-w-xl min-w-0">
      <h3 className="font-bold">{initial ? "Edit service" : "Add service"}</h3>
      <label className="text-sm font-semibold">Service name
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Service name, for example Property Photography" className={inputCls + " mt-1 font-normal"} />
      </label>
      <label className="text-sm font-semibold">Short note, shown on the services list
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="One short line" className={inputCls + " mt-1 font-normal"} />
      </label>
      <label className="text-sm font-semibold">Page id, the short slug in the page link
        <input value={page} onChange={(e) => setPage(e.target.value)} placeholder="For example web-design, leave empty to make one from the name" className={inputCls + " mt-1 font-normal"} />
      </label>
      <label className="text-sm font-semibold">Office text, shown on the service page under From the office
        <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={4} placeholder="Long text the office wants on this service page, blank line starts a new paragraph" className={inputCls + " mt-1 font-normal"} />
      </label>
      <div className="flex gap-2 flex-wrap">
        <button type="submit" disabled={saving} className={btnRed + " disabled:opacity-50"}>{saving ? "Saving..." : initial ? "Save service" : "Add service"}</button>
        <button type="button" onClick={onCancel} className={btnLine}>Cancel</button>
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
      <div>
        <ImageUploadField value={REAL_PHOTOS.includes(photo) ? "" : photo} onChange={setPhoto} folder="listings" label="Photo upload or link, optional" />
      </div>
      <p className="text-sm text-gray-600">Upload works once the free Cloudinary account is set up. Until then, pick a real photo from the site above, or paste a photo link.</p>
      <div className="flex gap-2">
        <button disabled={saving} className={btnRed + " disabled:opacity-50"}>{saving ? "Saving..." : "Save listing"}</button>
        <button type="button" disabled={saving} className={btnLine + " disabled:opacity-50"} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

// PRO-04: log a real walk-in or phone lead. Realistic placeholders,
// never a test buyer. Opens as a modal, saves through addEnquiry.
function WalkInLeadForm({ onCancel, onDone }: { onCancel: () => void; onDone: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [asked, setAsked] = useState("");
  const [how, setHow] = useState("Walk-in");
  const [next, setNext] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    let ok = true;
    if (!name.trim()) { setNameErr("Enter the lead name."); ok = false; } else setNameErr("");
    if (!phone.trim()) { setPhoneErr("Enter a phone number."); ok = false; } else setPhoneErr("");
    if (!ok || saving) return;
    setSaving(true);
    try {
      await addEnquiry({ name: name.trim(), phone: phone.trim(), asked: asked.trim() || "Asked at the office", how, next: next.trim() || "Call back" });
      onDone();
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-label="Log walk-in or phone lead">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <form onSubmit={submit} noValidate className="relative bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg p-5 grid gap-3">
        <h3 className="font-bold text-lg text-navy">Log walk-in / phone lead</h3>
        <label className="text-sm font-semibold">Name
          <input value={name} onChange={(e) => { setName(e.target.value); if (nameErr) setNameErr(""); }} placeholder="Ahmed Raza" aria-invalid={!!nameErr} className={inputCls + " mt-1 font-normal"} />
          {nameErr ? <span role="alert" className="text-red-700 text-sm font-normal block mt-1">{nameErr}</span> : null}
        </label>
        <label className="text-sm font-semibold">Phone
          <input value={phone} onChange={(e) => { setPhone(e.target.value); if (phoneErr) setPhoneErr(""); }} placeholder="+92 300 1234567" inputMode="tel" aria-invalid={!!phoneErr} className={inputCls + " mt-1 font-normal"} />
          {phoneErr ? <span role="alert" className="text-red-700 text-sm font-normal block mt-1">{phoneErr}</span> : null}
        </label>
        <label className="text-sm font-semibold">What they asked for
          <input value={asked} onChange={(e) => setAsked(e.target.value)} placeholder="2-bed flat in DHA Lahore" className={inputCls + " mt-1 font-normal"} />
        </label>
        <label className="text-sm font-semibold">How they reached us
          <select value={how} onChange={(e) => setHow(e.target.value)} className={inputCls + " mt-1 font-normal"}>
            <option>Walk-in</option>
            <option>Phone</option>
            <option>WhatsApp</option>
          </select>
        </label>
        <label className="text-sm font-semibold">Next step
          <input value={next} onChange={(e) => setNext(e.target.value)} placeholder="Call back tomorrow" className={inputCls + " mt-1 font-normal"} />
        </label>
        <div className="flex gap-2 flex-wrap">
          <button type="submit" disabled={saving} className={btnRed + " disabled:opacity-50"}>{saving ? "Saving..." : "Log lead"}</button>
          <button type="button" onClick={onCancel} className={btnLine}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function SettingsForm({ initial, canEdit, onSave }: { initial: OfficeSettings; canEdit: boolean; onSave: (s: OfficeSettings) => void }) {
  const [phone, setPhone] = useState(initial.phone);
  const [whatsapp, setWhatsapp] = useState(initial.whatsapp);
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
        onSave({ ...initial, phone, whatsapp, email, address, ceo });
      }}
    >
      <h2 className="font-bold text-lg">Office settings</h2>
      <label className="text-sm">Phone<input disabled={!canEdit} value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldCls} /></label>
      <label className="text-sm">WhatsApp number, digits only, for example 923041111698<input disabled={!canEdit} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={fieldCls} /></label>
      <p className="text-sm text-gray-600">Phone shows on the header, the contact page and every Call button. WhatsApp number is the number every WhatsApp button opens. Change them here and the whole site follows.</p>
      <label className="text-sm">Email<input disabled={!canEdit} value={email} onChange={(e) => setEmail(e.target.value)} className={fieldCls} /></label>
      <label className="text-sm">Office address<input disabled={!canEdit} value={address} onChange={(e) => setAddress(e.target.value)} className={fieldCls} /></label>
      <label className="text-sm">CEO<input disabled={!canEdit} value={ceo} onChange={(e) => setCeo(e.target.value)} className={fieldCls} /></label>
      {canEdit ? <button className={btnRed + " w-fit"}>Save settings</button> : <p className="text-sm text-gray-600">Your role is View only. You can see settings but not change them.</p>}
    </form>
  );
}
