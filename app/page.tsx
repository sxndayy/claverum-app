import { Metadata } from "next";
import MainHeader from "@/components/main/layout/MainHeader";
import MainHeroSection from "@/components/main/sections/MainHeroSection";
import MainProblemSection from "@/components/main/sections/MainProblemSection";
import MainServicesSection from "@/components/main/sections/MainServicesSection";
import MainHowItWorksSection from "@/components/main/sections/MainHowItWorksSection";
import MainPricingSection from "@/components/main/sections/MainPricingSection";
import MainMustergutachtenSection from "@/components/main/sections/MainMustergutachtenSection";
import MainReferencesSection from "@/components/main/sections/MainReferencesSection";
import MainAboutSection from "@/components/main/sections/MainAboutSection";
import MainFAQSection from "@/components/main/sections/MainFAQSection";
import MainCTASection from "@/components/main/sections/MainCTASection";
import MainContactSection from "@/components/main/sections/MainContactSection";
import MainFooter from "@/components/main/layout/MainFooter";
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
    canonical: `${SITE_URL}/`,
  },
};

export default function HomePage() {
  return (
    <>
      <WebSiteSchema />
      <div className="min-h-screen bg-background">
        <MainHeader />
        <main>
          <MainHeroSection />
          <MainProblemSection />
          <MainPricingSection />
          <MainMustergutachtenSection />
          <MainHowItWorksSection />
          <MainServicesSection />
          <MainReferencesSection />
          <MainAboutSection />
          <MainFAQSection />
          <MainCTASection />
          <MainContactSection />
        </main>
        <MainFooter />
        <CookieBanner />
        <Toaster />
        <ChatWidget />
        <ScrollTracker />
      </div>
    </>
  );
}
