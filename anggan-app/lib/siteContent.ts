// Site content the office edits in /admin (hero, banners, About
// story, Our Team, header, footer, home sections, societies,
// companies, contact, legal pages). Stored on the settings/office
// document in Firestore, which the published rules already allow the
// public to read and only the office to write, so no rule change and
// no redeploy is needed for an edit to show on the live site. When
// Firestore has no value yet, the seed defaults apply, so the site
// works before the office edits anything.
// IMAGES: every image field accepts a file already on the site
// ("/img/...") or a full http(s) URL. Photo UPLOAD is wired in
// lib/upload.ts (Cloudinary free tier, unsigned preset, no card, no
// Blaze). Until the owner creates the free Cloudinary account and
// preset, uploads show a clear setup message and the URL field stays
// the way to set a photo. Never a fake upload, never a local-only path
// the live site cannot serve.
import { getSettings, saveSettings } from "./db";
import {
  DEFAULT_ABOUT_FAQ,
  DEFAULT_ABOUT_FILES_IMG,
  DEFAULT_ABOUT_FILES_NOTE,
  DEFAULT_ABOUT_INTRO,
  DEFAULT_ABOUT_STORY,
  DEFAULT_ABOUT_VIDEOS,
  DEFAULT_BANNER_IMAGES,
  DEFAULT_CITY_CARDS,
  DEFAULT_COMPANIES,
  DEFAULT_CONTACT_INTRO,
  DEFAULT_FOOTER_ABOUT,
  DEFAULT_FOOTER_COPYRIGHT,
  DEFAULT_HERO_SLIDES,
  DEFAULT_HERO_TAGLINE,
  DEFAULT_HERO_TITLE,
  DEFAULT_HOME_HEADINGS,
  DEFAULT_HOME_MGH_TEXT,
  DEFAULT_HOME_MGH_TITLE,
  DEFAULT_HOME_SOCIETIES,
  DEFAULT_LEGAL_DISCLAIMER,
  DEFAULT_LEGAL_PRIVACY,
  DEFAULT_LEGAL_TERMS,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_SOCIETIES,
  DEFAULT_SOCIETIES_INTRO,
  DEFAULT_SOCIETIES_TITLE,
  DEFAULT_TEAM,
  DEFAULT_TECH_TEAM,
  AboutFaq,
  AboutVideo,
  CityCard,
  CompanyCard,
  HeroSlide,
  HomeHeadings,
  HomeSocietyChip,
  OfficeSettings,
  SocialLink,
  SocietyGuide,
  TeamMember,
} from "./seed";

