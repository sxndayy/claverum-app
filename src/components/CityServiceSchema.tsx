import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '@/constants/config';

interface CityServiceSchemaProps {
  cityName: string;
  serviceName?: string;
}

export function CityServiceSchema({ cityName, serviceName }: CityServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName || `Bauschadensanalyse ${cityName}`,
    "serviceType": "Bauschadensanalyse",
    "provider": {
      "@type": "Organization",
      "name": "bauklar.org",
      "url": SITE_URL
    },
    "areaServed": {
      "@type": "City",
      "name": cityName
    },
    "description": `Digitale Bauschadensanalyse und Kaufberatung für Immobilien in ${cityName}`
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}



