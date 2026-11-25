// Site content the office edits in /admin (hero, banners, About
// story, Our Team). Stored on the settings/office document in
// Firestore, which the published rules already allow the public to
// read and only the office to write, so no rule change and no redeploy
// is needed for an edit to show on the live site. When Firestore has
// no value yet, the seed defaults apply, so the site works before the
// office edits anything. All images are URLs, never uploads: Firebase
// Storage is not enabled.
import { getSettings, saveSettings } from "./db";
import {
  DEFAULT_ABOUT_STORY,
  DEFAULT_BANNER_IMAGES,
  DEFAULT_HERO_SLIDES,
  DEFAULT_HERO_TAGLINE,
  DEFAULT_HERO_TITLE,
  DEFAULT_TEAM,
  DEFAULT_TECH_TEAM,
  HeroSlide,
  OfficeSettings,
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

export function siteContentFromSettings(s: OfficeSettings): SiteContent {
  const heroSlides = cleanSlides(s.heroSlides);
  const bannerImages = cleanSlides(s.bannerImages);
  const techTeam = cleanTeam(s.techTeam);
  const team = cleanTeam(s.team);
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
    // the main team defaults. Any stored non-empty list wins.
    team: team.length > 0 ? team : DEFAULT_TEAM,
    techTeam: techTeam.length > 0 ? techTeam : DEFAULT_TECH_TEAM,
    ceoPhoto: (s.ceoPhoto || "").trim(),
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
