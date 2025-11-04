import { Helmet } from 'react-helmet-async';

interface ImageSchemaProps {
  imageUrl: string;
  title: string;
  description?: string;
  pageUrl?: string;
}

export function ImageSchema({ 
  imageUrl, 
  title, 
  description,
  pageUrl 
}: ImageSchemaProps) {
  const siteUrl = 'https://bauklar.io';
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`;
  const fullPageUrl = pageUrl ? `${siteUrl}${pageUrl}` : siteUrl;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": fullImageUrl,
    "name": title,
    "description": description || title,
    "url": fullPageUrl,
    "license": `${siteUrl}/agb`,
    "copyrightHolder": {
      "@type": "Organization",
      "name": "Claverium GmbH",
      "url": siteUrl
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

