import { Metadata } from "next";
import KoelnBaugutachtenClient from './KoelnBaugutachtenClient';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: "Haus kaufen in Köln? Teure Mängel entdecken, bevor Sie unterschreiben",
  description: "Unabhängige digitale Bauschadensanalyse für Hauskauf in Köln. Nachkriegsbauten, rekonstruierte Gründerzeit, Rheinufer – verständlicher Bericht innerhalb von 48 Stunden. Jetzt starten.",
  alternates: {
    canonical: `${SITE_URL}/koeln-baugutachten/`,
  },
  openGraph: {
    type: "website",
    title: "Haus kaufen in Köln? Teure Mängel entdecken, bevor Sie unterschreiben",
    description: "Unabhängige digitale Bauschadensanalyse für Hauskauf in Köln. Verständlicher Bericht innerhalb von 48 Stunden – ohne Vor-Ort-Termin.",
    images: [
      {
        url: `${SITE_URL}/koeln.jpg`,
        width: 1600,
        height: 900,
        alt: "Köln Stadtansicht – Bauschadensanalyse für Hauskauf in Köln",
      },
    ],
    url: `${SITE_URL}/koeln-baugutachten/`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Haus kaufen in Köln? Teure Mängel entdecken, bevor Sie unterschreiben",
    description: "Unabhängige digitale Bauschadensanalyse für Hauskauf in Köln. Verständlicher Bericht innerhalb von 48 Stunden.",
    images: [`${SITE_URL}/koeln.jpg`],
  },
  robots: "index, follow",
  keywords: [
    "Köln Haus vor kauf prüfen lassen",
    "Köln wohnung vor kauf prüfen lassen",
    "Köln haus kaufen zustand einschätzen",
    "Köln risiko haus kauf einschätzen",
    "Köln altbau kauf was beachten",
    "Köln sanierungsstau haus erkennen",
    "Köln sanierungskosten haus einschätzen",
    "Köln altbau sanierung kosten abschätzen",
    "Köln energetischer zustand haus bewerten",
    "Köln heizung erneuern kosten haus altbau",
    "Köln dachsanierung kosten anhaltswerte",
    "Köln gutachter bilder einschicken",
    "Köln hausfotos bewertung online",
    "Köln immobilie online prüfen lassen",
    "Köln Hauskauf Gutachter",
    "Köln Bausachverständiger vor Kauf",
    "Köln Hauskauf Beratung",
    "Köln Bausubstanz überprüfen lassen",
    "Köln Bauzustandsanalyse Haus"
  ],
};

export default function KoelnBaugutachtenPage() {
  return <KoelnBaugutachtenClient />;
}


