import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="text-black bg-gradient-to-tl from-blue-50 via-blue-100 to-blue-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-black">Claverum</h3>
            <p className="text-black text-sm leading-relaxed">
              Professionelle KI-gestützte Immobilienbewertung für private Immobilienkäufer. 
              Schnell, zuverlässig, digital.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://linkedin.com/company/baucheck-ki" 
                className="w-8 h-8 bg-bg-100/10 rounded-full flex items-center justify-center hover:bg-bg-100/20 transition-smooth"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com/baucheck_ki" 
                className="w-8 h-8 bg-bg-100/10 rounded-full flex items-center justify-center hover:bg-bg-100/20 transition-smooth"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com/baucheck.ki" 
                className="w-8 h-8 bg-bg-100/10 rounded-full flex items-center justify-center hover:bg-bg-100/20 transition-smooth"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-black">Leistungen</h4>
            <ul className="space-y-2 text-sm text-black">
              <li>
                <button 
                  onClick={() => scrollToSection('leistungen')}
                  className="hover:text-black transition-smooth"
                >
                  Bauschadensbewertung
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('leistungen')}
                  className="hover:text-black transition-smooth"
                >
                  Ankaufsberatung
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('leistungen')}
                  className="hover:text-black transition-smooth"
                >
                  Ersteinschätzung
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('leistungen')}
                  className="hover:text-black transition-smooth"
                >
                  Bauschadensgutachten
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-semibold text-black">Navigation</h4>
            <ul className="space-y-2 text-sm text-black">
              <li>
                <button 
                  onClick={() => scrollToSection('so-funktioniert')}
                  className="hover:text-black transition-smooth"
                >
                  So funktioniert's
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('preise')}
                  className="hover:text-black transition-smooth"
                >
                  Preise
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className="hover:text-black transition-smooth"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('kontakt')}
                  className="hover:text-black transition-smooth"
                >
                  Kontakt
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-black">Kontakt</h4>
            <div className="space-y-3 text-sm text-black">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a 
                  href="mailto:support@baucheck-ki.de"
                  className="hover:text-black transition-smooth"
                >
                  support@baucheck-ki.de
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a 
                  href="tel:+4930123456789"
                  className="hover:text-black transition-smooth"
                >
                  +49 30 123 456 789
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <div>
                  BauCheck KI GmbH<br />
                  Unter den Linden 1<br />
                  10117 Berlin
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-bg-100/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-black">
              © 2024 Claverum GmbH. Alle Rechte vorbehalten.
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-black">
              <a href="/impressum" className="hover:text-black transition-smooth">
                Impressum
              </a>
              <a href="/agb" className="hover:text-black transition-smooth">
                AGB
              </a>
              <a href="/datenschutz" className="hover:text-black transition-smooth">
                Datenschutz
              </a>
              <a href="/widerruf" className="hover:text-black transition-smooth">
                Widerruf
              </a>
              <a href="/cookies" className="hover:text-black transition-smooth">
                Cookies
              </a>
              <a href="/admin" className="hover:text-black transition-smooth">
                Admin
              </a>
            </div>
          </div>
          
          {/* Legal Note */}
          <div className="mt-6 text-xs text-black leading-relaxed max-w-4xl">
            <strong>Haftungsausschluss:</strong> Unsere KI-gestützte Bauschadensbewertung dient als 
            fundierte Entscheidungsgrundlage und ersetzt keine Vor-Ort-Begehung durch einen 
            Sachverständigen. Die Einschätzung erfolgt nach bestem Wissen und Gewissen auf Basis 
            der zur Verfügung gestellten Unterlagen. Eine rechtliche Gewährleistung oder Haftung 
            für Folgeschäden können wir nicht übernehmen.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;