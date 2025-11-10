import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/layout/CookieBanner';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: "Seite nicht gefunden - 404",
  description: "Die angeforderte Seite konnte nicht gefunden werden.",
  alternates: {
    canonical: `${SITE_URL}/404`,
  },
  robots: 'noindex, follow',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Oops! Seite nicht gefunden</p>
          <Link href="/" className="text-blue-500 hover:text-blue-700 underline">
            Zur Startseite
          </Link>
        </div>
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
