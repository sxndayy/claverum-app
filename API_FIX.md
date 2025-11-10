# 🔧 API-Verbindungsfehler beheben

## ✅ Railway Backend URL gefunden

**Public Domain:** `claverum-app-production.up.railway.app`  
**Port:** 3001  
**API Base URL:** `https://claverum-app-production.up.railway.app`

## Problem
Die Frontend-App kann nicht mit dem Backend kommunizieren:
- `https://api.bauklar.org` ist nicht erreichbar (falsche URL)
- CORS-Fehler bei API-Calls

## Lösung

### 1. ✅ Railway Backend URL (GEFUNDEN)

**Railway Public Domain:** `claverum-app-production.up.railway.app`  
**Vollständige API URL:** `https://claverum-app-production.up.railway.app`

### 2. Backend CORS aktualisieren

Die Netlify-Domain muss zu CORS hinzugefügt werden:

**Datei:** `api/server.js` (Zeile 66-79)

**Aktuell:**
```javascript
app.use(cors({
  origin: [
    'http://bauklar.org',
    'https://bauklar.org',
    'http://www.bauklar.org',
    'https://www.bauklar.org',
    'https://test-johannes.netlify.app',
    'http://localhost:3000',
    'http://localhost:8080'
  ],
  credentials: true
}));
```

**Hinzufügen:**
- Deine Netlify-Domain (z.B. `https://bauklar-nextjs.netlify.app`)
- Oder alle Netlify-Domains: `https://*.netlify.app` (mit Regex)

**Option 1: Spezifische Domain (Empfohlen)**
```javascript
app.use(cors({
  origin: [
    'http://bauklar.org',
    'https://bauklar.org',
    'http://www.bauklar.org',
    'https://www.bauklar.org',
    'https://bauklar-nextjs.netlify.app', // ← HINZUFÜGEN
    'https://test-johannes.netlify.app',
    'http://localhost:3000',
    'http://localhost:8080'
  ],
  credentials: true
}));
```

**Option 2: Alle Netlify-Domains (Flexibler)**
```javascript
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://bauklar.org',
      'https://bauklar.org',
      'http://www.bauklar.org',
      'https://www.bauklar.org',
      'http://localhost:3000',
      'http://localhost:8080'
    ];
    
    // Allow Netlify preview domains
    if (!origin || allowedOrigins.includes(origin) || origin.includes('.netlify.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### 3. ✅ Netlify Environment Variable aktualisieren (KRITISCH!)

**Railway URL:** `https://claverum-app-production.up.railway.app`

1. Gehe zu Netlify Dashboard → Site Settings → Environment Variables
2. **ÄNDERE** `NEXT_PUBLIC_API_BASE`:
   - **ALT:** `https://api.bauklar.org` (falsch!)
   - **NEU:** `https://claverum-app-production.up.railway.app` ✅
3. **WICHTIG:** Nach Änderung → "Redeploy site" auslösen!

### 4. Backend auf Railway deployen

Nach CORS-Änderungen:
```bash
cd api/
git add server.js
git commit -m "Add Netlify domain to CORS"
git push
# Railway deployt automatisch
```

### 5. Testen

**Lokaler Test:**
```bash
# Terminal 1: Backend starten
cd api/
npm run dev

# Terminal 2: Frontend starten
cd ../bauklar-nextjs/
npm run dev

# Browser: http://localhost:3000/evaluation
# Prüfe Browser Console für API-Calls
```

**Production Test:**
1. Netlify Deploy prüfen
2. Browser Console öffnen
3. Evaluation Page öffnen
4. Prüfe ob API-Calls erfolgreich sind

## Checkliste

- [ ] Railway Backend URL gefunden
- [ ] CORS in `api/server.js` aktualisiert
- [ ] Backend auf Railway deployed
- [ ] Netlify `NEXT_PUBLIC_API_BASE` korrekt gesetzt
- [ ] Lokaler Test erfolgreich
- [ ] Production Test erfolgreich

## Debugging

**API-URL prüfen:**
```javascript
// Browser Console auf bauklar.org
console.log(process.env.NEXT_PUBLIC_API_BASE);
```

**Backend Health Check:**
```bash
curl https://claverum-app-production.up.railway.app/health
```

**Erwartete Antwort:**
```json
{"status":"ok","timestamp":"2024-..."}
```

**CORS Test:**
```bash
curl -H "Origin: https://bauklar.org" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://claverum-app-production.up.railway.app/api/create-order \
     -v
```

## ✅ Schnell-Fix Checkliste

1. **Netlify Environment Variable ändern:**
   - `NEXT_PUBLIC_API_BASE` = `https://claverum-app-production.up.railway.app`
   - Site neu deployen

2. **Backend CORS bereits aktualisiert** ✅
   - Alle `.netlify.app` Domains erlaubt
   - Backend auf Railway deployen (falls noch nicht geschehen)

3. **Testen:**
   - Health Check: `curl https://claverum-app-production.up.railway.app/health`
   - Evaluation Page öffnen → Browser Console prüfen

