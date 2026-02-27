"use client";

import React from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';

const FunnelSidebar: React.FC = () => {
  return (
    <aside className="funnel-sidebar">
      {/* Expert Info Section */}
      <div className="text-center mb-6">
        <h3 className="text-sm font-bold text-text-200 mb-4">
          Ihr Sachverständiger:
        </h3>
        
        {/* Expert Photo */}
        <div className="flex justify-center mb-4">
          <div className="relative w-[100px] h-[100px] rounded-full border-[3px] border-primary-200 overflow-hidden shadow-md">
            <Image
              src="/Johannes.png"
              alt="Dr. Johannes Stankiewicz - Diplom-Sachverständiger"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
        </div>

        {/* Expert Credentials */}
        <div className="space-y-2">
          <p className="text-base font-bold text-text-100">
            Dr. Johannes Stankiewicz
          </p>
          <p className="text-sm text-text-300">
            Diplom-Sachverständiger (DIA)
          </p>
          <p className="text-sm text-text-300">
            Zertifiziert (DIAZert)
          </p>
          <p className="text-sm text-text-300">
            15+ Jahre Erfahrung
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-primary-200 my-6" />

      {/* Trust Badges Section */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-success-100 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-text-200 leading-relaxed">
            Persönlicher Ansprechpartner
          </span>
        </div>
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-success-100 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-text-200 leading-relaxed">
            100% Datenschutz
          </span>
        </div>
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-success-100 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-text-200 leading-relaxed">
            Keine Vor-Ort-Termine nötig
          </span>
        </div>

        <div className="pt-2 text-sm font-bold text-text-100">
          Heute nur 87 € Anzahlung
        </div>
      </div>
    </aside>
  );
};

export default FunnelSidebar;






