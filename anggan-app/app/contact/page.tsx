import { EnquiryForm } from "../../components/EnquiryForm";

export default function ContactPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">Talk to Anngan</h1>
      <p className="text-gray-600 mt-1">
        The fastest way to reach the office is WhatsApp or a call. The form below
        goes straight to the office dashboard.
      </p>

      <div className="grid gap-4 mt-5 sm:grid-cols-2">
        <a
          href="https://wa.me/923041111698"
          target="_blank"
          rel="noopener"
          className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm block"
        >
          <p className="font-bold text-navy text-lg">WhatsApp us first</p>
          <p className="text-sm text-gray-600 mt-1">
            Message the office on WhatsApp at +92 304 1111 698. Tell us the project
            or property you are asking about.
          </p>
          <p className="text-green-700 font-semibold mt-2">Open WhatsApp</p>
        </a>
        <a href="tel:+923041111698" className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm block">
          <p className="font-bold text-navy text-lg">Call the office</p>
          <p className="text-sm text-gray-600 mt-1">
            Call +92 304 1111 698 for files, prices and payment plans. File rates
            change with the market, so call for today's rate.
          </p>
          <p className="text-anngan font-semibold mt-2">Call now</p>
        </a>
      </div>

      <div className="grid gap-6 mt-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-navy">Visit the office</h2>
          <dl className="mt-3 border border-gray-200 rounded-lg divide-y divide-gray-200 bg-white text-sm">
            <div className="px-4 py-3">
              <dt className="font-semibold text-navy">Address</dt>
              <dd className="mt-1">57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore</dd>
            </div>
            <div className="px-4 py-3">
              <dt className="font-semibold text-navy">Phone</dt>
              <dd className="mt-1">
                <a href="tel:+923041111698" className="text-anngan font-semibold underline">
                  +92 304 1111 698
                </a>
              </dd>
            </div>
            <div className="px-4 py-3">
              <dt className="font-semibold text-navy">Email</dt>
              <dd className="mt-1">
                <a href="mailto:info@anngan.com" className="text-anngan font-semibold underline">
                  info@anngan.com
                </a>
              </dd>
            </div>
            <div className="px-4 py-3">
              <dt className="font-semibold text-navy">Chief Executive Officer</dt>
              <dd className="mt-1">Muhammad Mahmood Cheema, Chairman and Chief Executive Officer, Anngan</dd>
            </div>
            <div className="px-4 py-3">
              <dt className="font-semibold text-navy">Office hours</dt>
              <dd className="mt-1">
                No office hours are published on the Anngan site. Call the office
                before you visit.
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-sm">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Paragon+City+Lahore"
              target="_blank"
              rel="noopener"
              className="text-anngan font-semibold underline"
            >
              Open Paragon City, Lahore on Google Maps
            </a>
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy">Send an enquiry</h2>
          <div className="mt-3">
            <EnquiryForm asked="General enquiry" compact />
          </div>
        </div>
      </div>
    </div>
  );
}
