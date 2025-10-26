import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Linkedin, Mail, Phone } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section id="ueber-uns" className="py-20 bg-bg-200">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-100 mb-4">
              Über Claverum
            </h2>
            <p className="text-xl text-text-200">
              Expertise trifft auf Innovation
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Profile */}
            <div className="text-center lg:text-left">
              <div className="w-48 h-48 bg-brand-100 rounded-full mx-auto lg:mx-0 mb-6 flex items-center justify-center overflow-hidden">
                <img 
                  src="/Johannes-foto.png" 
                  alt="Dr. Johannes Stankiewicz" 
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    // Fallback zu MK wenn Bild nicht gefunden wird
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-32 h-32 bg-brand-200 rounded-full flex items-center justify-center" style={{display: 'none'}}>
                  <span className="text-4xl font-bold text-primary">MK</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-text-100 mb-2">
              Dr. Johannes Stankiewicz
              </h3>
              <p className="text-text-200 mb-4 font-medium">
              Diplom Sachverständiger (DIA)
              </p>
              
              <div className="flex justify-center lg:justify-start gap-4 mb-6">
                <a 
                  href="https://www.linkedin.com/in/dr-johannes-stankiewicz-63b5ba55/" 
                  className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-smooth"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href="mailto:max@baucheck-ki.de" 
                  className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-smooth"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a 
                  href="tel:015143170757" 
                  className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-smooth"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Bio & Mission */}
            <div className="space-y-6">
              <Card className="shadow-soft">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-text-100 mb-3">Fachhintergrund</h4>
                  <p className="text-text-200 text-sm leading-relaxed">
                  Unser Büro ist nach DIN EN ISO/IEC 17024 zertifiziert und wird von Finanzämtern anerkannt. Dr. Stankiewicz, ein Diplom Sachverständiger (DIA), bietet Ihnen langjährige Erfahrung im Bereich der Immobilienbewertung. Zusätzlich bilden die Erfahrungen aus den Bereichen Investment, Hausverwaltung und Family Office die Basis für eine 360 Grad Betrachtung Ihrer Immobilie. 
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-text-100 mb-3">Mission</h4>
                  <p className="text-text-200 text-sm leading-relaxed">
                  Unsere Mission ist es, den Immobilienkauf zu revolutionieren, indem wir mithilfe künstlicher Intelligenz den wahren Zustand von Gebäuden für jeden verständlich und zugänglich machen. Wir verbinden modernste Technologie mit fachlicher Expertise, um klare, zuverlässige und bezahlbare Gutachten zu erstellen, die Käufern Sicherheit und Vertrauen bei einer der wichtigsten Entscheidungen ihres Lebens geben.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-text-100 mb-3">Erfahrung & Zahlen</h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">2.500+</div>
                      <div className="text-xs text-text-200">Bewertete Objekte</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">15</div>
                      <div className="text-xs text-text-200">Jahre Erfahrung</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">98%</div>
                      <div className="text-xs text-text-200">Trefferquote</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">4.9/5</div>
                      <div className="text-xs text-text-200">Kundenbewertung</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 text-center">
            <h3 className="text-lg font-semibold text-text-100 mb-8">
              Zertifizierungen & Versicherungen
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-background rounded-lg shadow-soft">
                <div className="text-2xl mb-2">🏛️</div>
                <p className="text-sm text-text-200">
                  <strong className="text-text-100">Öffentlich bestellt</strong><br />
                  Sachverständiger für Immobilienbewertung
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg shadow-soft">
                <div className="text-2xl mb-2">🛡️</div>
                <p className="text-sm text-text-200">
                  <strong className="text-text-100">Berufshaftpflicht</strong><br />
                  Versichert bis 2 Mio. € je Schadensfall
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg shadow-soft">
                <div className="text-2xl mb-2">🎓</div>
                <p className="text-sm text-text-200">
                  <strong className="text-text-100">Fortbildung</strong><br />
                  Regelmäßige Schulungen & Zertifizierungen
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;