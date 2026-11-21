import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../lib/auth";
import { Header, Footer, FirebaseNotice } from "../components/Site";

export const metadata: Metadata = {
  title: "Anngan | Homes, Plots and Projects in Pakistan",
  description: "Real homes, projects and files in Lahore, Karachi, Rawalpindi, Multan and Islamabad. Office: Paragon City, Lahore. Call +92 304 1111 698.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <FirebaseNotice />
          <Header />
          <main className="max-w-6xl mx-auto px-4 py-6 min-h-[60vh]">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
