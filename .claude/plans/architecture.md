# Architecture — Bauklar.org /start & Funnel Optimierung

## Tech Stack (bestehend)
- **Framework:** Next.js 14.2.0 (App Router, Static Export) — Kein SSR, alles pre-rendered
- **Styling:** Tailwind CSS 3.4.17 + HSL Design Tokens in globals.css
- **Components:** shadcn/ui (Radix UI) + Lucide React Icons
- **State:** React useState + sessionStorage (orderManager.ts)
- **API:** Custom apiClient.ts → Railway Backend
- **Payment:** Stripe Checkout (redirect-basiert)
- **Deploy:** Netlify (Static)
- **Analytics:** Plausible (basierend auf Commits)

## Datei-Struktur (relevante Bereiche)

```
app/
  start/page.tsx              ← /start Landing Page Komposition
  evaluation/
    page.tsx                  ← Funnel Entry
    EvaluationClient.tsx      ← Funnel Wrapper
  success/page.tsx            ← Post-Payment

components/
  start/
    layout/
      StartHeader.tsx         ← Header fuer /start
      StartFooter.tsx         ← Footer fuer /start
    sections/
      StartHeroSection.tsx    ← Hero (redesigned)
      StartPricingSection.tsx
      StartHowItWorksSection.tsx
      StartServicesSection.tsx
      StartReferencesSection.tsx
      StartAboutSection.tsx
      StartFAQSection.tsx
      StartCTASection.tsx
      StartContactSection.tsx
  forms/
    MultiStepForm.tsx         ← 4-Step Funnel
  FunnelSidebar.tsx           ← Experten-Badge (Desktop only)
  ProcessSidebar.tsx          ← Prozess-Steps (Desktop only)
  seo/                        ← Schema-Markup Komponenten

lib/
  apiClient.ts                ← Backend-Kommunikation
  orderManager.ts             ← Session-Verwaltung
  imageCompression.ts         ← Foto-Kompression
  config.ts                   ← SITE_URL, API_BASE

data/
  cities/                     ← 15 Stadt-JSONs
```

## Design System Entscheidungen

| Entscheidung | Wert | Rationale |
|-------------|------|-----------|
| Farb-System | HSL CSS Custom Properties | Konsistenz + Easy Theming |
| Primary CTA | accent-200 (#0052a3) | Professionelles Blau, kein SaaS-Lila |
| Shadows | shadow-soft (4px 20px) | Dezent, nicht "floaty" |
| Border Radius | 0.5rem | Professionell, nicht zu rund |
| Fonts | Inter (Google Fonts) | Clean, neutral, deutsch-tauglich |
| Icons | Lucide React | Konsistent, keine Emojis |
| Animations | CSS only (kein Framer Motion) | Performance, kein "fancy" Gefuehl |

## API Contracts (relevant fuer Funnel)

```
POST /api/create-order → { orderId, sessionToken }
PUT  /api/update-order/:id → { success }
GET  /api/upload-url → { uploadUrl, filePath }
PUT  {s3-presigned-url} → Direct S3 Upload
POST /api/record-upload → { uploadId }
POST /api/payments/create-checkout-session → { url: stripe-checkout-url }
POST /api/contact-message → { success }
```

## Neue Komponenten die moeglicherweise erstellt werden

| Komponente | Zweck | Rationale |
|-----------|-------|-----------|
| TrustBar.tsx | Horizontale Trust-Badge Leiste | Fehlender Trust-Layer zwischen Sections |
| GuaranteeBadge.tsx | Geld-zurueck-Garantie Widget | Deep Research #1 Empfehlung |
| ExampleReport.tsx | Beispiel-Seiten aus echtem Report | Zeigt was der Kunde bekommt |
| MobileTrustStrip.tsx | Trust-Info im Funnel fuer Mobile | Mobile sieht aktuell keine Sidebars |
| ProblemSection.tsx | "Warum Sie eine Pruefung brauchen" | Fehlendes Problem-Agitation Element |

## Keine neuen Dependencies noetig
Alle Aenderungen nutzen bestehende Tools (Tailwind, Lucide, shadcn/ui). Kein neues Package erforderlich.
