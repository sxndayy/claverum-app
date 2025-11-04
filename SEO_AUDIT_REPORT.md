# Comprehensive SEO Audit Report
## Bauklar.org - Bauschadensanalyse Website

**Date:** 2024-12-19  
**Framework:** React + Vite (SPA)  
**Language:** German (de)

---

## Executive Summary

This React/Vite Single Page Application (SPA) has several critical SEO issues that significantly impact search engine visibility. The main concerns are:

1. **Client-side rendering only** - All content is rendered client-side, making it invisible to search engines that don't execute JavaScript
2. **Missing dynamic meta tags** - All meta tags are static in `index.html`, not updated per page
3. **Missing H1 tags on key pages** - Evaluation and Success pages lack H1 headings
4. **Incomplete sitemap** - Missing legal pages (Impressum, AGB, Datenschutz, Widerruf)
5. **Non-descriptive image alt text** - Some images use generic alt text

---

## Part 1: Detailed SEO Issues Report

### CRITICAL Issues (Must Fix)

#### 1. Missing H1 Tags on Key Pages

**Files affected:**
- `/src/pages/Evaluation.tsx` - No H1 tag found
- `/src/pages/Success.tsx` - No H1 tag found (uses CardTitle instead)

**Current implementation:**

```12:29:src/pages/Evaluation.tsx
  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Gradient - same as HeroSection */}
      <div className="absolute inset-0 hero-gradient opacity-30 min-h-full"></div>
      <Header />
      <main className="pt-20 relative z-10">
        <div className="container mx-auto px-4 py-8">
          <MultiStepForm />
        </div>
      </main>
```

```19:21:src/pages/Success.tsx
            <CardTitle className="text-2xl font-bold text-text-100 mb-2">
              Auftrag erfolgreich übermittelt!
            </CardTitle>
```

**Impact:** Search engines cannot determine the main topic of these pages. H1 tags are critical for SEO as they signal the primary content focus.

**Severity:** CRITICAL

---

#### 2. Static Meta Tags - No Per-Page Dynamic Meta Tags

**Files affected:**
- `/index.html` - Contains only static meta tags
- All page components (`Index.tsx`, `Impressum.tsx`, `AGB.tsx`, `Datenschutz.tsx`, `Widerruf.tsx`, `Evaluation.tsx`, `Success.tsx`)

**Current implementation:**

```1:29:index.html
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bauklar.org - Unabhängige Bauschadensanalyse</title>
    <link rel="icon" type="image/png" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="32x32" href="/logo-final.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/logo-final.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/logo-final.png" />
    <meta name="description" content="Lassen Sie Ihr Wunschobjekt per KI prüfen. Upload in Minuten, Ergebnis bis nächster Werktag. DSGVO-konform, transparent, zuverlässig." />
    <meta name="author" content="Claverum" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <meta property="og:title" content="Bauklar.org - Unabhängige Bauschadensanalyse" />
    <meta property="og:description" content="Professionelle Immobilienbewertung mit künstlicher Intelligenz. Ergebnis in 24 Stunden." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://claverum.de" />
    <meta property="og:image" content="/og-image.png" />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Bauklar.org - Unabhängige Bauschadensanalyse" />
    <meta name="twitter:description" content="Professionelle Immobilienbewertung mit künstlicher Intelligenz. Ergebnis in 24 Stunden." />
    <meta name="twitter:image" content="/og-image.png" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://claverum.de/" />
```

**Impact:** 
- All pages share the same title and description, which is poor for SEO
- Search engines cannot distinguish between different pages
- Social media shares will show incorrect information for non-homepage pages
- Missing unique meta descriptions for legal pages (Impressum, AGB, Datenschutz, Widerruf)

**Severity:** CRITICAL

---

#### 3. Client-Side Rendering Only - Content Not Indexable

**Files affected:**
- All React components and pages
- `/src/main.tsx` - Client-side hydration only

**Current implementation:**

```6:10:src/main.tsx
createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
```

**Impact:** 
- Search engine crawlers that don't execute JavaScript cannot see the content
- All content is loaded via JavaScript after page load
- Google may index content, but with delays and potential missed content
- Initial HTML response contains no meaningful content (just `<div id="root"></div>`)

**Severity:** CRITICAL

