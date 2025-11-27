# Detaillierte Änderungsdokumentation - PDF Upload & DELETE Endpoint

## Übersicht

Diese Dokumentation beschreibt alle Änderungen, die zur Implementierung von PDF-Upload-Funktionalität und einem DELETE-Endpoint für Uploads vorgenommen wurden. Die Änderungen betreffen sowohl das Frontend (Next.js) als auch das Backend (Express.js API).

---

## Problemstellung

### Ursprüngliche Probleme:
1. **PDF-Upload wurde vom Backend abgelehnt**: Backend akzeptierte nur Bilder (JPG, PNG, WebP, GIF), nicht aber PDFs
2. **403 Forbidden beim Laden von Bildern**: S3-Bucket erlaubte keine öffentlichen Reads, was zu 403-Fehlern führte
3. **Fehlender DELETE-Endpoint**: Es gab keine Möglichkeit, hochgeladene Dateien zu löschen

---

## Backend-Änderungen

### 1. Datei: `api/utils/validation.js`

**Änderung:** Neue Funktion für Upload-Validierung hinzugefügt

**Vorher:**
```javascript
export function isValidImageMimeType(mimeType) {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png', 
    'image/webp',
    'image/gif'
  ];
  return allowedTypes.includes(mimeType);
}
```

**Nachher:**
```javascript
// Bestehende Funktion bleibt unverändert
export function isValidImageMimeType(mimeType) { ... }

// NEUE Funktion hinzugefügt:
export function isValidUploadMimeType(mimeType) {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png', 
    'image/webp',
    'image/gif',
    'image/heic',    // NEU
    'image/heif',    // NEU
    'application/pdf' // NEU
  ];
  return allowedTypes.includes(mimeType);
}
```

**Grund:** Separate Funktion für Uploads, die sowohl Bilder als auch PDFs erlaubt, während `isValidImageMimeType()` für andere Zwecke erhalten bleibt.

---

### 2. Datei: `api/middleware/fileValidation.js`

**Änderung:** Upload-Validierung erweitert um PDF-Support

**Vorher:**
```javascript
import { 
  isValidImageMimeType,  // Nur Bilder
  isValidFileSize, 
  sanitizeFilename 
} from '../utils/validation.js';

export function validateFileUpload(mimeType, fileSize, filename) {
  const errors = [];
  if (!isValidImageMimeType(mimeType)) {
    errors.push('Invalid file type. Only images (JPG, PNG, WebP, GIF) are allowed.');
  }
  // ...
}
```

**Nachher:**
```javascript
import { 
  isValidImageMimeType,
  isValidUploadMimeType,  // NEU: Erlaubt Bilder + PDFs
  isValidFileSize, 
  sanitizeFilename 
} from '../utils/validation.js';

export function validateFileUpload(mimeType, fileSize, filename) {
  const errors = [];
  if (!isValidUploadMimeType(mimeType)) {  // GEÄNDERT
    errors.push('Invalid file type. Only images (JPG, PNG, WebP, GIF, HEIC) and PDFs are allowed.');
  }
  // ...
}
```

**Grund:** Die Middleware wird beim `/api/upload-url` Endpoint verwendet und muss jetzt PDFs akzeptieren.

---

### 3. Datei: `api/server.js`

#### 3.1 Import-Änderung

**Vorher:**
```javascript
import { generatePresignedUploadUrl, getPublicUrl, downloadFileFromS3, deleteFileFromS3 } from './s3-client.js';
```

**Nachher:**
```javascript
import { 
  generatePresignedUploadUrl, 
  getPublicUrl, 
  downloadFileFromS3, 
  deleteFileFromS3,
  generatePresignedDownloadUrl  // NEU
} from './s3-client.js';
```

#### 3.2 POST /api/record-upload Endpoint

**Vorher:**
```javascript
// Validate MIME type
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
if (!allowedMimeTypes.includes(mimeType)) {
  return res.status(400).json({
    success: false,
    error: 'Invalid MIME type'
  });
}
```

