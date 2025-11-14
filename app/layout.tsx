import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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
        {/* Privacy-friendly analytics by Plausible */}
        <Script
          async
          src="https://plausible.io/js/pa-dxnaangqDBk53sRMher7b.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`
            window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
            plausible.init()
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}


