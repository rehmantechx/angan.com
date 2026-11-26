// Project gallery, rebuilt 26 Nov 2026 (user order: the MGH picture
// layout was bad). Pictorial only: one big photo first, then the rest
// in a clean two-column grid, every photo the same size, one short
// plain caption under each (2-4 words). Real photos only, in story
// order. Tap a photo to zoom; Next and Prev move through the photos
// (see Lightbox, bubbling fix 26 Nov 2026).
// The map is NOT in the photo grid: it has small text in it, so it
// gets its own full-width row with the whole map showing, nothing
// cut. The allotment letter is a document, not a photo, and keeps its
// own centred row below the photos.
"use client";
import Image from "next/image";
import { GalleryLightbox } from "./Lightbox";

export function ProjectGallery({
  galleryPhotos,
  mapPhotos,
  documentPhotos,
}: {
  galleryPhotos: { file: string; caption: string }[];
  mapPhotos: { file: string; caption: string }[];
  documentPhotos: { file: string; caption: string }[];
}) {
  const allImages = [...galleryPhotos, ...mapPhotos, ...documentPhotos].map((ph) => ({
    src: `/img/${ph.file}`,
    alt: ph.caption,
  }));
  const galleryCount = galleryPhotos.length;
  const mapCount = mapPhotos.length;
  return (
    <>
      {galleryCount > 0 ? (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-navy">Photos</h2>
          <p className="text-sm text-gray-600 mt-1">Tap a photo to see it big.</p>
          <GalleryLightbox images={allImages}>
            {(open) => (
              <div className="grid gap-4 mt-4 sm:grid-cols-2">
                {galleryPhotos.map((ph, i) => (
                  <figure key={ph.file} className={i === 0 ? "sm:col-span-2" : ""}>
                    <button type="button" onClick={() => open(i)} className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-anngan rounded-lg" aria-label={"Zoom photo: " + ph.caption}>
                      <Image src={`/img/${ph.file}`} alt={ph.caption} width={1200} height={750} className="w-full aspect-[16/10] rounded-lg object-cover bg-white border border-gray-200" loading={i === 0 ? "eager" : "lazy"} sizes={i === 0 ? "100vw" : "(max-width: 768px) 100vw, 50vw"} />
                    </button>
                    <figcaption className="font-bold text-navy mt-2">{ph.caption}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </GalleryLightbox>
        </div>
      ) : null}
      {mapCount > 0 ? (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-navy">Where is it</h2>
          <GalleryLightbox images={allImages}>
            {(open) => (
              <div>
                {mapPhotos.map((ph, mi) => (
                  <figure key={ph.file} className="mt-3">
                    <button type="button" onClick={() => open(galleryCount + mi)} className="block w-full focus:outline-none focus:ring-2 focus:ring-anngan rounded-lg" aria-label={"Zoom map: " + ph.caption}>
                      <Image src={`/img/${ph.file}`} alt={ph.caption} width={1200} height={675} className="w-full h-auto rounded-lg object-contain bg-white border border-gray-200 p-2" loading="lazy" sizes="100vw" />
                    </button>
                    <figcaption className="font-bold text-navy mt-2">{ph.caption}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </GalleryLightbox>
        </div>
      ) : null}
      {documentPhotos.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-navy text-center">Document</h2>
          <GalleryLightbox images={allImages}>
            {(open) => (
              <div>
                {documentPhotos.map((ph, di) => (
                  <figure key={ph.file} className="max-w-[480px] mx-auto mt-3">
                    <button type="button" onClick={() => open(galleryCount + mapCount + di)} className="block w-full focus:outline-none focus:ring-2 focus:ring-anngan rounded-lg" aria-label={"Zoom document: " + ph.caption}>
                      <Image src={`/img/${ph.file}`} alt={ph.caption} width={1114} height={1747} className="w-full h-auto rounded-lg bg-white border border-gray-200" loading="lazy" sizes="480px" />
                    </button>
                    <figcaption className="font-bold text-navy mt-2 text-center">{ph.caption}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </GalleryLightbox>
        </div>
      ) : null}
    </>
  );
}
