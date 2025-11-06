import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '@/constants/config';

export function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Bauschadensbewertung",
    "description": "Professionelle Bauschadensbewertung mit KI-gestützter Analyse. Detaillierte Zustandsanalyse mit realistischen Kosten- und Risikoabschätzungen.",
    "provider": {
      "@type": "Organization",
      "name": "Claverum",
      "url": SITE_URL,
      "logo": `${SITE_URL}/logo.png`
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
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

