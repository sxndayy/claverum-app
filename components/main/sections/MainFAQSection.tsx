import React from "react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronRight } from "lucide-react";
import { FAQSchema } from "@/components/seo/FAQSchema";

const MainFAQSection: React.FC = () => {
  const faqItems = [
    {
      question: "Was bieten wir?",
      answer: (
        <>
          <p className="mb-3">
            Wir begleiten Sie als Immobilienkäufer im Ankaufsprozess mit einer technischen Bauzustandsanalyse.
          </p>
          <p className="mb-3">
            Als unabhängiger und kritischer Partner prüfen wir im 4-Augen-Prinzip den baulichen Zustand der Immobilie und identifizieren bestehende Mängel, Risiken sowie absehbare Sanierungsbedarfe.
          </p>
          <p className="mb-2 font-medium text-text-100">Dabei betrachten wir insbesondere:</p>
          <ul className="list-disc pl-5 mb-3 space-y-1">
            <li>Keller und Abdichtung</li>
            <li>Fassade</li>
            <li>Dach</li>
            <li>Heizung und Haustechnik</li>
            <li>Elektroinstallation</li>
            <li>Innenräume</li>
            <li>Bäder</li>
            <li>Fenster</li>
          </ul>
          <p className="mb-3">
            Sie erhalten eine strukturierte Einschätzung zu möglichen Schäden und zu erwartenden Sanierungsaufwendungen.
          </p>
          <p>
            So schaffen Sie Transparenz über die technische Substanz der Immobilie, reduzieren Entscheidungsrisiken und können Ihre Finanzierung realistischer planen – insbesondere im Hinblick auf zukünftige Investitionen.
          </p>
        </>
      ),
      schemaAnswer: "Wir begleiten Sie als Immobilienkäufer im Ankaufsprozess mit einer technischen Bauzustandsanalyse. Als unabhängiger und kritischer Partner prüfen wir im 4-Augen-Prinzip den baulichen Zustand der Immobilie und identifizieren bestehende Mängel, Risiken sowie absehbare Sanierungsbedarfe. Dabei betrachten wir insbesondere: Keller und Abdichtung, Fassade, Dach, Heizung und Haustechnik, Elektroinstallation, Innenräume, Bäder, Fenster. Sie erhalten eine strukturierte Einschätzung zu möglichen Schäden und zu erwartenden Sanierungsaufwendungen. So schaffen Sie Transparenz über die technische Substanz der Immobilie, reduzieren Entscheidungsrisiken und können Ihre Finanzierung realistischer planen – insbesondere im Hinblick auf zukünftige Investitionen."
    },
    {
      question: "Was bieten wir nicht?",
      answer: (
        <>
          <p className="mb-3">
            Unsere Leistung ist eine technische Bauzustandsanalyse.
          </p>
          <p className="mb-3">
            Wir erstellen keine Kaufpreisbewertung und kein Verkehrswertgutachten.
          </p>
          <p className="mb-2 font-medium text-text-100">Das bedeutet:</p>
          <p className="mb-3">
            Wir beurteilen nicht, ob der geforderte Kaufpreis marktgerecht ist, und nehmen keine finanzielle Immobilienbewertung vor.
          </p>
          <p>
            Unser Fokus liegt ausschließlich auf der baulichen Substanz und dem technischen Zustand der Immobilie.
          </p>
        </>
      ),
      schemaAnswer: "Unsere Leistung ist eine technische Bauzustandsanalyse. Wir erstellen keine Kaufpreisbewertung und kein Verkehrswertgutachten. Das bedeutet: Wir beurteilen nicht, ob der geforderte Kaufpreis marktgerecht ist, und nehmen keine finanzielle Immobilienbewertung vor. Unser Fokus liegt ausschließlich auf der baulichen Substanz und dem technischen Zustand der Immobilie."
    },
    {
      question: "Wie schnell erhalte ich das Ergebnis?",
      answer:
        "Ihr detaillierter Bericht wird spätestens innerhalb von zwei Werktagen nach Upload aller Unterlagen geliefert. In vielen Fällen erhalten Sie das Ergebnis bereits am nächsten Tag. Bei komplexeren Objekten kann die Bearbeitung bis zu 72 Stunden dauern.",
    },
    {
      question: "Was passiert mit meinen Daten & Fotos?",
      answer:
        "Alle Ihre Daten werden DSGVO-konform verarbeitet und mit 256-Bit-TLS-Verschlüsselung übertragen. Nach Abschluss Ihres Auftrags werden alle hochgeladenen Dateien automatisch von unseren Servern gelöscht. Ihre Daten werden ausschließlich für die Erstellung Ihrer Bewertung verwendet.",
    },
    {
      question: "Welche Fotos sind besonders wichtig?",
      answer:
        "Essentiell sind: Außenansichten der Fassade, Keller (Boden, Wände, Decke), alle Bäder, Elektroverteiler, Dach außen- und Innensicht und erkennbare Leitungsanschlüsse. Unser Upload-Assistent führt Sie durch eine detaillierte Checkliste.",
    },
    {
      question: "Was, wenn Unterlagen fehlen?",
      answer: "Bitte nehmen Sie Kontakt mit dem Kundendienst auf unter kontakt@bauklar.org.",
    },
    {
      question: "Ist die Einschätzung rechtsverbindlich?",
      answer:
        "Unsere Bewertung liefert eine klare, fachlich begründete Einschätzung des baulichen Zustands und schafft eine solide Entscheidungsbasis, insbesondere in der frühen Phase eines Kaufprozesses. Für rechtsverbindliche Gutachten, beispielsweise zur Vorlage bei Gerichten oder Behörden, ist zusätzlich eine Vor-Ort-Begehung erforderlich. Sollte ein solcher Schritt notwendig werden, unterstützen wir Sie selbstverständlich und vermitteln geeignete Sachverständige oder begleiten den Prozess weiter.",
    },
    {
      question: "Kann ich nachträglich Dateien nachreichen?",
      answer:
        "Ja, Sie können bis zu 24 Stunden nach Auftragserteilung zusätzliche Fotos oder Dokumente über nachreichen. Dies verbessert die Qualität der Analyse erheblich und ist kostenfrei möglich. Bitte nehmen Sie dazu Kontakt mit dem Kundendienst auf.",
    },
    {
      question: "Wie läuft die Zahlung ab?",
      answer:
        "Die Zahlung erfolgt sicher über unseren Zahlungsdienstleister Stripe (Stripe Payments Europe Ltd.) mit PayPal, Kreditkarte, Apple Pay oder Google Pay. Mit Upload der Fotos und verbindlicher Beauftragung wird der vollständige Kaufpreis fällig. Sie erhalten unmittelbar nach erfolgreicher Zahlung eine Zahlungsbestätigung sowie die Rechnung per E-Mail.",
      schemaAnswer:
        "Die Zahlung erfolgt sicher über unseren Zahlungsdienstleister Stripe (Stripe Payments Europe Ltd.) mit PayPal, Kreditkarte, Apple Pay oder Google Pay. Mit Upload der Fotos und verbindlicher Beauftragung wird der vollständige Kaufpreis fällig. Sie erhalten unmittelbar nach erfolgreicher Zahlung eine Zahlungsbestätigung sowie die Rechnung per E-Mail.",
    },
    {
      question: "Kann ich stornieren?",
      answer:
        "Ja. Verbrauchern steht ein gesetzliches Widerrufsrecht von 14 Tagen ab Vertragsschluss zu. Einzelheiten ergeben sich aus unserer Widerrufsbelehrung.",
      schemaAnswer:
        "Ja. Verbrauchern steht ein gesetzliches Widerrufsrecht von 14 Tagen ab Vertragsschluss zu. Einzelheiten ergeben sich aus unserer Widerrufsbelehrung.",
    },
    {
      question: "Unter welchen Umständen erhalte ich mein Geld zurück?",
      answer: (
        <>
          <p className="mb-3">
            Unabhängig vom gesetzlichen Widerrufsrecht gewähren wir eine freiwillige 100 % Geld-zurück-Garantie.
          </p>
          <p className="mb-2 font-medium text-text-100">
            Sollten Sie mit dem erhaltenen Bericht nicht zufrieden sein, erstatten wir Ihnen den vollständigen Betrag zurück,
            sofern einer der folgenden Fälle vorliegt:
          </p>
          <ul className="list-disc pl-5 mb-3 space-y-1">
            <li>Der Bericht weicht inhaltlich erheblich vom beschriebenen Leistungsumfang ab.</li>
            <li>Die Analyse ist offensichtlich unvollständig.</li>
            <li>Die Ausführungen sind objektiv nicht nachvollziehbar oder nicht verständlich.</li>
          </ul>
          <p className="mb-3">
            Voraussetzung ist, dass Sie uns innerhalb von 48 Stunden nach Erhalt des Berichts schriftlich informieren und kurz darlegen,
            weshalb Sie nicht zufrieden sind.
          </p>
          <p className="mb-3">
            Wir prüfen Ihr Anliegen zeitnah und erstatten im berechtigten Fall den vollständigen Betrag.
          </p>
          <p>
            Diese Garantie gilt zusätzlich zum gesetzlichen Widerrufsrecht und schränkt dieses nicht ein.
          </p>
        </>
      ),
      schemaAnswer:
        "Unabhängig vom gesetzlichen Widerrufsrecht gewähren wir eine freiwillige 100 % Geld-zurück-Garantie. Sie erhalten den vollständigen Betrag zurück, wenn der Bericht inhaltlich erheblich vom beschriebenen Leistungsumfang abweicht, die Analyse offensichtlich unvollständig ist oder die Ausführungen objektiv nicht nachvollziehbar bzw. nicht verständlich sind. Voraussetzung ist, dass Sie uns innerhalb von 48 Stunden nach Erhalt des Berichts schriftlich informieren und kurz darlegen, weshalb Sie nicht zufrieden sind. Wir prüfen Ihr Anliegen zeitnah und erstatten im berechtigten Fall den vollständigen Betrag. Diese Garantie gilt zusätzlich zum gesetzlichen Widerrufsrecht und schränkt dieses nicht ein.",
    },
    {
      question: "Für welche Objekttypen ist die Analyse geeignet?",
      answer:
        "Wir bieten unsere Gutachten an für Eigentumswohnungen, Ein- und Zweifamilienhäuser,  Mehrfamilienhäuser und Gewerbeobjekte an.",
    },
    {
      question: "Was unterscheidet Sie von traditionellen Gutachtern?",
      answer:
        "Wir verbinden strukturierte Bewertungsmethoden mit fachlicher Erfahrung zu einer schnellen, objektiven und kosteneffizienten Einschätzung. Während klassische Gutachten häufig mehrere Wochen dauern und leicht über tausend Euro kosten, erhalten Sie bei uns innerhalb von 48 Stunden eine klare, präzise Bewertung, zu einem Bruchteil dieser Kosten.",
    },
  ];

  const schemaFaqs = faqItems.map((item) => ({
    question: item.question,
    answer: item.schemaAnswer || (typeof item.answer === "string" ? item.answer : ""),
  }));

  return (
    <>
      <FAQSchema faqs={schemaFaqs} />
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
                    {typeof item.answer === "string" ? (
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
                        ),
                      )
                    ) : (
                      item.answer
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="text-center mt-12 p-6 bg-background rounded-xl shadow-soft">
              <p className="text-text-200">
                Noch Fragen? Schreiben Sie uns an{" "}
                <a href="mailto:kontakt@bauklar.org" className="text-primary hover:underline font-medium">
                  kontakt@bauklar.org
                </a>
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <Link
                  href="/blog/hauskauf-beratung"
                  className="text-primary hover:underline font-medium inline-flex items-center gap-1 text-sm"
                >
                  Hauskauf Beratung – Ratgeber lesen
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MainFAQSection;

