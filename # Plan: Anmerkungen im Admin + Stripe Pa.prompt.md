# Plan: Anmerkungen im Admin + Stripe Payment nach Upload

## Problem 1: Anmerkungen nicht im Admin sichtbar

**Analyse:** Der Frontend-Code ist korrekt — `UploadClient.tsx` speichert Notizen via `saveTextsWithToken()` mit `area: "Sonstiges"`, und `AdminOrderDetail.tsx` rendert alle Texte gruppiert nach Area. Das Problem liegt **im Backend**: Entweder lehnt `/api/save-texts` den Upload-Session-Token ab, oder `/api/admin/order/:id` gibt die Texte für Auftrag-Orders nicht zurück. **Das muss backend-seitig debuggt werden** — im Frontend ist alles korrekt verdrahtet.

**Action:** Backend-Prompt ergänzen: "Prüfe, ob `POST /api/save-texts` mit dem Upload-Session-Token (aus `/api/auftrag/upload-session`) funktioniert. Der Token muss die gleichen Rechte haben wie ein normaler Order-Session-Token."

---

## Problem 2: Stripe Payment nach Foto-Upload

**Aktueller Stand:**
- Stripe-Integration existiert: `apiClient.createCheckoutSession(orderId)` → **aber** nutzt `getCurrentOrderSessionToken()` (Evaluation-Storage)
- `/upload` hat einen eigenen `sessionToken` (aus Token-Validierung)
- Success-Screen zeigt aktuell nur "Fotos übermittelt" — kein Payment

**Steps:**

1. **Neue API-Methode in `lib/apiClient.ts`**: `createCheckoutSessionWithToken(orderId, sessionToken)` 
   - Identisch zu `createCheckoutSession`, aber nimmt `sessionToken` als Parameter statt `getCurrentOrderSessionToken()` zu callen
   - Sendet `X-Order-Session: sessionToken` Header

2. **`app/upload/UploadClient.tsx` — Success-State umbauen** (Zeilen 385–406):
   - Statt sofort den simplen Erfolgs-Screen zu zeigen → **zweistufiger Success-State**:
   - **Phase 1 — Bestätigung + Payment-CTA:** Grüner Haken + "Fotos erfolgreich übermittelt!" + Foto-Count + dann darunter: Preis-Info-Box ("Bauklar Ersteinschätzung — 87 € einmalig") + prominenter Button "Jetzt bezahlen & Analyse starten"
   - **Phase 2 — Payment-Loading:** Button wird zum Spinner während Stripe-Session erstellt wird
   - Bei Klick: `createCheckoutSessionWithToken(orderId, sessionToken)` → `window.location.href = response.url` (Stripe Checkout)

3. **Stripe Redirect-Back:** Stripe leitet nach Zahlung zurück zu einer URL. Aktuell für `/evaluation` ist das `/evaluation?session_id=...` → `/success`. Für den Upload-Flow:
   - Option A: Stripe `success_url` auf `/success?session_id={CHECKOUT_SESSION_ID}` setzen — **Backend-Konfiguration**, `/success` Page existiert bereits und zeigt Zahlungsbestätigung
   - Option B: Zurück zu `/upload?paid=true` — aber der Token wäre weg
   - **Option A ist besser** — die existierende `/success` Page passt bereits

4. **State-Management**: Neuer State `isRedirectingToPayment` in UploadClient um doppelte Klicks zu verhindern

**Verification:**
- Upload-Flow durchspielen: Fotos hochladen → Absenden → Bestätigungs-Screen mit Payment-Button sehen
- Payment-Button klickt → Stripe Checkout öffnet → nach Zahlung auf `/success` landen
- Admin-Panel: Fotos, Texte und Payment-Status sichtbar

**Decisions:**
- `createCheckoutSessionWithToken` als neue Methode statt bestehende zu modifizieren — keine Breaking Changes für `/evaluation`
- Stripe `success_url` wird backend-seitig auf `/success` gesetzt — die Success-Page zeigt bereits Payment-Details
- Anmerkungen-Bug ist Backend-Thema (Frontend-Code stimmt)
Der preis ist 350 euro ohne anzahlung, das ändern wir selbst in strip aber passt schon. 