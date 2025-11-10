# ⚠️ WICHTIG: Netlify Konfiguration korrigieren

## ❌ Aktuelle Fehlkonfiguration:
- **Publish directory:** `dist` (FALSCH!)

## ✅ Korrekte Konfiguration:

### Build Settings:
- **Base directory:** leer lassen (oder `/`)
- **Build command:** `npm run build` ✅ (korrekt)
- **Publish directory:** `out` ⚠️ (MUSS geändert werden!)

### Warum `out` statt `dist`?
Next.js mit `output: 'export'` generiert statische Dateien in `out/`, nicht `dist/`.

### Environment Variables hinzufügen:
1. Klicke auf "Add environment variables"
2. Füge hinzu:
   ```
   NEXT_PUBLIC_API_BASE=https://api.bauklar.org
   ```

### Nach der Korrektur:
1. Publish directory auf `out` ändern
2. Environment Variable hinzufügen
3. "Deploy claverum-app" klicken

## ✅ Was bereits korrekt ist:
- ✅ Branch: `nextjs-migration-v2`
- ✅ Build command: `npm run build`
- ✅ Next.js wurde auto-detected