**Nachher:**
```javascript
// Validate MIME type (images and PDFs)
const allowedMimeTypes = [
  'image/jpeg', 
  'image/jpg', 
  'image/png', 
  'image/webp', 
  'image/gif',
  'image/heic',      // NEU
  'image/heif',      // NEU
  'application/pdf'  // NEU
];
if (!allowedMimeTypes.includes(mimeType)) {
  return res.status(400).json({
    success: false,
    error: 'Invalid MIME type. Only images (JPG, PNG, WebP, GIF, HEIC) and PDFs are allowed.'
  });
}
```

**Grund:** Der Endpoint, der Upload-Metadaten in der DB speichert, muss jetzt PDFs akzeptieren.

#### 3.3 NEU: DELETE /api/delete-upload/:orderId/:uploadId Endpoint

**Vollständiger Code:**
```javascript
/**
 * DELETE /api/delete-upload/:orderId/:uploadId
 * Deletes an upload from database and S3 storage
 */
app.delete('/api/delete-upload/:orderId/:uploadId', uploadLimiter, requireOrderOwnership, async (req, res) => {
  try {
    const { orderId, uploadId } = req.params;

    // Validate UUIDs
    if (!isValidUUID(orderId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID format'
      });
    }

    if (!isValidUUID(uploadId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid upload ID format'
      });
    }

    // Verify upload exists and belongs to the order
    const uploadResult = await query(
      'SELECT id, file_path, order_id FROM uploads WHERE id = $1 AND order_id = $2',
      [uploadId, orderId]
    );

    if (uploadResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Upload not found or does not belong to this order'
      });
    }

    const upload = uploadResult.rows[0];
    const filePath = upload.file_path;

    // Delete from S3 (best effort - don't fail if file doesn't exist in S3)
    try {
      await deleteFileFromS3(filePath);
    } catch (s3Error) {
      // Log error but continue with DB deletion
      console.warn(`Failed to delete file from S3: ${filePath}`, s3Error.message);
      // Don't fail the request if S3 deletion fails - file might already be deleted
    }

    // Delete from database
    await query('DELETE FROM uploads WHERE id = $1', [uploadId]);

    res.json({
      success: true,
      message: 'Upload deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting upload:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete upload'
    });
  }
});
```

**Wichtige Design-Entscheidungen:**
- **Best-Effort S3-Löschung**: Wenn S3-Löschung fehlschlägt, wird trotzdem aus der DB gelöscht (verhindert "Ghost"-Einträge)
- **Order Ownership Check**: Verwendet `requireOrderOwnership` Middleware für Sicherheit
- **UUID-Validierung**: Beide Parameter werden validiert

#### 3.4 NEU: GET /api/download-url/:orderId/:uploadId Endpoint

**Vollständiger Code:**
```javascript
/**
 * GET /api/download-url/:orderId/:uploadId
 * Generate presigned download URL for an uploaded file
 */
app.get('/api/download-url/:orderId/:uploadId', publicLimiter, requireOrderOwnership, async (req, res) => {
  try {
    const { orderId, uploadId } = req.params;

    // Validate UUIDs
    if (!isValidUUID(orderId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID format'
      });
    }

    if (!isValidUUID(uploadId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid upload ID format'
      });
    }

    // Verify upload exists and belongs to the order
    const uploadResult = await query(
      'SELECT id, file_path, order_id FROM uploads WHERE id = $1 AND order_id = $2',
      [uploadId, orderId]
    );

    if (uploadResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Upload not found or does not belong to this order'
      });
    }

    const upload = uploadResult.rows[0];
    const filePath = upload.file_path;

    // Generate presigned download URL (valid for 1 hour)
    const downloadUrl = await generatePresignedDownloadUrl(filePath, 3600);

    res.json({
      success: true,
      downloadUrl,
      expiresIn: 3600
    });
  } catch (error) {
    console.error('Error generating download URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate download URL'
    });
  }
});
```

**Grund:** Lösung für 403 Forbidden Problem - generiert temporäre, signierte URLs für Dateizugriff ohne öffentliche Bucket-Policy.

---

### 4. Datei: `api/s3-client.js`

#### 4.1 Import-Änderung

