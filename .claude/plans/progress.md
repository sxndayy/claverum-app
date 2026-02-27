# Progress — Bauklar.org /start & Funnel Optimierung

> Dieses File wird bei jeder Implementierungsrunde aktualisiert.
> Neuer Context? Lies dieses File zuerst.

## Vorherige Sessions (abgeschlossen)

| # | Task | Status | Notizen |
|---|------|--------|---------|
| 0a | Emoji-Cleanup alle Sections | ✅ complete | Alle Emojis durch Lucide Icons ersetzt |
| 0b | Hardcoded Farben → Design Tokens | ✅ complete | Alle Sections nutzen jetzt CSS Variables |
| 0c | Hero Section Redesign | ✅ complete | Editorial-Stil, Stats-Row, kein Sterne-Widget |
| 0d | Section Background Rhythm | ✅ complete | Alternierend weiss/grau durchgehend |
| 0e | Footer + CTA Redesign | ✅ complete | Dark Footer, focused CTA |
| 0f | References/About Cleanup | ✅ complete | Vereinfachte Stats, Lucide Icons |
| 0g | Floating Chat-Widget | ✅ complete | ChatWidget.tsx erstellt, in page.tsx eingebunden. 3-Step Flow: Nachricht → Name/Email → API-Submit. Anruf-Link im Panel. Nutzt apiClient.sendContactMessage(). 480px Desktop, 640px max-h. |
| 0h | Phone-CTA in Hero Section | ✅ complete | "Fragen? Rufen Sie uns direkt an!" + tel-Link unter Trust-Divider. Dezent (text-text-300, text-base). |
| 0i | Step 4 Funnel: Name + Email Felder | ✅ complete | customerName + customerEmail Inputs ueber Adresse in Zusammenfassung. Validierung + API-Call erweitert. UpdateOrderRequest in apiClient.ts angepasst. Backend muss customer_name/customer_email Felder akzeptieren. |

## Aktueller Plan: 10-Punkte Optimierung

| # | Task | Status | Log | Blocker |
|---|------|--------|-----|---------|
| 1 | Repositionierung: "Erste Verteidigungslinie" Framing | not started | — | — |
| 2 | Problem-Agitation Section einfuegen | not started | — | — |
| 3 | Geld-zurueck-Garantie prominent machen | not started | — | — |
| 4 | Beispiel-Report Section | not started | — | Braucht echten/mockup Report |
| 5 | Anzahlung 87€ Framing ueberall | not started | — | Geklaert: 87,50€ (25% von 350€) |
| 6 | Mobile Trust im Funnel | not started | — | — |
| 7 | Pricing Section Reframe | not started | — | — |
| 8 | Social Proof Externalisierung | not started | — | Drittplattform-Reviews? |
| 9 | Funnel UX Optimierung | not started | — | — |
| 10 | CTA-Strategie & Micro-Commitments | not started | — | — |

## Offene Backend-Themen

| Thema | Status | Details |
|-------|--------|---------|
| Railway Server DNS | ⚠️ intermittent | Server zeigt "Active/Online" auf Railway Dashboard, DNS-Aufloesung schlaegt aber zeitweise fehl. curl-Test hat danach wieder funktioniert. Beobachten. |
| customer_name/customer_email im Backend | ❓ offen | Frontend sendet jetzt customerName + customerEmail im PUT /api/update-order. Backend muss diese Felder akzeptieren und in DB speichern. |

## Neue Dateien seit letzter Session

- `components/start/ChatWidget.tsx` — Floating Chat-Widget (neu erstellt)

## Geaenderte Dateien seit letzter Session

- `app/start/page.tsx` — ChatWidget Import + Rendering
- `components/start/sections/StartHeroSection.tsx` — Phone-CTA hinzugefuegt
- `components/forms/MultiStepForm.tsx` — customerName/customerEmail in FormData, Step 4 UI, Validierung, handleCheckout
- `lib/apiClient.ts` — UpdateOrderRequest um customerName/customerEmail erweitert

## Entry Condition
Plan muss vom User approved werden bevor Implementierung startet.

## Exit Condition
Alle 10 Tasks implementiert, `npx next build` erfolgreich, visuelle Pruefung auf /start und /evaluation.
