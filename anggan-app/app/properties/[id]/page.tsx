"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LISTINGS } from "../../../lib/seed";
import { getListingById } from "../../../lib/db";
import { EnquiryForm } from "../../../components/EnquiryForm";
import type { Listing } from "../../../lib/seed";

export default function PropertyPage({ params }: { params: { id: string } }) {
  const [l, setL] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // Seed first, then a Firestore document read by id, then the local
    // store. A live listing created in the dashboard is not in the seed,
    // so the old seed-only lookup 404ed for every new listing. The fetch
    // runs in the browser, the same path the /properties list uses, so it
    // sees Firestore listings and local test-mode listings alike.
    getListingById(params.id).then((row) => {
      if (cancelled) return;
      setL(row && row.liveStatus === "live" && row.visible !== false ? row : null);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (loading) return <p>Loading property...</p>;
  if (!l) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-navy">Property not found</h1>
        <p className="mt-2 text-gray-600">This property does not exist, or it is not live yet.</p>
        <p className="mt-4">
          <Link href="/properties" className="text-anngan-dark font-semibold underline">Back to all properties</Link>
        </p>
      </div>
    );
  }
  const others = LISTINGS.filter((x) => x.id !== l.id && x.city === l.city).slice(0, 3);

  return (
    <div>
      <p className="text-sm">
        <Link href="/properties" className="text-anngan-dark font-semibold">All properties</Link>
        <span className="text-gray-600"> / {l.title}</span>
      </p>
      <h1 className="text-3xl font-bold text-navy mt-2">{l.title}</h1>
      <p className="text-gray-600 mt-1">{l.loc}</p>
      <p className="text-anngan-dark font-bold text-2xl mt-3">{l.price}</p>
      {l.badge ? <p className="mt-2"><span className="bg-anngan text-white text-xs font-bold px-2 py-1 rounded">{l.badge}</span></p> : null}

      {l.img ? (
        <Image
          src={l.img.startsWith("http") ? l.img : `/img/${l.img}`}
          alt={l.title}
          width={1200}
          height={675}
          className="w-full rounded-lg object-cover bg-navy mt-5"
          sizes="100vw"
        />
      ) : null}

      <div className="grid gap-6 mt-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-navy">Property facts</h2>
          <dl className="mt-3 border border-gray-200 rounded-lg divide-y divide-gray-200 bg-white">
            {[
              ["Price", l.price],
              ["City", l.city],
              ["Area", l.loc],
              ["Size", l.size],
              ["Type", l.type],
              ["Bedrooms", String(l.beds)],
              ["Bathrooms", String(l.baths)],
              ["For", l.status === "sale" ? "Sale" : "Rent"],
            ].map(([label, value]) => (
              <div key={label} className="grid grid-cols-3 gap-2 px-4 py-2 text-sm">
                <dt className="font-semibold text-navy">{label}</dt>
                <dd className="col-span-2">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex gap-2 mt-4 flex-wrap">
            <a href="tel:+923041111698" className="btn btn-red">Call +92 304 1111 698</a>
            <a href="https://wa.me/923041111698" target="_blank" rel="noopener" className="btn btn-green">WhatsApp</a>
            {l.url ? (
              <a href={l.url} target="_blank" rel="noopener" className="btn btn-outline-navy">On anngan.com</a>
            ) : null}
          </div>
          {others.length > 0 ? (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-navy">More in {l.city}</h2>
              <ul className="mt-3 space-y-2">
                {others.map((o) => (
                  <li key={o.id}>
                    <Link href={`/properties/${o.id}`} className="text-anngan-dark font-semibold hover:underline">{o.title} &middot; {o.price}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <div>
          <EnquiryForm asked={l.title} compact />
          <p className="mt-4 text-sm">
            <Link href="/properties" className="text-anngan-dark font-semibold underline">Back to all properties</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