**Note:** While Google can render JavaScript, the initial HTML contains minimal content, which can negatively impact SEO and crawl efficiency.

---

#### 4. Missing Canonical URLs for Individual Pages

**Files affected:**
- All page components (except homepage)

**Current implementation:**
- Only homepage has canonical URL in `index.html`
- Other pages have no canonical tags

**Impact:** 
- Risk of duplicate content issues
- Missing self-referencing canonicals for legal pages and other routes
- No proper canonical handling for `/evaluation` and `/success` pages

**Severity:** CRITICAL

---

#### 5. Incomplete XML Sitemap

**File:** `/public/sitemap.xml`

**Current implementation:**

```1:21:public/sitemap.xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://baucheck-ki.de/</loc>
    <lastmod>2024-10-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://baucheck-ki.de/evaluation</loc>
    <lastmod>2024-10-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://baucheck-ki.de/success</loc>
    <lastmod>2024-10-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
```

**Missing pages:**
- `/impressum` (required by German law)
- `/agb` (Terms and Conditions)
- `/datenschutz` (Privacy Policy - required by GDPR)
- `/widerruf` (Cancellation Policy)

**Impact:** 
- Legal pages not discoverable by search engines
- Potential compliance issues
- Missing important pages from sitemap

**Severity:** CRITICAL

**Note:** Domain inconsistency detected - sitemap uses `baucheck-ki.de` while meta tags use `claverum.de`

---

### HIGH Priority Issues

#### 6. Non-Descriptive Image Alt Text

**Files affected:**
- `/src/components/AdminOrderDetail.tsx` - Generic alt text
- `/src/components/AreaUpload.tsx` - Generic alt text

**Current implementation:**

```441:448:src/components/AdminOrderDetail.tsx
                              <img
                                src={getPublicImageUrl(upload)}
                                alt={`${area} photo`}
                                className="w-full h-32 object-cover rounded-lg border"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                                }}
                              />
```

```179:179:src/components/AreaUpload.tsx
                <img src={url} alt={`Uploaded ${index + 1}`} className="object-cover w-full h-full" />
```

**Impact:** 
- Poor accessibility
- Missed SEO opportunity for image search
- Generic alt text doesn't describe the image content

**Severity:** HIGH

**Good example found:**

```23:26:src/components/AboutSection.tsx
                <img 
                  src="/Johannes-foto.jpeg" 
                  alt="Dr. Johannes Stankiewicz" 
                  className="w-full h-full object-cover rounded-full"
```

---

#### 7. Domain Inconsistencies

**Files affected:**
- `/index.html` - Uses `claverum.de`
- `/public/sitemap.xml` - Uses `baucheck-ki.de`
- `/public/robots.txt` - References `baucheck-ki.de`

**Current implementation:**

```20:20:index.html
    <meta property="og:url" content="https://claverum.de" />
```

```4:4:public/robots.txt
Sitemap: https://baucheck-ki.de/sitemap.xml
```

**Impact:** 
- Inconsistent canonical URLs
- Confusion for search engines
- Potential indexing issues

**Severity:** HIGH

---

#### 8. Missing Structured Data for Individual Pages

**Files affected:**
- All page components

**Current implementation:**
- Only Organization schema in `index.html`
- No structured data for:
  - Service pages (Service schema)
  - FAQ pages (FAQPage schema)
  - Legal pages (WebPage schema)

**Impact:** 
- Missing rich snippets opportunities
- No FAQ rich results for FAQSection
- No service schema markup for main service offering

**Severity:** HIGH

---

### MEDIUM Priority Issues

#### 9. Heading Hierarchy Issues ✅ FIXED

**Files affected:**
- `/src/components/Footer.tsx` - ✅ Fixed: Changed H3/H4 to H2 for better semantic structure

**Current implementation:**

```18:37:src/components/Footer.tsx
            <h3 className="text-xl font-bold text-black">Bauklar.org</h3>
            {/* ... */}
            <h4 className="font-semibold text-black">Leistungen</h4>
            {/* ... */}
            <h4 className="font-semibold text-black">Navigation</h4>
```

**Impact:** 
- Heading hierarchy not properly nested within page context
- Footer headings should be H3/H4 but need proper parent H2 or be in a `<footer>` section

**Severity:** MEDIUM

