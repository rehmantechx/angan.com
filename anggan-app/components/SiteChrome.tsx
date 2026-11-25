// Site chrome: the public header and footer show on every public
// page, but never on the office area. /admin has its own dedicated
// App Shell (dark-navy sidebar + top bar) and /office-login is a
// standalone centered auth card, so the public navbar and footer
// would double the chrome and leak the public site into the office.
// No public link to /office-login is added anywhere: the office
// login stays hidden, only for CEO and SEO.
"use client";
import { usePathname } from "next/navigation";
import { Header, Footer } from "./Site";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const isOfficeArea =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/office-login" ||
    pathname.startsWith("/office-login/");
  if (isOfficeArea) {
    return <main className="flex w-full flex-1 flex-col">{children}</main>;
  }
  return (
    <>
      <Header />
      <main className="flex w-full flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
