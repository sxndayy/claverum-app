"use client";

import React, { useEffect, Suspense, lazy } from 'react';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Lazy load MultiStepForm for better performance
const MultiStepForm = lazy(() => import('@/components/forms/MultiStepForm'));

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
      <div className="min-h-screen bg-background relative">
        {/* Background Gradient - same as HeroSection */}
        <div className="absolute inset-0 hero-gradient opacity-30 min-h-full"></div>
        <Header />
        <main className="pt-20 relative z-10">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-text-100 mb-8 text-center">
              Bauschadensbewertung starten
            </h1>
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-text-200">Lade Formular...</p>
                </div>
              </div>
            }>
            <MultiStepForm />
            </Suspense>
          </div>
        </main>
        <div className="relative z-10 bg-white">
          <Footer />
        </div>
      </div>
    </>
  );
}