**Note:** While heading structure within components is generally good (H2 under H1, H3 under H2), footer headings need better semantic structure.

---

#### 10. Missing robots Meta Tags on Dynamic/Admin Pages

**Files affected:**
- `/src/pages/Admin.tsx`
- `/src/pages/AdminLogin.tsx`
- `/src/pages/Success.tsx` (may contain dynamic order data)

**Impact:** 
- Admin pages should have `noindex` meta tag
- Success pages with dynamic content may benefit from `noindex, nofollow`

**Severity:** MEDIUM

---

#### 11. Missing Language Attributes in Dynamic Content

**Current implementation:**
- `index.html` has `<html lang="de">` which is good
- However, dynamic content loaded client-side may not maintain language context

**Impact:** Minor - main language tag is present

**Severity:** MEDIUM

---

## Part 2: Developer Fix Implementation Guide

### Task 1: Add H1 Tags to Missing Pages ✅ COMPLETED

**Priority:** CRITICAL

**Files modified:**
- `/src/pages/Evaluation.tsx` ✅
- `/src/pages/Success.tsx` ✅

**Status:** H1 tags have been successfully added to both pages.

#### Implementation for Evaluation.tsx:

```typescript
// Current (WRONG):
<main className="pt-20 relative z-10">
  <div className="container mx-auto px-4 py-8">
    <MultiStepForm />
  </div>
</main>

// Fixed:
<main className="pt-20 relative z-10">
  <div className="container mx-auto px-4 py-8">
    <h1 className="sr-only">Bauschadensbewertung starten</h1>
    <MultiStepForm />
  </div>
</main>
```

**OR** if MultiStepForm should have visible H1, add it there.

#### Implementation for Success.tsx:

```typescript
// Current (WRONG):
<CardTitle className="text-2xl font-bold text-text-100 mb-2">
  Auftrag erfolgreich übermittelt!
</CardTitle>

// Fixed:
<h1 className="text-2xl font-bold text-text-100 mb-2">
  Auftrag erfolgreich übermittelt!
</h1>
```

---

### Task 2: Implement Dynamic Meta Tags ✅ COMPLETED

**Priority:** CRITICAL

**Status:** 
- ✅ react-helmet-async installed
- ✅ SEO component created with correct domain (bauklar.org)
- ✅ HelmetProvider added to main.tsx
- ✅ SEO component added to all pages:
  - Index.tsx ✅
  - Evaluation.tsx ✅
  - Success.tsx ✅ (with noindex)
  - Impressum.tsx ✅
  - AGB.tsx ✅
  - Datenschutz.tsx ✅
  - Widerruf.tsx ✅
  - Admin.tsx ✅ (with noindex)
  - AdminLogin.tsx ✅ (with noindex)

Since this is a Vite React SPA (not Next.js), implement meta tag management using `react-helmet-async` or direct DOM manipulation.

#### Step 1: Install react-helmet-async

```bash
npm install react-helmet-async
```

#### Step 2: Create SEO Component

Create `/src/components/SEO.tsx`:

```typescript
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
}

export function SEO({ 
  title, 
  description, 
  canonical, 
  ogImage = '/og-image.png',
  ogType = 'website',
  noindex = false
}: SEOProps) {
  const siteName = 'Bauklar.org';
  const siteUrl = 'https://baucheck-ki.de'; // Fix domain consistency
  const fullTitle = `${title} | ${siteName}`;
  const canonicalUrl = canonical || `${siteUrl}${window.location.pathname}`;
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}
```

#### Step 3: Update main.tsx to include HelmetProvider

```typescript
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </HelmetProvider>
);
```

#### Step 4: Add SEO to each page

**Example for Impressum.tsx:**

```typescript
import { SEO } from '@/components/SEO';

const Impressum = () => {
  return (
    <>
      <SEO 
        title="Impressum" 
        description="Impressum und rechtliche Angaben der Claverum GmbH. Kontaktinformationen, Registereintrag und Verantwortlichkeiten."
        canonical="/impressum"
      />
      {/* ... rest of component */}
    </>
  );
};
```

**Example for Evaluation.tsx:**

