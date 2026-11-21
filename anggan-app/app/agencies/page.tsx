import Link from "next/link";
import { AGENCIES } from "../../lib/seed";

export default function AgenciesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">Agencies and business partners</h1>
      <p className="text-gray-600 mt-1">
        Our exclusive dealers in Pakistan, from the Business Partners carousel on
        anngan.com. Anngan works with a network of partner agencies across
        Pakistan. These 13 named partners are shown with their real logos from
        anngan.com. A 14th logo in the carousel has no readable name on anngan.com,
        so it is not shown as a named partner.
      </p>
      <div className="grid gap-4 mt-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {AGENCIES.map((a) => (
          <article key={a.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm text-center">
            <img
              src={`/img/${a.logo}`}
              alt={`${a.name} logo`}
              className="h-20 w-full mx-auto object-contain"
              loading="lazy"
            />
            <h2 className="font-semibold mt-3 leading-snug">{a.name}</h2>
          </article>
        ))}
      </div>
      <p className="mt-6 text-sm text-gray-600">
        Become a partner: call the office on{" "}
        <a href="tel:+923041111698" className="text-anngan font-semibold underline">
          +92 304 1111 698
        </a>{" "}
        or see the{" "}
        <Link href="/contact" className="text-anngan font-semibold underline">
          Contact page
        </Link>
        .
      </p>
    </div>
  );
}
