import Link from "next/link";

export default function CompaniesPage() {
  return (
    <div>
      <p className="text-sm text-gray-500">Home &rsaquo; Anngan Companies</p>
      <h1 className="text-3xl font-bold text-navy mt-1">Anngan Companies</h1>
      <p className="text-gray-600 mt-1">The group behind Anngan.</p>
      <div className="grid gap-4 mt-6 md:grid-cols-3">
        <article className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
          <h2 className="font-bold text-navy text-lg">Angan Tech</h2>
          <p className="text-sm text-gray-600 mt-1">Anngan Technologies Pvt. Ltd, Lahore. Chairman and Chief Executive Officer, Muhammad Mahmood Cheema.</p>
          <Link href="/services" className="bg-anngan text-white text-sm px-3 py-2 rounded font-semibold inline-block mt-3">Open Angan Tech</Link>
        </article>
        <article className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
          <h2 className="font-bold text-navy text-lg">Anngan Construction</h2>
          <p className="text-sm text-gray-600 mt-1">Listed under Anngan Companies on anngan.com. No description is published for this company on anngan.com, so none is shown here.</p>
          <a href="tel:+923041111698" className="border border-navy text-navy text-sm px-3 py-2 rounded font-semibold inline-block mt-3">Ask the team</a>
        </article>
        <article className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
          <h2 className="font-bold text-navy text-lg">Corporate Angle Marketing</h2>
          <p className="text-sm text-gray-600 mt-1">Listed under Anngan Companies on anngan.com. No description is published for this company on anngan.com, so none is shown here.</p>
          <a href="tel:+923041111698" className="border border-navy text-navy text-sm px-3 py-2 rounded font-semibold inline-block mt-3">Ask the team</a>
        </article>
      </div>
      <p className="text-sm text-gray-600 mt-6">Office: 57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore. Phone +92 304 1111 698, email info@anngan.com.</p>
    </div>
  );
}
