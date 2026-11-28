"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Listing, SETTINGS, OfficeSettings } from "../lib/seed";
import { getSettings } from "../lib/db";
import { formatPrice, whatsappFor } from "../lib/formatPrice";
import { BedIcon, BathIcon, SizeIcon, HomeIcon } from "../lib/icons";

// Pictorial dealer card: big photo, bold colour-coded FOR SALE (red)
// / FOR RENT (blue) pill on the photo, dealer-friendly Crore/Lac
// price, and bed / bath / size / type as icons, not pipe text.
// WhatsApp is pre-filled with the exact title, city and price.
export function ListingCard({ l }: { l: Listing }) {
  const [settings, setSettings] = useState<OfficeSettings>(SETTINGS);
  useEffect(() => { getSettings().then((s) => setSettings(s)).catch(() => {}); }, []);
  const price = formatPrice(l.n, l.status);
  const telHref = "tel:+" + settings.phone.replace(/[^0-9]/g, "").replace(/^0+/, "");
  const pill = l.status === "rent" ? "FOR RENT" : "FOR SALE";
  const pillCls = l.status === "rent" ? "bg-[#005F90]" : "bg-anngan";
  return (
    <article className="card border border-slate-200 rounded-lg overflow-hidden bg-white shadow-[0_2px_14px_rgba(0,66,116,0.10)] flex flex-col h-full">
      {l.img ? (
        <Link href={`/properties/${l.id}`} aria-label={l.title} className="relative block">
          <Image
            src={l.img.startsWith("http") ? l.img : `/img/${l.img}`}
            alt={l.title}
            width={592}
            height={444}
            className="w-full h-48 object-cover bg-navy"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <span className={`absolute top-3 left-3 ${pillCls} text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow`}>{pill}</span>
        </Link>
      ) : (
        // CRUD-07: an imageless card gets the same FOR SALE / FOR RENT
        // pill as a photo card, on the grey placeholder, so a new
        // listing without a photo is still clearly marked.
        <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center text-gray-600 text-sm px-4 text-center">
          <span className={`absolute top-3 left-3 ${pillCls} text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow`}>{pill}</span>
          No photo for this property yet
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-anngan-dark font-extrabold text-xl">{price}</p>
        <h3 className="font-semibold mt-1 line-clamp-2"><Link href={`/properties/${l.id}`} className="text-navy hover:text-anngan-dark">{l.title}</Link></h3>
        <p className="text-gray-600 text-sm mt-1">{l.loc}</p>
        <div className="flex gap-3 mt-3 flex-wrap text-sm text-navy font-semibold" aria-label={`${l.beds} beds, ${l.baths} baths, ${l.size}, ${l.type}`}>
          <span className="inline-flex items-center gap-1"><BedIcon size={18} /> {l.beds} Beds</span>
          <span className="inline-flex items-center gap-1"><BathIcon size={18} /> {l.baths} Baths</span>
          <span className="inline-flex items-center gap-1"><SizeIcon size={18} /> {l.size}</span>
          <span className="inline-flex items-center gap-1"><HomeIcon size={18} /> {l.type}</span>
        </div>
        {/* PHN-01 / PHN-02: one site-wide color rule, Green = WhatsApp,
            Blue = Call, Red = Search / View / Primary. Button order is
            the same on every card: Details first, then Call (blue),
            then WhatsApp (green), so "click the first button" always
            means Details. */}
        <div className="flex gap-2 mt-auto pt-3 flex-wrap">
          <Link href={`/properties/${l.id}`} className="btn btn-outline-navy">Details</Link>
          <a href={telHref} className="btn btn-navy">Call</a>
          <a href={whatsappFor(l.title, l.city, price, settings.whatsapp)} target="_blank" rel="noopener" className="btn btn-green">WhatsApp</a>
        </div>
      </div>
    </article>
  );
}
