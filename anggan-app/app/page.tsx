"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPublicListings, getProjects, getBlogs, getSettings } from "../lib/db";
import { Listing, Project, Blog, OfficeSettings, GRAIN_MARKET, LISTINGS, PROJECTS, BLOGS, SETTINGS } from "../lib/seed";
import { ListingCard } from "../components/ListingCard";

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Multan", "Mangla", "Kashmir"];

const CITY_CARDS = [
  { city: "Karachi", href: "/properties?city=Karachi", note: "Shamsi Society flat. 1 real listing." },
  { city: "Lahore", href: "/properties?city=Lahore", note: "Head Office. Most listings and projects." },
  { city: "Islamabad", href: "/properties?city=Islamabad", note: "Kuri Road. 1 real listing." },
  { city: "Rawalpindi", href: "/properties?city=Rawalpindi", note: "Bahria Town. 2 real listings." },
  { city: "Multan", href: "/properties?city=Multan", note: "Citi Housing house. Pak China Grain Market." },
  { city: "Mangla", href: "/projects/proj-1", note: "MGH Pakistan. Lake view housing." },
  { city: "Kashmir", href: "/projects/proj-7", note: "Kashmir Modern City. Sold Out." },
  { city: "Peshawar", href: "/properties", note: "No listing yet. Call to ask." },
];

const SOCIETY_LINKS = ["DHA", "Bahria", "Paragon", "Al Kabir", "Lake City", "Citi Housing", "Shamsi"];

const TOOLS = [
  { n: 1, title: "Work out your building cost", note: "Area x rate, plus 10% if you tick it.", href: "/tools#cost" },
  { n: 2, title: "Work out your monthly loan payment", note: "Loan, years and markup in, monthly payment out.", href: "/tools#loan" },
  { n: 3, title: "Marla, Kanal and sqft, changed around", note: "1 Marla is 272.25 sqft. Change any size.", href: "/tools#area" },
  { n: 4, title: "What Anngan is asking, city by city", note: "Lowest, highest and middle price, by city.", href: "/tools#index" },
  { n: 5, title: "Know the area before you buy", note: "Short notes on DHA, Bahria, Paragon, Mangla, Multan, Karachi.", href: "/tools#guides" },
  { n: 6, title: "Find a plot or file by city and size", note: "Pick a city and a size. No match? Nearest real ones.", href: "/tools#finder" },
];

// Hero background slider, like the original anngan.com: the photo
// changes every 10 seconds, crossfade, loop. Real photos only, all
// already in the repo, no AI, no fake. No video, no new section, same
// hero, same text, same search box. Order is fixed: Mangla lake,
// Urban City, MGH Precinct 01, Bahria Sky, Kashmir Modern City.
const HERO_PHOTOS = [
  { src: "/img/mgh-lake-aerial.jpg", alt: "Mangla Lake aerial view, MGH Pakistan" },
  { src: "/img/urban-drone.jpg", alt: "Urban City, Lahore, drone view" },
  { src: "/img/mgh-precinct-01.jpg", alt: "MGH Pakistan, Precinct 01, Mangla" },
  { src: "/img/chinatown-bahria-sky.jpg", alt: "Bahria Sky, where China Town is located" },
  { src: "/img/kmc-01.jpg", alt: "Kashmir Modern City, Mirpur" },
];

function budgetOK(l: Listing, bud: string): boolean {
  if (!bud) return true;
  if (l.status === "rent") return true;
  if (bud.startsWith("Under")) return l.n < 10000000;
  if (bud.startsWith("Rs 1 to 3")) return l.n >= 10000000 && l.n < 30000000;
  if (bud.startsWith("Rs 3 to 5")) return l.n >= 30000000 && l.n < 50000000;
  return l.n >= 50000000;
}

