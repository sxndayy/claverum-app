import { SITE_URL } from '@/lib/config';

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Bauklar.org",
    "url": SITE_URL,
    "description": "Professionelle Bauschadensbewertung. Upload in Minuten, Ergebnis innerhalb von 48 Stunden. Schnell, transparent, verlässlich.",
    "publisher": {
      "@type": "Organization",
      "name": "Claverum",
      "url": SITE_URL
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

