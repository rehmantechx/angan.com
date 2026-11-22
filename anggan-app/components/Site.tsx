"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  // Active page: exact match, or a detail page under its section
  // (/projects/proj-1 is still Projects, /services/service-3 is Angan Tech,
  // anything under /admin is the office area).
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : href === "/admin/login"
        ? pathname === "/admin/login" || pathname === "/admin"
        : pathname === href || pathname.startsWith(href + "/");
  // Active page: the white pill sits INSIDE the red bar. The bar has
  // py-1 (see the nav row below), and the pill is 40px tall, so 4px of
  // red shows above and below it instead of the pill touching, or
  // sticking out past, the top and bottom of the bar.
  const navCls = (href: string) =>
    "shrink-0 inline-flex items-center min-h-[40px] px-2 rounded " +
    (isActive(href)
      ? "bg-white text-navy font-extrabold"
      : "text-white hover:bg-white/15");
  const drawerCls = (href: string) =>
    "py-3 min-h-[48px] flex items-center border-b border-gray-100 " +
    (isActive(href)
      ? "text-navy font-extrabold bg-blue-50 border-l-4 border-l-anngan pl-3"
      : "text-navy hover:text-anngan-dark");
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
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex items-center gap-1.5 sm:gap-3">
          <Link href="/" className="flex items-center shrink-0 min-w-0" aria-label="Anngan home">
            <Image
              src="/img/logo.png"
              alt="anngan.com, banay khawab haqiqat"
              width={1200}
              height={231}
              priority
              className="h-9 sm:h-[54px] w-auto max-w-[110px] min-[400px]:max-w-[140px] sm:max-w-[280px] object-contain"
            />
          </Link>
          <div className="flex gap-1.5 sm:gap-2 ml-auto shrink-0">
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
            className="xl:hidden font-bold pr-2 text-sm tracking-wide min-h-[48px] inline-flex items-center"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            MENU &#9776;
          </button>
          <div className="hidden xl:flex items-center gap-2 text-xs font-bold whitespace-nowrap max-w-7xl mx-auto px-4 py-1">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className={navCls(l.href)}>
                {l.label}
              </Link>
            ))}
            <Link href="/create-listing" aria-current={isActive("/create-listing") ? "page" : undefined} className={"btn btn-sky px-3 shrink-0 min-h-[40px] py-2 " + (isActive("/create-listing") ? "ring-2 ring-white" : "")}>
              CREATE A LISTING
            </Link>
            {user ? (
              <>
                <Link href="/admin" aria-current={isActive("/admin/login") ? "page" : undefined} className={navCls("/admin/login")}>DASHBOARD</Link>
                <button onClick={() => signOut()} className="hover:bg-white/15 shrink-0 inline-flex items-center min-h-[40px] px-2 rounded">SIGN OUT</button>
              </>
            ) : (
              <Link href="/admin/login" aria-current={isActive("/admin/login") ? "page" : undefined} className={navCls("/admin/login")}>OFFICE LOGIN</Link>
            )}
          </div>
        </div>
      </nav>
      {menuOpen ? (
        <div className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-label="Site menu">
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
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={drawerCls(l.href)}
                >
                  {l.label} &rsaquo;
                </Link>
              ))}
              <Link
                href="/create-listing"
                onClick={() => setMenuOpen(false)}
                className="btn btn-sky mt-2 text-center"
              >
                CREATE A LISTING
              </Link>
              {user ? (
                <>
                  <Link href="/admin" onClick={() => setMenuOpen(false)} aria-current={isActive("/admin/login") ? "page" : undefined} className={drawerCls("/admin/login")}>
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
                <Link href="/admin/login" onClick={() => setMenuOpen(false)} aria-current={isActive("/admin/login") ? "page" : undefined} className={drawerCls("/admin/login")}>
                  Office login
                </Link>
              )}
            </nav>
            <div className="px-4 pb-4 flex flex-col gap-2">
              <a href="tel:+923041111698" className="btn btn-red w-full text-center">
                Call +92 304 1111 698
              </a>
              <a
                href="https://wa.me/923041111698"
                target="_blank"
                rel="noopener"
                className="btn btn-green w-full text-center"
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
      <div className="max-w-6xl mx-auto px-4 grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6 py-10 text-sm">
        <div className="lg:col-span-4">
          <span className="inline-block bg-white rounded-lg px-3 py-2 shadow">
            <Image src="/img/logo.png" alt="anngan.com logo, banay khawab haqiqat" width={1200} height={231} className="w-[230px] max-w-full h-auto" />
          </span>
          <p className="urdu-tagline urdu-tagline-light mt-3" lang="ur">بنائے خواب حقیقت</p>
          <p className="mt-3 leading-relaxed">
            Pakistan's trusted real estate service provider. Projects and property in Karachi, Islamabad, Lahore and Peshawar.
          </p>
          <p className="mt-3 leading-relaxed">
            57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore<br />
            <a href="tel:+923041111698" className="inline-flex items-center min-h-[32px] font-semibold hover:underline">+92 304 1111 698</a><br />
            <a href="mailto:info@anngan.com" className="inline-flex items-center min-h-[32px] hover:underline">info@anngan.com</a>
          </p>
        </div>
        <div className="lg:col-span-2">
          <p className="font-bold text-white text-base">Company</p>
          <span className="block w-8 h-0.5 bg-[#DDB78B] mt-2" />
          <ul className="mt-3 space-y-2">
            <li><Link href="/about" className="inline-flex items-center min-h-[32px] hover:underline">About Us</Link></li>
            <li><Link href="/contact" className="inline-flex items-center min-h-[32px] hover:underline">Contact Us</Link></li>
            <li><Link href="/companies" className="inline-flex items-center min-h-[32px] hover:underline">Anngan Companies</Link></li>
            <li><Link href="/services" className="inline-flex items-center min-h-[32px] hover:underline">Angan Tech</Link></li>
            <li><Link href="/create-listing" className="inline-flex items-center min-h-[32px] hover:underline">Create a Listing</Link></li>
          </ul>
        </div>
        <div className="lg:col-span-2">
          <p className="font-bold text-white text-base">Projects</p>
          <span className="block w-8 h-0.5 bg-[#DDB78B] mt-2" />
          <ul className="mt-3 space-y-2">
            {PROJECTS.map((p) => (
              <li key={p.id}>
                <Link href={`/projects/${p.id}`} className="inline-flex items-center min-h-[32px] hover:underline">{p.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2">
          <p className="font-bold text-white text-base">Connect</p>
          <span className="block w-8 h-0.5 bg-[#DDB78B] mt-2" />
          <ul className="mt-3 space-y-2">
            <li><Link href="/blogs" className="inline-flex items-center min-h-[32px] hover:underline">Blogs</Link></li>
            <li><Link href="/properties" className="inline-flex items-center min-h-[32px] hover:underline">Properties</Link></li>
            <li><Link href="/projects" className="inline-flex items-center min-h-[32px] hover:underline">Projects</Link></li>
            <li><Link href="/societies" className="inline-flex items-center min-h-[32px] hover:underline">Societies Guide</Link></li>
            <li><Link href="/tools" className="inline-flex items-center min-h-[32px] hover:underline">Ask Anngan</Link></li>
            <li><a href="https://anngan.com/" target="_blank" rel="noopener" className="inline-flex items-center min-h-[32px] hover:underline">anngan.com</a></li>
          </ul>
        </div>
        <div className="lg:col-span-2">
          <p className="font-bold text-white text-base">Get Connected</p>
          <span className="block w-8 h-0.5 bg-[#DDB78B] mt-2" />
          <ul className="mt-3 grid grid-cols-2 gap-x-2 gap-y-2">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.href}>
                {s.label === "YouTube" ? (
                  <a href={s.href} target="_blank" rel="noopener" aria-label="Anngan on YouTube, @annganpk" className="inline-flex items-center gap-2 min-h-[32px] hover:underline">
                    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" className="shrink-0"><rect width="24" height="24" rx="5" fill="#FF0000" /><path d="M10 8.5v7l6-3.5-6-3.5z" fill="#fff" /></svg>
                    YouTube
                  </a>
                ) : (
                  <a href={s.href} target="_blank" rel="noopener" className="inline-flex items-center min-h-[32px] hover:underline">{s.label}</a>
                )}
              </li>
            ))}
          </ul>
          <p className="font-bold text-white text-base mt-5">Angan Tech services</p>
          <span className="block w-8 h-0.5 bg-[#DDB78B] mt-2" />
          <ul className="mt-3 grid grid-cols-2 gap-x-2 gap-y-2">
            {SERVICES.slice(0, 4).map((s) => (
              <li key={s.id}>
                <Link href={`/services/${s.id}`} className="inline-flex items-center min-h-[32px] hover:underline">{s.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-[#00263E] text-white text-sm text-center py-3 px-4">
        Copyright &copy; ANNGAN TECHNOLOGIES PVT. LTD. All rights reserved.
      </div>
    </footer>
  );
}
