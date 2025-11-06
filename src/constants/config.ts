// Frontend Configuration - No Backend Dependencies
export const APP_CONFIG = {
  name: "Bauklar.org",
  version: "1.0.0",
  description: "Professionelle Bauschadensbewertung",
  // Remove API_BASE - this will be configured in your new project
  // export const API_BASE = (import.meta.env.VITE_API_BASE ?? "http://localhost:8002").replace(/\/+$/,'');
};

// SEO and Site Configuration
export const SITE_URL = 'https://bauklar.org';
export const SITE_NAME = 'Bauklar.org';

// You can add your own API configuration here when integrating with your backend
export const getApiBase = () => {
  // Return your API base URL here
  return import.meta.env.VITE_API_BASE || 'http://localhost:3001';
};