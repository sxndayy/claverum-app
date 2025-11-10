"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Shield, Clock, CheckCircle, FileText } from 'lucide-react';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { CityServiceSchema } from '@/components/seo/CityServiceSchema';
import { FAQSchema } from '@/components/seo/FAQSchema';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/layout/CookieBanner';
import { SITE_URL } from '@/lib/config';
import { CityData } from '@/types/city';

interface CityPageClientProps {
  cityData: CityData;
}

const CityPageClient: React.FC<CityPageClientProps> = ({ cityData }) => {
  const router = useRouter();

  // Defensive check - if cityData is invalid, show error
  if (!cityData || !cityData.content || !cityData.seo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-200">Fehler beim Laden der Stadt-Informationen.</p>
        </div>
      </div>
    );
  }

  const handleStartEvaluation = () => {
    router.push('/evaluation');
  };

  const scrollToSection = (sectionId: string) => {
    if (typeof window === 'undefined') return;
    
    if (window.location.pathname !== '/') {
      router.push('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Convert FAQ items to format expected by FAQSchema
  const faqItems = (cityData.faq || []).map(item => ({
    question: item.question || '',
    answer: item.answer || ''
  }));

  // LocalBusiness Schema - safely serialize for JSON-LD
  const localBusinessSchema = cityData.structuredData?.localBusiness;
  const safeLocalBusinessSchema = localBusinessSchema && Object.keys(localBusinessSchema).length > 0 
    ? localBusinessSchema 
    : null;

  // Trust elements with icons mapping
  const trustElementIcons: Record<string, React.ReactNode> = {
    'Qualifizierte Sachverständige': <Shield className="h-8 w-8 text-primary mx-auto mb-2" />,
    'Bericht innerhalb von 2 Werktagen': <Clock className="h-8 w-8 text-primary mx-auto mb-2" />,
    'Transparente Kostenspannen': <FileText className="h-8 w-8 text-primary mx-auto mb-2" />,
    'Keine versteckten Kosten': <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />,
  };

  // Get icon for trust element or use default
  const getTrustIcon = (text: string) => {
    return trustElementIcons[text] || <Shield className="h-8 w-8 text-primary mx-auto mb-2" />;
  };

  // Liste aller Städte mit Namen und Slugs
  const cities = [
    { name: 'Berlin', slug: 'berlin' },
    { name: 'Hamburg', slug: 'hamburg' },
    { name: 'München', slug: 'muenchen' },
    { name: 'Köln', slug: 'koeln' },
    { name: 'Düsseldorf', slug: 'duesseldorf' },
    { name: 'Dortmund', slug: 'dortmund' },
    { name: 'Essen', slug: 'essen' },
    { name: 'Frankfurt', slug: 'frankfurt' },
    { name: 'Stuttgart', slug: 'stuttgart' },
    { name: 'Nürnberg', slug: 'nuernberg' },
    { name: 'Leipzig', slug: 'leipzig' },
    { name: 'Dresden', slug: 'dresden' },
    { name: 'Hannover', slug: 'hannover' },
    { name: 'Bremen', slug: 'bremen' },
    { name: 'Mannheim', slug: 'mannheim' },
  ];

  // Aktuelle Stadt erkennen
  const currentCitySlug = cityData.slug;

  // Helper function to parse content with links
  const parseContentWithLinks = (content: string) => {
    return content.split('\n\n').map((paragraph, pIndex) => (
      <p key={pIndex} className="mb-4">
        {paragraph.split(/(<link[^>]*>.*?<\/link>|<a[^>]*>.*?<\/a>)/).map((part, linkIndex) => {
          // Handle internal links
          const linkMatch = part.match(/<link href=['"]([^'"]+)['"]>([^<]+)<\/link>/);
          if (linkMatch) {
            const [, href, text] = linkMatch;
            if (href.startsWith('/so-funktioniert')) {
              return (
                <React.Fragment key={linkIndex}>
                  <a
                    href="/#so-funktioniert"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('so-funktioniert');
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    {text}
                  </a>
                </React.Fragment>
              );
            } else if (href.startsWith('/preise')) {
              return (
                <React.Fragment key={linkIndex}>
                  <a
                    href="/#preise"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('preise');
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    {text}
                  </a>
                </React.Fragment>
              );
            } else {
              return (
                <React.Fragment key={linkIndex}>
                  <Link href={href} className="text-primary hover:underline font-medium">
                    {text}
                  </Link>
                </React.Fragment>
              );
            }
          }
          // Handle external links
          const externalLinkMatch = part.match(/<a href=['"]([^'"]+)['"]\s+rel=['"]nofollow['"]>([^<]+)<\/a>/);
          if (externalLinkMatch) {
            const [, href, text] = externalLinkMatch;
            return (
              <a
                key={linkIndex}
                href={href}
                rel="nofollow"
                className="text-primary hover:underline font-medium"
              >
                {text}
              </a>
            );
          }
          return <React.Fragment key={linkIndex}>{part}</React.Fragment>;
        })}
      </p>
    ));
  };

  return (
    <>
      <BreadcrumbSchema 
        items={(cityData.structuredData?.breadcrumb?.itemListElement || []).map(item => {
          const itemUrl = item?.item || '';
          const url = itemUrl.startsWith('http') 
            ? itemUrl.replace(SITE_URL, '') || '/'
            : itemUrl || '/';
          return {
            name: item?.name || '',
            url: url
          };
        })}
      />
      <CityServiceSchema cityName={cityData.city} />
      <FAQSchema faqs={faqItems} />
      {safeLocalBusinessSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(safeLocalBusinessSchema) }}
        />
      )}
      
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Hero Section */}
          <section className="relative py-20 bg-background">
            {/* Background Gradient */}
            <div className="absolute inset-0 hero-gradient opacity-30"></div>
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-text-100 mb-6">
                  {cityData?.content?.hero?.h1 || `${cityData?.city || 'Stadt'} Bauschadensanalyse – verlässlich vor dem Hauskauf`}
                </h1>
                <p className="text-xl text-text-200 mb-8 leading-relaxed">
                  {cityData.content.hero.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Button
                    onClick={handleStartEvaluation}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-3"
                  >
                    {cityData.content.hero.cta.primary}
                  </Button>
                  <Button
                    onClick={() => scrollToSection('so-funktioniert')}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-3"
                  >
                    {cityData.content.hero.cta.secondary}
                  </Button>
                </div>
                
                {/* Hero Image */}
                <div className="mb-12 rounded-lg overflow-hidden shadow-soft">
                  <Image
                    src={cityData.images.hero.src}
                    alt={cityData.images.hero.alt}
                    width={cityData.images.hero.width}
                    height={cityData.images.hero.height}
                    priority={cityData.images.hero.loading === 'eager'}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Content Sections */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="prose prose-lg max-w-none">
                  <div className="space-y-12 text-text-200 leading-relaxed">
                    {cityData.content.sections.map((section, sectionIndex) => (
                      <div key={section.id || sectionIndex} id={section.id}>
                        <h2 className="text-2xl font-semibold text-text-100 mb-6">
                          {section.h2}
                        </h2>
                        
                        {/* Main content */}
                        {section.content && parseContentWithLinks(section.content)}

                        {/* Subsections */}
                        {section.subsections && section.subsections.map((subsection, subIndex) => (
                          <div key={subIndex} className="mb-8">
                            <h3 className="text-xl font-semibold text-text-100 mb-4 mt-6">
                              {subsection.h3}
                            </h3>
                            {subsection.content && parseContentWithLinks(subsection.content)}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 bg-bg-200">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-text-100 mb-4">
                    Häufig gestellte Fragen
                  </h2>
                  <p className="text-xl text-text-200">
                    Alles was Sie über unsere Bauschadensbewertung in {cityData.city} wissen müssen
                  </p>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  {cityData.faq.map((item, index) => (
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

          {/* Wo wir vertreten sind */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                  Wo wir vertreten sind:
                </h2>
                <p className="text-text-200 mb-8 max-w-2xl mx-auto">
                  Hier finden Sie uns und noch weitere Informationen zu den jeweiligen Städten.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
                  {cities.map((city) => {
                    const isCurrentCity = city.slug === currentCitySlug;
                    return (
                      <Link
                        key={city.slug}
                        href={`/${city.slug}`}
                        onClick={(e) => {
                          if (isCurrentCity) {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          } else {
                            setTimeout(() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }, 100);
                          }
                        }}
                        className={`inline-flex items-center justify-center px-4 py-3 rounded-md font-medium text-sm transition-all duration-200 shadow-soft hover:shadow-strong hover-lift ${
                          isCurrentCity
                            ? 'bg-primary/80 hover:bg-primary text-primary-foreground cursor-pointer'
                            : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        }`}
                      >
                        {city.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-text-100 mb-6">
                  {cityData.content.ctaSection?.h2 || ''}
                </h2>
                {cityData.content.ctaSection?.content && cityData.content.ctaSection.content.split('\n\n').map((paragraph, pIndex) => (
                  <p key={pIndex} className={pIndex === 0 ? "text-xl text-text-200 mb-8 leading-relaxed" : "text-lg text-text-200 mb-10 leading-relaxed"}>
                    {paragraph}
                  </p>
                ))}

                <div className="grid md:grid-cols-4 gap-4 mb-10">
                  {(cityData.content.ctaSection?.trustElements || []).map((element, index) => (
                    <div key={index} className="bg-background rounded-lg p-4 shadow-soft">
                      {getTrustIcon(element?.text || '')}
                      <p className="text-sm font-medium text-text-100">{element?.text || ''}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                  <Button
                    onClick={handleStartEvaluation}
                    size="lg"
                    className="bg-white hover:bg-gray-50 text-text-100 px-8 py-4 text-lg font-semibold border-2 border-primary"
                  >
                    {cityData.content.ctaSection?.primaryCTA?.text || 'Jetzt Bewertung starten'}
                  </Button>
                  <Button
                    onClick={() => scrollToSection('so-funktioniert')}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold"
                  >
                    {cityData.content.ctaSection?.secondaryCTA?.text || "So funktioniert's"}
                  </Button>
                </div>

                <p className="text-sm text-text-200 mt-4">
                  {cityData.content.ctaSection?.microcopy || ''}
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </>
  );
};

export default CityPageClient;

