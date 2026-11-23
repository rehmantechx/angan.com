"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getPublicListings } from "../../lib/db";
import { Listing, LISTINGS } from "../../lib/seed";
import { ListingCard } from "../../components/ListingCard";
import { matchesKey, budgetOK } from "../../lib/search";

const BUDGETS = [
  { value: "", label: "Any budget" },
  { value: "under-1cr", label: "Under Rs 1 Crore" },
  { value: "1cr-5cr", label: "Rs 1 Crore to Rs 5 Crore" },
  { value: "above-5cr", label: "Above Rs 5 Crore" },
] as const;

// Size in sqft, for sorting: 1 Marla = 272.25 sqft, 1 Kanal = 20 Marla.
function sizeSqft(size: string): number {
  const n = parseFloat(size);
  if (Number.isNaN(n)) return 0;
  if (size.includes("Kanal")) return n * 5445;
  return n * 272.25;
}

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "size-small", label: "Size: small to large" },
  { value: "size-large", label: "Size: large to small" },
] as const;

function PropertiesPage() {
  // Same as home: show the 12 real seed listings at once, and only
  // replace them when Firestore actually returns rows. Starting empty
  // showed "0 real properties" while Firestore was still loading or
  // empty, even though home showed 12.
  const [listings, setListings] = useState<Listing[]>(LISTINGS.filter((l) => l.liveStatus === "live" && l.visible !== false));
  const params = useSearchParams();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [beds, setBeds] = useState("");
  const [size, setSize] = useState("");
  const [budget, setBudget] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    getPublicListings().then((rows) => { if (rows.length > 0) setListings(rows); });
  }, []);

  // Read the filters once from the URL on first paint, so a filtered
  // link can be shared or bookmarked.
  useEffect(() => {
    if (params.get("q")) setQ(params.get("q") || "");
    if (params.get("city")) setCity(params.get("city") || "");
    if (params.get("status")) setStatus(params.get("status") || "");
    if (params.get("beds")) setBeds(params.get("beds") || "");
    if (params.get("size")) setSize(params.get("size") || "");
    if (params.get("budget")) setBudget(params.get("budget") || "");
    if (params.get("sort")) setSort(params.get("sort") || "newest");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the URL in sync with the filters, so the current view can be
  // shared or bookmarked. replaceState, so the back button is not
  // filled with one entry per keystroke.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const qs = new URLSearchParams();
    if (q.trim()) qs.set("q", q.trim());
    if (city) qs.set("city", city);
    if (status) qs.set("status", status);
    if (beds) qs.set("beds", beds);
    if (size) qs.set("size", size);
    if (budget) qs.set("budget", budget);
    if (sort !== "newest") qs.set("sort", sort);
    const url = qs.toString() ? "/properties?" + qs.toString() : "/properties";
    window.history.replaceState(null, "", url);
  }, [q, city, status, beds, size, budget, sort]);

  // Cities come only from the active listings, so Mangla and Kashmir,
  // which have projects but no property listings, never appear here.
  const cities = useMemo(() => {
    const seen: string[] = [];
    for (const l of listings) if (!seen.includes(l.city)) seen.push(l.city);
    return seen;
  }, [listings]);
  const sizes = useMemo(() => {
    const seen: string[] = [];
    for (const l of listings) if (!seen.includes(l.size)) seen.push(l.size);
    return seen;
  }, [listings]);

  const results = useMemo(() => {
    const key = q.trim().toLowerCase();
    const out = listings.filter((l) => {
      if (city && l.city !== city) return false;
      if (status && l.status !== status) return false;
      if (beds) {
        if (beds === "5+") {
          if (l.beds < 5) return false;
        } else if (l.beds !== parseInt(beds, 10)) return false;
      }
      if (size && l.size !== size) return false;
      // Budget is a sale price (under-1cr / 1cr-5cr / above-5cr from
      // the home search). Rent listings always pass it: their n is
      // a monthly rent, not a sale price.
      if (!budgetOK(l, budget)) return false;
      if (key) {
        const hay = l.title + " " + l.loc + " " + l.city + " " + l.size + " " + l.type;
        if (!matchesKey(hay, key)) return false;
      }
      return true;
    });
    if (sort === "price-low") out.sort((a, b) => a.n - b.n);
    if (sort === "price-high") out.sort((a, b) => b.n - a.n);
    if (sort === "size-small") out.sort((a, b) => sizeSqft(a.size) - sizeSqft(b.size));
    if (sort === "size-large") out.sort((a, b) => sizeSqft(b.size) - sizeSqft(a.size));
    return out;
  }, [listings, q, city, status, beds, size, budget, sort]);

  const anyFilter = q.trim() !== "" || city !== "" || status !== "" || beds !== "" || size !== "" || budget !== "" || sort !== "newest";
  const budgetLabel = BUDGETS.find((b) => b.value === budget)?.label || "";
  function clearFilters() {
    setQ(""); setCity(""); setStatus(""); setBeds(""); setSize(""); setBudget(""); setSort("newest");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">Properties</h1>
      <p className="text-gray-600 mt-1">{listings.length} real properties. Only live, approved listings are shown here.</p>

      <div className="grid gap-2 mt-4 sm:grid-cols-2 lg:grid-cols-7 bg-gray-50 border border-gray-200 rounded-lg p-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search listings" aria-label="Search listings by word, area or society" className="border border-gray-300 rounded px-3 py-2 min-w-0 w-full min-h-[48px] lg:col-span-2" />
        <select value={city} onChange={(e) => setCity(e.target.value)} aria-label="City" className="border border-gray-300 rounded px-3 py-2 min-w-0 w-full min-h-[48px]">
          <option value="">All cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="For sale or rent" className="border border-gray-300 rounded px-3 py-2 min-w-0 w-full min-h-[48px]">
          <option value="">For sale or rent</option>
          <option value="sale">For sale</option>
          <option value="rent">For rent</option>
        </select>
        <select value={beds} onChange={(e) => setBeds(e.target.value)} aria-label="Bedrooms" className="border border-gray-300 rounded px-3 py-2 min-w-0 w-full min-h-[48px]">
          <option value="">Any beds</option>
          <option value="2">2 beds</option>
          <option value="3">3 beds</option>
          <option value="4">4 beds</option>
          <option value="5+">5+ beds</option>
        </select>
        <select value={size} onChange={(e) => setSize(e.target.value)} aria-label="Size" className="border border-gray-300 rounded px-3 py-2 min-w-0 w-full min-h-[48px]">
          <option value="">Any size</option>
          {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={budget} onChange={(e) => setBudget(e.target.value)} aria-label="Max. Price" className="border border-gray-300 rounded px-3 py-2 min-w-0 w-full min-h-[48px]">
          {BUDGETS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
        </select>
      </div>

      <div className="flex gap-2 mt-3 flex-wrap items-center">
        <label htmlFor="sort" className="text-sm font-bold text-gray-700">Sort by</label>
        <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="border border-gray-300 rounded px-3 py-2 min-h-[48px]">
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        {anyFilter ? (
          <button type="button" onClick={clearFilters} className="btn btn-outline-navy">Clear filters</button>
        ) : null}
        {budget ? (
          <span className="bg-navy text-white text-sm rounded-full px-3 py-2 inline-flex items-center gap-2">
            Budget: {budgetLabel}
            <button type="button" onClick={() => setBudget("")} aria-label="Clear budget filter" className="font-bold min-w-[24px] min-h-[24px] inline-flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
          </span>
        ) : null}
      </div>

      <p className="mt-4 text-sm font-semibold">
        {results.length === 0
          ? "No exact match on anngan.com for that search. The nearest real listings are in Lahore. Call +92 304 1111 698 to ask."
          : `Found ${results.length} ${results.length === 1 ? "listing" : "listings"}.`}
        {city === "Karachi" && results.length === 1 ? " Karachi has only 1 real listing on anngan.com, the Shamsi Society flat." : ""}
      </p>

      {results.length === 0 ? (
        <div>
          <h2 className="text-lg font-bold text-navy mt-2">Nearest real listings in Lahore</h2>
          <p className="text-sm text-gray-600 mt-1">These are not search results. They are the nearest real listings, shown because nothing matched your search.</p>
        </div>
      ) : null}
      <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
        {(results.length > 0 ? results : listings.filter((l) => l.city === "Lahore").slice(0, 3)).map((l) => (
          <ListingCard key={l.id} l={l} />
        ))}
      </div>
    </div>
  );
}

export default function Properties() {
  return (
    <Suspense fallback={<p className="mt-4 text-sm text-gray-600">Loading properties...</p>}>
      <PropertiesPage />
    </Suspense>
  );
}