**Vorher:**
```javascript
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
```

**Nachher:**
```javascript
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
```

#### 4.2 NEU: deleteFileFromS3() Funktion

**Vollständiger Code:**
```javascript
/**
 * Delete a file from S3 storage
 * @param {string} filePath - S3 key/path
 * @returns {Promise<void>}
 */
export async function deleteFileFromS3(filePath) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filePath,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error(`Error deleting file from S3: ${filePath}`, error);
    throw error;
  }
}
```

**Grund:** Wird vom DELETE-Endpoint verwendet, um Dateien aus S3 zu löschen.

#### 4.3 NEU: generatePresignedDownloadUrl() Funktion

**Vollständiger Code:**
```javascript
/**
 * Generate a presigned URL for downloading a file from S3
 * @param {string} filePath - S3 key/path
 * @param {number} expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns {Promise<string>} Presigned URL
 */
export async function generatePresignedDownloadUrl(filePath, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filePath,
  });

  try {
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return presignedUrl;
  } catch (error) {
    console.error('Error generating presigned download URL:', error);
    throw new Error('Failed to generate download URL');
  }
}
```

**Grund:** Generiert temporäre URLs für Dateizugriff, um 403 Forbidden Fehler zu vermeiden.

---

## Frontend-Änderungen

### 1. Datei: `lib/apiClient.ts`

#### 1.1 Interface-Änderung

**Vorher:**
```typescript
export interface DeleteUploadRequest {
  orderId: string;
  uploadId: string;
}

export interface DeleteUploadResponse {
  success: boolean;
  message?: string;
  error?: string;
}
```

**Nachher:**
```typescript
// DeleteUploadRequest entfernt - nicht mehr benötigt

export interface DeleteUploadResponse {
  success: boolean;
  message?: string;
  error?: string;
}
```

**Grund:** Parameter werden jetzt direkt übergeben statt als Objekt.

#### 1.2 deleteUpload() Methode geändert

**Vorher:**
```typescript
async deleteUpload(data: DeleteUploadRequest): Promise<DeleteUploadResponse> {
  try {
    const sessionToken = getCurrentOrderSessionToken();
    const response = await fetch(`${this.baseUrl}/api/delete-upload`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Order-Session': sessionToken || '',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    // ...
  }
}
```

**Nachher:**
```typescript
async deleteUpload(orderId: string, uploadId: string): Promise<DeleteUploadResponse> {
  try {
    const sessionToken = getCurrentOrderSessionToken();
    const response = await fetch(`${this.baseUrl}/api/delete-upload/${orderId}/${uploadId}`, {
      method: 'DELETE',
      headers: {
        'X-Order-Session': sessionToken || '',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || `Server error: ${response.status} ${response.statusText}`,
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting upload:', error);
    return {
      success: false,
      error: 'Network error',
    };
  }
}
```

**Änderungen:**
- URL-Parameter statt Body
- Besseres Error-Handling für nicht-ok Responses
- Kein `Content-Type` Header mehr nötig (kein Body)

#### 1.3 getUploadUrl() Error-Handling verbessert

**Vorher:**
```typescript
const response = await fetch(`${this.baseUrl}/api/upload-url?${params}`, {
  headers: {
    'X-Order-Session': sessionToken || '',
  },
});
return await response.json();
```

**Nachher:**
```typescript
const response = await fetch(`${this.baseUrl}/api/upload-url?${params}`, {
  headers: {
    'X-Order-Session': sessionToken || '',
  },
});

if (!response.ok) {
  const errorData = await response.json().catch(() => ({}));
  return {
    success: false,
    uploadUrl: '',
    filePath: '',
    publicUrl: '',
    error: errorData.error || `Server error: ${response.status} ${response.statusText}`,
  };
}

return await response.json();
```

**Grund:** Bessere Fehlerbehandlung für Backend-Fehler (z.B. 400 bei PDF-Upload).

---

### 2. Datei: `components/forms/MultiStepForm.tsx`

#### 2.1 deleteUpload() Aufruf geändert

