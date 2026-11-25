"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/auth-context";
import { PROJECTS, SERVICES } from "../lib/seed";

// NAV-01 / NAV-02 / NAV-03 (24 Nov 2026): PROJECTS and ANNGAN
// COMPANIES are dropdowns matching the original anngan.com structure,
// AGENCIES links to the home partner strip. Flat items stay as they were.
type NavSub = { href: string; label: string };
type NavGroup = { href: string; label: string; children?: NavSub[] };
type NavItem = { href: string; label: string; dropdown?: NavGroup[] };
const NAV_LINKS: NavItem[] = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT US" },
  {
    href: "/projects",
    label: "PROJECTS",
    dropdown: [
      {
        href: "/projects/proj-1",
        label: "MGH Pakistan, Mangla",
        children: [
          { href: "/projects/proj-1#zamindar-file", label: "Zamindar File" },
          { href: "/projects/proj-1#affidavit-mgh", label: "Affidavit MGH" },
          { href: "/projects/proj-1#serene-farm-houses", label: "Serene Farm Houses" },
        ],
      },
      { href: "/projects/proj-3", label: "Al Ghani, Phase 7 Lahore" },
      {
        href: "/projects",
        label: "Lahore Projects",
        children: [
          { href: "/projects/proj-2", label: "Global Homes, Lahore" },
          { href: "/projects/proj-4", label: "Urban City, Lahore" },
          { href: "/projects/proj-5", label: "China Town, Lahore" },
        ],
      },
      { href: "/projects/proj-6", label: "Pak China Grain Market, Multan (Coming Soon)" },
      { href: "/projects/proj-7", label: "Kashmir Modern City (Sold Out)" },
      { href: "/properties?type=Commercial", label: "Commercial" },
    ],
  },
  { href: "/properties", label: "PROPERTIES" },
  { href: "/societies", label: "SOCIETIES GUIDE" },
  // NAV-03: AGENCIES, as on the original anngan.com. The home partner
  // strip carries id="partner-agencies", so this anchor lands on it.
  // BLOGS stays out of the navbar: no full-text articles exist yet.
  { href: "/#partner-agencies", label: "AGENCIES" },
  // PHN-04: TOOLS in the top red navbar, so a dealer can be guided
  // to the calculators over the phone. No Tools strip on home.
  { href: "/tools", label: "TOOLS" },
  { href: "/contact", label: "CONTACT" },
  {
    href: "/companies",
    label: "ANNGAN COMPANIES",
    dropdown: [
      { href: "/services", label: "Anngan Technologies" },
      // NAV-02: the /companies cards carry these ids, verified below.
      { href: "/companies#construction", label: "Anngan Construction" },
      { href: "/companies#marketing", label: "Corporate Angle Marketing" },
    ],
  },
  // PARITY 24 Nov 2026, Section 3: ANGAN TECH is NOT a separate
  // top-level item any more. It is already inside the ANNGAN
  // COMPANIES dropdown as Anngan Technologies, just like on
  // anngan.com, and 12 nav items pushed OFFICE LOGIN past the right
  // viewport edge. The footer still links Angan Tech.
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
  // NAV-01/02: which desktop dropdown is open, and which nested
  // sub-menu inside it. Mobile drawer accordions use the same labels.
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);
  // FIRST-CLICK FIX 25 Nov 2026 (live fail, HEAD 57ecf38): the old
  // code opened a dropdown on hover and TOGGLED it on chevron click.
  // A real click always moves the mouse onto the button first, so
  // hover had already opened it and the first click CLOSED it; only
  // the second click opened it. Same for nested sub-menus. So the
  // open state now remembers HOW it was opened: "hover" opens are
  // transient (mouseleave closes after 180ms) and a click on the
  // chevron PINs it open instead of toggling it shut. A pinned
  // dropdown only closes on a second chevron click, Escape, or
  // picking a link. Hovering another top-level item still switches.
  const [openVia, setOpenVia] = useState<"hover" | "click" | null>(null);
  const [subVia, setSubVia] = useState<"hover" | "click" | null>(null);
  const [mobileDrop, setMobileDrop] = useState<string | null>(null);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  // NAV ANIMATION 2026-11-25: hover intent. Moving the mouse away
  // does not close a dropdown at once; it waits 180ms, so crossing
  // the small gap to the panel, or brushing past a neighbouring item,
  // never flickers it shut. Entering again cancels the close.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function openDropdown(label: string, via: "hover" | "click" = "hover") {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setOpenDrop(label);
    setOpenVia(via);
    setOpenSub(null);
    setSubVia(null);
  }
  function closeDropdowns() {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setOpenDrop(null);
    setOpenSub(null);
    setOpenVia(null);
    setSubVia(null);
  }
  function scheduleCloseDropdown() {
    // A click-pinned dropdown never auto-closes on mouseleave; only
    // a hover-opened one does, after 180ms.
    if (openVia === "click") return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => { closeDropdowns(); }, 180);
  }
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
      : "text-white hover:bg-white/15 nav-underline");
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
          <span className="hidden md:inline">57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore, Pakistan</span>
          {/* HDR-01: the 5 compact social icons from the footer, in the
              top bar like anngan.com. 18px, md and up only, so the
              mobile top bar stays Call + Email. */}
          <span className="ml-auto hidden md:flex items-center gap-2">
            {SOCIAL_LINKS.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener" aria-label={`Anngan on ${s.label}, @annganpk`} className="inline-flex items-center">
                <SocialIcon label={s.label} size={18} />
              </a>
            ))}
          </span>
        </div>
      </div>
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-1.5 sm:gap-3">
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
              <span className="sm:hidden">Call</span>
              <span className="hidden sm:inline">Call +92 304 1111 698</span>
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
          {/* PARITY 24 Nov 2026, Section 3: nav tightened (text-xs
              tracking-tight px-2 links, slim py-1.5 CREATE A LISTING)
              so all 11 items plus OFFICE LOGIN fit inside the red bar
              with breathing room, no horizontal scrollbar. */}
          <div className="hidden xl:flex items-center gap-1 text-xs tracking-tight font-bold whitespace-nowrap max-w-6xl mx-auto px-4 py-1">
            {NAV_LINKS.map((l) =>
              l.dropdown ? (
                // NAV-01/02 desktop dropdown: hover opens it, the label
                // is still a plain link to /projects or /companies, the
                // chevron button toggles it on click, Escape closes it.
                <div
                  key={l.href + l.label}
                  className="relative shrink-0"
                  onMouseEnter={() => { if (openDrop !== l.label) openDropdown(l.label, "hover"); }}
                  onMouseLeave={() => scheduleCloseDropdown()}
                  onKeyDown={(e) => { if (e.key === "Escape") { closeDropdowns(); } }}
                >
                  <span className={"inline-flex items-center " + (isActive(l.href) ? "bg-white text-navy font-extrabold rounded" : "")}>
                    <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className={navCls(l.href)} onFocus={() => { if (openDrop !== l.label) openDropdown(l.label, "hover"); }}>
                      {l.label}
                    </Link>
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={openDrop === l.label}
                      aria-label={`${l.label} menu`}
                      onClick={() => { if (openDrop === l.label && openVia === "click") { closeDropdowns(); } else { openDropdown(l.label, "click"); } }}
                      onFocus={() => { if (openDrop !== l.label) openDropdown(l.label, "hover"); }}
                      className={"inline-flex items-center min-h-[40px] px-1 rounded transition-transform duration-200 " + (openDrop === l.label ? "rotate-180 " : "") + (isActive(l.href) ? "text-navy" : "text-white hover:bg-white/15")}
                    >
                      {"\u25BC"}
                    </button>
                  </span>
                  {/* Dropdown panel stays mounted and fades + slides
                      in and out (opacity, translate, visibility with a
                      200ms transition), so opening and closing are
                      both smooth instead of appearing and vanishing. */}
                  <div
                    className={"absolute left-0 top-full z-50 w-80 bg-white text-navy shadow-lg rounded-b-lg border border-gray-200 py-1 normal-case transition-all duration-200 ease-out " + (openDrop === l.label ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible pointer-events-none")}
                    role="menu"
                    aria-hidden={openDrop === l.label ? undefined : true}
                  >
                      {l.dropdown.map((g) =>
                        g.children ? (
                          <div key={g.href + g.label} className="relative border-b border-gray-100 last:border-b-0" onMouseEnter={() => { if (openSub !== g.label) { setOpenSub(g.label); setSubVia("hover"); } }}>
                            <div className="flex items-stretch">
                              <Link href={g.href} onClick={() => closeDropdowns()} className="flex-1 px-4 py-2.5 min-h-[44px] inline-flex items-center font-bold hover:bg-blue-50">
                                {g.label}
                              </Link>
                              <button
                                type="button"
                                aria-expanded={openSub === g.label}
                                aria-label={`${g.label} sub-menu`}
                                onClick={() => { if (openSub === g.label && subVia === "click") { setOpenSub(null); setSubVia(null); } else { setOpenSub(g.label); setSubVia("click"); } }}
                                className="px-3 min-w-[44px] inline-flex items-center justify-center hover:bg-blue-50"
                              >
                                {openSub === g.label ? "\u25BE" : "\u25B8"}
                              </button>
                            </div>
                            <div
                              className={"absolute left-full top-0 z-50 w-64 bg-white text-navy shadow-lg rounded-lg border border-gray-200 py-1 ml-0.5 transition-all duration-200 ease-out " + (openSub === g.label ? "opacity-100 translate-x-0 visible" : "opacity-0 -translate-x-2 invisible pointer-events-none")}
                              aria-hidden={openSub === g.label ? undefined : true}
                            >
                                {g.children.map((c) => (
                                  <Link key={c.href} href={c.href} onClick={() => closeDropdowns()} className="block px-4 py-2.5 min-h-[44px] hover:bg-blue-50">
                                    {c.label}
                                  </Link>
                                ))}
                            </div>
                          </div>
                        ) : (
                          <Link key={g.href + g.label} href={g.href} onClick={() => closeDropdowns()} onMouseEnter={() => { setOpenSub(null); setSubVia(null); }} className="block px-4 py-2.5 min-h-[44px] hover:bg-blue-50 border-b border-gray-100 last:border-b-0">
                            {g.label}
                          </Link>
                        ),
                      )}
                  </div>
                </div>
              ) : (
                <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className={navCls(l.href)}>
                  {l.label}
                </Link>
              ),
            )}
            {/* PARITY 24 Nov 2026, Section 3: slim py-1.5, min-h 36px.
                NOT the .btn class: .btn forces padding 0.75rem and
                min-height 48px, which overrode py-1.5, so the button
                stayed 12px tall in padding and stuck out of the bar. */}
            <Link href="/create-listing" aria-current={isActive("/create-listing") ? "page" : undefined} className={"inline-flex items-center justify-center gap-2 rounded-lg font-bold text-sm text-white bg-[#2F96CD] hover:bg-[#005F90] px-3 py-1.5 min-h-[36px] shrink-0 shadow " + (isActive("/create-listing") ? "ring-2 ring-white" : "")}>
              CREATE A LISTING
            </Link>
            {user ? (
              <>
                {/* FIX-02: DASHBOARD is a clean white text link, not a second
                    block. CREATE A LISTING above stays the single blue CTA
                    button, so the two never compete. On the
                    dashboard it reads as active with bold + underline. */}
                <Link
                  href="/admin"
                  aria-current={isActive("/admin/login") ? "page" : undefined}
                  className={
                    "shrink-0 inline-flex items-center min-h-[40px] px-2 rounded text-white hover:bg-white/15 " +
                    (isActive("/admin/login") ? "font-extrabold underline underline-offset-4" : "nav-underline")
                  }
                >
                  DASHBOARD
                </Link>
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
          <div className="absolute inset-0 bg-black/50 overlay-fade" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-lg overflow-y-auto drawer-panel">
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
              {NAV_LINKS.map((l) =>
                l.dropdown ? (
                  // NAV-01/02 mobile accordion: tap the label to go to the
                  // section, tap the chevron to open its sub-items.
                  <div key={l.href + l.label} className="border-b border-gray-100">
                    <div className="flex items-stretch">
                      <Link
                        href={l.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={isActive(l.href) ? "page" : undefined}
                        className={"flex-1 py-3 min-h-[48px] flex items-center " + (isActive(l.href) ? "text-navy font-extrabold bg-blue-50 border-l-4 border-l-anngan pl-3" : "text-navy hover:text-anngan-dark")}
                      >
                        {l.label}
                      </Link>
                      <button
                        type="button"
                        aria-expanded={mobileDrop === l.label}
                        aria-label={`${l.label} menu`}
                        onClick={() => { setMobileDrop(mobileDrop === l.label ? null : l.label); setMobileSub(null); }}
                        className="px-3 min-w-[48px] min-h-[48px] inline-flex items-center justify-center text-navy transition-transform duration-200"
                      >
                        <span className={"inline-block transition-transform duration-200 " + (mobileDrop === l.label ? "rotate-90" : "")}>{"\u25B8"}</span>
                      </button>
                    </div>
                    {/* Mobile accordion animates open and closed
                        (max-height transition), it is not removed and
                        re-added, so it slides instead of popping. */}
                    <div className={"overflow-hidden transition-[max-height] duration-300 ease-out " + (mobileDrop === l.label ? "max-h-[600px]" : "max-h-0")}>
                      <div className="pb-2 pl-4 border-l-4 border-l-anngan ml-1">
                        {l.dropdown.map((g) =>
                          g.children ? (
                            <div key={g.href + g.label}>
                              <div className="flex items-stretch">
                                <Link href={g.href} onClick={() => setMenuOpen(false)} className="flex-1 py-2.5 min-h-[44px] flex items-center text-navy font-bold">
                                  {g.label}
                                </Link>
                                <button
                                  type="button"
                                  aria-expanded={mobileSub === g.label}
                                  aria-label={`${g.label} sub-menu`}
                                  onClick={() => setMobileSub(mobileSub === g.label ? null : g.label)}
                                  className="px-3 min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-navy"
                                >
                                  <span className={"inline-block transition-transform duration-200 " + (mobileSub === g.label ? "rotate-90" : "")}>{"\u25B8"}</span>
                                </button>
                              </div>
                              <div className={"overflow-hidden transition-[max-height] duration-300 ease-out " + (mobileSub === g.label ? "max-h-[300px]" : "max-h-0")}>
                                <div className="pl-4 pb-1">
                                  {g.children.map((c) => (
                                    <Link key={c.href} href={c.href} onClick={() => setMenuOpen(false)} className="block py-2.5 min-h-[44px] text-navy">
                                      {c.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <Link key={g.href + g.label} href={g.href} onClick={() => setMenuOpen(false)} className="block py-2.5 min-h-[44px] text-navy">
                              {g.label}
                            </Link>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={drawerCls(l.href)}
                  >
                    {l.label} &rsaquo;
                  </Link>
                ),
              )}
              <Link
                href="/create-listing"
                onClick={() => setMenuOpen(false)}
                className="btn bg-[#2F96CD] hover:bg-[#005F90] text-white mt-2 text-center"
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
              <a href="tel:+923041111698" className="btn btn-navy w-full text-center">
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

// One 24px brand icon per social link, same size and shape for all five,
// so no link is text-only while another has an icon.
function SocialIcon({ label, size = 24 }: { label: string; size?: number }) {
  const box = "shrink-0";
  if (label === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className={box}><rect width="24" height="24" rx="5" fill="#1877F2" /><path d="M13.8 21v-6.9h2.3l.4-2.7h-2.7V9.6c0-.8.3-1.3 1.4-1.3h1.4V5.9c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5v2.1H8.9v2.7h2.3V21h2.6z" fill="#fff" /></svg>
    );
  }
  if (label === "X") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className={box}><rect width="24" height="24" rx="5" fill="#000" /><path d="M6 5.5 13.4 15l-7 3.5h2.6l5.2-2.6 4.1 2.6H20l-7.8-10 6.6-3H16l-4.9 2.4L7.4 5.5H6z" fill="#fff" transform="scale(0.92) translate(1,1)" /></svg>
    );
  }
  if (label === "LinkedIn") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className={box}><rect width="24" height="24" rx="5" fill="#0A66C2" /><rect x="6" y="10" width="2.6" height="8" fill="#fff" /><circle cx="7.3" cy="7.3" r="1.5" fill="#fff" /><path d="M11 18v-4.4c0-1.5.8-2.4 2.1-2.4 1.2 0 1.9.8 1.9 2.4V18h2.6v-4.8c0-2.8-1.5-4.2-3.9-4.2-1.5 0-2.5.7-3.1 1.7V10H11v8z" fill="#fff" transform="translate(-1.4,0)" /></svg>
    );
  }
  if (label === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className={box}><rect width="24" height="24" rx="5" fill="#C13584" /><rect x="5.5" y="5.5" width="13" height="13" rx="4" fill="none" stroke="#fff" strokeWidth="1.8" /><circle cx="12" cy="12" r="3.2" fill="none" stroke="#fff" strokeWidth="1.8" /><circle cx="16" cy="8" r="1.2" fill="#fff" /></svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className={box}><rect width="24" height="24" rx="5" fill="#FF0000" /><path d="M10 8.5v7l6-3.5-6-3.5z" fill="#fff" /></svg>
  );
}

export function Footer() {
  // FIX-03: inside /admin the full public footer is a tall blue block
  // under a plain dashboard, so the office area gets a compact footer:
  // copyright strip only, no link columns.
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return (
      <footer className="bg-navy text-white mt-0 border-t-4 border-anngan">
        <div className="bg-[#00263E] text-white text-sm text-center py-3 px-4">
          Copyright &copy; ANNGAN TECHNOLOGIES PVT. LTD. All rights reserved.
        </div>
      </footer>
    );
  }
  return (
    <footer className="bg-navy text-white mt-0 border-t-4 border-anngan">
      {/* Footer compact fix: the old footer stacked Get Connected (5 links)
          AND Angan Tech services (9 links) in one narrow column, so that
          column was 585px tall while Company was only 238px, leaving
          ~350px of empty blue under the other columns and a 713px footer.
          Now row 1 holds 5 balanced columns (brand, Company, Projects,
          Connect, Get Connected, all ~240-320px) and Angan Tech services
          sit in a full-width strip below, so no column is twice as tall
          as the others and the footer is clearly under 500px at 1280. */}
      <div className="max-w-6xl mx-auto px-4 py-5 text-sm">
        <div className="grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4">
            <span className="inline-block bg-white rounded-lg px-3 py-1.5 shadow">
              <Image src="/img/logo.png" alt="anngan.com logo, banay khawab haqiqat" width={1200} height={231} className="w-[230px] max-w-full h-auto" />
            </span>
            <p className="urdu-tagline urdu-tagline-light mt-2" lang="ur">بنائے خواب حقیقت</p>
            <p className="mt-2 leading-relaxed">
              Pakistan's trusted real estate service provider. Projects and property in Karachi, Islamabad, Lahore and Peshawar.
            </p>
            <p className="mt-2 leading-relaxed">
              57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore<br />
              <a href="tel:+923041111698" className="inline-flex items-center min-h-[32px] font-semibold hover:underline">+92 304 1111 698</a><br />
              <a href="mailto:info@anngan.com" className="inline-flex items-center min-h-[32px] hover:underline">info@anngan.com</a>
            </p>
          </div>
          <div className="lg:col-span-2">
            <p className="font-bold text-white text-base">Company</p>
            <span className="block w-8 h-0.5 bg-[#DDB78B] mt-1.5" />
            <ul className="mt-2 space-y-1.5">
              <li><Link href="/about" className="inline-flex items-center min-h-[32px] hover:underline">About Us</Link></li>
              <li><Link href="/contact" className="inline-flex items-center min-h-[32px] hover:underline">Contact Us</Link></li>
              <li><Link href="/companies" className="inline-flex items-center min-h-[32px] hover:underline">Anngan Companies</Link></li>
              <li><Link href="/services" className="inline-flex items-center min-h-[32px] hover:underline">Angan Tech</Link></li>
              <li><Link href="/create-listing" className="inline-flex items-center min-h-[32px] hover:underline">Create a Listing</Link></li>
              {/* PAR-02: legal links, as on the old anngan.com. The
                  secondary phone +92 320 5966 664 is NOT added: the
                  audit said to confirm it with the client first. */}
              <li><Link href="/privacy" className="inline-flex items-center min-h-[32px] hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="inline-flex items-center min-h-[32px] hover:underline">Terms and Conditions</Link></li>
              <li><Link href="/disclaimer" className="inline-flex items-center min-h-[32px] hover:underline">Disclaimer</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <p className="font-bold text-white text-base">Projects</p>
            <span className="block w-8 h-0.5 bg-[#DDB78B] mt-1.5" />
            <ul className="mt-2 space-y-1.5">
              {PROJECTS.map((p) => (
                <li key={p.id}>
                  <Link href={`/projects/${p.id}`} className="inline-flex items-center min-h-[32px] hover:underline">{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <p className="font-bold text-white text-base">Connect</p>
            <span className="block w-8 h-0.5 bg-[#DDB78B] mt-1.5" />
            <ul className="mt-2 space-y-1.5">
                            <li><Link href="/properties" className="inline-flex items-center min-h-[32px] hover:underline">Properties</Link></li>
              <li><Link href="/projects" className="inline-flex items-center min-h-[32px] hover:underline">Projects</Link></li>
              <li><Link href="/societies" className="inline-flex items-center min-h-[32px] hover:underline">Societies Guide</Link></li>
              <li><Link href="/tools" className="inline-flex items-center min-h-[32px] hover:underline">Property Tools</Link></li>
              <li><Link href="/" className="inline-flex items-center min-h-[32px] hover:underline">anngan.com</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <p className="font-bold text-white text-base">Get Connected</p>
            <span className="block w-8 h-0.5 bg-[#DDB78B] mt-1.5" />
            <ul className="mt-2 flex flex-col gap-1.5">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener" aria-label={`Anngan on ${s.label}, @annganpk`} className="inline-flex items-center gap-2 min-h-[32px] hover:underline">
                    <SocialIcon label={s.label} />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Angan Tech services: full-width strip, not a stacked column.
            Heading sits inline with the links (one flex row) so the strip
            costs two link rows, not a heading row plus two link rows. */}
        <div className="mt-4 pt-3 border-t border-white/15">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <li><span className="font-bold text-white text-base inline-flex items-center min-h-[28px]">Angan Tech services:</span></li>
            {SERVICES.map((s) => (
              <li key={s.id}>
                <Link href={`/services/${s.id}`} className="inline-flex items-center min-h-[28px] hover:underline">{s.name}</Link>
              </li>
            ))}
            <li><Link href="/services" className="inline-flex items-center min-h-[28px] font-semibold hover:underline">View all 9 services &rarr;</Link></li>
          </ul>
        </div>
      </div>
      <div className="bg-[#00263E] text-white text-sm text-center py-3 px-4">
        Copyright &copy; ANNGAN TECHNOLOGIES PVT. LTD. All rights reserved.
      </div>
    </footer>
  );
}
