"use client";
import { useEffect, useState } from "react";
import { getBlogs } from "../../lib/db";
import { Blog } from "../../lib/seed";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  useEffect(() => {
    getBlogs().then(setBlogs);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">Blogs</h1>
      <p className="text-gray-600 mt-1">News from anngan.com, newest first. Latest: 27 Feb 2023. Oldest shown: 21 Dec 2022.</p>
      <ul className="mt-4 space-y-3">
        {blogs.map((b) => (
          <li key={b.id} className="border border-gray-200 rounded-lg p-4 bg-white">
            <p className="text-sm text-gray-600">{b.date}</p>
            <a href={b.url} target="_blank" rel="noopener" className="font-semibold text-navy hover:text-anngan-dark">
              {b.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
