import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Clock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PricingSection: React.FC = () => {
  const navigate = useNavigate();
  
  const handleStartEvaluation = () => {
    navigate('/evaluation');
  };

  const packages = [
    {
      name: 'All-in-one',
      price: 499,
      popular: true,
      description: 'Fachgerechte Prüfung und Bewertung für verlässliche Entscheidungen',
      features: [
        'Alle Basisleistungen',
        'Prüfung durch erfahrene Sachverständige',
        'Klare Handlungsempfehlungen',
        'Kostenschätzung für Reparaturen',
        'Priorisierung nach Dringlichkeit',
        'Bewertungsbericht (14–16 Seiten)',
        'Ergebnis innerhalb 48 Stunden',
        'Telefonischer Support'
      ],
      deliveryTime: '48h',
      bestFor: 'Kaufentscheidung'
    }
  ];

  return (
    <section id="preise" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-100 mb-4">
            Transparente Preise
          </h2>
          <p className="text-xl text-text-200 max-w-2xl mx-auto">
            Wir sind transparent über unsere Preise und so auch über unseren Service. Alle Preise verstehen sich inkl. MwSt.

          </p>
        </div>

        <div className="grid gap-8 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto mb-12">
          {packages.map((pkg, index) => (
            <Card 
              key={index}
              className={`relative hover-lift transition-smooth ${
                pkg.popular 
                  ? 'ring-2 ring-primary shadow-strong scale-105' 
                  : 'shadow-soft'
              }`}
            >
              {/* Badge removed as requested */}

              {/* Desktop title centered across both columns */}
              <div className="hidden lg:block pt-6">
                <h3 className="text-2xl font-bold text-text-100 text-center">
                  {pkg.name}
                </h3>
              </div>

              <div className="lg:flex lg:gap-8">
                {/* Left column: existing content */}
                <div className="lg:flex-1">
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-text-100 mb-2 lg:hidden">
                      {pkg.name}
                    </CardTitle>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-primary">{pkg.price}€</span>
                      <span className="text-text-200 text-sm ml-1">inkl. MwSt.</span>
                    </div>
                    <p className="text-text-200 text-sm">
                      {pkg.description}
                    </p>
                    {/* Quick Info */}
                    <div className="flex justify-center gap-4 mt-4 text-xs">
                      <div className="flex items-center gap-1 text-primary">
                        <Clock className="w-3 h-3" />
                        {pkg.deliveryTime}
                      </div>
                      <div className="flex items-center gap-1 text-text-200">
                        <Shield className="w-3 h-3" />
                        {pkg.bestFor}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-text-200">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA will be rendered below the two-column layout to span full card width */}
                  </CardContent>
                </div>

                {/* Center divider (desktop only) */}
                <div className="hidden lg:flex items-center">
                  <div className="w-px h-[70%] bg-border" />
                </div>

                {/* Right column: Unser Versprechen (desktop only) */}
                <div className="hidden lg:block lg:flex-[0.9] self-center">
                  <h4 className="text-lg font-semibold text-text-100 mb-4">Unser Versprechen:</h4>
                  <ul className="space-y-6 text-sm text-text-200">
                    <li>
                      <span className="font-medium text-text-100">Schnell: </span>
                      Sie erhalten Ihr Ergebnis innerhalb von 48 Stunden, damit Sie zeitnah und sicher entscheiden können.
                    </li>
                    <li>
                      <span className="font-medium text-text-100">Transparent: </span>
                      Alle Leistungen und Preise sind klar beschrieben, vollständig nachvollziehbar und fair kalkuliert.
                    </li>
                    <li>
                      <span className="font-medium text-text-100">Verlässlich: </span>
                      Jede Einschätzung erfolgt unabhängig, fachlich fundiert und mit höchster Sorgfalt durch erfahrene Gutachter.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Full-width CTA within card padding (consistent style) */}
              <div className="px-6 pb-6">
                <Button
                  onClick={handleStartEvaluation}
                  className={`w-full font-medium ${
                    pkg.popular 
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                      : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'
                  }`}
                  size="lg"
                >
                  Jetzt starten
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-bg-200 rounded-xl p-8 mb-8">
            <h3 className="text-lg font-semibold text-text-100 mb-4 text-center">
              💡 Schnellergebnis bis nächster Werktag
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-text-200">
              <div>
                <strong className="text-text-100">Geld-zurück-Garantie:</strong><br />
                14 Tage Widerrufsrecht ohne Angabe von Gründen
              </div>
              <div>
                <strong className="text-text-100">Keine versteckten Kosten:</strong><br />
                Alle Preise sind Endpreise inkl. MwSt. und Bearbeitung
              </div>
            </div>
          </div>

          {/* FAQ Preview */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-text-100 mb-4">
              Unsicher welches Paket das richtige ist?
            </h3>
            <p className="text-text-200 mb-6">
              Unser kurzer Fragebogen hilft Ihnen bei der Auswahl des optimalen Pakets
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="border bg-transparent text-text-100 hover:bg-bg-100" onClick={() => {
                const element = document.getElementById('faq');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}>
                Häufige Fragen ansehen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;