```typescript
import { SEO } from '@/components/SEO';

const Evaluation = () => {
  return (
    <>
      <SEO 
        title="Bauschadensbewertung starten" 
        description="Starte jetzt deine professionelle Bauschadensbewertung. Lade Fotos hoch und erhalte innerhalb von 48 Stunden ein detailliertes Gutachten."
        canonical="/evaluation"
      />
      {/* ... rest of component */}
    </>
  );
};
```

---

### Task 3: Fix Sitemap ✅ COMPLETED

**Priority:** CRITICAL

**Status:**
- ✅ Sitemap updated with correct domain (bauklar.org)
- ✅ All legal pages added (Impressum, AGB, Datenschutz, Widerruf)
- ✅ Success page excluded (has noindex)
- ✅ robots.txt updated with correct domain
- ✅ index.html updated with correct domain and company name (Claverium)
- ✅ Domain consistency fixed across all files

**Files modified:**
- `/public/sitemap.xml` ✅
- `/public/robots.txt` ✅
- `/index.html` ✅

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://baucheck-ki.de/</loc>
    <lastmod>2024-12-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://baucheck-ki.de/evaluation</loc>
    <lastmod>2024-12-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://baucheck-ki.de/impressum</loc>
    <lastmod>2024-12-19</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://baucheck-ki.de/agb</loc>
    <lastmod>2024-12-19</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://baucheck-ki.de/datenschutz</loc>
    <lastmod>2024-12-19</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://baucheck-ki.de/widerruf</loc>
    <lastmod>2024-12-19</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <!-- Success page should probably be excluded or set to noindex -->
</urlset>
```

**Note:** Consider generating sitemap dynamically or using a build tool to keep it updated.

---

### Task 4: Fix Image Alt Text ✅ COMPLETED

**Priority:** HIGH

**Status:**
- ✅ AdminOrderDetail.tsx: Improved alt text with descriptive area names
- ✅ AreaUpload.tsx: Improved alt text with area name and file name
- ✅ Added area name mapping for better German descriptions

**Files modified:**
- `/src/components/AdminOrderDetail.tsx` ✅
- `/src/components/AreaUpload.tsx` ✅

#### For AdminOrderDetail.tsx:

```typescript
// Current (BAD):
alt={`${area} photo`}

// Fixed:
alt={`${area} area building photo showing ${upload.area || 'property details'}`}
```

#### For AreaUpload.tsx:

```typescript
// Current (BAD):
alt={`Uploaded ${index + 1}`}

// Fixed:
alt={`${areaName} area photo ${index + 1} - ${file.name || 'building image'}`}
```

**Better approach:** Store descriptive alt text when uploading or use area-specific descriptions:

```typescript
const areaNames: Record<string, string> = {
  keller: 'Keller',
  elektro: 'Elektroinstallation',
  heizung: 'Heizung',
  fassade: 'Fassade',
  dach: 'Dach',
  innenraeume: 'Innenräume'
};

