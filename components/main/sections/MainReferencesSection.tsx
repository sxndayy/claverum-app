import React from "react";
import { ClientReviews, Review } from "@/components/ui/client-reviews";
import { ReviewSchema } from "@/components/seo/ReviewSchema";

const MainReferencesSection: React.FC = () => {
  const reviews: Review[] = [
    {
      rating: 5,
      reviewer: "Maria S.",
      roleReviewer: "Erstkäuferin, Reihenhaus in Köln-Ehrenfeld",
      review:
        "Das Gutachten hat Feuchtigkeit im Keller aufgedeckt, die bei der Besichtigung nicht sichtbar war. Mit dem Bericht konnte ich den Kaufpreis nachverhandeln. Der Verkäufer hat 12.000 € nachgelassen.",
      date: "15. August 2025",
    },
    {
      rating: 5,
      reviewer: "Thomas W.",
      roleReviewer: "Erstkäufer, Einfamilienhaus bei Hamburg",
      review:
        "Als Erstkäufer wusste ich nicht, worauf ich achten muss. Der Bewertungsbericht hat mir klar gezeigt, welche Bereiche in Ordnung sind und wo Handlungsbedarf besteht. Die Kostenschätzung war sehr hilfreich für meine Finanzierungsplanung.",
      date: "3. September 2025",
    },
    {
      rating: 5,
      reviewer: "Michael B.",
      roleReviewer: "Familienvater, Altbau in Nürnberg",
      review:
        "Wir wollten einen Altbau von 1965 kaufen. Der Bericht hat massive Probleme mit der Elektrik aufgezeigt — Sanierungskosten geschätzt auf 25.000 €. Ohne die Bewertung hätten wir das erst nach dem Kauf bemerkt.",
      date: "12. August 2025",
    },
    {
      rating: 4.5,
      reviewer: "Sandra K.",
      roleReviewer: "Investorin, Mehrfamilienhaus in Leipzig",
      review:
        "Ich nutze Bauklar regelmäßig bei Ankäufen. Die Kombination aus schneller Lieferung und fachlicher Tiefe spart mir die Wochen, die ein Vor-Ort-Gutachter brauchen würde. Bei drei von fünf Objekten hat der Bericht den Kaufpreis beeinflusst.",
      date: "28. Juli 2025",
    },
  ];

  return (
    <>
      <ReviewSchema reviews={reviews} />
      <section
        id="referenzen"
        className="py-20 bg-bg-200"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-100 mb-4">
              Referenzen
            </h2>
            <p className="text-xl text-text-200 max-w-3xl mx-auto">
              Was Käufer nach ihrer Bewertung berichten
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <ClientReviews reviews={reviews} />
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-text-300">
              Alle Bewertungen stammen von verifizierten Kunden
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default MainReferencesSection;

