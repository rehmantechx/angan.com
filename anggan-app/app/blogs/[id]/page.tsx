import type { Metadata } from "next";
import { BlogArticle } from "../../../components/BlogArticle";
import { resolveBlog } from "../../../lib/db";

// Internal article page for the 23 historic 2022-2023 articles and
// for office posts added in /admin. The seed data carries only title,
// date and the old WordPress URL, no article body, so no body text is
// invented here for historic articles. Office posts carry their own
// cover photo and short body, rendered by BlogArticle.
//
// SEO 27 Nov 2026: the page is rendered on every request, not baked
// at build time, so a Meta Title, Meta Description or URL slug saved
// in /admin shows in the page head straight away, with no redeploy.
// A saved URL slug resolves here too, and the old id address keeps
// working.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const b = await resolveBlog(params.id).catch(() => null);
  if (!b) {
    return { title: "Article not found | Anngan" };
  }
  const title = (b.metaTitle || "").trim() || b.title + " | Anngan";
  const description =
    (b.metaDescription || "").trim() ||
    (b.body || "").trim().slice(0, 150) ||
    b.title + ", " + b.date + ". Anngan real estate blog.";
  return { title, description };
}

export default function BlogPage({ params }: { params: { id: string } }) {
  return <BlogArticle id={params.id} />;
}
