# Claverum Data Pipeline - Setup Guide

Dieses Dokument beschreibt die vollständige Einrichtung der stabilen Datenpipeline für Claverum.

## Überblick

Die Lösung besteht aus:
1. **Backend API** (Express/Node.js) - Verwaltet Orders und Upload-URLs
2. **Postgres Database** (Neon) - Speichert Metadaten
3. **Object Storage** (S3/R2) - Speichert Bilder
4. **Frontend** (React/TypeScript) - Benutzeroberfläche mit Background-Uploads

## Architektur

```
┌─────────────────┐
│   Frontend      │
│  (React/Vite)   │
└────────┬────────┘
         │
         ├─ Session Management (sessionStorage)
         ├─ Image Compression (client-side)
         ├─ Background Upload Queue
         │
         v
┌─────────────────┐
│   Backend API   │
│   (Express)     │
└────┬───────┬────┘
     │       │
     │       └──────────────┐
     v                      v
┌──────────┐        ┌──────────────┐
│ Neon DB  │        │ S3/R2 Storage│
│(Postgres)│        │  (Bilder)    │
└──────────┘        └──────────────┘
```

## Installation

### 1. Backend Setup

```bash
cd api
npm install
```

### 2. Database Setup (Neon Postgres)

1. Erstelle eine Datenbank auf [Neon](https://neon.tech)
2. Kopiere die Connection String
3. Führe die Migrations aus:

```bash
# Mit psql
psql $DATABASE_URL -f ../supabase/migrations/001_create_orders_table.sql
psql $DATABASE_URL -f ../supabase/migrations/002_create_uploads_table.sql
psql $DATABASE_URL -f ../supabase/migrations/003_create_area_texts_table.sql
```

### 3. S3/R2 Storage Setup

**Option A: Cloudflare R2** (empfohlen)
1. Gehe zu [Cloudflare Dashboard](https://dash.cloudflare.com) → R2
2. Erstelle einen Bucket: `claverum-uploads`
3. Erstelle API Token mit R2 Read & Write Permissions
4. Notiere: Account ID, Access Key, Secret Key

**Option B: AWS S3**
1. Erstelle einen S3 Bucket
2. Erstelle IAM User mit S3 Permissions
3. Notiere: Access Key, Secret Key

### 4. Backend Konfiguration

Erstelle `api/.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# S3/R2 Storage
S3_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
S3_REGION=auto
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=claverum-uploads
S3_PUBLIC_URL=https://your-bucket.r2.dev

# Server
PORT=3001
NODE_ENV=development
```

### 5. Frontend Konfiguration

Erstelle `.env` im Root:

```env
VITE_API_BASE=http://localhost:3001
```

### 6. Frontend Dependencies

```bash
npm install
```

## Start

### Backend starten

```bash
cd api
npm run dev
```

Server läuft auf: `http://localhost:3001`

### Frontend starten

```bash
npm run dev
```

Frontend läuft auf: `http://localhost:3000`

## Datenmodell

### `orders` Tabelle
```sql
- id (UUID, Primary Key)
- street (VARCHAR)
- house_number (VARCHAR)
- postal_code (VARCHAR)
- city (VARCHAR)
- property_type (VARCHAR)
- build_year (VARCHAR)
- note (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### `uploads` Tabelle
```sql
- id (UUID, Primary Key)
- order_id (UUID, Foreign Key → orders.id)
- area (VARCHAR) - z.B. "Dach", "Fassade", etc.
- file_path (VARCHAR) - S3 Key
- mime_type (VARCHAR)
- file_size (BIGINT)
- created_at (TIMESTAMP)
```

### `area_texts` Tabelle
```sql
- id (UUID, Primary Key)
- order_id (UUID, Foreign Key → orders.id)
- area (VARCHAR)
- content (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- UNIQUE CONSTRAINT (order_id, area)
```

## API Endpoints

### POST `/api/create-order`
Erstellt einen neuen Auftrag.

**Request:**
```json
{
  "street": "Musterstraße",
  "houseNumber": "123",
  "postalCode": "12345",
  "city": "Musterstadt",
  "propertyType": "Einfamilienhaus",
  "buildYear": "1995"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "uuid-here",
  "createdAt": "2025-10-26T10:00:00Z"
}
```

### PUT `/api/update-order/:orderId`
Aktualisiert Order-Details.

### GET `/api/upload-url`
Generiert Pre-Signed Upload URL.

**Query Params:**
- `orderId` - UUID des Auftrags
- `area` - Bereich (Dach, Fassade, etc.)
- `filename` - Original Dateiname
- `mimeType` - MIME Type (image/jpeg, etc.)

**Response:**
```json
{
  "success": true,
  "uploadUrl": "https://...",
  "filePath": "orders/uuid/Dach/123456-photo.jpg",
  "publicUrl": "https://..."
}
```

### POST `/api/record-upload`
Speichert Upload-Metadaten nach erfolgreichem Upload.

**Request:**
```json
{
  "orderId": "uuid",
  "area": "Dach",
  "filePath": "orders/uuid/Dach/123456-photo.jpg",
  "mimeType": "image/jpeg",
  "fileSize": 1048576
}
```

### POST `/api/save-texts`
Speichert Bereichstext.

**Request:**
```json
{
  "orderId": "uuid",
  "area": "Dach",
  "content": "Hier ist der Text..."
}
```

### GET `/api/order/:orderId`
Holt alle Daten eines Auftrags.

## Frontend Flow

### 1. Order Creation
- Beim Start wird automatisch ein Order erstellt
- `order_id` wird in `sessionStorage` gespeichert
- Bei Page Reload wird existierende `order_id` wiederverwendet

### 2. Image Upload Flow
```
User wählt Bilder
    ↓
Client-side Compression (max 1600px, 80% quality)
    ↓
Hole Pre-Signed URL vom Backend
    ↓
Upload direkt zu S3/R2 (kein Backend-Umweg)
    ↓
Speichere Metadaten in DB
    ↓
Zeige Status-Update
```

### 3. Navigation
- "Weiter"-Klick speichert aktuelle Daten
- Navigation erfolgt sofort (< 1s)
- Uploads laufen im Hintergrund weiter
- Upload-Status wird unten rechts angezeigt

### 4. Retry Logic
- Max 2 Retry-Versuche bei Fehlern
- Exponential Backoff (1s, 2s)
- Failed Uploads können manuell erneut versucht werden

## Ordnerstruktur (S3/R2)

```
claverum-uploads/
└── orders/
    └── {order_id}/
        ├── Dach/
        │   ├── 1730000001-photo1.jpg
        │   └── 1730000002-photo2.jpg
        ├── Fassade/
        │   └── 1730000003-photo3.jpg
        └── Keller/
            └── 1730000004-photo4.jpg
```

## Wichtige Features

✅ **Ein Auftrag pro Sitzung** - Keine doppelten Orders bei Reload  
✅ **Schnelle Navigation** - Keine Blockierung durch Uploads  
✅ **Background Processing** - Uploads laufen asynchron  
✅ **Image Compression** - Reduziert Bandbreite und Speicher  
✅ **Retry Logic** - Automatische Wiederholungsversuche  
✅ **Progress Tracking** - Visuelles Feedback für User  
✅ **Kein Datenverlust** - Metadaten erst nach erfolgreichem Upload  
✅ **Saubere DB** - Referenzielle Integrität (CASCADE DELETE)  

## Troubleshooting

### Backend startet nicht
- Prüfe `.env` Datei im `api/` Ordner
- Teste DB-Verbindung: `psql $DATABASE_URL -c "SELECT 1;"`
- Prüfe Port 3001: `lsof -i :3001`

### Upload schlägt fehl
- Prüfe S3/R2 Credentials
- Teste Pre-Signed URL manuell (curl)
- Prüfe Browser Console für Fehler

### Order wird nicht gespeichert
- Prüfe Backend Logs
- Teste API direkt: `curl http://localhost:3001/health`
- Prüfe DB Migrations

### Bilder werden nicht angezeigt
- Prüfe `S3_PUBLIC_URL` in Backend `.env`
- Stelle sicher, dass Bucket public oder mit CORS konfiguriert ist
- Prüfe Browser Network Tab

## Production Deployment

### Backend
1. Deploy auf Railway, Render, oder Fly.io
2. Setze Umgebungsvariablen
3. Aktiviere HTTPS
4. Konfiguriere CORS für Frontend-Domain

### Frontend
1. Update `VITE_API_BASE` in `.env`
2. Build: `npm run build`
3. Deploy `dist/` auf Vercel, Netlify, oder Cloudflare Pages

### Database
- Neon.tech bietet automatische Backups
- Aktiviere Connection Pooling für Production

### Storage
- Aktiviere CDN für schnellere Auslieferung
- Konfiguriere Lifecycle Policies für alte Dateien
- Aktiviere CORS für Frontend-Domain

## Sicherheit

- [ ] API Rate Limiting hinzufügen
- [ ] File Type Validation (nur Bilder)
- [ ] File Size Limits (z.B. max 10MB)
- [ ] Authentication/Authorization implementieren
- [ ] CORS richtig konfigurieren
- [ ] Pre-Signed URLs zeitlich begrenzen (aktuell: 10 Min)

## Monitoring

Empfohlene Tools:
- **Backend**: Sentry, LogRocket
- **Database**: Neon Dashboard
- **Storage**: Cloudflare Analytics
- **Frontend**: Vercel Analytics

## Support

Bei Fragen oder Problemen:
1. Prüfe die Logs (Backend + Browser Console)
2. Teste API Endpoints einzeln
3. Prüfe DB und Storage Konfiguration

