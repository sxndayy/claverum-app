# Form Components Analyse - Altes Projekt

## 1. Liste aller Form Components

### Haupt-Forms:
1. **MultiStepForm.tsx** (`src/components/MultiStepForm.tsx`)
   - Hauptformular für Bauschadensbewertung
   - 9 Steps: Objekt-Basics → 6 Areas → Produkt → Checkout → Receipt
   - Verwendet: AreaUpload, UploadStatus, apiClient, uploadQueue, orderManager

2. **ContactSection.tsx** (`src/components/ContactSection.tsx`)
   - Kontaktformular auf Homepage
   - Felder: name, email, phone (optional), message
   - API: `/api/contact` (POST)

3. **AdminLogin.tsx** (`src/pages/AdminLogin.tsx`)
   - Admin Login Formular
   - Felder: username, password
   - API: `/api/auth/login` (POST)

4. **AdminOrderDetail.tsx** (`src/components/AdminOrderDetail.tsx`)
   - Admin Form für Order Details
   - Felder: note (Textarea)
   - API: `/api/order/{orderId}/note` (PUT)

### Unterstützende Components:
5. **AreaUpload.tsx** (`src/components/AreaUpload.tsx`)
   - Upload-Komponente für Bilder pro Area
   - Drag & Drop Support
   - Textarea für zusätzliche Informationen
   - Max 20 Fotos, Max 200 Wörter

6. **UploadStatus.tsx** (`src/components/UploadStatus.tsx`)
   - Status-Anzeige für laufende Uploads
   - Zeigt Progress, Completed, Failed Tasks

### Utility Files:
7. **uploadQueue.ts** (`src/utils/uploadQueue.ts`)
   - Queue Manager für Background-Uploads
   - Retry Logic, Compression, Concurrent Uploads

8. **orderManager.ts** (`src/utils/orderManager.ts`)
   - Session Storage Management für Orders
   - Speichert: orderId, sessionToken

9. **apiClient.ts** (`src/utils/apiClient.ts`)
   - API Client für alle Backend-Calls
   - Railway Backend APIs

---

## 2. API Endpoints

### Order Management:
- `POST /api/create-order`
  - Erstellt neuen Order
  - Returns: `{ success, orderId, sessionToken, createdAt }`

- `PUT /api/update-order/{orderId}`
  - Aktualisiert Order-Daten
  - Headers: `X-Order-Session: {sessionToken}`
  - Body: `{ street, houseNumber, postalCode, city, propertyType, buildYear }`

- `GET /api/order/{orderId}`
  - Holt Order Details mit Uploads und Texts

- `DELETE /api/order/{orderId}`
  - Löscht Order (Admin only)
  - Headers: `Authorization: Bearer {token}`, `X-CSRF-Token: {csrfToken}`

### File Upload (S3):
- `GET /api/upload-url?orderId={id}&area={area}&filename={name}&mimeType={type}`
  - Holt Pre-signed S3 Upload URL
  - Headers: `X-Order-Session: {sessionToken}`
  - Returns: `{ success, uploadUrl, filePath, publicUrl }`

- `PUT {uploadUrl}` (direkt zu S3)
  - Upload File direkt zu S3
  - Body: File (binary)
  - Headers: `Content-Type: {mimeType}`

- `POST /api/record-upload`
  - Speichert Upload-Metadaten in Database
  - Headers: `X-Order-Session: {sessionToken}`
  - Body: `{ orderId, area, filePath, mimeType, fileSize }`

### Text/Beschreibungen:
- `POST /api/save-texts`
  - Speichert Text-Beschreibungen pro Area
  - Headers: `X-Order-Session: {sessionToken}`
  - Body: `{ orderId, area, content }`

### Payment (Stripe):
- `POST /api/payments/create-checkout-session`
  - Erstellt Stripe Checkout Session
  - Headers: `X-Order-Session: {sessionToken}`
  - Body: `{ orderId }`
  - Returns: `{ success, url }`

- `GET /api/payments/session?session_id={id}`
  - Holt Stripe Session Details nach Payment
  - Returns: `{ success, session }`

### Contact:
- `POST /api/contact`
  - Sendet Kontaktformular-Nachricht
  - Body: `{ name, email, phone?, message }`
  - Returns: `{ success, message?, error? }`

### Admin/Auth:
- `POST /api/auth/login`
  - Admin Login
  - Body: `{ username, password }`
  - Returns: `{ success, token, user, error }`
  - Headers: `X-CSRF-Token` (aus Response)

- `GET /api/auth/verify`
  - Verifiziert Token
  - Headers: `Authorization: Bearer {token}`
  - Returns: `{ success, user, error }`

- `POST /api/auth/logout`
  - Logout
  - Headers: `Authorization: Bearer {token}`

- `GET /api/orders`
  - Liste aller Orders (Admin)
  - Query Params: `page, limit, search, propertyType, city, paid, sortBy, sortOrder`
  - Headers: `Authorization: Bearer {token}`

- `GET /api/admin/stats`
  - Admin Statistics
  - Headers: `Authorization: Bearer {token}`

- `GET /api/export/{orderId}`
  - Export Order als ZIP
  - Headers: `Authorization: Bearer {token}`

