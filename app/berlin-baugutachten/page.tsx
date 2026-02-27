import { Metadata } from "next";
import BerlinBaugutachtenClient from './BerlinBaugutachtenClient';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: "Haus kaufen in Berlin? Teure Mängel entdecken, bevor Sie unterschreiben",
  description: "Unabhängige digitale Bauschadensanalyse für Hauskauf in Berlin. Gründerzeit, Neubau, Eigentumswohnung – verständlicher Bericht innerhalb von 48 Stunden. Jetzt starten.",
  alternates: {
    canonical: `${SITE_URL}/berlin-baugutachten/`,
  },
  openGraph: {
    type: "website",
    title: "Haus kaufen in Berlin? Teure Mängel entdecken, bevor Sie unterschreiben",
    description: "Unabhängige digitale Bauschadensanalyse für Hauskauf in Berlin. Verständlicher Bericht innerhalb von 48 Stunden – ohne Vor-Ort-Termin.",
    images: [
      {
        url: `${SITE_URL}/berlin.jpg`,
        width: 1600,
        height: 900,
        alt: "Berlin Stadtansicht – Bauschadensanalyse für Hauskauf in Berlin",
      },
    ],
    url: `${SITE_URL}/berlin-baugutachten/`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Haus kaufen in Berlin? Teure Mängel entdecken, bevor Sie unterschreiben",
    description: "Unabhängige digitale Bauschadensanalyse für Hauskauf in Berlin. Verständlicher Bericht innerhalb von 48 Stunden.",
    images: [`${SITE_URL}/berlin.jpg`],
  },
  robots: "index, follow",
  keywords: [
    "haus vor kauf prüfen berlin",
    "bauschadensanalyse berlin",
    "baugutachten berlin",
    "hauskauf beratung berlin",
    "immobilie prüfen lassen berlin",
    "gutachter haus kaufen berlin",
    "digitale bauschadensanalyse berlin"
  ],
};

export default function BerlinBaugutachtenPage() {
  return <BerlinBaugutachtenClient />;
}
