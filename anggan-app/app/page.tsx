"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getPublicListings, getProjects, getAgencies, getServices, getSettings } from "../lib/db";
import { Listing, Project, Agency, Service, OfficeSettings, GRAIN_MARKET } from "../lib/seed";
import { ListingCard } from "../components/ListingCard";
import { EnquiryForm } from "../components/EnquiryForm";

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<OfficeSettings | null>(null);

  useEffect(() => {
    getPublicListings().then(setListings);
    getProjects().then(setProjects);
    getAgencies().then(setAgencies);
    getServices().then(setServices);
    getSettings().then(setSettings);
  }, []);

  const sale = listings.filter((l) => l.status === "sale");
  const rent = listings.filter((l) => l.status === "rent");

  return (
    <div>
      <section className="bg-navy text-white rounded-lg p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold">Find a real home in Pakistan</h1>
        <p className="mt-2 text-gray-200">
          {listings.length} real properties for sale and rent, 7 real projects, and the
          office that answers the phone. No fake listings.
        </p>
        <div className="flex gap-2 mt-5 flex-wrap">
          <Link href="/properties" className="bg-anngan text-white px-4 py-2 rounded font-semibold">See all properties</Link>
          <Link href="/projects" className="bg-white text-navy px-4 py-2 rounded font-semibold">See projects</Link>
          <a href="tel:+923041111698" className="border border-white px-4 py-2 rounded font-semibold">Call {settings?.phone || "+92 304 1111 698"}</a>
        </div>
        <p className="mt-4 text-sm text-gray-300">
          For sale: {sale.length} | For rent: {rent.length} | Lahore {listings.filter((l) => l.city === "Lahore").length} |
          Rawalpindi {listings.filter((l) => l.city === "Rawalpindi").length} | Multan {listings.filter((l) => l.city === "Multan").length} |
          Islamabad {listings.filter((l) => l.city === "Islamabad").length} | Karachi {listings.filter((l) => l.city === "Karachi").length}
        </p>
      </section>

      <section className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-navy">Latest properties</h2>
          <Link href="/properties" className="text-anngan font-semibold text-sm">See all</Link>
        </div>
        <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.slice(0, 6).map((l) => <ListingCard key={l.id} l={l} />)}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-navy">Projects</h2>
          <Link href="/projects" className="text-anngan font-semibold text-sm">See all 7 projects</Link>
        </div>
        <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <article key={p.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
              {p.img ? (
                <img src={`/img/${p.img}`} alt={p.name} className="w-full h-40 object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-40 bg-gold/40 flex flex-col items-center justify-center text-navy text-sm font-semibold px-4 text-center">
                  <span>{p.name}</span>
                  {GRAIN_MARKET.prices.map((x) => <span key={x.size}>{x.size} {x.price}</span>)}
                  <span>No photo for this project yet</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-gray-600 text-sm">{p.loc}</p>
                <p className="text-sm mt-1">{p.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-navy">Ask the office</h2>
          <p className="text-sm text-gray-600 mt-1">Send an enquiry. It goes straight to the office dashboard.</p>
          <div className="mt-3">
            <EnquiryForm asked="General enquiry" compact />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-navy">Angan Tech services</h2>
          <ul className="mt-3 space-y-2">
            {services.map((s) => (
              <li key={s.id} className="border border-gray-200 rounded p-3">
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-gray-600">{s.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-navy">Our partners</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-4">
          {agencies.map((a) => (
            <div key={a.id} className="border border-gray-200 rounded p-2 flex items-center justify-center bg-white">
              <img src={`/img/${a.logo}`} alt={a.name} title={a.name} className="max-h-12 w-auto object-contain" loading="lazy" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
