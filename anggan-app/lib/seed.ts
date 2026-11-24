// Real data copied from the live static site (assets/js/main.js and admin/js/data.js).
// 12 listings (9 for sale, 3 for rent), 7 projects, 23 blogs,
// 9 Angan Tech services. Nothing invented. The 13 agencies from anngan.com
// are kept in this file for the office dashboard only and are not shown
// anywhere on the public site.
// show no photo: Pak China Grain Market (project) and the Rs 35,000,000 house,
// which is not among the 12 real listings and is not included here.
export type Listing = { id: string; title: string; price: string; n: number; beds: number; baths: number; size: string; city: string; loc: string; type: string; status: "sale" | "rent"; img: string; badge: string; url: string; liveStatus: "live" | "pending" | "hidden"; visible: boolean; createdAt: string; submittedBy?: string };
export type Project = { id: string; name: string; loc: string; city: string; page: string; img: string; note: string; cardImg?: string };
export type Blog = { id: string; date: string; title: string; url: string };
export type Agency = { id: string; name: string; logo: string; logoUrl?: string };
export type Service = { id: string; name: string; note: string; page: string };
export type Enquiry = { id: string; name: string; phone: string; asked: string; how: string; stage: "New" | "Called" | "Visit" | "Deal Done"; next: string; date: string };
export type OfficeSettings = { phone: string; whatsapp: string; email: string; address: string; ceo: string };
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
    "note": "Bhaini Road, Lahore."
  },
  {
    "id": "proj-4",
    "name": "Urban City",
    "loc": "Lahore",
    "city": "Lahore",
    "page": "project-urban.html",
    "img": "urban-drone.jpg",
    // PARITY 24 Nov 2026, Section 5: the drone photo was used 3 times
    // on home (Hero 2, All cities, Projects). The project card uses
    // the real Urban City Grand Mosque photo instead.
    "cardImg": "urban-mosque.jpg",
    "note": "80,000+ kanals, Lahore."
  },
  {
    "id": "proj-5",
    "name": "China Town",
    "loc": "Lahore",
    "city": "Lahore",
    "page": "project-chinatown.html",
    "img": "chinatown-bahria-sky.jpg",
    "note": "Inside Bahria Sky, Bahria Orchard, Lahore."
  },
  {
    "id": "proj-6",
    "name": "Pak China Grain Market",
    "loc": "Multan",
    "city": "Multan",
    "page": "project-grain.html",
    "img": "",
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
export const SETTINGS: OfficeSettings = { phone: "+92 304 1111 698", whatsapp: "923041111698", email: "info@anngan.com", address: "57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore", ceo: "Muhammad Mahmood Cheema" };
export const GRAIN_MARKET = { shops: 996, acres: 54, road: "Shujabad Road, Multan", prices: [{ size: "2 Marla", price: "Rs 56 Lac" }, { size: "3 Marla", price: "Rs 84 Lac" }, { size: "4 Marla", price: "Rs 112 Lac" }] };
