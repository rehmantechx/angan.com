"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProjects, getSettings } from "../lib/db";
import { Project, OfficeSettings, PROJECTS, SETTINGS } from "../lib/seed";
import { ProjectFallback } from "../components/ProjectFallback";
import { searchProjects, SearchFilters } from "../lib/search";

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Multan", "Mangla", "Kashmir"];

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

export default function Home() {
  // No listings on the home page: the client wants listings only on
  // /properties. Home shows projects only; listing searches go to
  // /properties (see doSearch). Projects still start from seed on the
  // first paint, the background refresh replaces them only if live
  // data actually differs.
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [settings, setSettings] = useState<OfficeSettings | null>(SETTINGS);

  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [beds, setBeds] = useState("");
  const [budget, setBudget] = useState("");
  // Home search result, projects only, set once per Search click.
  // Listing searches never render here: they go to /properties.
  const [results, setResults] = useState<{ projects: Project[]; note: string } | null>(null);
  const [searchedFilters, setSearchedFilters] = useState<SearchFilters | null>(null);
  const searched = results !== null;

  // Hero slider state. heroPrev is the photo fading out underneath,
  // hero is the one fading in, and the next photo is already rendered
  // invisible so it is downloaded before its turn comes.
  const router = useRouter();
  const [hero, setHero] = useState(0);
  const [heroPrev, setHeroPrev] = useState<number | null>(null);
  const [heroIn, setHeroIn] = useState(true);
  const [heroPaused, setHeroPaused] = useState(false);
  // Speed: only the first hero photo loads on first paint. The next
  // photo starts downloading 5 seconds in, halfway to its turn, so it
  // is ready for the crossfade but never competes with first paint.
  const [heroPreload, setHeroPreload] = useState(false);
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
    // Download the next hero photo 5 seconds after this one appears,
    // halfway to its turn, so first paint only ever downloads one.
    setHeroPreload(false);
    const t = setTimeout(() => setHeroPreload(true), 5000);
    return () => clearTimeout(t);
  }, [hero]);

  useEffect(() => {
    // Drop the faded-out photo once the crossfade is done.
    if (heroPrev === null) return;
    const t = setTimeout(() => setHeroPrev(null), 1200);
    return () => clearTimeout(t);
  }, [heroPrev]);

  useEffect(() => {
    // Background refresh only, after the first paint AND when the
    // browser is idle, so the Firestore round trip never competes
    // with the hero or the images. Projects already show from seed;
    // live data replaces them only if it differs.
    const refresh = () => {
      getProjects().then((rows) => { if (rows.length > 0) setProjects(rows); });
      getSettings().then(setSettings);
    };
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(refresh, { timeout: 3000 });
      return () => (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback?.(id);
    }
    const t = setTimeout(refresh, 2000);
    return () => clearTimeout(t);
  }, []);

  function currentFilters(): SearchFilters {
    return { status, q, type, city, beds, budget };
  }

  function doSearch() {
    const f = currentFilters();
    setSearchedFilters(f);
    // Project searches (Projects tab, or a File search for MGH) stay
    // on home and show projects only, never listing cards.
    if (f.status === "project" || f.type === "File") {
      const phits = searchProjects(projects, f);
      const note =
        phits.length > 0
          ? "Found " + phits.length + (phits.length === 1 ? " project." : " projects.")
          : "No project matched that search. See all 7 projects below, or see all listings on the properties page.";
      setResults({ projects: phits, note });
      return;
    }
    // Every other search is a listing search. Home shows no listings,
    // so go to /properties with the same filters. /properties reads
    // q, city, status and beds from the URL; it has no type or budget
    // filter, so those two are not carried over.
    const qs = new URLSearchParams();
    if (f.q.trim()) qs.set("q", f.q.trim());
    if (f.city) qs.set("city", f.city);
    if (f.status === "sale" || f.status === "rent") qs.set("status", f.status);
    if (f.beds) qs.set("beds", f.beds);
    const url = qs.toString() ? "/properties?" + qs.toString() : "/properties";
    router.push(url);
  }

  function clearSearch() {
    setResults(null);
    setSearchedFilters(null);
    setQ("");
    setType("");
    setCity("");
    setBeds("");
    setBudget("");
    setStatus("all");
  }

  function handleType(v: string) {
    setType(v);
    // Plots, files and shops have no bedrooms, so clear beds for them.
    if (v === "Plot" || v === "File" || v === "Commercial") setBeds("");
  }

  // Filters changed since the last Search click: the list below is still
  // the last searched result, not a new search.
  const filtersChanged =
    searchedFilters !== null &&
    (searchedFilters.status !== status ||
      searchedFilters.q !== q ||
      searchedFilters.type !== type ||
      searchedFilters.city !== city ||
      searchedFilters.beds !== beds ||
      searchedFilters.budget !== budget);
  const bedsDisabled = type === "Plot" || type === "File" || type === "Commercial";

  const searchResults = results
    ? { projects: results.projects, note: results.note }
    : { projects: [] as Project[], note: "" };

  const mgh = projects.find((p) => p.id === "proj-1");
  const otherProjects = projects.filter((p) => p.id !== "proj-1");

  const tabCls = (on: boolean) =>
    "px-4 py-3 rounded font-bold text-sm min-h-[48px] inline-flex items-center " + (on ? "bg-[#005F90] text-white" : "bg-gray-200 text-navy");

  return (
    <>
      {/* Hero, decided static version, full width. Background photo
          changes every 10 seconds, crossfade, loop, like anngan.com.
          Dark navy behind the photos plus a gradient keeps the white
          hero text and the search box readable on every photo.
          Full width with w-full, because this section is a direct
          child of <main>, not of the content div. No w-screen: 100vw
          counts the classic desktop scrollbar, so the old hero made
          the page about 15px wider than the viewport. */}
      <section
        className="relative w-full bg-navy overflow-hidden"
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
        {/* Next photo, invisible, downloaded 5 seconds in so its turn is instant. */}
        {heroPreload ? (
          <Image
            key={"next-" + heroNext}
            src={HERO_PHOTOS[heroNext].src}
            alt=""
            aria-hidden="true"
            fill
            quality={70}
            sizes="100vw"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/20 to-navy/60 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-4 py-8 md:py-10">
          <h1 className="text-white text-3xl md:text-4xl font-extrabold max-w-[22ch] leading-tight">
            Property for sale and rent in Pakistan
          </h1>
          <p className="text-white text-lg md:text-xl font-light mt-2">
            Pakistan&apos;s Most Trusted Real Estate Service Providers
          </p>
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
                <input id="sKey" type="text" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); doSearch(); } }} placeholder="Try Karachi, DHA, MGH or 10 Marla" autoComplete="off" className="w-full border border-gray-300 rounded px-3 py-2 mt-1" />
              </div>
              <div>
                <label htmlFor="sType" className="text-sm font-bold text-gray-700">Property type</label>
                <select id="sType" value={type} onChange={(e) => handleType(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1">
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
                <select id="sBed" value={beds} disabled={bedsDisabled} onChange={(e) => setBeds(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1 disabled:bg-gray-100 disabled:text-gray-400">
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
            {bedsDisabled ? <p className="text-sm text-gray-600 mt-2">Bedrooms do not apply to plots, files or shops.</p> : null}
            {filtersChanged ? <p className="text-sm font-semibold text-navy mt-2">Filters changed. Click Search to update results.</p> : null}
            {searchResults.note ? <p className="text-sm font-semibold text-navy mt-2" role="status">{searchResults.note}</p> : null}
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

      <div>
      {searched ? (
        <section className="mt-8" id="search-results" role="tabpanel" aria-labelledby="tab-all">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <h2 className="text-2xl font-bold text-navy">
              Search results
              <button type="button" onClick={clearSearch} className="btn btn-outline-navy ml-3">
                Show all 7 projects
              </button>
            </h2>
            <Link href="/properties" className="text-anngan-dark font-semibold text-sm">See all listings &rarr;</Link>
          </div>
          {searchResults.note ? <p className="text-sm font-semibold text-navy mt-2" role="status">{searchResults.note}</p> : null}
          {searchResults.projects.length === 0 ? (
            <p className="text-sm text-gray-600 mt-2">
              Listings are on the properties page, not on the home page.{" "}
              <Link href="/properties" className="text-anngan-dark font-semibold">See all listings &rarr;</Link>
            </p>
          ) : null}
          <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
            {searchResults.projects.map((p) => (
              <article key={p.id} className="card border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-full">
                {p.img ? <Image src={`/img/${p.img}`} alt={p.name} width={1200} height={675} className="w-full h-48 object-cover bg-navy" loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /> : (
                  <ProjectFallback name={p.name} loc={p.loc} />
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
      ) : null}

      <section className="mt-10 bg-slate-50 -mx-4 px-4 py-8">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h2 className="text-2xl font-bold text-navy">Our projects</h2>
          <Link href="/projects" className="text-anngan-dark font-semibold text-sm">All 7 projects &rarr;</Link>
        </div>
        <p className="text-gray-600 mt-1">Projects Anngan markets itself. MGH Pakistan at Mangla comes first.</p>
        {mgh ? (
          <article className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm mt-4 md:flex">
            <div className="relative md:w-1/2">
              <Image src={`/img/${mgh.img}`} alt="Mangla Lake aerial view, MGH Pakistan" width={1200} height={675} className="w-full h-56 md:h-full object-cover bg-navy" loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" />
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
                <ProjectFallback name={p.name} loc={p.loc} className="w-28 h-24 rounded shrink-0" compact />
              )}
              <div className="min-w-0">
                <h3 className="font-bold text-navy">{p.name}</h3>
                <p className="text-gray-600 text-sm">{p.loc}</p>
                <p className="text-sm mt-1">{p.note}</p>
                {p.id === "proj-5" ? <p className="text-sm mt-1">Photo shows Bahria Sky.</p> : null}
                <Link href={`/projects/${p.id}`} className="btn btn-outline-navy mt-2">Open project</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10" aria-label="More from Anngan">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/tools" className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:border-anngan flex items-baseline justify-between gap-2">
            <span><span className="font-bold text-navy">Ask Anngan</span><span className="text-sm text-gray-600 block">Six tools: building cost, loan, area, prices, guides, finder.</span></span>
            <span className="text-anngan-dark font-semibold text-sm shrink-0">Open tools &rarr;</span>
          </Link>
          <Link href="/blogs" className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:border-anngan flex items-baseline justify-between gap-2">
            <span><span className="font-bold text-navy">From the Anngan blog</span><span className="text-sm text-gray-600 block">23 real articles from anngan.com, newest first.</span></span>
            <span className="text-anngan-dark font-semibold text-sm shrink-0">All articles &rarr;</span>
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div className="flex justify-center md:justify-start">
            <Image src="/img/ceo.jpg" alt="Muhammad Mahmood Cheema, Chairman and Chief Executive Officer, Anngan" width={1024} height={683} className="w-full md:w-auto md:max-h-[300px] h-auto object-contain rounded-lg bg-white p-2 pt-3" loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-navy">Who is Anngan?</h2>
            <p className="text-gray-600 mt-2"><b className="text-navy">Anngan</b> is Pakistan&apos;s trusted real estate service provider.</p>
            <p className="text-gray-600 mt-2"><b>Muhammad Mahmood Cheema</b>, Chairman and Chief Executive Officer</p>
            <p className="urdu-tagline mt-2" lang="ur">بنائے خواب حقیقت</p>
            <p className="text-sm text-gray-600 mt-2">Office: Paragon City, Lahore. Call {settings?.phone || "+92 304 1111 698"}.</p>
            <div className="flex gap-2 mt-4 flex-wrap">
              <Link href="/about" className="btn btn-red">Read our story</Link>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
