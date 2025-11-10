# Test-Anleitung für Next.js Migration

## 🚀 Schnellstart

### 1. Dependencies installieren
```bash
cd /Users/henri/Downloads/bauklar-nextjs
npm install
```

### 2. Environment Variables konfigurieren
```bash
# Kopiere .env.example zu .env.local
cp .env.example .env.local

# Bearbeite .env.local und setze die Backend-URL:
# Für lokale Entwicklung:
NEXT_PUBLIC_API_BASE=http://localhost:3001

# Für Production-Test:
NEXT_PUBLIC_API_BASE=https://api.bauklar.org
```

### 3. Development Server starten
```bash
npm run dev
```

Die App läuft dann auf: http://localhost:3000

## 🧪 Test-Checkliste

### ✅ Statische Seiten (funktionieren ohne Backend)
- [ ] Homepage (`/`)
- [ ] City Pages (`/berlin`, `/hamburg`, `/muenchen`, etc.)
- [ ] Blog Page (`/blog/hauskauf-beratung`)
- [ ] Static Pages (`/impressum`, `/agb`, `/datenschutz`, `/widerruf`)
- [ ] 404 Page (nicht-existente Route)

### ✅ Forms & Interaktive Komponenten (benötigen Backend)
- [ ] Evaluation Form (`/evaluation`)
  - [ ] Alle 9 Steps durchgehen
  - [ ] Form-Validierung testen
  - [ ] Navigation zwischen Steps
  - [ ] **Hinweis:** Foto-Upload funktioniert nur mit Production Backend (S3)

### ✅ Admin Pages (benötigen Backend)
- [ ] Admin Login (`/admin/login`)
  - [ ] Login mit Credentials testen
- [ ] Admin Dashboard (`/admin`)
  - [ ] Orders Liste anzeigen
  - [ ] Filter & Search testen
  - [ ] Order Details öffnen
  - [ ] Export & Delete testen

## 🔧 Backend-Verbindung prüfen

### Backend muss laufen auf:
- **Lokal:** http://localhost:3001
- **Production:** https://api.bauklar.org

### API Endpoints die verwendet werden:
- `POST /api/auth/login` - Admin Login
- `GET /api/auth/verify` - Token Verification
- `POST /api/create-order` - Order erstellen
- `PUT /api/update-order/:id` - Order updaten
- `GET /api/upload-url` - Upload URL für S3
- `POST /api/record-upload` - Upload Metadaten speichern
- `POST /api/save-texts` - Bereichstexte speichern
- `GET /api/order/:id` - Order Details
- `GET /api/orders` - Orders Liste
- `POST /api/create-checkout-session` - Stripe Checkout
- `GET /api/stripe-session/:id` - Stripe Session Status
- `POST /api/contact` - Contact Form

### Backend Health Check:
```bash
# Lokales Backend prüfen
curl http://localhost:3001/health

# Production Backend prüfen
curl https://api.bauklar.org/health
```

## 🐛 Troubleshooting

### Problem: "Module not found" Errors
```bash
npm install
```

### Problem: Backend Connection Error
1. Prüfe ob Backend läuft: `curl http://localhost:3001/health`
2. Prüfe `.env.local` Datei: `NEXT_PUBLIC_API_BASE` muss gesetzt sein
3. Restart Dev Server: `npm run dev`

### Problem: CORS Errors
- Backend muss CORS für `http://localhost:3000` erlauben
- Prüfe Backend CORS-Konfiguration

### Problem: Foto-Upload funktioniert nicht lokal
- **Normal!** Foto-Upload benötigt S3/Cloudflare R2
- Funktioniert nur mit Production Backend
- Lokal können andere Form-Felder getestet werden

## 📦 Build Test

### Production Build testen:
```bash
npm run build
```

Output wird in `out/` erstellt (Static Export)

### Build prüfen:
```bash
# Prüfe ob alle Routes generiert wurden
ls -la out/

# Sollte enthalten:
# - index.html (Homepage)
# - berlin.html, hamburg.html, etc. (City Pages)
# - evaluation.html, success.html
# - admin/login.html, admin.html
# - impressum.html, agb.html, etc.
```

## 🌐 Netlify Deployment Test

### Lokaler Netlify Test:
```bash
# Netlify CLI installieren (falls nicht vorhanden)
npm install -g netlify-cli

# Build erstellen
npm run build

# Lokal testen mit Netlify Dev
netlify dev
```

## ✅ Was funktioniert OHNE Backend:
- ✅ Alle statischen Seiten (Homepage, Cities, Blog, Static Pages)
- ✅ Navigation & Routing
- ✅ UI Components & Styling
- ✅ SEO Metadata
- ✅ Form-UI (aber keine Daten-Speicherung)

## ⚠️ Was benötigt Backend:
- ⚠️ Evaluation Form (Order erstellen, Daten speichern)
- ⚠️ Foto-Upload (benötigt S3)
- ⚠️ Admin Login & Dashboard
- ⚠️ Stripe Checkout
- ⚠️ Contact Form

## 🎯 Empfohlene Test-Reihenfolge:

1. **Statische Seiten testen** (ohne Backend)
   - Homepage, Cities, Blog, Static Pages

2. **Backend-Verbindung prüfen**
   - Health Check
   - Admin Login testen

3. **Forms testen** (mit Backend)
   - Evaluation Form durchgehen
   - Admin Dashboard testen

4. **Build & Deployment testen**
   - Production Build
   - Netlify Deployment

