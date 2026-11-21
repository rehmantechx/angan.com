"use client";
import Link from "next/link";
import { useAuth } from "../lib/auth";
import { isFirebaseConfigured } from "../lib/firebase";

export function FirebaseNotice() {
  if (isFirebaseConfigured()) return null;
  return (
    <div className="bg-amber-100 text-amber-900 text-sm px-4 py-2 text-center">
      Firebase is not connected. Showing saved site data. Fill in .env.local
      from the Firebase console to connect the live database.
    </div>
  );
}

export function Header() {
  const { user, signOut } = useAuth();
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
        <Link href="/" className="flex items-center gap-2">
          <img src="/img/logo.png" alt="Anngan" className="h-10 w-auto" />
        </Link>
        <nav className="flex gap-4 text-sm font-semibold flex-wrap ml-auto">
          <Link href="/" className="text-navy hover:text-anngan">Home</Link>
          <Link href="/properties" className="text-navy hover:text-anngan">Properties</Link>
          <Link href="/projects" className="text-navy hover:text-anngan">Projects</Link>
          <Link href="/blogs" className="text-navy hover:text-anngan">Blogs</Link>
          <Link href="/tools" className="text-navy hover:text-anngan">Tools</Link>
          <Link href="/create-listing" className="text-navy hover:text-anngan">List a property</Link>
          {user ? (
            <>
              <Link href="/admin" className="text-anngan">Dashboard</Link>
              <button onClick={() => signOut()} className="text-gray-500">Sign out</button>
            </>
          ) : (
            <Link href="/admin/login" className="text-navy hover:text-anngan">Office login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <p className="font-bold text-lg">Anngan</p>
          <p>Real homes, real projects, real prices. CEO Muhammad Mahmood Cheema.</p>
        </div>
        <div>
          <p className="font-bold">Office</p>
          <p>57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore</p>
          <p><a href="tel:+923041111698" className="underline">+92 304 1111 698</a></p>
          <p><a href="mailto:info@anngan.com" className="underline">info@anngan.com</a></p>
        </div>
        <div>
          <p className="font-bold">Pages</p>
          <p><Link href="/properties" className="underline">Properties</Link> | <Link href="/projects" className="underline">Projects</Link> | <Link href="/blogs" className="underline">Blogs</Link> | <Link href="/tools" className="underline">Tools</Link></p>
          <p><Link href="/admin/login" className="underline">Office login</Link></p>
        </div>
      </div>
    </footer>
  );
}
