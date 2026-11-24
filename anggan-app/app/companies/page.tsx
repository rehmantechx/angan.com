import Link from "next/link";
import { ServiceIcon } from "../../lib/serviceIcons";
import { BuildingIcon, MegaphoneIcon } from "../../lib/icons";

export default function CompaniesPage() {
  return (
    <div className="flex min-h-full flex-col">
      <p className="text-sm text-gray-600">Home &rsaquo; Anngan Companies</p>
      <h1 className="text-3xl font-bold text-navy mt-1">Anngan Companies</h1>
      <p className="text-gray-600 mt-1">The group behind Anngan.</p>
      <div className="grid gap-4 mt-6 md:grid-cols-3">
        <article id="technologies" className="rounded-xl border border-gray-200 bg-white shadow-sm h-full flex flex-col overflow-hidden scroll-mt-24">
          <div className="w-10 h-1 bg-anngan ml-5 -mt-0.5" aria-hidden="true" />
          <div className="p-5 flex flex-col flex-1">
          <h2 className="font-bold text-navy text-lg">Angan Tech</h2>
          <p className="text-sm text-gray-600 mt-1">Anngan Technologies Pvt. Ltd, Lahore. Chairman and Chief Executive Officer, Muhammad Mahmood Cheema.</p>
          <div className="mt-auto pt-3"><Link href="/services" className="bg-anngan text-white text-sm px-3 py-2.5 rounded font-semibold min-h-[48px] inline-flex items-center">Open Angan Tech</Link></div>
          </div>
        </article>
        <article id="construction" className="rounded-xl border border-gray-200 bg-white shadow-sm h-full flex flex-col overflow-hidden scroll-mt-24">
          <div className="w-10 h-1 bg-anngan ml-5 -mt-0.5" aria-hidden="true" />
          <div className="p-5 flex flex-col flex-1">
          <h2 className="font-bold text-navy text-lg">Anngan Construction</h2>
          <p className="text-sm text-gray-600 mt-1">One of the three Anngan group companies. Ask the office about construction work.</p>
          <div className="mt-auto pt-3"><a href="tel:+923041111698" className="border border-navy text-navy text-sm px-3 py-2.5 rounded font-semibold min-h-[48px] inline-flex items-center">Ask the team</a></div>
          </div>
        </article>
        <article id="marketing" className="rounded-xl border border-gray-200 bg-white shadow-sm h-full flex flex-col overflow-hidden scroll-mt-24">
          <div className="w-10 h-1 bg-anngan ml-5 -mt-0.5" aria-hidden="true" />
          <div className="p-5 flex flex-col flex-1">
          <h2 className="font-bold text-navy text-lg">Corporate Angle Marketing</h2>
          <p className="text-sm text-gray-600 mt-1">One of the three Anngan group companies. Ask the office about marketing.</p>
          <div className="mt-auto pt-3"><a href="tel:+923041111698" className="border border-navy text-navy text-sm px-3 py-2.5 rounded font-semibold min-h-[48px] inline-flex items-center">Ask the team</a></div>
          </div>
        </article>
      </div>
      <p className="text-sm text-gray-600 mt-6">Office: 57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore. Phone +92 304 1111 698, email info@anngan.com.</p>
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
            <a href="tel:+923041111698" className="btn btn-navy">Call +92 304 1111 698</a>
            <a href="https://wa.me/923041111698" target="_blank" rel="noopener" className="btn btn-green">WhatsApp</a>
            <Link href="/contact" className="btn btn-outline-navy">Contact the office</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
