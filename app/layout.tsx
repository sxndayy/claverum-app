import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Bauklar - Professionelle Bauschadensbewertung",
    template: "%s | Bauklar"
  },
  description: "Professionelle Bauschadensbewertung. Upload in Minuten, Ergebnis innerhalb von 48 Stunden. Schnell, transparent, verlässlich.",
  keywords: ["Bauschadensbewertung", "Bauberatung", "Hauskauf Beratung", "Baugutachten"],
  authors: [{ name: "Bauklar" }],
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://bauklar.org",
    siteName: "Bauklar",
    title: "Bauklar - Professionelle Bauschadensbewertung",
    description: "Professionelle Bauschadensbewertung. Upload in Minuten, Ergebnis innerhalb von 48 Stunden.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}




