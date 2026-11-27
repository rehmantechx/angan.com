"use client";
import Image from "next/image";
import { useState } from "react";

// Smooth image loading, 27 Nov 2026: while a photo loads, the box
// behind it is a soft grey pulse, never a solid dark-blue or bright
// white flash. When the photo arrives it fades in over half a
// second. The photo still takes up its full layout space while it
// loads (opacity only), so nothing around it jumps.
export function FadeImage({
  className,
  onLoadingComplete,
  onError,
  ...props
}: React.ComponentProps<typeof Image>) {
  const [loaded, setLoaded] = useState(false);
  const done = () => setLoaded(true);
  return (
    <span
      className={
        "block w-full overflow-hidden " +
        (loaded ? "bg-gray-100" : "animate-pulse bg-gray-200")
      }
    >
      <Image
        {...props}
        onLoadingComplete={(r) => {
          done();
          onLoadingComplete?.(r);
        }}
        onError={(e) => {
          // A broken photo must not pulse forever.
          done();
          onError?.(e);
        }}
        className={
          (className ?? "") +
          " transition-opacity duration-500 " +
          (loaded ? "opacity-100" : "opacity-0")
        }
      />
    </span>
  );
}

// Same loading state for plain <img> elements (team photos, whose
// src can be an office-uploaded URL that next/image cannot optimise).
export function FadeImg({
  className,
  onLoad,
  onError,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  const done = () => setLoaded(true);
  return (
    <span
      className={
        "block w-full overflow-hidden " +
        (loaded ? "bg-gray-100" : "animate-pulse bg-gray-200")
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...props}
        onLoad={(e) => {
          done();
          onLoad?.(e);
        }}
        onError={(e) => {
          done();
          onError?.(e);
        }}
        className={
          (className ?? "") +
          " transition-opacity duration-500 " +
          (loaded ? "opacity-100" : "opacity-0")
        }
      />
    </span>
  );
}
