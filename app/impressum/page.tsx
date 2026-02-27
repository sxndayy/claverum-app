import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/layout/CookieBanner';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und rechtliche Angaben der Claverum GmbH. Kontaktinformationen, Registereintrag und Verantwortlichkeiten.",
  alternates: {
    canonical: `${SITE_URL}/impressum`,
  },
};

export default function ImpressumPage() {
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Impressum', url: '/impressum' }
        ]} 
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-text-100 mb-8">
                  Impressum
                </h1>
                
                <div className="prose prose-lg max-w-none">
                  <div className="space-y-6 text-text-200 leading-relaxed">
                    <div>
                      <h2 className="text-2xl font-semibold text-text-100 mb-4">Angaben gemäß § 5 TMG</h2>
                      <p className="mb-2">Claverum GmbH</p>
                      <p className="mb-2">Neusser Str. 257</p>
                      <p className="mb-4">50733 Köln</p>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-semibold text-text-100 mb-4">Kontakt</h2>
                      <p className="mb-2">Telefon: +49 322 21804909</p>
                      <p className="mb-4">E-Mail: kontakt@bauklar.org</p>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-semibold text-text-100 mb-4">Registereintrag</h2>
                      <p className="mb-4">
                        HRB 125271
                      </p>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-semibold text-text-100 mb-4">Umsatzsteuer-ID</h2>
                      <p className="mb-4">
                        Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz: 
                      </p>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-semibold text-text-100 mb-4">Verantwortlich für den Inhalt</h2>
                      <p className="mb-2">Claverum GmbH</p>
                      <p className="mb-2">Neusser Str. 257</p>
                      <p className="mb-4">50733 Köln</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </>
  );
}




