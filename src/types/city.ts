// TypeScript interfaces for city page data structure

export interface HeroImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading?: 'eager' | 'lazy';
}

export interface CTAButtons {
  primary: string;
  secondary: string;
}

export interface HeroContent {
  h1: string;
  subtitle: string;
  cta: CTAButtons;
}

export interface ContentSubsection {
  h3: string;
  content: string;
}

export interface ContentSection {
  id: string;
  h2: string;
  content: string;
  subsections?: ContentSubsection[];
}

export interface TrustElement {
  text: string;
  icon?: string;
}

export interface CTASection {
  h2: string;
  content: string;
  primaryCTA: {
    text: string;
    link: string;
  };
  secondaryCTA: {
    text: string;
    link: string;
  };
  microcopy: string;
  trustElements: TrustElement[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface OpenGraph {
  type: string;
  title: string;
  description: string;
  image: string;
  url: string;
}

export interface Twitter {
  card: string;
  title: string;
  description: string;
  image: string;
}

export interface SEOData {
  title: string;
  metaDescription: string;
  canonical: string;
  robots?: string;
  openGraph: OpenGraph;
  twitter: Twitter;
}

export interface AreaServed {
  "@type": "City";
  name: string;
  containedInPlace?: {
    "@type": "State";
    name: string;
  };
}

export interface LocalBusinessSchema {
  "@context": string;
  "@type": string;
  name: string;
  image: string;
  description: string;
  areaServed: AreaServed;
  priceRange: string;
  url: string;
}

export interface ServiceSchema {
  "@context": string;
  "@type": string;
  name: string;
  serviceType: string;
  provider: {
    "@type": string;
    name: string;
    url: string;
  };
  areaServed: {
    "@type": string;
    name: string;
  };
  description: string;
}

export interface BreadcrumbItem {
  "@type": string;
  position: number;
  name: string;
  item: string;
}

export interface BreadcrumbSchema {
  "@context": string;
  "@type": string;
  itemListElement: BreadcrumbItem[];
}

export interface FAQPageSchema {
  "@context": string;
  "@type": string;
  mainEntity: Array<{
    "@type": string;
    name: string;
    acceptedAnswer: {
      "@type": string;
      text: string;
    };
  }>;
}

export interface StructuredData {
  localBusiness: LocalBusinessSchema;
  service: ServiceSchema;
  breadcrumb: BreadcrumbSchema;
  faqPage: FAQPageSchema;
}

export interface Keywords {
  primary: string[];
  secondary: string[];
  local: string[];
}

export interface InternalLink {
  text: string;
  url: string;
  context: string;
}

export interface CityContent {
  hero: HeroContent;
  sections: ContentSection[];
  ctaSection: CTASection;
}

export interface CityImages {
  hero: HeroImage;
}

export interface CityData {
  city: string;
  slug: string;
  url: string;
  seo: SEOData;
  structuredData: StructuredData;
  images: CityImages;
  content: CityContent;
  faq: FAQItem[];
  keywords: Keywords;
  internalLinks?: InternalLink[];
}



