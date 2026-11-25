"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSiteContent, DEFAULT_SITE_CONTENT, SiteContent } from "../../lib/siteContent";
import { getSettings } from "../../lib/db";
import { SETTINGS, OfficeSettings } from "../../lib/seed";

// Companies page, now from the site content (editable in /admin,
// Companies) and the contact settings. The three group companies
// are real: Angan Tech, Anngan Construction, Corporate Angle
// Marketing. No company invented.
export default function CompaniesPage() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [settings, setSettings] = useState<OfficeSettings>(SETTINGS);
  useEffect(() => {
    getSiteContent().then((c) => setContent(c)).catch(() => {});
    getSettings().then((s) => setSettings(s)).catch(() => {});
  }, []);
  const telHref = "tel:+" + settings.phone.replace(/[^0-9]/g, "").replace(/^0+/, "");
  const waHref = "https://wa.me/" + settings.whatsapp.replace(/[^0-9]/g, "");
  return (
    <div className="flex min-h-full flex-col">
      <p className="text-sm text-gray-600">Home &rsaquo; Anngan Companies</p>
      <h1 className="text-3xl font-bold text-navy mt-1">Anngan Companies</h1>
      <p className="text-gray-600 mt-1">The group behind Anngan.</p>
      <div className="grid gap-4 mt-6 md:grid-cols-3">
        {content.companies.map((c) => (
        <article key={c.id} id={c.id} className="rounded-xl border border-gray-200 bg-white shadow-sm h-full flex flex-col overflow-hidden scroll-mt-24">
          <div className="w-10 h-1 bg-anngan ml-5 -mt-0.5" aria-hidden="true" />
          <div className="p-5 flex flex-col flex-1">
          <h2 className="font-bold text-navy text-lg">{c.name}</h2>
          <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
          <div className="mt-auto pt-3">{c.href.startsWith("tel:") ? <a href={c.href} className="border border-navy text-navy text-sm px-3 py-2.5 rounded font-semibold min-h-[48px] inline-flex items-center">{c.linkLabel}</a> : <Link href={c.href} className="bg-anngan text-white text-sm px-3 py-2.5 rounded font-semibold min-h-[48px] inline-flex items-center">{c.linkLabel}</Link>}</div>
          </div>
        </article>
        ))}
      </div>
      <p className="text-sm text-gray-600 mt-6">Office: {settings.address}. Phone {settings.phone}, email {settings.email}.</p>
      {/* Short page, so the office band sits at the bottom of the page
          (mt-auto in this flex column), not halfway up a blank gap.
          Real office contact only, nothing invented. */}
      <div className="mt-auto pt-10">
        <div className="rounded-xl bg-navy px-5 py-6 text-white shadow-sm">
          <h2 className="font-bold text-xl">Talk to the Anngan office</h2>
          <p className="text-blue-100 text-sm mt-1">
            Ask about any of the three companies, or about a project or listing. Call or WhatsApp, the office answers.
          </p>
          <div className="flex gap-2 mt-4 flex-wrap">
            <a href={telHref} className="btn btn-navy">Call {settings.phone}</a>
            <a href={waHref} target="_blank" rel="noopener" className="btn btn-green">WhatsApp</a>
            <Link href="/contact" className="btn btn-outline-navy">Contact the office</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
