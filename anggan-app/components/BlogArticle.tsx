// Blog article detail, client side: the seed carries the 23
// historic 2022-2023 articles (title and date only, no body), and
// office posts added in /admin carry a cover photo and a short body.
// The Firestore row for this id wins when it exists, so an office
// post shows its body and cover here. A historic article with no
// body still says plainly that its full text is not on this site,
// never an invented body.
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BLOGS, Blog } from "../lib/seed";
import { getBlogs, normalizeSlug } from "../lib/db";

export function BlogArticle({ id }: { id: string }) {
  // SEO 27 Nov 2026: resolves by id OR by a saved URL slug, so a
  // slug address opens the same article as the id address.
  const seed = BLOGS.find((b) => b.id === id || normalizeSlug(b.slug || "") === normalizeSlug(id));
  const [article, setArticle] = useState<Blog | undefined>(seed);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    getBlogs()
      .then((rows) => {
        const row = rows.find((b) => b.id === id || normalizeSlug(b.slug || "") === normalizeSlug(id));
        if (row) setArticle(row);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [id]);
  if (!article) {
    if (!loaded) return <p>Loading...</p>;
    return (
      <div>
        <p className="text-sm">
          <Link href="/blogs" className="text-anngan-dark font-semibold">All blogs</Link>
        </p>
        <h1 className="text-3xl font-bold text-navy mt-2">Article not found</h1>
        <p className="text-gray-600 mt-1">This article is not on the site. Call the office on +92 304 1111 698 if you need it.</p>
      </div>
    );
  }
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
      {article.coverImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.coverImg} alt="" className="w-full max-w-2xl aspect-video object-cover rounded-lg bg-gray-100 border border-gray-200 mt-4" />
      ) : null}
      <div className="mt-5 border border-gray-200 rounded-lg p-4 bg-white">
        {article.body ? (
          article.body.split(/\n\s*\n/).map((para, i) => (
            <p key={i} className={i > 0 ? "text-gray-700 mt-3" : "text-gray-700"}>{para}</p>
          ))
        ) : (
          <p className="text-gray-600">
            This article was first published on the old Anngan website on {article.date}. The full
            article text is not published on this site. Call the office on +92 304 1111 698 if
            you need the details behind this story.
          </p>
        )}
      </div>
      {article.url ? (
        <p className="mt-4 text-sm">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-anngan-dark font-semibold underline">
            Read the original story
          </a>
        </p>
      ) : null}
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