export default function Home() {
  // Speed: show the real seed data on the first paint, do not wait for
  // Firestore. The background refresh below only replaces it when the
  // live data actually differs, so listings and images start loading
  // at once instead of after a network round trip.
  const [listings, setListings] = useState<Listing[]>(LISTINGS.filter((l) => l.liveStatus === "live" && l.visible !== false));
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [blogs, setBlogs] = useState<Blog[]>(BLOGS);
  const [settings, setSettings] = useState<OfficeSettings | null>(SETTINGS);

  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [beds, setBeds] = useState("");
  const [budget, setBudget] = useState("");
  const [searched, setSearched] = useState(false);
  const [searchNote, setSearchNote] = useState("");
  const [browse, setBrowse] = useState("homes");

  // Hero slider state. heroPrev is the photo fading out underneath,
  // hero is the one fading in, and the next photo is already rendered
  // invisible so it is downloaded before its turn comes.
  const [hero, setHero] = useState(0);
  const [heroPrev, setHeroPrev] = useState<number | null>(null);
  const [heroIn, setHeroIn] = useState(true);
  const [heroPaused, setHeroPaused] = useState(false);
  const heroRef = useRef(0);
  const heroNext = (hero + 1) % HERO_PHOTOS.length;

  function goToHero(i: number) {
    if (i === heroRef.current) return;
    setHeroPrev(heroRef.current);
    heroRef.current = i;
    setHero(i);
    setHeroIn(false);
  }

  useEffect(() => {
    // Every 10 seconds, crossfade to the next real photo, loop.
    // Paused while the mouse is over the hero, and off entirely for
    // reduced-motion users. No video, no autoplay sound.
    if (heroPaused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => goToHero((heroRef.current + 1) % HERO_PHOTOS.length), 10000);
    return () => clearInterval(id);
  }, [heroPaused]);

  useEffect(() => {
    // Start the 1 second crossfade just after the new photo mounts.
    if (heroIn) return;
    const t = setTimeout(() => setHeroIn(true), 60);
    return () => clearTimeout(t);
  }, [hero, heroIn]);

  useEffect(() => {
    // Drop the faded-out photo once the crossfade is done.
    if (heroPrev === null) return;
    const t = setTimeout(() => setHeroPrev(null), 1200);
    return () => clearTimeout(t);
  }, [heroPrev]);

  useEffect(() => {
    // Background refresh only, after the first paint AND when the
    // browser is idle, so the Firestore round trip never competes
    // with the hero, the listings or the images. Listings already
    // show from seed; live data replaces them only if it differs.
    const refresh = () => {
      getPublicListings().then((rows) => { if (rows.length > 0) setListings(rows); });
      getProjects().then((rows) => { if (rows.length > 0) setProjects(rows); });
      getBlogs().then((rows) => { if (rows.length > 0) setBlogs(rows); });
      getSettings().then(setSettings);
    };
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(refresh, { timeout: 3000 });
      return () => (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback?.(id);
    }
    const t = setTimeout(refresh, 2000);
    return () => clearTimeout(t);
  }, []);

  const sale = listings.filter((l) => l.status === "sale");
  const rent = listings.filter((l) => l.status === "rent");

  // One search, used both for the result note and for the rendered list.
  // The old code ran the same filter twice; this keeps one copy only.
  function runSearch() {
    const key = q.trim().toLowerCase();
    const hits = listings.filter((l) => {
      if (status === "sale" && l.status !== "sale") return false;
      if (status === "rent" && l.status !== "rent") return false;
      if (city && l.city !== city) return false;
      if (type && type !== "File" && l.type !== type) return false;
      if (type === "File") return false;
      if (beds) {
        if (beds === "5+") { if (l.beds < 5) return false; }
        else if (l.beds !== parseInt(beds, 10)) return false;
      }
      if (!budgetOK(l, budget)) return false;
      if (key) {
        const hay = (l.title + " " + l.loc + " " + l.city + " " + l.size + " " + l.type).toLowerCase();
        if (!hay.includes(key)) return false;
      }
      return true;
    });
    let phits = projects.filter((p) => {
      if (status === "sale" || status === "rent") return false;
      if (city && p.city !== city) return false;
      if (key) {
        const hay = (p.name + " " + p.loc + " " + p.city).toLowerCase();
        if (!hay.includes(key)) return false;
      }
      return true;
    });
    if (type === "File") phits = projects.filter((p) => p.name === "MGH Pakistan");
    return { hits, phits };
  }

  const search = useMemo(() => {
    if (!searched) return { hits: [] as Listing[], phits: [] as Project[] };
    return runSearch();
  }, [searched, listings, projects, status, q, type, city, beds, budget]);

  function doSearch() {
    const key = q.trim().toLowerCase();
    setSearched(true);
    const { hits, phits } = runSearch();
    if (hits.length || phits.length) {
      const parts: string[] = [];
      if (hits.length) parts.push(hits.length + (hits.length === 1 ? " listing" : " listings"));
      if (phits.length) parts.push(phits.length + (phits.length === 1 ? " project" : " projects"));
      let msg = "Found " + parts.join(" and ") + ".";
      if (city === "Karachi" && hits.length === 1) msg += " Karachi has only 1 real listing on anngan.com, the Shamsi Society flat below. Nearest other listings are in Lahore.";
      if (key && hits.length === 0 && phits.length > 0) msg += " No listing matched that word, but these projects did.";
      setSearchNote(msg);
    } else {
      let msg = "No exact match on anngan.com for that search. These are the nearest real listings, in Lahore. Call +92 304 1111 698 to ask about other cities.";
      if (city) msg = "No listing in " + city + " on anngan.com yet. These are the nearest real listings, in Lahore. Call +92 304 1111 698 to ask.";
      if (key && key.includes("karachi")) msg = "No Karachi listing matched that word. anngan.com has only 1 Karachi listing, the Shamsi Society flat, Rs 3,600,000. These are the nearest real listings, in Lahore.";
      setSearchNote(msg);
    }
  }

  function clearSearch() {
    setSearched(false);
    setSearchNote("");
    setQ("");
    setType("");
    setCity("");
    setBeds("");
    setBudget("");
    setStatus("all");
  }

  const searchResults = searched
    ? search.hits.length > 0 || search.phits.length > 0
      ? { listings: search.hits, projects: search.phits }
      : { listings: listings.filter((l) => l.city === "Lahore").slice(0, 3), projects: [] as Project[] }
    : { listings: [] as Listing[], projects: [] as Project[] };

  const mgh = projects.find((p) => p.id === "proj-1");
  const otherProjects = projects.filter((p) => p.id !== "proj-1");

  const tabCls = (on: boolean) =>
    "px-4 py-3 rounded font-bold text-sm min-h-[48px] inline-flex items-center " + (on ? "bg-[#005F90] text-white" : "bg-gray-200 text-navy");

  return (
    <div>
      {/* Hero, decided static version, full width. Background photo
          changes every 10 seconds, crossfade, loop, like anngan.com.
          Dark navy behind the photos plus a gradient keeps the white
          hero text and the search box readable on every photo. */}
      <section
        className="relative left-1/2 w-screen -translate-x-1/2 -mt-6 bg-navy overflow-hidden"
        onMouseEnter={() => setHeroPaused(true)}
        onMouseLeave={() => setHeroPaused(false)}
      >
        {heroPrev !== null ? (
          <Image
            key={"prev-" + heroPrev}
            src={HERO_PHOTOS[heroPrev].src}
            alt=""
            aria-hidden="true"
            fill
            quality={75}
            sizes="100vw"
            className="absolute inset-0 w-full h-full object-cover opacity-45"
          />
        ) : null}
        <Image
          key={"cur-" + hero}
          src={HERO_PHOTOS[hero].src}
          alt={HERO_PHOTOS[hero].alt}
          fill
          priority={hero === 0}
          quality={75}
          sizes="100vw"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: heroIn ? 0.45 : 0 }}
        />
        {/* Next photo, invisible, downloaded early so its turn is instant. */}
        <Image
          key={"next-" + heroNext}
          src={HERO_PHOTOS[heroNext].src}
          alt=""
          aria-hidden="true"
          fill
          quality={75}
          sizes="100vw"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/20 to-navy/60 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-4 py-8 md:py-10">
          <h1 className="text-white text-3xl md:text-4xl font-extrabold max-w-[22ch] leading-tight">
            Property for sale and rent in Pakistan
          </h1>
          <p className="text-blue-100 mt-2 max-w-[70ch]">
            Search real listings and projects from Anngan, in Karachi, Lahore, Islamabad, Rawalpindi, Multan, Mangla and Kashmir.
          </p>
          <div className="bg-white rounded-lg p-3 mt-4 shadow-xl border-t-4 border-anngan">
            <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Property status">
              <button type="button" role="tab" id="tab-all" aria-controls="search-results" aria-selected={status === "all"} className={tabCls(status === "all")} onClick={() => setStatus("all")}>All Status</button>
              <button type="button" role="tab" id="tab-sale" aria-controls="search-results" aria-selected={status === "sale"} className={tabCls(status === "sale")} onClick={() => setStatus("sale")}>For Sale</button>
              <button type="button" role="tab" id="tab-rent" aria-controls="search-results" aria-selected={status === "rent"} className={tabCls(status === "rent")} onClick={() => setStatus("rent")}>For Rent</button>
              <button type="button" role="tab" id="tab-project" aria-controls="search-results" aria-selected={status === "project"} className={tabCls(status === "project")} onClick={() => setStatus("project")}>Projects</button>
            </div>
            <div className="grid gap-3 mt-3 sm:grid-cols-2 lg:grid-cols-6 items-end">
              <div className="lg:col-span-2">
                <label htmlFor="sKey" className="text-sm font-bold text-gray-700">Search</label>
                <input id="sKey" type="text" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); doSearch(); } }} placeholder="Karachi, DHA, MGH, 10 Marla" autoComplete="off" className="w-full border border-gray-300 rounded px-3 py-2 mt-1" />
              </div>
              <div>
                <label htmlFor="sType" className="text-sm font-bold text-gray-700">Property type</label>
                <select id="sType" value={type} onChange={(e) => setType(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1">
                  <option value="">All types</option><option>House</option><option>Flat</option><option>Plot</option><option>Portion</option><option>Commercial</option><option>File</option>
                </select>
              </div>
              <div>
                <label htmlFor="sLoc" className="text-sm font-bold text-gray-700">City</label>
                <select id="sLoc" value={city} onChange={(e) => setCity(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1">
                  <option value="">All cities</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="sBed" className="text-sm font-bold text-gray-700">Bedrooms</label>
                <select id="sBed" value={beds} onChange={(e) => setBeds(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1">
                  <option value="">Any</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option>
                </select>
              </div>
              <div>
                <label htmlFor="sBud" className="text-sm font-bold text-gray-700">Budget</label>
                <select id="sBud" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1">
                  <option value="">Any budget</option><option>Under Rs 1 Crore</option><option>Rs 1 to 3 Crore</option><option>Rs 3 to 5 Crore</option><option>Rs 5 Crore +</option>
                </select>
              </div>
            </div>
            <button type="button" onClick={doSearch} className="btn btn-red px-8 mt-3 w-full sm:w-auto">
              Search
            </button>
            {searchNote ? <p className="text-sm font-semibold text-navy mt-2" role="status">{searchNote}</p> : null}
          </div>
        </div>
        <div className="absolute bottom-2 right-4 flex gap-1" aria-label="Hero photos">
          {HERO_PHOTOS.map((p, i) => (
            <button
              key={p.src}
              type="button"
              aria-label={"Show hero photo " + (i + 1) + ": " + p.alt}
              aria-current={hero === i}
              onClick={() => goToHero(i)}
              className="min-w-[24px] min-h-[24px] flex items-center justify-center"
            >
              <span className={"block w-2.5 h-2.5 rounded-full " + (hero === i ? "bg-white" : "bg-white/50")} />
            </button>
          ))}
        </div>
      </section>

      {searched ? (
        <section className="mt-8" id="search-results" role="tabpanel" aria-labelledby="tab-all">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <h2 className="text-2xl font-bold text-navy">
              Search results
              <button type="button" onClick={clearSearch} className="btn btn-outline-navy ml-3">
                Show all 12 listings
              </button>
            </h2>
            <Link href="/properties" className="text-anngan-dark font-semibold text-sm">All properties &rarr;</Link>
          </div>
          <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
            {searchResults.listings.map((l) => <ListingCard key={l.id} l={l} />)}
            {searchResults.projects.map((p) => (
              <article key={p.id} className="card border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-full">
                {p.img ? <Image src={`/img/${p.img}`} alt={p.name} width={1200} height={675} className="w-full h-48 object-cover" loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /> : (
                  <div className="w-full h-48 bg-amber-100 flex flex-col items-center justify-center text-navy text-sm font-semibold px-4 text-center">
                    <span>{p.name}</span>
                    {GRAIN_MARKET.prices.map((x) => <span key={x.size}>{x.size} {x.price}</span>)}
                    <span>No photo for this project yet</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold"><Link href={`/projects/${p.id}`} className="text-navy hover:text-anngan-dark">{p.name}</Link></h3>
                  <p className="text-gray-600 text-sm">{p.loc}</p>
                  <p className="text-sm mt-1">{p.note}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-8">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <h2 className="text-2xl font-bold text-navy">Houses and flats from Anngan</h2>
            <Link href="/properties" className="text-anngan-dark font-semibold text-sm">See all 12 &rarr;</Link>
          </div>
          <p className="text-gray-600 mt-1">
            All 12 are real Anngan listings, with a real photo and a real price.
          </p>
          <div className="flex gap-2 mt-3 flex-wrap" role="tablist" aria-label="Change the list">
            <button type="button" role="tab" id="tab-homes" aria-controls="browse-list" aria-selected={browse === "homes"} className={tabCls(browse === "homes")} onClick={() => setBrowse("homes")}>Houses and flats</button>
            <button type="button" role="tab" id="tab-plots" aria-controls="browse-list" aria-selected={browse === "plots"} className={tabCls(browse === "plots")} onClick={() => setBrowse("plots")}>Files and plots</button>
            <button type="button" role="tab" id="tab-commercial" aria-controls="browse-list" aria-selected={browse === "commercial"} className={tabCls(browse === "commercial")} onClick={() => setBrowse("commercial")}>Shops and markets</button>
          </div>
          <div id="browse-list" role="tabpanel" aria-labelledby="tab-homes">
          {browse === "homes" ? (
            <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((l) => <ListingCard key={l.id} l={l} />)}
            </div>
          ) : browse === "plots" ? (
            <article className="border border-gray-200 rounded-lg bg-white shadow-sm p-5 mt-4">
              <h3 className="font-bold text-navy text-lg">No plot listing on anngan.com right now</h3>
              <p className="text-gray-600 text-sm mt-1">Plots are sold as files and projects instead. See MGH Pakistan.</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <Link href="/projects/proj-1" className="btn btn-red">MGH Zamindar File</Link>
                <Link href="/projects" className="btn btn-navy">All projects</Link>
              </div>
            </article>
          ) : (
            <div className="grid gap-4 mt-4 sm:grid-cols-2">
              <article className="border border-gray-200 rounded-lg bg-white shadow-sm p-5">
                <h3 className="font-bold text-navy text-lg">Pak China Grain Market, Multan</h3>
                <p className="text-gray-600 text-sm mt-1">996 shops, 54 acres, Shujabad Road. 2 Marla Rs 56 Lac, 3 Marla Rs 84 Lac, 4 Marla Rs 112 Lac.</p>
                <Link href="/projects/proj-6" className="btn btn-red mt-3">View market</Link>
              </article>
              <article className="border border-gray-200 rounded-lg bg-white shadow-sm p-5">
                <h3 className="font-bold text-navy text-lg">China Town, Lahore</h3>
                <p className="text-gray-600 text-sm mt-1">Pakistan's First China Town, inside Bahria Sky, Bahria Orchard, Lahore.</p>
                <Link href="/projects/proj-5" className="btn btn-red mt-3">View project</Link>
              </article>
            </div>
          )}
          </div>
          <p className="mt-4 text-sm">
            <span className="font-semibold">By size:</span>{" "}
            {["3 Marla", "5 Marla", "6 Marla", "10 Marla", "1 Kanal"].map((s) => (
              <Link key={s} href={`/properties?q=${encodeURIComponent(s)}`} className="text-anngan-dark font-semibold mr-3 hover:underline">{s}</Link>
            ))}
          </p>
          <p className="mt-3 text-sm text-gray-600">
            For sale: {sale.length} | For rent: {rent.length} | Lahore {listings.filter((l) => l.city === "Lahore").length} |
            Rawalpindi {listings.filter((l) => l.city === "Rawalpindi").length} | Multan {listings.filter((l) => l.city === "Multan").length} |
            Islamabad {listings.filter((l) => l.city === "Islamabad").length} | Karachi {listings.filter((l) => l.city === "Karachi").length}
          </p>
        </section>
      )}

      <section className="mt-10 bg-slate-50 -mx-4 px-4 py-8">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h2 className="text-2xl font-bold text-navy">Our projects</h2>
          <Link href="/projects" className="text-anngan-dark font-semibold text-sm">All 7 projects &rarr;</Link>
        </div>
        <p className="text-gray-600 mt-1">Projects Anngan markets itself. MGH Pakistan at Mangla comes first.</p>
        {mgh ? (
          <article className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm mt-4 md:flex">
            <div className="relative md:w-1/2">
              <Image src={`/img/${mgh.img}`} alt="Mangla Lake aerial view, MGH Pakistan" width={1200} height={675} className="w-full h-56 md:h-full object-cover" loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" />
              <span className="absolute top-3 left-3 bg-anngan text-white text-xs font-bold px-2 py-1 rounded">Our main project</span>
            </div>
            <div className="p-5 md:w-1/2">
              <h3 className="font-bold text-navy text-xl">MGH Pakistan</h3>
              <p className="text-gray-600 text-sm">Mangla, 7KM Mangla Gaddari Road</p>
              <p className="text-sm mt-2">Lake view housing at Mangla Cantt. Precincts 01 to 06, Serene Farm Houses in 05 and 06.</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <span className="bg-slate-100 text-navy text-xs font-semibold px-2 py-1 rounded">Zamindar File</span>
                <span className="bg-slate-100 text-navy text-xs font-semibold px-2 py-1 rounded">Affidavit MGH</span>
                <span className="bg-slate-100 text-navy text-xs font-semibold px-2 py-1 rounded">Serene Farm Houses</span>
              </div>
              <div className="flex gap-2 mt-4 flex-wrap">
                <Link href="/projects/proj-1" className="btn btn-red">Open MGH Pakistan</Link>
                <a href="tel:+923041111698" className="btn btn-outline-navy">Call for today's file rate</a>
              </div>
            </div>
          </article>
        ) : null}
        <div className="grid gap-4 mt-4 md:grid-cols-2">
          {otherProjects.map((p) => (
            <article key={p.id} className="card border border-gray-200 rounded-lg bg-white shadow-sm p-4 flex gap-4 items-start h-full">
              {p.img ? (
                <Image src={`/img/${p.img}`} alt={p.name} width={256} height={192} className="w-28 h-24 object-cover rounded shrink-0" loading="lazy" sizes="112px" />
              ) : (
                <div className="w-28 h-24 bg-amber-100 rounded shrink-0 flex flex-col items-center justify-center text-navy text-xs font-bold px-2 text-center">
                  <span>Pak China Grain Market</span>
                  <span>2 Marla Rs 56 Lac</span>
                  <span>3 Marla Rs 84 Lac</span>
                  <span>4 Marla Rs 112 Lac</span>
                  <span>996 shops, 54 acres, Shujabad Road</span>
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-bold text-navy">{p.name}</h3>
                <p className="text-gray-600 text-sm">{p.loc}</p>
                <p className="text-sm mt-1">{p.note}</p>
                {p.id === "proj-6" ? <p className="text-sm mt-1">54-acre site, Shujabad Road, Multan. 996 shops. No real photo exists yet, so the shop sizes and prices are shown here instead of a picture.</p> : null}
                {p.id === "proj-5" ? <p className="text-sm mt-1">Photo shows Bahria Sky.</p> : null}
                <Link href={`/projects/${p.id}`} className="btn btn-outline-navy mt-2">Open project</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h2 className="text-2xl font-bold text-navy">Ask Anngan before you buy</h2>
          <Link href="/tools" className="text-anngan-dark font-semibold text-sm">All six, on one page &rarr;</Link>
        </div>
        <p className="text-gray-600 mt-1">Six tools, in your browser. No account, no payment.</p>
        <div className="mt-4 space-y-3">
          {TOOLS.map((t) => (
            <div key={t.n} className="flex gap-4 items-start border-b border-gray-100 pb-3">
              <span className="bg-navy text-white font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0">{t.n}</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-navy">{t.title}</h3>
                <p className="text-sm text-gray-600">{t.note}</p>
              </div>
              <Link href={t.href} className="btn btn-outline-red shrink-0">Open it</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-navy">Where we work</h2>
        <p className="text-gray-600 mt-1">Tap a city to see what Anngan has there.</p>
        <div className="grid gap-3 mt-4 sm:grid-cols-2">
          {CITY_CARDS.map((c) => (
            <Link key={c.city} href={c.href} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:border-anngan">
              <p className="font-bold text-navy">{c.city}</p>
              <p className="text-sm text-gray-600">{c.note}</p>
            </Link>
          ))}
        </div>
        <h2 className="text-xl font-bold text-navy mt-8">By society</h2>
        <p className="mt-2 text-sm flex flex-wrap gap-x-4 gap-y-1">
          {SOCIETY_LINKS.map((s) => (
            <Link key={s} href={`/properties?q=${encodeURIComponent(s)}`} className="text-anngan-dark font-semibold hover:underline">{s === "DHA" ? "DHA Lahore" : s === "Bahria" ? "Bahria Town" : s === "Paragon" ? "Paragon City" : s === "Al Kabir" ? "Al Kabir Town" : s === "Lake City" ? "Lake City" : s === "Citi Housing" ? "Citi Housing" : s === "Shamsi" ? "Shamsi Society" : s}</Link>
          ))}
        </p>
      </section>

      <section className="mt-10 bg-slate-50 -mx-4 px-4 py-8">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h2 className="text-2xl font-bold text-navy">From the Anngan blog</h2>
          <Link href="/blogs" className="text-anngan-dark font-semibold text-sm">All 23 articles &rarr;</Link>
        </div>
        <p className="text-gray-600 mt-1">Latest real articles from anngan.com, newest first. Newest: 27 Feb 2023.</p>
        <div className="mt-4 space-y-3">
          {blogs.slice(0, 6).map((b) => (
            <article key={b.id} className="border border-gray-200 rounded-lg bg-white p-4 flex gap-4 items-start justify-between">
              <div className="min-w-0">
                <p className="text-sm text-gray-600">{b.date}</p>
                <h3 className="font-semibold text-navy">{b.title}</h3>
              </div>
              <a href={b.url} target="_blank" rel="noopener" className="btn btn-outline-navy shrink-0">Read it</a>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <Image src="/img/ceo.jpg" alt="Muhammad Mahmood Cheema, Chairman and Chief Executive Officer, Anngan" width={1024} height={683} className="w-full h-auto object-contain rounded-lg" loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" />
          <div>
            <h2 className="text-2xl font-bold text-navy">Who we are</h2>
            <p className="text-gray-600 mt-2">Real estate solutions under one roof, from Pakistan's trusted source.</p>
            <p className="text-gray-600 mt-2"><b>Muhammad Mahmood Cheema</b>, Chairman and Chief Executive Officer</p>
            <p className="font-bold text-anngan-dark mt-2">banay khawab haqiqat</p>
            <p className="text-sm text-gray-600 mt-2">Office: {settings?.address || "57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore"}. Phone {settings?.phone || "+92 304 1111 698"}, email info@anngan.com.</p>
            <div className="flex gap-2 mt-4 flex-wrap">
              <Link href="/about" className="btn btn-red">Read our story</Link>
              <Link href="/projects" className="btn btn-outline-navy">See the projects</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
