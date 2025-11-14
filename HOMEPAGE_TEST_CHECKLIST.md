# ✅ WAS SOLLTE ICH SEHEN? - Homepage Test Checkliste

Nach `npm install` und `npm run dev` sollte die Homepage unter **http://localhost:3000** funktionieren.

## 🎯 ERWARTETE SECTIONS (von oben nach unten):

### 1. **Header** (oben fixiert)
- ✅ Logo "Bauklar.org" links
- ✅ Navigation: Leistungen, So funktioniert's, Referenzen, Preise, FAQ, Kontakt
- ✅ Button "Jetzt Bewertung starten" rechts (nur auf Desktop)

### 2. **Hero Section** (erste große Section)
- ✅ Große Überschrift: "Professionelle Bauschadensbewertung schnell, transparent, verlässlich"
- ✅ Untertitel mit Text über 48 Stunden
- ✅ 2 Buttons: "Jetzt Bewertung starten" (blau) und "So funktioniert's" (outline)
- ✅ 4 Trust Badges in Grid:
  - Datenschutz nach DSGVO
  - Verschlossene Übertragung (TLS)
  - Erfahrung seit 2010
  - Über 500 geprüfte Objekte
- ✅ 5 Sterne Bewertung + "4.9/5 Kundenbewertung"

### 3. **Services Section** (Leistungen)
- ✅ Überschrift: "Unser Service"
- ✅ Eine große Card "Bauschadensbewertung" mit:
  - Icon oben
  - Titel und Beschreibung
  - 4 Features als Bullet Points
  - 2 Buttons: "Jetzt starten" und "Mehr Infos"
- ✅ "Warum Bauklar.org?" Box mit 3 Spalten

### 4. **How It Works Section** (So funktioniert's)
- ✅ Überschrift: "So funktioniert's"
- ✅ 3 Steps horizontal nebeneinander (Desktop) / vertikal (Mobile):
  - Step 1: Fotos hochladen (2 Minuten)
  - Step 2: Prüfung durch Sachverständige
  - Step 3: Ergebnis innerhalb von 48 Stunden
- ✅ Verbindungslinie zwischen Steps (nur Desktop)
- ✅ Beispiel-Box: "Typischer Analyseprozess"
- ✅ Sicherheit & Datenschutz Box mit 3 Icons

### 5. **Pricing Section** (Preise)
- ✅ Überschrift: "Transparente Preise"
- ✅ Eine große Card "All-in-one" mit:
  - Preis: 350€ inkl. MwSt.
  - Beschreibung
  - 8 Features als Checkmarks
  - Button "Jetzt starten"
- ✅ "Schnellergebnis innerhalb von 48 Stunden" Box
- ✅ "Wo wir vertreten sind" mit 15 City-Buttons

### 6. **References Section** (Referenzen)
- ✅ Überschrift: "Was unsere Kunden sagen"
- ✅ Client Reviews Box mit:
  - Durchschnittsbewertung oben rechts
  - Scrollbare Liste mit 6 Reviews
  - Jedes Review zeigt: Name, Rating, Text, Datum
- ✅ Trust Indicators: 500+ Bewertungen, 4.8 Durchschnitt, 98% Weiterempfehlung

### 7. **About Section** (Über uns)
- ✅ Überschrift: "Über Bauklar.org"
- ✅ 2-spaltig (Desktop):
  - Links: Foto von Dr. Johannes Stankiewicz (192x192px)
  - Rechts: 3 Cards mit Bio, Mission, Erfahrung & Zahlen
- ✅ Social Links (LinkedIn, Email, Phone)
- ✅ Zertifizierungen Box mit 3 Cards

