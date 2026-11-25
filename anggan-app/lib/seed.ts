// Real data copied from the live static site (assets/js/main.js and admin/js/data.js).
// 12 listings (9 for sale, 3 for rent), 7 projects, 23 blogs,
// 9 Angan Tech services. Nothing invented. The 13 agencies from anngan.com
// are kept in this file for the office dashboard only and are not shown
// anywhere on the public site.
// show no photo: Pak China Grain Market (project) and the Rs 35,000,000 house,
// which is not among the 12 real listings and is not included here.
export type Listing = { id: string; title: string; price: string; n: number; beds: number; baths: number; size: string; city: string; loc: string; type: string; status: "sale" | "rent"; img: string; badge: string; url: string; liveStatus: "live" | "pending" | "hidden"; visible: boolean; createdAt: string; submittedBy?: string };
export type ProjectStatus = "Available" | "Coming Soon" | "Sold Out";
export type Project = { id: string; name: string; loc: string; city: string; page: string; img: string; note: string; cardImg?: string; status?: ProjectStatus; details?: string; order?: number };
export type Blog = { id: string; date: string; title: string; url: string; coverImg?: string; body?: string };
export type Agency = { id: string; name: string; logo: string; logoUrl?: string; link?: string; order?: number };
export type Service = { id: string; name: string; note: string; page: string; details?: string; order?: number };
export type Enquiry = { id: string; name: string; phone: string; asked: string; how: string; stage: "New" | "Called" | "Visit" | "Deal Done"; next: string; date: string };
export type HeroSlide = { src: string; alt: string };
export type TeamMember = { id: string; name: string; role: string; photoUrl?: string; linkedinUrl?: string };
// Site content the office edits in /admin, stored in Firestore
// (settings/office, public read, office write only) and read live by
// the public site. Photo upload goes through the free Cloudinary
// unsigned preset (lib/upload.ts); until the owner sets that up,
// admin image fields take a photo URL. Seed defaults below apply
// until the office saves its own values, so the site works before
// any edit.
export type OfficeSettings = { phone: string; whatsapp: string; email: string; address: string; ceo: string; ceoPhoto?: string; heroTitle?: string; heroTagline?: string; heroSlides?: HeroSlide[]; bannerImages?: HeroSlide[]; aboutStory?: string; team?: TeamMember[]; techTeam?: TeamMember[]; socialLinks?: SocialLink[]; footerAbout?: string; footerCopyright?: string; cityCards?: CityCard[]; homeHeadings?: HomeHeadings; homeMghTitle?: string; homeMghText?: string; homeSocieties?: HomeSocietyChip[]; societies?: SocietyGuide[]; societiesTitle?: string; societiesIntro?: string; aboutIntro?: string; aboutVideos?: AboutVideo[]; aboutFaq?: AboutFaq[]; aboutFilesImg?: string; aboutFilesNote?: string; companies?: CompanyCard[]; contactIntro?: string; legalPrivacy?: string; legalTerms?: string; legalDisclaimer?: string; navHidden?: string[] };
// "details" on Project and Service is the office's own extra text,
// edited in /admin, shown on the project/service page under the
// verified facts. The structured facts themselves (service included
// items and steps, project facts, photos and galleries) stay in
// lib/serviceDetails.ts and lib/projectDetails.ts as the verified
// baseline copied from the real static site pages; the office adds
// or changes the intro text here, no code change.
// Home hero, 7 real photos already in the repo, no AI, no invented
// photo. Order: Mangla lake, MGH Precinct 01,
// Talwar Chowk Bahria Town, Sharda Neelum Valley, Serene Farm Houses,
// Urban City golf course, Jasmine Block Bahria Town.
// QUALITY (user order 2026-11-25): all hero photos were blurry on a
// full-width hero because the sources are 560-1200px wide and the hero
// shows up to 1920px wide plus a 1.08 Ken Burns zoom. Slides 4 and 5
// are high-resolution replacements from Wikimedia Commons, same
// places, real photos, checked by eye: Talwar Chowk, Bahria Town,
// Lahore, 3456px, CC BY 4.0, AlidPedian (cropped to the monument band,
// hero-bahria-talwar.jpg, 2400px); Sharda, Neelum Valley, 6000px,
// CC BY-SA 3.0, Umar Jamshaid (hero-sharda-valley.jpg, 2400px). No
// high-resolution real photo exists on Commons for Mangla Lake aerial,
// MGH Precinct 01, Serene Farm Houses or Urban City golf, so those
// keep their 1100-1200px originals at quality 90; the client must send
// a real high-resolution photo to make them sharp at 1920px wide.
// SLIDE 8 REMOVED 2026-11-25 (user: "shit pic replace this pic"):
// alghani-aerial.jpg was a 560px CGI masterplan render with
// "AL GHANI DEVELOPERS" baked into the image, not a real photo.
// Replaced by Jasmine Block, Bahria Town, Lahore, 3456px, CC BY 4.0,
// AlidPedian (hero-bahria-jasmine.jpg, 2400x1350), a real street-level
// photo of premium houses, checked by eye, no baked-in text.
// SLIDE 2 REMOVED 2026-11-25: urban-drone.jpg was a 4-quadrant
// collage of CGI renders with visible seams, not a real drone photo.
// No real high-resolution Lahore housing aerial exists on Commons
// (all candidates read by eye and rejected: Walled City top-down
// street scene, Maraghzar with a red name baked in, Lahore street
// rickshaws, Old Lahore dark bazaar, Behria panorama driveway,
// Rizvi Plaza with other businesses' signs), so the slide was
// dropped, not replaced with a worse photo. Hero is 7 slides now.
// urban-drone.jpg stays in the repo: it is still the Urban City
// project gallery image (lib/projectDetails.ts), only the hero
// rotation dropped it.
export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  { src: "/img/mgh-lake-aerial.jpg", alt: "Mangla Lake aerial view, MGH Pakistan" },
  { src: "/img/mgh-precinct-01.jpg", alt: "MGH Pakistan, Precinct 01, Mangla" },
  { src: "/img/hero-bahria-talwar.jpg", alt: "Talwar Chowk, Bahria Town, Lahore" },
  { src: "/img/hero-sharda-valley.jpg", alt: "Sharda, Neelum Valley, Kashmir" },
  { src: "/img/mgh-serene-farmhouses.jpg", alt: "Serene Farm Houses, MGH Pakistan, Mangla" },
  { src: "/img/urban-golf.jpg", alt: "Urban City golf course, Lahore" },
  { src: "/img/hero-bahria-jasmine.jpg", alt: "Jasmine Block, Bahria Town, Lahore" },
];
export const DEFAULT_HERO_TITLE = "WELCOME TO ANNGAN.COM";
export const DEFAULT_HERO_TAGLINE = "Pakistan's Most Trusted Real Estate Service Providers";
// Banner images: shown behind the home search panel, under a dark
// navy overlay, so the panel reads as a photo banner. Real photos
// already in the repo.
export const DEFAULT_BANNER_IMAGES: HeroSlide[] = [
  { src: "/img/city-all-cities-collage.jpg", alt: "Lahore, Islamabad, Karachi and Multan landmarks" },
  { src: "/img/bahria-eiffel.jpg", alt: "Bahria Town Eiffel Tower, Lahore" },
  { src: "/img/mgh-precinct-01.jpg", alt: "MGH Pakistan, Precinct 01, Mangla" },
];
// Our Story default: the two paragraphs already on /about, verbatim.
// No new claims added.
export const DEFAULT_ABOUT_STORY =
  "ANNGAN.COM gives customers top-tier real estate solutions under one roof. We work every day to be Pakistan's trusted source for real estate.\n\nOur landmark projects are MGH Pakistan at Mangla, Kashmir Modern City and Global Homes Lahore.";
