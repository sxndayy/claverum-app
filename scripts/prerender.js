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
import { spawn, execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { PRERENDERED_ROUTES } from '../config/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');
const previewPort = 4173;

/**
 * Convert route paths to prerender configuration
 * Files are saved as /path/index.html for Netlify's pretty_urls feature
 */
function getRoutesToPrerender() {
  return PRERENDERED_ROUTES.map(route => ({
    path: route,
    outputPath: route === '/' 
      ? 'index.html' 
      : `${route}/index.html`
  }));
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
        resolve(null);
      }
    }, 30000);
  });
}

/**
 * Validate that the rendered page is correct (not a 404 page)
 */
async function validateRenderedPage(page, path) {
  // CRITICAL: Check if React Router recognized the route correctly
  const actualPath = await page.evaluate(() => window.location.pathname);
  if (actualPath !== path) {
    throw new Error(`Route mismatch: Expected ${path}, but React Router rendered ${actualPath}. This indicates React Router did not recognize the route correctly.`);
  }
  
  const pageContent = await page.content();
  const pageTitle = await page.title();
  
  // Check for NotFound component (using data-testid)
  const hasNotFoundComponent = await page.evaluate(() => {
    return document.querySelector('[data-testid="not-found"]') !== null;
  });
  
  if (hasNotFoundComponent) {
    throw new Error(`Page ${path} is rendering NotFound component instead of expected content`);
  }
  
  // Check for 404 indicators
  const is404 = pageContent.includes('404') && 
                (pageContent.includes('Seite nicht gefunden') || 
                 pageContent.includes('Oops! Seite nicht gefunden') ||
                 pageTitle.includes('404'));
  
  if (is404) {
    throw new Error(`Page rendered as 404: ${path}. Actual pathname: ${actualPath}`);
  }
  
  // Check for noindex tag (should not be present except for /404 route)
  const hasNoindex = await page.evaluate(() => {
    const metaRobots = document.querySelector('meta[name="robots"]');
    return metaRobots && metaRobots.getAttribute('content')?.includes('noindex');
  });
  
  if (hasNoindex && path !== '/404') {
    throw new Error(`Page ${path} contains noindex tag - this will prevent indexing`);
  }
  
  // Check for canonical /404/ (should not be present)
  const has404Canonical = await page.evaluate(() => {
    const canonical = document.querySelector('link[rel="canonical"]');
    return canonical && (canonical.getAttribute('href')?.includes('/404') || canonical.getAttribute('href')?.includes('/404/'));
  });
  
  if (has404Canonical && path !== '/404') {
    throw new Error(`Page has canonical /404/: ${path} - this will prevent indexing`);
  }
  
  // Blog-specific validation
  if (path === '/blog/hauskauf-beratung') {
    // Check for blog-specific content
    const hasBlogContent = pageContent.includes('Hauskauf Beratung') || 
                          pageContent.includes('hauskauf-beratung') ||
                          pageContent.includes('BlogPosting');
    if (!hasBlogContent) {
      throw new Error(`Blog page ${path} does not contain expected blog content. Page title: ${pageTitle}`);
    }
    
    // Check for correct canonical URL
    const hasCorrectCanonical = await page.evaluate(() => {
      const canonical = document.querySelector('link[rel="canonical"]');
      return canonical && 
             canonical.getAttribute('href')?.includes('/blog/hauskauf-beratung') &&
             !canonical.getAttribute('href')?.includes('/404');
    });
    
    if (!hasCorrectCanonical) {
      throw new Error(`Blog page ${path} does not have correct canonical URL`);
    }
  }
  
  // City page validation
  if (path.startsWith('/') && path !== '/' && !path.startsWith('/blog') && path !== '/404') {
    // Check for city-specific content (should have city name or Bauschadensanalyse)
    const hasCityContent = pageContent.includes('Bauschadensanalyse') || 
                          pageContent.includes('Bauschadensbewertung') ||
                          pageContent.length > 5000; // Reasonable content length
    if (!hasCityContent) {
      throw new Error(`City page ${path} does not contain expected content. Page title: ${pageTitle}, Content length: ${pageContent.length}`);
    }
  }
  
  return true;
}

/**
 * Helper function to wait (replacement for deprecated page.waitForTimeout)
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Ensure Chrome is installed for Puppeteer
 * This is needed for Netlify builds where Chrome might not be pre-installed
 */
async function ensureChromeInstalled() {
  try {
    // Try to launch Puppeteer with default config to check if Chrome exists
    const testBrowser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    await testBrowser.close();
    return true;
  } catch (error) {
    if (error.message.includes('Could not find Chrome') || error.message.includes('Chrome')) {
      console.log('⚠️  Chrome not found, installing...');
      try {
        // Install Chrome using Puppeteer's browser installation
        execSync('npx puppeteer browsers install chrome', {
          stdio: 'inherit',
          cwd: rootDir
        });
        console.log('✅ Chrome installed successfully');
        return true;
      } catch (installError) {
        console.error('❌ Failed to install Chrome:', installError.message);
        throw new Error('Chrome installation failed. Prerendering cannot continue.');
      }
    }
    throw error;
  }
}

