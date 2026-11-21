import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "../components/Site";
import { Providers } from "../components/Providers";

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
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="max-w-6xl mx-auto px-4 py-6 min-h-[60vh]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
