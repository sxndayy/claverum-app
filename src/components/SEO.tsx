import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE_URL, SITE_NAME } from '@/constants/config';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
}

// Validation helpers
const validateTitle = (title: string, siteName: string): string => {
  const fullTitle = `${title} | ${siteName}`;
  if (fullTitle.length > 60) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`SEO Warning: Title exceeds 60 characters (${fullTitle.length}): "${fullTitle}"`);
    }
    // Truncate title if too long
    const maxTitleLength = 60 - siteName.length - 3; // Account for " | "
    return title.length > maxTitleLength 
      ? title.substring(0, maxTitleLength - 3) + '...'
      : title;
  }
  return title;
};

const validateDescription = (description: string): string => {
  if (description.length > 160) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`SEO Warning: Description exceeds 160 characters (${description.length}): "${description.substring(0, 50)}..."`);
    }
    return description.substring(0, 157) + '...';
  }
  return description;
};

export function SEO({ 
  title, 
  description, 
  canonical, 
  ogImage = '/og-image.png',
  ogType = 'website',
  noindex = false
}: SEOProps) {
  const location = useLocation();
  const siteName = SITE_NAME;
  const siteUrl = SITE_URL;
  const validatedTitle = validateTitle(title, siteName);
  const validatedDescription = validateDescription(description);
  const fullTitle = `${validatedTitle} | ${siteName}`;
  const canonicalUrl = canonical || `${siteUrl}${location.pathname}`;
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={validatedDescription} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={validatedDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={validatedDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}

