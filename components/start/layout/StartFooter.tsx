"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Linkedin, Mail, MapPin, Phone } from "lucide-react";

const START_PATH = "/start";

const StartFooter: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleSectionClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    e.preventDefault();

    if (pathname !== START_PATH) {
      router.push(START_PATH);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-primary-300 text-white">
      <div className="container mx-auto px-4 py-16">
        <h2 className="sr-only">Footer Navigation</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Bauklar.org</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Professionelle Bauschadensbewertung für private Immobilienkäufer.
              Schnell, zuverlässig, digital.
            </p>
            <div className="flex gap-3">
              <a
                href="https://linkedin.com/in/dr-johannes-stankiewicz-63b5ba55/"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-smooth"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profil von Dr. Johannes Stankiewicz"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation + Blog merged */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Navigation</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a
                  href={`${START_PATH}#leistungen`}
                  onClick={(e) => handleSectionClick(e, "leistungen")}
                  className="hover:text-white transition-smooth"
                >
                  Bauschadensbewertung
                </a>
              </li>
              <li>
                <a
                  href={`${START_PATH}#so-funktioniert`}
                  onClick={(e) => handleSectionClick(e, "so-funktioniert")}
                  className="hover:text-white transition-smooth"
                >
                  So funktioniert's
                </a>
              </li>
              <li>
                <a
                  href={`${START_PATH}#preise`}
                  onClick={(e) => handleSectionClick(e, "preise")}
                  className="hover:text-white transition-smooth"
                >
                  Preise
                </a>
              </li>
              <li>
                <a
                  href={`${START_PATH}#faq`}
                  onClick={(e) => handleSectionClick(e, "faq")}
                  className="hover:text-white transition-smooth"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href={`${START_PATH}#kontakt`}
                  onClick={(e) => handleSectionClick(e, "kontakt")}
                  className="hover:text-white transition-smooth"
                >
                  Kontakt
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/blog/hauskauf-beratung"
                  className="hover:text-white transition-smooth"
                >
                  Hauskauf Beratung
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/schimmel-bauschaden"
                  className="hover:text-white transition-smooth"
                >
                  Schimmel als Bauschaden
                </Link>
              </li>
            </ul>
          </div>

          {/* Städte */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Städte</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/70">
              <Link href="/berlin" className="hover:text-white transition-smooth">
                Berlin
              </Link>
              <Link href="/essen" className="hover:text-white transition-smooth">
                Essen
              </Link>
              <Link href="/hamburg" className="hover:text-white transition-smooth">
                Hamburg
              </Link>
              <Link
                href="/frankfurt"
                className="hover:text-white transition-smooth"
              >
                Frankfurt
              </Link>
              <Link href="/muenchen" className="hover:text-white transition-smooth">
                München
              </Link>
              <Link href="/stuttgart" className="hover:text-white transition-smooth">
                Stuttgart
              </Link>
              <Link href="/koeln" className="hover:text-white transition-smooth">
                Köln
              </Link>
              <Link
                href="/nuernberg"
                className="hover:text-white transition-smooth"
              >
                Nürnberg
              </Link>
              <Link
                href="/duesseldorf"
                className="hover:text-white transition-smooth"
              >
                Düsseldorf
              </Link>
              <Link href="/leipzig" className="hover:text-white transition-smooth">
                Leipzig
              </Link>
              <Link
                href="/dortmund"
                className="hover:text-white transition-smooth"
              >
                Dortmund
              </Link>
              <Link href="/dresden" className="hover:text-white transition-smooth">
                Dresden
              </Link>
              <Link
                href="/hannover"
                className="hover:text-white transition-smooth"
              >
                Hannover
              </Link>
              <Link href="/bremen" className="hover:text-white transition-smooth">
                Bremen
              </Link>
              <Link
                href="/mannheim"
                className="hover:text-white transition-smooth"
              >
                Mannheim
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Kontakt</h3>
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:kontakt@bauklar.org"
                  className="hover:text-white transition-smooth"
                >
                  kontakt@bauklar.org
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a
                  href="tel:+4932221804909"
                  className="hover:text-white transition-smooth"
                >
                  +49 322 21804909
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <div>
                  Claverum GmbH
                  <br />
                  Neusser Str. 257
                  <br />
                  50733 Köln
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-white/60">
              &copy; {new Date().getFullYear()} Claverum GmbH. Alle Rechte vorbehalten.
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-white/70">
              <Link href="/impressum" className="hover:text-white transition-smooth">
                Impressum
              </Link>
              <Link href="/agb" className="hover:text-white transition-smooth">
                AGB
              </Link>
              <Link
                href="/datenschutz"
                className="hover:text-white transition-smooth"
              >
                Datenschutz
              </Link>
              <Link href="/widerruf" className="hover:text-white transition-smooth">
                Widerruf
              </Link>
              <Link href="/admin" className="hover:text-white transition-smooth">
                Admin
              </Link>
            </div>
          </div>

          {/* Legal Note */}
          <div className="mt-6 text-xs text-white/50 leading-relaxed max-w-4xl">
            <strong>Haftungsausschluss:</strong> Unsere Bauschadensbewertung dient
            als fundierte Entscheidungsgrundlage. Sie basiert auf den
            bereitgestellten Unterlagen und Informationen und erfolgt nach bestem
            Wissen und Gewissen. Eine rechtliche Gewährleistung oder Haftung,
            insbesondere für Vollständigkeit, Richtigkeit oder etwaige
            Folgeschäden, kann nicht übernommen werden.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StartFooter;
