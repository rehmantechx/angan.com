"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProjects, getAgencies } from "../lib/db";
import { getSiteContent, projectCardSrc, cityCardSrc, DEFAULT_SITE_CONTENT, SiteContent } from "../lib/siteContent";
import { Project, PROJECTS, LISTINGS, Agency, AGENCIES } from "../lib/seed";
import { ListingCard } from "../components/ListingCard";
import { StatusBadge } from "../components/StatusBadge";
import { ProjectFallback } from "../components/ProjectFallback";
import { BuildingIcon, HomeIcon, UsersIcon } from "../lib/icons";

// Hero background slider, like the original anngan.com: the photo
// moves continuously (slow Ken Burns zoom and pan) and crossfades to
// the next photo every 10 seconds, loop. Real photos only, all
// already in the repo, no AI, no fake. The slides, title and tagline
// come from the admin settings in /admin (Hero and banners) when the
// office has saved them, and fall back to the built-in list below
// until then, so the hero works before any edit and updates with no
// code change and no redeploy after one.
const HERO_PHOTOS = DEFAULT_SITE_CONTENT.heroSlides;

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
// Pictorial city cards come from the site content (editable in
// /admin, Home page), falling back to the seed list in lib/seed.ts.
// MULTAN LEFT-EDGE FIX 25 Nov 2026: the tomb sits at the far LEFT of
// city-multan-shah-rukn-sky.jpg, so the card uses object-left-top,
// not object-top, to keep the whole tomb in frame. All other cities
// keep object-top, their subjects are centred. Photos are FAMOUS
// landmarks, real photos from Wikimedia Commons, no AI images.
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
  // invisible so it is downloaded before its turn comes. The slides,
  // title and tagline come from the admin settings when the office
  // has saved them, and start from the built-in defaults above.
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [heroSlides, setHeroSlides] = useState(HERO_PHOTOS);
  const [heroTitle, setHeroTitle] = useState(DEFAULT_SITE_CONTENT.heroTitle);
  const [heroTagline, setHeroTagline] = useState(DEFAULT_SITE_CONTENT.heroTagline);
  const [bannerImages, setBannerImages] = useState(DEFAULT_SITE_CONTENT.bannerImages);
  const [ceoPhoto, setCeoPhoto] = useState(DEFAULT_SITE_CONTENT.ceoPhoto);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [agencies, setAgencies] = useState<Agency[]>(AGENCIES);
  const [hero, setHero] = useState(0);
  const [heroPrev, setHeroPrev] = useState<number | null>(null);
  const [heroIn, setHeroIn] = useState(true);
  const [heroPaused, setHeroPaused] = useState(false);
  // Speed: only the first hero photo loads on first paint. The next
  // photo starts downloading 5 seconds in, halfway to its turn, so it
  // is ready for the crossfade but never competes with first paint.
  const [heroPreload, setHeroPreload] = useState(false);
  const heroRef = useRef(0);
  const slidesRef = useRef(heroSlides);
  slidesRef.current = heroSlides;
  const heroNext = (hero + 1) % heroSlides.length;

  function goToHero(i: number) {
    if (i === heroRef.current) return;
    setHeroPrev(heroRef.current);
    heroRef.current = i;
    setHero(i);
    setHeroIn(false);
  }

  useEffect(() => {
    // Every 10 seconds, crossfade to the next real photo, loop.
    // The active photo itself moves continuously the whole time
    // (Ken Burns zoom and pan, see globals.css), so the hero never
    // sits still. Paused while the mouse is over the hero, and off
    // entirely for reduced-motion users. No video, no autoplay sound.
    if (heroPaused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => goToHero((heroRef.current + 1) % slidesRef.current.length), 10000);
    return () => clearInterval(id);
  }, [heroPaused]);

  // Banner images behind the search panel rotate on their own timer.
  useEffect(() => {
    if (bannerImages.length < 2) return;
    const id = setInterval(() => setBannerIdx((i) => (i + 1) % bannerImages.length), 10000);
    return () => clearInterval(id);
  }, [bannerImages.length]);

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
    // live data replaces them only if it differs. The same refresh
    // loads the admin-set hero slides, banner images and agencies,
    // so an office edit shows with no code change and no redeploy.
    const refresh = () => {
      getProjects().then((rows) => { if (rows.length > 0) setProjects(rows); });
      getAgencies().then((rows) => { if (rows.length > 0) setAgencies(rows); });
      getSiteContent().then((c) => {
        setContent(c);
        if (c.heroSlides.length > 0) {
          setHeroSlides(c.heroSlides);
          heroRef.current = 0;
          setHero(0);
          setHeroPrev(null);
        }
        setHeroTitle(c.heroTitle);
        setHeroTagline(c.heroTagline);
        if (c.bannerImages.length > 0) setBannerImages(c.bannerImages);
        setCeoPhoto(c.ceoPhoto);
      });
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
        {heroPrev !== null && heroSlides[heroPrev] ? (
          <Image
            key={"prev-" + heroPrev}
            src={heroSlides[heroPrev].src}
            alt=""
            aria-hidden="true"
            fill
            quality={90}
            sizes="100vw"
            className="absolute inset-0 w-full h-full object-cover opacity-100"
          />
        ) : null}
        {heroSlides[hero] ? (
          <Image
            key={"cur-" + hero}
            src={heroSlides[hero].src}
            alt={heroSlides[hero].alt}
            fill
            priority={hero === 0}
            quality={90}
            sizes="100vw"
            // Ken Burns: the active photo zooms and pans slowly the
            // whole time it is on screen, alternating direction per
            // slide, so the hero moves continuously instead of
            // jumping every 10 seconds.
            className={"absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 " + (hero % 2 === 0 ? "hero-kenburns-a" : "hero-kenburns-b")}
            style={{ opacity: heroIn ? 1 : 0 }}
          />
        ) : null}
        {/* Next photo, invisible, downloaded 5 seconds in so its turn is instant. */}
        {heroPreload && heroSlides[heroNext] ? (
          <Image
            key={"next-" + heroNext}
            src={heroSlides[heroNext].src}
            alt=""
            aria-hidden="true"
            fill
            quality={90}
            sizes="100vw"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-950/45 to-slate-950/75 pointer-events-none" aria-hidden="true" />
        <div className="relative w-full max-w-[82.5rem] mx-auto px-4 md:px-6 py-5 md:py-6 text-center">
          <h1 className="text-white text-2xl sm:text-5xl md:text-6xl font-extrabold mx-auto leading-tight md:whitespace-nowrap [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]">
            {heroTitle}
          </h1>
          <p className="text-white text-lg md:text-2xl font-light mt-3 md:whitespace-nowrap [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]">
            {heroTagline}
          </p>
        </div>
        <div className="absolute bottom-2 right-4 flex gap-1" aria-label="Hero photos">
          {heroSlides.map((p, i) => (
            <button
              key={p.src + i}
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
          /properties: no listing cards ever render on home. The band
          sits over the admin-set banner images (rotating, under a
          dark navy overlay), so the office can change the banner
          photos in /admin without a code change. */}
      <section className="relative overflow-hidden bg-navy px-4 pt-1 pb-3" aria-label="Search properties">
        {bannerImages.map((b, i) => (
          <Image
            key={b.src + i}
            src={b.src}
            alt=""
            aria-hidden="true"
            fill
            quality={90}
            sizes="100vw"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 pointer-events-none"
            style={{ opacity: bannerIdx === i ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-navy/85 pointer-events-none" aria-hidden="true" />
        <div className="relative">
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
        </div>
      </section>

      {/* MARGINS 2026-11-25: everything below the hero and the search
          band sits inside this one root div, so it gets the shared
          container (max-width 1320px, px-4 mobile / px-6 desktop) from globals.css,
          exactly like every other page. Before this, these sections
          were bare children of <main> with no side padding at all. */}
      <div>
      {/* Pictorial: browse by city. Big photo, big city name on the
          photo, click it and you are on that city's listings. Put
          right after the search panel, before Our projects, so it is
          the first thing a visitor sees after the hero and search. */}
      <section className="mt-6" aria-label="Browse by city">
        <h2 className="text-xl font-bold text-navy text-center">{content.homeHeadings.browseCities}</h2>
        <div className="grid gap-4 mt-3 grid-cols-2 lg:grid-cols-4">
          {content.cityCards.map((c) => {
            const n = c.kind === "listings" ? cityCount(c.name) : c.kind === "all" ? LISTINGS.filter((l) => l.liveStatus === "live").length : 0;
            return (
              <Link key={c.name} href={c.href} className="relative block rounded-lg overflow-hidden shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-anngan aspect-[4/3] bg-navy" aria-label={c.kind === "project" ? `${c.name}, ${c.landmark}, ${c.sub}, ${c.sub === "Kashmir Modern City" ? "view project" : "open project"}` : c.landmark ? `${c.name}, ${c.landmark}, ${n} ${n === 1 ? "home" : "homes"}, see listings` : `${c.name}, ${n} ${n === 1 ? "home" : "homes"}, see listings`}>
                {/* FAMOUS PLACES 25 Nov 2026 (user order 00:34 PKT):
                    the landmark must FILL the card, large, clear and
                    well-lit, not a tiny dark silhouette. Lahore and
                    Islamabad were dusk/night shots, so they are now
                    daylight Commons photos, cropped to exact 4/3 in
                    PIL: city-lahore-badshahi-day.jpg (Badshahi Mosque
                    front picture, Romermaia, CC BY-SA 4.0) and
                    city-islamabad-faisal-day.jpg (Faisal Mosque bright
                    Sunny day, Mrfaisal007, CC BY-SA 3.0). Karachi is
                    the same Mazar photo re-cropped to exact 4/3
                    (city-karachi-mazar-wide.jpg) so the whole
                    mausoleum, arches and gardens show, not just the
                    dome. Rawalpindi was the same bazaar street
                    re-cropped to exact 4/3
                    (city-rawalpindi-raja-bazaar-wide.jpg), but the
                    live check 25 Nov 00:55 PKT still found it a
                    tight lane, right building filling half the
                    frame, so it is now a different real photo:
                    "Ariel view of raja bazaar Rawalpindi from
                    rooftop.png", Fahads1982, CC BY-SA 4.0, Wikimedia
                    Commons, cropped to exact 4/3
                    (city-rawalpindi-raja-bazaar-aerial.jpg, 719x539,
                    window y=60..599): a wide rooftop view over the
                    whole bazaar, mosque minaret and dome prominent,
                    golden-hour daylight, not a tight lane. The old
                    building photo ("Old building of raja bazaar
                    Rawalpindi.jpg", same author) was rejected: it is
                    the same building as the right side of the old
                    card, one building filling the frame. All cities
                    was urban-drone.jpg, a dusk/night aerial collage,
                    and the live check 25 Nov failed it as not a
                    daylight view, so it is now
                    city-all-cities-collage.jpg: a 1200x900 collage
                    built in PIL from the four real daylight city
                    photos already on the cards (Lahore Badshahi,
                    Islamabad Faisal, Karachi Mazar, Multan
                    Shah Rukn-e-Alam, left-cropped so the tomb stays
                    in frame), white gutters, no AI, no night photo.
                    urban-drone.jpg stays in the repo: it is still
                    the Urban City project gallery image, but the
                    hero dropped it 25 Nov 2026, it is a 4-quadrant
                    CGI collage, not a real drone photo, and no real
                    high-resolution Lahore housing aerial exists on
                    Commons to replace it. Multan
                    keeps the sky-extended file and object-left-top
                    (25 Nov fix). The old dusk/night files
                    (city-lahore-badshahi-sky.jpg,
                    city-islamabad-faisal-sky.jpg) stay in the repo
                    but are no longer used on any card. PARITY 24 Nov
                    2026, Section 2: object-top, not object-center,
                    and taller 4/3 cards, so the tops of the landmarks
                    are not chopped off. */}
                <Image src={cityCardSrc(c.img)} alt={c.alt} fill quality={90} sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" className={`object-cover ${c.pos || "object-top"}`} />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden="true" />
                <span className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <span className="block text-lg md:text-xl font-extrabold leading-tight drop-shadow">{c.name}</span>
                  {c.landmark ? (
                    <span className="block text-xs font-bold mt-0.5 drop-shadow">{c.landmark}</span>
                  ) : null}
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
          <h2 className="text-2xl font-bold text-navy">{content.homeHeadings.featured}</h2>
          <Link href="/properties" className="text-anngan-dark font-semibold text-sm">All {LISTINGS.filter((l) => l.liveStatus === "live").length} properties &rarr;</Link>
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
        <h2 className="text-2xl font-bold text-navy">{content.homeHeadings.societies}</h2>
        <div className="grid gap-4 mt-4 grid-cols-2 lg:grid-cols-4">
          {content.homeSocieties.map((c) => (
            <Link key={c.name} href={c.href} className="relative block rounded-lg overflow-hidden shadow-sm aspect-[4/3] bg-navy">
              <Image src={cityCardSrc(c.img)} alt={c.name} fill quality={90} sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" className="object-cover object-top" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden="true" />
              <span className="absolute bottom-0 left-0 right-0 p-3 text-white font-extrabold text-lg leading-tight">{c.name} &rarr;</span>
            </Link>
          ))}
          {/* POLISH-01 25 Nov 2026: the DHA Lahore chip still uses
              lst-dha-stunning.jpg, the same house photo as the Featured
              Property card above it. No distinct real DHA Lahore
              society/street photo exists in the repo or on Wikimedia
              Commons; a real one is still needed from the client,
              flagged, not invented. The chips above come from the
              site content (editable in /admin, Home page). */}
        </div>
        <h3 className="font-bold text-navy mt-6">{content.homeHeadings.partnerAgencies}</h3>
        {/* PARTNER MARQUEE 2026-11-25: a proper infinite circular
            strip, not a static grid. The track holds two copies of
            the agency list and slides left by exactly half its own
            width (see globals.css), so logos leaving on the left
            re-enter on the right with no jump, and it pauses on
            hover. The list comes from the admin agency list, so an
            agency added in /admin joins the marquee. Same 13 logos,
            same order, same name label under each logo. */}
        <div className="agency-marquee overflow-hidden mt-3" aria-label="Partner agencies, running strip">
          <div className="agency-marquee-track flex w-max">
            {[0, 1].map((copy) => (
              <div key={copy} aria-hidden={copy === 1} className="flex gap-2 sm:gap-3 pr-2 sm:pr-3 shrink-0">
                {agencies.map((a) => {
                  const src = a.logoUrl || (a.logo ? `/img/${a.logo}` : "");
                  return (
                    <Link key={a.id + "-" + copy} href={a.link || "/contact"} aria-label={a.name + ", partner agency, contact the office"} className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm flex flex-col items-center gap-1 w-[150px] sm:w-[168px] shrink-0">
                      <span className="relative block w-full aspect-[5/4]">
                        {src ? (
                          // Plain img, not next/image: an admin-set
                          // logo URL can be any real http(s) link, and
                          // next/image only serves configured remote
                          // hosts. Local /img files work the same way.
                          // HUNT 26 Nov 2026: loading="lazy" left the
                          // marquee logos unloaded (empty boxes) until
                          // each one slid into view, so a fast scroll
                          // or screenshot showed them broken. 13 small
                          // logos are cheap: load them eagerly so the
                          // strip is complete from the first paint.
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={src} alt={a.name + " logo"} loading="eager" className="absolute inset-0 w-full h-full object-contain p-3" />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center rounded bg-navy text-white text-2xl font-bold">{a.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}</span>
                        )}
                      </span>
                      <span className="text-[11px] sm:text-xs font-bold text-navy text-center leading-tight">{a.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

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
      <section className="mt-10 bg-slate-50 -mx-4 md:-mx-6 px-4 md:px-6 py-8" aria-label="Our projects">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h2 className="text-2xl font-bold text-navy">{content.homeHeadings.ourProjects}</h2>
          <Link href="/projects" className="text-anngan-dark font-semibold text-sm">All {projects.length} projects &rarr;</Link>
        </div>
        {/* PARITY 24 Nov 2026, Section 2: flex flex-wrap
            justify-center, so the 7th card (Kashmir Modern City)
            is centred on the last row instead of a lone orphan on
            the left. */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.id}`} className="relative block rounded-lg overflow-hidden shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-anngan aspect-[16/10] bg-navy w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]" aria-label={`${p.name}, ${p.status === "Sold Out" ? "view project" : "open project"}`}>
              {p.img || p.cardImg ? (
                <>
                  {/* LIVE-FAIL FIX 24 Nov 2026: the Global Homes
                      cover is now a true 16/10 wide crop of the real
                      house photo (global-zamzam-house-wide.jpg), so it
                      fills the card with object-cover object-top, roof
                      intact, no side pillars. The old clean file was a
                      tall portrait, which object-contain squeezed into
                      a narrow strip with white pillars. POLISH-03
                      25 Nov 2026: the top roof's tip still sat on the
                      very top edge of that crop, so the file now has
                      24px of the photo's own night sky above the roof
                      (house shifted down 24px in the same 630x394
                      frame, bottom gate cropped 24px). LIVE-FAIL
                      25 Nov 00:55 PKT: the live check still found the
                      very top roof cut, only eaves visible, no tip or
                      sky above it, because 24px reads as nothing at
                      card size, and the source portrait itself cuts
                      the top roof's ridge at y=0 (red pixels at y=0
                      in global-zamzam-house-clean.jpg and in
                      global-zamzam-house.jpg and global-zamzam-2.jpg,
                      which is also a flyer with Urdu text and logos,
                      rejected). No source file holds the tip, so none
                      can be invented. Fix v2: the file now has 64px
                      of the photo's own night sky above the roof,
                      built column-wise from the portrait's own top
                      sky row (anchors rgb(50,49,170) left,
                      rgb(43,43,159) right, darkened toward the
                      zenith), house shifted down 64px, bottom
                      cropped to portrait row 330. Topmost red pixel
                      is now at y=64, pyramid roof tip intact below
                      it. Every other card stays object-cover.
                      LIVE-FAIL 25 Nov 01:10-01:18 PKT, ROOT CAUSE
                      (proven, not guessed): the file was fine and
                      the boxes were fine (home 362x226, 16/10, same
                      ratio as the file; /projects 360x192 h-48
                      object-top, top rows preserved), but the
                      browser rendered the OLD v0 file: roof at the
                      top edge, sky only at the sides. Proof: the
                      AVIF served for
                      /_next/image?...global-zamzam-house-wide.jpg...
                      decoded with only 46% blue at the top rows
                      (v0), while the same URL as JPEG/WebP and the
                      raw file decoded with 93% blue (v2), and the
                      element canvas sampled the same 46%. Next
                      caches optimized images by URL
                      (minimumCacheTTL 31536000, immutable /img
                      headers), and the filename never changed
                      across e3635e3 v0 and 21fbac3 v2, so the stale
                      AVIF entry kept being served (x-nextjs-cache:
                      HIT). Fix v3: the file is RENAMED to
                      global-zamzam-house-wide-v3.jpg (same v2 bytes,
                      64px sky), so every optimizer URL is new and
                      no stale entry of any size or format can be
                      served, on Vercel or locally. Rule learned:
                      NEVER change an image file's pixels without
                      renaming it. FIX v4 26 Nov 2026: live check
                      found v3's sky band vertically striped (the
                      column-wise sky build) with the roof cut at the
                      top edge. v4 rebuilds the same 64px band as one
                      smooth gradient from the photo's own top-row
                      edge sky, band std 0.00, roof below it with sky
                      above, pyramid peak intact. */}
                  <Image src={projectCardSrc(p)} alt={p.name} fill quality={90} sizes="(max-width: 768px) 50vw, 33vw" loading="lazy" className={(p.cardImg || p.img) === "global-zamzam-house-wide-v4.jpg" ? "object-cover object-top" : "object-cover"} />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden="true" />
                  <span className="absolute top-2 left-2 z-10"><StatusBadge status={p.status} /></span>
                  <span className="absolute bottom-0 left-0 right-0 p-3 text-white font-extrabold text-lg md:text-xl leading-tight drop-shadow">{p.name}</span>
                </>
              ) : (
                <div className="absolute inset-0 w-full h-full">
                  <ProjectFallback name={p.name} loc={p.loc} className="absolute inset-0 w-full h-full" />
                  <span className="absolute top-2 left-2 z-10"><StatusBadge status={p.status} /></span>
                </div>
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
            <h3 className="font-bold text-navy text-lg">{content.homeMghTitle}</h3>
            {content.homeMghText.split(/\n\s*\n/).map((para, i) => (
              <p key={i} className="text-sm text-gray-600 mt-2 leading-relaxed">{para.trim()}</p>
            ))}
            <p className="text-sm mt-3">
              <a href="https://www.youtube.com/watch?v=UxOpwyG6YJA" target="_blank" rel="noopener" className="text-anngan-dark font-semibold underline">Watch on YouTube: MGH Pakistan, Zamindar File</a>
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div className="flex justify-center md:justify-start">
            {/* HOME CEO PHOTO, 26 Nov 2026 (user order): the photo was
                too big and looked wrong. It is now shown at its real
                size, 220px wide on mobile and 240px on desktop, the
                file itself is 215x356, so it is never enlarged or
                stretched. Same real portrait as before
                (ceo-portrait-v2.jpg, head-and-shoulders crop of
                ceo-flat.jpg, head 83.7% of frame at widest row, side
                bands 8.4% / 7.9%), head and shoulders whole, no grey
                bands, no bad crop. /about keeps ceo-flat.jpg and its
                own box, unchanged. */}
            <Image src={ceoPhoto || "/img/ceo-portrait-v2.jpg"} alt="Muhammad Mahmood Cheema, Chairman and Chief Executive Officer, Anngan" width={215} height={356} className="w-[220px] sm:w-[240px] h-auto object-cover object-top rounded-lg bg-white" loading="lazy" sizes="240px" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-navy">{content.homeHeadings.whoIsAnngan}</h2>
            <p className="font-bold text-navy mt-2">Muhammad Mahmood Cheema</p>
            <p className="text-sm text-gray-600">Chairman and Chief Executive Officer</p>
            <div className="flex gap-3 mt-4 flex-wrap">
              <span className="border border-gray-200 rounded-lg px-3 py-2 bg-white inline-flex items-center gap-2 font-bold text-navy"><BuildingIcon size={20} /> {projects.length} Projects</span>
              <span className="border border-gray-200 rounded-lg px-3 py-2 bg-white inline-flex items-center gap-2 font-bold text-navy"><HomeIcon size={20} /> {LISTINGS.filter((l) => l.liveStatus === "live").length} Properties</span>
              <span className="border border-gray-200 rounded-lg px-3 py-2 bg-white inline-flex items-center gap-2 font-bold text-navy"><UsersIcon size={20} /> {agencies.length} Partner agencies</span>
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
