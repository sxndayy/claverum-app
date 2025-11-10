# 🧪 Quick Test Guide - Next.js Migration

## ✅ Schritt 1: Dependencies installieren
```bash
cd /Users/henri/Downloads/bauklar-nextjs
npm install
```

## ✅ Schritt 2: Environment Variable setzen

**Für lokales Backend (localhost:3001):**
```bash
# .env.local wird bereits erstellt mit:
NEXT_PUBLIC_API_BASE=http://localhost:3001
```

**Für Production Backend:**
```bash
# Bearbeite .env.local:
NEXT_PUBLIC_API_BASE=https://api.bauklar.org
```

## ✅ Schritt 3: Development Server starten
```bash
npm run dev
```

Öffne: **http://localhost:3000**

## 🔍 Backend-Verbindung prüfen

### Option A: Lokales Backend (localhost:3001)
```bash
# Prüfe ob Backend läuft:
curl http://localhost:3001/health

# Falls Backend nicht läuft:
# 1. Backend starten (im Backend-Verzeichnis)
# 2. Oder Production Backend verwenden (siehe Option B)
```

### Option B: Production Backend (api.bauklar.org)
```bash
# Prüfe Production Backend:
curl https://api.bauklar.org/health

# Falls OK, ändere .env.local:
NEXT_PUBLIC_API_BASE=https://api.bauklar.org
```

## 📋 Test-Checkliste

### ✅ Phase 1: Statische Seiten (funktionieren IMMER)
- [ ] **Homepage** → http://localhost:3000/
- [ ] **City Pages** → http://localhost:3000/berlin, /hamburg, /muenchen
- [ ] **Blog** → http://localhost:3000/blog/hauskauf-beratung
- [ ] **Static Pages** → /impressum, /agb, /datenschutz, /widerruf
- [ ] **404 Page** → http://localhost:3000/nicht-existente-seite

### ⚠️ Phase 2: Forms (benötigen Backend)
- [ ] **Evaluation Form** → http://localhost:3000/evaluation
  - [ ] Alle 9 Steps durchgehen
  - [ ] Form-Validierung testen
  - [ ] **Hinweis:** Foto-Upload funktioniert nur mit Production Backend

### ⚠️ Phase 3: Admin (benötigen Backend)
- [ ] **Admin Login** → http://localhost:3000/admin/login
- [ ] **Admin Dashboard** → http://localhost:3000/admin

## 🐛 Häufige Probleme

### Problem: "Cannot find module"
```bash
npm install
```

### Problem: Backend Connection Error
1. Prüfe Backend: `curl http://localhost:3001/health`
2. Prüfe `.env.local`: `cat .env.local`
3. Restart: `npm run dev`

### Problem: Foto-Upload funktioniert nicht
- **Normal!** Benötigt S3/Cloudflare R2
- Funktioniert nur mit Production Backend
- Andere Form-Felder können lokal getestet werden

## 🎯 Empfohlene Reihenfolge:

1. **Zuerst:** Statische Seiten testen (funktionieren ohne Backend)
2. **Dann:** Backend-Verbindung prüfen
3. **Zuletzt:** Forms & Admin testen

## 📦 Build Test (optional)
```bash
npm run build
# Output in: out/
```

