"use client";
import { useEffect, useMemo, useState } from "react";
import { getPublicListings } from "../../lib/db";
import { Listing, LISTINGS } from "../../lib/seed";
import { ListingCard } from "../../components/ListingCard";
import { matchesKey } from "../../lib/search";

const CITIES = ["", "Lahore", "Karachi", "Rawalpindi", "Multan", "Islamabad", "Mangla", "Kashmir"];

export default function PropertiesPage() {
  // Same as home: show the 12 real seed listings at once, and only
  // replace them when Firestore actually returns rows. Starting empty
  // showed "0 real properties" while Firestore was still loading or
  // empty, even though home showed 12.
  const [listings, setListings] = useState<Listing[]>(LISTINGS.filter((l) => l.liveStatus === "live" && l.visible !== false));
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [beds, setBeds] = useState("");
  const [size, setSize] = useState("");

  useEffect(() => {
    getPublicListings().then((rows) => { if (rows.length > 0) setListings(rows); });
    if (typeof window !== "undefined") {
      const qs = new URLSearchParams(window.location.search);
      if (qs.get("q")) setQ(qs.get("q") || "");
      if (qs.get("city")) setCity(qs.get("city") || "");
    }
  }, []);

  const results = useMemo(() => {
    const key = q.trim().toLowerCase();
    return listings.filter((l) => {
      if (city && l.city !== city) return false;
      if (status && l.status !== status) return false;
      if (beds) {
        if (beds === "5+") {
          if (l.beds < 5) return false;
        } else if (l.beds !== parseInt(beds, 10)) return false;
      }
      if (size && l.size !== size) return false;
      if (key) {
        const hay = l.title + " " + l.loc + " " + l.city + " " + l.size + " " + l.type;
        if (!matchesKey(hay, key)) return false;
      }
      return true;
    });
  }, [listings, q, city, status, beds, size]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">Properties</h1>
      <p className="text-gray-600 mt-1">{listings.length} real properties. Only live, approved listings are shown here.</p>

      <div className="grid gap-2 mt-4 sm:grid-cols-2 lg:grid-cols-6 bg-gray-50 border border-gray-200 rounded-lg p-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search listings" aria-label="Search listings by word, area or society" className="border border-gray-300 rounded px-3 py-2 min-w-0 w-full min-h-[48px] lg:col-span-2" />
        <select value={city} onChange={(e) => setCity(e.target.value)} className="border border-gray-300 rounded px-3 py-2 min-w-0 w-full min-h-[48px]">
          <option value="">All cities</option>
          {CITIES.filter(Boolean).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-300 rounded px-3 py-2 min-w-0 w-full min-h-[48px]">
          <option value="">For sale or rent</option>
          <option value="sale">For sale</option>
          <option value="rent">For rent</option>
        </select>
        <select value={beds} onChange={(e) => setBeds(e.target.value)} className="border border-gray-300 rounded px-3 py-2 min-w-0 w-full min-h-[48px]">
          <option value="">Any beds</option>
          <option value="2">2 beds</option>
          <option value="3">3 beds</option>
          <option value="4">4 beds</option>
          <option value="5+">5+ beds</option>
        </select>
        <select value={size} onChange={(e) => setSize(e.target.value)} className="border border-gray-300 rounded px-3 py-2 min-w-0 w-full min-h-[48px]">
          <option value="">Any size</option>
          <option value="4 Marla">4 Marla</option>
          <option value="5 Marla">5 Marla</option>
          <option value="6 Marla">6 Marla</option>
          <option value="10 Marla">10 Marla</option>
          <option value="1 Kanal">1 Kanal</option>
        </select>
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
