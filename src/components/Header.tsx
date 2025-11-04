import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on a subpage (not homepage)
  const isNotHomePage = location.pathname !== '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartEvaluation = () => {
    navigate('/evaluation');
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    // If we're not on the homepage, navigate to homepage first
    if (isNotHomePage) {
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
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: 'Leistungen', id: 'leistungen' },
    { label: 'So funktioniert\'s', id: 'so-funktioniert' },
    { label: 'Referenzen', id: 'referenzen' },
    { label: 'Preise', id: 'preise' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Kontakt', id: 'kontakt' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-sm shadow-soft' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center" aria-label="Bauklar.org Homepage">
            <span className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
              Bauklar.org
            </span>
          </Link>

          {/* Desktop Navigation - immer an der gleichen Position */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-text-200 hover:text-primary transition-smooth text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Button - nur auf Landing Page anzeigen */}
          {!isNotHomePage && (
            <div className="hidden md:block">
              <Button
                onClick={handleStartEvaluation}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6"
              >
                Jetzt Bewertung starten
              </Button>
            </div>
          )}

          {/* Unsichtbarer Spacer für Subpages um Layout zu halten */}
          {isNotHomePage && (
            <div className="hidden md:block">
              <Button
                className="bg-transparent hover:bg-transparent text-transparent font-medium px-6 pointer-events-none"
                disabled
              >
                Jetzt Bewertung starten
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-text-100" />
            ) : (
              <Menu className="w-6 h-6 text-text-100" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background shadow-strong border-t">
            <nav className="p-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left text-text-200 hover:text-primary transition-smooth py-2"
                >
                  {item.label}
                </button>
              ))}
              <Button
                onClick={handleStartEvaluation}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium mt-4"
              >
                Jetzt Bewertung starten
              </Button>
            </nav>
          </div>
        )}
      </div>

      {/* Sticky CTA for mobile removed by request */}
    </header>
  );
};

export default Header;