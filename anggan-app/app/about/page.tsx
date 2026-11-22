import Image from "next/image";
import Link from "next/link";

const WORK = [
  { title: "Project marketing", img: "mgh-lake-aerial.jpg", alt: "Mangla Lake, MGH Pakistan", note: "MGH Pakistan, Zam Zam City, Al Ghani Phase 7, Urban City, China Town, Pak China Grain Market, Kashmir Modern City." },
  { title: "For sale", img: "lst-dha-stunning.jpg", alt: "House in DHA Lahore", note: "Houses, flats and portions in Lahore, Karachi, Rawalpindi, Multan and Islamabad. Real photos, real prices." },
  { title: "For rent", img: "lst-orchard-rent.jpg", alt: "House for rent in Bahria Orchard, Lahore", note: "Houses and portions in Lahore, Rawalpindi and Islamabad. Monthly rent shown." },
  // Files have no real site photo, only the paper file itself, so this
  // card is a plain navy block, not a cropped scan of a document.
  { title: "Files", img: "", alt: "", note: "MGH Zamindar File, Affidavit MGH, Serene Farm Houses. Call for today's file rate." },
];

const FAQ = [
  { q: "What is MGH Zamindar File?", a: "A file product of MGH Pakistan at Mangla. Call +92 304 1111 698 for today's rate." },
  { q: "Where is the Anngan office?", a: "57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore. Phone +92 304 1111 698, email info@anngan.com." },
  { q: "Which cities does Anngan cover?", a: "Karachi, Islamabad, Lahore and Peshawar, plus projects at Mangla, Multan and Kashmir." },
  { q: "How do I create a listing?", a: "Use Create a Listing on this site, or call +92 304 1111 698 with the details and photos." },
];

export default function AboutPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">About Anngan</h1>
      <p className="text-gray-600 mt-1">
        Pakistan's most trusted real estate service provider. banay khawab haqiqat.
      </p>

      <figure className="mt-5 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <Image
          src="/img/mgh-lake-aerial.jpg"
          alt="Mangla Lake aerial view, MGH Pakistan"
          width={1200}
          height={675}
          className="w-full h-56 sm:h-64 object-cover"
          sizes="100vw"
        />
        <figcaption className="text-xs text-gray-600 px-4 py-2 bg-white">Mangla Lake, MGH Pakistan, our main project.</figcaption>
      </figure>

      <div className="grid gap-6 mt-6 lg:grid-cols-2 items-start">
        <figure className="border border-gray-200 rounded-lg p-4 bg-white max-w-md w-full">
          <Image
            src="/img/ceo.jpg"
            alt="Muhammad Mahmood Cheema, Chairman and Chief Executive Officer, Anngan"
            width={1024}
            height={683}
            className="w-full h-auto object-contain"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <figcaption className="text-sm text-gray-600 mt-2">
            Muhammad Mahmood Cheema, Chairman and Chief Executive Officer.
            Photo shown in full, no crop.
          </figcaption>
        </figure>

        <div>
          <h2 className="text-xl font-bold text-navy">Our story</h2>
          <p className="mt-2 text-sm leading-relaxed">
            ANNGAN.COM gives customers top-tier real estate solutions under one
            roof. We work every day to be Pakistan's trusted source for real
            estate.
          </p>
          <p className="mt-2 text-sm leading-relaxed">
            Our landmark projects are MGH Pakistan at Mangla, Kashmir Modern City
            and Zam Zam City, Lahore.
          </p>

          <h2 className="text-xl font-bold text-navy mt-6">Anngan in numbers</h2>
          <dl className="mt-3 grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white">
              <dt className="text-xs sm:text-sm text-gray-600">Projects on this site</dt>
              <dd className="text-2xl font-bold text-navy">7</dd>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white">
              <dt className="text-xs sm:text-sm text-gray-600">Real listings with photos and prices</dt>
              <dd className="text-2xl font-bold text-navy">12</dd>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white">
              <dt className="text-xs sm:text-sm text-gray-600">Real news and blog articles</dt>
              <dd className="text-2xl font-bold text-navy">23</dd>
            </div>
          </dl>

          <div className="mt-6 flex gap-2 flex-wrap">
            <Link href="/projects" className="btn btn-red text-sm">
              See our 7 projects
            </Link>
            <Link href="/properties" className="btn btn-outline-navy text-sm">
              Houses and flats for sale
            </Link>
            <Link href="/contact" className="btn btn-outline-navy text-sm">
              Contact the office
            </Link>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-navy mt-10">What we do</h2>
      <div className="grid gap-4 mt-4 sm:grid-cols-2">
        {WORK.map((w) => (
          <article key={w.title} className="card border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-full">
            {w.img ? (
              <Image src={`/img/${w.img}`} alt={w.alt} width={1200} height={675} className="w-full h-36 object-cover" loading="lazy" sizes="(max-width: 640px) 100vw, 50vw" />
            ) : (
              <div className="w-full h-36 bg-navy flex items-center justify-center px-4">
                <p className="text-white font-bold text-center">MGH Zamindar File<br /><span className="text-sm font-normal text-blue-100">5 Marla, 125 sq yards, Mangla</span></p>
              </div>
            )}
            <div className="p-4">
              <h3 className="font-bold text-navy">{w.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{w.note}</p>
            </div>
          </article>
        ))}
      </div>

      <h2 className="text-xl font-bold text-navy mt-10">Frequently asked questions</h2>
      <div className="mt-3 space-y-3">
        {FAQ.map((f) => (
          <div key={f.q} className="border border-gray-200 rounded-lg p-4 bg-white">
            <p className="font-semibold">{f.q}</p>
            <p className="text-sm text-gray-600 mt-1">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
