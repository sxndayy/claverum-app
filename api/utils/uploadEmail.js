/**
 * Send upload link email to customer after order submission
 * Uses the Bauklar branded HTML template with dynamic customer data.
 * 
 * @param {Object} params
 * @param {import('resend').Resend} params.resendClient - Resend client instance
 * @param {string} params.customerEmail - Customer email address
 * @param {string} params.customerName - Customer full name
 * @param {string|null} params.propertyType - Property type (unused in current template, kept for future use)
 * @param {string|null} params.buildYear - Build year (unused in current template, kept for future use)
 * @param {string} params.street - Street address
 * @param {string} params.postalCode - Postal code
 * @param {string} params.city - City
 * @param {string} params.uploadToken - Secure upload token
 * @returns {Promise<Object>} Resend API response
 */
export async function sendUploadLinkEmail({
  resendClient,
  customerEmail,
  customerName,
  propertyType,
  buildYear,
  street,
  postalCode,
  city,
  uploadToken
}) {
  if (!resendClient) {
    throw new Error('Resend client not initialized');
  }

  if (!customerEmail) {
    throw new Error('Customer email is required');
  }

  const uploadUrl = `https://bauklar.org/upload?token=${uploadToken}`;
  const displayName = customerName && customerName.trim() ? customerName.trim() : 'Kunde/in';
  const addressLine = `${street}, ${postalCode} ${city}`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ihre Bauklar Analyse</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F9FAFB;">
  <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FFFFFF; color: #374151; line-height: 1.5;">
    
    <!-- Logo Area -->
    <div style="margin-bottom: 32px; text-align: center;">
      <div style="font-size: 24px; font-weight: 700; color: #0052A3; letter-spacing: -0.5px;">
        Bauklar
      </div>
    </div>

    <!-- Header -->
    <div style="margin-bottom: 24px;">
      <h1 style="font-size: 32px; font-weight: 700; color: #1A1A1A; margin-bottom: 16px; line-height: 1.3; letter-spacing: -0.5px;">
        Ihre Bauklar Analyse – nächster Schritt
      </h1>
    </div>

    <!-- Greeting -->
    <p style="margin-bottom: 16px; font-size: 16px; color: #374151;">
      Sehr geehrte/r Frau/Herr <strong style="color: #1A1A1A;">${displayName}</strong>,
    </p>

    <p style="margin-bottom: 16px; font-size: 16px; color: #374151;">
      vielen Dank für Ihre Anfrage zur technischen Prüfung des Objekts in <strong style="color: #1A1A1A;">${addressLine}</strong>.
    </p>

    <p style="margin-bottom: 32px; font-size: 16px; color: #374151;">
      Gerne unterstützen wir Sie mit einer strukturierten Bauzustandsanalyse vor Ihrer Kaufentscheidung.
    </p>

    <!-- Primary CTA Section -->
    <div style="background-color: #F9FAFB; padding: 32px 24px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #DCE3E8; text-align: center;">
      <h2 style="font-size: 20px; font-weight: 600; color: #1A1A1A; margin-bottom: 16px; line-height: 1.4;">
        Unterlagen hochladen &amp; Analyse beauftragen
      </h2>
      
      <p style="margin-bottom: 24px; font-size: 16px; color: #374151;">
        Laden Sie Fotos und Dokumente hoch, wählen Sie Ihre gewünschte Variante und schließen Sie die Beauftragung ab.
      </p>

      <a href="${uploadUrl}" style="display: inline-block; background-color: #0052A3; color: #FFFFFF; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; border: none;">
        Zur Upload-Seite
      </a>
    </div>

    <!-- Trust Elements -->
    <div style="margin-bottom: 32px; padding: 16px; text-align: center; font-size: 14px; color: #6B7280;">
      Transparente Bauzustandsanalyse &middot; Klare Handlungsempfehlung &middot; Geld-zurück-Garantie
    </div>

    <!-- Timeline Info -->
    <p style="font-size: 14px; color: #6B7280; margin-bottom: 40px; text-align: center;">
      Bearbeitung startet nach Eingang der Unterlagen. Fertigstellung in der Regel innerhalb von <strong style="color: #1A1A1A;">48 Stunden</strong>.
    </p>

    <!-- Section: Varianten -->
    <div style="margin-bottom: 32px;">
      <h2 style="font-size: 24px; font-weight: 600; color: #1A1A1A; margin-bottom: 20px; line-height: 1.3;">
        Welche Variante passt zu Ihrer Situation?
      </h2>

      <!-- Bauklar Analyse -->
      <div style="border: 1px solid #DCE3E8; border-radius: 8px; padding: 24px; margin-bottom: 16px; background-color: #FFFFFF; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
        <h3 style="font-size: 18px; font-weight: 600; color: #1A1A1A; margin-bottom: 8px;">
          Bauklar Analyse – 350 €
        </h3>
        <p style="margin-bottom: 12px; font-size: 16px; color: #374151;">
          Technische Bauzustandsanalyse mit strukturierter Risikoeinschätzung und groben Kostenspannen.
        </p>
        <p style="font-size: 14px; color: #6B7280;">
          Geeignet für fundierte technische Zweitmeinung.
        </p>
      </div>

      <!-- Bauklar Intensiv -->
      <div style="border: 2px solid #0052A3; border-radius: 8px; padding: 24px; margin-bottom: 16px; background-color: #F9FAFB; box-shadow: 0 1px 3px rgba(0, 82, 163, 0.1);">
        <h3 style="font-size: 18px; font-weight: 600; color: #1A1A1A; margin-bottom: 8px;">
          Bauklar Intensiv – 790 €
        </h3>
        <p style="margin-bottom: 12px; font-size: 16px; color: #374151;">
          Vertiefte Analyse inklusive Priorisierung der Risiken, Einschätzung zur Verhandlungsrelevanz 
          sowie 45-minütigem persönlichen Video-Gespräch.
        </p>
        <p style="font-size: 14px; color: #6B7280;">
          Geeignet für maximale Klarheit vor verbindlicher Kaufentscheidung.
        </p>
      </div>

      <div style="background-color: #F9FAFB; border: 1px solid #DCE3E8; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <p style="margin-bottom: 0; font-size: 14px; color: #374151;">
          <strong style="color: #1A1A1A;">100 % Geld-zurück-Garantie</strong> innerhalb von 48 Stunden nach Erhalt des Berichts.
        </p>
      </div>

      <div style="border-left: 4px solid #0052A3; background-color: #F9FAFB; padding: 16px; margin-bottom: 16px;">
        <p style="margin-bottom: 0; font-size: 14px; color: #374151;">
          <strong style="color: #1A1A1A;">Wichtig:</strong> Kein Verkehrswertgutachten, keine Kaufpreisbewertung. 
          Fokus liegt ausschließlich auf dem technischen Zustand der Immobilie.
        </p>
      </div>
    </div>

    <!-- Section: Alternative -->
    <div style="margin-bottom: 32px;">
      <h2 style="font-size: 20px; font-weight: 600; color: #1A1A1A; margin-bottom: 16px;">
        Alternative Übermittlung per E-Mail
      </h2>

      <p style="margin-bottom: 12px; font-size: 16px; color: #374151;">
        Alternativ senden Sie Fotos und Dokumente direkt an:
      </p>

      <p style="margin-bottom: 16px; font-size: 16px; font-weight: 500;">
        <a href="mailto:kontakt@bauklar.org" style="color: #33B5FF; text-decoration: none;">
          kontakt@bauklar.org
        </a>
      </p>

      <p style="font-size: 14px; color: #6B7280;">
        Sie erhalten den Zahlungslink anschließend separat.
      </p>
    </div>

    <!-- Closing -->
    <div style="margin-bottom: 32px;">
      <p style="margin-bottom: 0; font-size: 16px; color: #374151;">
        Bei Fragen zur passenden Variante antworten Sie gerne direkt auf diese E-Mail.
      </p>
    </div>

    <!-- Signature -->
    <div style="border-top: 1px solid #DCE3E8; padding-top: 24px; margin-top: 40px;">
      <p style="margin-bottom: 4px; font-size: 16px; color: #374151;">Mit freundlichen Grüßen</p>
      <p style="margin-bottom: 12px; font-size: 18px; font-weight: 600; color: #1A1A1A;">
        Dr. Johannes Stankiewicz
      </p>
      <p style="font-size: 14px; color: #6B7280; margin-bottom: 2px;">
        Diplom-Sachverständiger (DIA)
      </p>
      <p style="font-size: 14px; color: #6B7280; margin-bottom: 12px;">
        Mitglied BVS
      </p>
      <p style="font-size: 14px;">
        <a href="https://www.bauklar.org" style="color: #33B5FF; text-decoration: none;">
          www.bauklar.org
        </a>
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();

  const textContent = `Ihre Bauklar Analyse – nächster Schritt

Sehr geehrte/r Frau/Herr ${displayName},

vielen Dank für Ihre Anfrage zur technischen Prüfung des Objekts in ${addressLine}.

Gerne unterstützen wir Sie mit einer strukturierten Bauzustandsanalyse vor Ihrer Kaufentscheidung.

--- Unterlagen hochladen & Analyse beauftragen ---

Laden Sie Fotos und Dokumente hoch, wählen Sie Ihre gewünschte Variante und schließen Sie die Beauftragung ab:

${uploadUrl}

Transparente Bauzustandsanalyse · Klare Handlungsempfehlung · Geld-zurück-Garantie

Bearbeitung startet nach Eingang der Unterlagen. Fertigstellung in der Regel innerhalb von 48 Stunden.

--- Welche Variante passt zu Ihrer Situation? ---

Bauklar Analyse – 350 €
Technische Bauzustandsanalyse mit strukturierter Risikoeinschätzung und groben Kostenspannen.
Geeignet für fundierte technische Zweitmeinung.

Bauklar Intensiv – 790 €
Vertiefte Analyse inklusive Priorisierung der Risiken, Einschätzung zur Verhandlungsrelevanz sowie 45-minütigem persönlichen Video-Gespräch.
Geeignet für maximale Klarheit vor verbindlicher Kaufentscheidung.

100 % Geld-zurück-Garantie innerhalb von 48 Stunden nach Erhalt des Berichts.

Wichtig: Kein Verkehrswertgutachten, keine Kaufpreisbewertung. Fokus liegt ausschließlich auf dem technischen Zustand der Immobilie.

--- Alternative Übermittlung per E-Mail ---

Alternativ senden Sie Fotos und Dokumente direkt an: kontakt@bauklar.org
Sie erhalten den Zahlungslink anschließend separat.

Bei Fragen zur passenden Variante antworten Sie gerne direkt auf diese E-Mail.

Mit freundlichen Grüßen
Dr. Johannes Stankiewicz
Diplom-Sachverständiger (DIA)
Mitglied BVS
www.bauklar.org
`.trim();

  const fromEmail = process.env.UPLOAD_EMAIL_FROM || process.env.PAYMENT_CONFIRMATION_FROM_EMAIL || 'Bauklar <kontakt@bauklar.org>';

  try {
    const result = await resendClient.emails.send({
      from: fromEmail,
      to: customerEmail,
      replyTo: 'kontakt@bauklar.org',
      subject: 'Ihre Bauklar Analyse – nächster Schritt',
      html: htmlContent,
      text: textContent,
    });

    console.log(`✅ Upload link email sent to ${customerEmail} (Token: ${uploadToken.substring(0, 8)}...)`);
    return result;
  } catch (error) {
    console.error('Error sending upload link email:', error);
    throw error;
  }
}
