# Finalisierung Plan - Stripe Checkout & E-Mail

## ✅ Was bereits funktioniert:
- ✅ Email wird immer abgefragt
- ✅ Email wird in DB gespeichert (`orders.email`)
- ✅ Email wird für Confirmation Mail verwendet
- ✅ Nachname wird für E-Mail Greeting verwendet (wenn vorhanden)
- ✅ Admin Login funktioniert
- ✅ Bestellnummer = komplette Order ID (UUID)

## ❌ Was noch fehlt:
- ❌ Name wird nur abgefragt wenn Coupon eingegeben wird
- ❌ Billing Address wird nur abgefragt wenn Coupon eingegeben wird
- ❌ Name wird nicht immer in DB gespeichert
- ❌ Billing Address wird nicht in DB gespeichert

## 📋 Finalisierung Schritte:

### Schritt 1: Stripe Checkout - Billing Address immer abfragen
**Problem:** `billing_address_collection: 'required'` funktioniert nicht wie erwartet

**Lösung Optionen:**
1. Prüfe Stripe Dashboard Settings → Checkout
2. Verwende `payment_method_types` um bestimmte Payment Methods zu erzwingen
3. Verwende `custom_fields` für Name (falls verfügbar)

**Datei:** `api/routes/payments.js`

### Schritt 2: Billing Address in DB speichern
**Neue Migration erstellen:**
- `billing_address_line1`
- `billing_address_line2`
- `billing_address_city`
- `billing_address_postal_code`
- `billing_address_country`
- `billing_address_state` (optional)

**Datei:** `supabase/migrations/008_add_billing_address.sql`

### Schritt 3: Name und Billing Address im Webhook speichern
**In `api/routes/stripe-webhook.js`:**
- Name aus `customer_details.name` oder `billing_address.name` holen
- Billing Address aus `customer_details.billing_address` holen
- Alles in DB speichern

### Schritt 4: Testen
- Neue Bestellung erstellen
- Stripe Checkout öffnen (OHNE Coupon)
- Prüfen ob Name und Billing Address abgefragt werden
- Zahlung durchführen
- Prüfen ob alles in DB gespeichert wurde
- Prüfen ob E-Mail mit Nachname versendet wurde

## 🔧 Technische Details:

### Stripe Checkout Session:
```javascript
{
  billing_address_collection: 'required', // Sollte immer funktionieren
  // Falls nicht: Prüfe Stripe Dashboard Settings
}
```

### Webhook - Daten speichern:
```javascript
// Name
const customerName = session.customer_details?.name || 
                     session.customer_details?.billing_address?.name;

// Billing Address
const billingAddress = session.customer_details?.billing_address;

// In DB speichern
UPDATE orders SET 
  customer_name = $1,
  billing_address_line1 = $2,
  billing_address_city = $3,
  billing_address_postal_code = $4,
  billing_address_country = $5
WHERE id = $6
```

## 📝 Checkliste:
- [ ] Schritt 1: Stripe Checkout fixen (Billing Address immer abfragen)
- [ ] Schritt 2: Migration für Billing Address erstellen
- [ ] Schritt 3: Webhook erweitern (Name + Billing Address speichern)
- [ ] Schritt 4: Testen (ohne Coupon)
- [ ] Schritt 5: Testen (mit Coupon)
- [ ] Schritt 6: E-Mail prüfen (Nachname wird verwendet)
- [ ] Schritt 7: DB prüfen (alle Daten gespeichert)