export type SiteContent = {
  heroTitle: string;
  heroTagline: string;
  heroSlides: HeroSlide[];
  bannerImages: HeroSlide[];
  aboutStory: string;
  team: TeamMember[];
  techTeam: TeamMember[];
  ceoPhoto: string;
  socialLinks: SocialLink[];
  footerAbout: string;
  footerCopyright: string;
  cityCards: CityCard[];
  homeHeadings: HomeHeadings;
  homeMghTitle: string;
  homeMghText: string;
  homeSocieties: HomeSocietyChip[];
  societies: SocietyGuide[];
  societiesTitle: string;
  societiesIntro: string;
  aboutIntro: string;
  aboutVideos: AboutVideo[];
  aboutFaq: AboutFaq[];
  aboutFilesImg: string;
  aboutFilesNote: string;
  companies: CompanyCard[];
  contactIntro: string;
  legalPrivacy: string;
  legalTerms: string;
  legalDisclaimer: string;
  // Top navbar sections hidden by the office in /admin. Labels are
  // the navbar labels (TOOLS, BLOGS, AGENCIES, ...). HOME is never
  // hidden, so navigation can never be broken from here. BLOGS is
  // hidden by default, as before, until the office turns it on.
  navHidden: string[];
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroTitle: DEFAULT_HERO_TITLE,
  heroTagline: DEFAULT_HERO_TAGLINE,
  heroSlides: DEFAULT_HERO_SLIDES,
  bannerImages: DEFAULT_BANNER_IMAGES,
  aboutStory: DEFAULT_ABOUT_STORY,
  team: DEFAULT_TEAM,
  techTeam: DEFAULT_TECH_TEAM,
  // Empty means the built-in CEO photos apply: ceo-portrait-v2.jpg on
  // home, ceo-flat.jpg on About. When the office sets a photo link in
  // /admin, home and About both use it.
  ceoPhoto: "",
  socialLinks: DEFAULT_SOCIAL_LINKS,
  footerAbout: DEFAULT_FOOTER_ABOUT,
  footerCopyright: DEFAULT_FOOTER_COPYRIGHT,
  cityCards: DEFAULT_CITY_CARDS,
  homeHeadings: DEFAULT_HOME_HEADINGS,
  homeMghTitle: DEFAULT_HOME_MGH_TITLE,
  homeMghText: DEFAULT_HOME_MGH_TEXT,
  homeSocieties: DEFAULT_HOME_SOCIETIES,
  societies: DEFAULT_SOCIETIES,
  societiesTitle: DEFAULT_SOCIETIES_TITLE,
  societiesIntro: DEFAULT_SOCIETIES_INTRO,
  aboutIntro: DEFAULT_ABOUT_INTRO,
  aboutVideos: DEFAULT_ABOUT_VIDEOS,
  aboutFaq: DEFAULT_ABOUT_FAQ,
  aboutFilesImg: DEFAULT_ABOUT_FILES_IMG,
  aboutFilesNote: DEFAULT_ABOUT_FILES_NOTE,
  companies: DEFAULT_COMPANIES,
  contactIntro: DEFAULT_CONTACT_INTRO,
  legalPrivacy: DEFAULT_LEGAL_PRIVACY,
  legalTerms: DEFAULT_LEGAL_TERMS,
  legalDisclaimer: DEFAULT_LEGAL_DISCLAIMER,
  navHidden: ["BLOGS"],
};

// A stored slide is usable only when it has a real image URL.
// Accepts "/img/..." (a file already in the repo) or a full http(s)
// URL the office pasted in. Anything else is dropped, never rendered.
export function cleanSlides(rows: unknown): HeroSlide[] {
  if (!Array.isArray(rows)) return [];
  const out: HeroSlide[] = [];
  for (const r of rows) {
    if (!r || typeof r !== "object") continue;
    const src = String((r as { src?: unknown }).src || "").trim();
    if (!src) continue;
    if (!src.startsWith("/img/") && !src.startsWith("http://") && !src.startsWith("https://")) continue;
    out.push({ src, alt: String((r as { alt?: unknown }).alt || "").trim() || "Anngan project photo" });
  }
  return out;
}

function cleanTeam(rows: unknown): TeamMember[] {
  if (!Array.isArray(rows)) return [];
  const out: TeamMember[] = [];
  for (const r of rows) {
    if (!r || typeof r !== "object") continue;
    const name = String((r as { name?: unknown }).name || "").trim();
    if (!name) continue;
    out.push({
      id: String((r as { id?: unknown }).id || "team-" + out.length),
      name,
      role: String((r as { role?: unknown }).role || "").trim(),
      photoUrl: String((r as { photoUrl?: unknown }).photoUrl || "").trim() || undefined,
      linkedinUrl: String((r as { linkedinUrl?: unknown }).linkedinUrl || "").trim() || undefined,
    });
  }
  return out;
}

export function cleanSocialLinks(rows: unknown): SocialLink[] {
  if (!Array.isArray(rows)) return [];
  const out: SocialLink[] = [];
  for (const r of rows) {
    if (!r || typeof r !== "object") continue;
    const label = String((r as { label?: unknown }).label || "").trim();
    const href = String((r as { href?: unknown }).href || "").trim();
    if (!label || !href) continue;
    out.push({ label, href });
  }
  return out;
}

