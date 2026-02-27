# Discovery — Bauklar.org /start & Funnel Optimierung

## Kontext
Deep Research Analyse + Codebase-Exploration fuer einen 10-Punkte-Plan zur Kundengewinnung.

---

## Q&A (Selbst-Discovery aus Deep Research + Codebase)

### Scope & Ziele

**Q1: Was ist das primaere Ziel?**
A: Langfristig mehr Kunden ueber /start und den Evaluation-Funnel gewinnen. Kein neues Produkt, kein Video, kein guenstigeres Paket. Fokus auf Frontend-Optimierung und Conversion.

**Q2: Welche Seiten sind im Scope?**
A: /start (Landing Page), /evaluation (Funnel), /success. NICHT die Main Page (/), nicht die Blog-Posts, nicht die City-Pages (vorerst).

**Q3: Was ist die aktuelle Conversion-Situation?**
A: 500€ Google Ads brachten ~100 Klicks, 0 Conversions. Deep Research identifiziert: Cold Traffic + hohe Einstiegshuerde (350€ Gutachten direkt verkaufen) + fehlendes Vertrauen als Ursache.

**Q4: Was ist die Pricing-Strategie?**
A: 350€ Pauschal, 25% Anzahlung = 87,50€ (auf Website steht 82,50€ — Diskrepanz!). User will KEIN guenstigeres Paket, sondern die 87€ Anzahlung prominenter promoten.

### Zielgruppe & Psychologie

**Q5: Wer ist der typische Kunde?**
A: Immobilienkaeufer (privat), oft Erstkauf, 30-50 Jahre, deutschlandweit. Grosse Angst vor versteckten Maengeln. Sucht Sicherheit, nicht Speed.

**Q6: Was ist die "German Angst" Barriere?**
A: Deep Research beschreibt: Der deutsche Kaeufer vertraut physischer Praesenz ("Handschlagqualitaet"). Ein rein digitales Gutachten fuer 350€ wirkt "oberflaeechlich" und "zu billig". Der Preis ist in der "Dead Zone" — zu teuer fuer Impuls, zu billig fuer Premium-Signal.

**Q7: Wie sucht der Kunde?**
A: NICHT nach "Baugutachter online". Sucht nach PROBLEMEN: "Riss in Kellerwand gefaehrlich?", "Feuchter Fleck Decke Ursache", "Kosten Dachsanierung Altbau". Bauklar fangt den Kunden zu spaet im Funnel ab.

**Q8: Was denkt der Kunde ueber den Preis?**
A: Invertierter Veblen-Effekt: 350€ vs. 800-2500€ traditionell → "Was fehlt hier?". Loesung: Klare Positionierung als "Erste Verteidigungslinie" vor dem teuren Gutachter, nicht als Ersatz.

### Technische Constraints

**Q9: Welche Tech wird genutzt?**
A: Next.js 14 (App Router, Static Export), Tailwind CSS, shadcn/ui, Radix, Lucide. Deployed auf Netlify. Backend auf Railway (API).

**Q10: Ist die /start Seite indexiert?**
A: NEIN! robots: noindex, nofollow. Das ist ein Problem — die Seite ist fuer Google unsichtbar. Nur die Main Page (/) ist indexiert.

**Q11: Wie funktioniert der Funnel technisch?**
A: 4-Step Wizard: Objekttyp → Baujahr → Foto-Upload → Zusammenfassung/Checkout. SessionStorage-basiert. Stripe-Checkout fuer Zahlung. Kein Email-Capture vor Checkout.

**Q12: Gibt es Lead-Capture?**
A: NEIN. Kein Newsletter, kein PDF-Download, kein Email-Gate. Einziger Lead-Capture: Kontaktformular. Der Funnel sammelt KEINE Email bevor Stripe.

### Wettbewerb & Markt

**Q13: Wer sind die Hauptkonkurrenten?**
A: Tier 1: VPB, TUeV (institutionell). Tier 2: Bauexperts, DEKRA (hybrid, stark lokal). Tier 3: Bauklar (digital niche). Bauexperts dominiert durch hyper-lokale Landingpages.

**Q14: Was macht Bauexperts besser?**
A: Hyper-Lokalitaet. Jede Stadt hat eigene Seite mit lokalem Experten-Gefuehl. "Sachverstand. Ganz nah!" Bauklar tritt als monolithische Online-Instanz auf.

