"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, BarChart3, ListChecks, Shield } from "lucide-react";
import { ServiceSchema } from "@/components/seo/ServiceSchema";

const MainServicesSection: React.FC = () => {
  const router = useRouter();

  const handleStartEvaluation = () => {
    router.push("/auftrag");
  };

  const cities = [
    { name: "Berlin", slug: "berlin" },
    { name: "Hamburg", slug: "hamburg" },
    { name: "München", slug: "muenchen" },
    { name: "Köln", slug: "koeln" },
    { name: "Düsseldorf", slug: "duesseldorf" },
    { name: "Dortmund", slug: "dortmund" },
    { name: "Essen", slug: "essen" },
    { name: "Frankfurt", slug: "frankfurt" },
    { name: "Stuttgart", slug: "stuttgart" },
    { name: "Nürnberg", slug: "nuernberg" },
    { name: "Leipzig", slug: "leipzig" },
    { name: "Dresden", slug: "dresden" },
    { name: "Hannover", slug: "hannover" },
    { name: "Bremen", slug: "bremen" },
    { name: "Mannheim", slug: "mannheim" },
  ];

  const reportContents = [
    {
      icon: FileText,
      title: "Zusammenfassung",
      description: "Ampel-Bewertung pro Bereich — sofort erkennen, wo Handlungsbedarf besteht.",
    },
    {
      icon: BarChart3,
      title: "Detailanalyse",
      description: "Jeder Gebäudebereich wird einzeln bewertet: Fassade, Dach, Keller, Haustechnik, Innenräume.",
    },
    {
      icon: ListChecks,
      title: "Kostenschätzung",
      description: "Plausible Kostenrahmen für nötige Reparaturen — aufgeschlüsselt nach Gewerk und Dringlichkeit.",
    },
    {
      icon: Shield,
      title: "Handlungsempfehlung",
      description: "Klare Antwort: Kaufen, nachverhandeln oder Finger weg. Mit konkreten nächsten Schritten.",
    },
  ];

  return (
    <>
      <ServiceSchema />
      <section id="leistungen" className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-text-100 md:text-4xl">
              Was Sie erhalten
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-text-200">
              14–16 Seiten Fachgutachten mit allem, was Sie für eine fundierte Kaufentscheidung brauchen
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-sm">
                  <div className="absolute top-3 left-3 w-full h-full bg-bg-200 border border-primary-200/40 rounded-lg" />
                  <div className="absolute top-1.5 left-1.5 w-full h-full bg-bg-200 border border-primary-200/40 rounded-lg" />
                  <div className="relative bg-white border border-primary-200/60 rounded-lg p-6 shadow-soft">
                    <div className="text-xs text-text-300 uppercase tracking-wider mb-3">Beispiel-Auszug</div>
                    <h4 className="text-base font-bold text-text-100 mb-4">Bewertungsbericht</h4>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-success-100" />
                        <span className="text-xs text-text-200">Dach — keine Auffälligkeiten</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-success-100" />
                        <span className="text-xs text-text-200">Fassade — guter Zustand</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[hsl(45,100%,50%)]" />
                        <span className="text-xs text-text-200">Keller — Feuchtigkeit prüfen</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive" />
                        <span className="text-xs text-text-200">Haustechnik — Handlungsbedarf</span>
                      </div>
                    </div>

                    <div className="border-t border-primary-200/40 pt-3">
                      <div className="text-xs text-text-300 mb-1">Geschätzte Sanierungskosten</div>
                      <div className="text-sm font-semibold text-text-100">12.500 – 18.000 €</div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-text-300 mt-4 text-center">
                  Vereinfachte Darstellung — echter Bericht enthält deutlich mehr Detail
                </p>
              </div>

              <div className="space-y-6">
                {reportContents.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-text-100 mb-1">{item.title}</h3>
                      <p className="text-sm text-text-200 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}

                <div className="pt-4">
                  <Button
                    onClick={handleStartEvaluation}
                    className="group bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                    size="lg"
                  >
                    Jetzt Objekt prüfen lassen
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-lg font-semibold text-text-100 mb-4">Wo wir vertreten sind</h3>
            <p className="text-text-200 mb-8 max-w-2xl mx-auto text-sm">
              Weitere Informationen zu den jeweiligen Städten finden Sie hier.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-w-4xl mx-auto">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}`}
                  onClick={() => {
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }, 100);
                  }}
                  className="inline-flex items-center justify-center px-3 py-2 rounded-md text-sm text-text-200 hover:text-primary hover:bg-primary-100 transition-smooth"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MainServicesSection;

