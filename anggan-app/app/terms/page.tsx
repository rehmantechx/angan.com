import Link from "next/link";

// Terms and Conditions for anngan.com. Short and plain: listings and
// prices are as shown on the day, file rates change with the market,
// and nothing on the site is a booking or a payment. Only the office
// facts already on the site are used.
export default function TermsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">Terms and Conditions</h1>
      <p className="text-gray-600 mt-1">Anngan Technologies Pvt. Ltd, Paragon City, Lahore.</p>
      <div className="mt-5 grid gap-4 text-base leading-relaxed">
        <p>
          Listings, prices, sizes and availability on this website are shown as given to us by the
          owner or dealer. They can change without notice. Always call the office on
          +92 304 1111 698 to confirm the price and availability before you visit or pay anything.
        </p>
        <p>
          File rates for MGH Pakistan and other projects change with the market. The rate on the
          website is a guide only. The rate on the day you deal is the rate the office confirms
          on the phone.
        </p>
        <p>
          Nothing on this website is a booking, a token, or a payment. No payment is taken through
          this website. Any payment is made only at the office, with a proper receipt.
        </p>
        <p>
          Photos on this website are of the real property or project named, unless the card says
          the photo is coming soon.
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
