import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const scrollToSection = (sectionId: string) => {
    // If we're not on the homepage, navigate to homepage first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for page to load, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      // On homepage, scroll directly
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="text-black bg-gradient-to-tl from-blue-50 via-blue-100 to-blue-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-black">Bauklar.org</h3>
            <p className="text-black text-sm leading-relaxed">
              Professionelle Bauschadensbewertung für private Immobilienkäufer. 
              Schnell, zuverlässig, digital.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://linkedin.com/in/dr-johannes-stankiewicz-63b5ba55/" 
                className="w-8 h-8 bg-bg-100/10 rounded-full flex items-center justify-center hover:bg-bg-100/20 transition-smooth"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-black">Leistungen</h3>
            <ul className="space-y-2 text-sm text-black">
              <li>
                <button 
                  onClick={() => scrollToSection('leistungen')}
                  className="hover:text-black transition-smooth"
                >
                  Bauschadensbewertung
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-black">Navigation</h3>
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
            <h3 className="font-semibold text-black">Kontakt</h3>
            <div className="space-y-3 text-sm text-black">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a 
                  href="mailto:kontakt@bauklar.org"
                  className="hover:text-black transition-smooth"
                >
                  kontakt@bauklar.org
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a 
                  href="tel:015143170757"
                  className="hover:text-black transition-smooth"
                >
                  015143170757
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <div>
                  Claverium GmbH<br />
                  Neusser Str. 257<br />
                  50733 Köln
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-bg-100/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-black">
              © 2025 Claverium GmbH. Alle Rechte vorbehalten.
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
              <a href="/admin" className="hover:text-black transition-smooth">
                Admin
              </a>
            </div>
          </div>
          
          {/* Legal Note */}
          <div className="mt-6 text-xs text-black leading-relaxed max-w-4xl">
            <strong>Haftungsausschluss:</strong> Unsere Bauschadensbewertung dient als fundierte Entscheidungsgrundlage. Sie basiert auf den bereitgestellten Unterlagen und Informationen und erfolgt nach bestem Wissen und Gewissen. Eine rechtliche Gewährleistung oder Haftung, insbesondere für Vollständigkeit, Richtigkeit oder etwaige Folgeschäden, kann nicht übernommen werden.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;