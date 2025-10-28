import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQSection: React.FC = () => {
  const faqItems = [
    {
      question: "Wie schnell erhalte ich das Ergebnis?",
      answer: "Ihr detaillierter Bericht wird spätestens am nächsten Werktag nach Upload aller Unterlagen geliefert. In vielen Fällen erhalten Sie das Ergebnis bereits am selben Tag. Bei komplexeren Objekten kann die Bearbeitung bis zu 48 Stunden dauern."
    },
    {
      question: "Was passiert mit meinen Daten & Fotos?",
      answer: "Alle Ihre Daten werden DSGVO-konform verarbeitet und mit 256-Bit-TLS-Verschlüsselung übertragen. Nach Abschluss Ihres Auftrags werden alle hochgeladenen Dateien automatisch von unseren Servern gelöscht. Ihre Daten werden ausschließlich für die Erstellung Ihrer Bewertung verwendet."
    },
    {
      question: "Welche Fotos sind besonders wichtig?",
      answer: "Essentiell sind: Außenansichten der Fassade, Keller (Boden, Wände, Decke), alle Bäder, Dachgeschoss/Dachstuhl und erkennbare Leitungsanschlüsse. Unser Upload-Assistent führt Sie durch eine detaillierte Checkliste und zeigt Ihnen Beispielfotos für optimale Ergebnisse."
    },
    {
      question: "Was, wenn Unterlagen fehlen?",
      answer: "Grundrisse und Baujahr sind für eine präzise Bewertung wichtig, aber nicht zwingend erforderlich. Unsere KI kann viele Informationen aus Fotos ableiten. Sie können fehlende Unterlagen auch nachträglich bis zu 24 Stunden nach Auftragserteilung nachreichen."
    },
    {
      question: "Ist die Einschätzung rechtsverbindlich?",
      answer: "Unsere Bewertung dient als fundierte Entscheidungsgrundlage, ersetzt jedoch keine Vor-Ort-Begehung durch einen Sachverständigen. Die Einschätzung erfolgt nach bestem Wissen und Gewissen, rechtliche Gewährleistung können wir jedoch nicht übernehmen. Für rechtsverbindliche Gutachten vermitteln wir gerne entsprechende Experten."
    },
    {
      question: "Kann ich nachträglich Dateien nachreichen?",
      answer: "Ja, Sie können bis zu 24 Stunden nach Auftragserteilung zusätzliche Fotos oder Dokumente über einen sicheren Link nachreichen. Dies verbessert die Qualität der Analyse erheblich und ist kostenfrei möglich."
    },
    {
      question: "Wie läuft die Zahlung ab?",
      answer: "Die Zahlung erfolgt sicher über einen etablierten Zahlungsanbieter mit Kreditkarte, SEPA-Lastschrift, Apple Pay oder Google Pay. Der Betrag wird erst nach erfolgreicher Übermittlung aller Unterlagen belastet. Sie erhalten sofort eine Zahlungsbestätigung und Rechnung per E-Mail."
    },
    {
      question: "Kann ich stornieren?",
      answer: "Sie haben ein 14-tägiges Widerrufsrecht ab Vertragsschluss. Sollten Sie mit dem Ergebnis nicht zufrieden sein, erhalten Sie Ihr Geld zurück – ohne Wenn und Aber. Kontaktieren Sie einfach unseren Support."
    },
    {
      question: "Für welche Objekttypen ist die Analyse geeignet?",
      answer: "Unsere KI ist speziell für Wohnimmobilien trainiert: Eigentumswohnungen, Ein-/Zwei-/Mehrfamilienhäuser. Gewerbeobjekte, Denkmäler oder Neubauten (unter 2 Jahre) können derzeit nicht optimal bewertet werden."
    },
    {
      question: "Was unterscheidet Sie von traditionellen Gutachtern?",
      answer: "Wir kombinieren KI-Technologie mit menschlicher Expertise für schnelle, objektive und kosteneffiziente Bewertungen. Während klassische Gutachten Wochen dauern und mehrere tausend Euro kosten, liefern wir binnen 24 Stunden präzise Ergebnisse zu einem Bruchteil der Kosten."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-bg-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-100 mb-4">
            Häufig gestellte Fragen
          </h2>
          <p className="text-xl text-text-200 max-w-2xl mx-auto">
            Alles was Sie über unsere KI-gestützte Bauschadensbewertung wissen müssen
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
                  {item.answer}
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
                href="mailto:support@baucheck-ki.de" 
                className="text-primary hover:underline font-medium"
              >
                support@baucheck-ki.de
              </a>
              <span className="hidden sm:block text-text-200">•</span>
              <a 
                href="tel:+4930123456789" 
                className="text-primary hover:underline font-medium"
              >
                +49 30 123 456 789
              </a>
            </div>
            <p className="text-xs text-text-200 mt-3">
              Montag bis Freitag, 9:00 - 18:00 Uhr
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;