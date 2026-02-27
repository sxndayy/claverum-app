import { Metadata } from 'next';
import BlogSchimmelBauschadenClient from '@/components/pages/BlogSchimmelBauschadenClient';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: "Schimmel im Gebäude: Ursachen, Folgen & professionelle Schadensanalyse",
  description: "Schimmel im Haus? Ursachen, Risiken, Pflichten von Mietern und Vermietern – plus professionelle Analyse & Sanierungsempfehlungen. Jetzt informieren!",
  alternates: {
    canonical: `${SITE_URL}/blog/schimmel-bauschaden/`,
  },
  openGraph: {
    type: 'article',
    title: "Schimmel im Gebäude: Ursachen, Folgen & professionelle Schadensanalyse",
    description: "Schimmel im Haus? Ursachen, Risiken, Pflichten von Mietern und Vermietern – plus professionelle Analyse & Sanierungsempfehlungen. Jetzt informieren!",
    url: `${SITE_URL}/blog/schimmel-bauschaden/`,
    images: [
      {
        url: `${SITE_URL}/schimmel.png`,
        width: 1200,
        height: 675,
        alt: "Schimmel im Gebäude – Professionelle Schadensanalyse",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Schimmel im Gebäude: Ursachen, Folgen & professionelle Schadensanalyse",
    description: "Schimmel im Haus? Ursachen, Risiken, Pflichten von Mietern und Vermietern – plus professionelle Analyse & Sanierungsempfehlungen.",
    images: [`${SITE_URL}/schimmel.png`],
  },
  robots: 'index, follow',
  keywords: [
    'Schimmel Bauschaden',
    'Schimmel im Gebäude',
    'Schimmel Ursachen',
    'Schimmel Analyse',
    'Baufeuchte Schimmel',
    'Schimmel Gutachter',
    'schimmel gutachten kosten',
    'schimmel wohnung mietminderung',
    'schimmel sachverständiger finden',
    'schwarzer schimmel gesundheit',
    'schimmel wand ursache',
    'schimmelgutachten für gericht',
    'versteckter schimmel hauskauf'
  ],
};

export default function BlogSchimmelBauschadenPage() {
  return <BlogSchimmelBauschadenClient />;
}

