"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Shield, Clock, CheckCircle } from 'lucide-react';

const CTASection = () => {
  const router = useRouter();

  const handleStartEvaluation = () => {
    router.push('/auftrag');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Bereit für Ihre Bauschadensbewertung?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Starten Sie jetzt Ihre professionelle Bauschadensbewertung. 
            Einfach, schnell und zuverlässig.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">DSGVO-konform</h3>
                <p className="text-gray-600">Ihre Daten sind sicher und geschützt</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Schnelle Ergebnisse</h3>
                <p className="text-gray-600">Ergebnis innerhalb von 48 Stunden</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Professionell</h3>
                <p className="text-gray-600">Hochwertige Gutachten von Experten</p>
              </CardContent>
            </Card>
          </div>

          <Button 
            onClick={handleStartEvaluation}
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
          >
            Jetzt Bewertung starten
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            Keine Anmeldung erforderlich • Sofortiger Start • Transparente Preise
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;




