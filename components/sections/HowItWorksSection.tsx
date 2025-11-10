"use client";

import React, { useEffect, useRef } from 'react';
import { Upload, Bot, CheckCircle, Shield, Clock, Zap } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: 1,
      icon: Upload,
      title: 'Fotos und Angaben hochladen',
      subtitle: '2 Minuten',
      description: 'Wählen Sie die gewünschten Bereiche aus (z. B. Dach, Fassade, Keller). Laden Sie pro Bereich Ihre Fotos hoch, ergänzen Sie Basisdaten wie Adresse und Baujahr sowie kurze Hinweise aus der Besichtigung.',
      details: [
        'Drag & Drop für mehrere Bilder',
        'Bis zu 20 Fotos pro Bereich',
        'Notizfeld je Bereich für Zusatzinfos',
        'Geschützte Übertragung'
      ]
    },
    {
      step: 2,
      icon: Bot,
      title: 'Prüfung durch Sachverständige',
      subtitle: 'Fachliche Auswertung',
      description: 'Unsere Gutachter sichten Bilder und Angaben, ordnen Befunde ein und bewerten Risiken. Unklare Punkte werden plausibilisiert, Prioritäten nachvollziehbar begründet.',
      details: [
        'Strukturierte Bewertung pro Bereich',
        'Plausibilitätscheck der Angaben',
        'Rückfragen bei Bedarf',
        'Klare Prioritäten nach Dringlichkeit'
      ]
    },
    {
      step: 3,
      icon: CheckCircle,
      title: 'Ergebnis und Empfehlung',
      subtitle: 'Innerhalb von 48 Stunden',
      description: 'Sie erhalten ein kompaktes Gutachten als PDF mit kurzer Zusammenfassung, allgemeinen Hinweisen und präzisen Texten zu jedem Bereich. Inklusive vorsichtiger Kostenrahmen und konkreter nächsten Schritte.',
      details: [
        'Übersichtlich aufbereitet',
        'Plausible Kostenrahmen',
        'Handlungs- und Wartungsempfehlungen'
      ]
    }
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: 'DSGVO-konform',
      description: 'Ihre Daten werden nach höchsten Datenschutzstandards verarbeitet'
    },
    {
      icon: Clock,
      title: 'TLS-Verschlüsselung',
      description: 'Alle Uploads sind mit 256-Bit-Verschlüsselung gesichert'
    },
    {
      icon: Zap,
      title: 'Automatische Löschung',
      description: 'Daten werden nach Projektabschluss automatisch gelöscht'
    }
  ];

  const stepsHeadRef = useRef<HTMLDivElement | null>(null);
  const connectorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const head = stepsHeadRef.current;
    const connector = connectorRef.current;
    if (!head || !connector) {
      return;
    }

    let debounceId: number | null = null;

    const updateConnector = () => {
      if (!head || !connector) {
        return;
      }

      if (window.innerWidth < 768) {
        connector.style.display = 'none';
        return;
      }

      const icons = head.querySelectorAll<HTMLElement>('.step-icon');
      if (icons.length < 3) {
        connector.style.display = 'none';
        return;
      }

      const headRect = head.getBoundingClientRect();
      const iconOneRect = icons[0].getBoundingClientRect();
      const iconThreeRect = icons[2].getBoundingClientRect();

      const start = iconOneRect.right + 16;
      const end = iconThreeRect.left - 16;
      const width = end - start;

      if (width <= 0) {
        connector.style.display = 'none';
        return;
      }

      connector.style.display = '';
      connector.style.left = `${start - headRect.left}px`;
      connector.style.width = `${width}px`;
      const midY =
        iconOneRect.top + iconOneRect.height / 2 - headRect.top;
      connector.style.top = `${midY}px`;
    };

    const handleResize = () => {
      if (debounceId) {
        window.clearTimeout(debounceId);
      }
      debounceId = window.setTimeout(() => {
        updateConnector();
      }, 100);
    };

    updateConnector();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (debounceId) {
        window.clearTimeout(debounceId);
      }
    };
  }, []);

  return (
    <section id="so-funktioniert" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-100 mb-4">
            So funktioniert's
          </h2>
          <p className="text-xl text-text-200 max-w-2xl mx-auto">
            Von der Anfrage zur fundierten Kaufentscheidung in nur 3 einfachen Schritten
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div
            ref={stepsHeadRef}
            className="steps-head grid gap-8 mb-16 lg:grid-cols-3"
          >
            <div
              ref={connectorRef}
              className="steps-connector"
              aria-hidden="true"
            />
            {steps.map((step, index) => (
              <div key={index} className="step relative text-center">
                <div className="relative z-10">
                  {/* Step Number & Icon */}
                  <div className="step-icon w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-primary" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-text-100 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-text-200 mb-4">
                    {step.description}
                  </p>
                  
                  {/* Details */}
                  <ul className="text-sm text-text-200 space-y-1">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center justify-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Demo Preview */}
          <div className="bg-bg-200 rounded-xl p-8 mb-12">
            <h3 className="text-lg font-semibold text-text-100 mb-4 text-center">
              Beispiel: Typischer Analyseprozess
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">📸</span>
                </div>
                <p className="text-sm text-text-200">
                  <strong>Bis zu 20 Fotos</strong><br />in 6 verschiedenen Bereichen
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
                <p className="text-sm text-text-200">
                  <strong>127 Prüfpunkte</strong><br />automatisch analysiert
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <p className="text-sm text-text-200">
                  <strong>Detailbericht</strong><br />mit Handlungsempfehlung
                </p>
              </div>
            </div>
          </div>

          {/* Security & Trust */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-text-100 mb-8">
              Sicherheit & Datenschutz
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex flex-col items-center p-4">
                  <feature.icon className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-medium text-text-100 mb-2">{feature.title}</h4>
                  <p className="text-sm text-text-200 text-center">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-text-200 mt-8 max-w-2xl mx-auto leading-relaxed">
              Micro-Copy zur Sicherheit: Alle Daten werden verschlüsselt übertragen und DSGVO-konform verarbeitet. 
              Nach Abschluss Ihres Auftrags werden alle hochgeladenen Dateien automatisch gelöscht. 
              Ihre Privatsphäre ist unser höchstes Gut.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

