"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Shield, Clock, CheckCircle, Star } from 'lucide-react';

const HeroSection: React.FC = () => {
  const router = useRouter();
  
  const handleStartEvaluation = () => {
    router.push('/evaluation');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const trustBadges = [
    {
      icon: Shield,
      text: 'Datenschutz nach DSGVO'
    },
    {
      icon: CheckCircle,
      text: 'Verschlüsselte Übertragung (TLS)'
    },
    {
      icon: Star,
      text: 'Erfahrung seit 2010'
    },
    {
      icon: Clock,
      text: 'Über 500 geprüfte Objekte'
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 pb-12">
      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient opacity-30"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Headlines */}
          <h1 className="text-4xl md:text-6xl font-bold text-text-100 mb-6 hero-title">
            Professionelle <br className="block md:hidden" /> Bauschadensbewertung  {' '}
            <span className="text-primary">schnell, transparent, verlässlich</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-text-200 mb-8 max-w-3xl mx-auto">
            Prüfen Sie Ihr Wunschobjekt vor dem Kauf. 
            Ergebnis spätestens innerhalb von 48 Stunden.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={handleStartEvaluation}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 text-lg shadow-strong hover-lift"
            >
              Jetzt Bewertung starten
            </Button>
            
            <Button
              onClick={() => scrollToSection('so-funktioniert')}
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-4 text-lg transition-smooth"
            >
              So funktioniert's
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 rounded-lg bg-background/80 backdrop-blur-sm shadow-soft hover-lift"
              >
                <badge.icon className="w-6 h-6 text-primary mb-2" />
                <span className="text-sm text-text-200 text-center font-medium">
                  {badge.text}
                </span>
              </div>
            ))}
          </div>

          {/* Additional Trust Elements */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-text-200">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-sm">4.9/5 Kundenbewertung</span>
            </div>
            
            <div className="text-sm">
              Über 95% Weiterempfehlungsrate
            </div>
            {/* Mobile-only scroll indicator (original position) */}
            <div className="mt-2 md:hidden">
              <div className="w-6 h-10 border-2 border-text-200 rounded-full flex justify-center animate-bounce">
                <div className="w-1 h-3 bg-text-200 rounded-full mt-2"></div>
              </div>
            </div>
          </div>

          {/* Desktop-only scroll indicator (below all content) */}
          <div className="hidden md:flex justify-center mt-12">
            <div className="w-6 h-10 border-2 border-text-200 rounded-full flex justify-center animate-bounce">
              <div className="w-1 h-3 bg-text-200 rounded-full mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


