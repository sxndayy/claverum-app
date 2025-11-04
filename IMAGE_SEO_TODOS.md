# Bild-SEO To-Dos für Bauklar.io

## Status: Was bereits gemacht wurde ✅

- ✅ **Alt-Texte verbessert** in `AdminOrderDetail.tsx` und `AreaUpload.tsx`
- ✅ **Beschreibende Alt-Texte** mit Bereichsnamen (Keller, Elektro, Heizung, etc.)
- ✅ **Dateinamen in Alt-Text** integriert wo möglich

---

## To-Dos: Weitere Bild-Optimierungen

### 1. Alt-Texte vollständig überprüfen 📋

**Status:** ✅ COMPLETED

**To-Do:**
- ✅ Überprüfe **alle weiteren Bilder** auf der Website - ERLEDIGT
- ✅ Stelle sicher, dass jedes Bild einen **beschreibenden Alt-Text** hat - ERLEDIGT
- ✅ Alt-Texte sollten:
  - ✅ Den Bildinhalt beschreiben - ERLEDIGT
  - ✅ Relevante Keywords enthalten (wo natürlich) - ERLEDIGT
  - ✅ Maximal 125 Zeichen lang sein - ERLEDIGT
  - ✅ Nicht zu generisch sein - ERLEDIGT

**Verbesserungen:**
- ✅ AdminOrderDetail.tsx: "Bauschadensanalyse - ${areaName} Bereich - Gebäudeaufnahme"
- ✅ AreaUpload.tsx: "Bauschadensanalyse - ${areaName} Bereich - Foto ${index + 1}"
- ✅ AboutSection.tsx: "Dr. Johannes Stankiewicz - Diplom Sachverständiger für Bauschadensbewertung"

**Priorität:** HIGH

**Beispiele:**
```html
<!-- BAD -->
<img src="hero.jpg" alt="Bild" />
<img src="service.jpg" alt="Foto" />

<!-- GOOD -->
<img src="hero.jpg" alt="Professionelle Bauschadensbewertung - Experte prüft Gebäudefassade" />
<img src="service.jpg" alt="Bauschadensanalyse für Berliner Altbau - Detaillierte Zustandsbewertung" />
```

---

### 2. Bilddateinamen optimieren 📝

**Status:** Nicht erledigt

**To-Do:**
- Benenne alle Bilddateien **vor dem Upload** aussagekräftig um
- Verwende **kebab-case** (mit Bindestrichen)
- Integriere **relevante Keywords**
- Vermeide generische Namen wie `IMG_12345.jpg` oder `photo1.png`

**Priorität:** MEDIUM

**Beispiele:**
```
BAD:
- IMG_12345.jpg
- photo1.png
- bild.jpg
- screenshot.png

GOOD:
- bauschadensanalyse-hero.jpg
- service-berlin-altbau.jpg
- keller-feuchtigkeitsschaden.jpg
- fassade-risse-detail.jpg
```

---

### 3. Bildgröße und -format optimieren 🖼️

**Status:** Nicht überprüft

**To-Do:**
- Komprimiere alle Bilder **ohne Qualitätsverlust**
- Nutze moderne Formate wie **WebP** (mit Fallback für ältere Browser)
- Stelle sicher, dass Bilder in **den richtigen Dimensionen** ausgeliefert werden
- Optimiere für **mobile Geräte** (nicht zu groß)

**Priorität:** HIGH (betrifft Page Speed)

**Tools:**
- ImageOptim, TinyPNG, Squoosh
- WebP Converter
- Responsive Image Generator

**Zielgrößen:**
- Hero-Bilder: Max 1920px Breite, ~200-300 KB
- Thumbnails: Max 400px Breite, ~50-100 KB
- Icons: Max 100px, ~5-10 KB

---

### 4. Lazy Loading implementieren ⚡

**Status:** ✅ COMPLETED

**To-Do:**
- Implementiere **Lazy Loading** für Bilder, die nicht "above the fold" sind
- Nutze native `loading="lazy"` Attribute
- Oder: Intersection Observer für komplexere Fälle

**Priorität:** MEDIUM (verbessert initial Page Load)

