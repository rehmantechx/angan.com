"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProjects } from "../lib/db";
import { Project, PROJECTS, LISTINGS } from "../lib/seed";
import { ListingCard } from "../components/ListingCard";
import { ProjectFallback } from "../components/ProjectFallback";
import { AGENCIES } from "../lib/seed";
import { BuildingIcon, HomeIcon, UsersIcon } from "../lib/icons";

// Hero background slider, like the original anngan.com: the photo
// changes every 10 seconds, crossfade, loop. Real photos only, all
// already in the repo, no AI, no fake. No video, no new section, same
// hero, same text, no search box. Order is fixed: Mangla lake,
// Urban City, MGH Precinct 01, Bahria Sky, Neelum Valley Kashmir.
// VIS-07: slide 5 was kmc-01.jpg, Kashmir Modern City, which carries
// old anngan.com and MODERN CITY watermarks in the top corners. All
// three kmc photos carry the same watermarks, so slide 5 is now the
// clean, unwatermarked Neelum Valley photo already used on the
// Kashmir city card.
const HERO_PHOTOS = [
  { src: "/img/mgh-lake-aerial.jpg", alt: "Mangla Lake aerial view, MGH Pakistan" },
  { src: "/img/urban-drone.jpg", alt: "Urban City, Lahore, drone view" },
  { src: "/img/mgh-precinct-01.jpg", alt: "MGH Pakistan, Precinct 01, Mangla" },
  { src: "/img/chinatown-bahria-sky.jpg", alt: "Bahria Sky, where China Town is located" },
  { src: "/img/city-kashmir-neelum.jpg", alt: "Sharda, Neelum Valley, Kashmir" },
];

// Pictorial city cards: for people who cannot read English, a big
// photo with the city name on it. Click the picture, go to that
// city's listings. Counts are counted from the live listings in
// lib/seed, never typed in by hand. Mangla and Kashmir have no
// listings, only projects, so they link to their real project page
// and show no listing count. Photos are FAMOUS landmarks, not
// listing houses: Badshahi Mosque (Lahore), Faisal Mosque
// (Islamabad), Mazar-e-Quaid (Karachi), Raja Bazaar (Rawalpindi),
// Shah Rukn-e-Alam (Multan), Mangla Dam (Mangla), Neelum Valley
// (Kashmir). All real photos from Wikimedia Commons, downloaded
// into public/img/city-*.jpg, see NOTES in
// angan-e2e-evidence/famous-city-pics-2026-11-23/ for the source
// URL of each photo. No AI images, no listing photos.
const CITY_CARDS = [
  { name: "Lahore", img: "city-lahore-badshahi-sky.jpg", alt: "Badshahi Mosque, Lahore", href: "/properties?city=Lahore", kind: "listings", pos: "object-top" },
  { name: "Islamabad", img: "city-islamabad-faisal-sky.jpg", alt: "Faisal Mosque, Islamabad", href: "/properties?city=Islamabad", kind: "listings", pos: "object-top" },
  { name: "Karachi", img: "city-karachi-mazar-sky.jpg", alt: "Mazar-e-Quaid, Karachi", href: "/properties?city=Karachi", kind: "listings", pos: "object-top" },
  { name: "Rawalpindi", img: "city-rawalpindi-raja-bazaar.jpg", alt: "Raja Bazaar, Rawalpindi", href: "/properties?city=Rawalpindi", kind: "listings", pos: "object-top" },
  // MULTAN LEFT-EDGE FIX 25 Nov 2026: the tomb sits at the far LEFT
  // of city-multan-shah-rukn-sky.jpg (building base wall from x=33,
  // dome x=150-270 of 1000), while the card is 4/3 and the photo is
  // 1000x586 (aspect 1.706), so object-cover with centred
  // object-top crops 10.9% off EACH side and slices the building's
  // left flank, leaving the dome flush against the card's left edge.
  // object-left-top keeps the crop on the right (expendable trees
  // and road) and the whole tomb in frame with a margin on the left.
  // Sky above the dome was already fixed by the +60px PIL extension.
  // Real photo only, no AI, no image edit needed. All other cities
  // keep object-top, their subjects are centred.
  { name: "Multan", img: "city-multan-shah-rukn-sky.jpg", alt: "Tomb of Shah Rukn-e-Alam, Multan", href: "/properties?city=Multan", kind: "listings", pos: "object-left-top" },
  { name: "Mangla", img: "city-mangla-dam.jpg", alt: "Mangla Dam, seen from Ramkot Fort", href: "/projects/proj-1", kind: "project", sub: "MGH Pakistan", pos: "object-top" },
  { name: "Kashmir", img: "city-kashmir-neelum.jpg", alt: "Sharda, Neelum Valley, Kashmir", href: "/projects/proj-7", kind: "project", sub: "Kashmir Modern City", pos: "object-top" },
  { name: "All cities", img: "urban-drone.jpg", alt: "Urban City, Lahore, drone view", href: "/properties", kind: "all", sub: "12 homes", pos: "object-top" },
] as const;
function cityCount(city: string) {
  return LISTINGS.filter((l) => l.liveStatus === "live" && l.city === city).length;
}

