import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, FileText } from "lucide-react";

const PDF_URL = "/mustergutachten/mustergutachten-bauklar-analyse.pdf";

const highlights = [
  "14–16 Seiten strukturierter PDF-Bericht",
  "Erstellt von einem professionellen Baugutachter",
  "Klare Gliederung nach Gewerken (Keller, Dach, Fassade, Heizung, ...)",
  "Konkrete Einschätzung mit Handlungsempfehlung",
];

const StartMustergutachtenSection: React.FC = () => {
  return (
    <section id="mustergutachten" className="py-20 bg-bg-200">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left: Text */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Mustergutachten
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-text-100 mb-4">
                Sehen Sie, was Sie erhalten
              </h2>

              <p className="text-text-200 mb-6 leading-relaxed">
                Transparenz ist uns wichtig. Werfen Sie einen Blick in ein
                echtes Mustergutachten und überzeugen Sie sich selbst von der
                Qualität unserer Analyse.
              </p>

              <ul className="space-y-3">
                {highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-success-100 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-text-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Cover */}
            <div className="max-w-sm mx-auto md:max-w-none">
              <a
                href={PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="bg-white rounded-xl shadow-strong p-3 transition-transform duration-300 group-hover:scale-[1.02]">
                  <Image
                    src="/mustergutachten/mustergutachten-cover.png"
                    alt="Bauklar Analyse – Mustergutachten Vorschau"
                    width={480}
                    height={680}
                    className="rounded-lg w-full h-auto"
                    priority={false}
                  />
                </div>
              </a>

              <div className="mt-4 text-center">
                <a href={PDF_URL} target="_blank" rel="noopener noreferrer">
                  <Button
                    className="font-semibold bg-primary hover:bg-accent-300 text-white"
                    size="lg"
                  >
                    Mustergutachten ansehen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <p className="text-xs text-text-300 mt-2.5">
                  PDF &bull; Kostenlos &bull; Keine Anmeldung nötig
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartMustergutachtenSection;
