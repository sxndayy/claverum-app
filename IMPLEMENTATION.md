# Claverum Datenpipeline - Implementierungsdetails

## Technische Übersicht

### Frontend Architektur

#### Session Management (`src/utils/orderManager.ts`)
- Speichert `order_id` in `sessionStorage`
- Verhindert doppelte Order-Erstellung bei Page Reload
- Bietet Helper-Funktionen für Order-Lifecycle

```typescript
// Verwendung
const orderId = getCurrentOrderId();
if (!orderId) {
  const newOrder = await apiClient.createOrder();
  setCurrentOrderId(newOrder.orderId);
}
```

#### Image Compression (`src/utils/imageCompression.ts`)
- Client-seitige Komprimierung vor Upload
- Reduziert Bildgröße auf max 1600px Kantenlänge
- 80% JPEG Qualität (anpassbar)
- Async/Promise-basiert

```typescript
const compressed = await compressImage(file, {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.8
});
```

#### Upload Queue (`src/utils/uploadQueue.ts`)
- Singleton Pattern für globalen State
- Queue-basiertes Processing
- Automatische Retry-Logik (max 2 Versuche)
- Observable Pattern (Pub/Sub) für UI-Updates
- Exponential Backoff bei Fehlern

```typescript
// Verwendung
uploadQueue.addUpload(orderId, 'Dach', file);
uploadQueue.subscribe((task) => {
  console.log(`Task ${task.id}: ${task.status}`);
});
```

**Upload States:**
- `pending` - In Warteschlange
- `compressing` - Bild wird komprimiert
- `uploading` - Upload zu S3/R2
- `recording` - Metadaten werden gespeichert
- `completed` - Erfolgreich abgeschlossen
- `failed` - Fehler aufgetreten

#### API Client (`src/utils/apiClient.ts`)
- Type-safe Wrapper für alle API Calls
- Singleton Instance
- Automatische Error Handling
- Promise-basiert

```typescript
// Verwendung
const response = await apiClient.createOrder({
  street: 'Test',
  city: 'Berlin'
});

if (response.success) {
  console.log(response.orderId);
}
```

### Backend Architektur

#### Database Layer (`api/db.js`)
- Connection Pooling für Performance
- SSL-Verbindung zu Neon
- Query Logging für Debugging
- Error Handling

#### S3 Client (`api/s3-client.js`)
- AWS SDK v3 (modular, tree-shakeable)
- Pre-Signed URL Generation
- 10 Minuten Gültigkeit
- Support für S3, R2, und andere S3-kompatible Services

**File Path Structure:**
```
orders/{order_id}/{area}/{timestamp}-{filename}
```

Beispiel:
```
orders/abc123.../Dach/1730000001-dachziegel.jpg
```

#### Server (`api/server.js`)
- Express.js Framework
- CORS enabled
- JSON Body Parser
- Structured Error Responses
- Health Check Endpoint

### Datenbankschema

#### Indexe für Performance
```sql
-- orders
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- uploads
CREATE INDEX idx_uploads_order_id ON uploads(order_id);
CREATE INDEX idx_uploads_area ON uploads(area);
CREATE INDEX idx_uploads_order_area ON uploads(order_id, area);

-- area_texts
CREATE INDEX idx_area_texts_order_area ON area_texts(order_id, area);
CREATE UNIQUE INDEX idx_area_texts_order_area_unique ON area_texts(order_id, area);
```

#### Triggers
```sql
-- Auto-update updated_at timestamp
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

#### Referenzielle Integrität
```sql
-- CASCADE DELETE: Wenn Order gelöscht wird, werden auch Uploads und Texte gelöscht
ALTER TABLE uploads ADD CONSTRAINT fk_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
```

### Component Structure

#### MultiStepForm
**Responsibilities:**
- Order Lifecycle Management
- Step Navigation
- Data Persistence
- Background Upload Coordination

**Key Features:**
- Initialisiert Order beim Mount
- Speichert Daten automatisch bei Navigation
- Zeigt Upload-Status
- Validiert Pflichtfelder

#### AreaUpload
**Responsibilities:**
- File Selection (Drag & Drop + Click)
- Preview Generation
- Text Input
- File Management

**Key Features:**
- Max 20 Fotos pro Bereich
- Max 200 Wörter Text
- Object URL Management (Memory Leak Prevention)
- Responsive Grid Layout

#### UploadStatus
**Responsibilities:**
- Visueller Upload-Status
- Progress Tracking
- Error Display
- Retry Functionality

**Key Features:**
- Fixed Position (Bottom Right)
- Collapsible
- Real-time Updates via Subscription
- Retry Button für fehlgeschlagene Uploads

### Datenfluss

#### Complete Upload Flow
```
1. User wählt Bilder in AreaUpload
   └─> Files werden zu formData.{area}.files hinzugefügt
   └─> Preview URLs werden erstellt

