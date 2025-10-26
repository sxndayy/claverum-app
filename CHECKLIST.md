# 🚀 DEPLOYMENT CHECKLIST - Claverum Production Setup

## 📋 Phase 1: Frontend Deployment (Netlify)
### ✅ Vorbereitung
- [x] Frontend Build erstellt (`npm run build`)
- [x] `dist/` Ordner ist aktuell (14:39 Uhr)

### 🌐 Netlify Setup
- [x] **Gehe zu [netlify.com](https://netlify.com)**
- [x] **Logge dich ein oder erstelle Account**
- [x] **Klicke "Add new site" → "Deploy manually"**
- [x] **Ziehe den `dist/` Ordner** in das Drop-Down-Feld
- [x] **Warte auf Upload (ca. 30 Sekunden)**
- [x] **Notiere die URL:** `https://test-johannes.netlify.app`

### 🔧 Environment Variables (Netlify)
- [ ] **Gehe zu "Site settings" → "Environment variables"**
- [ ] **Füge hinzu:**
  - **Key:** `VITE_API_BASE`
  - **Value:** `https://[railway-url].up.railway.app` (wird später gesetzt)
- [ ] **Klicke "Save"**

---

## 🚂 Phase 2: Backend Deployment (Railway)
### ✅ Vorbereitung
- [x] **Gehe zu [railway.app](https://railway.app)**
- [x] **Logge dich ein mit GitHub**

### 📦 Project Setup
- [x] **Klicke "New Project"**
- [x] **Wähle "Deploy from GitHub repo"**
- [x] **Forke oder erstelle Repository mit deinem Code**
- [x] **Wähle das Repository aus**

### ⚙️ Service Configuration
- [x] **Railway erkennt automatisch Node.js**
- [x] **Root Directory:** `api/` (wichtig!)
- [x] **Build Command:** `npm install`
- [x] **Start Command:** `npm start`

### 🔐 Environment Variables (Railway)
- [x] **Gehe zu "Variables" Tab**
- [x] **Füge hinzu:**
  - **DATABASE_URL:** `postgresql://neondb_owner:npg_v4WnJ7LhjPbT@ep-aged-hill-aeykv76s-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
  - **AWS_ACCESS_KEY_ID:** `[dein-access-key]`
  - **AWS_SECRET_ACCESS_KEY:** `[dein-secret-key]`
  - **AWS_REGION:** `us-east-1`
  - **S3_BUCKET_NAME:** `claverum-uploads`
  - **S3_ENDPOINT:** `https://s3.amazonaws.com`
  - **S3_PUBLIC_URL:** `https://claverum-uploads.s3.amazonaws.com`
  - **NODE_ENV:** `production`
  - **PORT:** `3001`

### 🚀 Deployment
- [x] **Klicke "Deploy"**
- [x] **Warte auf Build (ca. 2-3 Minuten)**
- [x] **Notiere die URL:** `https://claverum-app-production.up.railway.app`

---

## 🔗 Phase 3: Frontend-Backend Verbindung
### 🔄 Environment Variables Update
- [x] **Gehe zurück zu Netlify**
- [x] **Environment Variables → VITE_API_BASE**
- [x] **Ändere Value zu:** `https://claverum-app-production.up.railway.app`
- [x] **Klicke "Save"**
- [x] **Trigger Redeploy** (automatisch)

### 🧪 Connection Test
- [ ] **Öffne deine Netlify URL**
- [ ] **Öffne Browser DevTools (F12)**
- [ ] **Gehe zu Network Tab**
- [ ] **Fülle Formular aus und klicke "Weiter"**
- [ ] **Prüfe:** API Calls gehen an Railway URL
- [ ] **Prüfe:** Keine CORS Errors

---

## 🎯 Phase 4: End-to-End Production Test
### 📝 Form Test
- [ ] **Fülle kompletten Formular aus:**
  - [ ] Adresse: `Musterstraße 123`
  - [ ] PLZ/Stadt: `12345 Musterstadt`
  - [ ] Baujahr: `2020`
  - [ ] Immobilientyp: `Einfamilienhaus`
- [ ] **Klicke "Weiter"**

### 📸 Upload Test (alle Bereiche)
- [ ] **Dach:** Upload 2 Fotos + Text
- [ ] **Fassade:** Upload 1 Foto + Text
- [ ] **Keller:** Upload 1 Foto + Text
- [ ] **Heizung:** Upload 1 Foto + Text
- [ ] **Elektro:** Upload 1 Foto + Text
- [ ] **Innenräume:** Upload 1 Foto + Text

### ✅ Verification
- [ ] **Alle Uploads erfolgreich**
- [ ] **Keine Fehler in Console**
- [ ] **Database Einträge korrekt**
- [ ] **S3 Bilder erreichbar**

---

## 🌍 Phase 5: Custom Domain (Optional)
### 🔧 Domain Setup
- [ ] **Kaufe Domain oder verwende vorhandene**
- [ ] **Gehe zu Netlify → Domain settings**
- [ ] **Füge Custom Domain hinzu**
- [ ] **Konfiguriere DNS Records**
- [ ] **Warte auf SSL Certificate (ca. 5 Min)**

### 🔄 Backend CORS Update
- [ ] **Gehe zu Railway → Environment Variables**
- [ ] **Füge hinzu:**
  - **CORS_ORIGIN:** `https://deine-domain.com`
- [ ] **Redeploy Backend**

---

## 📊 Phase 6: Monitoring & Analytics
### 📈 Performance Monitoring
- [ ] **Netlify Analytics aktivieren**
- [ ] **Railway Metrics prüfen**
- [ ] **Database Performance überwachen**

### 🔍 Error Tracking
- [ ] **Browser Console prüfen**
- [ ] **Railway Logs überwachen**
- [ ] **Database Connection Health**

---

## 🎉 SUCCESS CRITERIA
- [ ] **Frontend läuft auf Netlify**
- [ ] **Backend läuft auf Railway**
- [ ] **API Calls funktionieren**
- [ ] **Uploads gehen an S3**
- [ ] **Database speichert korrekt**
- [ ] **Keine CORS Errors**
- [ ] **Mobile Responsive**
- [ ] **SSL Certificate aktiv**

---

## 🆘 TROUBLESHOOTING
### ❌ Häufige Probleme:
1. **CORS Error:** Backend CORS_ORIGIN prüfen
2. **Upload Failed:** S3 Credentials prüfen
3. **Database Error:** Connection String prüfen
4. **Build Failed:** Dependencies prüfen

### 🔧 Quick Fixes:
- **Redeploy:** Beide Services neu deployen
- **Environment Variables:** Alle nochmal prüfen
- **Logs:** Railway Logs prüfen bei Problemen

---

**🚀 READY TO DEPLOY! Lass uns anfangen!**