import Link from "next/link";

// Disclaimer for anngan.com. Short and plain: the site is a guide,
// not a guarantee, and the office confirms every deal.
export default function DisclaimerPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">Disclaimer</h1>
      <p className="text-gray-600 mt-1">Anngan Technologies Pvt. Ltd, Paragon City, Lahore.</p>
      <div className="mt-5 grid gap-4 text-base leading-relaxed">
        <p>
          The information on this website is a guide to help you find a property or project.
          It is not a guarantee of price, size, availability, approval, or return on investment.
        </p>
        <p>
          Property and project details can change. Before you make any decision or payment,
          check the documents yourself and confirm the details with the office on
          +92 304 1111 698.
        </p>
        <p>
          Anngan Technologies Pvt. Ltd is not responsible for decisions made only from this
          website without checking with the office first.
        </p>
        <p className="text-sm text-gray-600">
          Office: 57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore. Phone +92 304 1111 698.
          Email info@anngan.com.
        </p>
        <p>
          <Link href="/" className="text-anngan-dark font-semibold underline">Back to home</Link>
        </p>
      </div>
    </div>
  );
}
