"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

// Tap-to-zoom lightbox: click any photo, see it full-screen, tap X or
// Esc or the dark background to close. Prev/next arrows step through
// the whole gallery, so the MGH allotment letter is readable zoomed.
export function Lightbox({
  images,
  start = 0,
  label,
}: {
  images: { src: string; alt: string }[];
  start?: number;
  label: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % images.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, images.length]);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(start)}
        className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-anngan rounded-lg"
        aria-label={"Zoom photo: " + label}
      >
        <Image
          src={images[start].src}
          alt={images[start].alt}
          width={1200}
          height={675}
          className="w-full rounded-lg object-cover bg-navy"
          sizes="100vw"
        />
        <span className="block text-xs text-gray-500 mt-1">Tap the photo to zoom</span>
      </button>
      {open !== null ? (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4"
          role="dialog"
          aria-label={"Zoomed photo: " + images[open].alt}
          onClick={() => setOpen(null)}
        >
          <div className="flex gap-2 w-full max-w-4xl justify-between items-center text-white pb-2">
            <span className="text-sm font-semibold">
              {open + 1} of {images.length} &middot; {images[open].alt}
            </span>
            <button type="button" onClick={() => setOpen(null)} className="bg-white text-navy font-bold px-4 py-2 rounded min-h-[48px]" aria-label="Close zoom">
              Close X
            </button>
          </div>
          <div className="relative w-full max-w-4xl max-h-[80vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img src={images[open].src} alt={images[open].alt} className="max-w-full max-h-[80vh] object-contain rounded bg-white" />
          </div>
          {images.length > 1 ? (
            <div className="flex gap-2 mt-3">
              <button type="button" onClick={() => setOpen((o) => (o === null ? o : (o - 1 + images.length) % images.length))} className="bg-white text-navy font-bold px-4 py-2 rounded min-h-[48px]">&larr; Prev</button>
              <button type="button" onClick={() => setOpen((o) => (o === null ? o : (o + 1) % images.length))} className="bg-white text-navy font-bold px-4 py-2 rounded min-h-[48px]">Next &rarr;</button>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

// Gallery lightbox trigger: a plain button that opens the same overlay
// at the clicked index. Used on project pages where the gallery is a
// grid of several photos plus a document.
export function GalleryLightbox({
  images,
  children,
}: {
  images: { src: string; alt: string }[];
  children: (open: (i: number) => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % images.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, images.length]);
  return (
    <>
      {children((i: number) => setOpen(i))}
      {open !== null ? (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4" role="dialog" aria-label={"Zoomed photo: " + images[open].alt} onClick={() => setOpen(null)}>
          <div className="flex gap-2 w-full max-w-4xl justify-between items-center text-white pb-2">
            <span className="text-sm font-semibold">{open + 1} of {images.length} &middot; {images[open].alt}</span>
            <button type="button" onClick={() => setOpen(null)} className="bg-white text-navy font-bold px-4 py-2 rounded min-h-[48px]" aria-label="Close zoom">Close X</button>
          </div>
          <div className="relative w-full max-w-4xl max-h-[80vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img src={images[open].src} alt={images[open].alt} className="max-w-full max-h-[80vh] object-contain rounded bg-white" />
          </div>
          {images.length > 1 ? (
            <div className="flex gap-2 mt-3">
              <button type="button" onClick={() => setOpen((o) => (o === null ? o : (o - 1 + images.length) % images.length))} className="bg-white text-navy font-bold px-4 py-2 rounded min-h-[48px]">&larr; Prev</button>
              <button type="button" onClick={() => setOpen((o) => (o === null ? o : (o + 1) % images.length))} className="bg-white text-navy font-bold px-4 py-2 rounded min-h-[48px]">Next &rarr;</button>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
