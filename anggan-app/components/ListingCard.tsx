"use client";
import Image from "next/image";
import Link from "next/link";
import { Listing } from "../lib/seed";

export function ListingCard({ l }: { l: Listing }) {
  return (
    <article className="card border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-full">
      {l.img ? (
        <Link href={`/properties/${l.id}`} aria-label={l.title}>
        <Image
          src={l.img.startsWith("http") ? l.img : `/img/${l.img}`}
          alt={l.title}
          width={592}
          height={444}
          className="w-full h-48 object-cover bg-navy"
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        </Link>
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-600 text-sm px-4 text-center">
          No photo for this property yet
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-anngan-dark font-bold text-lg">{l.price}</p>
        <h3 className="font-semibold mt-1 line-clamp-2"><Link href={`/properties/${l.id}`} className="text-navy hover:text-anngan-dark">{l.title}</Link></h3>
        <p className="text-gray-600 text-sm mt-1">{l.loc}</p>
        <p className="text-gray-600 text-sm mt-2">
          {l.beds} Beds | {l.baths} Baths | {l.size} | {l.type}
        </p>
        <div className="flex gap-2 mt-auto pt-3 flex-wrap">
          <a href="tel:+923041111698" className="btn btn-red">Call</a>
          <a href="https://wa.me/923041111698" target="_blank" rel="noopener" className="btn btn-green">WhatsApp</a>
          <Link href={`/properties/${l.id}`} className="btn btn-outline-navy">Details</Link>
          {l.url ? (
            <a href={l.url} target="_blank" rel="noopener" className="btn btn-outline-navy">On anngan.com</a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
