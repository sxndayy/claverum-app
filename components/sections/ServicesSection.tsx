"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ArrowRight } from 'lucide-react';
import ServiceInfoOverlay, {
  ServiceDetailWithInfo,
} from '@/components/ui/ServiceInfoOverlay';
import { ServiceSchema } from '@/components/seo/ServiceSchema';

type ServiceCard = ServiceDetailWithInfo & {
  icon: typeof Search;
  features: string[];
  popular: boolean;
};

const ServicesSection: React.FC = () => {
  const router = useRouter();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeOverlay, setActiveOverlay] = useState<{
    index: number;
    trigger: HTMLElement | null;
    rect: DOMRect | null;
  } | null>(null);

  const handleStartEvaluation = () => {
    router.push('/auftrag');
  };

  // Liste aller Städte mit Namen und Slugs
  const cities = [
    { name: 'Berlin', slug: 'berlin' },
    { name: 'Hamburg', slug: 'hamburg' },
    { name: 'München', slug: 'muenchen' },
    { name: 'Köln', slug: 'koeln' },
    { name: 'Düsseldorf', slug: 'duesseldorf' },
    { name: 'Dortmund', slug: 'dortmund' },
    { name: 'Essen', slug: 'essen' },
    { name: 'Frankfurt', slug: 'frankfurt' },
    { name: 'Stuttgart', slug: 'stuttgart' },
    { name: 'Nürnberg', slug: 'nuernberg' },
    { name: 'Leipzig', slug: 'leipzig' },
    { name: 'Dresden', slug: 'dresden' },
    { name: 'Hannover', slug: 'hannover' },
    { name: 'Bremen', slug: 'bremen' },
    { name: 'Mannheim', slug: 'mannheim' },
  ];

  const services: ServiceCard[] = [
    {
      icon: Search,
      title: 'Digitale Bauzustandsbewertung',
      description: 'Professionelle Schadensanalyse durch Diplom-Sachverständigen (DIA)',
      features: [
        'Strukturierte Bewertung aller Gebäudebereiche',
        'Risikoeinstufung nach Priorität',
        'Kostenrahmen pro Gewerk',
        'Handlungs- und Wartungsempfehlungen',
      ],
      info: {
        tagline:
          'Traditionelle Vor-Ort-Gutachten kosten 800-1.500€, erfordern Verkäufer-Zustimmung und dauern Wochen. Unsere digitale Lösung liefert die gleiche Expertise in 48h für nur 350€ – komplett online.',
        sections: [
          {
            title: 'Sie erhalten',
            items: [
              'Bewertung durch Diplom-Sachverständigen (DIA) mit 15+ Jahren Erfahrung',
              'Priorisierung aller Mängel nach Dringlichkeit',
              'Kostenschätzungen für Reparaturen pro Gewerk',
              '14-16 Seiten PDF-Bericht mit Handlungsempfehlungen',
            ],
          },
          {
            title: 'Ideal, wenn',
            items: [
              'Sie bei "wie gesehen"-Verkäufen keine Gewährleistung erhalten',
              'Die Kaufentscheidung unter Zeitdruck steht',
              'Sie 800€+ für traditionelle Gutachten sparen wollen',
              'Der Verkäufer keinen Gutachter-Termin ermöglicht',
              'Sie eine zweite Meinung benötigen',
            ],
          },
          {
            title: 'Ablauf in 3 Schritten',
            items: [
              'Fotos hochladen (10 Min mit Smartphone)',
              'Sachverständiger analysiert (48h Bearbeitungszeit garantiert)',
              'Gutachten als PDF erhalten (rechtlich verwertbar)',
            ],
          },
        ],
        note:
          'Hinweis: Fehlende Unterlagen können innerhalb von 24 Stunden nachgereicht werden. Die Bewertung pausiert automatisch, bis alle Informationen vorliegen.',
      },
      popular: true,
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
    <>
      <ServiceSchema />
      <section id="leistungen" className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-text-100 md:text-4xl">
            Warum digital?
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-text-200">
            Die moderne Alternative zum traditionellen Gutachter
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8">
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

              <CardHeader className="pb-4 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
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
              Warum Bauklar.org?
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

          {/* Wo wir vertreten sind */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
              Wo wir vertreten sind:
            </h3>
            <p className="text-text-200 mb-8 max-w-2xl mx-auto">
              Hier finden Sie uns und noch weitere Informationen zu den jeweiligen Städten.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}`}
                  onClick={() => {
                    // Scroll zur oberen Position nach Navigation
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                  }}
                  className="inline-flex items-center justify-center px-4 py-3 rounded-md font-medium text-sm transition-all duration-200 bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-strong hover-lift"
                >
                  {city.name}
                </Link>
              ))}
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
    </>
  );
};

export default ServicesSection;