2. User klickt "Weiter"
   └─> saveCurrentStepData() wird aufgerufen
   └─> Files werden zu uploadQueue hinzugefügt
   └─> Navigation erfolgt sofort

3. UploadQueue verarbeitet Tasks
   └─> compressImage(file)
   └─> apiClient.getUploadUrl()
   └─> apiClient.uploadToS3()
   └─> apiClient.recordUpload()

4. UploadStatus zeigt Progress
   └─> Subscribe zu uploadQueue
   └─> UI Updates bei jedem Task-Update
   └─> Success/Error Feedback
```

#### Order State Management
```
App Mount
  └─> Check sessionStorage für order_id
      ├─> Existiert: Use existing
      └─> Nicht existiert: Create new
          └─> Save to sessionStorage

Step 1 Navigation
  └─> Update order in DB (address, property info)

Steps 2-7 Navigation
  └─> Queue file uploads (background)
  └─> Save texts (async, non-blocking)

Page Reload
  └─> Retrieve order_id from sessionStorage
  └─> Continue with same order (no duplicate)
```

### Error Handling

#### Frontend
- Try/Catch um alle API Calls
- Toast Notifications für User Feedback
- Console Logging für Developer Debugging
- Retry Mechanism in Upload Queue

#### Backend
- Structured Error Responses
- HTTP Status Codes (400, 404, 500)
- Console Error Logging
- Graceful Degradation

### Performance Optimizations

#### Client-Side
- Image Compression reduziert Upload-Größe um ~70%
- Background Uploads blockieren Navigation nicht
- Object URL Cleanup verhindert Memory Leaks
- Debounced Form Updates

#### Server-Side
- Database Connection Pooling (max 20)
- Pre-Signed URLs vermeiden Server-Load
- Indexed Queries für schnelle Lookups
- Minimal Response Payloads

#### Storage
- Direct-to-S3 Upload (kein Server-Proxy)
- CDN-ready File Structure
- Timestamped Filenames verhindern Cache-Issues

### Security Considerations

#### Implemented
- Pre-Signed URLs mit 10 Min Timeout
- SSL Database Connection
- CORS Configuration
- SQL Injection Prevention (Parameterized Queries)

#### TODO (Production)
- Authentication/Authorization
- Rate Limiting
- File Type Validation (Backend)
- File Size Limits (Backend)
- Input Sanitization
- CSRF Protection

### Testing Strategy

#### Unit Tests (Empfohlen)
```typescript
// utils/imageCompression.test.ts
describe('compressImage', () => {
  it('should compress image to max dimensions', async () => {
    // ...
  });
});

// utils/uploadQueue.test.ts
describe('UploadQueue', () => {
  it('should retry failed uploads', async () => {
    // ...
  });
});
```

#### Integration Tests (Empfohlen)
```typescript
// api/server.test.js
describe('POST /api/create-order', () => {
  it('should create order and return ID', async () => {
    // ...
  });
});
```

#### E2E Tests (Empfohlen)
```typescript
// e2e/upload-flow.test.ts
describe('Complete Upload Flow', () => {
  it('should upload images and save texts', async () => {
    // ...
  });
});
```

### Monitoring & Logging

#### Recommended Metrics
- Order Creation Rate
- Upload Success/Failure Rate
- Average Upload Time
- Database Query Performance
- S3 Request Latency
- Error Rate by Endpoint

#### Recommended Logs
- Order Creation (Order ID, Timestamp)
- Upload Start/Complete (File Path, Duration)
- API Errors (Endpoint, Error, Stack Trace)
- Database Queries (Query, Duration, Rows)

### Scalability Considerations

#### Current Limits
- Max 20 photos per area
- Max 200 words per text
- Single order per session
- Synchronous upload queue

#### Future Improvements
- Parallel upload processing (Web Workers)
- Chunked file uploads for large files
- Resume incomplete uploads
- Offline support with IndexedDB
- WebSocket for real-time status
- CDN integration for faster delivery

### Code Quality

#### TypeScript Usage
- Strict type checking enabled
- Interfaces for all data structures
- Type-safe API client
- No `any` types (außer wo notwendig)

#### Code Organization
- Clear separation of concerns
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)
- Consistent naming conventions

#### Documentation
- JSDoc comments für alle Public Functions
- README files in jedem Modul
- Inline comments für komplexe Logik
- Type definitions als Dokumentation

