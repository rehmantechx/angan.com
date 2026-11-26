// Branded 404 page (26 Nov 2026). Next.js renders this for any unknown
// route, including /this-page-does-not-exist, with HTTP 404. It lives
// inside the root layout, so the public header and footer still show.
// Red #DD3333, dark blue #004274, full logo, plain words, no invented
// text: only the real office phone number.
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Page not found | Anngan",
  description: "This page does not exist on anngan.com. Go back home or browse real homes, plots and projects in Pakistan.",
};

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-xl text-center">
        <Image
          src="/img/logo.png"
          alt="anngan.com, banay khawab haqiqat"
          width={1200}
          height={231}
          className="mx-auto h-14 w-auto"
          priority
        />
        <p className="mt-10 text-7xl font-extrabold leading-none text-navy">404</p>
        <h1 className="mt-4 text-2xl font-bold text-navy md:text-3xl">Page not found</h1>
        <p className="mt-3 text-base text-gray-600">
          Sorry, this page does not exist. It may have moved, or the link may be wrong.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center justify-center rounded bg-anngan px-6 font-bold text-white hover:bg-annganDark"
          >
            Back to home
          </Link>
          <Link
            href="/properties"
            className="inline-flex min-h-[48px] items-center justify-center rounded border-2 border-navy bg-white px-6 font-bold text-navy hover:bg-blue-50"
          >
            Browse properties
          </Link>
        </div>
        <p className="mt-8 text-sm text-gray-600">
          Need help? Call the office:{" "}
          <a href="tel:+923041111698" className="font-bold text-navy hover:underline">
            +92 304 1111 698
          </a>
        </p>
      </div>
    </div>
  );
}