**Vorher:**
```typescript
const deleteResponse = await apiClient.deleteUpload({
  orderId: existingOrderId,
  uploadId: uploadId,
});
```

**Nachher:**
```typescript
const deleteResponse = await apiClient.deleteUpload(existingOrderId, uploadId);
```

**Grund:** API-Signatur geändert - direkte Parameter statt Objekt.

---

### 3. Datei: `components/forms/AreaUpload.tsx`

#### 3.1 renderImageCard() verbessert

**Vorher:**
```typescript
const renderImageCard = (item: AreaUploadItem) => (
  <div key={item.id} className="group relative h-36 w-full overflow-hidden rounded-md">
    <img
      src={item.previewUrl}
      alt={`${areaName} Upload ${item.name}`}
      className="h-full w-full object-cover"
      loading="lazy"
    />
    {/* ... */}
  </div>
);
```

**Nachher:**
```typescript
const renderImageCard = (item: AreaUploadItem) => {
  // Use remoteUrl if available (after upload), otherwise previewUrl (local blob)
  const imageUrl = item.remoteUrl || item.previewUrl;
  
  return (
    <div key={item.id} className="group relative h-36 w-full overflow-hidden rounded-md bg-muted">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${areaName} Upload ${item.name}`}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            // Fallback if image fails to load
            console.error(`Failed to load image: ${imageUrl}`);
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            // Show placeholder instead
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.image-placeholder')) {
              const placeholder = document.createElement('div');
              placeholder.className = 'image-placeholder flex h-full w-full flex-col items-center justify-center gap-2 bg-muted p-3';
              placeholder.innerHTML = `
                <svg class="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-xs text-muted-foreground text-center truncate w-full px-2">${item.name}</p>
              `;
              parent.appendChild(placeholder);
            }
          }}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted p-3">
          <ImagePlus className="h-8 w-8 text-muted-foreground" />
          <p className="text-xs text-muted-foreground text-center truncate w-full px-2">{item.name}</p>
        </div>
      )}
      {/* ... */}
    </div>
  );
};
```

**Änderungen:**
- Verwendet `remoteUrl` wenn verfügbar (nach Upload), sonst `previewUrl` (lokaler Blob)
- `onError` Handler für fehlgeschlagene Bildladungen
- Fallback-Placeholder mit Dateiname wenn Bild nicht geladen werden kann
- `bg-muted` als Hintergrund für bessere UX

**Grund:** Behebt das Problem, dass nach Upload ein Fragezeichen statt des Bildes angezeigt wird.

---

## Offene Punkte / Empfehlungen für Review

### 1. S3 Bucket Policy für öffentliche Reads

**Problem:** Aktuell gibt es 403 Forbidden Fehler beim Laden von Bildern, weil der S3-Bucket nicht öffentlich lesbar ist.

**Lösungsoptionen:**

**Option A: Bucket Policy anpassen (einfacher)**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::claverum-bucket/orders/*"
    }
  ]
}
```

**Option B: Presigned URLs verwenden (sicherer, aber mehr Code)**
- Frontend muss `/api/download-url/:orderId/:uploadId` aufrufen
- Presigned URL wird generiert und für Bildanzeige verwendet
- URLs laufen nach 1 Stunde ab (muss neu generiert werden)

**Empfehlung:** Option A für öffentliche Dateien (Bilder/PDFs), Option B nur wenn Sicherheit kritisch ist.

### 2. PDF-Komprimierung

**Aktuell:** PDFs werden nicht komprimiert (nur Bilder).

**Frage:** Sollte es PDF-Komprimierung geben? (z.B. mit PDF.js oder Server-seitig)

### 3. Error-Handling bei S3-Löschung

**Aktuell:** Wenn S3-Löschung fehlschlägt, wird trotzdem aus DB gelöscht (best-effort).

**Frage:** Sollte das anders gehandhabt werden? (z.B. Retry-Logik, Queue für fehlgeschlagene Löschungen)

### 4. Presigned URL Expiration

**Aktuell:** Download-URLs laufen nach 1 Stunde ab.

**Frage:** Ist das ausreichend? Sollte es konfigurierbar sein?