**Q15: Was fehlt bei allen Konkurrenten?**
A: Schnelle, digitale Ersteinschaetzung. Kein Konkurrent bietet eine "Foto-basierte Vorab-Pruefung" an. Das ist der USP.

### Aktuelle Website-Schwaechen (aus Deep Research + Analyse)

**Q16: Was sind die groessten Trust-Probleme?**
A: Keine verifizierbaren Reviews auf Drittplattformen. "500 zufriedene Kunden" nicht extern nachpruefbar. Kein Trustpilot, keine Google Reviews. Deutsche Kunden googeln "Bauklar Erfahrungen" und finden nichts.

**Q17: Was fehlt im Funnel?**
A: Kein Micro-Commitment vor dem grossen 350€ Schritt. Kein "Tripwire" Angebot. Kein Email-Capture. Kein Retargeting moeglich (keine Email = Besucher ist weg).

**Q18: Wie ist der aktuelle Funnel-Flow psychologisch?**
A: Problematisch. Step 1-3 sammeln Daten, Step 4 zeigt ploetzlich 82,50€. Kein "Aufwaermen" dazwischen. Keine Geld-zurueck-Garantie prominent. Kein Social Proof im Funnel selbst (nur in Sidebar, nur Desktop).

**Q19: Was ist mit der Hero Section?**
A: Wurde bereits redesignt (vorherige Session). Headline: "Bauschaeden erkennen — bevor Sie kaufen." Stats: 350€/48h/500+. CTA: "Jetzt Bewertung starten". Micro-Copy: "Ab 82,50€ Anzahlung". Solide, aber Optimierungspotential.

**Q20: Was ist die groesste verpasste Chance?**
A: Die Positionierung. Website sagt "Wir bewerten Fotos". Sollte sagen: "Die erste Verteidigungslinie vor Ihrem Hauskauf." Framing als Filter/Vorab-Check statt als Ersatz fuer Vor-Ort-Gutachter.

### Annahmen die hinterfragt werden muessen

**Q21: Stimmen die 500+ Kunden?**
A: Unklar. Wenn ja, muessen sie externalisiert werden (Trustpilot/Google). Wenn nein, muss die Zahl angepasst werden. Aktuell nicht verifizierbar.

**Q22: Ist 82,50€ oder 87,50€ die Anzahlung?**
A: Auf der Website steht 82,50€ (25% von 330€?). User sagte 87€. Wenn 350€ * 25% = 87,50€. Die Website zeigt den falschen Betrag!

**Q23: Warum ist /start noindex?**
A: Vermutlich als Ads-Landingpage gedacht, getrennt von der organischen Main Page. Aber das bedeutet, organische SEO-Kraft geht verloren. Strategie-Frage ob /start und / vereinigt werden sollten.

**Q24: Reichen die 2 Blog-Posts?**
A: Definitiv nicht. Deep Research empfiehlt 20+ Artikel in Themen-Clustern. Aktuell nur "Hauskauf Beratung" und "Schimmel als Bauschaden".

**Q25: Fehlt eine Geld-zurueck-Garantie?**
A: Im FAQ steht "14-Tage Widerrufsrecht". Aber es ist NICHT prominent auf der Landingpage. Deep Research empfiehlt es als Trust-Signal Nr. 1.

### Entscheidungen die getroffen wurden

**Q26: Kein Video — warum?**
A: User-Entscheidung. Deep Research empfiehlt stark ein Video von Dr. Stankiewicz. User will es nicht. Muessen alternative Trust-Signale finden.

**Q27: Kein guenstigeres Paket — warum?**
A: User-Entscheidung. Deep Research empfiehlt 49€ Schnellcheck. User will stattdessen 87€ Anzahlung promoten. Anpassung: "Ab 87€" statt neue Produktlinie.

**Q28: Was bedeutet "naechstes Level"?**
A: Interpretation: Von "funktionaler Website" zu "konversionoptimierter Vertrauensmaschine". Mehr Kunden durch bessere UX, besseres Framing, bessere Trust-Signale, bessere Funnel-Psychologie.

### Success Criteria

**Q29: Wie messen wir Erfolg?**
A: Primaer: Mehr Funnel-Starts (CTA-Klicks). Sekundaer: Hoeherer Funnel-Completion (Step 1 → Checkout). Tertiaer: Niedrigere Bounce Rate auf /start.

**Q30: Was ist der Zeithorizont?**
A: "Langfristig" — User denkt in Monaten, nicht Tagen. Plan sollte priorisiert sein (Quick Wins vs. strategische Aenderungen).
