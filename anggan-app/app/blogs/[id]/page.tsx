import { BLOGS } from "../../../lib/seed";
import { BlogArticle } from "../../../components/BlogArticle";

// Internal article page for the 23 historic 2022-2023 articles and
// for office posts added in /admin. The seed data carries only title,
// date and the old WordPress URL, no article body, so no body text is
// invented here for historic articles. Office posts carry their own
// cover photo and short body, rendered by BlogArticle.
export function generateStaticParams() {
  return BLOGS.map((b) => ({ id: b.id }));
}

export default function BlogPage({ params }: { params: { id: string } }) {
  return <BlogArticle id={params.id} />;
}
