import Link from "next/link";
import { SERVICES } from "../../lib/seed";

// Short lines only, shortened from the service's own note, no new facts.
// Visual: a large, simple line icon in the navy header, one per service.
// No photo is used anywhere here, because no real photo matches any
// service, and a stock or AI photo would pretend to be real work.
const ICONS: Record<string, JSX.Element> = {
  "service-1": (<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 6 3 12l5 6" /><path d="m16 6 5 6-5 6" /><path d="m13 4-2 16" /></svg>),
  "service-2": (<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 11 18-5-7 18-2.5-7.5L3 11z" /><path d="M11.5 16.5 21 6" /></svg>),
  "service-3": (<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /><path d="M8.5 11h5M11 8.5v5" /></svg>),
  "service-4": (<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>),
  "service-5": (<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3" /><path d="m9.5 9-1.5 2 1.5 2M14.5 9l1.5 2-1.5 2" /></svg>),
  "service-6": (<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>),
  "service-7": (<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>),
  "service-8": (<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M6.5 16c.5-1.5 1.4-2 2.5-2s2 0.5 2.5 2M15 9h4M15 13h4" /></svg>),
  "service-9": (<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>),
};
const SHORT: Record<string, string> = {
  "service-1": "Custom coded property websites, mobile first, built to load fast.",
  "service-2": "Campaigns and content that bring enquiries to your phone.",
  "service-3": "Search work so buyers on Google find your real listings.",
  "service-4": "Clear pages and project write-ups in plain words.",
  "service-5": "Software built around how your office actually works.",
  "service-6": "Plot, file and booking management for housing projects.",
  "service-7": "Every lead tracked, first call to closing, none lost.",
  "service-8": "Staff records, attendance, leave and payroll in one place.",
  "service-9": "One dashboard for tasks, approvals and reporting.",
};

export default function ServicesPage() {
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
        {SERVICES.map((s, i) => (
          <article key={s.id} className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition overflow-hidden flex flex-col h-full">
            <div className="bg-navy px-5 pt-5 pb-4 text-white flex items-start justify-between">
              <span className="text-[#DDB78B]">{ICONS[s.id]}</span>
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
              <p className="text-base text-gray-600 mt-2 leading-relaxed">{SHORT[s.id] || s.note}</p>
              <div className="flex gap-2 mt-auto pt-5">
                <Link href={`/services/${s.id}`} className="bg-slate-100 text-navy text-sm px-3 rounded font-semibold min-h-[48px] inline-flex items-center justify-center flex-1 text-center">
                  See what is included
                </Link>
                <a href="tel:+923041111698" className="bg-anngan text-white text-sm px-4 rounded min-h-[48px] inline-flex items-center justify-center font-semibold flex-1 text-center">Call</a>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-6 text-sm text-gray-600">
        No fixed price is published for these services. The price is agreed on
        discussion with the office. Call{" "}
        <a href="tel:+923041111698" className="text-anngan-dark font-semibold underline">
          +92 304 1111 698
        </a>{" "}
        or{" "}
        <a href="https://wa.me/923041111698" target="_blank" rel="noopener" className="text-anngan-dark font-semibold underline">
          WhatsApp us
        </a>
        .
      </p>
    </div>
  );
}
