// Helper functions for city data loading in Next.js
import { CityData } from '@/types/city';

// Import all city JSON files statically (for static generation)
import berlinData from '@/data/cities/berlin.json';
import bremenData from '@/data/cities/bremen.json';
import dortmundData from '@/data/cities/dortmund.json';
import dresdenData from '@/data/cities/dresden.json';
import duesseldorfData from '@/data/cities/duesseldorf.json';
import essenData from '@/data/cities/essen.json';
import frankfurtData from '@/data/cities/frankfurt.json';
import hamburgData from '@/data/cities/hamburg.json';
import hannoverData from '@/data/cities/hannover.json';
import koelnData from '@/data/cities/koeln.json';
import leipzigData from '@/data/cities/leipzig.json';
import mannheimData from '@/data/cities/mannheim.json';
import muenchenData from '@/data/cities/muenchen.json';
import nuernbergData from '@/data/cities/nuernberg.json';
import stuttgartData from '@/data/cities/stuttgart.json';

// City data map for static generation
const cityDataMap: Record<string, CityData> = {
  berlin: berlinData as unknown as CityData,
  bremen: bremenData as unknown as CityData,
  dortmund: dortmundData as unknown as CityData,
  dresden: dresdenData as unknown as CityData,
  duesseldorf: duesseldorfData as unknown as CityData,
  essen: essenData as unknown as CityData,
  frankfurt: frankfurtData as unknown as CityData,
  hamburg: hamburgData as unknown as CityData,
  hannover: hannoverData as unknown as CityData,
  koeln: koelnData as unknown as CityData,
  leipzig: leipzigData as unknown as CityData,
  mannheim: mannheimData as unknown as CityData,
  muenchen: muenchenData as unknown as CityData,
  nuernberg: nuernbergData as unknown as CityData,
  stuttgart: stuttgartData as unknown as CityData,
};

/**
 * Get city data by slug
 * @param slug - City slug (e.g., 'koeln', 'duesseldorf')
 * @returns CityData or null if not found
 */
export function getCityData(slug: string): CityData | null {
  const cityData = cityDataMap[slug];
  
  if (!cityData) {
    return null;
  }

  // Validate required fields
  if (!cityData.city || !cityData.slug || !cityData.content) {
    console.error(`Invalid city data for slug: ${slug}`);
    return null;
  }

  return cityData;
}

/**
 * Get all available city slugs
 * @returns Array of available city slugs
 */
export function getAllCitySlugs(): string[] {
  return Object.keys(cityDataMap);
}

/**
 * Check if a city slug exists
 * @param slug - City slug to check
 * @returns true if slug exists, false otherwise
 */
export function isValidCitySlug(slug: string): boolean {
  return slug in cityDataMap;
}

