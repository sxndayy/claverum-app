"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { FAQSchema } from '@/components/seo/FAQSchema';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/layout/CookieBanner';
import { SITE_URL } from '@/lib/config';

const BlogHauskaufBeratungClient = () => {
  const router = useRouter();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToHomeSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    // If we're not on the homepage, navigate to homepage first
    if (window.location.pathname !== '/') {
      router.push('/');
      // Wait for page to load, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    } else {
      // On homepage, scroll directly
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const faqItems = [
    {
      question: "Wie lange dauert eine Hauskauf Beratung?",
      answer: "Klassischer Ortstermin: 1–2 Stunden Begehung, danach 1–2 Wochen Wartezeit bis zum schriftlichen Gutachten. Digitale Bauschadensanalyse: 2 Werktage ab Einreichung Ihrer Unterlagen und Fotos."
    },
    {
      question: "Was kostet eine professionelle Hauskauf Beratung?",
      answer: "Mündliche Beratung vor Ort: ca. 450–650 €. Gerichtsverwertbare Vollgutachten: 1.500–3.000 €. Digitale Bauschadensanalysen: ab 350 € für Bestandsimmobilien."
    },
    {
      question: "Brauche ich eine Hauskauf Beratung, wenn der Verkäufer schon ein Gutachten hat?",
      answer: "Unbedingt ja. Verkäufergutachten dienen den Interessen des Verkäufers, nicht Ihren. Sie sind häufig geschönt oder lückenhaft. Beauftragen Sie stets einen eigenen, unabhängigen Sachverständigen."
    },
    {
      question: "Muss der Verkäufer dem Gutachter Zugang gewähren?",
      answer: "Klassische Begutachtung: Ja, Verkäufer kann den Zutritt verweigern (kommt häufig vor). Digitale Analyse: Nein. Sie fotografieren diskret während Ihrer regulären Besichtigungen – der Verkäufer erhält davon keine Kenntnis."
    },
    {
      question: "Kann ich mit dem Gutachten den Kaufpreis senken?",
      answer: "Ja. Fundierte Gutachten ermöglichen Käufern beachtenswerte Preisnachlässe. Dokumentierte Mängel schaffen eine objektive Verhandlungsbasis. Verkäufer können schriftlich fixierte Schäden nicht mehr bestreiten."
    },
    {
      question: "Was ist der Unterschied zwischen Bankgutachter und Hauskauf Beratung?",
      answer: "Der Bankgutachter ermittelt ausschließlich den Beleihungswert für die Kreditabsicherung – meist nur durch oberflächliche Außenbetrachtung. Verborgene Mängel interessieren ihn nicht. Eine Kaufberatung hingegen schützt Ihre Interessen und deckt alle Risikofaktoren auf. Üblicherweise hat nur die Bank als Auftraggeber Einsicht in das Beleihungswertgutachten."
    },
    {
      question: "Lohnt sich eine Hauskauf Beratung auch bei Neubauten?",
      answer: "Ja – auch Neubauten können Bauschäden aufweisen. Selbst in neuen Gebäuden treten immer wieder Fehler auf, etwa undichte Wasserleitungen, mangelhafte Abdichtungen oder Ausführungsfehler verschiedener Gewerke. Kommt es zusätzlich zu Problemen bei der Gewährleistung – etwa durch die Insolvenz des Bauträgers – können diese Schäden schnell teuer werden. Eine begleitende Prüfung durch einen Sachverständigen ist daher auch bei Neubauten absolut sinnvoll."
    },
    {
      question: "Was passiert, wenn das Gutachten schwere Mängel aufdeckt?",
      answer: "Drei Handlungsoptionen: 1. Preisnachverhandlung mit konkreten Kostenangaben. 2. Rücktritt vom Kaufvertrag. 3. Bewusster Kauf mit voller Kenntnis aller Kostenrisiken. Jede Option ist besser als ein uninformierter Kauf."
    },
    {
      question: "Welche Unterlagen braucht der Gutachter?",
      answer: "Exposé mit Grundrissen, Energieausweis (sofern vorhanden), Baupläne (sofern vorhanden), Fotos sämtlicher Räume, Keller, Dachboden, Außenansichten, Heizungsanlage, Elektroinstallationen, optional Kaufvertragsentwurf. Bei digitalen Analysen erfolgt der Upload komfortabel online."
    },
    {
      question: "Kann ich die Kosten für die Hauskauf Beratung steuerlich absetzen?",
      answer: "Bei Vermietung: Ja, als Werbungskosten absetzbar. Bei Eigennutzung: Nicht steuerlich abzugsfähig. Die durch Preisverhandlung erzielbaren Einsparungen übersteigen die Gutachterkosten jedoch deutlich."
    }
  ];

  // BlogPosting Schema
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Hauskauf Beratung: Wann sie sinnvoll ist, Kosten und Leistungen",
    "description": "Hauskauf Beratung schützt vor versteckten Mängeln. Erfahren Sie, wann ein Gutachter sinnvoll ist, was er kostet und wie Sie bis zu 40.000 € beim Immobilienkauf sparen.",
    "author": {
      "@type": "Organization",
      "name": "Bauklar.org"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Bauklar.org",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo-final.png`
      }
    },
    "datePublished": "2025-01-08",
    "dateModified": "2025-01-08",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/hauskauf-beratung/`
    },
    "image": {
      "@type": "ImageObject",
      "url": `${SITE_URL}/Berlin 2.jpg`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <FAQSchema faqs={faqItems} />
      
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Hero Section */}
          <section className="relative py-12 md:py-16 border-b border-border">
            {/* Background Gradient - same as main page hero */}
            <div className="absolute inset-0 hero-gradient opacity-30"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-text-100 mb-6 leading-tight">
                  Hauskauf Beratung: Wann sie sinnvoll ist, Kosten und Leistungen
                </h1>
              </div>
            </div>
          </section>

          {/* Content Section */}
          <section className="py-8 md:py-12 bg-bg-200">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                
                {/* Berlin 3 Image */}
                <div className="mb-12">
                  <Image
                    src="/Berlin 3.jpg"
                    alt="Hauskauf Beratung – Professionelle Immobilienbewertung"
                    width={1200}
                    height={675}
                    className="w-full h-auto rounded-lg shadow-soft object-cover"
                  />
                </div>
                
                {/* Summary Box */}
                <div className="bg-bg-200 border-l-4 border-primary rounded-lg p-6 md:p-8 mb-12">
                  <h2 className="text-xl md:text-2xl font-semibold text-text-100 mb-4">
                    Das Wichtigste in Kürze
                  </h2>
                  <ul className="space-y-3">
                    {[
                      "Eine professionelle Hauskauf Beratung findet versteckte Mängel und gibt Auskunft über anstehende Sanierungsmaßnahmen",
                      "Digitale Bauschadensanalysen starten ab 350 €, traditionelle Gutachten kosten 500-1.500 €",
                      "Besonders bei Bestandsimmobilien über 20 Jahren ist eine Beratung ratsam",
                      "Die Neutralität ist gewährleistet, wenn Sie selbst einen unabhängigen Sachverständigen beauftragen",
                      "Mit einem Gutachten lässt sich der Kaufpreis in vielen Fällen spürbar reduzieren."
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-text-200 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Table of Contents */}
                <div className="bg-white border border-primary-200 rounded-lg p-6 md:p-8 mb-12">
                  <h2 className="text-xl md:text-2xl font-semibold text-text-100 mb-4">
                    Inhalt der Seite
                  </h2>
                  <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      { id: 'immobilienmarkt', text: 'Immobilienmarkt und Kaufentscheidung' },
                      { id: 'hauskauf-berater', text: 'Definition: Was ist ein Hauskauf-Berater?' },
                      { id: 'pruefumfang', text: 'Leistungen und Prüfumfang' },
                      { id: 'sinnvoll', text: 'Wann ist eine Beratung sinnvoll?' },
                      { id: 'traditionell-digital', text: 'Traditionelle vs. digitale Bauschadensanalyse' },
                      { id: 'kosten', text: 'Kosten und Preisgestaltung' },
                      { id: 'tipps', text: 'Die wichtigsten Tipps zur Hauskauf Beratung' },
                      { id: 'berlin', text: 'Hauskauf Beratung in Berlin' },
                      { id: 'staedte', text: 'Weitere Städte und Regionen' },
                      { id: 'faq', text: 'FAQ – Häufig gestellte Fragen' }
                    ].map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => scrollToSection(e, item.id)}
                        className="text-primary hover:text-primary/80 hover:underline text-sm md:text-base"
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Content Sections */}
                <div className="prose prose-lg max-w-none">
                  
                  {/* Immobilienmarkt Section */}
                  <section id="immobilienmarkt" className="mb-12 scroll-mt-24 bg-background rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Immobilienmarkt verlockt zu schnellen Entscheidungen
                    </h2>
                    <p className="text-text-200 leading-relaxed mb-4">
                      In vielen deutschen Großstädten und Ballungsräumen herrscht ein Ungleichgewicht am Immobilienmarkt: Weit mehr Menschen suchen nach Wohneigentum, als Objekte verfügbar sind. Diese Marktsituation treibt die Preise nach oben und schafft Konkurrenzdruck unter Kaufinteressenten. Immobilieneigentum wird zur umkämpften Ressource.
                    </p>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Diese Dynamik ist Verkäufern und Maklern bewusst. Oft haben Verkäufer die Wahl zwischen mehreren Interessenten und können denjenigen bevorzugen, der am schnellsten entscheidet. Viele Käufer spüren diesen Druck und neigen dazu, vorschnell zuzusagen – aus Angst, die vermeintliche Traumimmobilie an einen Mitbewerber zu verlieren.
                    </p>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Gerade beim Erwerb von Bestandsimmobilien ist jedoch Eile ein schlechter Ratgeber. Mit gesunder Skepsis und einer unabhängigen Hauskauf Beratung können Sie eine finanzielle Falle vermeiden. Versteckte Mängel oder anstehende Sanierungsarbeiten verursachen nicht selten Kosten im fünf- bis sechsstelligen Bereich.
                    </p>
                    <p className="text-text-200 leading-relaxed">
                      Ein qualifizierter Sachverständiger verschafft Ihnen in dieser Situation Klarheit. Er identifiziert Schwachstellen, beziffert den Sanierungsbedarf und bewertet, ob die Immobilie den geforderten Preis wert ist. Diese Expertise ermöglicht fundierte Preisverhandlungen und schützt Sie vor unerwarteten finanziellen Belastungen durch verborgene Schäden.
                    </p>
                  </section>

                  {/* Was ist ein Hauskauf-Berater Section */}
                  <section id="hauskauf-berater" className="mb-12 scroll-mt-24 bg-bg-200 rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Was ist ein Hauskauf-Berater?
                    </h2>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Bausachverständige oder Immobiliengutachter sind Experten für die Beurteilung von Bausubstanz und Immobilienwert. Da die Berufsbezeichnung „Sachverständiger" rechtlich nicht geschützt ist, kann sie theoretisch jeder führen. Vertrauen sollten Sie jedoch nur zertifizierten Bausachverständigen, die ihre Kompetenz durch anerkannte Qualifikationen nachweisen können.
                    </p>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Qualifikationen und Zertifizierung
                    </h3>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Um als geprüfter Sachverständiger tätig zu werden, müssen Fachleute folgende Anforderungen erfüllen:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-text-200 mb-4 ml-4">
                      <li>Abgeschlossenes Studium in Architektur, Bauingenieurwesen oder vergleichbaren Fachrichtungen</li>
                      <li>Meisterbrief in einem relevanten Handwerksberuf</li>
                      <li>Mehrjährige praktische Erfahrung mit nachweisbarer Expertise</li>
                      <li>Spezialisierte Fortbildungen und Zertifizierungslehrgänge</li>
                    </ul>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Wer diese Ausbildung durchläuft, darf die Bezeichnung „geprüfter Sachverständiger" führen. Vorsicht ist bei sogenannten „freien Sachverständigen" geboten: Sie verfügen oft über keine formale Zertifizierung und haben sich selbst zum Gutachter erklärt.
                    </p>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Unabhängigkeit und Neutralität
                    </h3>
                    <p className="text-text-200 leading-relaxed mb-6">
                      Eine unabhängige und fachkundige Einschätzung erfordert nicht nur umfassendes Know-how, sondern auch absolute Neutralität. Seriöse Gutachter halten sich an klare berufliche Grundsätze, die ihre Unparteilichkeit sicherstellen.
                    </p>
                    <p className="text-text-200 leading-relaxed mb-8">
                      Für die Begutachtung beim Immobilienkauf sollten Sie darauf achten, dass die beauftragte Person als diplomierter Bauschadensbewerter qualifiziert ist und über besondere Expertise im Bereich von Wohngebäuden und deren Bewertung verfügt.
                    </p>

                    {/* Expert Bio Section */}
                    <div className="bg-bg-200 border-l-4 border-primary rounded-lg p-6 md:p-8 my-8">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <Image
                            src="/Johannes-foto.jpeg"
                            alt="Bausachverständiger Johannes – zertifizierter Gutachter für Hauskauf Beratung"
                            width={192}
                            height={192}
                            className="w-48 h-48 rounded-lg object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-text-100 mb-2">
                            Dr. Johannes Stankiewicz
                          </h4>
                          <p className="text-text-200 leading-relaxed mb-4">
                            Dr. Johannes Stankiewicz verfügt über mehr als 15 Jahre Erfahrung in der Immobilienbranche und hat in dieser Zeit über 500 Bauschäden analysiert. Als diplomierter Sachverständiger für Bauschäden ist er auf die Bewertung von Bestandsimmobilien spezialisiert. Sein Fokus liegt auf der zuverlässigen Erkennung versteckter Mängel sowie der realistischen Einschätzung notwendiger Sanierungsmaßnahmen.
                          </p>
                          <Link
                            href="/#ueber-uns"
                            onClick={(e) => scrollToHomeSection(e, 'ueber-uns')}
                            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
                          >
                            Mehr erfahren
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Was prüft ein Hauskauf-Berater Section */}
                  <section id="pruefumfang" className="mb-12 scroll-mt-24 bg-background rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Was prüft ein Hauskauf-Berater?
                    </h2>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Die zentrale Aufgabe eines Bauschadensbewerters besteht darin, eine präzise Zustandsanalyse der Immobilie vorzunehmen. Dazu gehören die Beurteilung von Schadensursachen, die Ableitung geeigneter Maßnahmen zur Instandhaltung oder Modernisierung sowie realistische Kostenschätzungen. Auf dieser Basis entsteht eine klare und fachlich fundierte Einschätzung des baulichen Gesamtzustands.
                    </p>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Prüfung auf Mängel und Sanierungsbedarf
                    </h3>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Auch Neubauten sind nicht frei von Risiken. Baufehler wie unsachgemäß ausgeführte Abdichtungen können zu Wasserschäden und Schimmelbildung führen. Eine professionelle Begutachtung durch qualifizierte Sachverständige deckt solche Mängel auf und ermöglicht eine objektive Kaufentscheidung.
                    </p>
                    <p className="text-text-200 leading-relaxed mb-6">
                      Bei Bestandsimmobilien ist eine fachkundige Einschätzung besonders wichtig. Hier können verborgene Mängel erhebliche Sanierungskosten verursachen. Ein erfahrener Gutachter erkennt diese Risikofaktoren und beziffert den zu erwartenden Investitionsbedarf.
                    </p>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Typische Mängel bei Altbauten
                    </h3>
                    
                    <ul className="space-y-4 mb-6 list-none">
                      <li className="border-l-4 border-primary pl-4">
                        <p className="text-text-200 leading-relaxed">
                          <strong className="text-text-100">Substanzschäden:</strong> Zu den gravierendsten Bauschäden zählen Risse im Mauerwerk, insbesondere wenn sie die Statik beeinträchtigen, sowie Feuchtigkeitsschäden durch defekte Horizontalsperren und echter Hausschwamm. Auch Schädlinge wie Holzwürmer oder Hausbockkäfer befallen häufig Dachstühle, Holztreppen und Deckenbalken. Eine umfassende Dachsanierung inklusive neuem Dachstuhl, Eindeckung und Dämmung schlägt in der Regel erst ab etwa 50.000 Euro zu Buche.
                        </p>
                      </li>
                      
                      <li className="border-l-4 border-primary pl-4">
                        <p className="text-text-200 leading-relaxed">
                          <strong className="text-text-100">Schimmel:</strong> Schimmelbefall ist nicht immer sofort sichtbar. Oft weisen nur muffiger Geruch oder vereinzelte Verfärbungen auf ein größeres Problem hin. Die Ursachen können vielfältig sein - von Restbaufeuchte, Wasserschäden und Trocknungsfehlern über Wärmebrücken und unzureichende Dämmung bis hin zu fehlerhafter Wasserdampfdiffusion oder ungünstigem Wohnverhalten. In manchen Fällen liegt auch eine Kombination mehrerer Faktoren vor oder es versteckt sich Schimmel im Estrich, der nicht direkt wahrnehmbar ist. Je nach Ursache und Ausmaß können die notwendigen Maßnahmen stark variieren. <Link href="/blog/schimmel-bauschaden" className="text-primary hover:underline font-medium">Mehr über Schimmel als Bauschaden erfahren</Link>.
                        </p>
                      </li>
                      
                      <li className="border-l-4 border-primary pl-4">
                        <p className="text-text-200 leading-relaxed">
                          <strong className="text-text-100">Alte Heizungsanlagen:</strong> Das Gebäudeenergiegesetz (GEG) regelt sowohl die Austauschpflicht für alte Heizkessel als auch die Anforderungen an neue Heizungen. Standard- bzw. Konstanttemperaturkessel müssen in der Regel nach 30 Jahren außer Betrieb genommen werden, während Brennwert- und Niedertemperaturkessel sowie bestimmte Bestandsfälle ausgenommen sind. Beim Einbau neuer Heizungen gilt zudem schrittweise die Vorgabe, dass diese zu 65 % erneuerbare Energien nutzen müssen – abhängig von Wärmeplanung, Übergangsfristen und zahlreichen technischen Optionen. Da ein Heizungstausch damit komplex sein kann, bietet ein qualifizierter Gutachter wertvolle Orientierung, indem er die Gebäudesituation bewertet, rechtliche Vorgaben einordnet und passende technische Lösungswege aufzeigt.
                        </p>
                      </li>
                      
                      <li className="border-l-4 border-primary pl-4">
                        <p className="text-text-200 leading-relaxed">
                          <strong className="text-text-100">Asbest:</strong> Asbest wurde in Deutschland erst 1993 vollständig verboten und zuvor in zahlreichen Bauprodukten verarbeitet. Es kann unter anderem in Fliesenklebern, Bodenbelägen wie alten Vinyl-Asbest-Platten, Spachtelmassen, Dachpappen, Faserzementplatten, Rohrummantelungen oder Putzen auftreten. In fest gebundenem Zustand gilt Asbest meist als unkritisch. Gesundheitsgefährdend wird es vor allem dann, wenn Fasern durch Renovierungen, Beschädigungen oder unsachgemäße Eingriffe freigesetzt werden. Ein Gutachter kann potenzielle Asbestfundstellen erkennen, das Risiko einschätzen und geeignete Beratungsempfehlungen für den sicheren weiteren Umgang geben.
                        </p>
                      </li>
                      
                      <li className="border-l-4 border-primary pl-4">
                        <p className="text-text-200 leading-relaxed">
                          <strong className="text-text-100">Wasserleitungen:</strong> Sichtbare Kalkablagerungen an Armaturen deuten häufig auf stark verkalkte oder gealterte Rohrleitungen hin. Kritisch wird es, wenn zusätzlich Korrosion vorliegt - dann steigt das Risiko für Rohrbrüche deutlich. Alte Bleileitungen müssen grundsätzlich ersetzt werden. Kommt es zu einem Schaden, können umfangreiche Folgeschäden entstehen, etwa durchfeuchtete Bauteile, die Trocknungen erfordern, oder beschädigte Bodenbeläge, die vollständig entfernt werden müssen. In Gebäuden mit Leitungsnetzen von rund 40 Jahren oder älter ist eine umfassende Strangsanierung in vielen Fällen empfehlenswert, um technische Defekte und teure Folgeschäden zu vermeiden.
                        </p>
                      </li>
                      
                      <li className="border-l-4 border-primary pl-4">
                        <p className="text-text-200 leading-relaxed">
                          <strong className="text-text-100">Veraltete Elektroinstallationen:</strong> Elektroanlagen haben in der Regel eine Lebensdauer von rund 30 bis 40 Jahren. Bei einer Überprüfung sollte insbesondere geprüft werden, ob genügend Stromkreise vorhanden sind und ob zeitgemäße Sicherheitsstandards – wie etwa FI-Schutzschalter – eingehalten werden. Eine umfassende Erneuerung der Elektroinstallation kann je nach Gebäudegröße und Zustand mit einem Aufwand im Bereich mehrerer Tausend Euro verbunden sein.
                        </p>
                      </li>
                      
                      <li className="border-l-4 border-primary pl-4">
                        <p className="text-text-200 leading-relaxed">
                          <strong className="text-text-100">Chemikalien und Holzschutzmittel:</strong> Früher eingesetzte Holzschutzmittel gelten heute in vielen Fällen als gesundheitsschädlich. Werden belastete Bauteile festgestellt, kann ein Rückbau sowie eine fachgerechte Sanierung kostenintensiv sein. Ein erfahrener Bauschadensbewerter kann wertvolle Hinweise zur Bewertung des Schadensausmaßes und zu möglichen Sanierungswegen geben.
                        </p>
                      </li>
                      
                      <li className="border-l-4 border-primary pl-4">
                        <p className="text-text-200 leading-relaxed">
                          <strong className="text-text-100">Schwarzbauten:</strong> Nicht genehmigte An- oder Umbauten stellen ein erhebliches Risiko dar. Werden solche Schwarzbauten vom Bauamt entdeckt, muss der Eigentümer diese nachträglich genehmigen lassen oder auf eigene Kosten an die geltenden Bauvorschriften anpassen. Eine nachträgliche Genehmigung kann dabei sehr kostspielig werden, insbesondere wenn umfangreiche Ertüchtigungen – etwa im Brandschutzbereich – notwendig sind. In bestimmten Fällen kann das Bauamt sogar eine Nutzungsuntersagung für die betroffenen Bereiche aussprechen, bis der rechtmäßige Zustand wiederhergestellt ist. Qualifizierte Gutachter erkennen solche Problempunkte frühzeitig und beraten zu geeigneten Lösungsansätzen.
                        </p>
                      </li>
                    </ul>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Prüfung von Umbaumaßnahmen und Exposé-Angaben
                    </h3>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Zusätzlich zur Schadensbewertung kann ein Bauschadensbewerter auch eine erste Einschätzung zur Machbarkeit geplanter Umbauten geben. Er kann Hinweise darauf liefern, welche Bereiche grundsätzlich veränderbar erscheinen und wo potenzielle technische oder rechtliche Hürden bestehen könnten. Eine verbindliche statische Beurteilung oder die rechtliche Prüfung, ob beispielsweise ein Anbau oder eine Garage tatsächlich genehmigungsfähig ist, gehört jedoch nicht zu seinem Aufgabenbereich. Dennoch kann er frühzeitig wertvolle Orientierung geben und aufzeigen, welche Fachplaner oder Behörden im nächsten Schritt eingebunden werden sollten.
                    </p>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Verkäufer kann Gutachter ablehnen
                    </h3>
                    <p className="text-text-200 leading-relaxed">
                      Möchten Sie einen Ortstermin mit Ihrem Gutachter vereinbaren, müssen Sie dies vorab dem Verkäufer oder Makler mitteilen. Rechtlich kann der Verkäufer die Begehung mit einem Sachverständigen verweigern. Lehnt er ab, sollten Sie skeptisch werden: Eine Verweigerung deutet häufig darauf hin, dass verborgene Mängel verschleiert werden sollen. In solchen Fällen ist vom Kauf abzuraten.
                    </p>
                  </section>

                  {/* Wann ist eine Hauskauf Beratung sinnvoll Section */}
                  <section id="sinnvoll" className="mb-12 scroll-mt-24 bg-bg-200 rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Wann ist eine Hauskauf Beratung sinnvoll?
                    </h2>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Besonders bei Bestandsobjekten ab einem Alter von 20 Jahren lohnt sich eine unabhängige Bewertung. In diesem Zeitraum zeigen sich erste Verschleißerscheinungen, die kostspielige Instandsetzungen erfordern können. Makler und Verkäufer weisen Sie zwar möglicherweise auf offensichtliche Sanierungsbedarfe hin – doch ihr Interesse gilt dem Verkaufsabschluss. Schönfärberei und das Herunterspielen von Problemen sind keine Seltenheit.
                    </p>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Kaufen „wie gesehen" – ohne Gewährleistung
                    </h3>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Der Kauf einer Immobilie ist eine der größten finanziellen Entscheidungen im Leben. Bei privaten Verkäufen gilt der Grundsatz: <strong>Sie kaufen wie gesehen</strong> – eine Reklamation später entdeckter Schäden ist ausgeschlossen. Anders als bei Konsumgütern gibt es keine Gewährleistung.
                    </p>
                    <p className="text-text-200 leading-relaxed mb-6">
                      Nur bei bewusst verschwiegenen Mängeln können Sie vom Kauf zurücktreten – allerdings müssen Sie die Arglist des Verkäufers beweisen, was in der Praxis schwierig ist. Um böse finanzielle Überraschungen zu vermeiden, sollten Sie vor Vertragsunterzeichnung genau wissen, welche Kosten auf Sie zukommen.
                    </p>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Preisverhandlungen mit Gutachten
                    </h3>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Ein qualifiziertes Gutachten verschafft Ihnen Sicherheit und eine starke Position in den Verhandlungen. Der Sachverständige analysiert den baulichen Zustand der Immobilie, identifiziert versteckte Mängel und beziffert kommende Instandhaltungs- und Sanierungskosten. Auf Basis dieser belastbaren Fakten können Sie realistisch einschätzen, welche finanziellen Aufwendungen in den nächsten Jahren auf Sie zukommen – und genau mit diesen Informationen fundiert in Preis- oder Vertragsverhandlungen treten.
                    </p>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Vom Verkäufer vorgelegtes Gutachten prüfen
                    </h3>
                    <p className="text-text-200 leading-relaxed">
                      Legt der Verkäufer ein Gutachten vor, prüfen Sie dessen Qualität: Detailtiefe, nachvollziehbare Begründungen und transparente Methodik sind Qualitätsmerkmale. Dennoch empfiehlt sich die Beauftragung eines eigenen Gutachters, um Interessenkonflikte auszuschließen. Als Kompromiss kann eine gemeinsame Beauftragung mit geteilten Kosten dienen.
                    </p>
                  </section>

                  {/* Traditionelle vs. digitale Section */}
                  <section id="traditionell-digital" className="mb-12 scroll-mt-24 bg-background rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Traditionelle Begutachtung vs. digitale Bauschadensanalyse
                    </h2>
                    <p className="text-text-200 leading-relaxed mb-6">
                      Bei der Wahl eines Gutachters stehen Käufern heute zwei grundsätzliche Wege offen:
                    </p>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Traditionelle Begutachtung vor Ort
                    </h3>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Bei diesem klassischen Ansatz koordinieren Sie einen Ortstermin, bei dem der Sachverständige die Immobilie persönlich in Augenschein nimmt. Die Begehung dauert üblicherweise ein bis zwei Stunden. Vor Ort prüft er Bausubstanz, misst Feuchtigkeitswerte und dokumentiert Auffälligkeiten fotografisch. Im Anschluss erhalten Sie entweder eine mündliche Ersteinschätzung oder – gegen Mehrkosten – ein ausführliches schriftliches Gutachten.
                    </p>
                    
                    <div className="bg-[#f8f9fa] rounded-lg p-4 mb-4">
                      <p className="font-semibold text-text-100 mb-2">Vorteile:</p>
                      <ul className="list-disc list-inside space-y-1 text-text-200 ml-4">
                        <li>Persönlicher Kontakt und direkte Rückfragen möglich</li>
                        <li>Sofortige mündliche Einschätzung vor Ort</li>
                        <li>Gutachter kann schwer zugängliche Bereiche prüfen</li>
                      </ul>
                    </div>
                    
                    <div className="bg-bg-200 border-l-4 border-accent-200 rounded-lg p-4 mb-6">
                      <p className="font-semibold text-text-100 mb-2">Nachteile:</p>
                      <ul className="list-disc list-inside space-y-1 text-text-200 ml-4">
                        <li>Verkäufer kann den Ortstermin ablehnen (kommt häufig vor)</li>
                        <li>Die Terminabstimmung erfordert oft mehrere Wochen Vorlauf</li>
                        <li>Schriftliche Gutachten kosten ca. 750 – 1'500 €</li>
                        <li>Während der Ortsbesichtigung findet ausschließlich eine Sichtprüfung statt; Bauteile werden nicht geöffnet</li>
                        <li>Die Analyse muss in der Regel unter Zeitdruck während des Besichtigungstermins erfolgen</li>
                      </ul>
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Digitale Bauschadensanalyse
                    </h3>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Als zeitgemäße Variante etabliert sich die <Link href="/#so-funktioniert" onClick={(e) => scrollToHomeSection(e, 'so-funktioniert')} className="text-primary hover:underline">digitale Bauschadensanalyse</Link>. Sie fotografieren die Immobilie während Ihrer regulären Besichtigungstermine anhand einer strukturierten Checkliste und reichen die Bilder gemeinsam mit vorhandenen Dokumenten (Exposé, Energieausweis, Grundrisse) ein. Zertifizierte Bausachverständige werten das Material aus und liefern innerhalb von zwei Werktagen ein vollständiges schriftliches Gutachten.
                    </p>
                    
                    <div className="bg-[#f8f9fa] rounded-lg p-4 mb-4">
                      <p className="font-semibold text-text-100 mb-2">Vorteile:</p>
                      <ul className="list-disc list-inside space-y-1 text-text-200 ml-4">
                        <li>Keine Verkäuferzustimmung nötig – volle Diskretion gewährleistet</li>
                        <li>Zügige Bearbeitung: Ergebnis binnen zwei Werktagen</li>
                        <li>Attraktive Preisgestaltung: ab 350 € für Altbauten</li>
                        <li>Schriftliches Gutachten als Verhandlungsgrundlage</li>
                        <li>Flexible Dokumentation über mehrere Besichtigungen hinweg</li>
                      </ul>
                    </div>
                    
                    <div className="bg-bg-200 border-l-4 border-accent-200 rounded-lg p-4 mb-6">
                      <p className="font-semibold text-text-100 mb-2">Nachteile:</p>
                      <ul className="list-disc list-inside space-y-1 text-text-200 ml-4">
                        <li>Kein persönlicher Kontakt vor Ort</li>
                        <li>Qualität der Analyse hängt von der Qualität Ihrer Fotos ab</li>
                      </ul>
                    </div>
                    
                    <p className="text-text-200 leading-relaxed">
                      Für viele Kaufinteressenten stellt die digitale Variante die pragmatischere Wahl dar. Sie kombiniert Geschwindigkeit, Kosteneffizienz und funktioniert selbst dann, wenn Verkäufer einer physischen Begutachtung skeptisch gegenüberstehen.
                    </p>
                  </section>

                  {/* Kosten Section */}
                  <section id="kosten" className="mb-12 scroll-mt-24 bg-background rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Wertgutachten oder Kurzgutachten: Was eine Hauskauf Beratung kostet
                    </h2>
                    <p className="text-text-200 leading-relaxed mb-6">
                      Die Kosten einer Immobilienbegutachtung variieren je nach Umfang und Methode erheblich.
                    </p>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Vollständiges Baugutachten
                    </h3>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Umfassende, gerichtsverwertbare Baugutachten sind deutlich kostenintensiver als einfache Kurzexpertisen. In vielen Fällen können die Kosten schnell über 1.500 € liegen, abhängig vom Umfang der Untersuchung und der Komplexität des Objekts.
                    </p>
                    <p className="text-text-200 leading-relaxed mb-6">
                      Auch der zeitliche Aufwand ist erheblich: Für ein vollständiges Baugutachten müssen Sie häufig mit mehreren Wochen bis hin zu mehreren Monaten Bearbeitungszeit rechnen – für zeitkritische Kaufentscheidungen daher meist ungeeignet.
                    </p>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Mündliche Bauzustandsberatung vor Ort
                    </h3>
                    <p className="text-text-200 leading-relaxed mb-6">
                      Die kompakte Alternative: Sie nehmen einen Sachverständigen zur Besichtigung mit. Vor Ort beurteilt er den Bauzustand, weist auf erkennbare Mängel hin und schätzt ab, welche Instandhaltungs- oder Sanierungskosten zukünftig anfallen können. Der Pauschalpreis liegt üblicherweise ab etwa 450 bis 600 Euro (inkl. MwSt.). Ein schriftlicher Bericht wird dabei in der Regel nicht erstellt.
                    </p>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Digitale Bauschadensanalyse
                    </h3>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Die digitale Variante bietet das optimale Preis-Leistungs-Verhältnis. Ab 350 Euro erhalten Sie binnen zwei Werktagen ein schriftliches Gutachten, das Mängel dokumentiert, Sanierungskosten beziffert und als Verhandlungsgrundlage dient. <Link href="/#preise" onClick={(e) => scrollToHomeSection(e, 'preise')} className="text-primary hover:underline">Zur Preisübersicht</Link>.
                    </p>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Wer trägt die Kosten?
                    </h3>
                    <p className="text-text-200 leading-relaxed">
                      Das Bestellerprinzip gilt: Wer den Gutachter beauftragt, zahlt ihn. Bei gutem Verhältnis zum Verkäufer können Sie eine Kostenaufteilung vorschlagen – was allerdings voraussetzt, dass dieser nichts zu verbergen hat.
                    </p>
                  </section>

                  {/* Tipps Section */}
                  <section id="tipps" className="mb-12 scroll-mt-24 bg-bg-200 rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Die wichtigsten Tipps zur Hauskauf Beratung
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-text-100 mb-2">Nicht nur aufs Bankgutachten verlassen</h4>
                        <p className="text-text-200 leading-relaxed">
                          Ein Bankgutachten beantwortet primär die Frage der Kreditsicherheit, nicht die der Preisangemessenheit. Es zeigt, wie viel die Bank finanziert – nicht, ob der Kaufpreis dem Marktwert entspricht.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-text-100 mb-2">Regionale Kenntnisse des Immobilienmarktes</h4>
                        <p className="text-text-200 leading-relaxed">
                          Achten Sie auf regionale Baukompetenz: Ein Bauschadensbewerter sollte mit den örtlichen Bauweisen, typischen Schadensbildern und regionalen Besonderheiten vertraut sein. Nur so kann der Zustand des Gebäudes fachgerecht eingeordnet und realistisch bewertet werden.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-text-100 mb-2">Gemeinsame Besichtigung oder diskrete Analyse</h4>
                        <p className="text-text-200 leading-relaxed">
                          Klassische Option: Koordinieren Sie einen Besichtigungstermin mit Ihrem Gutachter (Dauer: 1–2 Stunden) und holen Sie vorab die Zustimmung des Verkäufers ein. Moderne Option: Fotografieren Sie diskret während Ihrer regulären Besichtigungen für eine digitale Analyse.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-text-100 mb-2">Zurückhaltung vor dem Verkäufer</h4>
                        <p className="text-text-200 leading-relaxed">
                          Diskutieren Sie Preisfragen niemals in Anwesenheit des Verkäufers. Wird die Immobilie vor dem Verkäufer kritisiert, riskieren Sie, aus dem Bieterkreis ausgeschlossen zu werden.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-text-100 mb-2">Achtung bei Schwarzbauten</h4>
                        <p className="text-text-200 leading-relaxed">
                          Bei ausgebauten Dachböden, Kellern, zusätzlichen Garagen oder Schuppen hellhörig werden und gegebenenfalls Einsicht in die Bauakten der Immobilie beim Bauamt nehmen.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-text-100 mb-2">Kosten einkalkulieren</h4>
                        <p className="text-text-200 leading-relaxed">
                          Für ein hochwertiges schriftliches Gutachten sollten Sie bei Bauklar.org mit einem All-inclusive-Preis von 350 € rechnen. Umfangreiche, vollständige Wertgutachten können hingegen bis zu 1.500 € kosten.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-text-100 mb-2">Gutachter-Honorar immer vorab vereinbaren</h4>
                        <p className="text-text-200 leading-relaxed">
                          Kosten immer vor der Beauftragung aushandeln und schriftlich festhalten, bevor der Gutachter seine Dienste aufnimmt.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Berlin Section */}
                  <section id="berlin" className="mb-12 scroll-mt-24 bg-background rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Hauskauf Beratung in Berlin
                    </h2>
                    <div className="mb-6">
                      <Image
                        src="/Berlin 2.jpg"
                        alt="Hauskauf Beratung Berlin – Immobiliengutachter für Altbauten und Bestandsimmobilien"
                        width={1200}
                        height={675}
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Der Berliner Immobilienmarkt birgt spezifische Risiken. Sandiger Baugrund führt bei Altbauten häufig zu Setzungsrissen. Fehlende oder defekte Horizontalsperren verursachen aufsteigende Feuchtigkeit. Ein weiteres Problemfeld: nicht genehmigte Dachausbauten, die bei Aufdeckung teure Nachbesserungen erfordern.
                    </p>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Gerade in gefragten Lagen wie Prenzlauer Berg, Charlottenburg oder Kreuzberg ist eine unabhängige Immobilienbewertung unerlässlich. Verborgene Mängel können hier schnell Investitionen im fünfstelligen Bereich auslösen.
                    </p>
                    <p className="text-text-200 leading-relaxed">
                      Eine <Link href="/berlin" className="text-primary hover:underline">Bauschadensanalyse in Berlin</Link> schafft Klarheit über den tatsächlichen Objektzustand – diskret durchgeführt und binnen Tagen verfügbar.
                    </p>
                  </section>

                  {/* Weitere Städte Section */}
                  <section id="staedte" className="mb-12 scroll-mt-24 bg-bg-200 rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Weitere Städte und Regionen
                    </h2>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Regionale Besonderheiten prägen den Immobilienbestand jeder Stadt unterschiedlich:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-text-200 mb-4 ml-4">
                      <li><Link href="/hamburg" className="text-primary hover:underline">Hamburg</Link>: Hafennähe sorgt für feuchtes Mikroklima. Gründerzeitbauten weisen häufig Substanzschäden auf.</li>
                      <li><Link href="/muenchen" className="text-primary hover:underline">München</Link>: Extrem hohe Marktpreise setzen Käufer unter Zeitdruck. Viele verzichten vorschnell auf Gutachten.</li>
                      <li><Link href="/koeln" className="text-primary hover:underline">Köln</Link>: Kriegsschäden und provisorische Nachkriegsreparaturen sind weitverbreitet.</li>
                    </ul>
                    <p className="text-text-200 leading-relaxed">
                      Ungeachtet des Standorts bleibt eine qualifizierte Bauschadenanalyse die beste Absicherung vor Fehlinvestitionen.
                    </p>
                  </section>

                  {/* FAQ Section */}
                  <section id="faq" className="mb-12 scroll-mt-24 bg-background rounded-lg p-6 md:p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                        FAQ – Häufig gestellte Fragen zur Hauskauf Beratung
                      </h2>
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
                  </section>

                  {/* Conclusion Section */}
                  <section className="mb-12 bg-bg-200 rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Fazit: Hauskauf Beratung als Absicherung gegen finanzielle Risiken
                    </h2>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Eine sachverständige Immobilienbewertung ist keine fakultative Ergänzung, sondern elementarer Schutz vor finanziellen Risiken. Verborgene Bauschäden können Investitionen im fünf- bis sechsstelligen Bereich nach sich ziehen. Nur eine unabhängige Begutachtung – klassisch vor Ort oder digital – verschafft Transparenz über den realen Objektzustand.
                    </p>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Die Aufwendungen für eine professionelle Analyse (ab 350 Euro) amortisieren sich mehrfach: Käufer erzielen durch fundierte Gutachten Preisnachlässe zwischen 15.000 und 40.000 Euro. Sie entscheiden auf Basis von Fakten – nicht von Hoffnungen.
                    </p>
                    <p className="text-text-200 leading-relaxed">
                      Ob traditioneller Ortstermin oder digitale Bauschadensanalyse: Entscheidend ist die Unabhängigkeit der Bewertung. Nur so treffen Sie eine rationale, informierte Kaufentscheidung.
                    </p>
                  </section>

                  {/* CTA Section */}
                  <div className="bg-bg-300 rounded-lg p-8 md:p-10 text-center mb-12">
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mb-4">
                      Interessiert an einer professionellen Bauschadensanalyse?
                    </h3>
                    <p className="text-text-200 mb-6 leading-relaxed">
                      Erfahren Sie mehr über unsere digitale Bauschadensanalyse oder kontaktieren Sie uns für eine unverbindliche Beratung.
                    </p>
                    <Link href="/#preise" onClick={(e) => scrollToHomeSection(e, 'preise')}>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-3">
                        Jetzt Bewertung starten
                      </Button>
                    </Link>
                  </div>

                </div>
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

export default BlogHauskaufBeratungClient;
