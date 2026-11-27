"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

// Tap-to-zoom lightbox: click any photo, see it full-screen, tap X or
// Esc or the dark background to close. Prev/next arrows step through
// the whole gallery, so the MGH allotment letter is readable zoomed.
//
// LAYOUT SHIFT FIX 27 Nov 2026: the old overlay was one flex column
// with justify-center, so the whole block (header, photo, buttons)
// re-centred every time the photo loaded and changed size, and the
// Close button jumped upward. The overlay is now three fixed rows:
// a pinned header at the top, a fixed-size photo area in the middle
// (flex-1, min-h-0, so its height never depends on the photo), and a
// pinned Prev/Next row at the bottom. The photo is bounded by the
// area (max-w-full max-h-full), never the other way round. While a
// photo loads, a soft grey pulse fills the same area, so nothing
// moves when the full-resolution image arrives.
function LightboxOverlay({
  images,
  open,
  onClose,
  onStep,
}: {
  images: { src: string; alt: string }[];
  open: number;
  onClose: () => void;
  onStep: (delta: number) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  // Each new photo starts unloaded, so the pulse shows again briefly
  // instead of the old photo flashing at the new size.
  useEffect(() => {
    setLoaded(false);
  }, [open]);
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex flex-col"
      role="dialog"
      aria-label={"Zoomed photo: " + images[open].alt}
      onClick={onClose}
    >
      <div className="flex-none w-full max-w-4xl mx-auto flex gap-2 justify-between items-center text-white px-4 pt-4 pb-2">
        <span className="text-sm font-semibold">
          {open + 1} of {images.length} &middot; {images[open].alt}
        </span>
        {/* NEXT/PREV FIX 26 Nov 2026: these buttons sit inside the
            overlay, which closes on any click. A click on Next or
            Prev used to bubble up to the overlay and close the
            photo instead of moving to the next one. Every button
            now stops the click, so only X or the dark background
            closes it. */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="bg-white text-navy font-bold px-4 py-2 rounded min-h-[48px] shrink-0"
          aria-label="Close zoom"
        >
          Close X
        </button>
      </div>
      <div
        className="flex-1 min-h-0 w-full max-w-4xl mx-auto px-4 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {!loaded ? (
            <div className="absolute inset-0 rounded bg-white/10 animate-pulse flex items-center justify-center" aria-hidden="true">
              <span className="text-white/70 text-sm">Loading photo...</span>
            </div>
          ) : null}
          {/* key resets the element per photo, so onLoad fires for
              every step, not just the first one. */}
          <img
            key={images[open].src}
            src={images[open].src}
            alt={images[open].alt}
            onLoad={() => setLoaded(true)}
            className="relative max-w-full max-h-full object-contain rounded bg-white transition-opacity duration-300"
            style={{ opacity: loaded ? 1 : 0 }}
          />
        </div>
      </div>
      {images.length > 1 ? (
        <div className="flex-none w-full max-w-4xl mx-auto flex gap-2 justify-center px-4 pt-3 pb-4" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStep(-1);
            }}
            className="bg-white text-navy font-bold px-4 py-2 rounded min-h-[48px]"
          >
            &larr; Prev
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStep(1);
            }}
            className="bg-white text-navy font-bold px-4 py-2 rounded min-h-[48px]"
          >
            Next &rarr;
          </button>
        </div>
      ) : null}
    </div>
  );
}

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
          className="w-full h-auto rounded-lg object-contain bg-navy"
          sizes="100vw"
        />
        <span className="block text-xs text-gray-500 mt-1">Tap the photo to zoom</span>
      </button>
      {open !== null ? (
        <LightboxOverlay
          images={images}
          open={open}
          onClose={() => setOpen(null)}
          onStep={(d) => setOpen((o) => (o === null ? o : (o + d + images.length) % images.length))}
        />
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
        <LightboxOverlay
          images={images}
          open={open}
          onClose={() => setOpen(null)}
          onStep={(d) => setOpen((o) => (o === null ? o : (o + d + images.length) % images.length))}
        />
      ) : null}
    </>
  );
}
