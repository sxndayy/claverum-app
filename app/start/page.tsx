import { Metadata } from "next";
import StartHeader from "@/components/start/layout/StartHeader";
import StartHeroSection from "@/components/start/sections/StartHeroSection";
import StartProblemSection from "@/components/start/sections/StartProblemSection";
import StartServicesSection from "@/components/start/sections/StartServicesSection";
import StartHowItWorksSection from "@/components/start/sections/StartHowItWorksSection";
import StartPricingSection from "@/components/start/sections/StartPricingSection";
import StartMustergutachtenSection from "@/components/start/sections/StartMustergutachtenSection";
import StartReferencesSection from "@/components/start/sections/StartReferencesSection";
import StartAboutSection from "@/components/start/sections/StartAboutSection";
import StartFAQSection from "@/components/start/sections/StartFAQSection";
import StartCTASection from "@/components/start/sections/StartCTASection";
import StartContactSection from "@/components/start/sections/StartContactSection";
import StartFooter from "@/components/start/layout/StartFooter";
import CookieBanner from "@/components/layout/CookieBanner";
import { Toaster } from "@/components/ui/toaster";
import ChatWidget from "@/components/start/ChatWidget";
import ScrollTracker from "@/components/start/ScrollTracker";
import { WebSiteSchema } from "@/components/seo/WebSiteSchema";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Professionelle Bauschadensbewertung - schnell, transparent, verlässlich",
  description:
    "Professionelle Bauschadensbewertung. Upload in Minuten, Ergebnis innerhalb von 48 Stunden. Schnell, transparent, verlässlich.",
  alternates: {
    canonical: `${SITE_URL}/start`,
  },
};

export default function StartPage() {
  return (
    <>
      <WebSiteSchema />
      <div className="min-h-screen bg-background">
        <StartHeader />
        <main>
          <StartHeroSection />
          <StartProblemSection />
          <StartPricingSection />
          <StartMustergutachtenSection />
          <StartHowItWorksSection />
          <StartServicesSection />
          <StartReferencesSection />
          <StartAboutSection />
          <StartFAQSection />
          <StartCTASection />
          <StartContactSection />
        </main>
        <StartFooter />
        <CookieBanner />
        <Toaster />
        <ChatWidget />
        <ScrollTracker />
      </div>
    </>
  );
}



