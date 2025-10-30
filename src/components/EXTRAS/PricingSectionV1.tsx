import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Clock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PricingSectionV1: React.FC = () => {
  const navigate = useNavigate();
  
  const handleStartEvaluation = () => {
    navigate('/evaluation');
  };

  const packages = [
    {
      name: 'Basis',
      price: 299,
      popular: false,
      description: 'Grundlegende KI-Analyse für erste Einschätzung',
      features: [
        'KI-gestützte Schadenserkennung',
        'Grundbewertung des Bauzustands',
        'Risiko-Ampel (grün/gelb/rot)',
        'Zusammenfassung (2-3 Seiten)',
        'Ergebnis binnen 24 Stunden',
        'E-Mail-Support'
      ],
      deliveryTime: '24h',
      bestFor: 'Erste Orientierung'
    },
    {
      name: 'Plus',
      price: 499,
      popular: true,
      description: 'KI-Analyse + Expertenvalidierung für fundierte Entscheidungen',
      features: [
        'Alle Basis-Leistungen',
        'Expertenvalidierung der KI',
        'Detaillierte Handlungsempfehlungen',
        'Kostenschätzung für Reparaturen',
        'Priorisierung der Maßnahmen',
        'Ausführlicher Report (5-7 Seiten)',
        'Ergebnis binnen 24 Stunden',
        'Telefon-Support'
      ],
      deliveryTime: '24h',
      bestFor: 'Kaufentscheidung'
    },
    {
      name: 'Premium',
      price: 799,
      popular: false,
      description: 'Komplettpaket mit Beratung und Nachbetreuung',
      features: [
        'Alle Plus-Leistungen',
        '30-Min. Telefonberatung',
        'Sanierungsfahrplan mit Zeitplan',
        'Detaillierte Kostenaufstellung',
        'Verhandlungsargumente für Preisreduzierung',
        'Umfangreicher Report (10+ Seiten)',
        'Express-Lieferung in 12 Stunden',
        'Prioritäts-Support',
        '14 Tage Nachbetreuung'
      ],
      deliveryTime: '12h',
      bestFor: 'Komplettberatung'
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
            Wählen Sie das Paket, das optimal zu Ihren Bedürfnissen passt. 
            Alle Preise verstehen sich inkl. MwSt.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {packages.map((pkg, index) => (
            <Card 
              key={index}
              className={`relative hover-lift transition-smooth ${
                pkg.popular 
                  ? 'ring-2 ring-primary shadow-strong scale-105' 
                  : 'shadow-soft'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Meistgewählt
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-text-100 mb-2">
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
              </CardContent>
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
              <Button variant="outline" onClick={handleStartEvaluation}>
                Paket-Berater starten
              </Button>
              <Button variant="outline" onClick={() => {
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

export default PricingSectionV1;


