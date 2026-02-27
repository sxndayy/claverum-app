"use client";

import React, { useEffect } from 'react';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MultiStepForm from '@/components/forms/MultiStepForm';

export default function EvaluationClient() {
  // Scrollt zur obersten Position der Seite
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Bauschadensbewertung starten', url: '/evaluation' }
        ]} 
      />
      <div className="min-h-screen bg-bg-200 relative">
        <Header />
        <main className="pt-20 relative z-10">
          <div className="container mx-auto px-4 py-8">
            <MultiStepForm />
          </div>
        </main>
        <div className="relative z-10 bg-white">
          <Footer />
        </div>
      </div>
    </>
  );
}




