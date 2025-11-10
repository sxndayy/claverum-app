# 🎯 NÄCHSTE SCHRITTE - Migration Roadmap

## ✅ ABGESCHLOSSEN

- ✅ **Phase 0:** Analyse & Vorbereitung
- ✅ **Phase 1:** Next.js Projekt Setup
- ✅ **Phase 2:** Shared Components & Layout (Header, Footer, CookieBanner)
- ✅ **Phase 3:** Homepage (alle 9 Sections migriert)

---

## 🔄 AKTUELLER STATUS

### ✅ Phase 3: Homepage - ABGESCHLOSSEN
- Alle 9 Sections migriert
- Alle Layout Components migriert
- Alle UI Components migriert
- SEO Components vollständig
- Assets kopiert
- package.json aktualisiert

### ⏳ SOFORT NÖTIG (vor nächster Phase):

1. **Dependencies installieren:**
   ```bash
   cd /Users/henri/Downloads/bauklar-nextjs
   npm install
   ```

2. **Build testen:**
   ```bash
   npm run build
   ```
   - Prüft ob alle Components kompilieren
   - Findet TypeScript-Fehler
   - Validiert alle Imports

3. **Dev Server testen:**
   ```bash
   npm run dev
   ```
   - Öffne http://localhost:3000
   - Prüfe Homepage visuell
   - Teste alle Sections
   - Prüfe Mobile Responsiveness

---

## 📋 NÄCHSTE PHASEN

### **Phase 4: Dynamic City Pages** (15 Städte)
**Ziel:** Alle City Pages migrieren

**Aufgaben:**
- [ ] City Data migrieren (`src/data/cities/*.json` → `data/cities/*.json`)
- [ ] City Types migrieren (`src/types/city.ts` → `types/city.ts`)
- [ ] Dynamic Route erstellen (`app/[city]/page.tsx`)
- [ ] City Page Component migrieren
- [ ] SEO für City Pages (BreadcrumbSchema, CityServiceSchema)
- [ ] Alle 15 Cities testen

**Geschätzte Zeit:** 2-3 Stunden

---

### **Phase 5: Blog Page**
**Ziel:** Blog-Seite `/blog/hauskauf-beratung` migrieren

**Aufgaben:**
- [ ] Blog Page Component migrieren (`src/pages/BlogHauskaufBeratung.tsx`)
- [ ] Blog Content migrieren
- [ ] Blog SEO (BlogPosting Schema)
- [ ] Internal Links prüfen
- [ ] Images optimieren (Next.js Image)

**Geschätzte Zeit:** 1-2 Stunden

---

### **Phase 6: Static Pages**
**Ziel:** Impressum, AGB, Datenschutz, Widerruf migrieren

**Aufgaben:**
- [ ] `app/impressum/page.tsx`
- [ ] `app/agb/page.tsx`
- [ ] `app/datenschutz/page.tsx`
- [ ] `app/widerruf/page.tsx`
- [ ] SEO für Legal Pages

**Geschätzte Zeit:** 30 Minuten

---

### **Phase 7: Forms & Interactive Components**
**Ziel:** Evaluation Form, Success Page migrieren

**Aufgaben:**
- [ ] MultiStepForm Component migrieren (`components/forms/MultiStepForm.tsx`)
- [ ] AreaUpload Component migrieren (`components/forms/AreaUpload.tsx`)
- [ ] Evaluation Page (`app/evaluation/page.tsx`)
- [ ] Success Page (`app/success/page.tsx`)
- [ ] Form State Management
- [ ] File Upload Logic
- [ ] API Integration

**Geschätzte Zeit:** 3-4 Stunden (komplex!)

---

### **Phase 8: 404 Page**
**Ziel:** Not Found Page migrieren

**Aufgaben:**
- [ ] `app/not-found.tsx` bereits vorhanden
- [ ] Prüfen ob vollständig migriert
- [ ] SEO (noindex)

**Geschätzte Zeit:** 15 Minuten

---

### **Phase 9: Build & Test**
**Ziel:** Vollständigen Build testen

**Aufgaben:**
- [ ] `npm run build` erfolgreich
- [ ] Alle Routes funktionieren
- [ ] Static Export funktioniert
- [ ] Alle Images laden
- [ ] Alle Links funktionieren
- [ ] Mobile Responsiveness
- [ ] Browser Testing (Chrome, Firefox, Safari)

**Geschätzte Zeit:** 1-2 Stunden

---

### **Phase 10: Netlify Deployment**
**Ziel:** Deployment auf Netlify konfigurieren

**Aufgaben:**
- [ ] `netlify.toml` anpassen für Next.js
- [ ] Build Command: `npm run build`
- [ ] Publish Directory: `out` (Next.js Static Export)
- [ ] Redirects prüfen
- [ ] Headers prüfen
- [ ] Environment Variables

**Geschätzte Zeit:** 30 Minuten

---

### **Phase 11: Google Search Console**
**Ziel:** SEO & Indexing prüfen

**Aufgaben:**
- [ ] Sitemap einreichen
- [ ] Alle URLs testen
- [ ] Rich Snippets prüfen
- [ ] Mobile-Friendly Test
- [ ] PageSpeed Insights

**Geschätzte Zeit:** 1 Stunde

---

### **Phase 12: Cleanup & Documentation**
**Ziel:** Projekt aufräumen

**Aufgaben:**
- [ ] Alte Dateien löschen
- [ ] README.md aktualisieren
- [ ] Migration Docs finalisieren
- [ ] Code Review
- [ ] Final Testing

**Geschätzte Zeit:** 1 Stunde

---

## 🎯 EMPFOHLENE REIHENFOLGE

1. **SOFORT:** npm install + Build Test
2. **Phase 4:** City Pages (wichtig für SEO)
3. **Phase 5:** Blog Page (wichtig für SEO)
4. **Phase 6:** Static Pages (schnell erledigt)
5. **Phase 7:** Forms (komplex, aber wichtig)
6. **Phase 8:** 404 Page (schnell)
7. **Phase 9:** Build & Test (vor Deployment)
8. **Phase 10:** Netlify Deployment
9. **Phase 11:** Google Search Console
10. **Phase 12:** Cleanup

---

## 📊 GESAMTÜBERSICHT

- ✅ **Abgeschlossen:** 3 Phasen (Phase 0-3)
- ⏳ **In Arbeit:** Phase 3 Finalisierung (npm install, Build Test)
- 📋 **Offen:** 9 Phasen (Phase 4-12)

**Geschätzte Gesamtzeit:** 10-15 Stunden

**Priorität:** 
1. 🔴 HOCH: Phase 4 (City Pages) - wichtig für SEO
2. 🟡 MITTEL: Phase 5 (Blog), Phase 6 (Static Pages)
3. 🟢 NIEDRIG: Phase 7-12 (Forms, Testing, Deployment)

