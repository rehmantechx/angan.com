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


// Videos found on the real Anngan YouTube channel (@annganpk,
// UC7lbVe_2Lfw8dzThSaAq6Aw). Every ID was verified from the channel
// itself (feed + yt-dlp metadata, 22 Nov 2026). No video was created
// or generated for this site. Titles are the channel's own titles,
// shortened only where the full title is a long run-on. View counts
// are the counts the channel showed on 22 Nov 2026.
const VIDEOS = [
  { id: "McDA63SyDM0", title: "CEO Anngan briefing of MGH Pakistan", views: "81 views", date: "2 Mar 2024" },
  { id: "LbE6iCeOn2A", title: "Affidavit File information of MGH Pakistan, CEO Mahmood Cheema", views: "288 views", date: "30 Nov 2023" },
  { id: "UxOpwyG6YJA", title: "Zamindar File, MGH Pakistan, best property in Pakistan", views: "629 views", date: "4 Feb 2023" },
  { id: "mYdjdXwYbjg", title: "MGH Pakistan Zamindar File, society information", views: "567 views", date: "10 Mar 2023" },
  { id: "JJt819sUedg", title: "CEO Mahmood Cheema clarifies MGH Zamindar File notice", views: "150 views", date: "29 Jun 2024" },
  { id: "EsdRAgr71bY", title: "CEO Mahmood Cheema visits Al-Ghani Garden Phase 7, full briefing", views: "248 views", date: "31 Jul 2026" },
];

const YOUTUBE_URL = "https://www.youtube.com/channel/UC7lbVe_2Lfw8dzThSaAq6Aw";

export default function AboutPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">About Anngan</h1>
      <p className="text-gray-600 mt-1">
        Pakistan's most trusted real estate service provider. <span className="urdu-tagline" lang="ur">بنائے خواب حقیقت</span>
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

      <h2 className="text-xl font-bold text-navy mt-10">Watch Mahmood Asghar Cheema on MGH</h2>
      <p className="text-gray-600 text-sm mt-1">
        Short briefings from the Anngan YouTube channel, @annganpk. Tap a
        video to watch it on YouTube, or open the channel.
      </p>
      <div className="mt-4 flex gap-2 flex-wrap">
        <a href={YOUTUBE_URL} target="_blank" rel="noopener" className="btn btn-red text-sm" aria-label="Open the Anngan YouTube channel">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="shrink-0"><rect width="24" height="24" rx="5" fill="#fff" /><path d="M10 8.5v7l6-3.5-6-3.5z" fill="#DD3333" /></svg>
          Watch on YouTube, @annganpk
        </a>
      </div>
      <div className="grid gap-4 mt-4 sm:grid-cols-2">
        {VIDEOS.map((v) => (
          <article key={v.id} className="card border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-full">
            <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener" aria-label={`Watch on YouTube: ${v.title}`} className="relative block w-full aspect-video bg-navy group">
              {/* Plain <img> with loading="lazy" left a blank white box
                  for the below-fold videos until they scrolled into view
                  and loaded. These thumbnails are small local files
                  (11 to 37 KB each, about 130 KB for all six), so load
                  them all eagerly on a navy background with the play
                  button always visible, never a blank white box. */}
              <Image src={`/img/yt-${v.id}.jpg`} alt={v.title} width={480} height={360} loading="eager" className="absolute inset-0 w-full h-full object-cover bg-navy" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="bg-anngan text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow-lg group-hover:bg-[#C81E1E]" aria-hidden="true">&#9654;</span>
              </span>
            </a>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-navy">{v.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{v.views} &middot; {v.date}</p>
              <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener" className="text-anngan-dark font-semibold text-sm mt-2 inline-flex items-center min-h-[48px]">
                Watch on YouTube &rarr;
              </a>
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
