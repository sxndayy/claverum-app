# 🏗️ BAUKLAR.ORG - Projekt Context

## 📋 Projekt-Übersicht

**Projekt:** Bauklar.org - Professionelle Bauschadensbewertung  
**Frontend:** Next.js Static Site (Netlify)  
**Backend:** Express.js API (Railway)  
**Status:** Production Ready ✅

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14.2.0 (App Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 3.4.x
- **UI Components:** Radix UI (Accordion, Label, Scroll Area, Toast, Progress, Select)
- **Icons:** Lucide React
- **Build:** Static HTML Export (`output: 'export'`)

### Backend
- **Framework:** Express.js
- **Database:** Neon PostgreSQL
- **Storage:** AWS S3 / Cloudflare R2
- **Payments:** Stripe
- **Email:** Resend
- **Deployment:** Railway

---

## 🏛️ Architektur

### Frontend/Backend Trennung

```
┌─────────────────────────────────────┐
│   FRONTEND (Next.js Static)         │
│   Deployed: Netlify                  │
│   Domain: bauklar.org                │
│   Build: npm run build → out/       │
└──────────────┬───────────────────────┘
               │ HTTPS API Calls
               ▼
┌─────────────────────────────────────┐
│   BACKEND (Express.js API)          │
│   Deployed: Railway                 │
│   Domain: claverum-app-production   │
│            .up.railway.app          │
│   Port: 3001                        │
└──────────────┬───────────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌──────────────┐
│   Neon DB   │  │   AWS S3/R2   │
│  PostgreSQL │  │   File Store  │
└─────────────┘  └──────────────┘
```

### Deployment

- **Frontend:** Netlify (Static Hosting)
  - Branch: `nextjs-migration-v2`
  - Build Command: `npm run build`
  - Publish Directory: `out`
  - Auto-Deploy: ✅ (bei Git Push)

- **Backend:** Railway (Server Hosting)
  - Branch: `main`
  - Auto-Deploy: ✅ (bei Git Push)
  - Port: 3001

---

## 🔌 Backend Integration

### Railway API Endpoints

**Base URL:** `https://claverum-app-production.up.railway.app`

#### Order Management
- `POST /api/create-order` - Neuen Auftrag erstellen
- `PUT /api/update-order/:id` - Auftrag aktualisieren
- `GET /api/order/:id` - Auftrag Details abrufen

#### File Upload
- `GET /api/upload-url` - Pre-Signed URL für S3 Upload generieren
  - Query Params: `orderId`, `area`, `filename`, `mimeType`
- `POST /api/record-upload` - Upload-Metadaten in DB speichern
- `POST /api/save-texts` - Bereichstexte speichern

#### Payments
- `POST /api/payments/create-checkout-session` - Stripe Checkout Session erstellen
- `GET /api/payments/stripe-session/:sessionId` - Stripe Session Status abrufen

#### Admin
- `POST /api/auth/login` - Admin Login
- `GET /api/auth/verify` - Token verifizieren
- `GET /api/admin/orders` - Orders Liste (mit Filter/Sort)
- `GET /api/admin/stats` - System Statistiken
- `DELETE /api/admin/orders/:id` - Order löschen
- `PUT /api/admin/orders/:id/note` - Order Notiz aktualisieren

#### Contact
- `POST /api/contact` - Kontaktformular absenden

### AWS S3 für Files

**Upload Flow:**
1. Frontend komprimiert Bild client-side (`lib/imageCompression.ts`)
2. Frontend ruft `/api/upload-url` auf → Backend generiert Pre-Signed URL
3. Frontend lädt direkt zu S3 hoch (PUT Request)
4. Frontend ruft `/api/record-upload` auf → Backend speichert Metadaten in DB

**Storage Structure:**
```
orders/{order_id}/{area}/{timestamp}-{filename}
```

**CORS:** S3 Bucket muss CORS für Frontend-Domain erlauben

### Neon Database

**Schema:**
- `orders` - Auftragsdaten (street, city, property_type, etc.)
- `uploads` - Bild-Metadaten (order_id, area, file_path, etc.)
- `area_texts` - Bereichstexte (order_id, area, content)

**Connection:** Railway Environment Variable `DATABASE_URL`

### Stripe Payments

**Flow:**
1. Frontend ruft `/api/payments/create-checkout-session` auf
2. Backend erstellt Stripe Session → gibt `checkoutUrl` zurück
3. Frontend redirectet zu Stripe Checkout
4. Nach Payment: Stripe redirectet zurück mit `session_id`
5. Frontend ruft `/api/payments/stripe-webhook` auf (Backend)
6. Backend aktualisiert Order Status (`paid: true`)

**Webhook:** Stripe sendet Webhook an Backend `/api/stripe/webhook`

---

## 📁 File Struktur

```
bauklar-nextjs/
├── app/                          # Next.js App Router Pages
│   ├── page.tsx                 # Homepage (Server Component)
│   ├── layout.tsx               # Root Layout
│   ├── globals.css              # Global Styles
│   ├── not-found.tsx            # 404 Page
│   ├── [city]/                  # Dynamic City Routes
│   │   └── page.tsx
│   ├── admin/                   # Admin Pages
│   │   ├── page.tsx             # Admin Dashboard (Server)
│   │   ├── AdminClient.tsx      # Admin Dashboard (Client)
│   │   └── login/
│   │       ├── page.tsx
│   │       └── AdminLoginClient.tsx
│   ├── evaluation/              # Evaluation Form
│   │   ├── page.tsx             # Server Component
│   │   └── EvaluationClient.tsx # Client Component
│   ├── success/                 # Success Page
│   │   ├── page.tsx
│   │   └── SuccessClient.tsx
│   ├── blog/                    # Blog Pages
│   │   └── hauskauf-beratung/
│   │       └── page.tsx
│   ├── impressum/               # Static Pages
│   ├── agb/
│   ├── datenschutz/
│   └── widerruf/
│
├── components/                  # React Components
│   ├── layout/                  # Layout Components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── CookieBanner.tsx
│   ├── sections/                # Homepage Sections
│   │   ├── HeroSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── ReferencesSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── FAQSection.tsx
│   │   ├── CTASection.tsx
│   │   └── ContactSection.tsx
│   ├── pages/                   # Page-Specific Components
│   │   ├── CityPageClient.tsx
│   │   └── BlogHauskaufBeratungClient.tsx
│   ├── forms/                   # Form Components
│   │   ├── MultiStepForm.tsx    # Main Evaluation Form
│   │   ├── AreaUpload.tsx       # File Upload Component
│   │   └── UploadStatus.tsx     # Upload Queue Status
│   ├── admin/                   # Admin Components
│   │   └── AdminOrderDetail.tsx
│   ├── seo/                     # SEO Schema Components
│   │   ├── BreadcrumbSchema.tsx
│   │   ├── CityServiceSchema.tsx
│   │   ├── FAQSchema.tsx
│   │   └── ...
│   └── ui/                      # UI Components (Radix UI)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
│
├── lib/                         # Utility Functions
│   ├── apiClient.ts            # API Client (Backend Communication)
│   ├── authManager.ts          # JWT Token Management
│   ├── orderManager.ts         # Order Session Management
│   ├── uploadQueue.ts          # Background Upload Queue
│   ├── imageCompression.ts     # Client-Side Image Compression
│   ├── cityData.ts             # City Data Helpers
│   ├── config.ts               # Frontend Configuration
│   └── utils.ts                # General Utilities (cn, etc.)
│
├── data/                        # Static Data
│   └── cities/                 # City JSON Files
│       ├── berlin.json
│       ├── bremen.json
│       └── ... (15 cities)
│
├── types/                       # TypeScript Types
│   └── city.ts                 # City Data Types
│
├── public/                      # Static Assets
│   ├── images/                 # Images
│   ├── sitemap.xml             # SEO Sitemap
│   ├── robots.txt              # SEO Robots
│   ├── _redirects              # Netlify Redirects
│   └── _headers                # Netlify Headers
│
├── hooks/                       # React Hooks
│   └── use-toast.ts            # Toast Hook
│
├── next.config.js              # Next.js Configuration
├── tailwind.config.ts          # Tailwind Configuration
├── tsconfig.json               # TypeScript Configuration
├── netlify.toml                # Netlify Configuration
└── package.json                # Dependencies
```

---

## ⚙️ Wichtige Regeln & Best Practices

### Client Components

**WICHTIG:** Alle interaktiven Components MÜSSEN `"use client"` haben!

**Beispiele:**
- Forms (`MultiStepForm.tsx`, `AreaUpload.tsx`)
- Admin Pages (`AdminClient.tsx`, `AdminLoginClient.tsx`)
- Interactive Sections (mit `useState`, `useEffect`, Event Handlers)

**Server Components:**
- Pages mit nur `Metadata` Export (`app/page.tsx`, `app/[city]/page.tsx`)
- Layout Components ohne Interaktivität

### API Calls

**NUR über `lib/apiClient.ts`:**
```typescript
import { apiClient } from '@/lib/apiClient';

// ✅ RICHTIG
const response = await apiClient.createOrder();

// ❌ FALSCH
const response = await fetch('/api/create-order');
```

**Warum:**
- Zentrale Fehlerbehandlung
- Automatische CSRF Token Verwaltung
- Konsistente Request/Response Typen

### Session Storage / Local Storage

**NUR client-side verwenden!**

**SSR-Safety Pattern:**
```typescript
if (typeof window === 'undefined') {
  return null; // Server-side: return null
}
// Client-side: use localStorage/sessionStorage
```

**Verwendet in:**
- `lib/authManager.ts` - JWT Token Storage
- `lib/orderManager.ts` - Order Session Storage

### Forms

**Regeln:**
1. **IMMER** `"use client"` Directive
2. **NICHT** Server Components für Forms
3. Navigation: `useRouter` von `next/navigation` (NICHT `useNavigate`)
4. API Calls: Identisch zum Original (KEINE Änderungen!)

**Beispiel:**
```typescript
"use client";
import { useRouter } from 'next/navigation';

export default function MyForm() {
  const router = useRouter();
  
  const handleSubmit = async () => {
    // API Call
    router.push('/success'); // ✅ Next.js Router
  };
}
```

### Static Generation

**City Pages:**
- `generateStaticParams()` für alle 15 Cities
- `generateMetadata()` für SEO
- Static JSON Files in `data/cities/`

**Blog Pages:**
- Static Content
- SEO Metadata

**Admin Pages:**
- Statisch generiert, aber Client-Side Auth
- `noindex, nofollow` für SEO

### SEO

**Metadaten:**
- Server Components: `export const metadata: Metadata`
- Client Components: KEINE Metadata (nur Server Components!)

**Schema.org:**
- `BreadcrumbSchema` für Navigation
- `CityServiceSchema` für City Pages
- `FAQSchema` für FAQ Section
- `ServiceSchema` für Services

**Sitemap:**
- `public/sitemap.xml` - Statische Sitemap
- `public/image-sitemap.xml` - Image Sitemap

---

## 🚀 Commands

### Development
```bash
npm run dev          # Start Development Server (localhost:3000)
npm run build        # Build für Production
npm run start        # Start Production Server (nur für Testing)
npm run lint         # ESLint Check
```

### Build & Deploy
```bash
# 1. Build lokal testen
npm run build

# 2. Prüfe out/ Verzeichnis
ls -la out/

# 3. Git Push → Netlify deployt automatisch
git add .
git commit -m "Your message"
git push origin nextjs-migration-v2
```

### Testing
```bash
# Lokaler Build Test
npm run build

# Development Server
npm run dev
# → Öffne http://localhost:3000

# Backend Health Check
curl https://claverum-app-production.up.railway.app/health
```

---

## 🔐 Environment Variables

### Frontend (Netlify)

**Production:**
- `NEXT_PUBLIC_API_BASE` = `https://claverum-app-production.up.railway.app`

**Local Development:**
- `.env.local`:
  ```
  NEXT_PUBLIC_API_BASE=http://localhost:3001
  ```

**WICHTIG:**
- `NEXT_PUBLIC_*` Variablen sind im Browser verfügbar
- Werden beim Build eingebunden
- Nach Änderung: Netlify Redeploy nötig!

### Backend (Railway)

**Environment Variables:**
- `DATABASE_URL` - Neon PostgreSQL Connection String
- `S3_ENDPOINT` - S3/R2 Endpoint URL
- `S3_ACCESS_KEY_ID` - S3 Access Key
- `S3_SECRET_ACCESS_KEY` - S3 Secret Key
- `S3_BUCKET_NAME` - S3 Bucket Name
- `S3_PUBLIC_URL` - Public S3 URL für File Access
- `STRIPE_SECRET_KEY` - Stripe Secret Key
- `STRIPE_WEBHOOK_SECRET` - Stripe Webhook Secret
- `STRIPE_PRICE_ID` - Stripe Price ID
- `RESEND_API_KEY` - Resend Email API Key
- `CONTACT_EMAIL` - Contact Form Email
- `FRONTEND_URL` - Frontend URL für Redirects (`https://bauklar.org`)
- `PORT` - Server Port (3001)

---

## 🔗 Wichtige URLs

### Frontend
- **Production:** https://bauklar.org
- **Netlify Dashboard:** https://app.netlify.com
- **GitHub Repo:** https://github.com/sxndayy/claverum-app (Branch: `nextjs-migration-v2`)

### Backend
- **Railway API:** https://claverum-app-production.up.railway.app
- **Health Check:** https://claverum-app-production.up.railway.app/health
- **Railway Dashboard:** https://railway.app
- **GitHub Repo:** https://github.com/sxndayy/claverum-app (Branch: `main`, `/api` folder)

---

## 📚 Wichtige Dateien

### Konfiguration
- `next.config.js` - Next.js Config (Static Export!)
- `tailwind.config.ts` - Tailwind Config
- `tsconfig.json` - TypeScript Config
- `netlify.toml` - Netlify Deployment Config
- `public/_redirects` - Netlify Redirect Rules
- `public/_headers` - Netlify HTTP Headers

### Core Files
- `lib/apiClient.ts` - **WICHTIG:** Alle API Calls hier!
- `lib/config.ts` - Frontend Configuration
- `lib/authManager.ts` - JWT Token Management
- `lib/orderManager.ts` - Order Session Management
- `lib/uploadQueue.ts` - Background Upload Queue

### Components
- `components/forms/MultiStepForm.tsx` - Main Evaluation Form
- `components/layout/Header.tsx` - Navigation Header
- `components/layout/Footer.tsx` - Footer
- `app/[city]/page.tsx` - Dynamic City Pages

---

## 🐛 Troubleshooting

### Build Errors

**"Module not found":**
- Prüfe `package.json` Dependencies
- `npm install` ausführen

**"localStorage is not defined":**
- Prüfe `typeof window` Checks in `lib/authManager.ts` und `lib/orderManager.ts`
- Stelle sicher dass Client Components `"use client"` haben

**"Cannot find name 'User'":**
- Prüfe TypeScript Interfaces
- Explizite Interface Definitionen hinzufügen

### API Errors

**CORS Errors:**
- Prüfe Backend CORS Config (`api/server.js`)
- Stelle sicher dass Netlify Domain erlaubt ist

**"Network error":**
- Prüfe `NEXT_PUBLIC_API_BASE` Environment Variable
- Prüfe Railway Backend Status
- Prüfe Health Check: `curl https://claverum-app-production.up.railway.app/health`

**"404 Not Found":**
- Prüfe API Endpoint URL
- Prüfe Backend Routes

### Deployment Errors

**Netlify Build fails:**
- Prüfe `next.config.js` (`output: 'export'`)
- Prüfe Environment Variables
- Prüfe Build Logs in Netlify Dashboard

**Static Export fails:**
- Prüfe dass keine `dynamic = 'force-dynamic'` in Pages
- Prüfe dass alle Pages statisch generierbar sind

---

## 📝 Migration Notes

**Von React SPA zu Next.js Static Site:**
- ✅ Alle Components migriert
- ✅ Forms migriert (identische API Calls!)
- ✅ Admin Pages migriert
- ✅ SEO optimiert
- ✅ Static Generation für alle Pages
- ✅ Netlify Deployment konfiguriert

**Wichtige Änderungen:**
- `useNavigate` → `useRouter` (Next.js)
- `"use client"` für alle interaktiven Components
- `Metadata` Export nur in Server Components
- Static JSON Files für City Data

---

## ✅ Checkliste für neue Features

- [ ] Component hat `"use client"` wenn interaktiv
- [ ] API Calls über `lib/apiClient.ts`
- [ ] `typeof window` Checks für localStorage/sessionStorage
- [ ] SEO Metadata in Server Component
- [ ] TypeScript Types definiert
- [ ] Responsive Design (Mobile/Desktop)
- [ ] Error Handling implementiert
- [ ] Testing lokal durchgeführt
- [ ] Build erfolgreich (`npm run build`)

---

**Letzte Aktualisierung:** 2024-11-10  
**Version:** 1.0.0  
**Status:** Production Ready ✅




