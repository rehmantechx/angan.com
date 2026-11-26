// Contact page, now from the contact settings and site content
// (editable in /admin, Settings and Contact and legal). Phone,
// WhatsApp, email and address change in one place and show
// everywhere: header, footer, contact, companies. The three group
// companies show here too, so a visitor can see and open them from
// the contact page, not only from /companies.
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { EnquiryForm } from "../../components/EnquiryForm";
import { WhatsAppIcon, PhoneIcon, MapIcon } from "../../lib/icons";
import { getSiteContent, DEFAULT_SITE_CONTENT, SiteContent } from "../../lib/siteContent";
import { getSettings } from "../../lib/db";
import { SETTINGS, OfficeSettings } from "../../lib/seed";

export default function ContactPage() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [settings, setSettings] = useState<OfficeSettings>(SETTINGS);
  useEffect(() => {
    getSiteContent().then((c) => setContent(c)).catch(() => {});
    getSettings().then((s) => setSettings(s)).catch(() => {});
  }, []);
  const telHref = "tel:+" + settings.phone.replace(/[^0-9]/g, "").replace(/^0+/, "");
  const waHref = "https://wa.me/" + settings.whatsapp.replace(/[^0-9]/g, "");
  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">Talk to Anngan</h1>
      <p className="text-gray-600 mt-1">
        {content.contactIntro}
      </p>

      <div className="grid gap-4 mt-6 sm:grid-cols-2">
        <a
          href={waHref}
          target="_blank"
          rel="noopener"
          className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm block flex flex-col"
        >
          <p className="text-green-700"><WhatsAppIcon size={40} /></p>
          <p className="font-bold text-navy text-lg mt-2">WhatsApp us first</p>
          <p className="text-sm text-gray-600 mt-1">
            Message the office on WhatsApp at {settings.phone}. Tell us the project
            or property you are asking about.
          </p>
          <span className="mt-auto pt-3 flex"><span className="btn btn-green">Open WhatsApp</span></span>
        </a>
        <a href={telHref} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm block flex flex-col">
          <p className="text-navy"><PhoneIcon size={40} /></p>
          <p className="font-bold text-navy text-lg mt-2">Call the office</p>
          <p className="text-sm text-gray-600 mt-1">
            Call {settings.phone} for files, prices and payment plans. File rates
            change with the market, so call for today&apos;s rate.
          </p>
          <span className="mt-auto pt-3 flex"><span className="btn btn-navy">Call now</span></span>
        </a>
      </div>

      <div className="grid gap-6 mt-8 lg:grid-cols-2 items-start">
        <div>
          {/* PARITY 24 Nov 2026, Section 4: the duplicate "Send an
              enquiry" heading is removed. The form below already
              carries its own "Send an enquiry" heading. */}
          <EnquiryForm asked="General enquiry" compact />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy">Visit the office</h2>
          <dl className="mt-3 border border-gray-200 rounded-xl divide-y divide-gray-200 bg-white text-sm shadow-sm">
            <div className="px-4 py-3">
              <dt className="font-semibold text-navy">Address</dt>
              <dd className="mt-1">{settings.address}</dd>
            </div>
            <div className="px-4 py-3">
              <dt className="font-semibold text-navy">Phone</dt>
              <dd className="mt-1">
                <a href={telHref} className="text-anngan-dark font-semibold underline">
                  {settings.phone}
                </a>
              </dd>
            </div>
            <div className="px-4 py-3">
              <dt className="font-semibold text-navy">Email</dt>
              <dd className="mt-1">
                <a href={"mailto:" + settings.email} className="text-anngan-dark font-semibold underline">
                  {settings.email}
                </a>
              </dd>
            </div>
            <div className="px-4 py-3">
              <dt className="font-semibold text-navy">Chief Executive Officer</dt>
              <dd className="mt-1">Muhammad Mahmood Cheema, Chairman and Chief Executive Officer, Anngan</dd>
            </div>
            <div className="px-4 py-3">
              <dt className="font-semibold text-navy">Office hours</dt>
              <dd className="mt-1">
                Call the office before you visit.
              </dd>
            </div>
          </dl>
          <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <p className="text-navy font-bold px-3 pt-3 flex items-center gap-2"><MapIcon size={20} /> {settings.address.split(",").slice(-2).join(",").trim()}</p>
            <iframe title={"Anngan office map, " + settings.address} src={"https://www.google.com/maps?q=" + encodeURIComponent(settings.address) + "&output=embed"} className="w-full h-64 mt-2" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <p className="mt-3 text-sm">
            <a
              href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(settings.address)}
              target="_blank"
              rel="noopener"
              className="text-anngan-dark font-semibold underline"
            >
              Open {settings.address} on Google Maps
            </a>
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-navy mt-12">Our companies</h2>
      <p className="text-gray-600 text-sm mt-1">The three companies in the Anngan group. Tap one to open it.</p>
      <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
        {content.companies.map((c) => (
          <article key={c.id} className="rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col overflow-hidden">
            <div className="w-10 h-1 bg-anngan ml-5 -mt-0.5" aria-hidden="true" />
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-bold text-navy text-lg">{c.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
              <div className="mt-auto pt-3">
                {c.href.startsWith("tel:") ? (
                  <a href={c.href} className="border border-navy text-navy text-sm px-3 py-2.5 rounded font-semibold min-h-[48px] inline-flex items-center">{c.linkLabel}</a>
                ) : (
                  <Link href={c.href} className="bg-anngan text-white text-sm px-3 py-2.5 rounded font-semibold min-h-[48px] inline-flex items-center">{c.linkLabel}</Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-4 text-sm">
        <Link href="/companies" className="text-anngan-dark font-semibold underline">See all Anngan companies &rarr;</Link>
      </p>
    </div>
  );
}
