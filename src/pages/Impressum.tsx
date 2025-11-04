import React from 'react';
import { SEO } from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

const Impressum = () => {
  return (
    <>
      <SEO 
        title="Impressum" 
        description="Impressum und rechtliche Angaben der Claverum GmbH. Kontaktinformationen, Registereintrag und Verantwortlichkeiten."
        canonical="/impressum"
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
                    <p className="mb-2">Telefon: 015143170757</p>
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
};

export default Impressum;
