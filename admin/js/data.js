// Anngan dashboard data, Phase 1.
// Real data from anngan.com, checked 20 Nov 2026. Listings, projects and
// blogs come from the live public site in this same repo. Enquiries below
// are example enquiries, labelled Example data in the dashboard, until
// real enquiries are connected in Day 3-4 with Firebase.
var ANNGAN_DATA = {
  listings: [
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
    "url": "https://anngan.com/property/brand-new-flat-for-sale-in-shamsi-society-airport-karachi/"
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
    "url": "https://anngan.com/property/10-marla-stunning-house-for-sale-in-dha-lahore/"
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
    "url": "https://anngan.com/property/10-marla-house-for-sale-in-defence-phase-iv-lahore/"
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
    "url": "https://anngan.com/property/10-marla-house-for-sale-sector-u-phase-7-dha-lahore/"
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
    "url": "https://anngan.com/property/1-kanal-beautiful-new-house-for-sale-at-prime-location-of-dha-phase-7/"
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
    "url": "https://anngan.com/property/10-marla-brand-new-ultra-modren-stylish-luxury-house-in-bahria-town-lahore/"
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
    "url": "https://anngan.com/property/5-marla-double-story-brand-new-house-for-sale-in-al-hafeez-garden-phase-1/"
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
    "url": "https://anngan.com/property/05-marla-brand-new-house-for-sale-in-bahria-rawalpindi-at-very-reasonable-price/"
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
    "url": "https://anngan.com/property/5-marla-house-for-sale-in-citi-housing-multan-phase-1/"
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
    "url": "https://anngan.com/property/2-bed-upper-portion-available-for-rent-in-bahria-orchard/"
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
    "url": "https://anngan.com/property/10-marla-furnished-house-for-rent-bahria-town-phase-8-rawalpindi/"
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
    "url": "https://anngan.com/property/6-marla-house-for-rent-in-kuri-road-near-pindoriya/"
  }
],
  projects: [
  {
    "name": "MGH Pakistan",
    "loc": "Mangla",
    "city": "Mangla",
    "page": "project-mgh.html",
    "img": "mgh-lake-aerial.jpg",
    "note": "Zamindar File, Affidavit MGH and Serene Farm Houses, inside one project."
  },
  {
    "name": "Global Homes Lahore",
    "loc": "Lahore",
    "city": "Lahore",
    "page": "project-global.html",
    "img": "global-zamzam-2.jpg",
    "note": "Zam Zam City, Lahore. LDA approved."
  },
  {
    "name": "Al Ghani Phase 7",
    "loc": "Lahore",
    "city": "Lahore",
    "page": "project-alghani.html",
    "img": "alghani-site.jpeg",
    "note": "Bhaini Road, Lahore."
  },
  {
    "name": "Urban City",
    "loc": "Lahore",
    "city": "Lahore",
    "page": "project-urban.html",
    "img": "urban-drone.jpg",
    "note": "80,000+ kanals, Lahore."
  },
  {
    "name": "China Town",
    "loc": "Lahore",
    "city": "Lahore",
    "page": "project-chinatown.html",
    "img": "chinatown-bahria-sky.jpg",
    "note": "Inside Bahria Sky, Bahria Orchard, Lahore."
  },
  {
    "name": "Pak China Grain Market",
    "loc": "Multan",
    "city": "Multan",
    "page": "project-grain.html",
    "img": "",
    "note": "54 acres, Shujabad Road, Multan. 996 shops."
  },
  {
    "name": "Kashmir Modern City",
    "loc": "Kashmir",
    "city": "Kashmir",
    "page": "project-kashmir.html",
    "img": "kmc-01.jpg",
    "note": "Sold Out. Mirpur, Kashmir."
  }
],
  blogsNewest: [
  {
    "date": "27 Feb 2023",
    "title": "Matches for the eighth season of the PSL are set to take place in Lahore and Rawalpindi as planned",
    "url": "https://anngan.com/2023/02/27/matches-for-the-eighth-season-of-the-psl-are-set-to-take-place-in-lahore-and-rawalpindi-as-planned/"
  },
  {
    "date": "25 Feb 2023",
    "title": "PCB is contemplating shifting the Lahore and Rawalpindi matches of PSL 08 to Karachi",
    "url": "https://anngan.com/2023/02/25/pcb-is-contemplating-shifting-the-lahore-and-rawalpindi-matches-of-psl-08-to-karachi/"
  },
  {
    "date": "24 Feb 2023",
    "title": "On Friday at 06:06 am, Islamabad and its surrounding areas were shaken by an earthquake of magnitude 4.2",
    "url": "https://anngan.com/2023/02/24/on-friday-at-0606-am-islamabad-and-its-surrounding-areas-were-shaken-by-an-earthquake-of-magnitude-4-2/"
  },
  {
    "date": "24 Feb 2023",
    "title": "Work on the Shahdara flyover has commenced and a traffic plan has been put in place",
    "url": "https://anngan.com/2023/02/24/work-on-the-shahdara-flyover-has-commenced-and-a-traffic-plan-has-been-put-in-place/"
  },
  {
    "date": "21 Feb 2023",
    "title": "A wave of panic swept through Turkey and Syria as the two countries were jolted by a 6.3 magnitude earthquake",
    "url": "https://anngan.com/2023/02/21/a-wave-of-panic-swept-through-turkey-and-syria-as-the-two-countries-were-jolted-by-a-6-3-magnitude-earthquake/"
  },
  {
    "date": "20 Feb 2023",
    "title": "Why it is the best time to invest in real estate in 2023 in Pakistan",
    "url": "https://anngan.com/2023/02/20/why-it-is-the-best-time-to-invest-in-real-estate-in-2023-in-pakistan/"
  },
  {
    "date": "14 Feb 2023",
    "title": "Lahore Qalandars defeated Multan Sultans in a last-ball cliffhanger in the PSL 08 season opener",
    "url": "https://anngan.com/2023/02/14/lahore-qalandars-defeated-multan-sultans-in-a-last-ball-cliffhanger-in-the-psl-08s-season-opener/"
  },
  {
    "date": "13 Feb 2023",
    "title": "At the Multan Cricket Stadium, Pakistan Super League eighth season began with a grand opening ceremony",
    "url": "https://anngan.com/2023/02/13/at-the-multan-cricket-stadium-pakistan-super-leagues-eighth-season-began-with-a-grand-opening-ceremony/"
  },
  {
    "date": "11 Feb 2023",
    "title": "SSH, a Kuwait-based construction company, has been commissioned to create its inaugural landmark tower in Pakistan",
    "url": "https://anngan.com/2023/02/11/ssh-a-kuwait-based-construction-company-has-been-commissioned-to-create-its-inaugural-landmark-tower-in-pakistan/"
  },
  {
    "date": "10 Feb 2023",
    "title": "Lahore High Court has issued notifications about the degradation of agricultural lands by housing societies",
    "url": "https://anngan.com/2023/02/10/lahore-high-court-has-issued-notifications-about-the-degradation-of-agricultural-lands-by-housing-societies/"
  },
  {
    "date": "9 Feb 2023",
    "title": "Increased desperation in search for Turkiye earthquake survivors",
    "url": "https://anngan.com/2023/02/09/increased-desperation-in-search-for-turkiye-earthquake-survivors/"
  },
  {
    "date": "6 Feb 2023",
    "title": "In one day, 33 thousand tickets were sold for the first PSL 08 match in Multan",
    "url": "https://anngan.com/2023/02/06/in-one-day-33-thousand-tickets-were-sold-for-the-first-psl-08-match-in-multan/"
  },
  {
    "date": "4 Feb 2023",
    "title": "5th February, we stand with the Kashmiris",
    "url": "https://anngan.com/2023/02/04/5th-february-we-stand-with-the-kashmiris/"
  },
  {
    "date": "4 Feb 2023",
    "title": "LDA has announced housing developments in Kasur, Sheikhupura and Nankana Sahib",
    "url": "https://anngan.com/2023/02/04/lda-has-announced-housing-developments-in-kasur-sheikhupura-and-nankana-sahib/"
  },
  {
    "date": "2 Feb 2023",
    "title": "One hundred thousand affordable residences will be constructed near Ravi",
    "url": "https://anngan.com/2023/02/02/one-hundred-thousand-affordable-residences-will-be-constructed-near-ravi/"
  },
  {
    "date": "31 Jan 2023",
    "title": "The Capital Development Authority is proposing to build an economic zone in the vicinity of Rawat",
    "url": "https://anngan.com/2023/01/31/the-capital-development-authority-is-proposing-to-build-an-economic-zone-in-the-vicinity-of-rawat/"
  },
  {
    "date": "26 Jan 2023",
    "title": "Pakistan has an 88 billion real estate market, Estate Agent Association (EAA)",
    "url": "https://anngan.com/2023/01/26/pakistan-has-an-88-billion-real-estate-market-estate-agent-association-eaa/"
  },
  {
    "date": "23 Jan 2023",
    "title": "RDA has instructed Frontier Works Organization to expedite the building of the Tourism Highway project",
    "url": "https://anngan.com/2023/01/23/rda-has-instructed-frontier-works-organization-to-expedite-the-building-of-the-tourism-highway-project/"
  },
  {
    "date": "20 Jan 2023",
    "title": "To protect historical landmarks, Sindh Government has set up a fund of one billion rupees",
    "url": "https://anngan.com/2023/01/20/to-protect-historical-landmarks-sindh-government-has-set-up-a-fund-of-one-billion-rupees/"
  },
  {
    "date": "16 Jan 2023",
    "title": "Affordable housing for National Highway employees has been approved",
    "url": "https://anngan.com/2023/01/16/news-affordable-housing-for-national-highway-employees-has-been-approved/"
  },
  {
    "date": "5 Jan 2023",
    "title": "LDA City urged defaulters to pay their debts in order to avoid plot cancellation",
    "url": "https://anngan.com/2023/01/05/lda-city-urged-defaulters-to-pay-their-debts-in-order-to-avoid-plot-cancellation/"
  },
  {
    "date": "5 Jan 2023",
    "title": "The Punjab Government would lease industrial lands to foreigners",
    "url": "https://anngan.com/2023/01/05/the-punjab-government-would-lease-industrial-lands-to-foreigners/"
  },
  {
    "date": "21 Dec 2022",
    "title": "Kashmir Modern City soft launch at Mirpur",
    "url": "https://anngan.com/2022/12/21/kashmir-modern-city-soft-launch-at-mirpur/"
  }
],
  partners: [
  {
    "name": "ADARSH Associates",
    "img": "partner-adarsh.png"
  },
  {
    "name": "Absaar Properties",
    "img": "partner-absaar.png"
  },
  {
    "name": "ASA",
    "img": "partner-asa.png"
  },
  {
    "name": "Estate Brothers",
    "img": "partner-estate-brothers.png"
  },
  {
    "name": "Estate Business",
    "img": "partner-estate-business.png"
  },
  {
    "name": "Pioneer Estate",
    "img": "partner-pioneer.png"
  },
  {
    "name": "Links Estate",
    "img": "partner-links.jpg"
  },
  {
    "name": "Lahore Grande",
    "img": "partner-lahore-grande.jpg"
  },
  {
    "name": "Khawar Property",
    "img": "partner-khawar.jpg"
  },
  {
    "name": "Green House",
    "img": "partner-green-house.jpg"
  },
  {
    "name": "Al Syed Estate",
    "img": "partner-al-syed.jpg"
  },
  {
    "name": "Azan Real Estate",
    "img": "partner-azan.jpg"
  },
  {
    "name": "Brick Line Estate",
    "img": "partner-brick-line.jpg"
  }
],
  services: [
  {
    "name": "Website Development",
    "note": "Custom coded business and property websites, designed mobile first and built to load fast.",
    "page": "angan-tech-website-development.html"
  },
  {
    "name": "Digital Marketing",
    "note": "Campaigns and content that bring enquiries to your phone, not just views.",
    "page": "angan-tech-digital-marketing.html"
  },
  {
    "name": "SEO",
    "note": "Search engine work so buyers on Google find your real listings and projects.",
    "page": "angan-tech-seo.html"
  },
  {
    "name": "Content Writing",
    "note": "Clear pages, project write-ups and articles written in plain words your buyers understand.",
    "page": "angan-tech-content-writing.html"
  },
  {
    "name": "Corporate Software",
    "note": "Software built around how your office actually works, not off-the-shelf compromises.",
    "page": "angan-tech-corporate-software.html"
  },
  {
    "name": "Land Management",
    "note": "Plot, file and booking management for housing projects and dealers.",
    "page": "angan-tech-land-management.html"
  },
  {
    "name": "CRM",
    "note": "A system that tracks every lead from first call to closing, so no enquiry is lost.",
    "page": "angan-tech-crm.html"
  },
  {
    "name": "HR Management",
    "note": "Staff records, attendance, leave and payroll in one system.",
    "page": "angan-tech-hr-management.html"
  },
  {
    "name": "Corporate Management",
    "note": "One dashboard for tasks, approvals and reporting across departments.",
    "page": "angan-tech-corporate-management.html"
  }
],
  enquiriesExample: [
  {
    "id": "enq-ahmed",
    "name": "Ahmed Raza",
    "phone": "+92 321 456 7890",
    "asked": "10 Marla House, Lahore",
    "how": "Website form",
    "stage": "New",
    "next": "Call Sat 21 Nov 2026, 11 AM"
  },
  {
    "id": "enq-fatima",
    "name": "Fatima Noor",
    "phone": "+92 300 987 6543",
    "asked": "MGH Zamindar File",
    "how": "WhatsApp",
    "stage": "New",
    "next": "Send file details on WhatsApp, Sat 21 Nov 2026"
  },
  {
    "id": "enq-bilal",
    "name": "Bilal Ahmed",
    "phone": "+92 333 222 1110",
    "asked": "Al Ghani Phase 7",
    "how": "Phone call",
    "stage": "Called",
    "next": "Share payment plan, Sun 22 Nov 2026"
  },
  {
    "id": "enq-hassan",
    "name": "Hassan Ali",
    "phone": "+92 345 555 1234",
    "asked": "Urban City",
    "how": "Website form",
    "stage": "Visit",
    "next": "Visit Sat 21 Nov 2026, 2 PM, Lahore"
  }
]
};
