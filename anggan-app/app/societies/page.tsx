import Image from "next/image";
import Link from "next/link";

const GUIDES = [
  { name: "MGH Pakistan, Mangla", note: "Precincts 01 to 06 on Mangla Gaddari Road, Mangla Cantt, Jhelum.", href: "/projects/proj-1", label: "Open project", img: "mgh-lake-aerial.jpg", caption: "Mangla Lake, MGH Pakistan", contain: false },
  { name: "Al-Kabir Town, Lahore", note: "China Town sits inside the Al-Kabir Town guide on anngan.com.", href: "/projects/proj-5", label: "Open China Town", img: "chinatown-bahria-sky.jpg", caption: "Bahria Sky, where China Town is located", contain: false },
  { name: "Paragon City, Lahore", note: "Anngan head office: 57-S, 2nd Floor, Imperial Homes, Paragon City.", href: "/contact", label: "Visit us", img: "", caption: "Anngan head office, Paragon City", contain: false },
  { name: "DHA Lahore", note: "10 Marla houses and 1 Kanal houses in the real listings on this site.", href: "/properties?q=DHA", label: "See DHA listings", img: "lst-dha-stunning.jpg", caption: "House in DHA Lahore", contain: false },
  { name: "Bahria Town, Lahore and Rawalpindi", note: "Houses for sale and rent in Bahria Town on this site.", href: "/properties?q=Bahria", label: "See Bahria listings", img: "bahria-eiffel.jpg", caption: "Eiffel Tower, Bahria Town, Lahore", contain: false },
  { name: "Kashmir Modern City, Mirpur", note: "Sold Out. Developer Al-Baari. Soft launch at Mirpur, 21 Dec 2022.", href: "/projects/proj-7", label: "Open project", img: "kmc-01.jpg", caption: "Kashmir Modern City, Mirpur", contain: false },
];

export default function SocietiesPage() {
  return (
    <div>
      <p className="text-sm text-gray-600">Home &rsaquo; Societies Guide</p>
      <h1 className="text-3xl font-bold text-navy mt-1">Societies guide</h1>
      <p className="text-gray-600 mt-1">Guides for the societies Anngan covers.</p>
      <div className="grid gap-4 mt-6 sm:grid-cols-2">
        {GUIDES.map((g, i) => (
          <article key={g.name} className="card border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-full">
            <figure>
              {g.img ? (
                <Image
                  src={`/img/${g.img}`}
                  alt={g.caption}
                  width={1200}
                  height={675}
                  className="w-full h-40 object-cover bg-navy"
                  loading={i < 2 ? "eager" : "lazy"}
                  priority={i < 2}
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-40 bg-navy flex flex-col items-center justify-center text-white px-4 text-center">
                  <svg viewBox="0 0 64 40" width="48" height="30" aria-hidden="true" className="shrink-0">
                    <path d="M4 38 V22 L32 4 L60 22 V38 H44 V26 H20 V38 Z" fill="none" stroke="#DDB78B" strokeWidth="3" strokeLinejoin="round" />
                  </svg>
                  <span className="font-bold text-base mt-2">{g.name}</span>
                  <span className="text-xs text-white/70 mt-1">Photo coming soon. Call the office for details.</span>
                </div>
              )}
              <figcaption className="text-xs text-gray-600 px-4 pt-2">{g.caption}</figcaption>
            </figure>
            <div className="p-4 pt-2 flex flex-col flex-1">
              <h2 className="font-bold text-navy text-lg leading-snug">{g.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{g.note}</p>
              <div className="mt-auto pt-3">
                <Link href={g.href} className="bg-anngan text-white text-sm px-3 py-2.5 rounded font-semibold min-h-[48px] inline-flex items-center inline-block">{g.label}</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="text-sm text-gray-600 mt-6">Call +92 304 1111 698 to ask about a society not listed here.</p>
    </div>
  );
}
