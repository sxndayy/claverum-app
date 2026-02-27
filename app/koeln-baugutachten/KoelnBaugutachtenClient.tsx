"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/layout/CookieBanner';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Shield, Clock, CheckCircle, Star, Upload, Bot, FileText, Home, Building, Wrench, AlertTriangle, Check } from 'lucide-react';
import { ClientReviews, Review } from '@/components/ui/client-reviews';
import { FAQSchema } from '@/components/seo/FAQSchema';

// Fake Köln testimonials
const koelnReviews: Review[] = [
  {
    rating: 5,
    reviewer: "Anna M.",
    roleReviewer: "Käuferin aus Ehrenfeld",
    review: "Kellerabdichtung in Sülz als Risiko entdeckt – in der Kaufpreiskalkulation berücksichtigt. Die digitale Bauschadensanalyse hat mir geholfen, fundiert zu verhandeln. Sehr empfehlenswert!",
    date: "Oktober 2025"
  },
  {
    rating: 5,
    reviewer: "Michael K.",
    roleReviewer: "Käufer aus Lindenthal",
    review: "Schnelle und professionelle Bewertung meiner Altbau-Wunschimmobilie in Lindenthal. Der Bericht zeigte mir versteckte Mängel an der Fassade, die ich sonst übersehen hätte.",
    date: "September 2025"
  },
  {
    rating: 4.5,
    reviewer: "Sarah L.",
    roleReviewer: "Erstkäuferin aus Rodenkirchen",
    review: "Als Erstkäuferin war ich überfordert mit dem Nachkriegsbau in Rodenkirchen. Bauklar.org hat mir geholfen, die Risiken richtig einzuschätzen. Der Bericht war verständlich und hilfreich.",
    date: "November 2025"
  }
];

const faqItems = [
  {
    question: "Welche Gebäudetypen in Köln werden geprüft?",
    answer: "Alle Gebäudetypen werden analysiert: Nachkriegsbauten, rekonstruierte Gründerzeithäuser in Ehrenfeld, Lindenthal oder Sülz, Rheinufer-Immobilien sowie Neubauten. Jeder Gebäudetyp hat spezifische Risiken, die in der Analyse berücksichtigt werden."
  },
  {
    question: "Wie schnell erhalte ich den Bericht für meine Immobilie in Köln?",
    answer: "Sie erhalten den Bericht per E-Mail als PDF innerhalb von 2 Werktagen nach vollständiger Übermittlung aller Unterlagen und Fotos."
  },
  {
    question: "Was kostet eine Bauschadensanalyse in Köln?",
    answer: "Die Preise sind transparent auf der Website einsehbar und gelten deutschlandweit einheitlich. Es gibt keine versteckten Kosten oder Zusatzgebühren für Köln. Ab 350€ inkl. MwSt."
  },
  {
    question: "Wird bei Eigentumswohnungen auch das Gemeinschaftseigentum geprüft?",
    answer: "Soweit es die vorliegenden Unterlagen sowie die bereitgestellten Fotos zulassen, wird der bauliche Zustand von Dach, Fassade, Treppenhaus und zentralen haustechnischen Anlagen nachvollziehbar beschrieben und in die Bewertung einbezogen."
  },
  {
    question: "Ersetzt die digitale Analyse einen Gutachter vor Ort?",
    answer: "Die digitale Analyse bietet eine fundierte Ersteinschätzung auf Basis der verfügbaren Informationen. Bei schwerwiegenden Mängeln oder komplexen Schadensbildern wird eine vertiefende Prüfung empfohlen."
  }
];

