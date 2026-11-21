import Link from "next/link";
import { SERVICES } from "../../lib/seed";

export default function ServicesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">Angan Tech</h1>
      <p className="text-gray-600 mt-1">
        Angan Tech, Anngan Technologies Pvt. Ltd, Paragon City, Lahore. Websites,
        marketing and software for property offices and housing projects.
      </p>
      <figure className="mt-5 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <img
          src="/img/alghani-site.jpeg"
          alt="Al Ghani Phase 7 site, Lahore"
          className="w-full h-48 sm:h-56 object-cover"
        />
        <figcaption className="text-xs text-gray-500 px-4 py-2 bg-white">Al Ghani Phase 7 site, Lahore, a project Anngan markets.</figcaption>
      </figure>
      <div className="grid gap-4 mt-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <article key={s.id} className="card border border-gray-200 border-t-4 border-t-navy rounded-lg p-5 bg-white shadow-sm flex flex-col h-full">
            <span className="bg-navy text-white font-bold rounded-full w-9 h-9 flex items-center justify-center text-sm">{i + 1}</span>
            <h2 className="font-bold text-lg mt-3 leading-snug">
              <Link href={`/services/${s.id}`} className="text-navy hover:text-anngan">
                {s.name}
              </Link>
            </h2>
            <p className="text-sm text-gray-600 mt-1">{s.note}</p>
            <div className="flex gap-2 mt-auto pt-4 flex-wrap">
              <Link href={`/services/${s.id}`} className="border border-navy text-navy text-sm px-3 py-1.5 rounded font-semibold">
                See what is included
              </Link>
              <a href="tel:+923041111698" className="bg-anngan text-white text-sm px-3 py-1.5 rounded">Call</a>
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
