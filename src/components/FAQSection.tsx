import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FAQSchema } from '@/components/FAQSchema';

const FAQSection: React.FC = () => {
  const faqItems = [
    {
      question: "Wie schnell erhalte ich das Ergebnis?",
      answer: "Ihr detaillierter Bericht wird spätestens innerhalb von zwei Werktagen nach Upload aller Unterlagen geliefert. In vielen Fällen erhalten Sie das Ergebnis bereits am nächsten Tag. Bei komplexeren Objekten kann die Bearbeitung bis zu 72 Stunden dauern."
    },
    {
      question: "Was passiert mit meinen Daten & Fotos?",
      answer: "Alle Ihre Daten werden DSGVO-konform verarbeitet und mit 256-Bit-TLS-Verschlüsselung übertragen. Nach Abschluss Ihres Auftrags werden alle hochgeladenen Dateien automatisch von unseren Servern gelöscht. Ihre Daten werden ausschließlich für die Erstellung Ihrer Bewertung verwendet."
    },
    {
      question: "Welche Fotos sind besonders wichtig?",
      answer: "Essentiell sind: Außenansichten der Fassade, Keller (Boden, Wände, Decke), alle Bäder, Elektroverteiler, Dach außen- und Innensicht und erkennbare Leitungsanschlüsse. Unser Upload-Assistent führt Sie durch eine detaillierte Checkliste."
    },
    {
      question: "Was, wenn Unterlagen fehlen?",
      answer: "Bitte nehmen Sie Kontakt mit dem Kundendienst auf unter kontakt@bauklar.org."
    },
    {
      question: "Ist die Einschätzung rechtsverbindlich?",
      answer: "Unsere Bewertung liefert eine klare, fachlich begründete Einschätzung des baulichen Zustands und schafft eine solide Entscheidungsbasis, insbesondere in der frühen Phase eines Kaufprozesses. Für rechtsverbindliche Gutachten, beispielsweise zur Vorlage bei Gerichten oder Behörden, ist zusätzlich eine Vor-Ort-Begehung erforderlich. Sollte ein solcher Schritt notwendig werden, unterstützen wir Sie selbstverständlich und vermitteln geeignete Sachverständige oder begleiten den Prozess weiter."
    },
    {
      question: "Kann ich nachträglich Dateien nachreichen?",
      answer: "Ja, Sie können bis zu 24 Stunden nach Auftragserteilung zusätzliche Fotos oder Dokumente über nachreichen. Dies verbessert die Qualität der Analyse erheblich und ist kostenfrei möglich. Bitte nehmen Sie dazu Kontakt mit dem Kundendienst auf."
    },
    {
      question: "Wie läuft die Zahlung ab?",
      answer: "Die Zahlung erfolgt sicher über einen etablierten Zahlungsanbieter mit Kreditkarte, SEPA-Lastschrift, Apple Pay oder Google Pay. Mit Beauftragung werden 25% des Kaufpreises fällig. Der restliche Betrag wird erst fällig mit Übersendung des Gutachtens. Sie erhalten eine Zahlungsbestätigung und Rechnung per E-Mail."
    },
    {
      question: "Kann ich stornieren?",
      answer: "Sie haben ein 14-tägiges Widerrufsrecht ab Vertragsschluss. Sollten Sie mit dem Ergebnis nicht zufrieden sein, erhalten Sie Ihr Geld zurück. Bitte nehmen Sie dazu Kontakt mit dem Kundendienst auf."
    },
    {
      question: "Für welche Objekttypen ist die Analyse geeignet?",
      answer: "Wir bieten unsere Gutachten an für Eigentumswohnungen, Ein- und Zweifamilienhäuser,  Mehrfamilienhäuser und Gewerbeobjekte an."
    },
    {
      question: "Was unterscheidet Sie von traditionellen Gutachtern?",
      answer: "Wir verbinden strukturierte Bewertungsmethoden mit fachlicher Erfahrung zu einer schnellen, objektiven und kosteneffizienten Einschätzung. Während klassische Gutachten häufig mehrere Wochen dauern und leicht über tausend Euro kosten, erhalten Sie bei uns innerhalb von 48 Stunden eine klare, präzise Bewertung, zu einem Bruchteil dieser Kosten."
    }
  ];

  return (
    <>
      <FAQSchema faqs={faqItems} />
      <section id="faq" className="py-20 bg-bg-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-100 mb-4">
            Häufig gestellte Fragen
          </h2>
          <p className="text-xl text-text-200 max-w-2xl mx-auto">
            Alles was Sie über unsere Bauschadensbewertung wissen müssen
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background rounded-lg shadow-soft border-0 px-6"
              >
                <AccordionTrigger className="text-left text-text-100 hover:text-primary font-medium py-6">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-text-200 pb-6 leading-relaxed">
                  {typeof item.answer === 'string' ? (
                    item.answer.split(/(kontakt@bauklar\.org)/).map((part, idx) => 
                      part.match(/kontakt@bauklar\.org/) ? (
                        <a 
                          key={idx}
                          href="mailto:kontakt@bauklar.org"
                          className="text-primary hover:underline font-medium"
                        >
                          {part}
                        </a>
                      ) : (
                        <span key={idx}>{part}</span>
                      )
                    )
                  ) : (
                    item.answer
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="text-center mt-12 p-8 bg-background rounded-xl shadow-soft">
            <h3 className="text-lg font-semibold text-text-100 mb-2">
              Weitere Fragen?
            </h3>
            <p className="text-text-200 mb-4">
              Unser Support-Team hilft Ihnen gerne weiter
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="mailto:kontakt@bauklar.org" 
                className="text-primary hover:underline font-medium"
              >
                kontakt@bauklar.org
              </a>
              <span className="hidden sm:block text-text-200">•</span>
              <a 
                href="tel:015143170757" 
                className="text-primary hover:underline font-medium"
              >
                015143170757
              </a>
            </div>
            <p className="text-xs text-text-200 mt-3">
              Montag bis Freitag, 9:00 - 18:00 Uhr
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default FAQSection;