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

// Helper to normalize canonical URLs with trailing slash
const normalizeCanonicalUrl = (url: string, siteUrl: string): string => {
  // If URL is already absolute (starts with http), normalize it
  if (url.startsWith('http')) {
    // If it's our domain, ensure trailing slash
    if (url.startsWith(siteUrl)) {
      const path = url.substring(siteUrl.length);
      // If path is empty or just '/', return with trailing slash
      if (!path || path === '/') {
        return `${siteUrl}/`;
      }
      // If path has query params or hash, don't add trailing slash
      if (path.includes('?') || path.includes('#')) {
        return url;
      }
      // Add trailing slash if not already present
      if (!path.endsWith('/')) {
        return `${siteUrl}${path}/`;
      }
      return url;
    }
    // External URL, return as-is
    return url;
  }
  
  // Relative path - ensure it starts with /
  if (!url.startsWith('/')) {
    url = '/' + url;
  }
  
  // Root path should end with /
  if (url === '/') {
    return `${siteUrl}/`;
  }
  
  // If path has query params or hash, don't add trailing slash
  if (url.includes('?') || url.includes('#')) {
    return `${siteUrl}${url}`;
  }
  
  // Add trailing slash if not already present
  if (!url.endsWith('/')) {
    url = url + '/';
  }
  
  return `${siteUrl}${url}`;
};

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
  // Normalize canonical URL with trailing slash
  const canonicalPath = canonical || location.pathname;
  const canonicalUrl = normalizeCanonicalUrl(canonicalPath, siteUrl);
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

