// Listing detail page, server component (SEO 27 Nov 2026): the
// interactive body lives in PropertyDetail.tsx, so this page can
// carry generateMetadata. The Meta Title and Meta Description saved
// in /admin win when they are set; otherwise the page uses the
// listing title and normal text. A saved URL slug resolves here too,
// and the old id address keeps working.
import type { Metadata } from "next";
import { resolveListing } from "../../../lib/db";
import { formatPrice } from "../../../lib/formatPrice";
import { PropertyDetail } from "./PropertyDetail";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const l = await resolveListing(params.id).catch(() => null);
  if (!l || l.liveStatus !== "live" || l.visible === false) {
    return { title: "Property not found | Anngan" };
  }
  const title = (l.metaTitle || "").trim() || l.title + " | Anngan";
  const description =
    (l.metaDescription || "").trim() ||
    l.title + ", " + l.loc + ", " + l.city + ". " + formatPrice(l.n, l.status) + ". Call Anngan on +92 304 1111 698.";
  return { title, description };
}

export default function PropertyPage({ params }: { params: { id: string } }) {
  return <PropertyDetail id={params.id} />;
}
