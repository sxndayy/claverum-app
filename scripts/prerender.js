#!/usr/bin/env node

/**
 * Prerendering Script for Netlify
 * 
 * This script prerenders specific React Router routes to static HTML files
 * for better SEO and faster initial page loads.
 * 
 * Usage: node scripts/prerender.js
 */

import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, writeFileSync, readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');
const previewPort = 4173;

/**
 * Get all city slugs from the cities data directory
 * Excludes index.ts and reads all .json files
 */
function getCitySlugs() {
  const citiesDir = join(rootDir, 'src', 'data', 'cities');
  const files = readdirSync(citiesDir);
  
  return files
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
}

/**
 * Get all routes to prerender
 * Includes blog pages and all city pages
 * 
 * Note: Files are saved as /path/index.html for Netlify's pretty_urls feature
 * This allows Netlify to serve /path/ correctly without redirects overriding
 */
function getRoutesToPrerender() {
  const routes = [
    // Main page
    {
      path: '/',
      outputPath: 'index.html' // Already exists from build, but we'll overwrite with prerendered version
    },
    // Blog page
    {
      path: '/blog/hauskauf-beratung',
      outputPath: 'blog/hauskauf-beratung/index.html'
    }
  ];

  // Add all city pages
  const citySlugs = getCitySlugs();
  citySlugs.forEach(slug => {
    routes.push({
      path: `/${slug}`,
      outputPath: `${slug}/index.html`
    });
  });

  return routes;
}

// Routes to prerender
const routesToPrerender = getRoutesToPrerender();

/**
 * Wait for a condition to be true
 */
function waitFor(condition, timeout = 30000, interval = 100) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Timeout waiting for condition after ${timeout}ms`));
      } else {
        setTimeout(check, interval);
      }
    };
    check();
  });
}

/**
 * Start Vite preview server
 */
function startPreviewServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting Vite preview server...');
    
    const server = spawn('npm', ['run', 'preview'], {
      cwd: rootDir,
      stdio: 'pipe',
      shell: true
    });

    let serverReady = false;

    server.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Local:') || output.includes(`http://localhost:${previewPort}`)) {
        if (!serverReady) {
          serverReady = true;
          console.log('✅ Preview server started');
          resolve(server);
        }
      }
    });

    server.stderr.on('data', (data) => {
      const output = data.toString();
      if (output.includes('EADDRINUSE')) {
        console.log('⚠️  Port already in use, assuming server is running...');
        if (!serverReady) {
          serverReady = true;
          resolve(null); // Server might already be running
        }
      } else if (!output.includes('vite')) {
        console.error('Server error:', output);
      }
    });

    server.on('error', (error) => {
      reject(error);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!serverReady) {
        console.log('⚠️  Server might already be running, continuing...');
        resolve(null);
      }
    }, 30000);
  });
}

/**
 * Prerender a single route
 */
async function prerenderRoute(browser, route) {
  const { path, outputPath } = route;
  const url = `http://localhost:${previewPort}${path}`;
  
  console.log(`📄 Prerendering: ${path}...`);
  
  try {
    const page = await browser.newPage();
    
    // Set viewport for consistent rendering
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Navigate to the route
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    // Wait for React to hydrate and render
    await page.waitForTimeout(3000);
    
    // Wait for any lazy-loaded content and ensure page is fully rendered
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Wait for any dynamic content to load (images, fonts, etc.)
    await page.evaluate(() => {
      return new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', resolve);
        }
      });
    });
    
    // Additional wait to ensure all React components are rendered
    await page.waitForTimeout(1000);
    
    // Get the fully rendered HTML
    const html = await page.content();
    
    // Ensure output directory exists
    const outputDir = join(distDir, outputPath.split('/').slice(0, -1).join('/'));
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the prerendered HTML
    const fullOutputPath = join(distDir, outputPath);
    writeFileSync(fullOutputPath, html, 'utf8');
    
    console.log(`✅ Prerendered: ${path} → ${outputPath}`);
    
    await page.close();
  } catch (error) {
    console.error(`❌ Error prerendering ${path}:`, error.message);
    throw error;
  }
}

/**
 * Main prerendering function
 */
async function prerender() {
  console.log('🎯 Starting prerendering process...\n');
  
  let server = null;
  let browser = null;
  
  try {
    // Check if dist directory exists
    if (!existsSync(distDir)) {
      throw new Error(`Dist directory not found: ${distDir}. Run 'npm run build' first.`);
    }
    
    // Start preview server
    server = await startPreviewServer();
    
    // Wait a bit for server to be fully ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Launch browser
    console.log('🌐 Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
    
    console.log('✅ Browser launched\n');
    
    console.log(`📋 Found ${routesToPrerender.length} routes to prerender:\n`);
    routesToPrerender.forEach((route, index) => {
      console.log(`  ${index + 1}. ${route.path} → ${route.outputPath}`);
    });
    console.log('');
    
    // Prerender all routes
    let successCount = 0;
    let errorCount = 0;
    
    for (const route of routesToPrerender) {
      try {
        await prerenderRoute(browser, route);
        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to prerender ${route.path}:`, error.message);
        // Continue with next route instead of failing completely
      }
    }
    
    console.log(`\n✨ Prerendering complete!`);
    console.log(`   ✅ Success: ${successCount}`);
    if (errorCount > 0) {
      console.log(`   ❌ Errors: ${errorCount}`);
    }
    
  } catch (error) {
    console.error('\n❌ Prerendering failed:', error.message);
    process.exit(1);
  } finally {
    // Cleanup
    if (browser) {
      await browser.close();
      console.log('🔒 Browser closed');
    }
    
    if (server) {
      server.kill();
      console.log('🛑 Preview server stopped');
    }
  }
}

// Run prerendering
prerender().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

