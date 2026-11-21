"use client";
import { Listing } from "../lib/seed";

export function ListingCard({ l }: { l: Listing }) {
  return (
    <article className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {l.img ? (
        <img src={`/img/${l.img}`} alt={l.title} className="w-full h-48 object-cover" loading="lazy" />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500 text-sm px-4 text-center">
          No photo for this property yet
        </div>
      )}
      <div className="p-4">
        <p className="text-anngan font-bold text-lg">{l.price}</p>
        <h3 className="font-semibold mt-1">{l.title}</h3>
        <p className="text-gray-600 text-sm mt-1">{l.loc}</p>
        <p className="text-gray-600 text-sm mt-2">
          {l.beds} Beds | {l.baths} Baths | {l.size} | {l.type}
        </p>
        <div className="flex gap-2 mt-3">
          <a href="tel:+923041111698" className="bg-anngan text-white text-sm px-3 py-1.5 rounded">Call</a>
          <a href="https://wa.me/923041111698" target="_blank" rel="noopener" className="bg-green-600 text-white text-sm px-3 py-1.5 rounded">WhatsApp</a>
          {l.url ? (
            <a href={l.url} target="_blank" rel="noopener" className="border border-navy text-navy text-sm px-3 py-1.5 rounded">On anngan.com</a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
