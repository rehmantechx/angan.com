import { EnquiryForm } from "../../components/EnquiryForm";
import { WhatsAppIcon, PhoneIcon, MapIcon } from "../../lib/icons";

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
          className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm block flex flex-col"
        >
          <p className="text-green-700"><WhatsAppIcon size={40} /></p>
          <p className="font-bold text-navy text-lg mt-2">WhatsApp us first</p>
          <p className="text-sm text-gray-600 mt-1">
            Message the office on WhatsApp at +92 304 1111 698. Tell us the project
            or property you are asking about.
          </p>
          <span className="mt-auto pt-3 flex"><span className="btn btn-green">Open WhatsApp</span></span>
        </a>
        <a href="tel:+923041111698" className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm block flex flex-col">
          <p className="text-navy"><PhoneIcon size={40} /></p>
          <p className="font-bold text-navy text-lg mt-2">Call the office</p>
          <p className="text-sm text-gray-600 mt-1">
            Call +92 304 1111 698 for files, prices and payment plans. File rates
            change with the market, so call for today's rate.
          </p>
          <span className="mt-auto pt-3 flex"><span className="btn btn-navy">Call now</span></span>
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
                <a href="tel:+923041111698" className="text-anngan-dark font-semibold underline">
                  +92 304 1111 698
                </a>
              </dd>
            </div>
            <div className="px-4 py-3">
              <dt className="font-semibold text-navy">Email</dt>
              <dd className="mt-1">
                <a href="mailto:info@anngan.com" className="text-anngan-dark font-semibold underline">
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
                Call the office before you visit.
              </dd>
            </div>
          </dl>
          <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
            <p className="text-navy font-bold px-3 pt-3 flex items-center gap-2"><MapIcon size={20} /> Paragon City, Lahore</p>
            <iframe title="Anngan office map, Paragon City, Lahore" src="https://www.google.com/maps?q=Paragon+City+Lahore&output=embed" className="w-full h-64 mt-2" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <p className="mt-3 text-sm">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Paragon+City+Lahore"
              target="_blank"
              rel="noopener"
              className="text-anngan-dark font-semibold underline"
            >
              Open Paragon City, Lahore on Google Maps
            </a>
          </p>
        </div>
        <div>
          {/* PARITY 24 Nov 2026, Section 4: the duplicate "Send an
              enquiry" heading is removed. The form below already
              carries its own "Send an enquiry" heading. */}
          <div className="mt-3">
            <EnquiryForm asked="General enquiry" compact />
          </div>
        </div>
      </div>
    </div>
  );
}
