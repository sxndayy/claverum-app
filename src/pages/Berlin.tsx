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

const Berlin = () => {
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
      question: "Welche Gebäudetypen in Berlin werden geprüft?",
      answer: "Alle Gebäudetypen werden analysiert: Gründerzeithäuser in Prenzlauer Berg oder Charlottenburg, Nachkriegsbauten in Steglitz, Plattenbauten in Marzahn sowie Neubauten. Jeder Gebäudetyp hat spezifische Risiken, die in der Analyse berücksichtigt werden."
    },
    {
      question: "Wird bei Eigentumswohnungen auch das Gemeinschaftseigentum geprüft?",
      answer: "Soweit es die vorliegenden Unterlagen sowie die bereitgestellten Fotos zulassen, wird der bauliche Zustand von Dach, Fassade, Treppenhaus und zentralen haustechnischen Anlagen nachvollziehbar beschrieben und in die Bewertung einbezogen."
    },
    {
      question: "Wie schnell erhalte ich den Bericht für meine Immobilie in Berlin?",
      answer: "Sie erhalten den Bericht per E-Mail als PDF innerhalb von 2 Werktagen nach vollständiger Übermittlung aller Unterlagen und Fotos."
    },
    {
      question: "Was kostet eine Bauschadensanalyse in Berlin?",
      answer: "Die Preise sind transparent auf der Website einsehbar und gelten deutschlandweit einheitlich. Es gibt keine versteckten Kosten oder Zusatzgebühren für Berlin."
    },
    {
      question: "Ersetzt die digitale Analyse einen Gutachter vor Ort?",
      answer: "Die digitale Analyse bietet eine fundierte Ersteinschätzung auf Basis der verfügbaren Informationen. Bei schwerwiegenden Mängeln oder komplexen Schadensbildern wird eine vertiefende Prüfung empfohlen."
    }
  ];

  return (
    <>
      <SEO 
        title="Gutachter Hauskauf Berlin – In 2 Tagen Klarheit | ab 350€ | bauklar.org"
        description="Unabhängige Bauschadensanalyse für Hauskauf in Berlin. Gründerzeit, Neubau, Eigentumswohnung – digitale Prüfung mit verständlichem Bericht innerhalb von 2 Werktagen. Jetzt starten."
        canonical="/berlin"
        ogImage="/images/hero-altbau.jpg"
        ogType="website"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Berlin', url: '/berlin' }
        ]} 
      />
      <CityServiceSchema cityName="Berlin" />
      <FAQSchema faqs={faqItems} />
      
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
                  Bauschadensanalyse Berlin – verlässlich vor dem Hauskauf
                </h1>
                <p className="text-xl text-text-200 mb-8 leading-relaxed">
                  Unabhängige Bewertung von Altbau, Neubau und Eigentumswohnungen in Berlin. Digitale Analyse mit verständlichem Bericht innerhalb von 2 Werktagen – ohne Vor-Ort-Termin.
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
                    src="/berlin.jpg"
                    alt="Berlin Stadtansicht – Bauschadensanalyse für Hauskauf in Berlin"
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
                        Warum eine Bauschadensanalyse vor dem Immobilienkauf in Berlin
                      </h2>
                      <p className="mb-4">
                        Der Kauf einer Immobilie in Berlin ist eine bedeutende finanzielle Entscheidung. Ob Gründerzeithaus in Friedrichshain, Eigentumswohnung in Charlottenburg oder Plattenbau in Lichtenberg – der äußere Eindruck täuscht häufig über den tatsächlichen Zustand. Verdeckte Mängel führen nach dem Kauf zu unerwarteten Kosten, die schnell fünf- bis sechsstellige Beträge erreichen.
                      </p>
                      <p className="mb-4">
                        Eine Bauschadensanalyse schafft Transparenz. Sie zeigt auf, welche Bauteile intakt sind, wo Sanierungsbedarf besteht und welche Kosten voraussichtlich anfallen. Diese Klarheit ermöglicht eine fundierte Entscheidung darüber, ob die Immobilie zum angebotenen Preis kaufenswert ist oder ob Nachverhandlungen erforderlich sind.
                      </p>
                      <p className="mb-4">
                        Besonders in Berlin mit seinem heterogenen Gebäudebestand ist fachliche Einschätzung wertvoll. Die Teilung der Stadt bis 1990 führte zu unterschiedlichen Bautraditionen und Sanierungsständen in Ost und West. Westberliner Altbauten wurden oft bereits in den 1980er Jahren modernisiert, während Ostberliner Gründerzeitquartiere vielfach erst nach der Wende instandgesetzt wurden. Der Sanierungsumfang variiert erheblich – von kosmetischen Maßnahmen bis zu grundlegenden Erneuerungen.
                      </p>
                      <p>
                        Die digitale Bauschadensanalyse von bauklar.org bietet Ihnen eine unabhängige Einschätzung durch qualifizierte Sachverständige. Auf Basis Ihrer Fotos, Unterlagen und Angaben wird der Bauzustand systematisch bewertet. Der Bericht liegt voraussichtlich innerhalb von 48 Stunden vor und enthält nachvollziehbare Einschätzungen sowie realistische Kostenspannen.
                      </p>
                    </div>

                    {/* Typische Gebäude Berlin Section */}
                    <div id="typische-gebaeude-berlin">
                      <h2 className="text-2xl font-semibold text-text-100 mb-6">
                        Typische Gebäudetypen und Risiken in Berlin
                      </h2>
                      
                      {/* Gründerzeithäuser */}
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-text-100 mb-4 mt-6">
                          Gründerzeithäuser in Prenzlauer Berg, Kreuzberg und Charlottenburg
                        </h3>
                        <p className="mb-4">
                          Gründerzeitbauten aus der Zeit zwischen 1870 und 1918 prägen weite Teile Berlins. Diese Gebäude zeichnen sich durch massive Außenwände aus Ziegelmauerwerk, hohe Geschosshöhen, Holzbalkendecken und repräsentative Stuckfassaden aus. Die Bauqualität dieser Häuser ist grundsätzlich solide, jedoch zeigen sich nach über 100 Jahren charakteristische Alterungserscheinungen.
                        </p>
                        <p className="mb-4">
                          <strong>Feuchtigkeitsprobleme in Kellern</strong> gehören zu den häufigsten Mängeln. Viele Gründerzeithäuser haben keine oder nur unzureichende Horizontalsperren gegen aufsteigende Feuchtigkeit. Durchfeuchtetes Mauerwerk im Kellerbereich führt zu Schimmelbildung, Geruchsbelastung und kann die Tragfähigkeit beeinträchtigen. Eine nachträgliche Abdichtung ist technisch möglich, aber kostenintensiv.
                        </p>
                        <p className="mb-4">
                          <strong>Risse im Mauerwerk</strong> entstehen häufig durch Setzungen. Der sandige Berliner Boden ermöglicht zwar meist gute Gründungen, kann aber bei Grundwasserabsenkung oder benachbarten Baumaßnahmen zu unterschiedlichen Setzungen führen. Nicht jeder Riss ist problematisch, aber die Bewertung erfordert Fachkenntnis. Fortschreitende Risse deuten auf aktive Bewegungen hin und erfordern Untersuchung der Ursache.
                        </p>
                        <p className="mb-4">
                          <strong>Holzbalkendecken</strong> können von Schädlingen befallen sein oder durch jahrzehntelange Belastung Durchbiegungen aufweisen. Auch unsachgemäße Eingriffe wie das Entfernen tragender Wände schwächen die Deckenkonstruktion. Eine Beurteilung der Holzqualität und Tragfähigkeit ist vor dem Kauf wichtig.
                        </p>
                        <p>
                          <strong>Stuckfassaden</strong> zeigen oft Putzschäden, abplatzende Ornamente oder Durchfeuchtung durch defekte Regenrinnen. Die Instandsetzung von Stuckelementen ist handwerklich aufwendig und kostet je nach Umfang mehrere zehntausend Euro. Veraltete Leitungsnetze für Wasser und Elektrik entsprechen häufig nicht mehr heutigen Anforderungen und sollten erneuert werden.
                        </p>
                      </div>

                      {/* Nachkriegsbauten */}
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-text-100 mb-4 mt-6">
                          Nachkriegsbauten der 1950er bis 1970er Jahre
                        </h3>
                        <p className="mb-4">
                          Nachkriegsbauten prägen Bezirke wie Steglitz, Tempelhof und Wedding. Diese Gebäude wurden in einer Zeit des schnellen Wiederaufbaus errichtet und weisen charakteristische bauliche Merkmale auf. Flachdächer waren weit verbreitet, die Dämmstandards entsprachen dem damaligen Kenntnisstand und Stahlbetonkonstruktionen wurden zunehmend eingesetzt.
                        </p>
                        <p className="mb-4">
                          <strong>Flachdächer</strong> neigen zu Undichtigkeiten, insbesondere wenn die Dachabdichtung nicht regelmäßig gewartet wurde. Wasserschäden in Geschossdecken können erhebliche Folgeschäden verursachen. Die Sanierung von Flachdächern ist kostspielig und sollte fachgerecht ausgeführt werden.
                        </p>
                        <p className="mb-4">
                          <strong>Wärmebrücken</strong> an Balkonen, Fensterstürzen und Geschossdecken führen zu Energieverlusten und Kondensatbildung. Die Folge sind Schimmelbildung an Innenwänden und hohe Heizkosten. Eine nachträgliche Dämmung verbessert die Energieeffizienz erheblich, ist aber mit Investitionen verbunden.
                        </p>
                        <p className="mb-4">
                          <strong>Stahlbetonkonstruktionen</strong> können Korrosionsschäden an der Bewehrung aufweisen. Dringt Feuchtigkeit in den Beton ein, beginnt der Stahl zu rosten und dehnt sich aus. Dies führt zu Betonabplatzungen und Rissen. Die Instandsetzung erfordert Freilegen der Bewehrung, Entrosten, Auftragen von Korrosionsschutz und Neuvermörtelung.
                        </p>
                        <p>
                          Die Haustechnik dieser Gebäude entspricht selten heutigen Standards. Heizungsanlagen, Sanitärinstallationen und Elektrik sind oft seit Jahrzehnten nicht grundlegend erneuert worden. Die Modernisierung der Haustechnik verbessert Komfort und Effizienz, bedeutet aber eine wesentliche Investition.
                        </p>
                      </div>

                      {/* Plattenbauten */}
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-text-100 mb-4 mt-6">
                          Plattenbauten in Marzahn, Hellersdorf und Lichtenberg
                        </h3>
                        <p className="mb-4">
                          Plattenbausiedlungen wurden in den östlichen Bezirken Berlins zwischen 1970 und 1990 in industrieller Bauweise errichtet. Diese Gebäude haben aufgrund vorgefertigter Betonelemente eine standardisierte Konstruktion. Viele wurden nach der Wende energetisch saniert, die Qualität und der Umfang dieser Sanierungen variieren jedoch erheblich.
                        </p>
                        <p className="mb-4">
                          <strong>Wärmedämmverbundsysteme</strong> wurden oft nachträglich angebracht. Die Ausführungsqualität ist entscheidend für die Dauerhaftigkeit. Unsachgemäß ausgeführte Dämmung kann zu Feuchtigkeitsschäden, Algenbildung an der Fassade oder Ablösung führen. Eine Prüfung des Zustands der Dämmung ist sinnvoll.
                        </p>
                        <p className="mb-4">
                          <strong>Balkone</strong> zeigen häufig Betonschäden durch Korrosion der Bewehrung. Die auskragende Konstruktion ist besonders witterungsexponiert. Risse, Abplatzungen oder Rostfahnen deuten auf Sanierungsbedarf hin. Die Instandsetzung oder der Austausch von Balkonen ist kostenintensiv und betrifft das Gemeinschaftseigentum.
                        </p>
                        <p className="mb-4">
                          <strong>Zentrale Heizungsanlagen</strong> sind oft veraltet und ineffizient. Die Umstellung auf moderne Heizsysteme oder dezentrale Lösungen verbessert die Energiebilanz, erfordert aber Beschlüsse der Eigentümergemeinschaft und entsprechende Investitionen. Gleichzeitig bieten fachgerecht sanierte Plattenbauten solide Bausubstanz zu vergleichsweise günstigen Preisen. Die klare Konstruktion ermöglicht übersichtliche Grundrisse und gute Raumaufteilung.
                        </p>
                      </div>

                      {/* Eigentumswohnungen */}
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-text-100 mb-4 mt-6">
                          Eigentumswohnungen: Gemeinschaftseigentum richtig bewerten
                        </h3>
                        <p className="mb-4">
                          Beim Kauf einer Eigentumswohnung in Berlin ist der Zustand des Gemeinschaftseigentums ebenso wichtig wie der Zustand der eigenen Wohnung. Fassade, Dach, Treppenhaus, Aufzug und zentrale Haustechnik werden gemeinschaftlich unterhalten. Sanierungsbedarf an diesen Bauteilen führt zu Umlagen, die alle Eigentümer nach Miteigentumsanteil tragen müssen.
                        </p>
                        <p className="mb-4">
                          Die Instandhaltungsrücklage gibt Aufschluss über die finanzielle Vorsorge der Eigentümergemeinschaft. Pro Quadratmeter Wohnfläche sollte jährlich ein angemessener Betrag für die Rücklagenbildung vorgesehen werden. Geringe Rücklagen bei absehbarem Sanierungsbedarf deuten auf bevorstehende Sonderumlagen hin.
                        </p>
                        <p className="mb-4">
                          Geplante Maßnahmen, bereits diskutierte Mängel und Beschlussfassungen aus Eigentümerversammlungen sollten sorgfältig geprüft werden. Häufig werden größere Sanierungen bereits Jahre im Voraus besprochen, bevor der Beschluss gefasst wird.
                        </p>
                        <p className="mb-4">
                          Häufige Schwachstellen im Gemeinschaftseigentum Berliner Wohngebäude sind undichte Flachdächer, sanierungsbedürftige Fassaden, veraltete Aufzugsanlagen und Wasserleitungen mit Korrosionsschäden. Auch Brandschutzmaßnahmen entsprechen bei älteren Gebäuden oft nicht mehr den aktuellen Anforderungen und erfordern Nachrüstung von Rauchmeldern, Feuerschutztüren oder Fluchtwegsicherungen.
                        </p>
                        <p>
                          Eine Bauschadensanalyse berücksichtigt soweit aus Unterlagen und Fotos erkennbar auch das Gemeinschaftseigentum. Hinweise auf absehbare Sanierungen werden im Bericht aufgeführt. Dies ermöglicht eine realistische Einschätzung der Gesamtkosten über die kommenden Jahre.
                        </p>
                      </div>
                    </div>

                    {/* Ablauf Section */}
                    <div id="ablauf">
                      <h2 className="text-2xl font-semibold text-text-100 mb-6">
                        Ablauf der digitalen Bauschadensanalyse
                      </h2>
                      <p className="mb-4">
                        Die Bauschadensanalyse erfolgt vollständig digital und erfordert keine Terminvereinbarung. Sie laden Fotos der Immobilie sowie vorhandene Unterlagen wie Grundrisse oder Energieausweise hoch. Ergänzend geben Sie relevante Informationen zu Baujahr, Bauweise, erkannten Mängeln und geplanten Nutzungen an.
                      </p>
                      <p className="mb-4">
                        Je vollständiger die eingereichten Informationen sind, desto präziser kann die Bewertung erfolgen. Fotos sollten alle wesentlichen Bereiche dokumentieren: Fassade, Dach, Keller, Heizungsanlage, Fenster, Sanitärinstallationen und erkennbare Schadensstellen. Auch unscheinbare Details wie Risse, Feuchtigkeitsflecken oder Schimmelansätze sind wichtig.
                      </p>
                      <p className="mb-4">
                        Ein qualifizierter Sachverständiger analysiert die eingereichten Daten systematisch. Bausubstanz, Haustechnik, Feuchtigkeitserscheinungen, Risse und weitere Schadensmuster werden erfasst und bewertet. Die Einschätzung berücksichtigt typische Alterungserscheinungen des jeweiligen Gebäudetyps, übliche Sanierungszyklen und erkennbare Risikofaktoren.
                      </p>
                      <p className="mb-4">
                        Der Bericht wird voraussichtlich innerhalb von 48 Stunden bereitgestellt. Die Bearbeitungszeit beträgt in der Regel 48 Stunden ab vollständiger Datenübermittlung. Sie erhalten den Bericht per E-Mail als PDF innerhalb von 2 Werktagen und können ihn für Bankgespräche oder Verhandlungen mit Verkäufern nutzen.
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
                        Lokale Besonderheiten des Berliner Immobilienmarkts
                      </h2>
                      <p className="mb-4">
                        Berlin unterscheidet sich als Immobilienmarkt deutlich von anderen deutschen Städten. Die Teilung der Stadt bis 1990 führte zu unterschiedlichen Bautraditionen und Sanierungsverläufen. Westberliner Altbauten in Charlottenburg, Wilmersdorf oder Schöneberg wurden oft bereits in den 1980er Jahren im Rahmen von Modernisierungsprogrammen saniert. Ostberliner Gründerzeitquartiere in Prenzlauer Berg, Friedrichshain oder Kreuzberg erfuhren vielfach erst nach der Wende umfassende Instandsetzungen.
                      </p>
                      <p className="mb-4">
                        Der Sanierungsstand variiert erheblich. Einzelne Gebäude wurden aufwendig restauriert, andere nur oberflächlich aufgewertet. Äußerlich ansprechende Fassaden können verdeckte Mängel wie marode Leitungsnetze, feuchte Keller oder ungedämmte Außenwände aufweisen. Eine differenzierte Prüfung ist daher besonders in Berlin wichtig.
                      </p>
                      <p className="mb-4">
                        Die Bodenbeschaffenheit spielt für die Bausubstanz eine Rolle. Berlin steht überwiegend auf sandigem Untergrund, der gute Gründungen ermöglicht. Gleichzeitig kann es bei Grundwasserabsenkung oder benachbarten Tiefbaumaßnahmen zu Setzungen kommen. Einzelne Bereiche haben lehmige oder tonige Böden, die Setzungsrisse begünstigen. Diese regionalen Gegebenheiten fließen in die Bewertung ein.
                      </p>
                      <p>
                        Neubaugebiete entstehen vor allem am Stadtrand in Pankow, Lichtenberg und Treptow-Köpenick. Auch Neubauten sind nicht frei von Mängeln. Abdichtungsprobleme, fehlerhafte Wärmedämmung, mangelhafte Schallschutzvorkehrungen oder unzureichend installierte Haustechnik kommen vor. Eine Prüfung bereits vor Übergabe kann Gewährleistungsansprüche sichern und spätere Auseinandersetzungen vermeiden.
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
                    Alles was Sie über unsere Bauschadensbewertung in Berlin wissen müssen
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
                    const isCurrentCity = city.slug === 'berlin';
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
                  Jetzt Bauzustand Ihrer Wunschimmobilie in Berlin prüfen lassen
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

export default Berlin;

