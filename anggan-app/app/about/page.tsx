import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">About Anngan</h1>
      <p className="text-gray-600 mt-1">
        Pakistan's most trusted real estate service provider. banay khawab haqiqat.
      </p>

      <div className="grid gap-6 mt-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-navy">How did it all start?</h2>
          <p className="mt-2 text-sm leading-relaxed">
            ANNGAN.COM was established in order to give our devoted customers a
            competitive edge by delivering top-tier real estate solutions under one
            roof. The concept for ANNGAN.COM began as a dream that could only be
            accomplished with initiative, professionalism, and tenacity.
          </p>
          <p className="mt-2 text-sm leading-relaxed">
            At ANNGAN.COM, we are continually developing new real estate
            opportunities that will boost Pakistan's economic growth. We work hard
            every day to establish ourselves as Pakistan's premier and trusted source
            of real estate services while delivering long-term benefits for our
            business partners and associates.
          </p>
          <p className="mt-2 text-sm leading-relaxed">
            Several of our current landmark projects reflect our unrelenting
            dedication to quality; the most well-known of these are MGH Pakistan,
            Mangla, Kashmir Modern City, Azad Kashmir and most recently Zam Zam City,
            Lahore.
          </p>
          <p className="mt-4 text-sm text-gray-600">
            Anngan does not publish an office count, an employee count or a founding
            year on anngan.com, so none is shown here.
          </p>

          <h2 className="text-xl font-bold text-navy mt-8">Our work, day to day</h2>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="border border-gray-200 rounded-lg p-3 bg-white">
              <span className="font-semibold">Project marketing.</span> MGH Pakistan
              at Mangla, Zam Zam City, Al Ghani Phase 7, Urban City, China Town, Pak
              China Grain Market and Kashmir Modern City.
            </li>
            <li className="border border-gray-200 rounded-lg p-3 bg-white">
              <span className="font-semibold">Property for sale.</span> Houses, flats
              and portions for sale in Lahore, Karachi, Rawalpindi, Multan and
              Islamabad, with real photos and real prices.
            </li>
            <li className="border border-gray-200 rounded-lg p-3 bg-white">
              <span className="font-semibold">Property for rent.</span> Houses and
              portions for rent in Lahore, Rawalpindi and Islamabad, with monthly
              rent shown on each listing.
            </li>
            <li className="border border-gray-200 rounded-lg p-3 bg-white">
              <span className="font-semibold">Files.</span> MGH Zamindar File,
              Affidavit MGH and Serene Farm Houses at MGH Pakistan, Mangla. Call for
              today's file rate.
            </li>
          </ul>
        </div>

        <div>
          <figure className="border border-gray-200 rounded-lg p-4 bg-white">
            <img
              src="/img/ceo.jpg"
              alt="Muhammad Mahmood Cheema, Chairman and Chief Executive Officer, Anngan"
              className="w-full h-auto"
            />
            <figcaption className="text-sm text-gray-600 mt-2">
              Muhammad Mahmood Cheema, Chairman and Chief Executive Officer, Anngan.
              Photo shown in full, no crop.
            </figcaption>
          </figure>

          <h2 className="text-xl font-bold text-navy mt-6">Anngan in numbers</h2>
          <p className="text-sm text-gray-600 mt-1">
            Counts of things on this site and on anngan.com, checked 20 Nov 2026.
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-center">
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <dt className="text-sm text-gray-600">Projects on this site</dt>
              <dd className="text-2xl font-bold text-navy">7</dd>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <dt className="text-sm text-gray-600">Real listings with photos and prices</dt>
              <dd className="text-2xl font-bold text-navy">12</dd>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <dt className="text-sm text-gray-600">Named business partners</dt>
              <dd className="text-2xl font-bold text-navy">13</dd>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <dt className="text-sm text-gray-600">Real news and blog articles</dt>
              <dd className="text-2xl font-bold text-navy">23</dd>
            </div>
          </dl>

          <div className="mt-6 flex gap-2 flex-wrap">
            <Link href="/projects" className="bg-anngan text-white px-4 py-2 rounded font-semibold text-sm">
              See our 7 projects
            </Link>
            <Link href="/properties" className="border border-navy text-navy px-4 py-2 rounded font-semibold text-sm">
              Houses and flats for sale
            </Link>
            <Link href="/contact" className="border border-navy text-navy px-4 py-2 rounded font-semibold text-sm">
              Contact the office
            </Link>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-navy mt-10">Frequently asked questions</h2>
      <div className="mt-3 space-y-3">
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <p className="font-semibold">What is MGH Zamindar File?</p>
          <p className="text-sm text-gray-600 mt-1">
            A file product of MGH Pakistan at Mangla, marketed by Anngan. Affidavit
            MGH and Serene Farm Houses are the other MGH products. Call +92 304 1111
            698 for today's rate.
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <p className="font-semibold">Where is the Anngan office?</p>
          <p className="text-sm text-gray-600 mt-1">
            57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore. Phone +92 304 1111
            698, email info@anngan.com.
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <p className="font-semibold">Which cities does Anngan cover?</p>
          <p className="text-sm text-gray-600 mt-1">
            Karachi, Islamabad, Lahore and Peshawar, plus projects at Mangla, Multan
            and Kashmir. Rawalpindi listings are also on this site.
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <p className="font-semibold">How do I create a listing?</p>
          <p className="text-sm text-gray-600 mt-1">
            Use Create a Listing on this site, or call +92 304 1111 698 with the
            property details and photos.
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <p className="font-semibold">Is there an Anngan app?</p>
          <p className="text-sm text-gray-600 mt-1">
            The Anngan app is Coming Soon on anngan.com. There is no app to download
            yet, so no store badge is shown here. Until then, call or WhatsApp us on
            +92 304 1111 698.
          </p>
        </div>
      </div>
    </div>
  );
}