/**
 * Wait for React to fully render and React Router to recognize the route
 */
async function waitForReactRender(page, expectedPath, timeout = 20000) {
  try {
    // Wait for React root element
    await page.waitForSelector('#root', { timeout });
    
    // Wait for React Router to recognize the route correctly
    await page.waitForFunction(
      (path) => {
        // Check if React Router has recognized the route
        return window.location.pathname === path;
      },
      { timeout },
      expectedPath
    );
    
    // Wait for React to hydrate - check if React has rendered content
    await page.waitForFunction(
      () => {
        const root = document.getElementById('root');
        return root && root.children.length > 0 && root.innerHTML.trim().length > 100;
      },
      { timeout }
    );
    
    // Additional wait for any lazy-loaded components (Suspense boundaries)
    await delay(3000);
    
    // Verify route is still correct after lazy loading
    const actualPath = await page.evaluate(() => window.location.pathname);
    if (actualPath !== expectedPath) {
      throw new Error(`Route changed after render: Expected ${expectedPath}, got ${actualPath}`);
    }
  } catch (error) {
    const actualPath = await page.evaluate(() => window.location.pathname);
    throw new Error(`React render check failed for ${expectedPath}. Actual pathname: ${actualPath}. Error: ${error.message}`);
  }
}

/**
 * Prerender a single route with retry logic
 */
async function prerenderRoute(browser, route, retries = 2) {
  const { path, outputPath } = route;
  const url = `http://localhost:${previewPort}${path}`;
  
  console.log(`📄 Prerendering: ${path}...`);
  
  let lastError = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      console.log(`   🔄 Retry attempt ${attempt}/${retries} for ${path}...`);
      await delay(2000); // Wait before retry
    }
    
    try {
      const page = await browser.newPage();
      
      // Set viewport for consistent rendering
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Set prerendering flag before navigation
      await page.evaluateOnNewDocument(() => {
        window.__PRERENDER__ = true;
      });
      
      // Navigate to the route
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 60000
      });

      // Wait for React Router to recognize the route and React to hydrate
      await waitForReactRender(page, path, 20000);
      
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
      await delay(3000);
      
      // Validate that the page is correctly rendered (not 404)
      await validateRenderedPage(page, path);
      
      // Get the fully rendered HTML
      const html = await page.content();
      
      // Ensure output directory exists
      const outputDir = join(distDir, outputPath.split('/').slice(0, -1).join('/'));
      if (outputDir !== distDir && !existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }
      
      // Write the prerendered HTML
      const fullOutputPath = join(distDir, outputPath);
      writeFileSync(fullOutputPath, html, 'utf8');
      
      console.log(`✅ Prerendered: ${path} → ${outputPath}`);
      
      await page.close();
      return; // Success, exit retry loop
      } catch (error) {
        lastError = error;
        if (attempt < retries) {
          console.error(`   ⚠️  Attempt ${attempt + 1} failed, retrying...`);
        }
        // Continue to next attempt
      }
  }
  
  // All retries failed
  throw new Error(`Failed to prerender ${path} after ${retries + 1} attempts: ${lastError.message}`);
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
    await delay(2000);
    
    // Ensure Chrome is installed (needed for Netlify builds)
    await ensureChromeInstalled();
    
    // Launch browser
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
    
    console.log(`📋 Prerendering ${routesToPrerender.length} routes...\n`);
    
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
      console.log(`\n⚠️  Warning: Some routes failed to prerender. The build will continue, but these routes may not be indexed correctly.`);
      // Don't exit with error code - let the build continue
      // This allows Netlify to deploy even if some routes fail
    }
    
    // Exit with error only if ALL routes failed
    if (successCount === 0 && routesToPrerender.length > 0) {
      console.error('\n❌ All routes failed to prerender. This is a critical error.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ Prerendering failed:', error.message);
    // Only exit with error if it's a critical failure (e.g., server won't start)
    // Individual route failures are handled above
    process.exit(1);
  } finally {
    // Cleanup
    if (browser) {
      await browser.close();
      console.log('🔒 Browser closed');
    }
    
    if (server) {
      console.log('🛑 Stopping preview server...');
      // Kill the server process and all its children
      try {
        if (process.platform === 'win32') {
          // Windows: use taskkill
          execSync(`taskkill /F /T /PID ${server.pid}`, { stdio: 'ignore' });
        } else {
          // Unix: kill process group
          process.kill(-server.pid, 'SIGTERM');
          // Give it a moment to gracefully shut down
          await delay(1000);
          // Force kill if still running
          try {
            process.kill(-server.pid, 'SIGKILL');
          } catch (e) {
            // Process already dead, ignore
          }
        }
        console.log('✅ Preview server stopped');
      } catch (error) {
        console.warn('⚠️  Warning: Could not stop preview server:', error.message);
        // Try alternative method
        try {
          server.kill('SIGTERM');
          await delay(1000);
          server.kill('SIGKILL');
        } catch (e) {
          // Ignore
        }
      }
    }
    
    // Ensure script exits
    console.log('✅ Prerendering script completed');
  }
}

// Run prerendering
prerender()
  .then(() => {
    // Ensure process exits cleanly
    console.log('✅ All done, exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

