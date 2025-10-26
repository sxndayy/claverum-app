import React, { useEffect } from 'react';
import Header from '@/components/Header';
import MultiStepForm from '@/components/MultiStepForm';
import Footer from '@/components/Footer';

const Evaluation = () => {
  // Scrollt zur obersten Position der Seite
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Gradient - same as HeroSection */}
      <div className="absolute inset-0 hero-gradient opacity-30 min-h-full"></div>
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
  );
};

export default Evaluation;