**Beispiel:**
```html
<img 
  src="image.jpg" 
  alt="Beschreibung" 
  loading="lazy" 
/>
```

**Wo:**
- ✅ Bilder in `AreaUpload.tsx` (Upload-Previews) - IMPLEMENTIERT
- ✅ Bilder in `AdminOrderDetail.tsx` (Order-Galerie) - IMPLEMENTIERT
- ✅ Bilder in `AboutSection.tsx` (Profilbild) - IMPLEMENTIERT
- ✅ Alle Bilder unterhalb des Fold - IMPLEMENTIERT

---

### 5. Responsive Images mit srcset 📱

**Status:** Nicht implementiert

**To-Do:**
- Nutze `srcset` und `sizes` Attribute für responsive Bilder
- Erstelle verschiedene Bildgrößen für verschiedene Bildschirmauflösungen
- Verbessert **mobile Performance** erheblich

**Priorität:** MEDIUM

**Beispiel:**
```html
<img 
  srcset="
    hero-small.jpg 400w,
    hero-medium.jpg 800w,
    hero-large.jpg 1200w,
    hero-xlarge.jpg 1920w
  "
  sizes="(max-width: 400px) 400px,
         (max-width: 800px) 800px,
         (max-width: 1200px) 1200px,
         1920px"
  src="hero-medium.jpg"
  alt="Beschreibung"
/>
```

---

### 6. Bild-Sitemap erstellen 🗺️

**Status:** ✅ COMPLETED

**To-Do:**
- ✅ Erstelle eine **Image Sitemap** - ERLEDIGT (`/public/image-sitemap.xml`)
- ✅ Füge sie zu robots.txt hinzu - ERLEDIGT
- Reiche sie bei Google Search Console ein (manuell)

**Enthaltene Bilder:**
- Logo (logo-final.png)
- Profilbild (Johannes-foto.jpeg)
- Open Graph Image (og-image.png)

**Priorität:** LOW (nur wenn viele Bilder)

**Format:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://bauklar.io/</loc>
    <image:image>
      <image:loc>https://bauklar.io/hero-image.jpg</image:loc>
      <image:title>Bauschadensbewertung Hero</image:title>
      <image:caption>Professionelle Bauschadensanalyse</image:caption>
    </image:image>
  </url>
</urlset>
```

---

### 7. Strukturierte Daten für Bilder 📊

**Status:** ✅ COMPLETED

**To-Do:**
- ✅ Füge **ImageObject Schema** zu wichtigen Bildern hinzu - ERLEDIGT
- ✅ ImageSchema-Komponente erstellt (`/src/components/ImageSchema.tsx`)
- ✅ ImageSchema zur AboutSection hinzugefügt (Profilbild)

**Implementiert:**
- AboutSection: Profilbild von Dr. Johannes Stankiewicz mit ImageObject Schema

**Priorität:** LOW

---

### 8. Bild-Caching optimieren 💾

**Status:** Server-Konfiguration

**To-Do:**
- Stelle sicher, dass dein Server/CDN Bilder **effektiv cached**
- Setze **Cache-Control Headers** richtig
- Nutze **CDN** für Bilder (z.B. Cloudflare, AWS CloudFront)

**Priorität:** MEDIUM (betrifft Performance)

---

## Zusammenfassung nach Priorität

### Sofort (HIGH):
1. ✅ Alt-Texte vollständig überprüfen - ERLEDIGT
2. Bildgröße und -format optimieren (Server-seitig, nicht im Code)

### Bald (MEDIUM):
3. ✅ Lazy Loading implementieren - ERLEDIGT
4. Responsive Images mit srcset
5. Bild-Caching optimieren

### Später (LOW):
6. Bilddateinamen optimieren (nicht im Code)
7. ✅ Bild-Sitemap erstellen - ERLEDIGT
8. ✅ Strukturierte Daten für Bilder - ERLEDIGT

---

## Notizen

- **SPA-Problem:** Die "0 words" Warnung kommt daher, dass der SEO-Crawler den JavaScript-Content nicht sieht
- **Pre-rendering** wäre eine Lösung für bessere SEO-Sichtbarkeit
- **Bilder sind wichtig** für Image Search Traffic - nicht unterschätzen!

