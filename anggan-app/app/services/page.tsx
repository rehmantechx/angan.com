import Link from "next/link";
import { SERVICES } from "../../lib/seed";

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
            <div className="bg-navy px-5 py-4 flex items-baseline justify-between">
              <span className="text-white font-bold text-2xl">{i + 1}</span>
              <span className="text-xs font-semibold tracking-widest text-blue-200 uppercase">Angan Tech</span>
            </div>
            <div className="w-10 h-1 bg-anngan ml-5 -mt-0.5" aria-hidden="true" />
            <div className="p-5 flex flex-col flex-1">
              <h2 className="font-bold text-xl text-navy leading-snug">
                <Link href={`/services/${s.id}`} className="hover:text-anngan">
                  {s.name}
                </Link>
              </h2>
              <p className="text-base text-gray-600 mt-2 leading-relaxed">{s.note}</p>
              <div className="flex gap-2 mt-auto pt-5 flex-wrap">
                <Link href={`/services/${s.id}`} className="border border-navy text-navy text-sm px-3 py-2 rounded font-semibold flex-1 text-center">
                  See what is included
                </Link>
                <a href="tel:+923041111698" className="bg-anngan text-white text-sm px-4 py-2 rounded font-semibold">Call</a>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-6 text-sm text-gray-600">
        No fixed price is published for these services. The price is agreed on
        discussion with the office. Call{" "}
        <a href="tel:+923041111698" className="text-anngan font-semibold underline">
          +92 304 1111 698
        </a>{" "}
        or{" "}
        <a href="https://wa.me/923041111698" target="_blank" rel="noopener" className="text-anngan font-semibold underline">
          WhatsApp us
        </a>
        .
      </p>
    </div>
  );
}
