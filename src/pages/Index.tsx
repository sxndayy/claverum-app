import React from 'react';
import { SEO } from '@/components/SEO';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import PricingSection from '@/components/PricingSection';
import ReferencesSection from '@/components/ReferencesSection';
import FAQSection from '@/components/FAQSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

const Index = () => {
  return (
    <>
      <SEO 
        title="Unabhängige Bauschadensanalyse" 
        description="Lassen Sie Ihr Wunschobjekt per KI prüfen. Upload in Minuten, Ergebnis bis nächster Werktag. DSGVO-konform, transparent, zuverlässig."
        canonical="/"
      />
      <div className="min-h-screen bg-background">
        <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <HowItWorksSection />
        <PricingSection />
        <ReferencesSection />
        <AboutSection />
        <FAQSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
      <CookieBanner />
      </div>
    </>
  );
};

export default Index;
