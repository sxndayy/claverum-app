import React from 'react';
import { SEO } from '@/components/SEO';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';
import { CityServiceSchema } from '@/components/CityServiceSchema';
import { FAQSchema } from '@/components/FAQSchema';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Clock, CheckCircle, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '@/constants/config';
import essenData from '@/data/cities/essen.json';
import { CityData } from '@/types/city';

const Essen = () => {
  const navigate = useNavigate();
  const cityData = essenData as unknown as CityData;

  const handleStartEvaluation = () => {
    navigate('/evaluation');
  };

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      navigate('/');
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

  const faqItems = (cityData.faq || []).map(item => ({
    question: item.question || '',
    answer: item.answer || ''
  }));

  const localBusinessSchema = cityData.structuredData?.localBusiness;
  const safeLocalBusinessSchema = localBusinessSchema && Object.keys(localBusinessSchema).length > 0 
    ? localBusinessSchema 
    : null;

  const trustElementIcons: Record<string, React.ReactNode> = {
    'Qualifizierte Sachverständige': <Shield className="h-8 w-8 text-primary mx-auto mb-2" />,
    'Bericht innerhalb von 2 Werktagen': <Clock className="h-8 w-8 text-primary mx-auto mb-2" />,
    'Transparente Kostenspannen': <FileText className="h-8 w-8 text-primary mx-auto mb-2" />,
    'Keine versteckten Kosten': <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />,
  };

  const getTrustIcon = (text: string) => {
    return trustElementIcons[text] || <Shield className="h-8 w-8 text-primary mx-auto mb-2" />;
  };

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

  const currentCitySlug = cityData.slug;

  return (
    <>
      <SEO 
        title={cityData.seo.title}
        description={cityData.seo.metaDescription}
        canonical={cityData.seo.canonical}
        ogImage={cityData.seo.openGraph.image}
        ogType={cityData.seo.openGraph.type}
      />
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
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(safeLocalBusinessSchema)}
          </script>
        </Helmet>
      )}
      
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <section className="relative py-20 bg-background">
            <div className="absolute inset-0 hero-gradient opacity-30"></div>
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-text-100 mb-6">
                  {cityData.content.hero.h1}
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
                    className="border-2 border-primary bg-bg-200 text-white hover:bg-bg-300 hover:text-white font-medium px-6 py-3 transition-smooth shadow-soft"
                  >
                    {cityData.content.hero.cta.secondary}
                  </Button>
                </div>
                
                <div className="mb-12 rounded-lg overflow-hidden shadow-soft">
                  <img
                    src={cityData.images.hero.src}
                    alt={cityData.images.hero.alt}
                    width={cityData.images.hero.width}
                    height={cityData.images.hero.height}
                    loading={cityData.images.hero.loading || 'eager'}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

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
                        
                        {section.content && section.content.split('\n\n').map((paragraph, pIndex) => (
                          <p key={pIndex} className="mb-4">
                            {paragraph.split(/(<link[^>]*>.*?<\/link>|<a[^>]*>.*?<\/a>)/).map((part, linkIndex) => {
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
                                }
                              }
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
                        ))}

                        {section.subsections && section.subsections.map((subsection, subIndex) => (
                          <div key={subIndex} className="mb-8">
                            <h3 className="text-xl font-semibold text-text-100 mb-4 mt-6">
                              {subsection.h3}
                            </h3>
                            {subsection.content && subsection.content.split('\n\n').map((paragraph, pIndex) => (
                              <p key={pIndex} className="mb-4">
                                {paragraph.split(/(<link[^>]*>.*?<\/link>|<a[^>]*>.*?<\/a>)/).map((part, linkIndex) => {
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
                                    }
                                  }
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
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

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
                        to={`/${city.slug}`}
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
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold"
                  >
                    {cityData.content.ctaSection?.primaryCTA?.text || 'Jetzt Bewertung starten'}
                  </Button>
                  <Button
                    onClick={() => scrollToSection('so-funktioniert')}
                    size="lg"
                    className="border-2 border-primary bg-bg-200 text-white hover:bg-bg-300 hover:text-white px-8 py-4 text-lg font-semibold transition-smooth shadow-soft"
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

export default Essen;

