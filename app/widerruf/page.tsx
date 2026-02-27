import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/layout/CookieBanner';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: "Widerrufsbelehrung",
  description: "Widerrufsbelehrung der Claverum GmbH. Informationen zu Ihrem Widerrufsrecht bei Bauschadensanalysen und dem Widerrufsverfahren.",
  alternates: {
    canonical: `${SITE_URL}/widerruf`,
  },
};

export default function WiderrufPage() {
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Widerrufsbelehrung', url: '/widerruf' }
        ]} 
      />
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
                      <p className="mb-2">Claverum GmbH</p>
                      <p className="mb-2">Neusser Str. 257</p>
                      <p className="mb-4">50733 Köln</p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-text-100 mb-4">Widerrufsrecht</h2>
                      <p className="mb-4">
                        Wenn Sie als Verbraucher (§ 13 BGB) bei uns eine Analyse beauftragen, haben Sie das Recht, innerhalb von 14 Tagen ohne Angabe von Gründen den Vertrag zu widerrufen.
                      </p>
                      <p>
                        Die Widerrufsfrist beträgt 14 Tage ab dem Tag des Vertragsabschlusses.
                      </p>
                      <p className="mb-4 mt-4">
                        Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Claverum GmbH, Neusser Str. 257, 50733 Köln, E-Mail: Kontakt@bauklar.org) mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss informieren, diesen Vertrag zu widerrufen.
                      </p>
                      <p>
                        Sie können dafür das am Ende beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-text-100 mb-4">Folgen des Widerrufs</h2>
                      <p className="mb-4">
                        Wenn Sie diesen Vertrag widerrufen, erstatten wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen 14 Tagen ab dem Tag, an dem die Mitteilung über Ihren Widerruf bei uns eingegangen ist.
                      </p>
                      <p>
                        Für die Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, es wurde ausdrücklich etwas anderes vereinbart.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-text-100 mb-4">Besonderer Hinweis zum vorzeitigen Erlöschen des Widerrufsrechts</h2>
                      <p className="mb-4">
                        Da wir unsere Leistung in Form einer individuellen Analyse erbringen, beginnen wir erst mit der Arbeit, wenn Sie diesem ausdrücklich zustimmen.
                      </p>
                      <p className="mb-2 font-semibold">
                        Wenn Sie wünschen, dass wir sofort mit der Arbeit beginnen (z. B. Upload der Fotos → direkte Bearbeitung), gilt:
                      </p>
                      <p className="mb-4">
                        Sie bestätigen ausdrücklich, dass wir die Dienstleistung vor Ablauf der Widerrufsfrist ausführen dürfen und Ihnen bekannt ist, dass Ihr Widerrufsrecht mit vollständiger Leistungserbringung erlischt.
                      </p>
                      <p className="mb-4 italic">
                        Beispiel: Wenn das Gutachten bereits vollständig erstellt wurde und Ihnen vorliegt, besteht kein Widerrufsrecht mehr.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-text-100 mb-4">Muster-Widerrufsformular</h2>
                      <p className="mb-4 italic">
                        (Wenn Sie den Vertrag widerrufen möchten, füllen Sie dieses Formular aus und senden Sie es zurück.)
                      </p>
                      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                        <p className="mb-2 font-semibold">An:</p>
                        <p className="mb-2">Claverum GmbH</p>
                        <p className="mb-2">Neusser Str. 257</p>
                        <p className="mb-4">50733 Köln</p>
                        <p className="mb-2">E-Mail: Kontakt@bauklar.org</p>
                        <p className="mb-4 mt-6">
                          Hiermit widerrufe(n) ich/wir den von mir/uns abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung:
                        </p>
                        <p className="mb-2">- Bezeichnung der Dienstleistung: Bausubstanzanalyse / Bauzustandsbewertung</p>
                        <p className="mb-2">- Bestellt am: __________________</p>
                        <p className="mb-2">- Name des/der Verbraucher(s): __________________</p>
                        <p className="mb-2">- Anschrift: __________________</p>
                        <p className="mb-2">- Datum: __________________</p>
                        <p className="mb-2">- Unterschrift (nur bei Mitteilung auf Papier): __________________</p>
                      </div>
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




