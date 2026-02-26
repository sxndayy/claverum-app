# Claverum - Bauschadensbewertung mit stabiler Datenpipeline

Komplette Full-Stack Lösung für Bauschadensbewertung mit intelligenter Upload-Pipeline.

## 🎯 Kernfeatures

- ✅ **Ein Auftrag pro Sitzung** - Keine Duplikate bei Reload
- ✅ **Schnelle Navigation** - Uploads blockieren nicht (< 1s)
- ✅ **Background Processing** - Uploads laufen asynchron
- ✅ **Client-Side Compression** - Automatische Bildkomprimierung
- ✅ **Retry Logic** - 2 automatische Wiederholungsversuche
- ✅ **Direct-to-Storage** - Kein Backend-Proxy für Uploads
- ✅ **Real-time Status** - Visuelles Feedback für alle Uploads
- ✅ **Saubere DB** - Referenzielle Integrität mit CASCADE

## 🏗️ Tech Stack

### Frontend
- **React 18** + TypeScript
- **Vite** Build Tool
- **Tailwind CSS** + Radix UI
- **React Router** Navigation
- **Lucide React** Icons

### Backend
- **Express.js** API Server
- **Neon Postgres** Database
- **S3/R2** Object Storage
- **AWS SDK v3** für S3

### Architecture
- Client-side image compression
- Background upload queue with retry
- Session-based order management
- Pre-signed URLs for direct uploads

## 📁 Projektstruktur

```
baucheck-frontend-export/
├── api/                    # Backend API
│   ├── server.js          # Express Server
│   ├── db.js              # Database Connection
│   ├── s3-client.js       # S3/R2 Integration
│   └── package.json
│
├── src/                   # Frontend
│   ├── components/
│   │   ├── MultiStepForm.tsx    # Hauptformular mit Order Management
│   │   ├── AreaUpload.tsx       # File Upload Komponente
│   │   ├── UploadStatus.tsx     # Status Indicator
│   │   └── ui/                  # Radix UI Komponenten
│   ├── utils/
│   │   ├── apiClient.ts         # Type-safe API Client
│   │   ├── uploadQueue.ts       # Background Upload Queue
│   │   ├── imageCompression.ts  # Image Compression
│   │   └── orderManager.ts      # Session Management
│   ├── pages/
│   │   ├── Index.tsx            # Landing Page
│   │   └── Evaluation.tsx       # Bewertungsflow
│   └── ...
│
├── supabase/migrations/   # Database Migrations
│   ├── 001_create_orders_table.sql
│   ├── 002_create_uploads_table.sql
│   └── 003_create_area_texts_table.sql
│
├── QUICKSTART.md          # 5-Minuten Setup Guide
├── SETUP.md               # Detaillierte Setup-Anleitung
└── IMPLEMENTATION.md      # Technische Details
```

## 🚀 Quick Start

**5-Minuten Setup:**
```bash
# 1. Dependencies
npm install
cd api && npm install && cd ..

# 2. Database (Neon)
psql $DATABASE_URL -f supabase/migrations/*.sql

# 3. Configuration
cp env.example .env              # Frontend
cp api/env.example api/.env      # Backend
# Edit beide .env Dateien

# 4. Start
# Terminal 1:
cd api && npm run dev

# Terminal 2:
npm run dev
```

📖 **Detaillierte Anleitung:** Siehe [QUICKSTART.md](./QUICKSTART.md)

## 📚 Dokumentation

- **[QUICKSTART.md](./QUICKSTART.md)** - 5-Minuten Setup
- **[SETUP.md](./SETUP.md)** - Vollständige Setup-Anleitung
- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - Technische Details
- **[api/README.md](./api/README.md)** - Backend API Dokumentation

## 🎯 Wie es funktioniert

### Upload Flow
```
1. User wählt Bilder
2. Client komprimiert Bilder (max 1600px, 80% quality)
3. Backend generiert Pre-Signed URL
4. Direkter Upload zu S3/R2
5. Metadaten werden in DB gespeichert
6. UI zeigt Status in Echtzeit
```

### Session Management
```
1. App Start → Check sessionStorage
2. Kein Order → Create new order
3. Order existiert → Weiterverwenden
4. Page Reload → Keine neue Order
5. Session Clear → Bei Checkout
```

### Background Processing
```
User klickt "Weiter"
    ↓
Navigation: Sofort (< 1s)
    ↓
Parallel:
├─ Uploads → Queue → S3 → DB
└─ Texte → API → DB
    ↓
Status-Update in UI
```

