"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProjects, getSettings } from "../lib/db";
import { Project, OfficeSettings, PROJECTS, SETTINGS, LISTINGS } from "../lib/seed";
import { ProjectFallback } from "../components/ProjectFallback";

// Hero background slider, like the original anngan.com: the photo
// changes every 10 seconds, crossfade, loop. Real photos only, all
// already in the repo, no AI, no fake. No video, no new section, same
// hero, same text, no search box. Order is fixed: Mangla lake,
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
  // /properties. Home shows projects only. Projects still start from seed on the
  // first paint, the background refresh replaces them only if live
  // data actually differs.
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [settings, setSettings] = useState<OfficeSettings | null>(SETTINGS);

  // Old-style search panel below the hero. It never renders listings
  // on home: submit goes to /properties with the filters in the URL.
  const router = useRouter();
  const [searchStatus, setSearchStatus] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchBeds, setSearchBeds] = useState("");
  const [searchBudget, setSearchBudget] = useState("");
  // Cities come only from the live listings, so Mangla and Kashmir,
  // which have projects but no property listings, never appear here.
  const searchCities = Array.from(
    new Set(LISTINGS.filter((l) => l.liveStatus === "live").map((l) => l.city))
  );
  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const qs = new URLSearchParams();
    // /properties matches q against title, area, city, size and type,
    // so a property type goes as q and actually filters.
    if (searchType) qs.set("q", searchType);
    if (searchCity) qs.set("city", searchCity);
    if (searchStatus) qs.set("status", searchStatus);
    if (searchBeds) qs.set("beds", searchBeds);
    // NOTE: /properties has no budget filter yet, so budget is carried
    // in the URL as budget= for now and is not applied there.
    if (searchBudget) qs.set("budget", searchBudget);
    const url = qs.toString() ? "/properties?" + qs.toString() : "/properties";
    router.push(url);
  }


  // Hero slider state. heroPrev is the photo fading out underneath,
  // hero is the one fading in, and the next photo is already rendered
  // invisible so it is downloaded before its turn comes.
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

  const mgh = projects.find((p) => p.id === "proj-1");
  const otherProjects = projects.filter((p) => p.id !== "proj-1");

  return (
    <>
      {/* Hero, decided static version, full width. Background photo
          changes every 10 seconds, crossfade, loop, like anngan.com.
          Dark navy behind the photos plus a gradient keeps the white
          hero text readable on every photo.
          Full width with w-full, because this section is a direct
          child of <main>, not of the content div. No w-screen: 100vw
          counts the classic desktop scrollbar, so the old hero made
          the page about 15px wider than the viewport.
          Search lives BELOW the hero in the old-style panel, and it
          goes to /properties: no listing cards render on home. */}
      {/* Hero is TALL like the old anngan.com, not a thin strip, but
          hero + search together must fit one desktop screen
          (1280x800): hero about 480px at desktop, 420px on mobile,
          text centred vertically with breathing room above and below. */}
      <section
        className="relative w-full bg-navy overflow-hidden min-h-[420px] md:min-h-[480px] flex flex-col justify-center"
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
        <div className="relative w-full max-w-6xl mx-auto px-4 py-10 md:py-14 text-center">
          <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-extrabold mx-auto leading-tight md:whitespace-nowrap">
            WELCOME TO ANNGAN.COM
          </h1>
          <p className="text-white text-lg md:text-xl font-light mt-2 md:whitespace-nowrap">
            Pakistan&apos;s Most Trusted Real Estate Service Providers
          </p>
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

      {/* Old-style search panel, dark blue band with blue tabs and a
          white panel, like the old anngan.com. Submit goes to
          /properties: no listing cards ever render on home. */}
      <section className="bg-navy px-4 pt-2 pb-4" aria-label="Search properties">
        <div className="flex justify-center gap-2 flex-wrap" role="tablist" aria-label="For sale or rent">
          {[
            { value: "", label: "All Status" },
            { value: "rent", label: "For Rent" },
            { value: "sale", label: "For Sale" },
          ].map((t) => (
            <button
              key={t.value || "all"}
              type="button"
              role="tab"
              aria-selected={searchStatus === t.value}
              onClick={() => setSearchStatus(t.value)}
              className={
                "px-3 py-1.5 min-h-[36px] rounded-t-lg font-bold text-sm text-white " +
                (searchStatus === t.value ? "bg-[#005F90]" : "bg-[#2F96CD] hover:bg-[#005F90]")
              }
            >
              {t.label}
            </button>
          ))}
        </div>
        <form onSubmit={submitSearch} className="max-w-4xl mx-auto mt-0 bg-white rounded-lg shadow p-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5 items-end">
          <div>
            <label htmlFor="search-type" className="block text-xs font-bold tracking-wide text-gray-600">LOOKING FOR</label>
            <select id="search-type" value={searchType} onChange={(e) => setSearchType(e.target.value)} className="mt-1 border border-gray-300 rounded px-3 py-2 min-w-0 w-full min-h-[40px]">
              <option value="">Property Type</option>
              <option value="House">House</option>
              <option value="Flat">Flat</option>
              <option value="Portion">Portion</option>
              <option value="Plot">Plot</option>
              <option value="Commercial">Commercial</option>
              <option value="File">File</option>
            </select>
          </div>
          <div>
            <label htmlFor="search-city" className="block text-xs font-bold tracking-wide text-gray-600">LOCATION</label>
            <select id="search-city" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} className="mt-1 border border-gray-300 rounded px-3 py-2 min-w-0 w-full min-h-[40px]">
              <option value="">All Cities</option>
              {searchCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="search-beds" className="block text-xs font-bold tracking-wide text-gray-600">PROPERTY SIZE</label>
            <select id="search-beds" value={searchBeds} onChange={(e) => setSearchBeds(e.target.value)} className="mt-1 border border-gray-300 rounded px-3 py-2 min-w-0 w-full min-h-[40px]">
              <option value="">Bedrooms</option>
              <option value="2">2 beds</option>
              <option value="3">3 beds</option>
              <option value="4">4 beds</option>
              <option value="5+">5+ beds</option>
            </select>
          </div>
          <div>
            <label htmlFor="search-budget" className="block text-xs font-bold tracking-wide text-gray-600">YOUR BUDGET</label>
            <select id="search-budget" value={searchBudget} onChange={(e) => setSearchBudget(e.target.value)} className="mt-1 border border-gray-300 rounded px-3 py-2 min-w-0 w-full min-h-[40px]">
              <option value="">Max. Price</option>
              <option value="under-1cr">Under Rs 1 Crore</option>
              <option value="1cr-5cr">Rs 1 Crore to Rs 5 Crore</option>
              <option value="above-5cr">Above Rs 5 Crore</option>
            </select>
          </div>
          <button type="submit" className="btn btn-red w-full">Search</button>
        </form>
      </section>

      <div>
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
