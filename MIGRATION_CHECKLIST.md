# ✅ MIGRATION CHECKLISTE - Phase 3: Homepage

## 1. ✅ SECTIONS - Alle migriert

### Homepage Sections (9/9):
- ✅ HeroSection.tsx
- ✅ ServicesSection.tsx  
- ✅ HowItWorksSection.tsx
- ✅ PricingSection.tsx
- ✅ ReferencesSection.tsx
- ✅ AboutSection.tsx
- ✅ FAQSection.tsx
- ✅ CTASection.tsx
- ✅ ContactSection.tsx

### Layout Components (3/3):
- ✅ Header.tsx
- ✅ Footer.tsx
- ✅ CookieBanner.tsx

### SEO Components (7/7):
- ✅ ServiceSchema.tsx
- ✅ ReviewSchema.tsx
- ✅ FAQSchema.tsx
- ✅ ImageSchema.tsx
- ✅ WebSiteSchema.tsx
- ✅ BreadcrumbSchema.tsx
- ✅ CityServiceSchema.tsx

### UI Components (11/11):
- ✅ Button.tsx
- ✅ Card.tsx
- ✅ Input.tsx
- ✅ Label.tsx
- ✅ Textarea.tsx
- ✅ Badge.tsx
- ✅ ScrollArea.tsx
- ✅ Accordion.tsx
- ✅ Toast.tsx
- ✅ Toaster.tsx
- ✅ ClientReviews.tsx
- ✅ ServiceInfoOverlay.tsx

### Hooks (1/1):
- ✅ useToast.ts

### Config (1/1):
- ✅ config.ts (lib/config.ts)

---

## 2. ❌ DEPENDENCIES - Fehlen noch

### Fehlende Radix UI Packages:
```bash
npm install @radix-ui/react-label @radix-ui/react-scroll-area @radix-ui/react-toast
```

### Bereits vorhanden:
- ✅ next: ^14.2.0
- ✅ react: ^18.3.1
- ✅ react-dom: ^18.3.1
- ✅ class-variance-authority: ^0.7.1
- ✅ clsx: ^2.1.1
- ✅ tailwind-merge: ^2.6.0
- ✅ lucide-react: ^0.462.0

---

## 3. ✅ STYLES (Tailwind) - Konfiguriert

### Tailwind Config:
- ✅ Custom Colors (primary-100, primary-200, text-100, text-200, bg-100, bg-200, bg-300)
- ✅ Custom Shadows (soft, strong)
- ✅ Custom Transitions (smooth)
- ✅ Border Radius Variablen
- ✅ Accordion Animations

### Globals CSS:
- ✅ CSS Variables definiert
- ✅ Hero Gradient
- ✅ Trust Gradient
- ✅ Mobile Optimierungen
- ✅ Steps Connector Styles
- ✅ Hover Animations (hover-lift, hover-scale)
- ✅ Form Step Styles
- ✅ Progress Bar Styles

### ⚠️ Potenzielle Probleme:
- `bg-brand-100` wird verwendet, aber sollte `bg-primary-100` sein (bereits gefixt in Sections)
- Prüfe ob alle Custom Classes funktionieren

---

## 4. ❌ IMAGES/ASSETS - Müssen kopiert werden

### Fehlende Assets aus `/public`:
```
❌ Berlin 2.jpg
❌ Berlin 3.jpg
❌ Johannes-foto.png
❌ logo-final.png
❌ Alle City Images (berlin.jpg, hamburg.jpg, muenchen.jpg, etc.)
❌ favicon.ico
❌ placeholder.svg
```

### SEO Assets:
```
❌ sitemap.xml
❌ image-sitemap.xml
❌ robots.txt
```

### ⚠️ WICHTIG:
- Alle Images müssen nach `/public` kopiert werden
- `next/image` verwendet werden für optimierte Bilder
- Favicon muss in `app/` oder `public/` sein

---

## 5. ✅ FEHLENDE KOMPONENTEN - Alle erstellt

### SEO Components (für City Pages):
- ✅ BreadcrumbSchema.tsx
- ✅ CityServiceSchema.tsx

### Utilities:
- ✅ scrollUtils.ts (inline in HeroSection implementiert)

---

## 6. ✅ HOMEPAGE STRUCTURE

### app/page.tsx:
- ✅ Alle Sections importiert
- ✅ WebSiteSchema integriert
- ✅ Toaster für Notifications
- ✅ Layout korrekt strukturiert

---

## 📋 ZUSAMMENFASSUNG

### ✅ Erledigt:
- Alle 9 Homepage Sections migriert
- Alle Layout Components migriert
- Alle UI Components migriert
- Toast System vollständig
- ServiceInfoOverlay vollständig
- Tailwind Config korrekt
- Globals CSS vollständig (inkl. Steps Connector, Hover Animations)
- Homepage Structure erstellt
- SEO Components vollständig (inkl. BreadcrumbSchema, CityServiceSchema)

### ❌ Noch zu tun:

1. **Dependencies installieren:**
   ```bash
   cd bauklar-nextjs
   npm install
   ```
   ✅ package.json aktualisiert mit allen benötigten Dependencies

2. **Assets kopieren:**
   ```bash
   # Von altem Projekt nach neuem Projekt
   cp -r public/* bauklar-nextjs/public/
   ```
   ✅ Alle Assets erfolgreich kopiert (Images, sitemap.xml, robots.txt, favicon.ico)

3. **Fehlende SEO Components erstellen:**
   - ✅ BreadcrumbSchema.tsx - ERSTELLT
   - ✅ CityServiceSchema.tsx - ERSTELLT

4. **Build testen:**
   ```bash
   npm run build
   ```

5. **Dev Server testen:**
   ```bash
   npm run dev
   ```

---

## 🎯 PRIORITÄTEN

1. **HOCH:** Dependencies installieren
2. **HOCH:** Assets kopieren (Homepage funktioniert sonst nicht)
3. **NIEDRIG:** scrollUtils.ts (optional, bereits inline)

