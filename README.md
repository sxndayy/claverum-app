# Bauklar Next.js - Migration Projekt

## Status: Phase 1 - Setup ✅

Dieses Projekt ist die Next.js-Migration der React SPA für Bauklar.org.

## Projekt-Struktur

```
bauklar-nextjs/
├── app/
│   ├── layout.tsx       # Root Layout mit Metadata
│   ├── page.tsx         # Homepage (Placeholder)
│   ├── not-found.tsx    # 404 Page
│   └── globals.css      # Global Styles + Tailwind
├── components/
│   ├── layout/          # Header, Footer
│   ├── sections/        # Homepage Sections
│   ├── forms/           # Forms (Client Components)
│   ├── seo/             # SEO Schema Components
│   └── ui/              # UI Components (shadcn/ui)
├── data/
│   └── cities/          # City JSON Files
├── lib/                  # Utilities
├── types/                # TypeScript Types
└── public/               # Static Assets
```

## Next.js Konfiguration

- **Static Export:** `output: 'export'` (kein Server nötig)
- **Trailing Slash:** `false` (SEO Best Practice)
- **Images:** `unoptimized: true` (für Static Export)

## Nächste Schritte

1. ✅ Phase 1: Next.js Projekt Setup
2. ⏭️ Phase 2: Shared Components & Layout
3. ⏭️ Phase 3: Homepage
4. ⏭️ Phase 4: Dynamic City Pages
5. ⏭️ Phase 5: Blog Page
6. ⏭️ Phase 6: Static Pages
7. ⏭️ Phase 7: Forms & Interactive Components
8. ⏭️ Phase 8: 404 Page
9. ⏭️ Phase 9: Build & Test
10. ⏭️ Phase 10: Netlify Deployment

## Development

```bash
# Install dependencies (wenn npm verfügbar)
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Test production build
npx serve out
```

## Migration Notes

Siehe `MIGRATION_ANALYSIS.md` für vollständige Analyse.

