"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../lib/auth-context";
import { PROJECTS, SERVICES } from "../lib/seed";

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
            <Image
              src="/img/logo.png"
              alt="anngan.com, banay khawab haqiqat"
              width={1200}
              height={231}
              priority
              className="h-10 sm:h-[54px] w-auto max-w-[170px] sm:max-w-[280px] object-contain"
            />
          </Link>
          <div className="flex gap-2 ml-auto shrink-0">
            <a
              href="tel:+923041111698"
              className="btn btn-navy text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap"
              aria-label="Call Anngan on +92 304 1111 698"
            >
              Call<span className="hidden sm:inline">&nbsp;+92 304 1111 698</span>
            </a>
            <a
              href="https://wa.me/923041111698"
              target="_blank"
              rel="noopener"
              className="btn btn-green text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap"
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
            className="lg:hidden font-bold pr-2 text-sm tracking-wide min-h-[48px] inline-flex items-center"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            MENU &#9776;
          </button>
          <div className="hidden lg:flex items-center gap-4 text-xs font-bold whitespace-nowrap overflow-x-auto max-w-7xl mx-auto px-4">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:underline shrink-0 inline-flex items-center min-h-[48px] px-1">
                {l.label}
              </Link>
            ))}
            <Link href="/create-listing" className="btn btn-sky px-3 shrink-0">
              CREATE A LISTING
            </Link>
            {user ? (
              <>
                <Link href="/admin" className="hover:underline shrink-0 inline-flex items-center min-h-[48px] px-1">DASHBOARD</Link>
                <button onClick={() => signOut()} className="hover:underline shrink-0 inline-flex items-center min-h-[48px] px-1">SIGN OUT</button>
              </>
            ) : (
              <Link href="/admin/login" className="hover:underline shrink-0 inline-flex items-center min-h-[48px] px-1">OFFICE LOGIN</Link>
            )}
          </div>
        </div>
      </nav>
      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-label="Site menu">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-lg overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <Image src="/img/logo.png" alt="anngan.com logo, banay khawab haqiqat" width={1200} height={231} className="h-9 w-auto" />
              <button
                onClick={() => setMenuOpen(false)}
                className="text-navy font-bold px-3 py-2 min-h-[48px] min-w-[48px] inline-flex items-center justify-center"
                aria-label="Close menu"
              >
                &#10005;
              </button>
            </div>
            <nav className="px-4 py-3 flex flex-col gap-1 text-sm font-bold" aria-label="Menu links">
              <p className="text-xs text-gray-600 font-bold tracking-wide pt-1">Anngan</p>
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-navy py-3 min-h-[48px] flex items-center border-b border-gray-100 hover:text-anngan-dark"
                >
                  {l.label} &rsaquo;
                </Link>
              ))}
              <p className="text-xs text-gray-600 font-bold tracking-wide pt-3">Companies</p>
              <Link href="/companies" onClick={() => setMenuOpen(false)} className="text-navy py-3 min-h-[48px] flex items-center border-b border-gray-100">
                Anngan Companies &rsaquo;
              </Link>
              <Link href="/services" onClick={() => setMenuOpen(false)} className="text-navy py-3 min-h-[48px] flex items-center border-b border-gray-100">
                Angan Tech &rsaquo;
              </Link>
              <Link href="/services/service-7" onClick={() => setMenuOpen(false)} className="text-navy py-3 min-h-[48px] flex items-center border-b border-gray-100">
                Angan Tech CRM &rsaquo;
              </Link>
              <Link
                href="/create-listing"
                onClick={() => setMenuOpen(false)}
                className="btn btn-sky mt-2 text-center"
              >
                CREATE A LISTING
              </Link>
              {user ? (
                <>
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-anngan-dark py-3 min-h-[48px] flex items-center border-b border-gray-100">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="text-gray-600 py-3 min-h-[48px] flex items-center text-left"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link href="/admin/login" onClick={() => setMenuOpen(false)} className="text-navy py-3 min-h-[48px] flex items-center hover:text-anngan-dark">
                  Office login
                </Link>
              )}
            </nav>
            <div className="px-4 pb-4 flex gap-2">
              <a href="tel:+923041111698" className="btn btn-red flex-1 text-center">
                Call +92 304 1111 698
              </a>
              <a
                href="https://wa.me/923041111698"
                target="_blank"
                rel="noopener"
                className="btn btn-green flex-1 text-center"
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
    <footer className="bg-navy text-white mt-0 border-t-4 border-anngan">
      <div className="max-w-6xl mx-auto px-4 grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 py-12 text-sm">
        <div className="lg:col-span-4">
          <span className="inline-block bg-white rounded-lg px-3 py-2 shadow">
            <Image src="/img/logo.png" alt="anngan.com logo, banay khawab haqiqat" width={1200} height={231} className="w-[230px] max-w-full h-auto" />
          </span>
          <p className="mt-4 leading-relaxed">
            Pakistan's trusted real estate service provider. Projects and property in Karachi, Islamabad, Lahore and Peshawar.
          </p>
          <p className="mt-4 leading-relaxed">
            57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore<br />
            <a href="tel:+923041111698" className="inline-flex items-center min-h-[48px] font-semibold hover:underline">+92 304 1111 698</a><br />
            <a href="mailto:info@anngan.com" className="inline-flex items-center min-h-[48px] hover:underline">info@anngan.com</a>
          </p>
        </div>
        <div className="lg:col-span-2">
          <p className="font-bold text-white text-base">Company</p>
          <span className="block w-8 h-0.5 bg-[#DDB78B] mt-2" />
          <ul className="mt-4 space-y-1">
            <li><Link href="/about" className="inline-flex items-center min-h-[48px] hover:underline">About Us</Link></li>
            <li><Link href="/contact" className="inline-flex items-center min-h-[48px] hover:underline">Contact Us</Link></li>
            <li><Link href="/companies" className="inline-flex items-center min-h-[48px] hover:underline">Anngan Companies</Link></li>
            <li><Link href="/services" className="inline-flex items-center min-h-[48px] hover:underline">Angan Tech</Link></li>
            <li><Link href="/create-listing" className="inline-flex items-center min-h-[48px] hover:underline">Create a Listing</Link></li>
          </ul>
        </div>
        <div className="lg:col-span-2">
          <p className="font-bold text-white text-base">Projects</p>
          <span className="block w-8 h-0.5 bg-[#DDB78B] mt-2" />
          <ul className="mt-4 space-y-1">
            {PROJECTS.map((p) => (
              <li key={p.id}>
                <Link href={`/projects/${p.id}`} className="inline-flex items-center min-h-[48px] hover:underline">{p.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <p className="font-bold text-white text-base">Connect</p>
          <span className="block w-8 h-0.5 bg-[#DDB78B] mt-2" />
          <ul className="mt-4 space-y-1">
            <li><Link href="/blogs" className="inline-flex items-center min-h-[48px] hover:underline">Blogs</Link></li>
            <li><Link href="/properties" className="inline-flex items-center min-h-[48px] hover:underline">Properties</Link></li>
            <li><Link href="/projects" className="inline-flex items-center min-h-[48px] hover:underline">Projects</Link></li>
            <li><Link href="/societies" className="inline-flex items-center min-h-[48px] hover:underline">Societies Guide</Link></li>
            <li><Link href="/tools" className="inline-flex items-center min-h-[48px] hover:underline">Ask Anngan</Link></li>
            <li><a href="https://anngan.com/" target="_blank" rel="noopener" className="inline-flex items-center min-h-[48px] hover:underline">anngan.com</a></li>
          </ul>
        </div>
        <div className="lg:col-span-2">
          <p className="font-bold text-white text-base">Get Connected</p>
          <span className="block w-8 h-0.5 bg-[#DDB78B] mt-2" />
          <ul className="mt-4 space-y-1">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener" className="inline-flex items-center min-h-[48px] hover:underline">{s.label}</a>
              </li>
            ))}
          </ul>
          <p className="font-bold text-white text-base mt-6">Angan Tech services</p>
          <span className="block w-8 h-0.5 bg-[#DDB78B] mt-2" />
          <ul className="mt-4 space-y-1">
            {SERVICES.slice(0, 4).map((s) => (
              <li key={s.id}>
                <Link href={`/services/${s.id}`} className="inline-flex items-center min-h-[48px] hover:underline">{s.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-[#00263E] text-white text-sm text-center py-4 px-4">
        Copyright &copy; ANNGAN TECHNOLOGIES PVT. LTD. All rights reserved.
      </div>
    </footer>
  );
}
