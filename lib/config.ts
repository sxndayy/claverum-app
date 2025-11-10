// Frontend Configuration
export const APP_CONFIG = {
  name: "Bauklar.org",
  version: "1.0.0",
  description: "Professionelle Bauschadensbewertung",
};

// SEO and Site Configuration
export const SITE_URL = 'https://bauklar.org';
export const SITE_NAME = 'Bauklar.org';

// API Configuration
export const getApiBase = () => {
  // For Next.js, use environment variables
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable or default
    return process.env.NEXT_PUBLIC_API_BASE || 'https://api.bauklar.org';
  }
  // Server-side: use environment variable or default
  return process.env.API_BASE || process.env.NEXT_PUBLIC_API_BASE || 'https://api.bauklar.org';
};

