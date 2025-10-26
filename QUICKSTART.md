# Quick Start Guide - Claverum Datenpipeline

Schnelleinstieg in 5 Minuten.

## Voraussetzungen

- Node.js 18+ installiert
- Neon Postgres Account ([neon.tech](https://neon.tech))
- Cloudflare R2 oder AWS S3 Account

## Setup in 5 Schritten

### 1. Dependencies installieren

```bash
# Frontend
npm install

# Backend
cd api
npm install
cd ..
```

### 2. Database Setup

```bash
# Erstelle Datenbank auf neon.tech
# Kopiere Connection String

# Führe Migrations aus
psql "YOUR_DATABASE_URL" -f supabase/migrations/001_create_orders_table.sql
psql "YOUR_DATABASE_URL" -f supabase/migrations/002_create_uploads_table.sql
psql "YOUR_DATABASE_URL" -f supabase/migrations/003_create_area_texts_table.sql
```

### 3. Storage Setup

**Cloudflare R2:**
1. Gehe zu Cloudflare Dashboard → R2
2. Erstelle Bucket: `claverum-uploads`
3. Erstelle API Token
4. Aktiviere Public Access (oder Custom Domain)

### 4. Configuration

**Backend** (`api/.env`):
```env
DATABASE_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require
S3_ENDPOINT=https://your-id.r2.cloudflarestorage.com
S3_REGION=auto
S3_ACCESS_KEY_ID=your-key
S3_SECRET_ACCESS_KEY=your-secret
S3_BUCKET_NAME=claverum-uploads
S3_PUBLIC_URL=https://your-bucket.r2.dev
PORT=3001
NODE_ENV=development
```

**Frontend** (`.env`):
```env
VITE_API_BASE=http://localhost:3001
```

### 5. Start

Terminal 1 (Backend):
```bash
cd api
npm run dev
```

Terminal 2 (Frontend):
```bash
npm run dev
```

Öffne: http://localhost:3000

## Test

1. Fülle Objekt-Grunddaten aus
2. Klicke "Weiter"
3. Lade ein Foto hoch
4. Klicke "Weiter"
5. Prüfe Upload-Status unten rechts
6. Prüfe Datenbank:

```sql
SELECT * FROM orders;
SELECT * FROM uploads;
SELECT * FROM area_texts;
```

## Was passiert?

1. ✅ Order wird erstellt und in sessionStorage gespeichert
2. ✅ Bild wird client-seitig komprimiert
3. ✅ Pre-Signed URL wird vom Backend geholt
4. ✅ Bild wird direkt zu R2/S3 hochgeladen
5. ✅ Metadaten werden in DB gespeichert
6. ✅ Navigation erfolgt sofort, Upload läuft im Hintergrund

## Troubleshooting

**Backend startet nicht:**
```bash
# Prüfe .env
cat api/.env

# Teste DB
psql "$DATABASE_URL" -c "SELECT 1;"
```

**Frontend verbindet nicht:**
```bash
# Prüfe .env
cat .env

# Teste Backend
curl http://localhost:3001/health
```

**Upload schlägt fehl:**
- Prüfe S3/R2 Credentials
- Prüfe Browser Console
- Prüfe Backend Logs

## Nächste Schritte

- Lies [SETUP.md](./SETUP.md) für Details
- Lies [IMPLEMENTATION.md](./IMPLEMENTATION.md) für technische Details
- Implementiere Authentication
- Deploy to Production

## Support

Bei Fragen:
1. Prüfe die Logs
2. Prüfe die Dokumentation
3. Teste API Endpoints einzeln

