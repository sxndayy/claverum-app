import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Handshake, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import ServiceInfoOverlay, {
  ServiceDetailWithInfo,
} from '@/components/ServiceInfoOverlay';

type ServiceCard = ServiceDetailWithInfo & {
  icon: typeof Search;
  features: string[];
  popular: boolean;
};

const ServicesSection: React.FC = () => {
  const navigate = useNavigate();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeOverlay, setActiveOverlay] = useState<{
    index: number;
    trigger: HTMLElement | null;
    rect: DOMRect | null;
  } | null>(null);

  const handleStartEvaluation = () => {
    navigate('/evaluation');
  };

  const services: ServiceCard[] = [
    {
      icon: Search,
      title: 'Bauschadensbewertung',
      description: 'Detaillierte Zustandsanalyse mit realistischen Kosten- und Risikoabschätzungen',
      features: [
        'Strukturierte Bewertung aller Gebäudebereiche',
        'Risikoeinstufung nach Priorität',
        'Kostenrahmen pro Gewerk',
        'Handlungs- und Wartungsempfehlungen',
      ],
      info: {
        tagline:
          'Präzise Analyse sichtbarer Mängel und potenzieller Risiken – ideal für Käufer:innen und Eigentümer:innen, die eine fundierte Einschätzung des baulichen Zustands benötigen.',
        sections: [
          {
            title: 'Sie erhalten',
            items: [
              'Detaillierte Auswertung aller eingereichten Fotos und Objektinformationen',
              'Priorisierte Einschätzung nach Dringlichkeit mit klaren Handlungsvorschlägen',
              'Realistische Kostenspannen mit transparenter Aufschlüsselung nach Gewerken',
              'Abschlussbericht als übersichtlich strukturiertes PDF mit Empfehlungen und Zusammenfassung',
            ],
          },
          {
            title: 'Ideal, wenn',
            items: [
              'Sie Schäden dokumentieren und deren Relevanz objektiv bewerten lassen möchten',
              'Sanierungs-, Kauf- oder Modernisierungsentscheidungen anstehen',
              'Sie eine unabhängige Zweitmeinung für Versicherer, Banken oder Partner benötigen',
            ],
          },
          {
            title: 'Ablauf in 3 Schritten',
            items: [
              'Fotos und Objektinformationen direkt im Browser hochladen',
              'Analyse und Plausibilitätsprüfung durch unsere Sachverständigen',
              'Ergebnisbericht mit Bewertung und Handlungsempfehlung innerhalb eines Werktags',
            ],
          },
        ],
        note:
          'Hinweis: Fehlende Unterlagen können innerhalb von 24 Stunden nachgereicht werden. Die Bewertung pausiert automatisch, bis alle Informationen vorliegen.',
      },
      popular: true,
    },
    {
      icon: Handshake,
      title: 'Ankaufsberatung',
      description: 'Entscheidungshilfe vor Notartermin',
      features: [
        'Kaufempfehlung basierend auf Zustand',
        'Verhandlungsargumente ableiten',
        'Preis-Leistungs-Bewertung',
        'Alternativenaufzeigung',
      ],
      info: {
        tagline:
          'Begleitete Entscheidungsgrundlage vor dem Notartermin – mit klaren Verhandlungspunkten, Risikoampel und objektiver Kaufempfehlung.',
        sections: [
          {
            title: 'Sie erhalten',
            items: [
              'Verhandlungsanalyse mit konkreten Argumenten für Preisnachlässe',
              'Bewertung der Werthaltigkeit inklusive Prognose der Folgekosten',
              'Checkliste kritischer Bauteile für Vor-Ort-Begehungen',
              'Ampelbasierte Risikoeinschätzung für die finale Kaufentscheidung',
            ],
          },
          {
            title: 'Ideal, wenn',
            items: [
              'Sie vor dem Notartermin letzte Sicherheit brauchen',
              'Sie mehrere Objekte vergleichen oder priorisieren möchten',
              'Sie Banken, Investoren oder Mitentscheidende von Fakten überzeugen wollen',
            ],
          },
          {
            title: 'Unser Ablauf',
            items: [
              'Upload der Kaufunterlagen (Exposé, Energieausweis, Fotos) – optional',
              'Vergleich mit tausenden Markt- und Sanierungsdaten innerhalb von 12 Stunden',
              'Optionales Abschlussgespräch zur Besprechung der Ergebnisse',
            ],
          },
        ],
        note:
          'Auf Wunsch ergänzen wir die Analyse um ein individuelles Verhandlungsskript oder begleiten Ihr Bankgespräch.',
      },
      popular: false,
    },
  ];

  const handleMoreInfo = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    event.preventDefault();
    const trigger = event.currentTarget;
    const cardElement = cardRefs.current[index];
    const rect = cardElement ? cardElement.getBoundingClientRect() : null;
    setActiveOverlay({ index, trigger, rect });
  };

  const handleOverlayCloseComplete = () => {
    setActiveOverlay(null);
  };

  const activeService =
    activeOverlay !== null ? services[activeOverlay.index] : null;

  return (
    <section id="leistungen" className="bg-bg-200 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-text-100 md:text-4xl">
            Unsere Leistungen
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-text-200">
            Professionelle KI-gestützte Bauschadensbewertung für jeden Bedarf
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {services.map((service, index) => (
            <Card
              key={service.title}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              className={`relative transition-smooth hover-lift ${
                service.popular ? 'ring-2 ring-primary shadow-strong' : 'shadow-soft'
              }`}
            >
              {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                  <span className="rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                    Meistgewählt
                  </span>
                </div>
              )}

              <CardHeader className="pb-4 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold text-text-100">
                  {service.title}
                </CardTitle>
                <p className="text-sm text-text-200">{service.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="mb-6 space-y-2">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-text-200"
                    >
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="space-y-3">
                  <Button
                    type="button"
                    onClick={handleStartEvaluation}
                    className="group w-full"
                    variant={service.popular ? 'default' : 'outline'}
                  >
                    Jetzt starten
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>

                  <Button
                    type="button"
                    onClick={(event) => handleMoreInfo(event, index)}
                    className="w-full border border-primary/60 !bg-transparent !text-primary hover:!bg-primary/10 hover:!text-primary focus-visible:ring-primary/60"
                  >
                    Mehr Infos
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="mx-auto max-w-3xl rounded-xl bg-background p-8 shadow-soft">
            <h3 className="mb-4 text-xl font-semibold text-text-100">
              Warum Claverum?
            </h3>
            <div className="grid gap-6 text-sm text-text-200 md:grid-cols-3">
              <div>
                <strong className="text-text-100">
                  Objektiv & vergleichbar:
                </strong>
                <br />
                Bewertungen nach klaren Kriterien, unabhängig, transparent und objektiv.
              </div>
              <div>
                <strong className="text-text-100">Schnell & digital:</strong>
                <br />
                Ergebnis in wenigen Tagen statt Wochen
              </div>
              <div>
                <strong className="text-text-100">Kosteneffizient:</strong>
                <br />
                Präzise Einschätzung ohne Aufwand und zu einem fairen Preis.
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeService && activeOverlay && (
        <ServiceInfoOverlay
          service={activeService}
          initialRect={activeOverlay.rect}
          triggerElement={activeOverlay.trigger}
          getLatestRect={() => {
            const element = cardRefs.current[activeOverlay.index];
            return element ? element.getBoundingClientRect() : null;
          }}
          onCloseComplete={handleOverlayCloseComplete}
        />
      )}
    </section>
  );
};

export default ServicesSection;