- `PUT /api/order/{orderId}/note`
  - Update Admin Note
  - Headers: `Authorization: Bearer {token}`, `X-CSRF-Token: {csrfToken}`
  - Body: `{ note }`

---

## 3. File Uploads

### Upload-Prozess:
1. **Image Compression** (`compressImage`)
   - Max Width: 1600px
   - Max Height: 1600px
   - Quality: 0.8

2. **Get Pre-signed URL** (`/api/upload-url`)
   - Parameter: orderId, area, filename, mimeType
   - Returns: uploadUrl (S3), filePath, publicUrl

3. **Upload to S3** (`PUT {uploadUrl}`)
   - Direkt zu AWS S3
   - Body: compressed File
   - Headers: Content-Type

4. **Record Upload** (`/api/record-upload`)
   - Speichert Metadaten in Neon Database
   - Returns: uploadId, publicUrl

### Upload Areas:
- **Keller** (Step 2)
- **Elektro** (Step 3)
- **Heizung** (Step 4)
- **Fassade** (Step 5)
- **Dach** (Step 6)
- **Innenräume** (Step 7)

### File Types:
- **Images**: `image/*` (jpeg, png, etc.)
- **PDFs**: Grundrisse, Energieausweise (über AreaUpload)

### Upload Queue:
- Max Concurrent Uploads: 3
- Max Retries: 2
- Background Processing (nicht blockierend)
- Progress Tracking

### Storage:
- **AWS S3** für File Storage
- **Neon Database** für Metadaten (file_path, mime_type, file_size, area, order_id)

---

## 4. Backend Stack

- **Railway**: Backend Hosting
- **AWS S3**: File Storage
- **Neon Database**: PostgreSQL Database
- **Stripe**: Payment Processing

---

## 5. Session Management

### Order Session:
- `sessionStorage` für Order-Daten
- Keys:
  - `claverum_order_id`
  - `claverum_order_session_token`
  - `claverum_order_data`

### Auth Session:
- `localStorage` für Auth Token
- Managed durch `authManager`

---

## 6. Wichtige Dependencies

- `react-router-dom`: Navigation (`useNavigate`)
- `lucide-react`: Icons
- `@radix-ui/*`: UI Components
- Custom Hooks: `useToast`, `useRouter` (Next.js)

---

## 7. Utility Files Details

### imageCompression.ts:
- Client-side Image Compression
- Max Width: 1600px, Max Height: 1600px
- Quality: 0.8
- Output: JPEG
- Funktionen: `compressImage()`, `compressImages()`, `getCompressionRatio()`

### authManager.ts:
- JWT Token Management
- localStorage Keys: `claverum_admin_token`, `claverum_admin_user`
- Funktionen: `setToken()`, `getToken()`, `setUser()`, `getUser()`, `isAuthenticated()`, `logout()`, `getAuthHeader()`, `isAdmin()`

### orderManager.ts:
- Session Storage für Orders
- Keys: `claverum_order_id`, `claverum_order_session_token`, `claverum_order_data`
- Funktionen: `getCurrentOrderId()`, `getCurrentOrderSessionToken()`, `setCurrentOrder()`, `getOrderData()`, `updateOrderTimestamp()`, `clearOrderSession()`, `hasActiveOrder()`

---

## Migration Notes:

### WICHTIG: EXAKT GLEICH MIGRIEREN!

1. **"use client"** hinzufügen zu allen Form Components
2. **useNavigate** → **useRouter** (Next.js) - nur Navigation ändern
3. **API Calls UNVERÄNDERT lassen** - alle Endpoints bleiben gleich
4. **uploadQueue, orderManager, apiClient, authManager, imageCompression** müssen 1:1 migriert werden
5. **Session Storage** bleibt gleich (client-side)
6. **Keine Änderungen an API Request/Response Strukturen**
7. **Keine Änderungen an Upload-Flow**
8. **Keine Änderungen an Stripe Integration**

### Zu migrierende Files:

**Forms:**
- `src/components/MultiStepForm.tsx` → `components/forms/MultiStepForm.tsx`
- `src/components/ContactSection.tsx` → `components/sections/ContactSection.tsx` (bereits migriert)
- `src/pages/AdminLogin.tsx` → `app/admin/login/page.tsx`
- `src/components/AdminOrderDetail.tsx` → `components/admin/AdminOrderDetail.tsx`

**Supporting Components:**
- `src/components/AreaUpload.tsx` → `components/forms/AreaUpload.tsx`
- `src/components/UploadStatus.tsx` → `components/forms/UploadStatus.tsx`

**Utils:**
- `src/utils/apiClient.ts` → `lib/apiClient.ts` (bereits teilweise migriert)
- `src/utils/uploadQueue.ts` → `lib/uploadQueue.ts`
- `src/utils/orderManager.ts` → `lib/orderManager.ts`
- `src/utils/authManager.ts` → `lib/authManager.ts`
- `src/utils/imageCompression.ts` → `lib/imageCompression.ts`

**Pages:**
- `src/pages/Evaluation.tsx` → `app/evaluation/page.tsx`
- `src/pages/Success.tsx` → `app/success/page.tsx`
- `src/pages/Admin.tsx` → `app/admin/page.tsx`

