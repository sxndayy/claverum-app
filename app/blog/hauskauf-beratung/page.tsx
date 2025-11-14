import { Metadata } from 'next';
import BlogHauskaufBeratungClient from '@/components/pages/BlogHauskaufBeratungClient';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: "Hauskauf Beratung: Wann sie sinnvoll ist, Kosten und Leistungen",
  description: "Hauskauf Beratung schützt vor versteckten Mängeln. Erfahren Sie, wann ein Gutachter sinnvoll ist, was er kostet und wie Sie bis zu 40.000 € beim Immobilienkauf sparen.",
  alternates: {
    canonical: `${SITE_URL}/blog/hauskauf-beratung/`,
  },
  openGraph: {
    type: 'article',
    title: "Hauskauf Beratung: Wann sie sinnvoll ist, Kosten und Leistungen",
    description: "Hauskauf Beratung schützt vor versteckten Mängeln. Erfahren Sie, wann ein Gutachter sinnvoll ist, was er kostet und wie Sie bis zu 40.000 € beim Immobilienkauf sparen.",
    url: `${SITE_URL}/blog/hauskauf-beratung/`,
    images: [
      {
        url: `${SITE_URL}/Berlin 2.jpg`,
        width: 1200,
        height: 675,
        alt: "Hauskauf Beratung – Professionelle Immobilienbewertung",
      },
    ],
  },
  robots: 'index, follow',
};

export default function BlogHauskaufBeratungPage() {
  return <BlogHauskaufBeratungClient />;
}