### 8. **FAQ Section** (Häufig gestellte Fragen)
- ✅ Überschrift: "Häufig gestellte Fragen"
- ✅ 10 Accordion Items (klickbar, öffnen/schließen):
  1. Wie schnell erhalte ich das Ergebnis?
  2. Was passiert mit meinen Daten & Fotos?
  3. Welche Fotos sind besonders wichtig?
  4. Was, wenn Unterlagen fehlen?
  5. Ist die Einschätzung rechtsverbindlich?
  6. Kann ich nachträglich Dateien nachreichen?
  7. Wie läuft die Zahlung ab?
  8. Kann ich stornieren?
  9. Für welche Objekttypen ist die Analyse geeignet?
  10. Was unterscheidet Sie von traditionellen Gutachtern?
- ✅ Contact CTA Box unten mit Email, Telefon, Blog-Link

### 9. **CTA Section** (Call-to-Action)
- ✅ Überschrift: "Bereit für Ihre Bauschadensbewertung?"
- ✅ 3 Cards: DSGVO-konform, Schnelle Ergebnisse, Professionell
- ✅ Großer Button "Jetzt Bewertung starten"
- ✅ Text: "Keine Anmeldung erforderlich • Sofortiger Start • Transparente Preise"

### 10. **Contact Section** (Kontakt)
- ✅ Überschrift: "Kontakt"
- ✅ 2-spaltig:
  - Links: Kontaktformular mit Feldern (Name, Email, Telefon, Nachricht)
  - Rechts: 4 Info Cards (Email, Telefon, Adresse, Geschäftszeiten)

### 11. **Footer** (unten)
- ✅ Links zu: Impressum, AGB, Datenschutz, Widerruf
- ✅ Copyright Info

### 12. **Cookie Banner** (unten fixiert)
- ✅ Cookie-Banner mit Text und Buttons

---

## 🎨 DESIGN-CHECKLISTE:

### Farben:
- ✅ Primärfarbe: Blau (#00668c)
- ✅ Hintergrund: Beige/Creme (#fffefb)
- ✅ Text: Dunkelgrau (#1d1c1c)
- ✅ Cards: Weiß mit Schatten

### Responsive:
- ✅ Mobile: Sections untereinander, Navigation als Hamburger Menu
- ✅ Desktop: 2-3 Spalten Layouts, Navigation horizontal

### Interaktivität:
- ✅ Smooth Scroll zu Sections beim Klick auf Navigation
- ✅ Accordion öffnet/schließt beim Klick
- ✅ Buttons haben Hover-Effekte
- ✅ Cards haben Hover-Lift-Effekt

---

## ⚠️ POTENTIELLE PROBLEME:

### Wenn etwas nicht funktioniert:

1. **Fehlende Dependencies:**
   ```bash
   npm install
   ```

2. **Images fehlen:**
   - Prüfe ob `/public/Johannes-foto.png` existiert
   - Prüfe ob `/public/logo-final.png` existiert

3. **Styling fehlt:**
   - Prüfe ob `app/globals.css` geladen wird
   - Prüfe Browser Console für CSS-Fehler

4. **TypeScript-Fehler:**
   - Prüfe Terminal für TypeScript-Warnings
   - Prüfe ob alle Imports korrekt sind

---

## 🧪 TEST-CHECKLISTE:

- [ ] Homepage lädt ohne Fehler
- [ ] Alle Sections sind sichtbar
- [ ] Navigation funktioniert (Scroll zu Sections)
- [ ] Accordion öffnet/schließt
- [ ] Buttons haben Hover-Effekte
- [ ] Mobile Responsive funktioniert
- [ ] Images laden korrekt
- [ ] Keine Console Errors
- [ ] Keine TypeScript Errors im Terminal

---

## 📱 MOBILE TEST:

- [ ] Hamburger Menu öffnet/schließt
- [ ] Sections sind vertikal angeordnet
- [ ] Text ist lesbar (keine Überlappungen)
- [ ] Buttons sind groß genug zum Tippen
- [ ] Accordion funktioniert auf Touch

---

**Wenn alles funktioniert:** ✅ Phase 3 erfolgreich abgeschlossen!

**Wenn Fehler auftreten:** Bitte Fehlermeldung teilen, dann fixe ich es.


