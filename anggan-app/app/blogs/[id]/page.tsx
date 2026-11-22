import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOGS } from "../../../lib/seed";

// Internal article page for the 23 historic 2022-2023 articles.
// The seed data carries only title, date and the old WordPress URL, no
// article body, so no body text is invented here. The page shows the
// real title and date, and says plainly that the full article text was
// published on the old anngan.com site and is not on this site. That
// keeps every blog card working after the DNS cutover, when the old
// WordPress URLs would 404, without making up article content.
export function generateStaticParams() {
  return BLOGS.map((b) => ({ id: b.id }));
}

export default function BlogPage({ params }: { params: { id: string } }) {
  const article = BLOGS.find((b) => b.id === params.id);
  if (!article) notFound();
  const others = BLOGS.filter((b) => b.id !== article.id).slice(0, 5);
  return (
    <div>
      <p className="text-sm">
        <Link href="/blogs" className="text-anngan-dark font-semibold">
          All blogs
        </Link>
        <span className="text-gray-600"> / {article.date}</span>
      </p>
      <h1 className="text-3xl font-bold text-navy mt-2">{article.title}</h1>
      <p className="text-gray-600 mt-1">{article.date}</p>
      <div className="mt-5 border border-gray-200 rounded-lg p-4 bg-white">
        <p className="text-gray-600">
          This article was first published on the old Anngan website on {article.date}. The full
          article text is not published on this site. Call the office on +92 304 1111 698 if
          you need the details behind this story.
        </p>
      </div>
      {others.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-navy">More from Anngan</h2>
          <ul className="mt-3 space-y-2">
            {others.map((o) => (
              <li key={o.id}>
                <Link href={`/blogs/${o.id}`} className="text-anngan-dark font-semibold hover:underline">
                  {o.title} &middot; {o.date}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <p className="mt-6 text-sm">
        <Link href="/blogs" className="text-anngan-dark font-semibold underline">
          Back to all blogs
        </Link>
      </p>
    </div>
  );
}