// Our Team default (user order 2026-11-25, from the old anngan.com
// /about-us "Meet our Team", Leadership): the MAIN team, in this order.
// Names exactly as on the old site, nothing invented. Role for
// Cheema is "Chairman and Chief Executive Officer" (user order
// 2026-11-26), not "CEO" only.
// Photos are real: Cheema reuses the repo CEO portrait, cropped to
// a 16:9 team-card frame as ceo-team.jpg (560x315, from ceo-flat.jpg
// x=246..806, y=0..315, full face and shoulders). ceo-portrait-v2.jpg
// is a tall headshot and does NOT fit the wide card frame, it cropped
// to a forehead close-up, so it is not used here. Talha and Taha are
// anngan.com/wp-content/uploads/2022/12/Sir-Talha.jpg (1928x1928)
// and Sir-Taha-scaled.jpg (2560x2560), read by eye, sharp studio
// portraits, white background, no baked-in text, saved in the repo as
// team-talha.jpg and team-taha.jpg, 800x800. The old site also lists
// Hammad Kiyani, Head Of Construction, who is NOT included: the user
// named only these 3 for the main team.
export const DEFAULT_TEAM: TeamMember[] = [
  { id: "team-cheema", name: "M. Mahmood Cheema", role: "Chairman and Chief Executive Officer", photoUrl: "/img/ceo-team.jpg" },
  { id: "team-talha", name: "M. Talha Mahmood", role: "Director Call Center", photoUrl: "/img/team-talha.jpg" },
  { id: "team-taha", name: "M. Taha Mahmood", role: "Head Of Administration", photoUrl: "/img/team-taha.jpg" },
];
// Tech Team default (user order 2026-11-25): the 3 people who built
// this website. LinkedIn would not open for a read (profile pages
// return 429/999 and the authwall, tried 25 Nov 2026), so NO photo
// could be taken from LinkedIn and no role is claimed from LinkedIn.
// REAL PHOTOS 26 Nov 2026: the user sent the 3 photos himself, all
// rotated 90 degrees sideways, rotated upright and cropped to clean
// head-and-shoulders portraits 1000x1250 in public/img/team/:
// team-malik-abdur-rehman.jpg (striped shirt), team-m-bilal-shah.jpg
// (grey Audi quattro sweatshirt), team-muhammad-daud-ali-lashari.jpg
// (checkered shirt at the SABZ standee). No stock or AI face is used.
// CARD CROPS 26 Nov 2026: the Development Team cards show a short
// wide photo box (h-28), and the 1000x1250 portraits with object-top
// showed only the wall above Daud's head, his face cut off. So each
// portrait also has a face-centred 1000x620 band, *-card.jpg, which
// is what the cards actually use. The 1000x1250 originals stay in
// public/img/team/ unreferenced, never deleted without his say-so.
// Roles use only facts from the user's own records: Abdur Rehman is
// a B.S. Computer Science undergrad at Lahore Garrison University and
// a Python Programming Intern at Decode Labs; M. Bilal Shah Gillani
// is an AI Championship teammate (SABZ, explains the brain); Muhammad
// Daud Ali Lashari is founder of Zepra Tech and an entrepreneur and
// hands-on digital marketer, verified from his public LinkedIn by the
// main agent on 25 Nov 2026. The office can change name, role, photo
// link and LinkedIn link for any member in /admin, About and team.
export const DEFAULT_TECH_TEAM: TeamMember[] = [
  { id: "tech-abdur-rehman", name: "Malik Abdur Rehman", role: "Python Programming Intern, Decode Labs", photoUrl: "/img/team/team-malik-abdur-rehman-card.jpg", linkedinUrl: "https://www.linkedin.com/in/malik-abdur-rehman-9b4228358/" },
  { id: "tech-bilal-shah", name: "M. Bilal Shah", role: "AI Championship Team Member, SABZ", photoUrl: "/img/team/team-m-bilal-shah-card.jpg", linkedinUrl: "https://www.linkedin.com/in/m-bilal-shah-3a7980220/" },
  { id: "tech-daud-lashari", name: "Muhammad Daud Ali Lashari", role: "Founder, Zepra Tech", photoUrl: "/img/team/team-muhammad-daud-ali-lashari-card.jpg", linkedinUrl: "https://www.linkedin.com/in/muhammad-daud-ali-lashari-1302a5337/" },
];
// FULLY EDITABLE DASHBOARD 25 Nov 2026 (user order: the whole website
// editable from /admin, no developer needed afterwards). Every text,
// link and picture below used to be hard-coded in a page file. It now
// lives here as a seed default AND in the Firestore settings/office
// document, where the office changes it in /admin. The public pages
// read it through lib/siteContent.ts, falling back to these defaults
// when a field is empty, so nothing breaks. No public design changed,
// only where the words and pictures come from.
export type SocialLink = { label: string; href: string };
export type CityCard = { name: string; landmark: string; img: string; alt: string; href: string; kind: "listings" | "project" | "all"; sub?: string; pos?: string };
export type SocietyGuide = { name: string; note: string; href: string; label: string; img: string; caption: string; contain: boolean };
export type AboutVideo = { id: string; title: string; views: string; date: string };
export type AboutFaq = { q: string; a: string };
export type CompanyCard = { id: string; name: string; desc: string; href: string; linkLabel: string };
export type HomeHeadings = { browseCities: string; featured: string; societies: string; partnerAgencies: string; ourProjects: string; whoIsAnngan: string };
export type HomeSocietyChip = { name: string; img: string; href: string };
export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { label: "Facebook", href: "https://www.facebook.com/annganpk" },
  { label: "X", href: "https://twitter.com/annganpk" },
  { label: "LinkedIn", href: "https://pk.linkedin.com/company/annganpk" },
  { label: "Instagram", href: "https://instagram.com/annganpk" },
  { label: "YouTube", href: "https://www.youtube.com/channel/UC7lbVe_2Lfw8dzThSaAq6Aw" },
];
export const DEFAULT_FOOTER_ABOUT = "Pakistan's trusted real estate service provider. Projects and property in Karachi, Islamabad, Lahore and Peshawar.";
export const DEFAULT_FOOTER_COPYRIGHT = "Copyright \u00A9 ANNGAN TECHNOLOGIES PVT. LTD. All rights reserved.";
export const DEFAULT_HOME_HEADINGS: HomeHeadings = { browseCities: "Browse by city", featured: "Featured Properties", societies: "Societies", partnerAgencies: "Partner agencies", ourProjects: "Our projects", whoIsAnngan: "Who is Anngan?" };
export const DEFAULT_HOME_MGH_TITLE = "MGH Zamindar File, Mangla";
export const DEFAULT_HOME_SOCIETIES: HomeSocietyChip[] = [
  { name: "DHA Lahore", img: "lst-dha-stunning.jpg", href: "/properties?q=DHA" },
  { name: "Bahria Town", img: "bahria-eiffel.jpg", href: "/properties?q=Bahria" },
  { name: "MGH Pakistan", img: "mgh-precinct-01.jpg", href: "/projects/proj-1" },
  { name: "Kashmir Modern City", img: "kmc-02-4x3.jpg", href: "/projects/proj-7" },
];
export const DEFAULT_HOME_MGH_TEXT = "MGH Pakistan at Mangla is Pakistan's first and biggest natural lake view housing project, on 7KM Mangla Gaddari Road, Mangla Cantt, Jhelum. Anngan is a Platinum partner of the project.\n\nThe Zamindar File carries a 10% quota in balloting. Affidavit MGH and Serene Farm Houses in Precincts 05 and 06 are also available. File rates change with the market, call +92 304 1111 698 for today's rate.";
export const DEFAULT_CITY_CARDS: CityCard[] = [
  { name: "Lahore", landmark: "Badshahi Mosque", img: "city-lahore-badshahi-day.jpg", alt: "Badshahi Mosque, Lahore, in daylight", href: "/properties?city=Lahore", kind: "listings", pos: "object-top" },
  { name: "Islamabad", landmark: "Faisal Mosque", img: "city-islamabad-faisal-day.jpg", alt: "Faisal Mosque, Islamabad, in daylight with Margalla Hills", href: "/properties?city=Islamabad", kind: "listings", pos: "object-top" },
  { name: "Karachi", landmark: "Mazar-e-Quaid", img: "city-karachi-mazar-wide.jpg", alt: "Mazar-e-Quaid, Karachi, whole mausoleum with gardens", href: "/properties?city=Karachi", kind: "listings", pos: "object-top" },
  { name: "Rawalpindi", landmark: "Raja Bazaar", img: "city-rawalpindi-raja-bazaar-aerial.jpg", alt: "Raja Bazaar, Rawalpindi, wide rooftop view over the bazaar, mosque minaret and dome", href: "/properties?city=Rawalpindi", kind: "listings", pos: "object-top" },
  { name: "Multan", landmark: "Shah Rukn-e-Alam", img: "city-multan-shah-rukn-sky.jpg", alt: "Tomb of Shah Rukn-e-Alam, Multan", href: "/properties?city=Multan", kind: "listings", pos: "object-left-top" },
  { name: "Mangla", landmark: "Mangla Dam", img: "city-mangla-dam.jpg", alt: "Mangla Dam, seen from Ramkot Fort", href: "/projects/proj-1", kind: "project", sub: "MGH Pakistan", pos: "object-top" },
  { name: "Kashmir", landmark: "Sharda, Neelum Valley", img: "city-kashmir-neelum.jpg", alt: "Sharda, Neelum Valley, Kashmir", href: "/projects/proj-7", kind: "project", sub: "Kashmir Modern City", pos: "object-top" },
  { name: "All cities", landmark: "", img: "city-all-cities-collage.jpg", alt: "All cities in daylight: Badshahi Mosque Lahore, Faisal Mosque Islamabad, Mazar-e-Quaid Karachi, Shah Rukn-e-Alam Multan", href: "/properties", kind: "all", sub: "12 homes", pos: "object-top" },
];
export const DEFAULT_SOCIETIES_TITLE = "Societies guide";
export const DEFAULT_SOCIETIES_INTRO = "Guides for the societies Anngan covers.";
export const DEFAULT_SOCIETIES: SocietyGuide[] = [
  { name: "MGH Pakistan, Mangla", note: "Precincts 01 to 06 on Mangla Gaddari Road, Mangla Cantt, Jhelum.", href: "/projects/proj-1", label: "Open project", img: "mgh-lake-aerial.jpg", caption: "Mangla Lake, MGH Pakistan", contain: false },
  { name: "Al-Kabir Town, Lahore", note: "China Town sits inside the Al-Kabir Town guide on anngan.com.", href: "/projects/proj-5", label: "Open China Town", img: "chinatown-bahria-sky.jpg", caption: "Bahria Sky, where China Town is located", contain: false },
  { name: "Paragon City, Lahore", note: "Anngan head office: 57-S, 2nd Floor, Imperial Homes, Paragon City.", href: "/contact", label: "Visit us", img: "", caption: "Anngan head office, Paragon City", contain: false },
  { name: "DHA Lahore", note: "10 Marla houses and 1 Kanal houses in the real listings on this site.", href: "/properties?q=DHA", label: "See DHA listings", img: "lst-dha-stunning.jpg", caption: "House in DHA Lahore", contain: false },
  { name: "Bahria Town, Lahore and Rawalpindi", note: "Houses for sale and rent in Bahria Town on this site.", href: "/properties?q=Bahria", label: "See Bahria listings", img: "bahria-eiffel.jpg", caption: "Eiffel Tower, Bahria Town, Lahore", contain: false },
  { name: "Kashmir Modern City, Mirpur", note: "Sold Out. Developer Al-Baari. Soft launch at Mirpur, 21 Dec 2022.", href: "/projects/proj-7", label: "View project", img: "kmc-01-16x10.jpg", caption: "Kashmir Modern City, Mirpur", contain: false },
];
export const DEFAULT_ABOUT_INTRO = "Pakistan's most trusted real estate service provider.";
export const DEFAULT_ABOUT_VIDEOS: AboutVideo[] = [
  { id: "McDA63SyDM0", title: "CEO Anngan briefing of MGH Pakistan", views: "81 views", date: "2 Mar 2024" },
  { id: "LbE6iCeOn2A", title: "Affidavit File information of MGH Pakistan, CEO Mahmood Cheema", views: "288 views", date: "30 Nov 2023" },
  { id: "UxOpwyG6YJA", title: "Zamindar File, MGH Pakistan, best property in Pakistan", views: "629 views", date: "4 Feb 2023" },
  { id: "mYdjdXwYbjg", title: "MGH Pakistan Zamindar File, society information", views: "567 views", date: "10 Mar 2023" },
  { id: "JJt819sUedg", title: "CEO Mahmood Cheema clarifies MGH Zamindar File notice", views: "150 views", date: "29 Jun 2024" },
  { id: "EsdRAgr71bY", title: "CEO Mahmood Cheema visits Al-Ghani Garden Phase 7, full briefing", views: "248 views", date: "31 Jul 2026" },
];
export const DEFAULT_ABOUT_FAQ: AboutFaq[] = [
  { q: "What is MGH Zamindar File?", a: "A file product of MGH Pakistan at Mangla. Call +92 304 1111 698 for today's rate." },
  { q: "Where is the Anngan office?", a: "57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore. Phone +92 304 1111 698, email info@anngan.com." },
  { q: "Which cities does Anngan cover?", a: "Karachi, Islamabad, Lahore and Peshawar, plus projects at Mangla, Multan and Kashmir." },
  { q: "How do I create a listing?", a: "Use Create a Listing on this site, or call +92 304 1111 698 with the details and photos." },
];
export const DEFAULT_ABOUT_FILES_IMG = "/img/mgh-zamindar-file.jpg";
export const DEFAULT_ABOUT_FILES_NOTE = "MGH Zamindar File, Affidavit MGH, Serene Farm Houses. E-STAMP allotment letter. Call for today's file rate.";
export const DEFAULT_COMPANIES: CompanyCard[] = [
  { id: "technologies", name: "Angan Tech", desc: "Anngan Technologies Pvt. Ltd, Lahore. Chairman and Chief Executive Officer, Muhammad Mahmood Cheema.", href: "/services", linkLabel: "Open Angan Tech" },
  { id: "construction", name: "Anngan Construction", desc: "One of the three Anngan group companies. Ask the office about construction work.", href: "tel:+923041111698", linkLabel: "Ask the team" },
  { id: "marketing", name: "Corporate Angle Marketing", desc: "One of the three Anngan group companies. Ask the office about marketing.", href: "tel:+923041111698", linkLabel: "Ask the team" },
];
export const DEFAULT_CONTACT_INTRO = "The fastest way to reach the office is WhatsApp or a call. The form below goes straight to the office dashboard.";
export const DEFAULT_LEGAL_PRIVACY = "When you send an enquiry through this website, we collect only what you type in the form: your name, phone number, and what you asked about. We use it only to call you back about that property or project.\n\nWe do not sell your details to anyone, and we do not share them with other dealers or advertisers. Your details stay with the Anngan office.\n\nThis website does not ask for payment details, bank details, or identity documents. Never send those through the website.\n\nIf you want your enquiry deleted, call the office on +92 304 1111 698 or email info@anngan.com and we will remove it.";
export const DEFAULT_LEGAL_TERMS = "Listings, prices, sizes and availability on this website are shown as given to us by the owner or dealer. They can change without notice. Always call the office on +92 304 1111 698 to confirm the price and availability before you visit or pay anything.\n\nFile rates for MGH Pakistan and other projects change with the market. The rate on the website is a guide only. The rate on the day you deal is the rate the office confirms on the phone.\n\nNothing on this website is a booking, a token, or a payment. No payment is taken through this website. Any payment is made only at the office, with a proper receipt.\n\nPhotos on this website are of the real property or project named, unless the card says the photo is coming soon.";
export const DEFAULT_LEGAL_DISCLAIMER = "The information on this website is a guide to help you find a property or project. It is not a guarantee of price, size, availability, approval, or return on investment.\n\nProperty and project details can change. Before you make any decision or payment, check the documents yourself and confirm the details with the office on +92 304 1111 698.\n\nAnngan Technologies Pvt. Ltd is not responsible for decisions made only from this website without checking with the office first.";
export const LISTINGS: Listing[] = [
  {
    "id": "karachi-shamsi",
    "title": "Brand new flat for sale in Shamsi Society Airport, Karachi",
    "price": "Rs 3,600,000",
    "n": 3600000,
    "beds": 2,
    "baths": 2,
    "size": "4 Marla",
    "city": "Karachi",
    "loc": "Shamsi Society Airport, Karachi",
    "type": "Flat",
    "status": "sale",
    "img": "lst-karachi-shamsi.jpg",
    "badge": "Super Hot",
    "url": "https://anngan.com/property/brand-new-flat-for-sale-in-shamsi-society-airport-karachi/",
    "liveStatus": "live",
    "visible": true,
    "createdAt": "2023-01-01"
  },
  {
    "id": "dha-stunning",
    "title": "10 Marla Stunning House for Sale in DHA Lahore",
    "price": "Rs 49,000,000",
    "n": 49000000,
    "beds": 5,
    "baths": 6,
    "size": "10 Marla",
    "city": "Lahore",
    "loc": "DHA Lahore",
    "type": "House",
    "status": "sale",
    "img": "lst-dha-stunning.jpg",
    "badge": "Super Hot",
    "url": "https://anngan.com/property/10-marla-stunning-house-for-sale-in-dha-lahore/",
    "liveStatus": "live",
    "visible": true,
    "createdAt": "2023-01-01"
  },
  {
    "id": "dha-defence4",
    "title": "10 Marla House for Sale in Defence Phase-IV Lahore",
    "price": "Rs 60,000,000",
    "n": 60000000,
    "beds": 4,
    "baths": 4,
    "size": "10 Marla",
    "city": "Lahore",
    "loc": "Defence Phase-IV, Lahore",
    "type": "House",
    "status": "sale",
    "img": "lst-dha-defence4.jpg",
    "badge": "For Sale",
    "url": "https://anngan.com/property/10-marla-house-for-sale-in-defence-phase-iv-lahore/",
    "liveStatus": "live",
    "visible": true,
    "createdAt": "2023-01-01"
  },
  {
    "id": "dha-u7",
    "title": "10 Marla House for Sale, Sector U Phase 7 DHA Lahore",
    "price": "Rs 46,000,000",
    "n": 46000000,
    "beds": 4,
    "baths": 5,
    "size": "10 Marla",
    "city": "Lahore",
    "loc": "Sector U, Phase 7, DHA Lahore",
    "type": "House",
    "status": "sale",
    "img": "lst-dha-u7.jpg",
    "badge": "For Sale",
    "url": "https://anngan.com/property/10-marla-house-for-sale-sector-u-phase-7-dha-lahore/",
    "liveStatus": "live",
    "visible": true,
    "createdAt": "2023-01-01"
  },
  {
    "id": "dha-1kanal",
    "title": "1 Kanal House for Sale at Prime Location of DHA Phase 7",
    "price": "Rs 65,000,000",
    "n": 65000000,
    "beds": 5,
    "baths": 6,
    "size": "1 Kanal",
    "city": "Lahore",
    "loc": "DHA Phase 7, Lahore",
    "type": "House",
    "status": "sale",
    "img": "lst-dha-1kanal.jpg",
    "badge": "For Sale",
    "url": "https://anngan.com/property/1-kanal-beautiful-new-house-for-sale-at-prime-location-of-dha-phase-7/",
    "liveStatus": "live",
    "visible": true,
    "createdAt": "2023-01-01"
  },
  {
    "id": "bahria-luxury",
    "title": "10 Marla brand new ultra modern stylish luxury house in Bahria Town Lahore",
    "price": "Rs 47,500,000",
    "n": 47500000,
    "beds": 5,
    "baths": 7,
    "size": "10 Marla",
    "city": "Lahore",
    "loc": "Bahria Town, Lahore",
    "type": "House",
    "status": "sale",
    "img": "lst-bahria-luxury.jpg",
    "badge": "For Sale",
    "url": "https://anngan.com/property/10-marla-brand-new-ultra-modren-stylish-luxury-house-in-bahria-town-lahore/",
    "liveStatus": "live",
    "visible": true,
    "createdAt": "2023-01-01"
  },
  {
    "id": "alhafeez",
    "title": "5 Marla double story brand new house for sale in Al Hafeez Garden Phase 1",
    "price": "Rs 16,500,000",
    "n": 16500000,
    "beds": 4,
    "baths": 4,
    "size": "5 Marla",
    "city": "Lahore",
    "loc": "Al Hafeez Garden Phase 1, Lahore",
    "type": "House",
    "status": "sale",
    "img": "lst-alhafeez.jpg",
    "badge": "For Sale",
    "url": "https://anngan.com/property/5-marla-double-story-brand-new-house-for-sale-in-al-hafeez-garden-phase-1/",
    "liveStatus": "live",
    "visible": true,
    "createdAt": "2023-01-01"
  },
  {
    "id": "bahria-rwp",
    "title": "5 Marla brand new house for sale in Bahria Rawalpindi",
    "price": "Rs 16,500,000",
    "n": 16500000,
    "beds": 3,
    "baths": 3,
    "size": "5 Marla",
    "city": "Rawalpindi",
    "loc": "Bahria Town, Rawalpindi",
    "type": "House",
    "status": "sale",
    "img": "lst-bahria-rwp.jpg",
    "badge": "For Sale",
    "url": "https://anngan.com/property/05-marla-brand-new-house-for-sale-in-bahria-rawalpindi-at-very-reasonable-price/",
    "liveStatus": "live",
    "visible": true,
    "createdAt": "2023-01-01"
  },
  {
    "id": "citi-multan",
    "title": "5 Marla house for sale in Citi Housing Multan Phase 1",
    "price": "Rs 10,000,000",
    "n": 10000000,
    "beds": 3,
    "baths": 3,
    "size": "5 Marla",
    "city": "Multan",
    "loc": "Citi Housing Phase 1, Multan",
    "type": "House",
    "status": "sale",
    "img": "lst-citi-multan.jpg",
    "badge": "For Sale",
    "url": "https://anngan.com/property/5-marla-house-for-sale-in-citi-housing-multan-phase-1/",
    "liveStatus": "live",
    "visible": true,
    "createdAt": "2023-01-01"
  },
  {
    "id": "orchard-rent",
    "title": "2 bed upper portion available for rent in Bahria Orchard",
    "price": "Rs 39,000 per month",
    "n": 39000,
    "beds": 2,
    "baths": 2,
    "size": "5 Marla",
    "city": "Lahore",
    "loc": "Bahria Orchard, Lahore",
    "type": "Portion",
    "status": "rent",
    "img": "lst-orchard-rent.jpg",
    "badge": "For Rent",
    "url": "https://anngan.com/property/2-bed-upper-portion-available-for-rent-in-bahria-orchard/",
    "liveStatus": "live",
    "visible": true,
    "createdAt": "2023-01-01"
  },
  {
    "id": "bahria8-rent",
    "title": "10 Marla furnished house for rent, Bahria Town Phase 8 Rawalpindi",
    "price": "Rs 300,000 per month",
    "n": 300000,
    "beds": 5,
    "baths": 5,
    "size": "10 Marla",
    "city": "Rawalpindi",
    "loc": "Bahria Town Phase 8, Rawalpindi",
    "type": "House",
    "status": "rent",
    "img": "lst-bahria8-rent.jpg",
    "badge": "For Rent",
    "url": "https://anngan.com/property/10-marla-furnished-house-for-rent-bahria-town-phase-8-rawalpindi/",
    "liveStatus": "live",
    "visible": true,
    "createdAt": "2023-01-01"
  },
  {
    "id": "kuri-rent",
    "title": "6 Marla house for rent in Kuri Road near Pindoriya, Islamabad",
    "price": "Rs 70,000 per month",
    "n": 70000,
    "beds": 4,
    "baths": 5,
    "size": "6 Marla",
    "city": "Islamabad",
    "loc": "Kuri Road, Islamabad",
    "type": "House",
    "status": "rent",
    "img": "lst-kuri-rent.jpg",
    "badge": "For Rent",
    "url": "https://anngan.com/property/6-marla-house-for-rent-in-kuri-road-near-pindoriya/",
    "liveStatus": "live",
    "visible": true,
    "createdAt": "2023-01-01"
  }
];
export const PROJECTS: Project[] = [
  {
    "id": "proj-1",
    "name": "MGH Pakistan",
    "loc": "Mangla",
    "city": "Mangla",
    "page": "project-mgh.html",
    "img": "mgh-lake-aerial.jpg",
    // PARITY 24 Nov 2026, Section 5: the Mangla lake photo was used
    // 3 times on home (Hero 1, Societies, Projects). The project card
    // uses the real MGH Precinct 02 night photo instead, so each slot
    // shows a different real MGH photo.
    "cardImg": "mgh-precinct-02-night.jpg",
    "status": "Available",
    "note": "Zamindar File, Affidavit MGH and Serene Farm Houses, inside one project."
  },
  {
    "id": "proj-2",
    "name": "Global Homes Lahore",
    "loc": "Lahore",
    "city": "Lahore",
    "page": "project-global.html",
    "img": "global-zamzam-2.jpg",
    // LIVE-FAIL FIX 24 Nov 2026: the previous card cover,
    // global-zamzam-house-clean.jpg, is a TALL PORTRAIT crop of the
    // real house photo. In a 16/10 card with object-contain it renders
    // as a narrow tall photo with white side pillars, which is exactly
    // what the live check still showed. The live Firestore proj-2 doc
    // has NO cardImg (verified by node SDK read 24 Nov), so the seed
    // cardImg is what the live card actually uses. The new cover,
    // global-zamzam-house-wide.jpg, is a true 16/10 crop of that same
    // real house photo (PIL, roof + top floor + balcony), so it fills
    // the card with no pillars and no blur. No AI, no new photo.
    // LIVE-FAIL 25 Nov 00:55 PKT: the top roof still read as cut, so
    // the file now carries 64px of the photo's own night sky above
    // the roof (column-wise from the portrait's top sky row, house
    // shifted down 64px, bottom cropped to portrait row 330).
    // Topmost red pixel is at y=64; the source portrait itself cuts
    // the top roof's ridge at y=0, so no tip beyond the source exists
    // to restore, and none was invented.
    // LIVE-FAIL 25 Nov 01:10-01:18 PKT: live STILL showed the roof
    // cut, because the AVIF the optimizer served was a stale v0
    // entry (46% blue at top rows, x-nextjs-cache HIT); the filename
    // never changed across v0/v2, so the cache never busted. Fix v3:
    // same v2 bytes, RENAMED to global-zamzam-house-wide-v3.jpg.
    // Never change an image's pixels without renaming it.
    "cardImg": "global-zamzam-house-wide-v3.jpg",
    "status": "Available",
    "note": "Zam Zam City, Lahore. LDA approved."
  },
  {
    "id": "proj-3",
    "name": "Al Ghani Phase 7",
    "loc": "Lahore",
    "city": "Lahore",
    "page": "project-alghani.html",
    "img": "alghani-hero.jpeg",
    // VIS-04: the card cover is a clean aerial crop of the real
    // marketing banner, not the tight sign crop. alghani-site.jpeg
    // is a fake mosque/dome render, never use it.
    "cardImg": "alghani-aerial.jpg",
    "status": "Available",
    "note": "Bhaini Road, Lahore."
  },
  {
    "id": "proj-4",
    "name": "Urban City",
    "loc": "Lahore",
    "city": "Lahore",
    "page": "project-urban.html",
    "img": "urban-drone.jpg",
    // NO-AI-AUDIT 25 Nov 2026: urban-mosque.jpg was the Blue Mosque
    // in Istanbul, Turkey, a real photo of the WRONG place, not Urban
    // City, so it is removed from every card. The card now uses the
    // real Urban City golf course photo. urban-mosque.jpg stays in
    // public/img unused; delete it only on the user's say-so.
    "cardImg": "urban-golf.jpg",
    "status": "Available",
    "note": "80,000+ kanals, Lahore."
  },
  {
    "id": "proj-5",
    "name": "China Town",
    "loc": "Lahore",
    "city": "Lahore",
    "page": "project-chinatown.html",
    "img": "chinatown-bahria-sky.jpg",
    "status": "Available",
    "note": "Inside Bahria Sky, Bahria Orchard, Lahore."
  },
  {
    "id": "proj-6",
    "name": "Pak China Grain Market",
    "loc": "Multan",
    "city": "Multan",
    "page": "project-grain.html",
    "img": "",
    "status": "Coming Soon",
    "note": "54 acres, Shujabad Road, Multan. 996 shops."
  },
  {
    "id": "proj-7",
    "name": "Kashmir Modern City",
    "loc": "Kashmir",
    "city": "Kashmir",
    "page": "project-kashmir.html",
    "img": "kmc-01.jpg",
    // PARITY 24 Nov 2026, Section 5: kmc-01.jpg is 1200x677 (16:9),
    // so a 16/10 object-cover card chopped the anngan.com logo and
    // the Modern City logo at the top. kmc-01-16x10.jpg is the same
    // real photo, padded in code (PIL) to 1200x750 with edge-sampled
    // sky and sand bands, so both logos show whole. The gallery on
    // proj-7 still uses the original kmc-01.jpg, uncropped.
    "cardImg": "kmc-01-16x10.jpg",
    "status": "Sold Out",
    "note": "Sold Out. Mirpur, Kashmir."
  }
];
export const BLOGS: Blog[] = [
  {
    "id": "blog-1",
    "date": "27 Feb 2023",
    "title": "Matches for the eighth season of the PSL are set to take place in Lahore and Rawalpindi as planned",
    "url": "https://anngan.com/2023/02/27/matches-for-the-eighth-season-of-the-psl-are-set-to-take-place-in-lahore-and-rawalpindi-as-planned/"
  },
  {
    "id": "blog-2",
    "date": "25 Feb 2023",
    "title": "PCB is contemplating shifting the Lahore and Rawalpindi matches of PSL 08 to Karachi",
    "url": "https://anngan.com/2023/02/25/pcb-is-contemplating-shifting-the-lahore-and-rawalpindi-matches-of-psl-08-to-karachi/"
  },
  {
    "id": "blog-3",
    "date": "24 Feb 2023",
    "title": "On Friday at 06:06 am, Islamabad and its surrounding areas were shaken by an earthquake of magnitude 4.2",
    "url": "https://anngan.com/2023/02/24/on-friday-at-0606-am-islamabad-and-its-surrounding-areas-were-shaken-by-an-earthquake-of-magnitude-4-2/"
  },
  {
    "id": "blog-4",
    "date": "24 Feb 2023",
    "title": "Work on the Shahdara flyover has commenced and a traffic plan has been put in place",
    "url": "https://anngan.com/2023/02/24/work-on-the-shahdara-flyover-has-commenced-and-a-traffic-plan-has-been-put-in-place/"
  },
  {
    "id": "blog-5",
    "date": "21 Feb 2023",
    "title": "A wave of panic swept through Turkey and Syria as the two countries were jolted by a 6.3 magnitude earthquake",
    "url": "https://anngan.com/2023/02/21/a-wave-of-panic-swept-through-turkey-and-syria-as-the-two-countries-were-jolted-by-a-6-3-magnitude-earthquake/"
  },
  {
    "id": "blog-6",
    "date": "20 Feb 2023",
    "title": "Why it is the best time to invest in real estate in 2023 in Pakistan",
    "url": "https://anngan.com/2023/02/20/why-it-is-the-best-time-to-invest-in-real-estate-in-2023-in-pakistan/"
  },
  {
    "id": "blog-7",
    "date": "14 Feb 2023",
    "title": "Lahore Qalandars defeated Multan Sultans in a last-ball cliffhanger in the PSL 08 season opener",
    "url": "https://anngan.com/2023/02/14/lahore-qalandars-defeated-multan-sultans-in-a-last-ball-cliffhanger-in-the-psl-08s-season-opener/"
  },
  {
    "id": "blog-8",
    "date": "13 Feb 2023",
    "title": "At the Multan Cricket Stadium, Pakistan Super League eighth season began with a grand opening ceremony",
    "url": "https://anngan.com/2023/02/13/at-the-multan-cricket-stadium-pakistan-super-leagues-eighth-season-began-with-a-grand-opening-ceremony/"
  },
  {
    "id": "blog-9",
    "date": "11 Feb 2023",
    "title": "SSH, a Kuwait-based construction company, has been commissioned to create its inaugural landmark tower in Pakistan",
    "url": "https://anngan.com/2023/02/11/ssh-a-kuwait-based-construction-company-has-been-commissioned-to-create-its-inaugural-landmark-tower-in-pakistan/"
  },
  {
    "id": "blog-10",
    "date": "10 Feb 2023",
    "title": "Lahore High Court has issued notifications about the degradation of agricultural lands by housing societies",
    "url": "https://anngan.com/2023/02/10/lahore-high-court-has-issued-notifications-about-the-degradation-of-agricultural-lands-by-housing-societies/"
  },
  {
    "id": "blog-11",
    "date": "9 Feb 2023",
    "title": "Increased desperation in search for Turkiye earthquake survivors",
    "url": "https://anngan.com/2023/02/09/increased-desperation-in-search-for-turkiye-earthquake-survivors/"
  },
  {
    "id": "blog-12",
    "date": "6 Feb 2023",
    "title": "In one day, 33 thousand tickets were sold for the first PSL 08 match in Multan",
    "url": "https://anngan.com/2023/02/06/in-one-day-33-thousand-tickets-were-sold-for-the-first-psl-08-match-in-multan/"
  },
  {
    "id": "blog-13",
    "date": "4 Feb 2023",
    "title": "5th February, we stand with the Kashmiris",
    "url": "https://anngan.com/2023/02/04/5th-february-we-stand-with-the-kashmiris/"
  },
  {
    "id": "blog-14",
    "date": "4 Feb 2023",
    "title": "LDA has announced housing developments in Kasur, Sheikhupura and Nankana Sahib",
    "url": "https://anngan.com/2023/02/04/lda-has-announced-housing-developments-in-kasur-sheikhupura-and-nankana-sahib/"
  },
  {
    "id": "blog-15",
    "date": "2 Feb 2023",
    "title": "One hundred thousand affordable residences will be constructed near Ravi",
    "url": "https://anngan.com/2023/02/02/one-hundred-thousand-affordable-residences-will-be-constructed-near-ravi/"
  },
  {
    "id": "blog-16",
    "date": "31 Jan 2023",
    "title": "The Capital Development Authority is proposing to build an economic zone in the vicinity of Rawat",
    "url": "https://anngan.com/2023/01/31/the-capital-development-authority-is-proposing-to-build-an-economic-zone-in-the-vicinity-of-rawat/"
  },
  {
    "id": "blog-17",
    "date": "26 Jan 2023",
    "title": "Pakistan has an 88 billion real estate market, Estate Agent Association (EAA)",
    "url": "https://anngan.com/2023/01/26/pakistan-has-an-88-billion-real-estate-market-estate-agent-association-eaa/"
  },
  {
    "id": "blog-18",
    "date": "23 Jan 2023",
    "title": "RDA has instructed Frontier Works Organization to expedite the building of the Tourism Highway project",
    "url": "https://anngan.com/2023/01/23/rda-has-instructed-frontier-works-organization-to-expedite-the-building-of-the-tourism-highway-project/"
  },
  {
    "id": "blog-19",
    "date": "20 Jan 2023",
    "title": "To protect historical landmarks, Sindh Government has set up a fund of one billion rupees",
    "url": "https://anngan.com/2023/01/20/to-protect-historical-landmarks-sindh-government-has-set-up-a-fund-of-one-billion-rupees/"
  },
  {
    "id": "blog-20",
    "date": "16 Jan 2023",
    "title": "Affordable housing for National Highway employees has been approved",
    "url": "https://anngan.com/2023/01/16/news-affordable-housing-for-national-highway-employees-has-been-approved/"
  },
  {
    "id": "blog-21",
    "date": "5 Jan 2023",
    "title": "LDA City urged defaulters to pay their debts in order to avoid plot cancellation",
    "url": "https://anngan.com/2023/01/05/lda-city-urged-defaulters-to-pay-their-debts-in-order-to-avoid-plot-cancellation/"
  },
  {
    "id": "blog-22",
    "date": "5 Jan 2023",
    "title": "The Punjab Government would lease industrial lands to foreigners",
    "url": "https://anngan.com/2023/01/05/the-punjab-government-would-lease-industrial-lands-to-foreigners/"
  },
  {
    "id": "blog-23",
    "date": "21 Dec 2022",
    "title": "Kashmir Modern City soft launch at Mirpur",
    "url": "https://anngan.com/2022/12/21/kashmir-modern-city-soft-launch-at-mirpur/"
  }
];
export const AGENCIES: Agency[] = [
  {
    "id": "agency-1",
    "name": "ADARSH Associates",
    "logo": "partner-adarsh.png"
  },
  {
    "id": "agency-2",
    "name": "Absaar Properties",
    "logo": "partner-absaar.png"
  },
  {
    "id": "agency-3",
    "name": "ASA",
    "logo": "partner-asa.png"
  },
  {
    "id": "agency-4",
    "name": "Estate Brothers",
    "logo": "partner-estate-brothers.png"
  },
  {
    "id": "agency-5",
    "name": "Estate Business",
    "logo": "partner-estate-business.png"
  },
  {
    "id": "agency-6",
    "name": "Pioneer Estate",
    "logo": "partner-pioneer.png"
  },
  {
    "id": "agency-7",
    "name": "Links Estate",
    "logo": "partner-links.jpg"
  },
  {
    "id": "agency-8",
    "name": "Lahore Grande",
    "logo": "partner-lahore-grande.jpg"
  },
  {
    "id": "agency-9",
    "name": "Khawar Property",
    "logo": "partner-khawar.jpg"
  },
  {
    "id": "agency-10",
    "name": "Green House",
    "logo": "partner-green-house.jpg"
  },
  {
    "id": "agency-11",
    "name": "Al Syed Estate",
    "logo": "partner-al-syed.jpg"
  },
  {
    "id": "agency-12",
    "name": "Azan Real Estate",
    "logo": "partner-azan.jpg"
  },
  {
    "id": "agency-13",
    "name": "Brick Line Estate",
    "logo": "partner-brick-line.jpg"
  }
];
export const SERVICES: Service[] = [
  {
    "id": "service-1",
    "name": "Website Development",
    "note": "Custom coded business and property websites, designed mobile first and built to load fast.",
    "page": "angan-tech-website-development.html"
  },
  {
    "id": "service-2",
    "name": "Digital Marketing",
    "note": "Campaigns and content that bring enquiries to your phone, not just views.",
    "page": "angan-tech-digital-marketing.html"
  },
  {
    "id": "service-3",
    "name": "SEO",
    "note": "Search engine work so buyers on Google find your real listings and projects.",
    "page": "angan-tech-seo.html"
  },
  {
    "id": "service-4",
    "name": "Content Writing",
    "note": "Clear pages, project write-ups and articles written in plain words your buyers understand.",
    "page": "angan-tech-content-writing.html"
  },
  {
    "id": "service-5",
    "name": "Corporate Software",
    "note": "Software built around how your office actually works, not off-the-shelf compromises.",
    "page": "angan-tech-corporate-software.html"
  },
  {
    "id": "service-6",
    "name": "Land Management",
    "note": "Plot, file and booking management for housing projects and dealers.",
    "page": "angan-tech-land-management.html"
  },
  {
    "id": "service-7",
    "name": "CRM",
    "note": "A system that tracks every lead from first call to closing, so no enquiry is lost.",
    "page": "angan-tech-crm.html"
  },
  {
    "id": "service-8",
    "name": "HR Management",
    "note": "Staff records, attendance, leave and payroll in one system.",
    "page": "angan-tech-hr-management.html"
  },
  {
    "id": "service-9",
    "name": "Corporate Management",
    "note": "One dashboard for tasks, approvals and reporting across departments.",
    "page": "angan-tech-corporate-management.html"
  }
];
export const SETTINGS: OfficeSettings = { phone: "+92 304 1111 698", whatsapp: "923041111698", email: "info@anngan.com", address: "57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore", ceo: "Muhammad Mahmood Cheema", socialLinks: DEFAULT_SOCIAL_LINKS, footerAbout: DEFAULT_FOOTER_ABOUT, footerCopyright: DEFAULT_FOOTER_COPYRIGHT, cityCards: DEFAULT_CITY_CARDS, homeHeadings: DEFAULT_HOME_HEADINGS, homeMghTitle: DEFAULT_HOME_MGH_TITLE, homeMghText: DEFAULT_HOME_MGH_TEXT, homeSocieties: DEFAULT_HOME_SOCIETIES, societies: DEFAULT_SOCIETIES, societiesTitle: DEFAULT_SOCIETIES_TITLE, societiesIntro: DEFAULT_SOCIETIES_INTRO, aboutIntro: DEFAULT_ABOUT_INTRO, aboutVideos: DEFAULT_ABOUT_VIDEOS, aboutFaq: DEFAULT_ABOUT_FAQ, aboutFilesImg: DEFAULT_ABOUT_FILES_IMG, aboutFilesNote: DEFAULT_ABOUT_FILES_NOTE, companies: DEFAULT_COMPANIES, contactIntro: DEFAULT_CONTACT_INTRO, legalPrivacy: DEFAULT_LEGAL_PRIVACY, legalTerms: DEFAULT_LEGAL_TERMS, legalDisclaimer: DEFAULT_LEGAL_DISCLAIMER };
export const GRAIN_MARKET = { shops: 996, acres: 54, road: "Shujabad Road, Multan", prices: [{ size: "2 Marla", price: "Rs 56 Lac" }, { size: "3 Marla", price: "Rs 84 Lac" }, { size: "4 Marla", price: "Rs 112 Lac" }] };
