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

const Hamburg = () => {
  const navigate = useNavigate();

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

  const faqItems = [
    {
      question: "Welche Gebäudetypen in Hamburg werden geprüft?",
      answer: "Alle Gebäudetypen werden analysiert: Backsteinbauten in Eimsbüttel oder Eppendorf, Gründerzeithäuser rund um die Außenalster, Nachkriegsbauten sowie moderne Neubauten in der HafenCity. Jeder Gebäudetyp hat spezifische Risiken, die in der Analyse berücksichtigt werden."
    },
    {
      question: "Wird bei Eigentumswohnungen auch das Gemeinschaftseigentum geprüft?",
      answer: "Soweit aus Unterlagen und Fotos erkennbar werden Hinweise zu Dach, Fassade, Treppenhaus und zentraler Haustechnik gegeben. Die Instandhaltungsrücklage und geplante Maßnahmen aus Eigentümerversammlungen werden berücksichtigt."
    },
    {
      question: "Wie schnell erhalte ich den Bericht für meine Immobilie in Hamburg?",
      answer: "Sie erhalten den Bericht per E-Mail als PDF innerhalb von 2 Werktagen nach vollständiger Übermittlung aller Unterlagen und Fotos."
    },
    {
      question: "Was kostet eine Bauschadensanalyse in Hamburg?",
      answer: "Die Preise sind transparent auf der Website einsehbar und gelten deutschlandweit einheitlich. Es gibt keine versteckten Kosten oder Zusatzgebühren für Hamburg."
    },
    {
      question: "Ersetzt die digitale Analyse einen Gutachter vor Ort?",
      answer: "Die digitale Analyse bietet eine fundierte Ersteinschätzung auf Basis der verfügbaren Informationen. Bei schwerwiegenden Mängeln oder komplexen Schadensbildern wird eine vertiefende Prüfung empfohlen."
    }
  ];

  // LocalBusiness Schema for Hamburg
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "bauklar.org - Bauschadensanalyse Hamburg",
    "image": `${SITE_URL}/og/hero-altbau.jpg`,
    "description": "Digitale Bauschadensanalyse und Kaufberatung für Immobilien in Hamburg",
    "areaServed": {
      "@type": "City",
      "name": "Hamburg",
      "containedInPlace": {
        "@type": "State",
        "name": "Hamburg"
      }
    },
    "priceRange": "ab 350€",
    "url": `${SITE_URL}/hamburg`
  };

  return (
    <>
      <SEO 
        title="Gutachter Hauskauf Hamburg – In 2 Tagen Klarheit | ab 350€ | bauklar.org"
        description="Unabhängige Bauschadensanalyse für Hauskauf in Hamburg. Backsteinbauten, Gründerzeit, Neubauten – digitale Prüfung mit verständlichem Bericht innerhalb von 2 Werktagen."
        canonical="/hamburg"
        ogImage="/images/hero-altbau.jpg"
        ogType="website"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Hamburg', url: '/hamburg' }
        ]} 
      />
      <CityServiceSchema cityName="Hamburg" />
      <FAQSchema faqs={faqItems} />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      </Helmet>
      
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
                  Bauschadensanalyse Hamburg – verlässlich vor dem Hauskauf
                </h1>
                <p className="text-xl text-text-200 mb-8 leading-relaxed">
                  Unabhängige Bewertung von Backsteinbauten, Gründerzeit und Neubauten in Hamburg. Digitale Analyse mit verständlichem Bericht innerhalb von 2 Werktagen – ohne Vor-Ort-Termin.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Button
                    onClick={handleStartEvaluation}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-3"
                  >
                    Jetzt Bewertung starten
                  </Button>
                  <Button
                    onClick={() => scrollToSection('so-funktioniert')}
                    className="border-2 border-primary bg-bg-200 text-white hover:bg-bg-300 hover:text-white font-medium px-6 py-3 transition-smooth shadow-soft"
                  >
                    So funktioniert's
                  </Button>
                </div>
                
                {/* Hero Image */}
                <div className="mb-12 rounded-lg overflow-hidden shadow-soft">
                  <img
                    src="/hamburg.jpg"
                    alt="Hamburger Stadtansicht – Bauschadensanalyse für Hauskauf in Hamburg"
                    width={1600}
                    height={900}
                    loading="eager"
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
                    
                    {/* Warum Bauschadensanalyse Section */}
                    <div id="warum-bauschadensanalyse">
                      <h2 className="text-2xl font-semibold text-text-100 mb-6">
                        Warum eine Bauschadensanalyse vor dem Immobilienkauf in Hamburg
                      </h2>
                      <p className="mb-4">
                        Der Kauf einer Immobilie in Hamburg ist eine bedeutende finanzielle Entscheidung. Ob charakteristisches Backsteinhaus in Eimsbüttel, großbürgerliche Villa am Alsterufer oder moderne Eigentumswohnung in der HafenCity – der äußere Eindruck täuscht häufig über den tatsächlichen Zustand. Verdeckte Mängel führen nach dem Kauf zu unerwarteten Kosten, die schnell fünf- bis sechsstellige Beträge erreichen.
                      </p>
                      <p className="mb-4">
                        Eine Bauschadensanalyse schafft Transparenz. Sie zeigt auf, welche Bauteile intakt sind, wo Sanierungsbedarf besteht und welche Kosten voraussichtlich anfallen. Diese Klarheit ermöglicht eine fundierte Entscheidung darüber, ob die Immobilie zum angebotenen Preis kaufenswert ist oder ob Nachverhandlungen erforderlich sind.
                      </p>
                      <p className="mb-4">
                        Besonders in Hamburg mit seinem charakteristischen Gebäudebestand ist fachliche Einschätzung wertvoll. Die Hansestadt ist geprägt von Backsteinarchitektur, die seit Jahrhunderten das Stadtbild bestimmt. Vom Mittelalter über die Gründerzeit bis zu modernen Interpretationen in der HafenCity – roter Backstein ist das prägende Element Hamburger Baukunst. Diese Bauweise bringt spezifische Herausforderungen mit sich, die Fachwissen erfordern.
                      </p>
                      <p>
                        Die digitale Bauschadensanalyse von bauklar.org bietet Ihnen eine unabhängige Einschätzung durch qualifizierte Sachverständige. Auf Basis Ihrer Fotos, Unterlagen und Angaben wird der Bauzustand systematisch bewertet. Sie erhalten den Bericht per E-Mail innerhalb von 2 Werktagen und können direkt mit fundierten Informationen in Kaufverhandlungen gehen.
                      </p>
                    </div>

                    {/* Typische Gebäude Hamburg Section */}
                    <div id="typische-gebaeude-hamburg">
                      <h2 className="text-2xl font-semibold text-text-100 mb-6">
                        Typische Gebäudetypen und Risiken in Hamburg
                      </h2>
                      
                      {/* Backsteinbauten */}
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-text-100 mb-4 mt-6">
                          Backsteinbauten in Eimsbüttel, Eppendorf und Winterhude
                        </h3>
                        <p className="mb-4">
                          Backsteinarchitektur prägt Hamburg wie kaum eine andere deutsche Stadt. Der charakteristische rote Backstein findet sich in nahezu allen Stadtteilen und Epochen. Besonders ausgeprägt ist diese Bauweise in den Gründerzeitvierteln rund um die Außenalster sowie in den von Fritz Schumacher geprägten Wohnsiedlungen der 1920er Jahre.
                        </p>
                        <p className="mb-4">
                          Gründerzeitliche Backsteinbauten aus der Zeit nach 1860 zeichnen sich durch massive Ziegelwände, hohe Geschosshöhen und oft weiß geschlämmte Fassaden mit Ornamenten aus. Anders als in vielen anderen Städten wurde in Hamburg vorwiegend in Blockbauweise mit nur einem Innenhof gebaut, nicht in der Berliner Bauweise mit mehreren Hinterhöfen. Diese Innenhöfe dienten als Garten oder Erholungsfläche.
                        </p>
                        <p className="mb-4">
                          Häufige Schwachstellen bei Hamburger Backsteinbauten sind Feuchtigkeit durch defekte Fugenmörtel zwischen den Ziegelsteinen. Frost-Tau-Wechsel und die hohe Luftfeuchtigkeit der Hansestadt setzen den Fugen zu. Aufsteigende Feuchtigkeit aus dem Erdreich tritt bei älteren Gebäuden ohne Horizontalsperre auf. Durchfeuchtetes Mauerwerk führt zu Salzausblühungen, Frostschäden und Schimmelbildung.
                        </p>
                        <p>
                          Die Schumacher-Bauten aus den 1910er bis 1930er Jahren sind als Arbeiterwohnungen konzipiert und zeichnen sich durch angemessene Wohnungsgrößen und solide Bauweise aus. Diese Gebäude sind heute als vergleichsweise bezahlbare Alternative zum klassischen Gründerzeitaltbau geschätzt. Dennoch zeigen auch sie nach fast 100 Jahren Alterungserscheinungen wie veraltete Haustechnik, undichte Dächer oder sanierungsbedürftige Holzfenster.
                        </p>
                      </div>

                      {/* Großbürgerliche Villen */}
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-text-100 mb-4 mt-6">
                          Großbürgerliche Villen an Alster und Elbe
                        </h3>
                        <p className="mb-4">
                          Die Aufhebung der Torsperre 1860 ermöglichte reicheren Bürgern den Umzug in größere Wohnungen der Vororte. Es entstanden großbürgerliche Wohnviertel rund um die Außenalster, am Elbhang in Blankenese und Othmarschen. Diese Häuser wurden meist aus Backstein errichtet, aber die Fassaden in Weiß mit aufwendigen Ornamenten gehalten.
                        </p>
                        <p className="mb-4">
                          Diese Villen zeichnen sich durch großzügige Grundrisse, repräsentative Eingangsbereiche, hochwertige Materialien und aufwendige Stuckarbeiten aus. Viele verfügen über Gärten, Wintergärten oder Terrassen mit Wasserblick. Die Bauqualität ist grundsätzlich hoch, jedoch erfordern diese Gebäude aufgrund ihrer Größe und Ausstattung erheblichen Instandhaltungsaufwand.
                        </p>
                        <p className="mb-4">
                          Typische Probleme sind undichte Flachdächer oder Mansarddächer, veraltete Heizungsanlagen mit hohem Energieverbrauch, marode Holzkonstruktionen in Dachstühlen oder Balkonen sowie sanierungsbedürftige Außenanlagen. Die Modernisierung der Haustechnik auf heutige Standards ist kostspielig, verbessert aber Komfort und Energieeffizienz erheblich.
                        </p>
                        <p>
                          Bei denkmalgeschützten Villen sind Sanierungen nur in Abstimmung mit der Denkmalschutzbehörde möglich. Dies betrifft vor allem Fassadenarbeiten, Fensteraustausch und Dachsanierungen. Die Auflagen können Mehrkosten verursachen, sichern aber den Erhalt des architektonischen Erbes.
                        </p>
                      </div>

                      {/* Nachkriegsbauten */}
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-text-100 mb-4 mt-6">
                          Nachkriegsbauten und Wiederaufbau
                        </h3>
                        <p className="mb-4">
                          Hamburg wurde im Zweiten Weltkrieg erheblich zerstört, insbesondere Arbeiterviertel und Teile der Innenstadt. Anders als in vielen anderen Städten fand selten eine originalgetreue Wiederherstellung statt. Stattdessen entstanden funktionale Bauten der 1950er bis 1970er Jahre, die schnell Wohnraum für Neubürger und Vertriebene schaffen sollten.
                        </p>
                        <p className="mb-4">
                          Charakteristisch für diese Epoche sind Reihenhaussiedlungen nach Gartenstadtidee, erste Wohnhochhäuser wie die Grindelhochhäuser sowie später Großwohnsiedlungen. Die Bauweise war pragmatisch: Betonfertigteile, einfache Grundrisse, standardisierte Ausstattung. Die Qualität variiert erheblich je nach Baujahr und Bauträger.
                        </p>
                        <p className="mb-4">
                          Häufige Mängel sind unzureichende Wärmedämmung mit hohen Heizkosten, undichte Flachdächer, Betonschäden durch Korrosion der Bewehrung sowie veraltete Elektro- und Sanitärinstallationen. Fenster entsprechen oft nicht mehr heutigen Anforderungen an Schallschutz und Energieeffizienz. Die Modernisierung dieser Gebäude kann deren Wert erheblich steigern, erfordert aber substanzielle Investitionen.
                        </p>
                      </div>

                      {/* Neubauten */}
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-text-100 mb-4 mt-6">
                          Neubauten in HafenCity und moderne Architektur
                        </h3>
                        <p className="mb-4">
                          Hamburg entwickelt sich kontinuierlich weiter. Die HafenCity ist Europas größtes innerstädtisches Stadtentwicklungsprojekt und vereint moderne Architektur mit urbaner Mischnutzung. Wohnen, Arbeiten und Freizeit wachsen hier zu einem neuen Stadtteil zusammen. Die architektonische Bandbreite reicht von Backstein-Interpretationen bis zu Glas-Stahl-Konstruktionen.
                        </p>
                        <p className="mb-4">
                          Neubauten unterliegen hohen energetischen Anforderungen und Brandschutzvorgaben. Dennoch sind auch moderne Gebäude nicht frei von Mängeln. Häufige Probleme sind Abdichtungsfehler an Balkonen und Terrassen, mangelhafte Ausführung von Wärmedämmverbundsystemen, Schallschutzprobleme zwischen Wohneinheiten sowie Mängel an Haustechnik und Lüftungsanlagen.
                        </p>
                        <p className="mb-4">
                          Die besonderen Herausforderungen in der HafenCity sind Hochwasserschutz und Feuchtigkeitsbelastung durch die Wassernähe. Gebäude stehen auf Warften oder haben verstärkte Sockelzonen. Die Abdichtung muss dauerhaft drückendem Wasser standhalten. Eine Prüfung bereits vor Übergabe kann Gewährleistungsansprüche sichern.
                        </p>
                        <p>
                          Bei Eigentumswohnungen in Neubauten ist die Qualität der Eigentümergemeinschaft entscheidend. Geringe Instandhaltungsrücklagen und fehlende Rückstellungen für absehbare Sanierungen deuten auf unzureichende Verwaltung hin.
                        </p>
                      </div>
                    </div>

                    {/* Ablauf Section */}
                    <div id="ablauf">
                      <h2 className="text-2xl font-semibold text-text-100 mb-6">
                        Ablauf der digitalen Bauschadensanalyse
                      </h2>
                      <p className="mb-4">
                        Die Bauschadensanalyse erfolgt vollständig digital und erfordert keine Terminvereinbarung. Sie laden Fotos der Immobilie sowie vorhandene Unterlagen wie Energieausweise hoch. Ergänzend geben Sie relevante Informationen zu Baujahr, Bauweise, erkannten Mängeln und geplanten Nutzungen an.
                      </p>
                      <p className="mb-4">
                        Je vollständiger die eingereichten Informationen sind, desto präziser kann die Bewertung erfolgen. Fotos sollten alle wesentlichen Bereiche dokumentieren: Fassade, Dach, Keller, Heizungsanlage, Fenster, Sanitärinstallationen und erkennbare Schadensstellen. Auch unscheinbare Details wie Risse, Feuchtigkeitsflecken oder Schimmelansätze sind wichtig.
                      </p>
                      <p className="mb-4">
                        Ein qualifizierter Sachverständiger analysiert die eingereichten Daten systematisch. Bausubstanz, Haustechnik, Feuchtigkeitserscheinungen, Risse und weitere Schadensmuster werden erfasst und bewertet. Die Einschätzung berücksichtigt typische Alterungserscheinungen des jeweiligen Gebäudetyps, übliche Sanierungszyklen und erkennbare Risikofaktoren.
                      </p>
                      <p className="mb-4">
                        Sie erhalten den Bericht per E-Mail als PDF innerhalb von 2 Werktagen nach vollständiger Datenübermittlung. Der Bericht kann für Bankgespräche, Verhandlungen mit Verkäufern oder als Grundlage für die Sanierungsplanung genutzt werden.
                      </p>
                      <p>
                        Diese Form der Bewertung bietet eine fundierte Grundlage für Ihre Kaufentscheidung ohne aufwendige Koordination oder zeitliche Abstimmungen. Die Analyse erfolgt unabhängig und objektiv ausschließlich auf Basis der technischen Gegebenheiten. Detaillierte Informationen zum Ablauf finden Sie unter{' '}
                        <a
                          href="/#so-funktioniert"
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('so-funktioniert');
                          }}
                          className="text-primary hover:underline font-medium"
                        >
                          So funktioniert's
                        </a>.
                      </p>
                    </div>

                    {/* Was Sie erhalten Section */}
                    <div id="was-sie-erhalten">
                      <h2 className="text-2xl font-semibold text-text-100 mb-6">
                        Was der Bericht enthält
                      </h2>
                      <p className="mb-4">
                        Der Bericht stellt den Zustand der Immobilie strukturiert und nachvollziehbar dar. Wesentliche Bauteile wie Tragwerk, Dach, Fassade, Fenster, Haustechnik und Innenausbau werden einzeln bewertet. Jedes Bauteil erhält eine Einschätzung seines aktuellen Zustands.
                      </p>
                      <p className="mb-4">
                        Erkannte Mängel werden beschrieben, ihre voraussichtliche Ursache erläutert und ihre Bedeutung für die Bausubstanz eingeordnet. Nicht jeder Mangel ist gleich schwerwiegend. Der Bericht unterscheidet zwischen kosmetischen Mängeln, Instandhaltungsrückstau und substanziellen Schäden, die kurzfristig behoben werden sollten.
                      </p>
                      <p className="mb-4">
                        Zu wesentlichen Schadenspositionen erhalten Sie nachvollziehbare Kostenspannen. Diese orientieren sich an üblichen Marktpreisen und berücksichtigen verschiedene Sanierungsvarianten. Die Spannen sind bewusst realistisch gehalten, um eine verlässliche Kalkulationsgrundlage zu bieten. Pauschale oder geschönte Angaben werden vermieden.
                      </p>
                      <p className="mb-4">
                        Die Priorisierung zeigt auf, welche Maßnahmen voraussichtlich kurzfristig erforderlich sind und welche mittelfristig geplant werden sollten. Dies ermöglicht eine strukturierte Finanzplanung und verhindert, dass dringliche Instandsetzungen übersehen werden. Langfristige Modernisierungspotenziale werden ebenfalls benannt.
                      </p>
                      <p className="mb-4">
                        Fachbegriffe werden verständlich erklärt, technische Zusammenhänge nachvollziehbar dargestellt. Der Bericht richtet sich an Käufer ohne bautechnische Vorkenntnisse und verzichtet auf unnötiges Fachvokabular. Gleichzeitig ist er präzise genug, um bei Bedarf mit Handwerkern oder Architekten besprochen zu werden.
                      </p>
                      <p>
                        Zusätzlich werden erkennbare Chancen benannt. Nicht jede Immobilie mit Mängeln ist problematisch. Oft lassen sich durch gezielte Maßnahmen Wert und Wohnqualität erheblich steigern. Der Bericht hilft, realistische von überzogenen Bedenken zu unterscheiden und die tatsächlichen Risiken einzuordnen. Transparente Informationen zu Preisen finden Sie unter{' '}
                        <a
                          href="/#preise"
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('preise');
                          }}
                          className="text-primary hover:underline font-medium"
                        >
                          Preise
                        </a>.
                      </p>
                    </div>

                    {/* Lokale Besonderheiten Section */}
                    <div id="lokale-besonderheiten">
                      <h2 className="text-2xl font-semibold text-text-100 mb-6">
                        Lokale Besonderheiten des Hamburger Immobilienmarkts
                      </h2>
                      <p className="mb-4">
                        Hamburg unterscheidet sich als Immobilienmarkt durch seine maritime Lage und die damit verbundenen Herausforderungen. Die hohe Luftfeuchtigkeit der Hansestadt belastet Bausubstanz stärker als in Binnenlandregionen. Fassaden, Fenster und Dächer sind erhöhter Witterungsbelastung ausgesetzt. Salzhaltige Luft in Hafennähe kann Korrosion an metallischen Bauteilen beschleunigen.
                      </p>
                      <p className="mb-4">
                        Der Untergrund Hamburgs ist geprägt von Marschland, Sand und stellenweise Kleiboden. Die Bodenbeschaffenheit beeinflusst Gründungsarten und Setzungsverhalten. In Elbufernähe und tiefliegenden Stadtteilen spielen Grundwasserstände und Hochwasserschutz eine wichtige Rolle. Gebäude in HafenCity und Hafenrandlagen müssen entsprechend abgedichtet sein.
                      </p>
                      <p className="mb-4">
                        Die Backsteinarchitektur ist nicht nur ästhetisch prägend, sondern auch bauphysikalisch relevant. Backsteinmauerwerk hat spezifische Eigenschaften hinsichtlich Feuchtigkeitstransport, Wärmedämmung und Tragfähigkeit. Sanierungen müssen diese Eigenschaften berücksichtigen, sonst drohen Bauschäden durch unsachgemäße Maßnahmen.
                      </p>
                      <p className="mb-4">
                        Die kontinuierliche Stadtentwicklung Hamburgs schafft neue Quartiere, während historische Stadtteile bewahrt werden. Dieser Kontrast zwischen Tradition und Moderne ist charakteristisch für Hamburg. Bei Neubauten in historischer Umgebung sind oft gestalterische Auflagen zu beachten, die Mehrkosten verursachen können.
                      </p>
                      <p>
                        Weitere Informationen zum Hamburger Immobilienmarkt und baurechtliche Hinweise finden Sie bei der{' '}
                        <a href="https://www.hamburg.de/bsw/" rel="nofollow" className="text-primary hover:underline font-medium">
                          Behörde für Stadtentwicklung und Wohnen Hamburg
                        </a>{' '}
                        sowie beim{' '}
                        <a href="https://www.mieterverein-hamburg.de" rel="nofollow" className="text-primary hover:underline font-medium">
                          Mieterverein zu Hamburg
                        </a>.
                      </p>
                    </div>
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
                    Alles was Sie über unsere Bauschadensbewertung in Hamburg wissen müssen
                  </p>
                </div>

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
                  {[
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
                  ].map((city) => {
                    const isCurrentCity = city.slug === 'hamburg';
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

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-text-100 mb-6">
                  Jetzt Bauzustand Ihrer Wunschimmobilie in Hamburg prüfen lassen
                </h2>
                <p className="text-xl text-text-200 mb-8 leading-relaxed">
                  Eine fundierte Bauschadensanalyse gibt Ihnen Sicherheit vor dem Immobilienkauf. Sie erhalten objektive Einschätzungen durch qualifizierte Sachverständige, realistische Kostenrahmen für erkannte Mängel und verständliche Handlungsempfehlungen. Die digitale Bewertung ist zeitlich flexibel, transparent und erfolgt ohne Vor-Ort-Termine.
                </p>
                <p className="text-lg text-text-200 mb-10 leading-relaxed">
                  Sie erhalten den Bericht per E-Mail als PDF innerhalb von 2 Werktagen und haben damit Klarheit für Ihre Kaufentscheidung. Sie können ihn für Verhandlungen mit Verkäufern nutzen, Ihrer Bank vorlegen oder als Grundlage für die Sanierungsplanung verwenden. Starten Sie jetzt die Bewertung und treffen Sie Ihre Kaufentscheidung auf fundierter Basis.
                </p>

                <div className="grid md:grid-cols-4 gap-4 mb-10">
                  <div className="bg-background rounded-lg p-4 shadow-soft">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-text-100">Qualifizierte Sachverständige</p>
                  </div>
                  <div className="bg-background rounded-lg p-4 shadow-soft">
                    <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-text-100">Bericht innerhalb von 2 Werktagen</p>
                  </div>
                  <div className="bg-background rounded-lg p-4 shadow-soft">
                    <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-text-100">Transparente Kostenspannen</p>
                  </div>
                  <div className="bg-background rounded-lg p-4 shadow-soft">
                    <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-text-100">Keine versteckten Kosten</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                  <Button
                    onClick={handleStartEvaluation}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold"
                  >
                    Jetzt Bewertung starten
                  </Button>
                  <Button
                    onClick={() => scrollToSection('so-funktioniert')}
                    size="lg"
                    className="border-2 border-primary bg-bg-200 text-white hover:bg-bg-300 hover:text-white px-8 py-4 text-lg font-semibold transition-smooth shadow-soft"
                  >
                    So funktioniert's ansehen
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
      </div>
    </>
  );
};

export default Hamburg;

