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
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroTitle: DEFAULT_HERO_TITLE,
  heroTagline: DEFAULT_HERO_TAGLINE,
  heroSlides: DEFAULT_HERO_SLIDES,
  bannerImages: DEFAULT_BANNER_IMAGES,
  aboutStory: DEFAULT_ABOUT_STORY,
  team: DEFAULT_TEAM,
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
    });
  }
  return out;
}

export function siteContentFromSettings(s: OfficeSettings): SiteContent {
  const heroSlides = cleanSlides(s.heroSlides);
  const bannerImages = cleanSlides(s.bannerImages);
  return {
    heroTitle: (s.heroTitle || "").trim() || DEFAULT_HERO_TITLE,
    heroTagline: (s.heroTagline || "").trim() || DEFAULT_HERO_TAGLINE,
    heroSlides: heroSlides.length > 0 ? heroSlides : DEFAULT_HERO_SLIDES,
    bannerImages: bannerImages.length > 0 ? bannerImages : DEFAULT_BANNER_IMAGES,
    aboutStory: (s.aboutStory || "").trim() || DEFAULT_ABOUT_STORY,
    team: cleanTeam(s.team),
  };
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
