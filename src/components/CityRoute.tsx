import React from 'react';
import { useParams } from 'react-router-dom';
import { getCityDataSync, isValidCitySlug } from '@/data/cities';
import CityPage from '@/pages/CityPage';
import NotFound from '@/pages/NotFound';

// List of routes that should NOT be handled as city pages
const RESERVED_ROUTES = [
  'admin', 'admin/login', 'evaluation', 'success', 'impressum', 
  'agb', 'datenschutz', 'widerruf', 'berlin', 'hamburg', 'muenchen'
];

const CityRoute: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Early return if no slug
  if (!slug) {
    return <NotFound />;
  }

  // Check if route is reserved
  if (RESERVED_ROUTES.includes(slug)) {
    return <NotFound />;
  }

  // Check if slug is a valid city slug
  if (!isValidCitySlug(slug)) {
    return <NotFound />;
  }

  // Load city data synchronously (for prerendering)
  // This ensures Netlify prerendering can see the content immediately
  const cityData = getCityDataSync(slug);

  // If no city data found, show 404
  if (!cityData) {
    return <NotFound />;
  }

  // Render city page with data
  return <CityPage cityData={cityData} />;
};

export default CityRoute;

