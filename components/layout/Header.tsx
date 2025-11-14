"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Check if we're on a subpage (not homepage)
  const isNotHomePage = pathname !== '/';
  
  // Pages where the CTA button should NOT be shown (admin, evaluation, success)
  const pagesWithoutCTA = [
    '/evaluation',
    '/success',
    '/admin',
    '/admin/login'
  ];
  
  // Show CTA button on homepage, city pages, blog pages, and legal pages (but not on pagesWithoutCTA)
  // City pages are single-level paths like /berlin, /hamburg, etc.
  const pathSegments = pathname.split('/').filter(Boolean);
  const isCityPage = pathSegments.length === 1 && !pagesWithoutCTA.includes(pathname);
  const isLegalPage = ['/impressum', '/agb', '/datenschutz', '/widerruf'].includes(pathname);
  const isBlogPage = pathname.startsWith('/blog/');
  const shouldShowCTA = pathname === '/' || isCityPage || isLegalPage || isBlogPage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartEvaluation = () => {
    router.push('/evaluation');
    setIsMenuOpen(false);
  };

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    // If we're not on the homepage, navigate to homepage first
    if (isNotHomePage) {
      router.push('/');
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
          <Link 
            href="/" 
            className="flex items-center" 
            aria-label="Bauklar.org Homepage"
            onClick={() => {
              // Scroll zur oberen Position wenn man zur Homepage navigiert
              if (pathname !== '/') {
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
              } else {
                // Wenn bereits auf Homepage, direkt nach oben scrollen
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <span className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
              Bauklar.org
            </span>
          </Link>

          {/* Desktop Navigation - immer an der gleichen Position */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`/#${item.id}`}
                onClick={(e) => handleSectionClick(e, item.id)}
                className="text-text-200 hover:text-primary transition-smooth text-sm font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA Button - auf Landing Page und City-Seiten anzeigen */}
          {shouldShowCTA && (
            <div className="hidden md:block">
              <Button
                onClick={handleStartEvaluation}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6"
              >
                Jetzt Bewertung starten
              </Button>
            </div>
          )}

          {/* Unsichtbarer Spacer für andere Subpages um Layout zu halten */}
          {!shouldShowCTA && (
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
                <a
                  key={item.id}
                  href={`/#${item.id}`}
                  onClick={(e) => handleSectionClick(e, item.id)}
                  className="block w-full text-left text-text-200 hover:text-primary transition-smooth py-2"
                >
                  {item.label}
                </a>
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
    </header>
  );
};

export default Header;


