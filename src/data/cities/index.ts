// City registry with lazy loading
import { CityData } from '@/types/city';

// Static imports for synchronous loading (for prerendering)
// Note: Vite imports JSON files as ES modules, default export contains the JSON object
import koelnData from './koeln.json';
import duesseldorfData from './duesseldorf.json';
import dortmundData from './dortmund.json';
import essenData from './essen.json';
import frankfurtData from './frankfurt.json';
import stuttgartData from './stuttgart.json';
import nuernbergData from './nuernberg.json';
import leipzigData from './leipzig.json';
import dresdenData from './dresden.json';
import hannoverData from './hannover.json';
import bremenData from './bremen.json';
import mannheimData from './mannheim.json';

// Synchronous city data map (for prerendering)
const cityDataMap: Record<string, CityData> = {
  koeln: koelnData as unknown as CityData,
  duesseldorf: duesseldorfData as unknown as CityData,
  dortmund: dortmundData as unknown as CityData,
  essen: essenData as unknown as CityData,
  frankfurt: frankfurtData as unknown as CityData,
  stuttgart: stuttgartData as unknown as CityData,
  nuernberg: nuernbergData as unknown as CityData,
  leipzig: leipzigData as unknown as CityData,
  dresden: dresdenData as unknown as CityData,
  hannover: hannoverData as unknown as CityData,
  bremen: bremenData as unknown as CityData,
  mannheim: mannheimData as unknown as CityData,
};

// City data imports - lazy loaded (kept for backward compatibility)
// Note: Vite imports JSON files as ES modules, default export contains the JSON object
const cityDataModules: Record<string, () => Promise<{ default: CityData }>> = {
  koeln: () => import('./koeln.json').then(m => ({ default: m as unknown as CityData })),
  duesseldorf: () => import('./duesseldorf.json').then(m => ({ default: m as unknown as CityData })),
  dortmund: () => import('./dortmund.json').then(m => ({ default: m as unknown as CityData })),
  essen: () => import('./essen.json').then(m => ({ default: m as unknown as CityData })),
  frankfurt: () => import('./frankfurt.json').then(m => ({ default: m as unknown as CityData })),
  stuttgart: () => import('./stuttgart.json').then(m => ({ default: m as unknown as CityData })),
  nuernberg: () => import('./nuernberg.json').then(m => ({ default: m as unknown as CityData })),
  leipzig: () => import('./leipzig.json').then(m => ({ default: m as unknown as CityData })),
  dresden: () => import('./dresden.json').then(m => ({ default: m as unknown as CityData })),
  hannover: () => import('./hannover.json').then(m => ({ default: m as unknown as CityData })),
  bremen: () => import('./bremen.json').then(m => ({ default: m as unknown as CityData })),
  mannheim: () => import('./mannheim.json').then(m => ({ default: m as unknown as CityData })),
};

// Cache for loaded city data
const cityDataCache: Record<string, CityData> = {};

/**
 * Get city data by slug (synchronous version for prerendering)
 * @param slug - City slug (e.g., 'koeln', 'duesseldorf')
 * @returns CityData or null if not found
 */
export function getCityDataSync(slug: string): CityData | null {
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
 * Get city data by slug (async version for backward compatibility)
 * @param slug - City slug (e.g., 'koeln', 'duesseldorf')
 * @returns Promise resolving to CityData or null if not found
 */
export async function getCityData(slug: string): Promise<CityData | null> {
  // Check cache first
  if (cityDataCache[slug]) {
    return cityDataCache[slug];
  }

  // Try synchronous version first (for prerendering)
  const syncData = getCityDataSync(slug);
  if (syncData) {
    cityDataCache[slug] = syncData;
    return syncData;
  }

  // Check if slug exists in registry
  const loader = cityDataModules[slug];
  if (!loader) {
    return null;
  }

  try {
    // Load city data
    const module = await loader();
    const cityData = module.default;
    
    // Validate required fields
    if (!cityData.city || !cityData.slug || !cityData.content) {
      throw new Error(`Invalid city data for slug: ${slug}`);
    }

    // Cache the data
    cityDataCache[slug] = cityData;
    
    return cityData;
  } catch (error) {
    console.error(`Error loading city data for slug "${slug}":`, error);
    return null;
  }
}

/**
 * Check if a city slug exists in the registry
 * @param slug - City slug to check
 * @returns true if slug exists, false otherwise
 */
export function isValidCitySlug(slug: string): boolean {
  return slug in cityDataMap || slug in cityDataModules;
}

/**
 * Get all available city slugs
 * @returns Array of available city slugs
 */
export function getAvailableCitySlugs(): string[] {
  return Object.keys(cityDataMap);
}

/**
 * Get all available city slugs (alias for getAvailableCitySlugs)
 * @returns Array of available city slugs
 */
export function getAllCitySlugs(): string[] {
  return getAvailableCitySlugs();
}

