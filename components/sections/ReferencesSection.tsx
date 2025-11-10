import React from 'react';
import { ClientReviews, Review } from '@/components/ui/client-reviews';
import { ReviewSchema } from '@/components/seo/ReviewSchema';

const ReferencesSection: React.FC = () => {
  const reviews: Review[] = [
    {
      rating: 5,
      reviewer: "Maria Schmidt",
      roleReviewer: "Immobilienkäuferin",
      review: "Bauklar.org hat mir bei meinem Hauskauf enorm geholfen. Das Gutachten war sehr detailliert und hat mir gezeigt, welche Mängel ich übersehen hätte. Dank der professionellen Bewertung konnte ich den Kaufpreis um 15.000€ drücken!",
      date: "15. August 2025"
    },
    {
      rating: 5,
      reviewer: "Thomas Weber",
      roleReviewer: "Erstkäufer",
      review: "Als Erstkäufer war ich völlig überfordert. Bauklar.org hat mir Schritt für Schritt erklärt, worauf ich achten muss. Die Fotos wurden sehr schnell analysiert und der Bericht war super verständlich. Kann ich nur empfehlen!",
      date: "3. September 2025"
    },
    {
      rating: 4.5,
      reviewer: "Sarah Müller",
      roleReviewer: "Investorin",
      review: "Ich kaufe regelmäßig Immobilien zur Vermietung. Bauklar.org spart mir viel Zeit und Geld. Der Gutachter erkennt auch versteckte Mängel, die ich als Laie übersehen hätte. Sehr professioneller Service!",
      date: "28. Juli 2025"
    },
    {
      rating: 5,
      reviewer: "Michael Bauer",
      roleReviewer: "Familienvater",
      review: "Wir wollten ein Haus für unsere Familie kaufen. Bauklar.org hat uns vor einem teuren Fehler bewahrt - das Haus hatte massive Feuchtigkeitsschäden, die wir nicht erkannt hätten. Sehr zu empfehlen!",
      date: "12. August 2025"
    },
    {
      rating: 4.5,
      reviewer: "Lisa Hoffmann",
      roleReviewer: "Maklerin",
      review: "Ich empfehle Bauklar.org allen meinen Kunden. Die Gutachten sind neutral und objektiv. Meine Kunden fühlen sich sicherer bei ihrer Kaufentscheidung. Ein echter Mehrwert!",
      date: "5. September 2025"
    },
    {
      rating: 5,
      reviewer: "Andreas Klein",
      roleReviewer: "Sanierer",
      review: "Ich renoviere alte Häuser. Bauklar.org hat mir geholfen, die Kosten für die Sanierung realistisch einzuschätzen. Die Analyse war sehr präzise und hat mir geholfen, das richtige Objekt zu finden.",
      date: "20. August 2025"
    }
  ];

  return (
    <>
      <ReviewSchema reviews={reviews} />
      <section id="referenzen" className="py-20 bg-gradient-to-br from-blue-50/50 via-blue-100/30 to-blue-200/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Was unsere Kunden sagen
          </h2>
          <p className="text-xl text-text-200 max-w-3xl mx-auto">
            Über 500 zufriedene Kunden vertrauen bereits auf unsere professionelle Bauschadensbewertung
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <ClientReviews reviews={reviews} />
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-8 text-sm text-text-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs md:text-sm">500+</span>
              </div>
              <span>Bewertungen</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">4.8</span>
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
    </>
  );
};

export default ReferencesSection;