export default function KoelnBaugutachtenClient() {
  const router = useRouter();

  // Helper function to add tracking parameters to URLs
  const addTrackingParams = (url: string) => {
    if (typeof window === 'undefined') return url;
    
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source') || 'google';
    const utmMedium = urlParams.get('utm_medium') || 'cpc';
    const utmCampaign = urlParams.get('utm_campaign');
    const utmTerm = urlParams.get('utm_term');
    const utmContent = urlParams.get('utm_content');
    const gclid = urlParams.get('gclid');

    const params = new URLSearchParams();
    if (utmSource) params.set('utm_source', utmSource);
    if (utmMedium) params.set('utm_medium', utmMedium);
    if (utmCampaign) params.set('utm_campaign', utmCampaign);
    if (utmTerm) params.set('utm_term', utmTerm);
    if (utmContent) params.set('utm_content', utmContent);
    if (gclid) params.set('gclid', gclid);

    const paramString = params.toString();
    return paramString ? `${url}?${paramString}` : url;
  };

  const handleStartEvaluation = () => {
    const url = addTrackingParams('/auftrag');
    router.push(url);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const trustBadges = [
    {
      icon: Shield,
      text: 'Qualifizierte Sachverständige'
    },
    {
      icon: Clock,
      text: 'Bericht innerhalb von 2 Werktagen'
    },
    {
      icon: CheckCircle,
      text: 'Früherkennung von Bauschäden – bevor sie teuer werden'
    },
    {
      icon: Star,
      text: 'Transparente Kosten – für eine sichere Finanzierung'
    }
  ];

  const checkedItems = [
    {
      icon: Home,
      title: 'Tragwerk & Statik',
      description: 'Wände, Decken, Fundamente – Risse im Mauerwerk erkennen'
    },
    {
      icon: Building,
      title: 'Dach & Fassade',
      description: 'Flachdach-Probleme, Dämmung, Fassadenschäden'
    },
    {
      icon: Wrench,
      title: 'Haustechnik',
      description: 'Energieeffizienz, Heizung, Elektrik, Sanitär'
    },
    {
      icon: AlertTriangle,
      title: 'Feuchtigkeit & Schimmel',
      description: 'Nasse Keller, Wände, Bäder – typische Kölner Risiken'
    }
  ];

  return (
    <>
      <FAQSchema faqs={faqItems} />
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Hero Section */}
          <section className="relative py-16 md:py-24 bg-background">
            {/* Background Gradient */}
            <div className="absolute inset-0 hero-gradient opacity-30"></div>
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-text-100 mb-6 hero-title">
                  Haus kaufen in Köln? Teure Mängel entdecken, bevor Sie unterschreiben
                </h1>
                
                <p className="text-xl md:text-2xl text-text-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Sie möchten in Köln ein Haus kaufen und wollen keine bösen Überraschungen erleben. 
                  Sicher entscheiden trotz komplexem Altbau- & Nachkriegsbestand.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Button
                    onClick={handleStartEvaluation}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 text-lg shadow-strong hover-lift"
                  >
                    Jetzt Bewertung starten
                  </Button>
                  
                  <Button
                    onClick={() => scrollToSection('so-funktioniert')}
                    variant="outline"
                    size="lg"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-4 text-lg transition-smooth"
                  >
                    So funktioniert's
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
                  {trustBadges.map((badge, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center p-4 rounded-lg bg-background/80 backdrop-blur-sm shadow-soft hover-lift"
                    >
                      <badge.icon className="w-6 h-6 text-primary mb-2" />
                      <span className="text-sm text-text-200 text-center font-medium">
                        {badge.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Trust Elements */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-text-200">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <span className="text-sm">4.9/5 Kundenbewertung</span>
                  </div>
                  
                  <div className="text-sm">
                    Über 95% Weiterempfehlungsrate
                  </div>
                </div>

                {/* Hero Image */}
                <div className="mt-12 rounded-lg overflow-hidden shadow-soft">
                  <Image
                    src="/koeln.jpg"
                    alt="Köln Stadtansicht – Bauschadensanalyse für Hauskauf in Köln"
                    width={1600}
                    height={900}
                    priority
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Warum Köln Section */}
          <section className="py-20 bg-bg-200">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-text-100 mb-4">
                    Warum eine Bauschadensanalyse in Köln?
                  </h2>
                  <p className="text-xl text-text-200 max-w-2xl mx-auto">
                    Köln hat einen vielfältigen Gebäudebestand mit spezifischen Herausforderungen
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <Card className="border-0 shadow-soft hover-lift">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-text-100 mb-3">
                        Komplexer Altbau- & Nachkriegsbestand
                      </h3>
                      <p className="text-text-200">
                        Von rekonstruierten Gründerzeithäusern in Ehrenfeld bis zu Nachkriegsbauten – 
                        jeder Gebäudetyp hat spezifische Risiken wie nasse Keller und Flachdach-Probleme.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-soft hover-lift">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-text-100 mb-3">
                        Rheinufer-Nähe und Feuchtigkeit
                      </h3>
                      <p className="text-text-200">
                        Die Nähe zum Rhein führt häufig zu erhöhter Bodenfeuchtigkeit und Kellerabdichtungsproblemen. 
                        Eine fundierte Einschätzung hilft, diese Risiken zu erkennen.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-soft hover-lift">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-text-100 mb-3">
                        Lokale Expertise in Ehrenfeld, Lindenthal & Sülz
                      </h3>
                      <p className="text-text-200">
                        Spezialisiert auf typische Kölner Risiken – wir kennen die baulichen Besonderheiten 
                        der verschiedenen Stadtteile und ihre spezifischen Schwachstellen.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-soft hover-lift">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-text-100 mb-3">
                        Schnelle Entscheidungen nötig
                      </h3>
                      <p className="text-text-200">
                        Im dynamischen Kölner Immobilienmarkt müssen Kaufentscheidungen schnell getroffen werden. 
                        Unsere digitale Analyse liefert Ergebnisse innerhalb von 48 Stunden.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* So funktioniert's */}
          <section id="so-funktioniert" className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-text-100 mb-4">
                  So funktioniert's
                </h2>
                <p className="text-xl text-text-200 max-w-2xl mx-auto">
                  In 3 einfachen Schritten zu Ihrer fundierten Kaufentscheidung
                </p>
              </div>

              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center relative">
                      <Upload className="w-8 h-8 text-primary" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-text-100 mb-3">
                      Fotos hochladen
                    </h3>
                    <p className="text-text-200">
                      Laden Sie Fotos Ihrer Wunschimmobilie hoch und ergänzen Sie Basisdaten wie Adresse und Baujahr.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center relative">
                      <Bot className="w-8 h-8 text-primary" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-text-100 mb-3">
                      Prüfung durch Experten
                    </h3>
                    <p className="text-text-200">
                      Unsere qualifizierten Sachverständigen analysieren Ihre Unterlagen systematisch und bewerten Risiken.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center relative">
                      <FileText className="w-8 h-8 text-primary" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-text-100 mb-3">
                      Bericht erhalten
                    </h3>
                    <p className="text-text-200">
                      Innerhalb von 48 Stunden erhalten Sie einen verständlichen Bericht mit Handlungsempfehlungen.
                    </p>
                  </div>
                </div>

                <div className="text-center mt-12">
                  <Button
                    onClick={handleStartEvaluation}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 text-lg"
                  >
                    Jetzt starten
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Was wir prüfen */}
          <section className="py-20 bg-bg-200">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-text-100 mb-4">
                  Was wir prüfen
                </h2>
                <p className="text-xl text-text-200 max-w-2xl mx-auto">
                  Systematische Bewertung aller wichtigen Gebäudebereiche
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  {checkedItems.map((item, index) => (
                    <Card key={index} className="border-0 shadow-soft hover-lift">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <item.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-text-100 mb-2">
                              {item.title}
                            </h3>
                            <p className="text-text-200 text-sm">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Social Proof - Testimonials */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-text-100 mb-4">
                  Was Kölner Kunden sagen
                </h2>
                <p className="text-xl text-text-200 max-w-2xl mx-auto">
                  Erfahrungen von Immobilienkäufern aus Köln
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <ClientReviews reviews={koelnReviews} />
              </div>

              <div className="text-center mt-12">
                <div className="inline-flex items-center gap-8 text-sm text-text-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">4.9</span>
                    </div>
                    <span>Durchschnittsbewertung</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">98%</span>
                    </div>
                    <span>Weiterempfehlung</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Preise */}
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
                <Card 
                  className="relative hover-lift transition-smooth ring-2 ring-primary shadow-strong scale-105"
                >
                  {/* Desktop title centered across both columns */}
                  <div className="hidden lg:block pt-6">
                    <h3 className="text-2xl font-bold text-text-100 text-center">
                      All-in-one
                    </h3>
                  </div>

                  <div className="lg:flex lg:gap-8">
                    {/* Left column: existing content */}
                    <div className="lg:flex-1">
                      <CardHeader className="text-center pb-6">
                        <CardTitle className="text-2xl font-bold text-text-100 mb-2 lg:hidden">
                          All-in-one
                        </CardTitle>
                        <div className="mb-4">
                          <span className="text-4xl font-bold text-primary">350€</span>
                          <span className="text-text-200 text-sm ml-1">inkl. MwSt.</span>
                        </div>
                        <p className="text-text-200 text-sm">
                          Fachgerechte Prüfung und Bewertung für verlässliche Entscheidungen
                        </p>
                        {/* Quick Info */}
                        <div className="flex justify-center gap-4 mt-4 text-xs">
                          <div className="flex items-center gap-1 text-primary">
                            <Clock className="w-3 h-3" />
                            48h
                          </div>
                          <div className="flex items-center gap-1 text-text-200">
                            <Shield className="w-3 h-3" />
                            Kaufentscheidung
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <ul className="space-y-3 mb-8">
                          <li className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-text-200">Alle Basisleistungen</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-text-200">Prüfung durch erfahrene Sachverständige</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-text-200">Klare Handlungsempfehlungen</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-text-200">Kostenschätzung für Reparaturen</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-text-200">Priorisierung nach Dringlichkeit</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-text-200">Bewertungsbericht (14–16 Seiten)</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-text-200">Ergebnis innerhalb 48 Stunden</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-text-200">Telefonischer Support</span>
                          </li>
                        </ul>
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
                      className="w-full font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
                      size="lg"
                    >
                      Jetzt starten
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Additional Info */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-bg-200 rounded-xl p-8">
                  <h3 className="text-lg font-semibold text-text-100 mb-4 text-center">
                    💡 Schnellergebnis innerhalb von 48 Stunden
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6 text-sm text-text-200">
                    <div>
                      <strong className="text-text-100">Geld-zurück-Garantie:</strong><br />
                      14 Tage Widerrufsrecht ohne Angabe von Gründen
                    </div>
                    <div>
                      <strong className="text-text-100">Transparente Kosten – für eine sichere Finanzierung:</strong><br />
                      Alle Preise sind Endpreise inkl. MwSt. und Bearbeitung
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20 bg-bg-200">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-text-100 mb-4">
                  Häufig gestellte Fragen
                </h2>
                <p className="text-xl text-text-200 max-w-2xl mx-auto">
                  Alles was Sie über unsere Bauschadensbewertung in Köln wissen müssen
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <Accordion type="single" collapsible className="space-y-4">
                  {faqItems.map((item, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="bg-background rounded-lg shadow-soft border-0 px-6"
                    >
                      <AccordionTrigger className="text-left text-text-100 hover:text-primary font-medium py-6">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-text-200 pb-6 leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-text-100 mb-6">
                  Jetzt Bauzustand Ihrer Wunschimmobilie in Köln prüfen lassen
                </h2>
                <p className="text-xl text-text-200 mb-8 leading-relaxed">
                  Eine fundierte Bauschadensanalyse gibt Ihnen Sicherheit vor dem Immobilienkauf. 
                  Sie erhalten objektive Einschätzungen durch qualifizierte Sachverständige, 
                  realistische Kostenrahmen für erkannte Mängel und verständliche Handlungsempfehlungen.
                </p>

                <div className="grid md:grid-cols-4 gap-4 mb-10">
                  {trustBadges.map((badge, index) => (
                    <div key={index} className="bg-background rounded-lg p-4 shadow-soft">
                      <badge.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium text-text-100">{badge.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                  <Button
                    onClick={handleStartEvaluation}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold"
                  >
                    Jetzt Kölner Immobilie prüfen lassen
                  </Button>
                  <Button
                    onClick={() => scrollToSection('so-funktioniert')}
                    size="lg"
                    className="bg-white hover:bg-gray-50 text-text-100 px-8 py-4 text-lg font-semibold border-2 border-primary"
                  >
                    So funktioniert's
                  </Button>
                </div>

                <p className="text-sm text-text-200 mt-4">
                  Bericht per E-Mail innerhalb von 2 Werktagen – schnell, transparent, verlässlich.
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <CookieBanner />
        <Toaster />
      </div>
    </>
  );
}

