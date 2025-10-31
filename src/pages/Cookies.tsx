import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-text-100 mb-8">
                Cookie-Richtlinie
              </h1>
              
              <div className="prose prose-lg max-w-none">
                <div className="space-y-6 text-text-200 leading-relaxed">
                  <div>
                    <h2 className="text-2xl font-semibold text-text-100 mb-4">Was sind Cookies?</h2>
                    <p>TODO: Hier eigentlichen Text einfügen</p>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold text-text-100 mb-4">Welche Cookies verwenden wir?</h2>
                    <p>TODO: Hier eigentlichen Text einfügen</p>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold text-text-100 mb-4">Notwendige Cookies</h2>
                    <p>TODO: Hier eigentlichen Text einfügen</p>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold text-text-100 mb-4">Funktionale Cookies</h2>
                    <p>TODO: Hier eigentlichen Text einfügen</p>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold text-text-100 mb-4">Analyse-Cookies</h2>
                    <p>TODO: Hier eigentlichen Text einfügen</p>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold text-text-100 mb-4">Ihre Cookie-Einstellungen</h2>
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

export default Cookies;

