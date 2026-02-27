"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const HeroSection: React.FC = () => {
  const router = useRouter();

  const handleStartEvaluation = () => {
    router.push("/auftrag");
  };

  return (
    <section className="relative pt-24 md:pt-28 pb-16 md:pb-20 bg-bg-200">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[42%_58%] gap-10 lg:gap-16 items-start">
          {/* Left: Photo */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-[256px] md:max-w-[420px] aspect-[3/4] mt-2 md:mt-4 lg:mt-10 lg:-ml-2">
              <Image
                src="/Johannes.png"
                alt="Dr. Johannes Stankiewicz - Diplom-Sachverständiger"
                width={420}
                height={560}
                className="rounded-xl object-cover shadow-lg"
                priority
              />
            </div>

            <p className="mt-0 text-base font-bold text-text-100 text-center">
              Dr. Johannes Stankiewicz
            </p>

            {/* Desktop: BSV logo under name (centered under photo) */}
            <div className="hidden lg:flex mt-3">
              <Image
                src="/BSV.png"
                alt="BSV Logo"
                width={210}
                height={70}
                sizes="210px"
                className="h-auto w-[210px]"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="text-center lg:text-left lg:mt-14 lg:pl-4">
            <h1 className="text-3xl md:text-[2.5rem] leading-tight md:leading-[1.25] font-bold text-text-100 mb-4 hero-title">
              <span className="block md:inline">Professionelles Baugutachten –</span>{" "}
              <span className="block md:inline whitespace-nowrap">
                <span className="text-accent-100">digital</span> in <span className="text-accent-200">48h</span>
              </span>
              <br className="hidden md:block" />
              Durch Diplom-Sachverständigen (DIA)
            </h1>

            <p className="text-lg text-text-200 mb-6">
              Professionelle Schadensanalyse, Kostenschätzung und klare Handlungsempfehlungen — komplett{" "}
              <span className="text-accent-100 font-semibold">remote</span> für nur{" "}
              <span className="font-bold">350 € inkl. MwSt.</span>
            </p>

            <ul className="space-y-3 mb-6 text-left max-w-[420px] mx-auto lg:mx-0">
              <li className="flex items-start gap-3 justify-start">
                <span className="text-success-100 text-xl flex-shrink-0 mt-0.5">✓</span>
                <span className="text-text-200 font-medium">Über 500 geprüfte Immobilien deutschlandweit</span>
              </li>
              <li className="flex items-start gap-3 justify-start">
                <span className="text-success-100 text-xl flex-shrink-0 mt-0.5">✓</span>
                <span className="text-text-200 font-medium">Starten ab 82,50€ Anzahlung — Rest erst nach Prüfung</span>
              </li>
              <li className="flex items-start gap-3 justify-start">
                <span className="text-success-100 text-xl flex-shrink-0 mt-0.5">✓</span>
                <span className="text-text-200 font-medium">48h Ergebnis garantiert — kein Vor-Ort-Termin</span>
              </li>
            </ul>

            <div className="mb-4 flex justify-center lg:justify-start">
              <Button
                onClick={handleStartEvaluation}
                className="bg-accent-200 hover:bg-accent-300 text-white font-bold px-10 py-6 text-lg rounded-lg shadow-md"
              >
                Jetzt starten
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-text-300 mt-1">
              <span className="text-[#F59E0B] text-[20px] leading-none">★★★★★</span>
              <span>4.9/5 — Über 500 zufriedene Kunden</span>
            </div>

            {/* Mobile: BSV logo under stars */}
            <div className="mt-4 flex justify-center lg:hidden">
              <Image
                src="/BSV.png"
                alt="BSV Logo"
                width={190}
                height={64}
                sizes="190px"
                className="h-auto w-[190px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
 