export function cleanCityCards(rows: unknown): CityCard[] {
  if (!Array.isArray(rows)) return [];
  const out: CityCard[] = [];
  for (const r of rows) {
    if (!r || typeof r !== "object") continue;
    const name = String((r as { name?: unknown }).name || "").trim();
    const img = String((r as { img?: unknown }).img || "").trim();
    if (!name || !img) continue;
    const kind = String((r as { kind?: unknown }).kind || "listings");
    out.push({
      name,
      landmark: String((r as { landmark?: unknown }).landmark || "").trim(),
      img,
      alt: String((r as { alt?: unknown }).alt || "").trim() || name,
      href: String((r as { href?: unknown }).href || "").trim() || "/properties",
      kind: kind === "project" ? "project" : kind === "all" ? "all" : "listings",
      sub: String((r as { sub?: unknown }).sub || "").trim() || undefined,
      pos: String((r as { pos?: unknown }).pos || "").trim() || undefined,
    });
  }
  return out;
}

export function cleanSocieties(rows: unknown): SocietyGuide[] {
  if (!Array.isArray(rows)) return [];
  const out: SocietyGuide[] = [];
  for (const r of rows) {
    if (!r || typeof r !== "object") continue;
    const name = String((r as { name?: unknown }).name || "").trim();
    if (!name) continue;
    out.push({
      name,
      note: String((r as { note?: unknown }).note || "").trim(),
      href: String((r as { href?: unknown }).href || "").trim() || "/contact",
      label: String((r as { label?: unknown }).label || "").trim() || "Open",
      img: String((r as { img?: unknown }).img || "").trim(),
      caption: String((r as { caption?: unknown }).caption || "").trim() || name,
      contain: Boolean((r as { contain?: unknown }).contain),
    });
  }
  return out;
}

export function cleanVideos(rows: unknown): AboutVideo[] {
  if (!Array.isArray(rows)) return [];
  const out: AboutVideo[] = [];
  for (const r of rows) {
    if (!r || typeof r !== "object") continue;
    const id = String((r as { id?: unknown }).id || "").trim();
    if (!id) continue;
    out.push({
      id,
      title: String((r as { title?: unknown }).title || "").trim() || "Anngan video",
      views: String((r as { views?: unknown }).views || "").trim(),
      date: String((r as { date?: unknown }).date || "").trim(),
    });
  }
  return out;
}

export function cleanFaq(rows: unknown): AboutFaq[] {
  if (!Array.isArray(rows)) return [];
  const out: AboutFaq[] = [];
  for (const r of rows) {
    if (!r || typeof r !== "object") continue;
    const q = String((r as { q?: unknown }).q || "").trim();
    if (!q) continue;
    out.push({ q, a: String((r as { a?: unknown }).a || "").trim() });
  }
  return out;
}

export function cleanHomeSocieties(rows: unknown): HomeSocietyChip[] {
  if (!Array.isArray(rows)) return [];
  const out: HomeSocietyChip[] = [];
  for (const r of rows) {
    if (!r || typeof r !== "object") continue;
    const name = String((r as { name?: unknown }).name || "").trim();
    const img = String((r as { img?: unknown }).img || "").trim();
    if (!name || !img) continue;
    out.push({ name, img, href: String((r as { href?: unknown }).href || "").trim() || "/properties" });
  }
  return out;
}

export function cleanCompanies(rows: unknown): CompanyCard[] {
  if (!Array.isArray(rows)) return [];
  const out: CompanyCard[] = [];
  for (const r of rows) {
    if (!r || typeof r !== "object") continue;
    const name = String((r as { name?: unknown }).name || "").trim();
    if (!name) continue;
    out.push({
      id: String((r as { id?: unknown }).id || "company-" + out.length),
      name,
      desc: String((r as { desc?: unknown }).desc || "").trim(),
      href: String((r as { href?: unknown }).href || "").trim() || "/contact",
      linkLabel: String((r as { linkLabel?: unknown }).linkLabel || "").trim() || "Contact the office",
    });
  }
  return out;
}

const NAV_TOGGLE_LABELS = ["PROJECTS", "PROPERTIES", "SOCIETIES GUIDE", "AGENCIES", "BLOGS", "TOOLS", "ANNGAN COMPANIES", "ABOUT US", "CONTACT"];

export { NAV_TOGGLE_LABELS };

