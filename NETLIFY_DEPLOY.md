# Netlify Deployment Guide

## 🚀 Deployment auf Netlify

### Schritt 1: GitHub Repository
Das Projekt ist bereits auf GitHub: `github.com/sxndayy/claverum-app`

### Schritt 2: Netlify Setup

1. **Gehe zu Netlify Dashboard:** https://app.netlify.com
2. **"Add new site" → "Import an existing project"**
3. **Verbinde mit GitHub** und wähle Repository: `sxndayy/claverum-app`

### Schritt 3: Build Settings

Netlify sollte automatisch erkennen:
- **Build command:** `npm run build`
- **Publish directory:** `out`
- **Node version:** 18.x oder höher

Falls nicht, manuell setzen:
```
Build command: npm run build
Publish directory: out
```

### Schritt 4: Environment Variables

In Netlify Dashboard → Site settings → Environment variables:

```
NEXT_PUBLIC_API_BASE=https://api.bauklar.org
```

### Schritt 5: Deploy!

Netlify wird automatisch:
1. Code von GitHub pullen
2. `npm install` ausführen
3. `npm run build` ausführen
4. Static Files aus `out/` deployen

## ✅ Nach dem Deployment

### Prüfe:
- [ ] Homepage lädt korrekt
- [ ] City Pages funktionieren
- [ ] Blog Page funktioniert
- [ ] Static Pages funktionieren
- [ ] Evaluation Form funktioniert (mit Backend)
- [ ] Admin Login funktioniert (mit Backend)

### Custom Domain (optional):
- Netlify → Domain settings
- Custom domain hinzufügen: `bauklar.org`
- DNS Records konfigurieren

## 🔧 Troubleshooting

### Build fehlgeschlagen?
- Prüfe Build Logs in Netlify
- Prüfe ob alle Dependencies installiert werden
- Prüfe Node Version (sollte 18+ sein)

### Environment Variables nicht gesetzt?
- Prüfe Netlify → Site settings → Environment variables
- Stelle sicher dass `NEXT_PUBLIC_API_BASE` gesetzt ist
- Redeploy nach Änderungen

### 404 Errors?
- Prüfe `netlify.toml` Konfiguration
- Prüfe `public/_redirects` Datei
- Prüfe ob alle Routes in `out/` generiert wurden

## 📝 Wichtige Dateien für Netlify:

- `netlify.toml` - Build & Redirect Konfiguration
- `public/_redirects` - SPA Fallback
- `public/_headers` - Cache Headers
- `.env.example` - Environment Variables Template


