/**
 * Central Routes Configuration for Prerendering
 * 
 * This file contains all routes that should be prerendered for SEO.
 * When adding a new route, add it here and run `npm run build:prerender`.
 */

// Get city slugs dynamically from the cities data directory
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const citiesDir = join(rootDir, 'src', 'data', 'cities');

function getCitySlugs() {
  try {
    const files = readdirSync(citiesDir);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.error('Error reading city slugs:', error);
    return [];
  }
}

// Core routes that should always be prerendered
const CORE_ROUTES = [
  '/',
  '/blog/hauskauf-beratung',
];

// City routes (dynamically generated)
const CITY_SLUGS = getCitySlugs();
const CITY_ROUTES = CITY_SLUGS.map(slug => `/${slug}`);

// All routes to prerender
export const PRERENDERED_ROUTES = [
  ...CORE_ROUTES,
  ...CITY_ROUTES,
];

// Validation: Check for duplicates
const duplicates = PRERENDERED_ROUTES.filter(
  (route, index) => PRERENDERED_ROUTES.indexOf(route) !== index
);

if (duplicates.length > 0) {
  throw new Error(`Duplicate routes found: ${duplicates.join(', ')}`);
}

// Export city slugs for other uses
export { CITY_SLUGS };

// Export for CommonJS compatibility (for prerender.js)
export default PRERENDERED_ROUTES;

