"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const MainCTASection = () => {
  const router = useRouter();

  const handleStartEvaluation = () => {
    router.push("/auftrag");
  };

  return (
    <section id="cta" className="py-16 bg-primary-300">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Sichern Sie sich Klarheit — bevor Sie unterschreiben.
          </h2>
          <p className="text-lg text-white/70 mb-8">
            14–16 Seiten Fachgutachten durch einen Diplom-Sachverständigen.
            Ergebnis in 48 Stunden. Geld-zurück-Garantie.
          </p>
          <Button
            onClick={handleStartEvaluation}
            size="lg"
            className="bg-white text-primary-300 hover:bg-bg-200 font-semibold px-8"
          >
            Jetzt Objekt prüfen lassen
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-white/50 mt-4">
            Ergebnis in 48 Stunden · 14 Tage Widerrufsrecht
          </p>
        </div>
      </div>
    </section>
  );
};

export default MainCTASection;

