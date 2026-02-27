"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import Image from "next/image";
import TrustLogoCarousel from "./TrustLogoCarousel";

const StartHeroSection: React.FC = () => {
  const router = useRouter();

  const handleStartEvaluation = () => {
    router.push("/auftrag");
  };

  return (
    <section id="hero" className="relative pt-20 lg:pt-28 pb-8 lg:pb-20 bg-white overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          className="object-cover object-bottom"
          priority
        />
      </div>
      {/* Subtle bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent z-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[58%_42%] gap-6 lg:gap-12 items-center">
          {/* Content: order-1 on mobile (FIRST), order-1 on desktop (LEFT) */}
          <div className="text-center lg:text-left order-1 lg:order-1">
            {/* Mobile-only: Compact expert trust badge */}
            <div className="flex items-center gap-3 justify-center mb-5 lg:hidden">
              <div className="relative w-[100px] h-[100px] rounded-full border-2 border-primary-200 overflow-hidden flex-shrink-0 bg-white/80 shadow-soft">
                <Image
                  src="/Johannes-no-background.png"
                  alt="Dr. Johannes Stankiewicz"
                  width={100}
                  height={125}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-text-100">
                  Dr. Johannes Stankiewicz
                </p>
                <p className="text-xs text-text-300">
                  Diplom-Sachverst. (DIA) · 15+ Jahre
                </p>
              </div>
            </div>

            <h1 className="text-3xl md:text-[2.75rem] leading-tight md:leading-[1.15] font-bold text-text-100 mb-5 tracking-tight">
              Technische Prüfung vor dem Immobilienkauf
            </h1>

            <p className="text-lg text-text-200 mb-6 lg:mb-8 max-w-lg mx-auto lg:mx-0">
              Wir analysieren die bauliche Substanz Ihrer Wunschimmobilie und identifizieren Risiken sowie Sanierungsbedarf – strukturiert, unabhängig und ohne klassischen Vor-Ort-Termin.
            </p>

            {/* Stats Row */}
            <div className="flex items-start gap-6 md:gap-10 mb-6 lg:mb-8 justify-center lg:justify-start">
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-primary-300">
                  Ab 350 €
                </div>
                <div className="text-xs text-text-300 mt-1">Gesamtpaket</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-primary-300">
                  48h
                </div>
                <div className="text-xs text-text-300 mt-1">Ergebnis in 48h</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-primary-300">
                  500+
                </div>
                <div className="text-xs text-text-300 mt-1">geprüfte Objekte</div>
              </div>
            </div>

            {/* Trust line - ABOVE CTA on mobile for better conversion */}
            <div className="flex items-center gap-1.5 mb-4 justify-center lg:hidden">
              {[...Array(5)].map((_, i) => (
                <svg key={`mobile-star-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-text-300 ml-1">500+ zufriedene Kunden</span>
            </div>

            {/* CTA */}
            <div className="mb-3">
              <Button
                onClick={handleStartEvaluation}
                className="bg-accent-200 hover:bg-accent-300 text-white font-semibold px-10 py-6 text-lg rounded-lg w-full sm:w-auto"
              >
                Kostenlose Ersteinschätzung
              </Button>
            </div>
            <p className="text-sm text-text-300">
              Transparente Bauzustandsanalyse • Klare Handlungsempfehlung • Geld-zurück-Garantie
            </p>
            {/* Mobile Trust Logo Carousel: full width, below hero text */}
            <div className="block lg:hidden w-full mt-4 mb-6">
              <TrustLogoCarousel />
            </div>

            {/* Trust divider - Desktop only (mobile has trust above CTA) */}
            <div className="hidden lg:block mt-10 pt-6 border-t-2 border-primary-200">
              <div className="flex items-center gap-1 mb-2 justify-start">
                {[...Array(5)].map((_, i) => (
                  <svg key={`desktop-star-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-text-300">
                Vertraut von 500+ Immobilienkäufern deutschlandweit
              </p>
            </div>

            {/* Phone CTA - Desktop only */}
            <div className="hidden lg:flex mt-6 flex-col items-start gap-2">
              <p className="text-sm text-text-300">
                Kostenloses Erstgespräch:
              </p>
              <a
                href="tel:+4932221804909"
                className="inline-flex items-center gap-2 text-accent-200 hover:text-accent-300 font-semibold text-base transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                +49 322 21804909
              </a>
            </div>
          </div>

          {/* Right: Photo + Credentials - Desktop only (hidden on mobile) */}
          <div className="hidden lg:flex flex-col items-center order-2">
            {/* Photo with subtle background */}
            <div className="relative w-full max-w-[340px]">
              <div className="relative rounded-xl border-2 border-primary-200 bg-white/80 shadow-soft overflow-hidden">
                <Image
                  src="/Johannes-no-background.png"
                  alt="Dr. Johannes Stankiewicz - Diplom-Sachverständiger"
                  width={400}
                  height={500}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>

            {/* Credential block */}
            <div className="mt-4 text-center">
              <p className="text-lg font-bold text-text-100">
                Dr. Johannes Stankiewicz
              </p>
              <p className="text-sm text-text-300 mt-1">
                Diplom-Sachverständiger (DIA) · BSV-Mitglied · 15+ Jahre
              </p>
            </div>

            {/* Badges row */}
            <div className="mt-4 flex items-center justify-center w-full max-w-[340px]">
              <Image
                src="/BSV.png"
                alt="Bundesverband der Sachverständigen"
                width={202}
                height={67}
                sizes="202px"
                className="h-auto w-[202px] opacity-90"
              />
            </div>
          </div>
        </div>

        {/* Trust Logo Carousel — full width, centered, Desktop only */}
        <div className="hidden lg:block -mb-[108px] -translate-y-12 -translate-x-6 max-w-6xl mx-auto">
          <TrustLogoCarousel />
        </div>
      </div>
    </section>
  );
};

export default StartHeroSection;