export function cleanNavHidden(v: unknown): string[] {
  if (!Array.isArray(v)) return ["BLOGS"];
  const out = v.filter((x): x is string => typeof x === "string" && NAV_TOGGLE_LABELS.includes(x.toUpperCase()));
  return out.map((x) => x.toUpperCase());
}

function cleanHeadings(v: unknown): HomeHeadings {  const d = DEFAULT_HOME_HEADINGS;
  if (!v || typeof v !== "object") return d;
  const t = (k: keyof HomeHeadings) => String((v as Record<string, unknown>)[k] || "").trim() || d[k];
  return { browseCities: t("browseCities"), featured: t("featured"), societies: t("societies"), partnerAgencies: t("partnerAgencies"), ourProjects: t("ourProjects"), whoIsAnngan: t("whoIsAnngan") };
}

// TEAM MIGRATION 26 Nov 2026: the office saved the team once, so
// the stored settings/office document still lists Cheema as "CEO"
// and the Development Team with no photos. The seed defaults alone
// cannot change them, because a stored list wins over the defaults.
// A stored member keeps its own name and any photo the office set,
// but a missing photo is filled from the matching seed member, and
// a stored "CEO" role for team-cheema becomes "Chairman and Chief
// Executive Officer" (user order 26 Nov 2026). Any other stored
// member (an office customisation) is kept exactly as stored.
// CARD CROPS 26 Nov 2026: a stored Development Team photo pointing
// at the 1000x1250 portrait is moved to the matching face-centred
// *-card.jpg, because the short wide card box cropped the portrait
// so badly Daud's face did not show at all.
const TECH_CARD_PHOTO: Record<string, string> = {
  "/img/team/team-malik-abdur-rehman.jpg": "/img/team/team-malik-abdur-rehman-card.jpg",
  "/img/team/team-m-bilal-shah.jpg": "/img/team/team-m-bilal-shah-card.jpg",
  "/img/team/team-muhammad-daud-ali-lashari.jpg": "/img/team/team-muhammad-daud-ali-lashari-card.jpg",
};
function mergeTeamWithSeed(stored: TeamMember[], seed: TeamMember[]): TeamMember[] {
  return stored.map((m) => {
    const s = seed.find((x) => x.id === m.id);
    if (!s) return m;
    const photoUrl = TECH_CARD_PHOTO[(m.photoUrl || "").trim()] || m.photoUrl || s.photoUrl;
    return {
      ...m,
      role: m.id === "team-cheema" && m.role.trim() === "CEO" ? "Chairman and Chief Executive Officer" : m.role,
      photoUrl,
    };
  });
}

