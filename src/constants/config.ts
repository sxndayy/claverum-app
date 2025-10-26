// Frontend Configuration - No Backend Dependencies
export const APP_CONFIG = {
  name: "BauCheck KI",
  version: "1.0.0",
  description: "KI-gestützte Bauschadensbewertung",
  // Remove API_BASE - this will be configured in your new project
  // export const API_BASE = (import.meta.env.VITE_API_BASE ?? "http://localhost:8002").replace(/\/+$/,'');
};

// You can add your own API configuration here when integrating with your backend
export const getApiBase = () => {
  // Return your API base URL here
  return import.meta.env.VITE_API_BASE || 'http://localhost:3001';
};