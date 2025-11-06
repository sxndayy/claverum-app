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

const Muenchen = () => {
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
      question: "Welche Gebäudetypen in München werden geprüft?",
      answer: "Alle Gebäudetypen werden analysiert: Gründerzeithäuser in Schwabing oder Haidhausen, großbürgerliche Villen in Bogenhausen, Nachkriegsbauten sowie moderne Neubauten. Jeder Gebäudetyp hat spezifische Risiken, die in der Analyse berücksichtigt werden."
    },
    {
      question: "Wird bei Eigentumswohnungen auch das Gemeinschaftseigentum geprüft?",
      answer: "Soweit aus Unterlagen und Fotos erkennbar werden Hinweise zu Dach, Fassade, Treppenhaus und zentraler Haustechnik gegeben. Die Instandhaltungsrücklage und geplante Maßnahmen aus Eigentümerversammlungen werden berücksichtigt."
    },
    {
      question: "Wie schnell erhalte ich den Bericht für meine Immobilie in München?",
      answer: "Sie erhalten den Bericht per E-Mail als PDF innerhalb von 2 Werktagen nach vollständiger Übermittlung aller Unterlagen und Fotos."
    },
    {
      question: "Was kostet eine Bauschadensanalyse in München?",
      answer: "Die Preise sind transparent auf der Website einsehbar und gelten deutschlandweit einheitlich. Es gibt keine versteckten Kosten oder Zusatzgebühren für München."
    },
    {
      question: "Ersetzt die digitale Analyse einen Gutachter vor Ort?",
      answer: "Die digitale Analyse bietet eine fundierte Ersteinschätzung auf Basis der verfügbaren Informationen. Bei schwerwiegenden Mängeln oder komplexen Schadensbildern wird eine vertiefende Prüfung empfohlen."
    }
  ];

  // LocalBusiness Schema for München
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "bauklar.org - Bauschadensanalyse München",
    "image": `${SITE_URL}/og/hero-altbau.jpg`,
    "description": "Digitale Bauschadensanalyse und Kaufberatung für Immobilien in München",
    "areaServed": {
      "@type": "City",
      "name": "München",
      "containedInPlace": {
        "@type": "State",
        "name": "Bayern"
      }
    },
    "priceRange": "ab 350€",
    "url": `${SITE_URL}/muenchen`
  };

  return (
    <>
      <SEO 
        title="Gutachter Hauskauf München – In 2 Tagen Klarheit | ab 350€ | bauklar.org"
        description="Unabhängige Bauschadensanalyse für Hauskauf in München. Gründerzeit, Altbau-Villen, Neubauten – digitale Prüfung mit verständlichem Bericht innerhalb von 2 Werktagen."
        canonical="/muenchen"
        ogImage="/images/hero-altbau.jpg"
        ogType="website"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'München', url: '/muenchen' }
        ]} 
      />
      <CityServiceSchema cityName="München" />
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
                  Bauschadensanalyse München – verlässlich vor dem Hauskauf
                </h1>
                <p className="text-xl text-text-200 mb-8 leading-relaxed">
                  Unabhängige Bewertung von Gründerzeit, Altbau-Villen und Neubauten in München. Digitale Analyse mit verständlichem Bericht innerhalb von 2 Werktagen – ohne Vor-Ort-Termin.
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
                    src="/muenchen.jpg"
                    alt="Münchner Stadtansicht – Bauschadensanalyse für Hauskauf in München"
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
                        Warum eine Bauschadensanalyse vor dem Immobilienkauf in München
                      </h2>
                      <p className="mb-4">
                        Der Kauf einer Immobilie in München ist eine bedeutende finanzielle Entscheidung. Ob Gründerzeithaus in Schwabing, großbürgerliche Villa in Bogenhausen oder moderne Eigentumswohnung in Neuhausen – der äußere Eindruck täuscht häufig über den tatsächlichen Zustand. Verdeckte Mängel führen nach dem Kauf zu unerwarteten Kosten, die schnell fünf- bis sechsstellige Beträge erreichen.
                      </p>
                      <p className="mb-4">
                        Eine Bauschadensanalyse schafft Transparenz. Sie zeigt auf, welche Bauteile intakt sind, wo Sanierungsbedarf besteht und welche Kosten voraussichtlich anfallen. Diese Klarheit ermöglicht eine fundierte Entscheidung darüber, ob die Immobilie zum angebotenen Preis kaufenswert ist oder ob Nachverhandlungen erforderlich sind.
                      </p>
                      <p className="mb-4">
                        Besonders in München mit seinem hohen Preisniveau ist fachliche Einschätzung wertvoll. Die Stadt ist geprägt von einem Mix aus historischer Bausubstanz, Kriegswiederaufbau und modernem Neubau. Die königliche Stadtplanung unter Ludwig I. schuf im 19. Jahrhundert repräsentative Straßenzüge und großzügige Platzanlagen. Gründerzeitviertel entstanden mit herrschaftlichen Wohnbauten für das aufstrebende Bürgertum. Nach den Zerstörungen des Zweiten Weltkriegs wurde teils originalgetreu wiederaufgebaut, teils entstanden funktionale Nachkriegsbauten.
                      </p>
                      <p>
                        Die digitale Bauschadensanalyse von bauklar.org bietet Ihnen eine unabhängige Einschätzung durch qualifizierte Sachverständige. Auf Basis Ihrer Fotos, Unterlagen und Angaben wird der Bauzustand systematisch bewertet. Sie erhalten den Bericht per E-Mail innerhalb von 2 Werktagen und können direkt mit fundierten Informationen in Kaufverhandlungen gehen.
                      </p>
                    </div>

                    {/* Typische Gebäude München Section */}
                    <div id="typische-gebaeude-muenchen">
                      <h2 className="text-2xl font-semibold text-text-100 mb-6">
                        Typische Gebäudetypen und Risiken in München
                      </h2>
                      
                      {/* Gründerzeithäuser */}
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-text-100 mb-4 mt-6">
                          Gründerzeithäuser in Schwabing, Haidhausen und der Maxvorstadt
                        </h3>
                        <p className="mb-4">
                          Münchner Gründerzeitbauten aus der Zeit zwischen 1870 und 1910 unterscheiden sich in einigen Merkmalen von denen anderer deutscher Städte. Die Bauweise folgte häufig dem Vorbild italienischer Palazzi mit verputzten Fassaden in hellen Farbtönen, Gliederungen durch Gesimse und Pilaster sowie aufwendigen Stuckornamenten. Anders als in Berlin dominiert nicht der Backstein, sondern verputztes Ziegelmauerwerk.
                        </p>
                        <p className="mb-4">
                          Die innere Struktur entspricht der typischen Blockrandbebauung mit Vorderhäusern zur Straße, Seitenflügeln und Hinterhäusern zum Innenhof. Die Geschosshöhen sind großzügig, oft über drei Meter. Die Wohnungen waren für das wohlhabende Bürgertum konzipiert und verfügen über repräsentative Eingangsbereiche, Stuckdecken und teilweise Parkettböden.
                        </p>
                        <p className="mb-4">
                          Häufige Schwachstellen dieser Gebäude sind Feuchtigkeit in Kellern durch fehlende oder defekte Horizontalsperren. Das Münchner Grundwasser steht in vielen Stadtteilen hoch, was Abdichtungsprobleme verschärft. Holzbalkendecken können durch Schädlingsbefall oder statische Überlastung geschädigt sein. Stuckfassaden zeigen nach über 100 Jahren oft Risse, Abplatzungen oder Durchfeuchtung.
                        </p>
                        <p>
                          Die Haustechnik entspricht selten heutigen Standards. Wasserleitungen aus Blei oder verzinktem Stahl sind sanierungsbedürftig, Elektroinstallationen genügen oft nicht mehr den Sicherheitsanforderungen, und alte Gasthermen oder Ofenheizungen sollten durch moderne Heizsysteme ersetzt werden. Die energetische Sanierung dieser Gebäude ist kostspielig, verbessert aber Wohnkomfort und Betriebskosten erheblich.
                        </p>
                      </div>

                      {/* Großbürgerliche Villen */}
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-text-100 mb-4 mt-6">
                          Großbürgerliche Villen in Bogenhausen, Lehel und am Isarhochufer
                        </h3>
                        <p className="mb-4">
                          München verfügt über einen bemerkenswerten Bestand an großbürgerlichen Villen aus der Zeit zwischen 1850 und 1930. Diese Häuser entstanden in bevorzugten Lagen wie Bogenhausen, am Isarhochufer, im Lehel oder in den Villenkolonien am Starnberger See im erweiterten Einzugsgebiet der Stadt. Sie dienten dem wohlhabenden Bürgertum und Geldadel als repräsentative Wohnsitze.
                        </p>
                        <p className="mb-4">
                          Die Architektur reicht vom klassizistischen Landhausstil über Neorenaissance und Neobarock bis zum Jugendstil. Charakteristisch sind großzügige Grundrisse mit 200 bis 500 Quadratmetern Wohnfläche, hochwertige Materialien wie Marmor und Eichenholz, aufwendige Stuckarbeiten und Wandmalereien sowie parkähnliche Gärten. Viele Villen stehen unter Denkmalschutz.
                        </p>
                        <p className="mb-4">
                          Die Instandhaltung dieser Gebäude ist aufwendig und kostspielig. Dächer mit Naturschiefer oder Biberschwanzziegeln erfordern regelmäßige Wartung. Holzkonstruktionen in Dachstühlen können von Schädlingen befallen oder durch Feuchtigkeit geschädigt sein. Fassaden benötigen alle 20 bis 30 Jahre Erneuerung von Putz und Anstrich. Die Heizungsanlagen sind oft veraltet und ineffizient.
                        </p>
                        <p>
                          Bei denkmalgeschützten Villen sind Sanierungen nur in Abstimmung mit dem Bayerischen Landesamt für Denkmalpflege möglich. Dies betrifft Fassadenarbeiten, Fensteraustausch, Dachsanierungen und teilweise auch Innenausbauten. Die Auflagen können Mehrkosten verursachen, sichern aber den Erhalt der historischen Substanz. Fördermittel für Denkmalsanierungen können einen Teil der Kosten abdecken.
                        </p>
                      </div>

                      {/* Nachkriegsbauten */}
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-text-100 mb-4 mt-6">
                          Nachkriegsbauten und Wiederaufbau der 1950er bis 1970er Jahre
                        </h3>
                        <p className="mb-4">
                          München wurde im Zweiten Weltkrieg erheblich zerstört. Große Teile der Altstadt, der Gründerzeitviertel und der Verkehrsinfrastruktur waren nach 1945 in Trümmern. Der Wiederaufbau erfolgte teils durch originalgetreue Rekonstruktion historischer Gebäude, überwiegend aber durch funktionale Neubauten der 1950er bis 1970er Jahre.
                        </p>
                        <p className="mb-4">
                          Charakteristisch für diese Epoche sind schlichte Putzfassaden, standardisierte Grundrisse, einfache Ausstattungen und pragmatische Baulösungen. Ziel war die schnelle Schaffung von Wohnraum für Vertriebene, Flüchtlinge und die wachsende Bevölkerung. Die Bauqualität variiert je nach Bauträger und Baujahr erheblich.
                        </p>
                        <p className="mb-4">
                          Häufige Mängel sind unzureichende Wärmedämmung mit hohen Heizkosten, undichte Flachdächer oder Balkone, Betonschäden durch Korrosion der Bewehrung sowie veraltete Haustechnik. Fenster entsprechen oft nicht mehr heutigen Anforderungen an Schallschutz und Energieeffizienz. Die Modernisierung kann den Wert dieser Gebäude erheblich steigern.
                        </p>
                        <p>
                          In einigen Fällen wurde bei Nachkriegsbauten Asbest verbaut, besonders in Fassadenplatten, Dacheindeckungen oder als Brandschutz. Die Entsorgung asbesthaltiger Materialien unterliegt strengen Vorschriften und verursacht Mehrkosten bei Sanierungen.
                        </p>
                      </div>

                      {/* Neubauten */}
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-text-100 mb-4 mt-6">
                          Moderne Neubauten und zeitgenössische Architektur
                        </h3>
                        <p className="mb-4">
                          München entwickelt sich kontinuierlich weiter. Neue Stadtquartiere entstehen auf ehemaligen Gewerbe- und Bahnflächen. Bekannte Beispiele sind das Werksviertel am Ostbahnhof, die Parkstadt Schwabing auf dem ehemaligen Flughafenareal Oberwiesenfeld oder die Bebauung der Bayernkaserne. Diese Quartiere verbinden Wohnen, Arbeiten und Kultur.
                        </p>
                        <p className="mb-4">
                          Moderne Architektur in München reicht von konservativen Entwürfen, die sich an historische Vorbilder anlehnen, bis zu avantgardistischen Bauten internationaler Stararchitekten. Neubauten unterliegen hohen energetischen Anforderungen gemäß Gebäudeenergiegesetz und strengen Brandschutzvorschriften.
                        </p>
                        <p className="mb-4">
                          Dennoch sind auch moderne Gebäude nicht frei von Mängeln. Häufige Probleme sind Abdichtungsfehler an Balkonen, Terrassen und erdberührenden Bauteilen, mangelhafte Ausführung von Wärmedämmverbundsystemen mit Wärmebrücken oder Schimmelgefahr, Schallschutzprobleme zwischen Wohneinheiten sowie Mängel an Haustechnik, Lüftungsanlagen oder Aufzügen.
                        </p>
                        <p>
                          Bei Neubauten ist die Bauabnahme vor Übergabe entscheidend. Eine Prüfung durch einen unabhängigen Sachverständigen kann verdeckte Mängel aufdecken und Gewährleistungsansprüche sichern. Die gesetzliche Gewährleistungsfrist beträgt fünf Jahre ab Abnahme, bei arglistig verschwiegenen Mängeln verlängert sie sich.
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
                        Zu wesentlichen Schadenspositionen erhalten Sie nachvollziehbare Kostenspannen. Diese orientieren sich an üblichen Marktpreisen in München und berücksichtigen verschiedene Sanierungsvarianten. Die Spannen sind bewusst realistisch gehalten, um eine verlässliche Kalkulationsgrundlage zu bieten. Pauschale oder geschönte Angaben werden vermieden.
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
                        Lokale Besonderheiten des Münchner Immobilienmarkts
                      </h2>
                      <p className="mb-4">
                        München unterscheidet sich als Immobilienmarkt durch sein hohes Preisniveau und die damit verbundenen Erwartungen an Bauqualität. Die Kaufpreise gehören zu den höchsten in Deutschland. Eine fundierte Prüfung vor dem Kauf ist daher besonders wichtig, um finanzielle Fehlentscheidungen zu vermeiden.
                      </p>
                      <p className="mb-4">
                        Der Untergrund im Münchner Raum ist geprägt von Kies und Sand aus eiszeitlichen Ablagerungen der Isar und ihrer Nebenflüsse. Der Grundwasserspiegel liegt in vielen Stadtteilen relativ hoch, was Abdichtungsmaßnahmen in Kellern und erdberührenden Bauteilen erforderlich macht. Drückendes Wasser kann bei unzureichender Abdichtung zu Durchfeuchtung führen.
                      </p>
                      <p className="mb-4">
                        Die Lage am Alpenrand bringt höhere Niederschlagsmengen als in anderen deutschen Großstädten. Dächer, Fassaden und Außenbauteile sind stärkerer Witterungsbelastung ausgesetzt. Frostperioden im Winter mit anschließendem Tauwetter setzen Bauteilen zu und können Frostschäden verursachen.
                      </p>
                      <p className="mb-4">
                        Der Denkmalschutz spielt in München eine wichtige Rolle. Viele Gebäude in der Altstadt, in den Gründerzeitvierteln und einzelne Villen stehen unter Denkmalschutz. Sanierungen erfordern Genehmigungen und müssen denkmalpflegerischen Anforderungen genügen. Dies kann Mehrkosten verursachen, sichert aber den Erhalt des kulturellen Erbes.
                      </p>
                      <p className="mb-4">
                        Die kontinuierliche Stadtentwicklung schafft neue Wohnquartiere, während historische Stadtteile bewahrt werden. Dieser Kontrast zwischen Tradition und Moderne prägt München. Bei Neubauten in historischer Umgebung sind oft gestalterische Auflagen zu beachten, die sich an der umgebenden Bebauung orientieren.
                      </p>
                      <p>
                        Weitere Informationen zum Münchner Immobilienmarkt und baurechtliche Hinweise finden Sie beim{' '}
                        <a href="https://www.muenchen.de/rathaus/Stadtverwaltung/Referat-fuer-Stadtplanung-und-Bauordnung.html" rel="nofollow" className="text-primary hover:underline font-medium">
                          Referat für Stadtplanung und Bauordnung München
                        </a>{' '}
                        sowie beim{' '}
                        <a href="https://www.mieterverein-muenchen.de" rel="nofollow" className="text-primary hover:underline font-medium">
                          Mieterverein München
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
                    Alles was Sie über unsere Bauschadensbewertung in München wissen müssen
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
                    const isCurrentCity = city.slug === 'muenchen';
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
                  Jetzt Bauzustand Ihrer Wunschimmobilie in München prüfen lassen
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

export default Muenchen;

