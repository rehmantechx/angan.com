"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSiteContent, cityCardSrc, DEFAULT_SITE_CONTENT, SiteContent } from "../../lib/siteContent";
import { getSettings } from "../../lib/db";
import { SETTINGS, OfficeSettings } from "../../lib/seed";
import { DEFAULT_SOCIETIES, SocietyGuide } from "../../lib/seed";
import { StatusBadge } from "../../components/StatusBadge";

// Societies guide, now from the site content (editable in /admin,
// Societies), falling back to the seed list. The guide entries are
// the real societies and projects Anngan covers, nothing invented.
const GUIDES: SocietyGuide[] = DEFAULT_SOCIETIES;
// The guide entries now live in lib/seed.ts (DEFAULT_SOCIETIES) and
// in the Firestore settings/office document, edited in /admin,
// Societies. The KMC photo note from the old list: kmc-01-16x10.jpg
// is the real KMC photo padded to 1200x750 so both corner logos stay
// whole. Paragon City has no real photo yet, it shows Photo coming
// soon until the client sends one.

export default function SocietiesPage() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [settings, setSettings] = useState<OfficeSettings>(SETTINGS);
  useEffect(() => { getSiteContent().then((c) => setContent(c)).catch(() => {}); getSettings().then((s) => setSettings(s)).catch(() => {}); }, []);
  const guides = content.societies.length > 0 ? content.societies : GUIDES;
  return (
    <div>
      <p className="text-sm text-gray-600">Home &rsaquo; Societies Guide</p>
      <h1 className="text-3xl font-bold text-navy mt-1">{content.societiesTitle}</h1>
      <p className="text-gray-600 mt-1">{content.societiesIntro}</p>
      <div className="grid gap-4 mt-6 sm:grid-cols-2">
        {guides.map((g, i) => (
          <article key={g.name} className="card border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-full">
            <figure>
              {g.img ? (
                // PARITY 24 Nov 2026, Section 2: aspect-[16/10] with
                // object-top, so the tip of the Bahria Town Eiffel
                // Tower is not chopped. DHA Lahore keeps the real
                // DHA house photo (lst-dha-stunning.jpg): no wider
                // real DHA exterior shot exists in the repo, so no
                // wider shot was invented. Flagged in NOTES.md.
                <Image
                  src={cityCardSrc(g.img)}
                  alt={g.caption}
                  width={1200}
                  height={675}
                  className="w-full aspect-[16/10] object-cover object-top bg-navy"
                  loading={i < 2 ? "eager" : "lazy"}
                  priority={i < 2}
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-40 bg-navy flex flex-col items-center justify-center text-white px-4 text-center">
                  <svg viewBox="0 0 64 40" width="48" height="30" aria-hidden="true" className="shrink-0">
                    <path d="M4 38 V22 L32 4 L60 22 V38 H44 V26 H20 V38 Z" fill="none" stroke="#DDB78B" strokeWidth="3" strokeLinejoin="round" />
                  </svg>
                  <span className="font-bold text-base mt-2">{g.name}</span>
                  <span className="text-xs text-white/70 mt-1">Photo coming soon. Call the office for details.</span>
                </div>
              )}
              <figcaption className="text-xs text-gray-600 px-4 pt-2">{g.caption}</figcaption>
            </figure>
            <div className="p-4 pt-2 flex flex-col flex-1">
              <h2 className="font-bold text-navy text-lg leading-snug">{g.name} <StatusBadge status={g.status} showAvailable /></h2>
              <p className="text-sm text-gray-600 mt-1">{g.note}</p>
              <div className="mt-auto pt-3">
                <Link href={g.href} className="bg-anngan text-white text-sm px-3 py-2.5 rounded font-semibold min-h-[48px] inline-flex items-center inline-block">{g.label}</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="text-sm text-gray-600 mt-6">Call {settings.phone} to ask about a society not listed here.</p>
    </div>
  );
}
