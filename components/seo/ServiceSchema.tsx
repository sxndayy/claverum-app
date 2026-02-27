import { SITE_URL } from '@/lib/config';

export function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Bauschadensbewertung",
    "description": "Professionelle Bauschadensbewertung. Detaillierte Zustandsanalyse mit realistischen Kosten- und Risikoabschätzungen.",
    "provider": {
      "@type": "Organization",
      "name": "Claverum",
      "url": SITE_URL,
      "logo": `${SITE_URL}/logo-final.png`
    },
    "areaServed": {
      "@type": "Country",
      "name": "Deutschland"
    },
    "serviceType": "Bauschadensanalyse",
    "offers": {
      "@type": "Offer",
      "price": "350",
      "priceCurrency": "EUR",
      "description": "Professionelle Bauschadensbewertung"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}




