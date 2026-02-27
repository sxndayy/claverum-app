"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Check,
  Clock,
  RefreshCw,
  Shield,
  ShieldCheck,
  Star,
  Video,
  FileText,
  ArrowRight,
} from "lucide-react";

const baseFeatures = [
  "Strukturierte Analyse der wesentlichen Bauteile (Keller, Fassade, Dach, Heizung, Elektro, Innenräume, Bäder, Fenster)",
  "Einschätzung sichtbarer und typischer Schadensrisiken",
  "Indikation zu absehbarem Sanierungsbedarf",
  "Grobe Kostenspannen zur Orientierung",
  "Klar gegliederter Bericht (PDF) als Entscheidungsgrundlage",
  "Bearbeitungszeit: i.d.R. 48 Stunden",
];

const intensivExclusiveFeatures = [
  "Vertiefte Kosteneinschätzung mit realistischeren Bandbreiten",
  "Priorisierung der Risiken (kaufentscheidend vs. nachrangig)",
  "Einschätzung zur Verhandlungsrelevanz einzelner Mängel",
  "Konkrete Empfehlung: Kaufen, nachverhandeln oder Finger weg?",
  "45-minütiges persönliches Video-Gespräch",
  "Schriftliche Zusammenfassung der Gesprächsergebnisse",
];

const StartPricingSection: React.FC = () => {
  const router = useRouter();

  const handleStartEvaluation = () => {
    router.push("/auftrag");
  };

  return (
    <section id="preise" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm text-text-300 mb-3 line-through">
            Klassisches Vor-Ort-Gutachten: ab 1.200 €
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-text-100 mb-4">
            Transparente Preise, klare Leistung
          </h2>
          <p className="text-xl text-text-200 max-w-2xl mx-auto">
            Zwei Pakete. Ein Ziel: Ihre sichere Kaufentscheidung.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto mb-12">
          {/* Bauklar Analyse Card */}
          <Card className="relative flex flex-col border border-primary-200 shadow-soft hover-lift transition-smooth order-2 md:order-1 overflow-hidden">
            <CardHeader className="text-center pt-8 pb-4">
              <h3 className="text-xl font-bold text-text-100 mb-1">
                Bauklar Analyse
              </h3>
              <p className="text-sm text-text-300 mb-5">
                Technische Bauzustandsanalyse vor dem Kauf
              </p>

              <div className="mb-4">
                <span className="text-4xl font-bold text-primary">350 €</span>
                <span className="text-text-300 text-sm ml-1.5">
                  inkl. MwSt.
                </span>
              </div>

              <p className="text-sm text-text-300 italic">
                Ideal, wenn Sie eine fundierte Zweitmeinung benötigen
              </p>
            </CardHeader>

            <CardContent className="flex-1 pt-0 flex flex-col">
              <ul className="space-y-2.5 mb-6 flex-1">
                {baseFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-success-100 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-text-200">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-auto pt-4">
                <Button
                  onClick={handleStartEvaluation}
                  className="w-full font-semibold border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white"
                  size="lg"
                >
                  Analyse beauftragen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="flex items-center justify-center gap-4 mt-3 text-xs text-text-300">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Ergebnis in 48h
                  </span>
                  <span className="flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    Geld-zurück-Garantie
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bauklar Intensiv Card */}
          <Card className="relative flex flex-col ring-2 ring-primary shadow-strong hover-lift transition-smooth order-1 md:order-2 overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1 bg-primary w-full" />

            {/* Badge */}
            <div className="flex justify-center pt-4 -mb-1">
              <span className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                <Star className="w-3 h-3 fill-current" />
                Meistgebucht
              </span>
            </div>

            <CardHeader className="text-center pt-4 pb-4">
              <h3 className="text-xl font-bold text-text-100 mb-1">
                Bauklar Intensiv
              </h3>
              <p className="text-sm text-text-300 mb-5">
                Vertiefte Analyse & persönliche Entscheidungsbegleitung
              </p>

              <div className="mb-4">
                <span className="text-4xl font-bold text-primary">790 €</span>
                <span className="text-text-300 text-sm ml-1.5">
                  inkl. MwSt.
                </span>
              </div>

              <p className="text-sm text-text-300 italic">
                Ideal, wenn Sie maximale Klarheit vor dem Kauf wünschen
              </p>
            </CardHeader>

            <CardContent className="flex-1 pt-0 flex flex-col">
              {/* Reference to Analyse */}
              <div className="flex items-center gap-2.5 mb-4 py-2.5 px-3 bg-bg-200 rounded-lg">
                <Check className="w-4 h-4 text-success-100 flex-shrink-0" />
                <span className="text-sm text-text-200">
                  Alle Leistungen der <span className="font-semibold text-text-100">Bauklar Analyse</span>
                </span>
              </div>

              {/* Plus separator */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-primary-200" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Zusätzlich
                </span>
                <div className="flex-1 h-px bg-primary-200" />
              </div>

              {/* Exclusive features */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {intensivExclusiveFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-text-100 font-medium">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-auto pt-4">
                <Button
                  onClick={handleStartEvaluation}
                  className="w-full font-semibold bg-primary hover:bg-accent-300 text-white"
                  size="lg"
                >
                  Intensiv beauftragen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="flex items-center justify-center gap-4 mt-3 text-xs text-text-300">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Ergebnis in 48h
                  </span>
                  <span className="flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    Geld-zurück-Garantie
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Decision Helper */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-bg-200 rounded-xl p-8">
            <h3 className="text-lg font-semibold text-text-100 mb-6 text-center">
              Welche Variante ist die richtige für mich?
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Analyse */}
              <div>
                <h4 className="font-semibold text-text-100 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Bauklar Analyse
                </h4>
                <ul className="space-y-2 text-sm text-text-200">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    Sie wünschen eine fundierte Zweitmeinung
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    Sie möchten Risiken besser einschätzen
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    Sie benötigen eine strukturierte Entscheidungsgrundlage
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    Sie sind selbst gut vorbereitet und brauchen keine intensive Begleitung
                  </li>
                </ul>
              </div>

              {/* Intensiv */}
              <div>
                <h4 className="font-semibold text-text-100 mb-3 flex items-center gap-2">
                  <Video className="w-4 h-4 text-primary" />
                  Bauklar Intensiv
                </h4>
                <ul className="space-y-2 text-sm text-text-200">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    Sie stehen kurz vor einer Kaufentscheidung
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    Hohe Investitionssummen stehen im Raum
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    Sie möchten Verhandlungssicherheit gewinnen
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    Sie möchten technische Risiken nicht selbst einordnen
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default StartPricingSection;