## 🔧 Konfiguration

### Database Schema
3 Tabellen mit referenzieller Integrität:
- `orders` - Auftragsdaten
- `uploads` - Bild-Metadaten
- `area_texts` - Bereichstexte

### Storage Structure
```
orders/{order_id}/{area}/{timestamp}-{filename}
```

### API Endpoints
- `POST /api/create-order` - Neuer Auftrag
- `PUT /api/update-order/:id` - Update Auftrag
- `GET /api/upload-url` - Pre-Signed URL
- `POST /api/record-upload` - Upload-Metadaten
- `POST /api/save-texts` - Bereichstexte
- `GET /api/order/:id` - Vollständige Order-Daten

## 🧪 Testing

```bash
# Backend Health Check
curl http://localhost:3001/health

# Create Order
curl -X POST http://localhost:3001/api/create-order \
  -H "Content-Type: application/json" \
  -d '{"street":"Test","city":"Berlin"}'

# Check Database
psql $DATABASE_URL -c "SELECT * FROM orders;"
```

## 🚀 Deployment

### Backend (Railway/Render/Fly.io)
```bash
# Set environment variables
DATABASE_URL=...
S3_ENDPOINT=...
S3_ACCESS_KEY_ID=...
# ... weitere vars

# Deploy
npm start
```

### Frontend (Vercel/Netlify)
```bash
# Set VITE_API_BASE to production URL
npm run build
# Deploy dist/
```

### Database (Neon)
- Connection Pooling aktivieren
- Backups konfigurieren
- SSL erzwingen

### Storage (R2/S3)
- CDN aktivieren
- CORS konfigurieren (siehe unten)
- Lifecycle Policies setzen

#### S3 CORS Konfiguration

Die S3 CORS-Konfiguration muss aktualisiert werden, damit der Frontend-Direct-Upload funktioniert. Die CORS-Policy ist in `s3-cors-policy.json` definiert.

**Wichtig:** Nach dem Hinzufügen neuer Frontend-Domains muss die CORS-Konfiguration im S3-Bucket aktualisiert werden.

**Methode 1: Via AWS CLI (Empfohlen)**

```bash
# Voraussetzungen:
# - AWS CLI installiert: https://aws.amazon.com/cli/
# - AWS Credentials konfiguriert: aws configure
# - Bucket-Name bekannt (z.B. aus api/.env: S3_BUCKET_NAME)

# CORS-Konfiguration anwenden
./scripts/apply-s3-cors.sh <bucket-name>

# Beispiel:
./scripts/apply-s3-cors.sh claverum-bucket
```

**Methode 2: Via AWS Console (Manuell)**

1. Öffne AWS S3 Console → Wähle deinen Bucket
2. Gehe zu "Permissions" → "Cross-origin resource sharing (CORS)"
3. Klicke "Edit"
4. Kopiere den Inhalt von `s3-cors-policy.json` in das Textfeld
5. Speichere die Änderungen

**Aktuelle erlaubte Domains:**
- `https://bauklar.org` (Production)
- `http://bauklar.org` (Production HTTP)
- `https://www.bauklar.org` (Production WWW)
- `http://www.bauklar.org` (Production WWW HTTP)
- `https://test-johannes.netlify.app` (Testing)
- `http://localhost:3000` (Development)
- `http://localhost:8080` (Development)

**Troubleshooting:**

Wenn Uploads mit 403 CORS-Fehlern fehlschlagen:
1. Prüfe, ob die Frontend-Domain in `s3-cors-policy.json` enthalten ist
2. Wende die CORS-Konfiguration erneut an (siehe oben)
3. Prüfe Browser-Console auf CORS-Fehler
4. Stelle sicher, dass `AllowedMethods` `PUT` enthält

## 🔒 Sicherheit

**Implementiert:**
- Pre-Signed URLs (10 Min)
- SSL Database Connection
- Parameterized Queries
- CORS Configuration

**TODO (Production):**
- [ ] Authentication/Authorization
- [ ] Rate Limiting
- [ ] File Type Validation
- [ ] File Size Limits
- [ ] Input Sanitization
- [ ] CSRF Protection

## 📊 Monitoring

**Empfohlene Metriken:**
- Order Creation Rate
- Upload Success/Failure Rate
- Average Upload Time
- Database Query Performance
- Error Rate by Endpoint

**Empfohlene Tools:**
- Sentry (Error Tracking)
- LogRocket (Session Replay)
- Neon Dashboard (DB Monitoring)
- Cloudflare Analytics (Storage)

