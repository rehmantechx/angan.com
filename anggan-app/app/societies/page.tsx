import Link from "next/link";

const GUIDES = [
  { name: "MGH Pakistan, Mangla", note: "Precincts 01 to 06 on Mangla Gaddari Road, Mangla Cantt, Jhelum.", href: "/projects/proj-1", label: "Open project" },
  { name: "Al-Kabir Town, Lahore", note: "China Town sits inside the Al-Kabir Town guide on anngan.com.", href: "/projects/proj-5", label: "Open China Town" },
  { name: "Paragon City, Lahore", note: "Anngan head office: 57-S, 2nd Floor, Imperial Homes, Paragon City.", href: "/contact", label: "Visit us" },
  { name: "DHA Lahore", note: "10 Marla houses and 1 Kanal houses in the real listings on this site.", href: "/properties?q=DHA", label: "See DHA listings" },
  { name: "Bahria Town, Lahore and Rawalpindi", note: "Houses for sale and rent in Bahria Town on this site.", href: "/properties?q=Bahria", label: "See Bahria listings" },
  { name: "Kashmir Modern City, Mirpur", note: "Sold Out. Developer Al-Baari. Soft launch at Mirpur, 21 Dec 2022.", href: "/projects/proj-7", label: "Open project" },
];

export default function SocietiesPage() {
  return (
    <div>
      <p className="text-sm text-gray-500">Home &rsaquo; Societies Guide</p>
      <h1 className="text-3xl font-bold text-navy mt-1">Societies guide</h1>
      <p className="text-gray-600 mt-1">Guides for the societies Anngan covers.</p>
      <div className="grid gap-4 mt-6 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <article key={g.name} className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
            <h2 className="font-bold text-navy text-lg">{g.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{g.note}</p>
            <Link href={g.href} className="bg-anngan text-white text-sm px-3 py-2 rounded font-semibold inline-block mt-3">{g.label}</Link>
          </article>
        ))}
      </div>
      <p className="text-sm text-gray-600 mt-6">No listing count is invented for any society. Call +92 304 1111 698 to ask about a society not listed here.</p>
    </div>
  );
}
