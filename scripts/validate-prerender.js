#!/usr/bin/env node

/**
 * Validation Script for Prerendered HTML Files
 * 
 * This script validates that all prerendered HTML files are correct:
 * - No 404 content
 * - No noindex tags (except for /404 route)
 * - No canonical /404/ URLs
 * - Minimum content length
 * 
 * Usage: node scripts/validate-prerender.js
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { PRERENDERED_ROUTES } from '../config/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

/**
 * Validate a single HTML file
 */
function validateHTML(filePath, route) {
  if (!existsSync(filePath)) {
    return [`File not found: ${filePath}`];
  }

  const html = readFileSync(filePath, 'utf-8');
  const errors = [];

  // Check for noindex tag (should not be present except for /404 route)
  if (html.includes('noindex') && route !== '/404') {
    errors.push('Contains noindex meta tag');
  }

  // Check for 404 content
  if (html.includes('404') && 
      (html.includes('Seite nicht gefunden') || 
       html.includes('Oops! Seite nicht gefunden'))) {
    errors.push('Contains 404 content');
  }

  // Check for canonical /404/
  if (html.includes('canonical') && 
      (html.includes('/404') || html.includes('/404/')) && 
      route !== '/404') {
    errors.push('Canonical URL points to /404/');
  }

  // Check for NotFound component
  if (html.includes('data-testid="not-found"') && route !== '/404') {
    errors.push('Rendering NotFound component');
  }

  // Check minimum content length (should have actual content, not just shell)
  if (html.length < 1000) {
    errors.push(`HTML too short (< 1000 chars, actual: ${html.length})`);
  }

  // Blog-specific validation
  if (route === '/blog/hauskauf-beratung') {
    if (!html.includes('Hauskauf Beratung') && 
        !html.includes('hauskauf-beratung') && 
        !html.includes('BlogPosting')) {
      errors.push('Missing blog-specific content');
    }
  }

  // City page validation
  if (route.startsWith('/') && route !== '/' && !route.startsWith('/blog') && route !== '/404') {
    if (!html.includes('Bauschadensanalyse') && 
        !html.includes('Bauschadensbewertung') &&
        html.length < 5000) {
      errors.push(`Missing city-specific content (length: ${html.length})`);
    }
  }

  return errors;
}

/**
 * Main validation function
 */
function main() {
  console.log('=== VALIDIERUNG DER PRERENDERED HTML-DATEIEN ===\n');

  let hasErrors = false;
  const results = [];

  for (const route of PRERENDERED_ROUTES) {
    const outputPath = route === '/' 
      ? join(distDir, 'index.html')
      : join(distDir, route, 'index.html');

    const errors = validateHTML(outputPath, route);

    if (errors.length > 0) {
      console.error(`✗ FEHLER: ${route}`);
      errors.forEach(err => console.error(`  - ${err}`));
      hasErrors = true;
      results.push({ route, success: false, errors });
    } else {
      console.log(`✓ OK: ${route}`);
      results.push({ route, success: true });
    }
  }

  console.log('\n=== ZUSAMMENFASSUNG ===');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✓ Erfolgreich: ${successful}`);
  console.log(`✗ Fehlgeschlagen: ${failed}`);

  if (hasErrors) {
    console.error('\n✗ Validierung fehlgeschlagen!');
    process.exit(1);
  }

  console.log('\n✓ Alle HTML-Dateien sind valide!');
}

main();

