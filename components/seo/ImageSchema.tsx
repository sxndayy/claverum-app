import { SITE_URL } from '@/lib/config';

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
  const siteUrl = SITE_URL;
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
      "name": "Claverum GmbH",
      "url": siteUrl
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}


