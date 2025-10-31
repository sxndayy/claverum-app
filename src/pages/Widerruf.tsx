import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

const Widerruf = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-text-100 mb-8">
                Widerrufsbelehrung
              </h1>
              
              <div className="prose prose-lg max-w-none">
                <div className="space-y-6 text-text-200 leading-relaxed">
                  <div>
                    <h2 className="text-2xl font-semibold text-text-100 mb-4">Widerrufsrecht</h2>
                    <p>TODO: Hier eigentlichen Text einfügen</p>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold text-text-100 mb-4">Widerrufsfrist</h2>
                    <p>TODO: Hier eigentlichen Text einfügen</p>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold text-text-100 mb-4">Widerrufsfolgen</h2>
                    <p>TODO: Hier eigentlichen Text einfügen</p>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold text-text-100 mb-4">Ausschluss bzw. vorzeitiges Erlöschen des Widerrufsrechts</h2>
                    <p>TODO: Hier eigentlichen Text einfügen</p>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold text-text-100 mb-4">Widerrufsformular</h2>
                    <p>TODO: Hier eigentlichen Text einfügen</p>
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
  );
};

export default Widerruf;

