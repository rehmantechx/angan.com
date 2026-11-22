import Image from "next/image";
import Link from "next/link";

const GUIDES = [
  { name: "MGH Pakistan, Mangla", note: "Precincts 01 to 06 on Mangla Gaddari Road, Mangla Cantt, Jhelum.", href: "/projects/proj-1", label: "Open project", img: "mgh-lake-aerial.jpg", caption: "Mangla Lake, MGH Pakistan", contain: false },
  { name: "Al-Kabir Town, Lahore", note: "China Town sits inside the Al-Kabir Town guide on anngan.com.", href: "/projects/proj-5", label: "Open China Town", img: "chinatown-bahria-sky.jpg", caption: "Bahria Sky, where China Town is located", contain: false },
  { name: "Paragon City, Lahore", note: "Anngan head office: 57-S, 2nd Floor, Imperial Homes, Paragon City.", href: "/contact", label: "Visit us", img: "logo.png", caption: "Anngan head office, Paragon City", contain: true },
  { name: "DHA Lahore", note: "10 Marla houses and 1 Kanal houses in the real listings on this site.", href: "/properties?q=DHA", label: "See DHA listings", img: "lst-dha-stunning.jpg", caption: "House in DHA Lahore", contain: false },
  { name: "Bahria Town, Lahore and Rawalpindi", note: "Houses for sale and rent in Bahria Town on this site.", href: "/properties?q=Bahria", label: "See Bahria listings", img: "lst-bahria-luxury.jpg", caption: "House in Bahria Town, Lahore", contain: false },
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
              <Image
                src={`/img/${g.img}`}
                alt={g.caption}
                width={1200}
                height={675}
                className={g.contain ? "w-full h-40 object-contain bg-white p-4" : "w-full h-40 object-cover bg-navy"}
                loading={i < 2 ? "eager" : "lazy"}
                priority={i < 2}
                sizes="(max-width: 640px) 100vw, 50vw"
              />
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
      <p className="text-sm text-gray-600 mt-6">No listing count is invented for any society. Call +92 304 1111 698 to ask about a society not listed here.</p>
    </div>
  );
}