export function siteContentFromSettings(s: OfficeSettings): SiteContent {
  const heroSlides = cleanSlides(s.heroSlides);
  const bannerImages = cleanSlides(s.bannerImages);
  const techTeam = cleanTeam(s.techTeam);
  const team = cleanTeam(s.team);
  const socialLinks = cleanSocialLinks(s.socialLinks);
  const cityCards = cleanCityCards(s.cityCards);
  const societies = cleanSocieties(s.societies);
  const aboutVideos = cleanVideos(s.aboutVideos);
  const aboutFaq = cleanFaq(s.aboutFaq);
  const companies = cleanCompanies(s.companies);
  const homeSocieties = cleanHomeSocieties(s.homeSocieties);
  return {
    heroTitle: (s.heroTitle || "").trim() || DEFAULT_HERO_TITLE,
    heroTagline: (s.heroTagline || "").trim() || DEFAULT_HERO_TAGLINE,
    // QUALITY MIGRATION 25 Nov 2026: the office saved the old hero
    // slides once, so the stored settings/office document still lists
    // the two blurry slides (Bahria Sky 630px, Neelum 1000px). The
    // seed defaults alone cannot change them, because a stored list
    // wins over the defaults. A stored slide that is one of the two
    // replaced photos is swapped for its high-resolution replacement
    // here, so the site shows the sharp photos and the office sees
    // the same list in /admin. Any other stored slide (an office
    // customisation) is kept exactly as stored.
    heroSlides: heroSlides.length > 0 ? migrateHeroSlides(heroSlides) : DEFAULT_HERO_SLIDES,
    bannerImages: bannerImages.length > 0 ? bannerImages : DEFAULT_BANNER_IMAGES,
    aboutStory: (s.aboutStory || "").trim() || DEFAULT_ABOUT_STORY,
    // MAIN TEAM 25 Nov 2026: same fallback as the Tech Team, a stored
    // empty team list (saved when Our Team was empty) must not hide
    // the main team defaults. Any stored non-empty list wins, with
    // the 26 Nov 2026 team migration applied (photos filled, "CEO"
    // becomes "Chairman and Chief Executive Officer").
    team: team.length > 0 ? mergeTeamWithSeed(team, DEFAULT_TEAM) : DEFAULT_TEAM,
    techTeam: techTeam.length > 0 ? mergeTeamWithSeed(techTeam, DEFAULT_TECH_TEAM) : DEFAULT_TECH_TEAM,
    ceoPhoto: (s.ceoPhoto || "").trim(),
    socialLinks: socialLinks.length > 0 ? socialLinks : DEFAULT_SOCIAL_LINKS,
    footerAbout: (s.footerAbout || "").trim() || DEFAULT_FOOTER_ABOUT,
    footerCopyright: (s.footerCopyright || "").trim() || DEFAULT_FOOTER_COPYRIGHT,
    cityCards: cityCards.length > 0 ? cityCards : DEFAULT_CITY_CARDS,
    homeHeadings: cleanHeadings(s.homeHeadings),
    homeMghTitle: (s.homeMghTitle || "").trim() || DEFAULT_HOME_MGH_TITLE,
    homeMghText: (s.homeMghText || "").trim() || DEFAULT_HOME_MGH_TEXT,
    homeSocieties: homeSocieties.length > 0 ? homeSocieties : DEFAULT_HOME_SOCIETIES,
    societies: societies.length > 0 ? societies : DEFAULT_SOCIETIES,
    societiesTitle: (s.societiesTitle || "").trim() || DEFAULT_SOCIETIES_TITLE,
    societiesIntro: (s.societiesIntro || "").trim() || DEFAULT_SOCIETIES_INTRO,
    aboutIntro: (s.aboutIntro || "").trim() || DEFAULT_ABOUT_INTRO,
    aboutVideos: aboutVideos.length > 0 ? aboutVideos : DEFAULT_ABOUT_VIDEOS,
    aboutFaq: aboutFaq.length > 0 ? aboutFaq : DEFAULT_ABOUT_FAQ,
    aboutFilesImg: (s.aboutFilesImg || "").trim() || DEFAULT_ABOUT_FILES_IMG,
    aboutFilesNote: (s.aboutFilesNote || "").trim() || DEFAULT_ABOUT_FILES_NOTE,
    companies: companies.length > 0 ? companies : DEFAULT_COMPANIES,
    contactIntro: (s.contactIntro || "").trim() || DEFAULT_CONTACT_INTRO,
    legalPrivacy: (s.legalPrivacy || "").trim() || DEFAULT_LEGAL_PRIVACY,
    legalTerms: (s.legalTerms || "").trim() || DEFAULT_LEGAL_TERMS,
    legalDisclaimer: (s.legalDisclaimer || "").trim() || DEFAULT_LEGAL_DISCLAIMER,
    navHidden: cleanNavHidden(s.navHidden),
  };
}

