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

// Decided nav, in the exact order of the static site.
const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT US" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/properties", label: "PROPERTIES" },
  { href: "/blogs", label: "BLOGS" },
  { href: "/societies", label: "SOCIETIES GUIDE" },
  { href: "/contact", label: "CONTACT" },
  { href: "/companies", label: "ANNGAN COMPANIES" },
  { href: "/services", label: "ANGAN TECH" },
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
          <span>
            Call{" "}
            <a href="tel:+923041111698" className="font-semibold hover:underline">
              +92 304 1111 698
            </a>
          </span>
          <span>
            Email{" "}
            <a href="mailto:info@anngan.com" className="hover:underline">
              info@anngan.com
            </a>
          </span>
          <span className="hidden md:inline">57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore</span>
        </div>
      </div>
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <Link href="/" className="flex items-center shrink-0" aria-label="Anngan home">
            <img
              src="/img/logo.png"
              alt="anngan.com, banay khawab haqiqat"
              className="h-10 sm:h-[54px] w-auto max-w-[170px] sm:max-w-[280px] object-contain"
            />
          </Link>
          <div className="flex gap-2 ml-auto shrink-0">
            <a
              href="tel:+923041111698"
              className="bg-navy text-white text-xs sm:text-sm px-2 sm:px-3 py-2 rounded font-semibold whitespace-nowrap"
              aria-label="Call Anngan on +92 304 1111 698"
            >
              Call<span className="hidden sm:inline">&nbsp;+92 304 1111 698</span>
            </a>
            <a
              href="https://wa.me/923041111698"
              target="_blank"
              rel="noopener"
              className="bg-green-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 rounded font-semibold whitespace-nowrap"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
      <nav className="bg-anngan text-white" aria-label="Main menu">
        <div className="px-4">
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden font-bold py-2.5 pr-2 text-sm tracking-wide"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            MENU &#9776;
          </button>
          <div className="hidden lg:flex items-center gap-4 text-xs font-bold whitespace-nowrap overflow-x-auto py-3 max-w-7xl mx-auto px-4">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:underline shrink-0">
                {l.label}
              </Link>
            ))}
            <Link href="/create-listing" className="bg-sky-400 text-navy px-2 py-1.5 rounded shrink-0">
              CREATE A LISTING
            </Link>
            {user ? (
              <>
                <Link href="/admin" className="hover:underline shrink-0">DASHBOARD</Link>
                <button onClick={() => signOut()} className="hover:underline shrink-0">SIGN OUT</button>
              </>
            ) : (
              <Link href="/admin/login" className="hover:underline shrink-0">OFFICE LOGIN</Link>
            )}
          </div>
        </div>
      </nav>
      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-label="Site menu">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-lg overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <img src="/img/logo.png" alt="anngan.com logo, banay khawab haqiqat" className="h-9 w-auto" />
              <button
                onClick={() => setMenuOpen(false)}
                className="text-navy font-bold px-2 py-1"
                aria-label="Close menu"
              >
                &#10005;
              </button>
            </div>
            <nav className="px-4 py-3 flex flex-col gap-1 text-sm font-bold" aria-label="Menu links">
              <p className="text-xs text-gray-500 font-bold tracking-wide pt-1">Anngan</p>
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-navy py-2 border-b border-gray-100 hover:text-anngan"
                >
                  {l.label} &rsaquo;
                </Link>
              ))}
              <p className="text-xs text-gray-500 font-bold tracking-wide pt-3">Companies</p>
              <Link href="/companies" onClick={() => setMenuOpen(false)} className="text-navy py-2 border-b border-gray-100">
                Anngan Companies &rsaquo;
              </Link>
              <Link href="/services" onClick={() => setMenuOpen(false)} className="text-navy py-2 border-b border-gray-100">
                Angan Tech &rsaquo;
              </Link>
              <Link href="/services/service-7" onClick={() => setMenuOpen(false)} className="text-navy py-2 border-b border-gray-100">
                Angan Tech CRM &rsaquo;
              </Link>
              <Link
                href="/create-listing"
                onClick={() => setMenuOpen(false)}
                className="bg-sky-400 text-navy py-2 px-3 rounded mt-2 text-center"
              >
                CREATE A LISTING
              </Link>
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
                Call +92 304 1111 698
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
    <footer className="bg-anngan text-red-100 mt-0">
      <div className="max-w-6xl mx-auto px-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8 py-10 text-sm">
        <div>
          <span className="inline-block bg-white rounded-lg px-3 py-2 shadow">
            <img src="/img/logo.png" alt="anngan.com logo, banay khawab haqiqat" className="w-[230px] max-w-full h-auto" />
          </span>
          <p className="mt-3">
            Pakistan's trusted real estate service providers. Projects and property in Karachi, Islamabad, Lahore and Peshawar.
          </p>
          <p className="mt-3">
            57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore<br />
            <a href="tel:+923041111698" className="hover:text-white hover:underline">+92 304 1111 698</a><br />
            <a href="mailto:info@anngan.com" className="hover:text-white hover:underline">info@anngan.com</a>
          </p>
        </div>
        <div>
          <p className="font-bold text-white text-base">Company</p>
          <ul className="mt-3 space-y-1.5">
            <li><Link href="/about" className="hover:text-white hover:underline">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white hover:underline">Contact Us</Link></li>
            <li><Link href="/companies" className="hover:text-white hover:underline">Anngan Companies</Link></li>
            <li><Link href="/services" className="hover:text-white hover:underline">Angan Tech</Link></li>
            <li><Link href="/create-listing" className="hover:text-white hover:underline">Create a Listing</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-bold text-white text-base">Projects</p>
          <ul className="mt-3 space-y-1.5">
            {PROJECTS.map((p) => (
              <li key={p.id}>
                <Link href={`/projects/${p.id}`} className="hover:text-white hover:underline">{p.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-bold text-white text-base">Connect</p>
          <ul className="mt-3 space-y-1.5">
            <li><Link href="/blogs" className="hover:text-white hover:underline">Blogs</Link></li>
            <li><Link href="/properties" className="hover:text-white hover:underline">Properties</Link></li>
            <li><Link href="/projects" className="hover:text-white hover:underline">Projects</Link></li>
            <li><Link href="/societies" className="hover:text-white hover:underline">Societies Guide</Link></li>
            <li><Link href="/tools" className="hover:text-white hover:underline">Ask Anngan</Link></li>
            <li><a href="https://anngan.com/" target="_blank" rel="noopener" className="hover:text-white hover:underline">anngan.com</a></li>
          </ul>
        </div>
        <div>
          <p className="font-bold text-white text-base">Get Connected</p>
          <ul className="mt-3 space-y-1.5">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener" className="hover:text-white hover:underline">{s.label}</a>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            <Link href="/services" className="hover:text-white hover:underline">Angan Tech services</Link>
          </p>
          <ul className="mt-2 space-y-1.5">
            {SERVICES.slice(0, 4).map((s) => (
              <li key={s.id}>
                <Link href={`/services/${s.id}`} className="hover:text-white hover:underline">{s.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-[#003257] text-blue-100 text-xs text-center py-3 px-4">
        Copyright &copy; ANNGAN TECHNOLOGIES PVT. LTD. All rights reserved.
      </div>
    </footer>
  );
}
