import type { Metadata } from "next";
import { Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "../components/Site";
import { Providers } from "../components/Providers";

// Urdu tagline font, self-hosted by Next.js (downloaded at build time,
// no Google Fonts request at runtime). Nastaliq is the premium Urdu
// script style, as on the original Anngan logo tagline.
const urduFont = Noto_Nastaliq_Urdu({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-urdu" });

export const metadata: Metadata = {
  title: "Anngan | Homes, Plots and Projects in Pakistan",
  description: "Real homes, projects and files in Lahore, Karachi, Rawalpindi, Multan and Islamabad. Office: Paragon City, Lahore. Call +92 304 1111 698.",
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={urduFont.variable}>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header />
          <main className="flex w-full flex-1 flex-col">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
