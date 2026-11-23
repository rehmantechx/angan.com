// Shared search rules for home and /properties. One source of truth, so
// the result note and the rendered list can never disagree again.
// Rules, all from the real seed data (12 listings, 7 projects):
// - Listings: House 10, Flat 1, Portion 1. There is NO Plot, Commercial or
//   File listing, so a Plot search must return 0 listings, never 1.
// - Projects have no beds, no type and no price, so a listing filter
//   (type House/Flat/Plot/Portion/Commercial, beds, or budget) must NOT
//   return projects, unless the search is a project search.
// - Search text matches ALL words, each word somewhere in the haystack:
//   "Karachi DHA" needs both words, "10 Marla" needs both, "DHA" alone
//   matches the 3 DHA listings, "Karachi" alone matches 1.
// - Budget is a sale price, so it never filters rent listings, whose
//   n is a monthly rent, not a sale price. Rent listings always pass it.
// - When nothing matches, the caller shows the 3 nearest Lahore listings
//   under a "Nearest" heading, never counted in "Found X".
import { Listing, Project } from "./seed";

export type SearchFilters = {
  status: string;
  q: string;
  type: string;
  city: string;
  beds: string;
  budget: string;
};

export function searchWords(key: string): string[] {
  return key
    .trim()
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 0);
}

// ALL words must appear somewhere in the haystack. "Karachi, DHA" must
// not match a Karachi flat that has no DHA in it, and "10 Marla" must
// not match a 5 Marla listing.
export function matchesKey(hay: string, key: string): boolean {
  const words = searchWords(key);
  if (words.length === 0) return true;
  const h = hay.toLowerCase();
  return words.every((w) => h.includes(w));
}

export function budgetOK(l: Listing, bud: string): boolean {
  if (!bud) return true;
  if (l.status === "rent") return true;
  // Home search values: under-1cr / 1cr-5cr / above-5cr.
  if (bud === "under-1cr") return l.n < 10000000;
  if (bud === "1cr-5cr") return l.n >= 10000000 && l.n < 50000000;
  if (bud === "above-5cr") return l.n >= 50000000;
  if (bud.startsWith("Under")) return l.n < 10000000;
  if (bud.startsWith("Rs 1 to 3")) return l.n >= 10000000 && l.n < 30000000;
  if (bud.startsWith("Rs 3 to 5")) return l.n >= 30000000 && l.n < 50000000;
  return l.n >= 50000000;
}

const NO_BED_TYPES = ["Plot", "File", "Commercial"];

export function listingMatches(l: Listing, f: SearchFilters): boolean {
  if (f.status === "project") return false;
  if (f.status === "sale" && l.status !== "sale") return false;
  if (f.status === "rent" && l.status !== "rent") return false;
  if (f.city && l.city !== f.city) return false;
  if (f.type === "File") return false;
  if (f.type && l.type !== f.type) return false;
  // Plots, files and shops have no bedrooms. Beds is cleared in the UI
  // for those types, but the rule is enforced here too, so a stale beds
  // value can never turn a Plot search into a house search.
  if (f.beds && !NO_BED_TYPES.includes(f.type)) {
    if (f.beds === "5+") {
      if (l.beds < 5) return false;
    } else if (l.beds !== parseInt(f.beds, 10)) return false;
  }
  if (!budgetOK(l, f.budget)) return false;
  if (f.q.trim()) {
    const hay = l.title + " " + l.loc + " " + l.city + " " + l.size + " " + l.type;
    if (!matchesKey(hay, f.q)) return false;
  }
  return true;
}

export function searchListings(listings: Listing[], f: SearchFilters): Listing[] {
  return listings.filter((l) => listingMatches(l, f));
}

export function searchProjects(projects: Project[], f: SearchFilters): Project[] {
  if (f.status === "sale" || f.status === "rent") return [];
  const cityOk = (p: Project) => !f.city || p.city === f.city;
  const keyOk = (p: Project) => !f.q.trim() || matchesKey(p.name + " " + p.loc + " " + p.city, f.q);
  // File means MGH only, and only if it fits the city and key filters.
  if (f.type === "File") {
    return projects.filter((p) => p.name === "MGH Pakistan" && cityOk(p) && keyOk(p));
  }
  // Projects tab: search projects only, by city and key. Beds, type and
  // budget are listing filters and do not apply to projects.
  if (f.status === "project") {
    return projects.filter((p) => cityOk(p) && keyOk(p));
  }
  // Any listing-specific filter is set, so this is a listing search.
  // Projects have no beds, type or price, so return none of them.
  if (f.type || f.beds || f.budget) return [];
  return projects.filter((p) => cityOk(p) && keyOk(p));
}

export function searchAll(
  listings: Listing[],
  projects: Project[],
  f: SearchFilters
): { hits: Listing[]; phits: Project[]; nearest: Listing[] } {
  const hits = searchListings(listings, f);
  const phits = searchProjects(projects, f);
  const nearest =
    hits.length === 0 && phits.length === 0
      ? listings.filter((l) => l.city === "Lahore").slice(0, 3)
      : [];
  return { hits, phits, nearest };
}

export function buildSearchNote(
  hits: Listing[],
  phits: Project[],
  f: SearchFilters
): string {
  const key = f.q.trim().toLowerCase();
  if (hits.length || phits.length) {
    const parts: string[] = [];
    if (hits.length) parts.push(hits.length + (hits.length === 1 ? " listing" : " listings"));
    if (phits.length) parts.push(phits.length + (phits.length === 1 ? " project" : " projects"));
    let msg = "Found " + parts.join(" and ") + ".";
    if (f.city === "Karachi" && hits.length === 1 && phits.length === 0) {
      msg += " Karachi has only 1 real listing on anngan.com, the Shamsi Society flat below. Nearest other listings are in Lahore.";
    }
    if (key && hits.length === 0 && phits.length > 0) {
      msg += " No listing matched that word, but these projects did.";
    }
    return msg;
  }
  if (key && key.includes("karachi")) {
    return "No Karachi listing matched that word. anngan.com has only 1 Karachi listing, the Shamsi Society flat, Rs 3,600,000. Nearest real listings in Lahore are shown below.";
  }
  if (f.city) {
    return (
      "No listing in " +
      f.city +
      " matched that search. Nearest real listings in Lahore are shown below. Call +92 304 1111 698 to ask."
    );
  }
  return "No exact match on anngan.com for that search. Nearest real listings in Lahore are shown below. Call +92 304 1111 698 to ask about other cities.";
}
