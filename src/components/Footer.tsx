import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
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
        <h2 className="sr-only">Footer Navigation</h2>
        <div className="grid md:grid-cols-5 gap-8">
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
                <a 
                  href="/#leistungen"
                  onClick={(e) => handleSectionClick(e, 'leistungen')}
                  className="hover:text-black transition-smooth"
                >
                  Bauschadensbewertung
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-black">Navigation</h3>
            <ul className="space-y-2 text-sm text-black">
              <li>
                <a 
                  href="/#so-funktioniert"
                  onClick={(e) => handleSectionClick(e, 'so-funktioniert')}
                  className="hover:text-black transition-smooth"
                >
                  So funktioniert's
                </a>
              </li>
              <li>
                <a 
                  href="/#preise"
                  onClick={(e) => handleSectionClick(e, 'preise')}
                  className="hover:text-black transition-smooth"
                >
                  Preise
                </a>
              </li>
              <li>
                <a 
                  href="/#faq"
                  onClick={(e) => handleSectionClick(e, 'faq')}
                  className="hover:text-black transition-smooth"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a 
                  href="/#kontakt"
                  onClick={(e) => handleSectionClick(e, 'kontakt')}
                  className="hover:text-black transition-smooth"
                >
                  Kontakt
                </a>
              </li>
            </ul>
          </div>

          {/* Städte */}
          <div className="space-y-4">
            <h3 className="font-semibold text-black">Städte</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-black">
              <a href="/berlin/" className="hover:text-black transition-smooth">
                Berlin
              </a>
              <a href="/essen/" className="hover:text-black transition-smooth">
                Essen
              </a>
              <a href="/hamburg/" className="hover:text-black transition-smooth">
                Hamburg
              </a>
              <a href="/frankfurt/" className="hover:text-black transition-smooth">
                Frankfurt
              </a>
              <a href="/muenchen/" className="hover:text-black transition-smooth">
                München
              </a>
              <a href="/stuttgart/" className="hover:text-black transition-smooth">
                Stuttgart
              </a>
              <a href="/koeln/" className="hover:text-black transition-smooth">
                Köln
              </a>
              <a href="/nuernberg/" className="hover:text-black transition-smooth">
                Nürnberg
              </a>
              <a href="/duesseldorf/" className="hover:text-black transition-smooth">
                Düsseldorf
              </a>
              <a href="/leipzig/" className="hover:text-black transition-smooth">
                Leipzig
              </a>
              <a href="/dortmund/" className="hover:text-black transition-smooth">
                Dortmund
              </a>
              <a href="/dresden/" className="hover:text-black transition-smooth">
                Dresden
              </a>
              <a href="/hannover/" className="hover:text-black transition-smooth">
                Hannover
              </a>
              <a href="/bremen/" className="hover:text-black transition-smooth">
                Bremen
              </a>
              <a href="/mannheim/" className="hover:text-black transition-smooth">
                Mannheim
              </a>
            </div>
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
                  href="tel:+4932221804909"
                  className="hover:text-black transition-smooth"
                >
                  +49 322 21804909
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <div>
                  Claverum GmbH<br />
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
              © 2025 Claverum GmbH. Alle Rechte vorbehalten.
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