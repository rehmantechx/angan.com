// Real project facts copied from the static site project pages
// (project-mgh.html, project-global.html, project-alghani.html,
// project-urban.html, project-chinatown.html, project-grain.html,
// project-kashmir.html) and SOURCES.md. Nothing invented. Where a fact
// is not published, the page says so instead of guessing.
import { GRAIN_MARKET } from "./seed";

export type ProjectPhoto = { file: string; caption: string };

export type ProjectDetails = {
  intro: string;
  photos: ProjectPhoto[];
  facts: { label: string; value: string }[];
  products?: { title: string; text: string }[];
  amenities?: string[];
  website?: { label: string; url: string };
  note?: string;
};

export const PROJECT_DETAILS: Record<string, ProjectDetails> = {
  "proj-1": {
    intro:
      "MGH Pakistan at Mangla is Pakistan's first and biggest natural lake view housing project, on 7KM Mangla Gaddari Road, Mangla Cantt, Jhelum. Anngan is a Platinum partner of the project.",
    photos: [
      { file: "mgh-lake-aerial.jpg", caption: "Mangla Lake aerial view" },
      { file: "mgh-precinct-01.jpg", caption: "MGH Pakistan Precinct 01" },
      { file: "mgh-precinct-02-night.jpg", caption: "MGH Pakistan Precinct 02 at night" },
      { file: "mgh-serene-farmhouses.jpg", caption: "Serene Farm Houses, Precincts 05 and 06" },
      { file: "mgh-map.jpg", caption: "MGH Pakistan map" },
      { file: "mgh-zamindar-file.jpg", caption: "MGH Zamindar File allotment letter" },
    ],
    facts: [
      { label: "Location", value: "7KM Mangla Gaddari Road, Mangla Cantt, Jhelum" },
      { label: "Developer office", value: "98D Commercial Broadway, DHA Phase 8, Lahore" },
      { label: "Project phone", value: "0304 1110644" },
      { label: "Precincts", value: "Precincts 01 to 06, with Precincts 05 and 06 as Serene Farm Houses" },
      { label: "Anngan role", value: "Platinum partner" },
    ],
    products: [
      {
        title: "Zamindar File",
        text: "10% quota in balloting. Rates change with the market, ask the team for today's rate.",
      },
      {
        title: "Affidavit MGH",
        text: "A file product of MGH Pakistan at Mangla, marketed by Anngan. Call +92 304 1111 698 for today's rate.",
      },
      {
        title: "Serene Farm Houses",
        text: "Farm houses in Precincts 05 and 06 of MGH Pakistan. Call +92 304 1111 698 for today's rate.",
      },
    ],
    amenities: [
      "Parasailing",
      "Jet ski",
      "Golf club",
      "Boating",
      "Fishing",
      "Horse riding",
      "Hospital",
      "School",
      "Supermarket",
      "Smart homes",
      "Power backup",
    ],
    website: { label: "mghpakistan.com", url: "https://mghpakistan.com" },
  },
  "proj-2": {
    intro:
      "Global Homes (Zam Zam City), an LDA approved residential project near Quaid-e-Azam Interchange, Lahore, marketed by Anngan.",
    photos: [
      { file: "global-zamzam-2.jpg", caption: "Zam Zam City, Lahore" },
      { file: "global-zamzam-location.jpg", caption: "Zam Zam City location map" },
    ],
    facts: [
      { label: "Location", value: "Near Quaid-e-Azam Interchange, Lahore" },
      { label: "Approval", value: "LDA approved" },
      { label: "Website", value: "No own website, updates via Facebook" },
    ],
    note: "No prices or payment plan are published for this project on the Anngan site. Call the office for the latest files and prices.",
  },
  "proj-3": {
    intro:
      "Al Ghani Phase 7 by Al Ghani Developers, Bhaini Road, Lahore. TMA approval LGU50/64.",
    photos: [
      { file: "alghani-hero.jpeg", caption: "Al Ghani Garden Phase 7, Lahore. Project marketing image." },
      { file: "alghani-anngan.jpg", caption: "Al Ghani Garden Phase 7 location map, from Anngan." },
    ],
    facts: [
      { label: "Location", value: "Bhaini Road, Lahore" },
      { label: "Developer", value: "Al Ghani Developers" },
      { label: "Approval", value: "TMA LGU50/64" },
      { label: "UAN", value: "042 111 116 117" },
    ],
    website: { label: "alghani.com.pk", url: "https://alghani.com.pk" },
    note: "No prices or payment plan are published for this project on the Anngan site. Call the office for the latest files and prices.",
  },
  "proj-4": {
    intro:
      "Urban City Lahore, 80,000+ kanals by Al-Hafeez and Al-Rehman Developers, with a golf course and a Blue Mosque.",
    photos: [
      { file: "urban-drone.jpg", caption: "Urban City aerial view" },
      { file: "urban-golf.jpg", caption: "Urban City golf course" },
      { file: "urban-mosque.jpg", caption: "Urban City Grand Mosque" },
    ],
    facts: [
      { label: "Location", value: "Lahore" },
      { label: "Scale", value: "80,000+ kanals" },
      { label: "Developers", value: "Al-Hafeez and Al-Rehman Developers" },
      { label: "UAN", value: "042 111 666 888" },
    ],
    website: { label: "urbancitylahore.com", url: "https://urbancitylahore.com" },
    note: "No prices or payment plan are published for this project on the Anngan site. Call the office for the latest files and prices.",
  },
  "proj-5": {
    intro:
      "China Town is Pakistan's First China Town, a commercial destination inside Bahria Sky by OZ Developers, created to bring Chinese manufacturers, suppliers and brands together under one roof.",
    photos: [
      {
        file: "chinatown-bahria-sky.jpg",
        caption:
          "Bahria Sky, Bahria Orchard, Lahore, the building where China Town is located. This is not a photo of China Town itself.",
      },
    ],
    facts: [
      { label: "Location", value: "Inside Bahria Sky, Bahria Orchard, Lahore" },
      { label: "Developer", value: "OZ Developers" },
      { label: "Website", value: "No standalone website" },
    ],
    note: "On anngan.com, China Town sits inside the Al-Kabir Town societies guide, and it has no standalone website of its own. No prices are published for this project on the Anngan site. Call the office for details.",
  },
  "proj-6": {
    intro:
      "Pak China Grain Market, Multan, is a commercial grain market project of Vital Developers, marketed by Future Zameen Marketing (Pvt) Ltd. It has no own working website, updates come through its Facebook page.",
    photos: [],
    facts: [
      { label: "Location", value: "Shujabad Road, Multan" },
      { label: "Size", value: `${GRAIN_MARKET.acres} acres, ${GRAIN_MARKET.shops} shops` },
      { label: "Developer", value: "Vital Developers" },
      { label: "Status", value: "Coming Soon" },
      { label: "Down payment", value: "25% down payment, 3-year easy installment plan" },
    ],
    note: "No real photo of the market was available to download, so the shop plan below is shown instead of an empty box or a generic render. Shop sizes, prices and rent are from the project's 2026 marketing posts.",
  },
  "proj-7": {
    intro:
      "Kashmir Modern City by Al-Baari. Sold out. No own website, updates via Facebook and Instagram.",
    photos: [
      { file: "kmc-01.jpg", caption: "Kashmir Modern City" },
      { file: "kmc-02.jpg", caption: "Kashmir Modern City" },
      { file: "kmc-03.jpg", caption: "Kashmir Modern City" },
      { file: "kmc-map.jpg", caption: "Kashmir Modern City master plan" },
    ],
    facts: [
      { label: "Location", value: "Mirpur, Kashmir" },
      { label: "Developer", value: "Al-Baari" },
      { label: "Status", value: "Sold Out" },
      { label: "Category", value: "Housing" },
      { label: "Website", value: "No own website, updates via Facebook and Instagram" },
    ],
    note: "This project is sold out. Call the office if you want to be told about resale files or the next launch.",
  },
};
