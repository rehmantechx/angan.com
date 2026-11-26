"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LISTINGS } from "../../../lib/seed";
import { getListingById, getSettings } from "../../../lib/db";
import { SETTINGS, OfficeSettings } from "../../../lib/seed";
import { EnquiryForm } from "../../../components/EnquiryForm";
import { Lightbox, GalleryLightbox } from "../../../components/Lightbox";
import { formatPrice, whatsappFor } from "../../../lib/formatPrice";
import { BedIcon, BathIcon, SizeIcon, HomeIcon } from "../../../lib/icons";
import { ListingCard } from "../../../components/ListingCard";
import type { Listing } from "../../../lib/seed";

export default function PropertyPage({ params }: { params: { id: string } }) {
  const [l, setL] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<OfficeSettings>(SETTINGS);
  useEffect(() => { getSettings().then((s) => setSettings(s)).catch(() => {}); }, []);

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
      <p className="text-anngan-dark font-extrabold text-3xl mt-3">{formatPrice(l.n, l.status)}</p>
      <p className="mt-2"><span className={l.status === "rent" ? "bg-[#005F90] text-white text-xs font-extrabold px-3 py-1.5 rounded-full" : "bg-anngan text-white text-xs font-extrabold px-3 py-1.5 rounded-full"}>{l.status === "rent" ? "FOR RENT" : "FOR SALE"}</span></p>

      {(() => {
        // PHOTOS 26 Nov 2026: a listing can now carry several photos
        // (create-listing needs at least 3). Show them all as one
        // gallery: one big photo first, small photos under it, tap any
        // photo to zoom, Next and Prev move through them. A listing
        // with one photo shows that one photo, as before.
        const srcs = l.photos && l.photos.length > 0 ? l.photos : l.img ? [l.img] : [];
        const images = srcs.map((s) => ({ src: s.startsWith("http") ? s : `/img/${s}`, alt: l.title }));
        if (images.length === 0) return null;
        if (images.length === 1) {
          return (
            <div className="mt-5">
              <Lightbox images={images} label={l.title} />
            </div>
          );
        }
        return (
          <div className="mt-5">
            <p className="text-sm text-gray-600">Tap a photo to see it big. {images.length} photos.</p>
            <GalleryLightbox images={images}>
              {(open) => (
                <div className="mt-2">
                  <button type="button" onClick={() => open(0)} className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-anngan rounded-lg" aria-label={"Zoom photo 1 of " + images.length}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={images[0].src} alt={l.title} className="w-full h-auto rounded-lg object-contain bg-navy" />
                  </button>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {images.map((im, i) => (
                      <button key={im.src + i} type="button" onClick={() => open(i)} className="block focus:outline-none focus:ring-2 focus:ring-anngan rounded-lg" aria-label={"Zoom photo " + (i + 1) + " of " + images.length}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={im.src} alt={l.title + " photo " + (i + 1)} className="w-full aspect-square object-cover rounded-lg bg-gray-100 border border-gray-200" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </GalleryLightbox>
          </div>
        );
      })()}

      <div className="grid gap-6 mt-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-navy">Property facts</h2>
          <div className="flex gap-3 mt-3 flex-wrap text-sm text-navy font-semibold">
            <span className="inline-flex items-center gap-1"><BedIcon size={18} /> {l.beds} Beds</span>
            <span className="inline-flex items-center gap-1"><BathIcon size={18} /> {l.baths} Baths</span>
            <span className="inline-flex items-center gap-1"><SizeIcon size={18} /> {l.size}</span>
            <span className="inline-flex items-center gap-1"><HomeIcon size={18} /> {l.type}</span>
          </div>
          <dl className="mt-3 border border-gray-200 rounded-lg divide-y divide-gray-200 bg-white">
            {[
              ["Price", formatPrice(l.n, l.status)],
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
            {/* PHN-01: Call is blue everywhere, WhatsApp green. */}
            <a href={"tel:+" + settings.phone.replace(/[^0-9]/g, "").replace(/^0+/, "")} className="btn btn-navy">Call {settings.phone}</a>
            <a href={whatsappFor(l.title, l.city, formatPrice(l.n, l.status), settings.whatsapp)} target="_blank" rel="noopener" className="btn btn-green">WhatsApp</a>
          </div>
        </div>
        <div>
          <EnquiryForm asked={l.title} compact />
          <p className="mt-4 text-sm">
            <Link href="/properties" className="text-anngan-dark font-semibold underline">Back to all properties</Link>
          </p>
        </div>
        {others.length > 0 ? (
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-navy">More in {l.city}</h2>
            <div className="grid gap-4 mt-3 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((o) => (
                <ListingCard key={o.id} l={o} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
