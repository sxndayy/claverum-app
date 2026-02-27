"use client";

import React from 'react';
import { Clock } from 'lucide-react';

const AuftragProcessSidebar: React.FC = () => {
  const steps = [
    { num: 1, label: "Objekttyp wählen" },
    { num: 2, label: "Infos eintragen" },
    { num: 3, label: "Ersteinschätzung erhalten" },
  ];

  return (
    <aside className="process-sidebar">
      {/* Section 1: Process Steps */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-text-100 mb-4">
          So funktioniert&apos;s:
        </h3>

        <div className="space-y-3">
          {steps.map(({ num, label }) => (
            <div key={num} className="flex items-center gap-3">
              <span className="step-number">{num}</span>
              <span className="text-sm text-text-200">{label}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-text-300 italic mt-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Dauert nur 1 Minute
        </p>
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-primary-200 my-8" />

      {/* Section 2: Customer Quote */}
      <div>
        <h3 className="text-sm font-bold text-text-200 mb-3">
          Das sagen Kunden:
        </h3>

        {/* Stars */}
        <div className="flex gap-0.5 mb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg key={i} className="h-4 w-4 fill-[hsl(var(--accent-200))]" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
            </svg>
          ))}
        </div>

        {/* Quote Box */}
        <div className="quote-box mb-3">
          &quot;Schnelle und kompetente Ersteinschätzung – genau das, was wir gebraucht haben.&quot;
        </div>

        {/* Attribution */}
        <p className="text-sm text-text-300 mb-4">
          — Thomas K., Immobilienkäufer
        </p>

        {/* Rating */}
        <p className="text-sm text-text-300">
          4.9/5 von 500+ Kunden
        </p>
      </div>
    </aside>
  );
};

export default AuftragProcessSidebar;
