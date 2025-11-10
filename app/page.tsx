import { Metadata } from "next";
import Header from '@/components/layout/Header';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import PricingSection from '@/components/sections/PricingSection';
import ReferencesSection from '@/components/sections/ReferencesSection';
import AboutSection from '@/components/sections/AboutSection';
import FAQSection from '@/components/sections/FAQSection';
import CTASection from '@/components/sections/CTASection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/layout/CookieBanner';
import { Toaster } from '@/components/ui/toaster';
import { WebSiteSchema } from '@/components/seo/WebSiteSchema';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: "Professionelle Bauschadensbewertung - schnell, transparent, verlässlich",
  description: "Professionelle Bauschadensbewertung. Upload in Minuten, Ergebnis innerhalb von 48 Stunden. Schnell, transparent, verlässlich.",
  alternates: {
    canonical: `${SITE_URL}/`,
  },
};

export default function HomePage() {
  return (
    <>
      <WebSiteSchema />
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
        <Toaster />
      </div>
    </>
  );
}
