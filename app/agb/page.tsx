import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/layout/CookieBanner';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen (AGB)",
  description: "Allgemeine Geschäftsbedingungen für Bausubstanzanalysen der Claverum GmbH. Informationen zu Leistungen, Preisen, Haftung und rechtlichen Bestimmungen.",
  alternates: {
    canonical: `${SITE_URL}/agb`,
  },
};

export default function AGPage() {
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'AGB', url: '/agb' }
        ]} 
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-text-100 mb-8">
                  Allgemeine Geschäftsbedingungen (AGB)
                </h1>
                
                <div className="prose prose-lg max-w-none">
                  <div className="space-y-6 text-text-200 leading-relaxed">
                    <div>
                      <h2 className="text-2xl font-semibold text-text-100 mb-4">für Bausubstanzanalysen der Claverum GmbH, Köln</h2>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-text-100 mb-4">1. Was wir anbieten</h2>
                      <p className="mb-4">
                        Wir erstellen Einschätzungen zum baulichen Zustand von Gebäuden. Grundlage hierfür sind die vom Auftraggeber bereitgestellten Fotos und Informationen. Wir beurteilen sichtbare Schäden, ordnen diese fachlich ein und geben eine grobe Orientierung zu möglichen Sanierungskosten.
                      </p>
                      <p className="mb-2 font-semibold">Wichtig:</p>
                      <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
                        <li>Es findet keine Ortsbesichtigung statt.</li>
                        <li>Es werden keine Messungen durchgeführt und keine Bauteile geöffnet.</li>
                        <li>Die Analyse dient als Hilfestellung, z. B. bei Kauf- oder Sanierungsentscheidungen – sie ersetzt keine detaillierte Planung, Begutachtung vor Ort oder ein gerichtstaugliches Gutachten.</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-text-100 mb-4">2. Welche Verantwortung der Auftraggeber hat</h2>
                      <p className="mb-4">
                        Damit wir eine sinnvolle Einschätzung abgeben können, ist es wichtig, dass die bereitgestellten Fotos und Informationen vollständig, aktuell und zutreffend sind.
                      </p>
                      <p>
                        Fehlen Angaben oder sind sie ungenau, kann das die Bewertung beeinflussen.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-text-100 mb-4">3. Preis &amp; Zahlung</h2>

                      <h3 className="text-xl font-semibold text-text-100 mb-2">3.1 Preise</h3>
                      <p className="mb-2">
                        (1) Die Leistungen der Anbieterin werden zu folgenden Endpreisen angeboten (inklusive gesetzlicher
                        Umsatzsteuer):
                      </p>
                      <ul className="list-disc list-inside mb-2 space-y-1 ml-4">
                        <li>Bauklar Analyse: 350,00 € brutto</li>
                        <li>Bauklar Intensiv: 790,00 € brutto</li>
                      </ul>
                      <p className="mb-4">
                        (2) Alle Preisangaben verstehen sich als Endpreise inklusive der jeweils gültigen gesetzlichen
                        Umsatzsteuer.
                      </p>

                      <h3 className="text-xl font-semibold text-text-100 mb-2">3.2 Zahlungsbedingungen</h3>
                      <p className="mb-2">
                        (1) Die Zahlung des Honorars erfolgt über einen im Bestellprozess angegebenen Zahlungsdienstleister
                        (z. B. Stripe) und kann mit PayPal, Kreditkarte, Apple Pay oder Google Pay geleistet werden.
                      </p>
                      <p className="mb-2">
                        (2) Mit Upload der erforderlichen Fotos und der verbindlichen Beauftragung des jeweiligen Produkts
                        wird der vollständige Kaufpreis sofort fällig und zur Zahlung über den ausgewählten
                        Zahlungsdienstleister ausgelöst.
                      </p>
                      <p className="mb-2">
                        (3) Eine gesonderte Rechnung wird in Textform (z. B. per E-Mail) übermittelt. Der Kunde verpflichtet
                        sich, den ausgewählten Zahlungsweg korrekt bereitzustellen und etwaige erforderliche Informationen
                        vollständig anzugeben.
                      </p>
                      <p className="mb-4">
                        (4) Gerät der Kunde mit der Zahlung in Verzug, gelten die gesetzlichen Regelungen zum Verzugszins
                        (§ 288 BGB).
                      </p>

                      <h3 className="text-xl font-semibold text-text-100 mb-2">
                        3.3 Vertragsschluss, Leistungsbeginn und Widerrufsrecht (für Verbraucher)
                      </h3>
                      <p className="mb-2">
                        (1) Der Vertrag zwischen der Anbieterin und dem Kunden kommt mit erfolgreicher Zahlung und
                        Bestätigung im Bestellprozess zustande.
                      </p>
                      <p className="mb-2">
                        (2) Verbrauchern steht grundsätzlich ein gesetzliches Widerrufsrecht von 14 Tagen gem. §§ 312d, 355
                        BGB zu. Die Widerrufsfrist beginnt mit Vertragsschluss.
                      </p>
                      <p className="mb-2">
                        (3) Eine Information über das Widerrufsrecht in klarer, verständlicher Form wird im Rahmen des
                        Bestellprozesses bereitgestellt (Widerrufsbelehrung).
                      </p>
                      <p className="mb-2">
                        (4) <span className="font-semibold">Erlöschen des Widerrufsrechts bei vorzeitigem Leistungsbeginn:</span>{' '}
                        Vertragsgegenstand sind digitale Dienstleistungen. Sofern der Kunde ausdrücklich zustimmt, dass die
                        Anbieterin mit der Leistungserbringung vor Ablauf der Widerrufsfrist beginnt (z. B. sofortige Analyse
                        nach Upload), und er gleichzeitig bestätigt, dass ihm bekannt ist, dass damit sein Widerrufsrecht mit
                        vollständiger Leistungserbringung erlischt, erlischt das Widerrufsrecht bereits mit vollständiger
                        Erbringung der Leistung.
                      </p>
                      <p className="mb-2">
                        (5) Im Fall wirksamer Ausübung des Widerrufsrechts werden bereits geleistete Zahlungen unverzüglich,
                        spätestens jedoch binnen 14 Tagen nach Eingang des Widerrufs erstattet.
                      </p>
                      <p className="mb-0">
                        (6) Das Widerrufsrecht besteht nicht bei vollständig erbrachten digitalen Inhalten, wenn mit der
                        Ausführung der Leistung vor Ablauf der Widerrufsfrist begonnen wurde und der Kunde dem ausdrücklich
                        zugestimmt hat.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-text-100 mb-4">4. Was die Analyse leisten kann – und was nicht</h2>
                      <p className="mb-4">
                        Unsere Einschätzungen basieren ausschließlich auf dem, was auf den eingereichten Bildern und Informationen erkennbar ist.
                      </p>
                      <p className="mb-2 font-semibold">Dadurch gilt:</p>
                      <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
                        <li>Verdeckte oder nicht sichtbare Schäden können nicht erkannt werden.</li>
                        <li>Kostenschätzungen sind unverbindliche Orientierungswerte.</li>
                        <li>Für Kauf-, Investitions- oder Finanzierungsentscheidungen bleibt der Auftraggeber selbst verantwortlich.</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-text-100 mb-4">5. Haftung</h2>
                      <p className="mb-4">
                        Wir haften nur bei Vorsatz oder grober Fahrlässigkeit.
                      </p>
                      <p className="mb-4">
                        Für einfache oder leichte Fahrlässigkeit übernehmen wir keine Haftung.
                      </p>
                      <p className="mb-4">
                        Außerdem ist – außer bei Verletzung von Leben, Körper oder Gesundheit – die Höhe der möglichen Haftung auf den Betrag der jeweiligen Vergütung (350 € bzw. 790 €) begrenzt.
                      </p>
                      <p className="mb-2 font-semibold">Keine Haftung übernehmen wir insbesondere für:</p>
                      <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
                        <li>Schäden oder Ursachen, die anhand von Fotos nicht erkennbar sind</li>
                        <li>Abweichungen, die bei einer späteren Besichtigung festgestellt werden</li>
                        <li>Entscheidungen, Planungen oder Verträge, die der Auftraggeber auf Grundlage unserer Analyse trifft</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-text-100 mb-4">6. Nutzung der Analyse</h2>
                      <p className="mb-4">
                        Die Analyse ist für den Auftraggeber bestimmt.
                      </p>
                      <p>
                        Wird sie an Dritte weitergegeben oder als Grundlage gegenüber Banken, Behörden, Maklern oder Gerichten verwendet, geschieht das auf eigene Verantwortung des Auftraggebers.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-text-100 mb-4">7. Rechtliches</h2>
                      <p className="mb-4">
                        Es gilt das Recht der Bundesrepublik Deutschland.
                      </p>
                      <p className="mb-4">
                        Sitz der Claverum GmbH ist Köln.
                      </p>
                      <p>
                        Sollte eine Regelung unwirksam sein, bleibt der Rest der AGB gültig.
                      </p>
                    </div>

                    <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                      <p className="font-semibold text-text-100">
                        Die Analyse ersetzt keine persönliche Ortsbesichtigung oder Fachplanung. Sie basiert ausschließlich auf den bereitgestellten Informationen.
                      </p>
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