export default function Home() {
  // No listings on the home page: the client wants listings only on
  // /properties. Home shows projects only. Projects still start from seed on the
  // first paint, the background refresh replaces them only if live
  // data actually differs.
  const [projects, setProjects] = useState<Project[]>(PROJECTS);

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
    // Budget is applied on /properties by budgetOK (under-1cr /
    // 1cr-5cr / above-5cr, sale only, rent always passes).
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
    };
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(refresh, { timeout: 3000 });
      return () => (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback?.(id);
    }
    const t = setTimeout(refresh, 2000);
    return () => clearTimeout(t);
  }, []);

  // Home project cards are pictorial only, all 7 the same size:
  // one large real photo, the project name on the photo, click it
  // and you are on that project page. No featured card, no panel.

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
      {/* HERO-FULL (user order 2026-11-24 21:12 PKT, URGENT): the hero
          picture must be FULL like the old anngan.com, not a short
          dark strip. This supersedes the compact-hero orders (hero
          cut to 340px, then 260px, HEAD 394b021 and 9f69f50, so the
          city cards fit one screen). Old site hero was about 600px
          at 1280 / 520px at 390, so this hero is the same: tall,
          photo-first, picture fully visible. The photo is now at
          full opacity, the dark navy gradient is a light scrim only
          (25% top, clear middle, 35% bottom), and the white H1 and
          tagline stay readable with a soft text shadow. H1 text,
          tagline text, search panel and header are unchanged. */}
      <section
        className="relative w-full bg-navy overflow-hidden min-h-[520px] md:min-h-[600px] flex flex-col justify-center"
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
            className="absolute inset-0 w-full h-full object-cover opacity-100"
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
          style={{ opacity: heroIn ? 1 : 0 }}
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
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-950/45 to-slate-950/75 pointer-events-none" aria-hidden="true" />
        <div className="relative w-full max-w-6xl mx-auto px-4 py-5 md:py-6 text-center">
          <h1 className="text-white text-2xl sm:text-5xl md:text-6xl font-extrabold mx-auto leading-tight md:whitespace-nowrap [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]">
            WELCOME TO ANNGAN.COM
          </h1>
          <p className="text-white text-lg md:text-2xl font-light mt-3 md:whitespace-nowrap [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]">
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
      <section className="bg-navy px-4 pt-1 pb-3" aria-label="Search properties">
        <div className="flex justify-center gap-2 flex-wrap" role="tablist" aria-label="For sale or rent">
          {[
            { value: "", label: "All Status" },
            { value: "rent", label: "For Rent" },
            { value: "sale", label: "For Sale" },
          ].map((t) => {
            // PHN-03: tabs are color-coded like the card badges, not
            // both light blue. For Sale is red, For Rent is blue, so
            // "click the red Sale button" works on the homepage too.
            const activeCls =
              t.value === "sale" ? "bg-[#DD3333]" : t.value === "rent" ? "bg-[#005F90]" : "bg-[#005F90]";
            return (
              <button
                key={t.value || "all"}
                type="button"
                role="tab"
                aria-selected={searchStatus === t.value}
                onClick={() => setSearchStatus(t.value)}
                className={
                  "px-3 py-1 min-h-[32px] rounded-t-lg font-bold text-sm text-white " +
                  (searchStatus === t.value ? activeCls : "bg-[#2F96CD] hover:bg-[#005F90]")
                }
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <form onSubmit={submitSearch} className="max-w-4xl mx-auto mt-0 bg-white rounded-lg shadow p-2 grid gap-2 grid-cols-2 lg:grid-cols-5 items-end">
          <div>
            <label htmlFor="search-type" className="block text-xs font-bold tracking-wide text-gray-600">LOOKING FOR</label>
            <select id="search-type" value={searchType} onChange={(e) => setSearchType(e.target.value)} className="mt-1 border border-gray-300 rounded px-3 py-2 min-w-0 w-full min-h-[36px]">
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
            <select id="search-city" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} className="mt-1 border border-gray-300 rounded px-3 py-2 min-w-0 w-full min-h-[36px]">
              <option value="">All Cities</option>
              {searchCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="search-beds" className="block text-xs font-bold tracking-wide text-gray-600">PROPERTY SIZE</label>
            <select id="search-beds" value={searchBeds} onChange={(e) => setSearchBeds(e.target.value)} className="mt-1 border border-gray-300 rounded px-3 py-2 min-w-0 w-full min-h-[36px]">
              <option value="">Bedrooms</option>
              <option value="2">2 beds</option>
              <option value="3">3 beds</option>
              <option value="4">4 beds</option>
              <option value="5+">5+ beds</option>
            </select>
          </div>
          <div>
            <label htmlFor="search-budget" className="block text-xs font-bold tracking-wide text-gray-600">YOUR BUDGET</label>
            <select id="search-budget" value={searchBudget} onChange={(e) => setSearchBudget(e.target.value)} className="mt-1 border border-gray-300 rounded px-3 py-2 min-w-0 w-full min-h-[36px]">
              <option value="">Max. Price</option>
              <option value="under-1cr">Under Rs 1 Crore</option>
              <option value="1cr-5cr">Rs 1 Crore to Rs 5 Crore</option>
              <option value="above-5cr">Above Rs 5 Crore</option>
            </select>
          </div>
          <button type="submit" className="btn btn-red w-full col-span-2 lg:col-span-1">Search</button>
        </form>
      </section>

      {/* Pictorial: browse by city. Big photo, big city name on the
          photo, click it and you are on that city's listings. Put
          right after the search panel, before Our projects, so it is
          the first thing a visitor sees after the hero and search. */}
      <section className="mt-6" aria-label="Browse by city">
        <h2 className="text-xl font-bold text-navy text-center">Browse by city</h2>
        <div className="grid gap-4 mt-3 grid-cols-2 lg:grid-cols-4">
          {CITY_CARDS.map((c) => {
            const n = c.kind === "listings" ? cityCount(c.name) : c.kind === "all" ? LISTINGS.filter((l) => l.liveStatus === "live").length : 0;
            return (
              <Link key={c.name} href={c.href} className="relative block rounded-lg overflow-hidden shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-anngan aspect-[4/3] bg-navy" aria-label={c.kind === "project" ? `${c.name}, ${c.sub}, open project` : `${c.name}, ${n} ${n === 1 ? "home" : "homes"}, see listings`}>
                {/* PARITY 24 Nov 2026, Section 2: object-top, not
                    object-center, and taller 4/3 cards, so the tops
                    of Badshahi Mosque, Faisal Mosque, Mazar-e-Quaid
                    and Shah Rukn-e-Alam are not chopped off.
                    LIVE-FAIL FIX 24 Nov 2026: the sky in the four
                    city files was also extended upward in PIL
                    (Faisal +150px black, Mazar +250px blue,
                    Badshahi +80px, Multan +60px, column-wise top-row
                    replication), so the domes/minarets sit well below
                    the top edge with sky above them even if a card
                    ever crops from the top again. Do NOT replace these
                    files with the pre-pad originals. */}
                <Image src={`/img/${c.img}`} alt={c.alt} fill quality={75} sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" className={`object-cover ${c.pos}`} />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden="true" />
                <span className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <span className="block text-lg md:text-xl font-extrabold leading-tight drop-shadow">{c.name}</span>
                  {c.kind === "project" ? (
                    <span className="block text-xs font-semibold mt-0.5">{c.sub} &rarr;</span>
                  ) : (
                    <span className="block text-xs font-semibold mt-0.5">{n} {n === 1 ? "home" : "homes"} &rarr;</span>
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 2026-11-24 user order (audit PAR-01): Featured Properties
          are back on home, pictorial, 6 real listings. Property Tools
          stay off home: tools live at /tools and in the top nav. Home
          is pictorial, like the old anngan.com, for dealers who
          cannot read English: hero, search, Browse by city, Featured
          Properties, Societies, Our projects, Who is Anngan. */}

      {/* PAR-01 (audit 2026-11-24, user order 2026-11-24 20:49 PKT,
          supersedes the 23 Nov removal for this item): Featured
          Properties back on home, pictorial, 6 real listings, same
          6 as PIC-01. Listings stay live at /properties too; nothing
          was deleted, only the home section was restored. */}
      <section className="mt-10" aria-label="Featured properties">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h2 className="text-2xl font-bold text-navy">Featured Properties</h2>
          <Link href="/properties" className="text-anngan-dark font-semibold text-sm">All 12 properties &rarr;</Link>
        </div>
        <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
          {["karachi-shamsi", "dha-stunning", "dha-defence4", "dha-u7", "dha-1kanal", "bahria-luxury"].map((id) => {
            const l = LISTINGS.find((x) => x.id === id);
            return l ? <ListingCard key={l.id} l={l} /> : null;
          })}
        </div>
      </section>

      {/* PIC-01: compact Societies and partner agencies strip. Societies
          are real photo chips; agencies are their real logos from the
          repo, linking to /contact (no public agencies page exists). */}
      <section id="partner-agencies" className="mt-10 scroll-mt-24" aria-label="Societies and partner agencies">
        <h2 className="text-2xl font-bold text-navy">Societies</h2>
        <div className="grid gap-4 mt-4 grid-cols-2 lg:grid-cols-4">
          {[
            { name: "DHA Lahore", img: "lst-dha-stunning.jpg", href: "/properties?q=DHA" },
            { name: "Bahria Town", img: "bahria-eiffel.jpg", href: "/properties?q=Bahria" },
            // PARITY 24 Nov 2026, Section 5: the Mangla lake photo was
            // used 3 times on home (Hero 1, Societies, Projects). This
            // chip uses the real MGH Precinct 01 photo instead.
            { name: "MGH Pakistan", img: "mgh-precinct-01.jpg", href: "/projects/proj-1" },
            { name: "Kashmir Modern City", img: "city-kashmir-neelum.jpg", href: "/projects/proj-7" },
          ].map((c) => (
            <Link key={c.name} href={c.href} className="relative block rounded-lg overflow-hidden shadow-sm aspect-[4/3] bg-navy">
              {/* PARITY 24 Nov 2026, Section 2: object-top so the tip
                  of the Bahria Town Eiffel Tower is not chopped. */}
              <Image src={`/img/${c.img}`} alt={c.name} fill quality={75} sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" className="object-cover object-top" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden="true" />
              <span className="absolute bottom-0 left-0 right-0 p-3 text-white font-extrabold text-lg leading-tight">{c.name} &rarr;</span>
            </Link>
          ))}
        </div>
        <h3 className="font-bold text-navy mt-6">Partner agencies</h3>
        {/* PARITY 24 Nov 2026, Section 2: the 6-column grid left
            Brick Line Estate as a lone orphan on Row 3 and clipped
            logo edges at the container border. Now flex flex-wrap
            justify-center, so the final row is centred, with p-3
            inside every logo box so zero logo edges touch the border.
            Same 13 logos, same order, same /contact links, same name
            labels, 3 per row mobile, 4 tablet, 6 desktop. */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-3">
          {AGENCIES.map((a) => (
            // PHN-05: every logo tile carries its agency name under
            // the logo, so the bare stylised P (Pioneer Estate) is
            // named and no tile is an unlabeled picture.
            <Link key={a.id} href="/contact" aria-label={a.name + ", partner agency, contact the office"} className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm flex flex-col items-center gap-1 w-[calc(33.333%-6px)] sm:w-[calc(25%-9px)] lg:w-[calc(16.666%-10px)]">
              <span className="relative block w-full aspect-[5/4]">
                <Image src={`/img/${a.logo}`} alt={a.name + " logo"} fill sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw" className="object-contain p-3" loading="lazy" />
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-navy text-center leading-tight">{a.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <div>
      {/* Pictorial only, 2026-11-24 user order: Our projects on home
          is photo cards only, like the old anngan.com, for dealers
          who cannot read English. All 7 projects the same size, one
          large real photo each, project name on the photo, click the
          photo and you are on that project page. No featured big
          card, no MGH panel, no location, no chips, no description,
          no Open / Call / WhatsApp buttons. Full info, Call and
          WhatsApp stay on the project detail pages only. Pak China
          Grain Market has no real photo at all (VIS-01), so its card
          keeps the honest "Photo coming soon" fallback, no invented
          photo. Photos are the seed cardImg where one exists
          (Al Ghani aerial, Global Homes house), else the seed img. */}
      <section className="mt-10 bg-slate-50 -mx-4 px-4 py-8" aria-label="Our projects">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h2 className="text-2xl font-bold text-navy">Our projects</h2>
          <Link href="/projects" className="text-anngan-dark font-semibold text-sm">All 7 projects &rarr;</Link>
        </div>
        {/* PARITY 24 Nov 2026, Section 2: flex flex-wrap
            justify-center, so the 7th card (Kashmir Modern City)
            is centred on the last row instead of a lone orphan on
            the left. */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.id}`} className="relative block rounded-lg overflow-hidden shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-anngan aspect-[16/10] bg-navy w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]" aria-label={`${p.name}, open project`}>
              {p.img || p.cardImg ? (
                <>
                  {/* LIVE-FAIL FIX 24 Nov 2026: the Global Homes
                      cover is now a true 16/10 wide crop of the real
                      house photo (global-zamzam-house-wide.jpg), so it
                      fills the card with object-cover object-top, roof
                      intact, no side pillars. The old clean file was a
                      tall portrait, which object-contain squeezed into
                      a narrow strip with white pillars. Every other
                      card stays object-cover. */}
                  <Image src={`/img/${p.cardImg || p.img}`} alt={p.name} fill quality={75} sizes="(max-width: 768px) 50vw, 33vw" loading="lazy" className={(p.cardImg || p.img) === "global-zamzam-house-wide.jpg" ? "object-cover object-top" : "object-cover"} />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden="true" />
                  <span className="absolute bottom-0 left-0 right-0 p-3 text-white font-extrabold text-lg md:text-xl leading-tight drop-shadow">{p.name}</span>
                </>
              ) : (
                <ProjectFallback name={p.name} loc={p.loc} className="absolute inset-0 w-full h-full" />
              )}
            </Link>
          ))}
        </div>
        {/* PARITY 24 Nov 2026, Section 5: the MGH YouTube walkthrough,
            with a short MGH Zamindar File spotlight beside it, like
            the old anngan.com. Video ID UxOpwyG6YJA, "Zamindar File,
            MGH Pakistan, best property in Pakistan", 629 views,
            4 Feb 2023, verified from the real Anngan YouTube channel
            (@annganpk). The spotlight text uses only verified facts
            from lib/projectDetails.ts: Pakistan's first and biggest
            natural lake view housing project, 7KM Mangla Gaddari
            Road, Mangla Cantt, Jhelum, Anngan is a Platinum partner,
            Zamindar File 10% quota in balloting, Affidavit MGH,
            Serene Farm Houses in Precincts 05 and 06. No ID guessed,
            no claim invented. The secondary phone is NOT added here:
            +92 320 5966 664 is still unconfirmed with the client. */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2 items-center max-w-5xl mx-auto">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-sm bg-navy">
            <iframe
              src="https://www.youtube-nocookie.com/embed/UxOpwyG6YJA"
              title="MGH Pakistan, Zamindar File walkthrough"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <div>
            <h3 className="font-bold text-navy text-lg">MGH Zamindar File, Mangla</h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              MGH Pakistan at Mangla is Pakistan&apos;s first and biggest natural lake view housing project, on 7KM Mangla Gaddari Road, Mangla Cantt, Jhelum. Anngan is a Platinum partner of the project.
            </p>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              The Zamindar File carries a 10% quota in balloting. Affidavit MGH and Serene Farm Houses in Precincts 05 and 06 are also available. File rates change with the market, call +92 304 1111 698 for today&apos;s rate.
            </p>
            <p className="text-sm mt-3">
              <a href="https://www.youtube.com/watch?v=UxOpwyG6YJA" target="_blank" rel="noopener" className="text-anngan-dark font-semibold underline">Watch on YouTube: MGH Pakistan, Zamindar File</a>
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div className="flex justify-center md:justify-start">
            {/* LIVE-FAIL FIX 24 Nov 2026: ceo-flat.jpg is the original
                unpadded photo (1024x683) AND its radial-gradient
                studio backdrop was flattened in the file itself to
                uniform grey 199 (PIL, border-connected backdrop mask
                only; skin, shirt, hair, eyes untouched). The gradient
                was the real cause of the grey band: its darker top
                strip read as a band on both pages. Do NOT "restore"
                the git-history ceo.jpg original, that brings the band back.
                md:w-[450px], not md:w-auto: w-auto + h-auto left the
                lazy image at 0x0 before it loaded, so on a slow
                connection it never triggered loading at all. A fixed
                width gives it layout size up front. */}
            <Image src="/img/ceo-flat.jpg" alt="Muhammad Mahmood Cheema, Chairman and Chief Executive Officer, Anngan" width={1024} height={683} className="w-full md:w-[450px] md:max-h-[300px] h-auto object-contain object-top rounded-lg" loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-navy">Who is Anngan?</h2>
            <p className="font-bold text-navy mt-2">Muhammad Mahmood Cheema</p>
            <p className="text-sm text-gray-600">Chairman and Chief Executive Officer</p>
            <div className="flex gap-3 mt-4 flex-wrap">
              <span className="border border-gray-200 rounded-lg px-3 py-2 bg-white inline-flex items-center gap-2 font-bold text-navy"><BuildingIcon size={20} /> 7 Projects</span>
              <span className="border border-gray-200 rounded-lg px-3 py-2 bg-white inline-flex items-center gap-2 font-bold text-navy"><HomeIcon size={20} /> 12 Properties</span>
              <span className="border border-gray-200 rounded-lg px-3 py-2 bg-white inline-flex items-center gap-2 font-bold text-navy"><UsersIcon size={20} /> 13 Partner agencies</span>
            </div>
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
