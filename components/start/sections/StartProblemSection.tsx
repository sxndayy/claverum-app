"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Droplets, TrendingDown, AlertTriangle } from "lucide-react";

const StartProblemSection: React.FC = () => {
  const router = useRouter();

  const handleStartEvaluation = () => {
    router.push("/auftrag");
  };

  const risks = [
    {
      icon: Droplets,
      title: "Versteckte Feuchteschäden",
      description:
        "Was Sie bei der Besichtigung nicht sehen, kann Sanierungskosten von 15.000–40.000 € verursachen. Feuchtigkeit im Mauerwerk zeigt sich oft erst nach dem Kauf.",
    },
    {
      icon: AlertTriangle,
      title: "Statische Mängel",
      description:
        "Risse in der Fassade können harmlos sein — oder auf Fundamentprobleme hinweisen. Der Unterschied: 200 € Schönheitsreparatur oder 80.000 € Sanierung.",
    },
    {
      icon: TrendingDown,
      title: "Stärkere Verhandlungsposition",
      description:
        "Käufer mit einem fachlichen Bewertungsbericht verhandeln den Kaufpreis oft deutlich herunter — weil sie wissen, was tatsächlich ansteht.",
    },
  ];

  return (
    <section id="warum-vorab-pruefung" className="py-20 bg-bg-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-100 mb-4">
            Warum eine Vorab-Prüfung?
          </h2>
          <p className="text-xl text-text-200 max-w-2xl mx-auto">
            Die meisten Baumängel sind bei einer normalen Besichtigung nicht erkennbar.
            Ein Fachgutachten schützt Sie vor teuren Überraschungen.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {risks.map((risk, index) => (
            <div
              key={index}
              className="bg-bg-200 rounded-xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <risk.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-100 mb-3">
                {risk.title}
              </h3>
              <p className="text-sm text-text-200 leading-relaxed">
                {risk.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-text-200 mb-6">
            Erkennen Sie Risiken, bevor Sie unterschreiben.
          </p>
          <Button
            onClick={handleStartEvaluation}
            className="bg-accent-200 hover:bg-accent-300 text-white font-semibold px-8 py-6 text-lg rounded-lg"
          >
            Kostenlose Ersteinschätzung
          </Button>
          <p className="text-sm text-text-300 mt-3">
            350 € Gesamtpaket · Ergebnis in 48 Stunden
          </p>
        </div>
      </div>
    </section>
  );
};

export default StartProblemSection;