### 5. Frontend: Presigned URLs für Bilder

**Aktuell:** Frontend verwendet direkte S3-URLs (`getPublicUrl()`).

**Empfehlung:** Wenn Bucket nicht öffentlich ist, sollte Frontend presigned URLs verwenden:
- Beim Laden von Uploads aus DB: `/api/download-url/:orderId/:uploadId` aufrufen
- Presigned URL für `<img src>` verwenden

### 6. Rate Limiting

**Aktuell:** DELETE-Endpoint verwendet `uploadLimiter`, Download-Endpoint verwendet `publicLimiter`.

**Frage:** Sind die Limits angemessen?

### 7. CORS-Konfiguration

**Aktuell:** CORS ist für Frontend-Domains konfiguriert.

**Frage:** Muss CORS für S3-Bucket auch angepasst werden, wenn öffentliche Reads aktiviert werden?

---

## Testing-Empfehlungen

### Backend Tests:
1. ✅ PDF-Upload testen (sollte jetzt funktionieren)
2. ✅ DELETE-Endpoint testen (mit gültigem/invaliden UUIDs)
3. ✅ Download-URL-Endpoint testen
4. ✅ S3-Löschung testen (auch wenn Datei nicht existiert)
5. ✅ Order Ownership Check testen (sollte 403 zurückgeben bei falschem Token)

### Frontend Tests:
1. ✅ PDF-Upload im Keller-Bereich testen
2. ✅ Bild-Upload und Anzeige testen (sollte kein Fragezeichen mehr zeigen)
3. ✅ Datei-Löschung testen
4. ✅ Error-Handling bei fehlgeschlagenen Uploads testen

---

## Migration / Deployment

### Backend:
1. Code pushen zu GitHub
2. Railway sollte automatisch deployen
3. Keine DB-Migrationen nötig (nur Code-Änderungen)

### Frontend:
1. Code pushen zu GitHub
2. Netlify sollte automatisch deployen
3. Keine Breaking Changes für bestehende Uploads

---

## Zusammenfassung der Dateien

### Backend (geändert):
- `api/utils/validation.js` - Neue Funktion `isValidUploadMimeType()`
- `api/middleware/fileValidation.js` - Verwendet neue Validierungsfunktion
- `api/server.js` - PDF-Support + DELETE + Download-URL Endpoints
- `api/s3-client.js` - `deleteFileFromS3()` + `generatePresignedDownloadUrl()`

### Frontend (geändert):
- `lib/apiClient.ts` - `deleteUpload()` Signatur geändert, Error-Handling verbessert
- `components/forms/MultiStepForm.tsx` - `deleteUpload()` Aufruf angepasst
- `components/forms/AreaUpload.tsx` - Bildanzeige verbessert mit Fallback

---

## Code-Qualität / Best Practices

### Positiv:
- ✅ Konsistente Error-Handling Patterns
- ✅ UUID-Validierung überall
- ✅ Order Ownership Checks
- ✅ Best-Effort S3-Löschung (verhindert Ghost-Einträge)
- ✅ TypeScript-Typen im Frontend

### Verbesserungspotenzial:
- ⚠️ Presigned URLs sollten im Frontend verwendet werden, wenn Bucket nicht öffentlich ist
- ⚠️ Retry-Logik für fehlgeschlagene S3-Operationen könnte nützlich sein
- ⚠️ Logging könnte detaillierter sein (z.B. welche Dateien gelöscht werden)
- ⚠️ Unit-Tests fehlen (sollten hinzugefügt werden)

---

## Fragen für den Review

1. **S3 Bucket Policy:** Soll der Bucket öffentlich lesbar sein oder presigned URLs verwendet werden?
2. **Error-Handling:** Ist die Best-Effort S3-Löschung akzeptabel oder sollte es strikter sein?
3. **Presigned URL Expiration:** Ist 1 Stunde angemessen oder sollte es konfigurierbar sein?
4. **PDF-Komprimierung:** Sollte es PDF-Komprimierung geben?
5. **Frontend:** Soll das Frontend presigned URLs für Bilder verwenden?