// Then use:
alt={`${areaNames[area] || area} - Foto ${index + 1}`}
```

---

### Task 5: Fix Domain Consistency

**Priority:** HIGH

**Decision needed:** Which is the correct domain?
- `baucheck-ki.de` (used in sitemap/robots.txt)
- `claverum.de` (used in meta tags)

**Action:** Standardize on one domain across all files:

1. Update `index.html` meta tags to use correct domain
2. Update canonical URLs
3. Update all references

---

### Task 6: Add Structured Data ✅ COMPLETED

**Priority:** HIGH

**Status:**
- ✅ FAQPage Schema created and added to FAQSection
- ✅ Service Schema created and added to ServicesSection
- ✅ Both schemas use correct domain (bauklar.org) and company name (Claverium)

**Files created:**
- `/src/components/FAQSchema.tsx` ✅
- `/src/components/ServiceSchema.tsx` ✅

**Files modified:**
- `/src/components/FAQSection.tsx` ✅
- `/src/components/ServicesSection.tsx` ✅

#### Add FAQPage Schema to FAQSection

Create `/src/components/FAQSchema.tsx`:

```typescript
export function FAQSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}
```

#### Add Service Schema to ServicesSection

```typescript
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Bauschadensbewertung",
  "description": "Professionelle Bauschadensbewertung mit KI-gestützter Analyse",
  "provider": {
    "@type": "Organization",
    "name": "Claverum GmbH",
    "url": "https://baucheck-ki.de"
  },
  "areaServed": "DE",
  "serviceType": "Bauschadensanalyse"
};
```

---

### Task 7: Add robots Meta Tags to Admin Pages ✅ COMPLETED

**Priority:** MEDIUM

**Status:**
- ✅ Admin.tsx already has noindex meta tag
- ✅ AdminLogin.tsx already has noindex meta tag

**Files:**
- `/src/pages/Admin.tsx` ✅
- `/src/pages/AdminLogin.tsx` ✅

**Note:** Both admin pages were already updated in Task 2 with noindex meta tags.

---

### Task 9: Improve Footer Heading Hierarchy ✅ COMPLETED

**Priority:** MEDIUM

**Status:**
- ✅ Footer headings changed from H3/H4 to H2 for better semantic structure
- ✅ Company name updated to Claverium GmbH
- ✅ Brand name updated to Bauklar.org

**Files modified:**
- `/src/components/Footer.tsx` ✅

---

## Testing Checklist

### Pre-Implementation Testing

- [ ] View page source for each page - verify content is in initial HTML
- [ ] Disable JavaScript in browser - verify pages still show content (may not work for SPA)
- [ ] Check Google Search Console for crawl errors
- [ ] Verify sitemap is accessible at `/sitemap.xml`
- [ ] Check robots.txt is accessible at `/robots.txt`

### Post-Implementation Testing

- [ ] View page source - ensure H1 tags are present
- [ ] Check meta tags using browser dev tools
- [ ] Use SEO browser extensions (MozBar, SEOquake) to verify meta tags
- [ ] Validate with Google Rich Results Test for structured data
- [ ] Check heading hierarchy with HeadingsMap browser extension
- [ ] Verify all meta tags are present and correct length:
  - Title: 50-60 characters
  - Description: 150-160 characters
- [ ] Test canonical URLs on all page types
- [ ] Validate structured data with Schema.org validator
- [ ] Run Google PageSpeed Insights for Core Web Vitals
- [ ] Check XML sitemap is accessible and valid
- [ ] Test image loading and alt text presence
- [ ] Verify internal links work and use descriptive anchor text
- [ ] Check robots.txt is not blocking important pages
- [ ] Test different page types (home, legal, evaluation, success)
- [ ] Verify 404 page returns proper status code
- [ ] Check for duplicate content issues
- [ ] Test mobile responsiveness

---

## Common Pitfalls to Avoid

1. **Don't rely on client-side routing for SEO-critical pages** - Consider SSR or pre-rendering for important pages
2. **Avoid hiding content behind user interactions** - All important content should be visible without JS
3. **Don't use JavaScript to inject important meta tags** - Use `react-helmet-async` which updates `<head>` properly
4. **Avoid generic or duplicate title/descriptions** - Each page needs unique, descriptive meta tags
5. **Don't skip heading levels for styling purposes** - Use CSS classes for styling, not heading tags
6. **Avoid query parameters for main navigation** - Use clean URLs
7. **Don't forget fallback values for dynamic content** - Always provide defaults
8. **Avoid blocking search engines in robots.txt during development** - Keep it open unless absolutely necessary
9. **Don't use placeholder alt text like "image" or "photo"** - Make alt text descriptive
10. **Avoid orphaned pages with no internal links** - Ensure all pages are linked

---

## Recommendations for Vite/React SPA

Since this is a Vite React SPA, consider:

1. **Pre-rendering:** Use `vite-plugin-ssr` or `vite-plugin-ssg` to pre-render static pages
2. **Meta tag management:** Use `react-helmet-async` (as shown above)
3. **Sitemap generation:** Use `vite-plugin-sitemap` to auto-generate sitemap
4. **Consider migration:** For better SEO, consider migrating to Next.js with SSR, or implement pre-rendering

---

## Priority Summary

1. **CRITICAL (Fix Immediately):**
   - Add H1 tags to Evaluation and Success pages
   - Implement dynamic meta tags for all pages
   - Fix sitemap to include all pages
   - Fix domain consistency

2. **HIGH (Fix Soon):**
   - Improve image alt text
   - Add structured data (FAQ, Service schemas)
   - Fix canonical URLs

3. **MEDIUM (Fix When Possible):**
   - Add robots meta tags to admin pages
   - Improve heading hierarchy in footer
   - Consider SSR/pre-rendering for better SEO

---

**End of Report**

