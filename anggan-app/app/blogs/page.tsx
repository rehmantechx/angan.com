"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BLOGS, Blog } from "../../lib/seed";
import { getBlogs } from "../../lib/db";

// Blogs list: the 23 real historic 2022-2023 articles render from
// the seed at once, so /blogs can never be a blank white list while
// JavaScript or Firestore is loading. Office posts added in /admin
// (title, date, cover photo, short body) merge in by id, newest
// first, with their cover photo and body excerpt. Historic articles
// are never edited here: a Firestore row only replaces a seed row
// with the same id.
function sortBlogs(rows: Blog[]): Blog[] {
  return [...rows].sort((a, b) => {
    const da = Date.parse(a.date);
    const db = Date.parse(b.date);
    if (!isNaN(da) && !isNaN(db) && da !== db) return db - da;
    if (!isNaN(da) && isNaN(db)) return -1;
    if (isNaN(da) && !isNaN(db)) return 1;
    return 0;
  });
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>(BLOGS);
  useEffect(() => {
    getBlogs()
      .then((rows) => {
        if (!rows || rows.length === 0) return;
        const byId = new Map(BLOGS.map((b) => [b.id, b]));
        for (const r of rows) byId.set(r.id, r);
        setBlogs(sortBlogs([...byId.values()]));
      })
      .catch(() => {});
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">Blogs</h1>
      <p className="text-gray-600 mt-1">News from Anngan, newest first. {blogs.length} articles. The 23 historic articles run 21 Dec 2022 to 27 Feb 2023, titles and dates only: the full article text is not published on this site. Call +92 304 1111 698 for details.</p>
      {blogs.length === 0 ? (
        <p className="mt-4 border border-gray-200 rounded-lg p-4 bg-white text-sm">
          No articles are showing right now. Call the office on +92 304 1111 698 and ask for the latest news.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {blogs.map((b) => (
            <li key={b.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              {b.coverImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.coverImg} alt="" className="w-full max-w-sm aspect-video object-cover rounded-lg bg-gray-100 border border-gray-200 mb-3" />
              ) : null}
              <p className="text-sm text-gray-600">{b.date}</p>
              <Link href={`/blogs/${b.id}`} className="font-semibold text-navy hover:text-anngan-dark">
                {b.title}
              </Link>
              {b.body ? <p className="text-sm text-gray-600 mt-1">{b.body.slice(0, 200)}{b.body.length > 200 ? "..." : ""}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
