"use client";
import Image from "next/image";
import { GalleryLightbox } from "./Lightbox";

// Client wrapper so the server project page can pass plain photo data
// (serializable props) and the lightbox still opens at the clicked
// photo. Gallery photos use object-cover at 16/10, no grey bars; the
// allotment letter keeps its natural portrait height, no fixed aspect.
export function ProjectGallery({
  galleryPhotos,
  documentPhotos,
}: {
  galleryPhotos: { file: string; caption: string }[];
  documentPhotos: { file: string; caption: string }[];
}) {
  const allImages = [...galleryPhotos, ...documentPhotos].map((ph) => ({
    src: `/img/${ph.file}`,
    alt: ph.caption,
  }));
  const galleryCount = galleryPhotos.length;
  return (
    <>
      {galleryCount > 0 ? (
        <GalleryLightbox images={allImages}>
          {(open) => (
            <div className="grid gap-4 mt-5 sm:grid-cols-2">
              {galleryPhotos.map((ph, i) => {
                const lastSingle = i === galleryCount - 1 && i > 0 && (galleryCount - 1) % 2 === 1;
                return (
                  <figure key={ph.file} className={i === 0 || lastSingle ? "sm:col-span-2" : ""}>
                    <button type="button" onClick={() => open(i)} className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-anngan rounded-lg" aria-label={"Zoom photo: " + ph.caption}>
                      <Image src={`/img/${ph.file}`} alt={ph.caption} width={1200} height={675} className="w-full rounded-lg object-cover bg-navy border border-gray-200 aspect-[16/10]" loading={i === 0 ? "eager" : "lazy"} sizes="(max-width: 768px) 100vw, 60vw" />
                    </button>
                    <figcaption className="text-sm text-gray-600 mt-1">{ph.caption} &middot; Tap to zoom</figcaption>
                  </figure>
                );
              })}
            </div>
          )}
        </GalleryLightbox>
      ) : null}
      {documentPhotos.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-navy text-center">Document</h2>
          <GalleryLightbox images={allImages}>
            {(open) => (
              <div>
                {documentPhotos.map((ph, di) => (
                  <figure key={ph.file} className="max-w-[480px] mx-auto mt-3">
                    <button type="button" onClick={() => open(galleryCount + di)} className="block w-full focus:outline-none focus:ring-2 focus:ring-anngan rounded-lg" aria-label={"Zoom document: " + ph.caption}>
                      <Image src={`/img/${ph.file}`} alt={ph.caption} width={1114} height={1747} className="w-full h-auto rounded-lg bg-white border border-gray-200" loading="lazy" sizes="480px" />
                    </button>
                    <figcaption className="text-sm text-gray-600 mt-1 text-center">{ph.caption} &middot; Tap to zoom</figcaption>
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
