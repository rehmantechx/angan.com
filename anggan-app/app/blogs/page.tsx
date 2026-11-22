import { BLOGS } from "../../lib/seed";

// Server component on purpose: the 23 real articles are rendered in the
// HTML itself, so /blogs can never be a blank white list while JavaScript
// or Firestore is loading. The audit found /blogs completely empty on
// live; the old client page started from seed but only replaced it after
// a Firestore read, and on the live build that read left the list empty.
// These are historic 2022-2023 articles from anngan.com, not live-edited
// office data, so the seed list is the canonical public list.
export default function BlogsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">Blogs</h1>
      <p className="text-gray-600 mt-1">News from anngan.com, newest first. {BLOGS.length} articles, 21 Dec 2022 to 27 Feb 2023. Each title opens the original article on anngan.com in a new tab.</p>
      {BLOGS.length === 0 ? (
        <p className="mt-4 border border-gray-200 rounded-lg p-4 bg-white text-sm">
          No articles are showing right now. Call the office on +92 304 1111 698 and ask for the latest news.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {BLOGS.map((b) => (
            <li key={b.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <p className="text-sm text-gray-600">{b.date}</p>
              <a href={b.url} target="_blank" rel="noopener" className="font-semibold text-navy hover:text-anngan-dark">
                {b.title} <span className="text-anngan-dark" aria-label="Opens on anngan.com in a new tab">&#8599;</span>
              </a>
              <p className="text-xs text-gray-500 mt-1">Opens on anngan.com in a new tab</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
