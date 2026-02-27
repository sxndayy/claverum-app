"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { FAQSchema } from '@/components/seo/FAQSchema';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/layout/CookieBanner';
import { SITE_URL } from '@/lib/config';

const BlogSchimmelBauschadenClient = () => {
  const router = useRouter();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
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
  };

  const scrollToHomeSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    if (window.location.pathname !== '/') {
      router.push('/');
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
      question: "Was kostet ein Schimmelgutachten?",
      answer: "Die Kosten für ein Schimmelgutachten variieren je nach Umfang. Einfache Erstbewertungen beginnen ab ca. 200-300 €, während ausführliche gerichtsverwertbare Gutachten mit Laboranalysen 800-2.000 € kosten können. Bei einer digitalen Bauschadensanalyse ab 350 € wird Schimmel als Teil der Gesamtbewertung mit einbezogen."
    },
    {
      question: "Kann ich wegen Schimmel die Miete mindern?",
      answer: "Ja, bei erheblichem Schimmelbefall ist eine Mietminderung möglich – sofern Sie nachweisen können, dass Sie richtig gelüftet und geheizt haben. Die Höhe der Minderung hängt vom Ausmaß ab und liegt oft zwischen 10-20%. Dokumentieren Sie den Schimmel mit Fotos und zeigen Sie ihn unverzüglich dem Vermieter an."
    },
    {
      question: "Wie finde ich einen seriösen Schimmelsachverständigen?",
      answer: "Achten Sie auf anerkannte Qualifikationen wie 'geprüfter Sachverständiger für Schimmelpilzschäden' oder Zertifizierungen durch TÜV oder Handwerkskammern. Der Sachverständige sollte unabhängig sein und keine Sanierungsfirma betreiben. Referenzen und Berufserfahrung sind wichtige Qualitätsmerkmale."
    },
    {
      question: "Ist Schimmel hinter Möbeln immer gefährlich?",
      answer: "Nicht immer, aber es ist ein Warnsignal. Schimmel hinter Möbeln entsteht oft durch unzureichende Luftzirkulation an kalten Außenwänden. Kleine Flächen (unter 20 cm²) können Sie selbst entfernen. Bei größerem Befall sollten Sie die Ursache professionell klären lassen – es könnte auf Wärmebrücken oder Dämmprobleme hinweisen."
    },
    {
      question: "Welche Gesundheitssymptome verursacht schwarzer Schimmel?",
      answer: "Schwarzer Schimmel (meist Stachybotrys oder Aspergillus) kann Atemwegsreizungen, allergische Reaktionen, Kopfschmerzen, Müdigkeit, Augenreizungen und bei empfindlichen Personen Asthma auslösen. Langfristige Exposition kann das Immunsystem schwächen. Bei gesundheitlichen Beschwerden sollten Sie einen Arzt konsultieren und den Schimmel zeitnah entfernen lassen."
    },
    {
      question: "Wie finde ich die Ursache von Schimmel an der Wand?",
      answer: "Die Ursachensuche erfordert systematisches Vorgehen: Prüfen Sie, ob die Wand feucht ist (Feuchtemessung), ob es sich um eine Außenwand handelt (Wärmebrücken), ob ausreichend gelüftet wird, ob Wasserschäden vorliegen oder ob bauliche Mängel existieren. Ein Sachverständiger kann mit Thermografie und Feuchtemessungen die genaue Ursache identifizieren."
    },
    {
      question: "Muss der Vermieter bei Schimmel die Ursache nachweisen?",
      answer: "Ja, grundsätzlich liegt die Beweislast beim Vermieter. Er muss belegen, dass keine baulichen Mängel vorliegen. Der Mieter hingegen muss nachweisen, dass er ordnungsgemäß gelüftet und geheizt hat. In der Praxis ist ein Gutachten oft der einzige Weg, um die wahre Ursache zu klären und Streitigkeiten beizulegen."
    },
    {
      question: "Brauche ich ein Schimmelgutachten für das Gericht?",
      answer: "Für gerichtliche Auseinandersetzungen ist ein qualifiziertes Gutachten von einem zertifizierten Sachverständigen unerlässlich. Es muss die Ursache des Schimmelbefalls nachvollziehbar dokumentieren, mögliche Verantwortlichkeiten klären und fachlich fundiert sein. Einfache Fotos oder Aussagen reichen vor Gericht nicht aus."
    },
    {
      question: "Was tun, wenn ich beim Hauskauf Schimmel entdecke?",
      answer: "Ziehen Sie sofort einen Sachverständigen hinzu, um das Ausmaß und die Ursache zu klären. Verhandeln Sie den Kaufpreis neu oder fordern Sie eine Sanierung vor Vertragsabschluss. Bei verstecktem Schimmel, der arglistig verschwiegen wurde, können Sie vom Kauf zurücktreten – allerdings müssen Sie die Arglist beweisen. Eine digitale Bauschadensanalyse kann versteckte Schimmelrisiken aufdecken."
    },
    {
      question: "Kann Schimmel beim Hauskauf versteckt sein?",
      answer: "Ja, Schimmel kann sich hinter Verkleidungen, in Hohlräumen, im Estrich, hinter Tapeten oder in nicht einsehbaren Bereichen verbergen. Warnsignale sind muffiger Geruch, Verfärbungen oder Feuchtigkeitsflecken. Eine professionelle Begutachtung mit Feuchtemessungen und gegebenenfalls Thermografie kann versteckten Schimmel aufdecken, bevor Sie kaufen."
    }
  ];

  // BlogPosting Schema
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Schimmel als Bauschaden – Ursachen, Risiken und professionelle Bewertung",
    "description": "Schimmel im Haus? Ursachen, Risiken, Pflichten von Mietern und Vermietern – plus professionelle Analyse & Sanierungsempfehlungen. Jetzt informieren!",
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
    "datePublished": "2025-01-19",
    "dateModified": "2025-01-19",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/schimmel-bauschaden/`
    },
    "image": {
      "@type": "ImageObject",
      "url": `${SITE_URL}/schimmel.png`
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
            <div className="absolute inset-0 hero-gradient opacity-30"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-text-100 mb-6 leading-tight">
                  Schimmel als Bauschaden – Ursachen, Risiken und professionelle Bewertung
                </h1>
              </div>
            </div>
          </section>

          {/* Content Section */}
          <section className="py-8 md:py-12 bg-bg-200">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                
                {/* Hero Image */}
                <div className="mb-12">
                  <Image
                    src="/schimmel.png"
                    alt="Schimmel als Bauschaden – Professionelle Analyse und Bewertung"
                    width={1200}
                    height={675}
                    className="w-full h-auto rounded-lg shadow-soft object-cover"
                  />
                </div>
                
                {/* Intro Text */}
                <div className="mb-12">
                  <p className="text-lg text-text-200 leading-relaxed">
                    Schimmelpilz in Innenräumen gehört zu den häufigsten Bauschäden in Deutschland. Er beeinträchtigt nicht nur die Bausubstanz, sondern kann auch gesundheitliche Probleme verursachen und zu Streitigkeiten zwischen Mietern und Vermietern führen. Dieser Beitrag zeigt, wodurch Schimmel entsteht, wie er fachlich bewertet wird und welche Schritte sinnvoll sind, um Schäden effektiv zu vermeiden oder zu sanieren.
                  </p>
                </div>

                {/* Summary Box */}
                <div className="bg-bg-200 border-l-4 border-primary rounded-lg p-6 md:p-8 mb-12">
                  <h2 className="text-xl md:text-2xl font-semibold text-text-100 mb-4">
                    Das Wichtigste in Kürze
                  </h2>
                  <ul className="space-y-3">
                    {[
                      "Schimmel entsteht durch hohe Feuchtigkeit (70-90% relative Luftfeuchtigkeit), geeigneten Untergrund und Temperaturen zwischen 0-45°C",
                      "Häufige Ursachen sind Wärmebrücken, unzureichende Dämmung, Wasserschäden, Restbaufeuchte und falsches Lüftungsverhalten",
                      "Gesundheitsrisiken umfassen Allergien, Atemwegsreizungen, Asthma und bei empfindlichen Personen ernsthafte Beschwerden",
                      "Ab 0,5 m² Befall sollte ein professioneller Sachverständiger hinzugezogen werden",
                      "Die Beweislast liegt beim Vermieter für bauliche Mängel und beim Mieter für korrektes Lüften und Heizen"
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
                      { id: 'warum-ernst', text: 'Warum Schimmel ein ernstzunehmender Bauschaden ist' },
                      { id: 'bauphysik', text: 'Bauphysikalische Grundlagen' },
                      { id: 'fenster-waende', text: 'Entwicklung von Fenstern und Außenwänden' },
                      { id: 'schimmelpilze', text: 'Schimmelpilze – was man wissen sollte' },
                      { id: 'voraussetzungen', text: 'Voraussetzungen für Schimmelwachstum' },
                      { id: 'gesundheit', text: 'Gesundheitsrisiken' },
                      { id: 'kategorien', text: 'Schadenskategorien' },
                      { id: 'untersuchung', text: 'Untersuchungsmethoden' },
                      { id: 'ursachen', text: 'Typische Ursachen' },
                      { id: 'beweislast', text: 'Beweislast Mieter vs. Vermieter' },
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
                  
                  {/* Warum Schimmel ein ernstzunehmender Bauschaden ist */}
                  <section id="warum-ernst" className="mb-12 scroll-mt-24 bg-background rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Warum Schimmel ein ernstzunehmender Bauschaden ist
                    </h2>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Nach § 3 der Musterbauordnung (MBO) müssen Gebäude so errichtet und instand gehalten werden, dass Leben, Gesundheit und Umwelt nicht gefährdet werden. Ein wesentlicher Baustein dabei: Schutz vor Feuchtigkeit und Schimmel.
                    </p>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Auch das Gebäudeenergiegesetz (GEG § 13) fordert eine dauerhaft luftundurchlässige Gebäudehülle bei gleichzeitig ausreichendem Mindestluftwechsel. Wird dies nicht erreicht, steigt das Risiko für Tauwasser und Schimmelpilzbildung erheblich.
                    </p>
                    <p className="text-text-200 leading-relaxed">
                      Schimmel ist nicht nur ein ästhetisches Problem – er kann die Bausubstanz schädigen, gesundheitliche Beschwerden auslösen und zu erheblichen Streitigkeiten zwischen Mietern, Vermietern und Eigentümern führen. Eine professionelle Bewertung und Sanierung ist daher unverzichtbar.
                    </p>
                  </section>

                  {/* Bauphysikalische Grundlagen */}
                  <section id="bauphysik" className="mb-12 scroll-mt-24 bg-bg-200 rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Bauphysikalische Grundlagen – warum Feuchtigkeit Schimmel erzeugt
                    </h2>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Wärmeschutz nach DIN 4108
                    </h3>
                    <p className="text-text-200 leading-relaxed mb-4">
                      DIN 4108 definiert drei zentrale Schutzfunktionen:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-text-200 mb-4 ml-4">
                      <li>Wärmeschutz im Winter</li>
                      <li>Schutz vor Tauwasser und Schimmelpilzbildung an Bauteilen</li>
                      <li>Schutz vor Überhitzung im Sommer</li>
                    </ul>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Die früheren Bauvorschriften waren deutlich weniger streng – weshalb viele <Link href="/berlin" className="text-primary hover:underline">Altbauten</Link> (bis ca. 1960) bauphysikalisch schimmelanfällig sind. In Gebäuden zwischen 1960 und 2001 hängt das Risiko stark von der Nutzung und der Dämmqualität ab.
                    </p>
                    <p className="text-text-200 leading-relaxed">
                      Bei Neubauten ab 2001 ist Schimmel häufig auf Nutzerverhalten und fehlende Lüftung zurückzuführen.
                    </p>
                  </section>

                  {/* Entwicklung von Fenstern und Außenwänden */}
                  <section id="fenster-waende" className="mb-12 scroll-mt-24 bg-background rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Entwicklung von Fenstern und Außenwänden – warum Altbauten gefährdet sind
                    </h2>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Fenster
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-text-200 mb-4 ml-4">
                      <li><strong>bis 1978:</strong> Einfachverglasung – große Wärmeverluste, kalte Oberflächen, hohe Kondensatneigung</li>
                      <li><strong>ab 1978:</strong> Isolierglas – deutlich bessere U-Werte</li>
                      <li><strong>ab 1995:</strong> Wärmeschutzverglasung</li>
                      <li><strong>heute:</strong> Dreifachverglasung & hochgedämmte Rahmen</li>
                    </ul>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Außenwände
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-text-200 mb-4 ml-4">
                      <li>Massive Außenwände im Altbau meist ohne oder mit sehr geringer Dämmung</li>
                      <li>Ab den 1990er-Jahren systematische Wärmedämmverbundsysteme (WDVS)</li>
                      <li>Heute sehr hohe Anforderungen gemäß GEG</li>
                    </ul>
                    
                    <div className="bg-bg-200 border-l-4 border-accent-200 rounded-lg p-4 mt-6">
                      <p className="font-semibold text-text-100 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Problem:
                      </p>
                      <p className="text-text-200 leading-relaxed">
                        Wird nur das Fenster erneuert, bleibt die Wand kalt → neue Wärmebrücken → erhöhte Schimmelgefahr.
                      </p>
                    </div>
                  </section>

                  {/* Schimmelpilze */}
                  <section id="schimmelpilze" className="mb-12 scroll-mt-24 bg-bg-200 rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Schimmelpilze – was man über die Organismen wissen sollte
                    </h2>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Schimmelpilze gehören natürlicherweise zur Umwelt. Häufige Arten in Innenräumen:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-text-200 mb-4 ml-4">
                      <li><strong>Aspergillus</strong> – wächst an feuchten Wänden und organischem Material</li>
                      <li><strong>Cladosporium</strong> – häufigster Außenluftpilz, wächst auf Holz, Papier, Textilien</li>
                      <li><strong>Penicillium</strong> – typisch in Innenräumen, verdirbt Lebensmittel</li>
                    </ul>
                    <p className="text-text-200 leading-relaxed">
                      Zu unterscheiden sind Schimmelpilze und Fäulepilze – letztere zerstören Holz tragend, während Schimmel vor allem Oberflächen befällt.
                    </p>
                  </section>

                  {/* Voraussetzungen für Schimmelwachstum */}
                  <section id="voraussetzungen" className="mb-12 scroll-mt-24 bg-background rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Voraussetzungen für Schimmelwachstum
                    </h2>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Schimmel entsteht nie zufällig – folgende Bedingungen müssen zusammenkommen:
                    </p>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Feuchtigkeit (Hauptfaktor)
                    </h3>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Optimal: 70–90 % relative Luftfeuchtigkeit auf der Bauteiloberfläche. DIN 4108: Schimmelpilzkriterium = 80 % RLF bei 20 °C
                    </p>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Geeigneter Untergrund
                    </h3>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Tapeten, Putz, Holz, Staub – porös und saugfähig.
                    </p>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Temperatur
                    </h3>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Optimal: ca. 20 °C. Wachstum möglich zwischen 0 und 45 °C.
                    </p>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      pH-Wert
                    </h3>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Optimal zwischen 4,5 und 6,5.
                    </p>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Nährstoffe
                    </h3>
                    <p className="text-text-200 leading-relaxed">
                      Schon minimaler Hausstaub genügt.
                    </p>
                  </section>

                  {/* Gesundheitsrisiken */}
                  <section id="gesundheit" className="mb-12 scroll-mt-24 bg-bg-200 rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Gesundheitsrisiken – wann wird Schimmel gefährlich?
                    </h2>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Schimmelbefall ist nicht automatisch gesundheitsschädlich, kann jedoch je nach Art, Konzentration und individueller Empfindlichkeit folgende Beschwerden auslösen:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-text-200 mb-4 ml-4">
                      <li>Allergien</li>
                      <li>Atemwegsreizungen</li>
                      <li>Asthma</li>
                      <li>Kopfschmerzen</li>
                      <li>Müdigkeit</li>
                    </ul>
                    <div className="bg-bg-300 border-l-4 border-primary rounded-lg p-4 mt-6">
                      <p className="font-semibold text-text-100 mb-2">
                        Vorsorgeprinzip:
                      </p>
                      <p className="text-text-200 leading-relaxed">
                        Schimmel muss immer entfernt und die Ursache immer geklärt werden.
                      </p>
                    </div>
                  </section>

                  {/* Schadenskategorien */}
                  <section id="kategorien" className="mb-12 scroll-mt-24 bg-background rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Schadenskategorien für Schimmelbefall
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="border-l-4 border-green-500 pl-4 py-2">
                        <p className="font-semibold text-text-100 mb-1">Kategorie 1: &lt; 20 cm²</p>
                        <p className="text-text-200 leading-relaxed">
                          Ursache identifizieren und beseitigen.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-yellow-500 pl-4 py-2">
                        <p className="font-semibold text-text-100 mb-1">Kategorie 2: &lt; 0,5 m²</p>
                        <p className="text-text-200 leading-relaxed">
                          Zeitnah entfernen, ggf. fachgerechte Kleinreparatur.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-red-500 pl-4 py-2">
                        <p className="font-semibold text-text-100 mb-1">Kategorie 3: &gt; 0,5 m²</p>
                        <p className="text-text-200 leading-relaxed">
                          Professionelle Fachfirma bzw. Gutachter einschalten.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Untersuchungsmethoden */}
                  <section id="untersuchung" className="mb-12 scroll-mt-24 bg-bg-200 rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Untersuchungsmethoden zur Analyse eines Schimmelschadens
                    </h2>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      1. Bestandsaufnahme
                    </h3>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Erst erfolgt eine visuelle Bauzustandserfassung:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-text-200 mb-4 ml-4">
                      <li>Bauteile</li>
                      <li>Feuchtequellen</li>
                      <li>Raumklima</li>
                      <li>Wärmebrücken</li>
                      <li>Lüftungsverhalten</li>
                    </ul>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      2. Gravimetrische Feuchtemessung
                    </h3>
                    <p className="text-text-200 leading-relaxed mb-2">
                      <strong className="text-text-100">Vorteile:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-text-200 mb-4 ml-4">
                      <li>Sehr präzise</li>
                      <li>Messung von Feuchte, Hygroskopizität, Salzgehalt, Rohdichte, Wärmeleitfähigkeit</li>
                    </ul>
                    <p className="text-text-200 leading-relaxed mb-2">
                      <strong className="text-text-100">Nachteil:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-text-200 mb-4 ml-4">
                      <li>Zerstörend (Materialprobe notwendig)</li>
                    </ul>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Nutzungsklassen nach UBA-Leitfaden (Kurzüberblick)
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-text-200 mb-4 ml-4">
                      <li><strong>I</strong> – sehr hohe Anforderungen: Krankenhäuser</li>
                      <li><strong>II</strong> – normale Anforderungen: Wohnräume, Büros, Schulen</li>
                      <li><strong>III</strong> – geringe Anforderungen: Keller, Garagen</li>
                      <li><strong>IV</strong> – sehr geringe Anforderungen: abgeschottete Bauteile</li>
                    </ul>
                  </section>

                  {/* Typische Ursachen */}
                  <section id="ursachen" className="mb-12 scroll-mt-24 bg-background rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Typische Ursachen für Schimmelbildung
                    </h2>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Bauwerks- und Feuchteursachen
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-text-200 mb-6 ml-4">
                      <li>Restbaufeuchte</li>
                      <li>Wasserschäden</li>
                      <li>Trocknungsfehler</li>
                      <li>Regen- oder Bodenfeuchte</li>
                      <li>Wärmebrücken</li>
                      <li>Unzureichende Dämmung</li>
                      <li>Luftdichtheitsmängel</li>
                      <li>Wasserdampfdiffusion (langsamer Prozess)</li>
                      <li>Wasserdampfkonvektion (schnell, z.B. durch Fugen und Undichtigkeiten)</li>
                    </ul>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Nutzerbedingte Ursachen
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-text-200 mb-6 ml-4">
                      <li>Unzureichendes Lüften</li>
                      <li>Fehlendes Heizen</li>
                      <li>Blockierung der Luftzirkulation (z. B. Möbel vor Außenwänden)</li>
                    </ul>
                    
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mt-6 mb-3">
                      Sonderfall: Schimmel im Estrich
                    </h3>
                    <p className="text-text-200 leading-relaxed">
                      Oft unsichtbar – tritt bei fehlerhafter Trocknung und Estrichaufbau auf. Diese Art von Schimmel ist besonders tückisch, da er nicht sofort erkennbar ist und erst bei Baumaßnahmen oder durch muffigen Geruch auffällt.
                    </p>
                  </section>

                  {/* Beweislast */}
                  <section id="beweislast" className="mb-12 scroll-mt-24 bg-bg-200 rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Beweislast Mieter vs. Vermieter
                    </h2>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border-l-4 border-primary">
                        <p className="font-semibold text-text-100 mb-2">Der Mieter muss belegen:</p>
                        <p className="text-text-200 leading-relaxed">
                          Dass er korrekt gelüftet und geheizt hat. Dies kann durch Protokolle, Fotos offener Fenster oder Zeugenaussagen geschehen.
                        </p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border-l-4 border-primary">
                        <p className="font-semibold text-text-100 mb-2">Der Vermieter muss beweisen:</p>
                        <p className="text-text-200 leading-relaxed">
                          Dass keine baulichen Mängel vorliegen. Dies erfordert oft ein Gutachten, das Wärmebrücken, Dämmung, Feuchtigkeit und andere bauliche Faktoren untersucht.
                        </p>
                      </div>
                    </div>
                    <p className="text-text-200 leading-relaxed mt-6">
                      Daher sind fachliche Gutachten entscheidend. Ein <Link href="/#preise" onClick={(e) => scrollToHomeSection(e, 'preise')} className="text-primary hover:underline">professionelles Gutachten</Link> klärt die Ursache objektiv und schafft Klarheit für beide Parteien.
                    </p>
                  </section>

                  {/* FAQ Section */}
                  <section id="faq" className="mb-12 scroll-mt-24 bg-background rounded-lg p-6 md:p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                        FAQ – Häufig gestellte Fragen zu Schimmel als Bauschaden
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

                  {/* Fazit Section */}
                  <section className="mb-12 bg-bg-200 rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-text-100 mb-4">
                      Fazit – Schimmel vermeiden und professionell bewerten lassen
                    </h2>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Schimmel ist ein ernstzunehmender Bauschaden, der bauphysikalische, feuchteschutztechnische und nutzungsbedingte Ursachen haben kann. Eine professionelle Schadensanalyse stellt sicher, dass:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-text-200 mb-4 ml-4">
                      <li>Die Ursache eindeutig nachgewiesen wird</li>
                      <li>Eine sichere Sanierungsplanung erfolgt</li>
                      <li>Weitere Schäden verhindert werden</li>
                      <li>Streitfälle rechtssicher geklärt werden</li>
                    </ul>
                    <p className="text-text-200 leading-relaxed mb-4">
                      Ob Sie eine Immobilie <Link href="/blog/hauskauf-beratung" className="text-primary hover:underline">kaufen</Link>, mieten oder vermieten – eine frühzeitige Schimmelanalyse schützt Ihre Gesundheit, Ihr Eigentum und Ihre finanziellen Interessen.
                    </p>
                    <p className="text-text-200 leading-relaxed">
                      Eine sorgfältige Bewertung durch qualifizierte Sachverständige ist daher unverzichtbar. Bei <Link href="/#so-funktioniert" onClick={(e) => scrollToHomeSection(e, 'so-funktioniert')} className="text-primary hover:underline">digitalen Bauschadensanalysen</Link> wird Schimmel als Teil der Gesamtbewertung professionell mit einbezogen.
                    </p>
                  </section>

                  {/* CTA Section */}
                  <div className="bg-bg-300 rounded-lg p-8 md:p-10 text-center mb-12">
                    <h3 className="text-xl md:text-2xl font-semibold text-text-100 mb-4">
                      Schimmel beim Hauskauf oder in der Wohnung entdeckt?
                    </h3>
                    <p className="text-text-200 mb-6 leading-relaxed">
                      Unsere professionelle Bauschadensanalyse hilft Ihnen, die Ursache zu klären und fundierte Entscheidungen zu treffen.
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

export default BlogSchimmelBauschadenClient;

