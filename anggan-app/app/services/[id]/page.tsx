"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES, Service } from "../../../lib/seed";
import { getServices, getSettings } from "../../../lib/db";
import { SETTINGS, OfficeSettings } from "../../../lib/seed";
import { SERVICE_DETAILS } from "../../../lib/serviceDetails";
import { ServiceIcon } from "../../../lib/serviceIcons";

// Service detail, now from the live service (editable in /admin,
// Services). The structured facts (included items, steps, FAQs)
// stay from the verified serviceDetails, the office can add its own
// long text in the details field, shown as an extra section.

function SectionHead({ title }: { title: string }) {
  return (
    <div className="mt-10">
      <div className="w-10 h-1 bg-anngan" aria-hidden="true" />
      <h2 className="text-2xl font-bold text-navy mt-3">{title}</h2>
    </div>
  );
}

export default function ServicePage({ params }: { params: { id: string } }) {
  const [service, setService] = useState<Service | undefined>(SERVICES.find((s) => s.id === params.id) || SERVICES.find((s) => s.page === params.id));
  const [settings, setSettings] = useState<OfficeSettings>(SETTINGS);
  useEffect(() => { getServices().then((rows) => { const r = rows.find((x) => x.id === params.id) || rows.find((x) => x.page === params.id); if (r) setService(r); }).catch(() => {}); getSettings().then((x) => setSettings(x)).catch(() => {}); }, [params.id]);
  const telHref = "tel:+" + settings.phone.replace(/[^0-9]/g, "").replace(/^0+/, "");
  const waHref = "https://wa.me/" + settings.whatsapp.replace(/[^0-9]/g, "");
  const idx = SERVICES.findIndex((s) => s.id === (service ? service.id : params.id));
  if (!service) notFound();
  const d = SERVICE_DETAILS[service.id];
  // A service added in /admin has no structured details yet: it shows
  // its name, short note, office text and the Call and WhatsApp band,
  // instead of a 404. The 9 original services keep their full detail.
  const num = idx >= 0 ? String(idx + 1).padStart(2, "0") : "–";
  const stepCols = d && d.steps.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-5";

  return (
    <div>
      <p className="text-sm">
        <Link href="/services" className="text-anngan-dark font-semibold">
          All Angan Tech services
        </Link>
        <span className="text-gray-600"> / {service.name}</span>
      </p>

      {/* Hero: navy band, gold icon, name, one short line, Call and WhatsApp. */}
      <section className="mt-4 rounded-xl bg-navy px-5 py-6 sm:px-8 sm:py-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <span className="shrink-0 rounded-xl border border-[#DDB78B]/60 p-3 text-[#DDB78B]">
            <ServiceIcon id={service.id} size={56} />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-widest text-blue-200 uppercase">
              Angan Tech &middot; {num} / 09
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-1 leading-tight">{service.name}</h1>
            <p className="text-blue-100 mt-2 leading-relaxed max-w-[62ch]">{d ? d.scope : service.note}</p>
            <p className="text-blue-200 text-sm mt-2">
              Angan Tech, Anngan Technologies Pvt. Ltd, Paragon City, Lahore.
            </p>
            <div className="flex gap-2 mt-5 flex-wrap">
              <a href={telHref} className="btn btn-navy">
                Call {settings.phone}
              </a>
              <a href={waHref} target="_blank" rel="noopener" className="btn btn-green">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {d ? (
      <>
      {/* What is included: numbered grid, 1 short line per item. */}
      <SectionHead title="What is included" />
      <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
        {d.included.map((item, i) => (
          <article key={item.title} className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 flex flex-col h-full">
            <span className="text-[#A67C2E] font-bold text-2xl leading-none">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="font-bold text-navy text-lg mt-2 leading-snug">{item.title}</h3>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{item.text}</p>
          </article>
        ))}
      </div>

      {/* How it works: numbered step timeline. */}
      <SectionHead title="How it works" />
      <ol className={`grid gap-4 mt-4 sm:grid-cols-2 ${stepCols}`}>
        {d.steps.map((step, i) => (
          <li key={step.title} className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 border-t-4 border-t-[#DDB78B] flex flex-col h-full">
            <span className="w-9 h-9 rounded-full bg-navy text-white font-bold inline-flex items-center justify-center">
              {i + 1}
            </span>
            <p className="font-bold text-navy mt-3">
              Step {i + 1}, {step.title}
            </p>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{step.text}</p>
          </li>
        ))}
      </ol>

      {/* What you get: short checklist. */}
      <SectionHead title="What you get" />
      <ul className="grid gap-3 mt-4 sm:grid-cols-2">
        {d.gets.map((g) => (
          <li key={g} className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 flex gap-3 items-start">
            <span className="shrink-0 w-6 h-6 rounded-full bg-anngan text-white text-sm font-bold inline-flex items-center justify-center mt-0.5" aria-hidden="true">
              &#10003;
            </span>
            <span className="text-sm leading-relaxed">{g}</span>
          </li>
        ))}
      </ul>

      {/* Who it is for and Price: two short cards. */}
      <div className="grid gap-4 mt-10 lg:grid-cols-2">
        <section className="rounded-xl bg-slate-50 border border-gray-200 p-5">
          <div className="w-10 h-1 bg-anngan" aria-hidden="true" />
          <h2 className="text-xl font-bold text-navy mt-3">Who it is for</h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{d.whoFor}</p>
        </section>
        <section className="rounded-xl bg-navy p-5">
          <div className="w-10 h-1 bg-anngan" aria-hidden="true" />
          <h2 className="text-xl font-bold text-white mt-3">Price</h2>
          <p className="text-sm text-blue-100 mt-2 leading-relaxed">{d.priceNote}</p>
        </section>
      </div>

      </>
      ) : null}
      {service.details && (
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 mt-6">
          <h2 className="font-bold text-navy text-lg">From the office</h2>
          <p className="text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-line">{service.details}</p>
        </section>
      )}
      {/* Closing Call and WhatsApp bar. */}
      <section className="mt-10 rounded-xl bg-navy px-5 py-6 sm:px-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Talk to the office about {service.name}</h2>
          <p className="text-blue-100 text-sm mt-1">Call or WhatsApp, the office answers.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href={telHref} className="btn btn-navy">
            Call {settings.phone}
          </a>
          <a href={waHref} target="_blank" rel="noopener" className="btn btn-green">
            WhatsApp
          </a>
        </div>
      </section>

      <p className="mt-6 text-sm">
        <Link href="/services" className="text-anngan-dark font-semibold underline">
          Back to all Angan Tech services
        </Link>
        {" | "}
        <Link href="/contact" className="text-anngan-dark font-semibold underline">
          Contact the office
        </Link>
      </p>
    </div>
  );
}
