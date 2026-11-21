"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../lib/auth";
import { isFirebaseConfigured } from "../lib/firebase";
import { PROJECTS, SERVICES } from "../lib/seed";

export function FirebaseNotice() {
  if (isFirebaseConfigured()) return null;
  return (
    <div className="bg-amber-100 text-amber-900 text-sm px-4 py-2 text-center">
      Firebase is not connected. Showing saved site data. Fill in .env.local
      from the Firebase console to connect the live database.
    </div>
  );
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/projects", label: "Projects" },
  { href: "/agencies", label: "Agencies" },
  { href: "/blogs", label: "Blogs" },
  { href: "/tools", label: "Tools" },
  { href: "/services", label: "Angan Tech" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/create-listing", label: "List a property" },
];

const SOCIAL_LINKS = [
  { href: "https://www.facebook.com/annganpk", label: "Facebook" },
  { href: "https://twitter.com/annganpk", label: "X" },
  { href: "https://pk.linkedin.com/company/annganpk", label: "LinkedIn" },
  { href: "https://instagram.com/annganpk", label: "Instagram" },
  { href: "https://www.youtube.com/channel/UC7lbVe_2Lfw8dzThSaAq6Aw", label: "YouTube" },
];

export function Header() {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header>
      <div className="bg-navy text-white text-xs sm:text-sm">
        <div className="max-w-6xl mx-auto px-4 py-1.5 flex flex-wrap gap-x-4 gap-y-1">
          <a href="tel:+923041111698" className="font-semibold hover:underline">
            Call +92 304 1111 698
          </a>
          <a href="mailto:info@anngan.com" className="hover:underline">
            info@anngan.com
          </a>
          <span className="hidden md:inline">57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore</span>
        </div>
      </div>
      <div className="bg-white border-b-4 border-anngan">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="/img/logo.png" alt="Anngan, anngan.com" className="h-11 w-auto" />
          </Link>
          <div className="flex gap-2 ml-auto">
            <a
              href="tel:+923041111698"
              className="bg-anngan text-white text-sm px-3 py-2 rounded font-semibold whitespace-nowrap"
            >
              Call
            </a>
            <a
              href="https://wa.me/923041111698"
              target="_blank"
              rel="noopener"
              className="bg-green-600 text-white text-sm px-3 py-2 rounded font-semibold whitespace-nowrap"
            >
              WhatsApp
            </a>
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden bg-navy text-white text-sm px-3 py-2 rounded font-semibold"
              aria-label="Open menu"
            >
              MENU
            </button>
          </div>
        </div>
        <nav className="hidden lg:block border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-2 flex gap-4 text-sm font-semibold flex-wrap">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-navy hover:text-anngan">
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/admin" className="text-anngan">
                  Dashboard
                </Link>
                <button onClick={() => signOut()} className="text-gray-500">
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/admin/login" className="text-navy hover:text-anngan">
                Office login
              </Link>
            )}
          </div>
        </nav>
      </div>
      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-label="Menu">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-lg overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <img src="/img/logo.png" alt="Anngan" className="h-9 w-auto" />
              <button
                onClick={() => setMenuOpen(false)}
                className="text-navy font-bold px-2 py-1"
                aria-label="Close menu"
              >
                Close
              </button>
            </div>
            <nav className="px-4 py-3 flex flex-col gap-1 text-sm font-semibold">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-navy py-2 border-b border-gray-100 hover:text-anngan"
                >
                  {l.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-anngan py-2 border-b border-gray-100">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="text-gray-500 py-2 text-left"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link href="/admin/login" onClick={() => setMenuOpen(false)} className="text-navy py-2 hover:text-anngan">
                  Office login
                </Link>
              )}
            </nav>
            <div className="px-4 pb-4 flex gap-2">
              <a href="tel:+923041111698" className="bg-anngan text-white text-sm px-3 py-2 rounded font-semibold">
                Call
              </a>
              <a
                href="https://wa.me/923041111698"
                target="_blank"
                rel="noopener"
                className="bg-green-600 text-white text-sm px-3 py-2 rounded font-semibold"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-sm">
        <div>
          <p className="font-bold text-lg">Anngan</p>
          <p className="mt-2 text-gray-200">
            Real homes, real projects, real prices. CEO Muhammad Mahmood Cheema.
          </p>
          <p className="mt-3">57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore</p>
          <p className="mt-1">
            <a href="tel:+923041111698" className="underline">+92 304 1111 698</a>
          </p>
          <p className="mt-1">
            <a href="mailto:info@anngan.com" className="underline">info@anngan.com</a>
          </p>
        </div>
        <div>
          <p className="font-bold text-base">Projects</p>
          <ul className="mt-3 space-y-2">
            {PROJECTS.map((p) => (
              <li key={p.id}>
                <Link href={`/projects/${p.id}`} className="text-gray-200 hover:text-white hover:underline">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-bold text-base">Angan Tech services</p>
          <ul className="mt-3 space-y-2">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <Link href={`/services/${s.id}`} className="text-gray-200 hover:text-white hover:underline">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-bold text-base">Get Connected</p>
          <ul className="mt-3 space-y-2">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener" className="text-gray-200 hover:text-white hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            <Link href="/about" className="underline">About</Link>
            {" | "}
            <Link href="/contact" className="underline">Contact</Link>
            {" | "}
            <Link href="/create-listing" className="underline">List a property</Link>
            {" | "}
            <Link href="/admin/login" className="underline">Office login</Link>
          </p>
        </div>
      </div>
      <div className="border-t border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-3 text-xs text-gray-300">
          Copyright ANNGAN TECHNOLOGIES PVT. LTD. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
