"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SERVICES, Service, SETTINGS, OfficeSettings } from "../../lib/seed";
import { getServices, getSettings } from "../../lib/db";
import { ServiceIcon } from "../../lib/serviceIcons";

// No photo is used anywhere here, because no real photo matches any
// service, and a stock or AI photo would pretend to be real work.
// The gold line icon is shared with the service detail pages.
// Services list, now from the live services (editable in /admin,
// Services) and the contact settings, falling back to the seed list.
export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [settings, setSettings] = useState<OfficeSettings>(SETTINGS);
  useEffect(() => {
    getServices().then((rows) => { if (rows.length > 0) setServices(rows); }).catch(() => {});
    getSettings().then((s) => setSettings(s)).catch(() => {});
  }, []);
  const telHref = "tel:+" + settings.phone.replace(/[^0-9]/g, "").replace(/^0+/, "");
  const waHref = "https://wa.me/" + settings.whatsapp.replace(/[^0-9]/g, "");
  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">Angan Tech</h1>
      <div className="mt-5 rounded-xl bg-navy px-5 py-4 shadow-sm">
        <p className="text-white font-semibold">
          Angan Tech, Anngan Technologies Pvt. Ltd, Paragon City, Lahore.
        </p>
        <p className="text-blue-100 text-sm mt-1">
          Websites, marketing and software for property offices and housing projects.
        </p>
      </div>
      <div className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <article key={s.id} className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition overflow-hidden flex flex-col h-full">
            <div className="bg-navy px-5 pt-5 pb-4 text-white flex items-start justify-between">
              <span className="text-[#DDB78B]"><ServiceIcon id={s.id} size={44} /></span>
              <span className="text-right">
                <span className="block text-white font-bold text-2xl leading-none">{String(i + 1).padStart(2, "0")}</span>
                <span className="block text-[11px] font-semibold tracking-widest text-blue-200 uppercase mt-1">Angan Tech</span>
              </span>
            </div>
            <div className="w-10 h-1 bg-anngan ml-5 -mt-0.5" aria-hidden="true" />
            <div className="p-5 flex flex-col flex-1">
              <h2 className="font-bold text-xl text-navy leading-snug">
                <Link href={`/services/${s.id}`} className="hover:text-anngan-dark">
                  {s.name}
                </Link>
              </h2>
              {/* NOTE 26 Nov 2026: the short note comes from the live
                  service (editable in /admin, Services). A hardcoded
                  SERVICE_SHORT map used to override it here, so an
                  office edit saved fine but never showed on this
                  list. The map is deleted; s.note is the one text. */}
              <p className="text-base text-gray-600 mt-2 leading-relaxed">{s.note}</p>
              <div className="flex gap-2 mt-auto pt-5">
                <Link href={`/services/${s.id}`} className="bg-slate-100 text-navy text-sm px-3 rounded font-semibold min-h-[48px] inline-flex items-center justify-center flex-1 text-center whitespace-nowrap">
                  What&apos;s included
                </Link>
                <a href={telHref} className="bg-[#004274] text-white text-sm px-4 rounded min-h-[48px] inline-flex items-center justify-center font-semibold flex-1 text-center">Call</a>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-6 text-sm text-gray-600">
        No fixed price is published for these services. The price is agreed on
        discussion with the office. Call{" "}
        <a href={telHref} className="text-anngan-dark font-semibold underline">
          {settings.phone}
        </a>{" "}
        or{" "}
        <a href={waHref} target="_blank" rel="noopener" className="text-anngan-dark font-semibold underline">
          WhatsApp us
        </a>
        .
      </p>
    </div>
  );
}
