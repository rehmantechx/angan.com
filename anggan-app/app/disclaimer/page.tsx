"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSiteContent, DEFAULT_SITE_CONTENT } from "../../lib/siteContent";
import { getSettings } from "../../lib/db";
import { SETTINGS, OfficeSettings } from "../../lib/seed";

// Disclaimer for anngan.com. The body text is editable in /admin,
// Contact and legal, the office line renders from the contact
// settings. Short and plain: the site is a guide, not a guarantee,
// and the office confirms every deal.
export default function DisclaimerPage() {
  const [content, setContent] = useState(DEFAULT_SITE_CONTENT);
  const [settings, setSettings] = useState<OfficeSettings>(SETTINGS);
  useEffect(() => {
    getSiteContent().then((c) => setContent(c)).catch(() => {});
    getSettings().then((s) => setSettings(s)).catch(() => {});
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">Disclaimer</h1>
      <p className="text-gray-600 mt-1">Anngan Technologies Pvt. Ltd, Paragon City, Lahore.</p>
      <div className="mt-5 grid gap-4 text-base leading-relaxed">
        {content.legalDisclaimer.split(/\n\s*\n/).map((para, i) => (
          <p key={i}>{para.trim()}</p>
        ))}
        <p className="text-sm text-gray-600">
          Office: {settings.address}. Phone {settings.phone}.
          Email {settings.email}.
        </p>
        <p>
          <Link href="/" className="text-anngan-dark font-semibold underline">Back to home</Link>
        </p>
      </div>
    </div>
  );
}