// QUALITY MIGRATION 25 Nov 2026, see siteContentFromSettings above.
// HERO FIX 2026-11-25 (user: "shit pic replace this pic"):
// alghani-aerial.jpg was a 560px CGI render with baked-in text, so a
// stored copy is swapped for the real Jasmine Block photo; and
// urban-drone.jpg was a 4-quadrant CGI collage, so a stored copy is
// dropped outright. Office custom slides are kept exactly.
const REPLACED_HERO_SLIDES: Record<string, HeroSlide> = {
  "/img/chinatown-bahria-sky.jpg": { src: "/img/hero-bahria-talwar.jpg", alt: "Talwar Chowk, Bahria Town, Lahore" },
  "/img/city-kashmir-neelum.jpg": { src: "/img/hero-sharda-valley.jpg", alt: "Sharda, Neelum Valley, Kashmir" },
  "/img/alghani-aerial.jpg": { src: "/img/hero-bahria-jasmine.jpg", alt: "Jasmine Block, Bahria Town, Lahore" },
};
const DROPPED_HERO_SLIDES = new Set(["/img/urban-drone.jpg"]);
export function migrateHeroSlides(rows: HeroSlide[]): HeroSlide[] {
  return rows
    .filter((r) => !DROPPED_HERO_SLIDES.has(r.src))
    .map((r) => REPLACED_HERO_SLIDES[r.src] || r);
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    return siteContentFromSettings(await getSettings());
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export async function saveSiteContent(c: SiteContent): Promise<void> {
  const s = await getSettings();
  await saveSettings({
    ...s,
    heroTitle: c.heroTitle.trim() || DEFAULT_HERO_TITLE,
    heroTagline: c.heroTagline.trim() || DEFAULT_HERO_TAGLINE,
    heroSlides: cleanSlides(c.heroSlides),
    bannerImages: cleanSlides(c.bannerImages),
    aboutStory: c.aboutStory.trim() || DEFAULT_ABOUT_STORY,
    team: cleanTeam(c.team),
    techTeam: cleanTeam(c.techTeam),
    ceoPhoto: (c.ceoPhoto || "").trim(),
    socialLinks: cleanSocialLinks(c.socialLinks),
    footerAbout: c.footerAbout.trim() || DEFAULT_FOOTER_ABOUT,
    footerCopyright: c.footerCopyright.trim() || DEFAULT_FOOTER_COPYRIGHT,
    cityCards: cleanCityCards(c.cityCards),
    homeHeadings: c.homeHeadings,
    homeMghTitle: c.homeMghTitle.trim() || DEFAULT_HOME_MGH_TITLE,
    homeMghText: c.homeMghText.trim() || DEFAULT_HOME_MGH_TEXT,
    homeSocieties: cleanHomeSocieties(c.homeSocieties),
    societies: cleanSocieties(c.societies),
    societiesTitle: c.societiesTitle.trim() || DEFAULT_SOCIETIES_TITLE,
    societiesIntro: c.societiesIntro.trim() || DEFAULT_SOCIETIES_INTRO,
    aboutIntro: c.aboutIntro.trim() || DEFAULT_ABOUT_INTRO,
    aboutVideos: cleanVideos(c.aboutVideos),
    aboutFaq: cleanFaq(c.aboutFaq),
    aboutFilesImg: c.aboutFilesImg.trim() || DEFAULT_ABOUT_FILES_IMG,
    aboutFilesNote: c.aboutFilesNote.trim() || DEFAULT_ABOUT_FILES_NOTE,
    companies: cleanCompanies(c.companies),
    contactIntro: c.contactIntro.trim() || DEFAULT_CONTACT_INTRO,
    legalPrivacy: c.legalPrivacy.trim() || DEFAULT_LEGAL_PRIVACY,
    legalTerms: c.legalTerms.trim() || DEFAULT_LEGAL_TERMS,
    legalDisclaimer: c.legalDisclaimer.trim() || DEFAULT_LEGAL_DISCLAIMER,
    navHidden: cleanNavHidden(c.navHidden),
  });
}

// Project card cover URL. A cardImg set in /admin can be a file
// already in public/img (stored as the file name) or a full http(s)
// URL the office pasted in. A full URL is used as-is, a file name is
// served from /img.
export function projectCardSrc(p: { cardImg?: string; img?: string }): string {
  const raw = (p.cardImg || p.img || "").trim();
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return "/img/" + raw.replace(/^\/img\//, "");
}

// Status badge text and colours, shared by home, /projects and the
// project detail page. Available shows no badge.
export function projectStatusLabel(status: string | undefined): string | null {
  if (status === "Sold Out") return "SOLD OUT";
  if (status === "Coming Soon") return "COMING SOON";
  return null;
}

// City card photo URL, same rule as projectCardSrc: a full URL is
// used as-is, a bare file name is served from /img.
export function cityCardSrc(img: string): string {
  const raw = (img || "").trim();
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return "/img/" + raw.replace(/^\/img\//, "");
}
