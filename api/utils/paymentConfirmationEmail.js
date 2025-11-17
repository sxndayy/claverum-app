import { Resend } from 'resend';
import { generateConfirmationNumber, formatDateGerman, formatCurrency } from './confirmationNumber.js';

/**
 * Send payment confirmation email to customer
 * 
 * @param {Object} params
 * @param {Resend} params.resendClient - Resend client instance
 * @param {string} params.customerEmail - Customer email address
 * @param {string|null} params.customerName - Customer full name (optional)
 * @param {string|null} params.customerLastName - Customer last name (optional, used for greeting)
 * @param {string} params.orderNumber - Real order number (UUID from order.id)
 * @param {Date} params.paymentDate - Payment date
 * @param {Date} params.orderDate - Order creation date
 * @param {number} params.amountInCents - Payment amount in cents
 * @param {string} params.orderId - Order UUID (same as orderNumber)
 * @returns {Promise<Object>} Resend API response
 */
export async function sendPaymentConfirmationEmail({
  resendClient,
  customerEmail,
  customerName = null,
  customerLastName = null,
  orderNumber,
  paymentDate,
  orderDate,
  amountInCents,
  orderId
}) {
  if (!resendClient) {
    throw new Error('Resend client not initialized');
  }

  if (!customerEmail) {
    throw new Error('Customer email is required');
  }

  const formattedDate = formatDateGerman(paymentDate);
  const formattedOrderDate = formatDateGerman(orderDate);
  const formattedAmount = formatCurrency(amountInCents);
  
  // Format customer name for greeting - use last name if available, otherwise full name, otherwise generic
  // Use last name for formal greeting (e.g., "Sehr geehrte/r Mustermann,")
  const greeting = customerLastName && customerLastName.trim()
    ? `Sehr geehrte/r ${customerLastName.trim()},`
    : customerName && customerName.trim()
    ? `Sehr geehrte/r ${customerName.trim()},`
    : 'Sehr geehrte/r Kunde/in,';

  // HTML Email Template
  const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Auftragsbestätigung – Ihre Bestellung bei bauklar.org</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #ffffff; padding: 20px;">
    <h1 style="color: #2c3e50; margin-top: 0; font-size: 20px; font-weight: bold;">
      Auftragsbestätigung – Ihre Bestellung bei bauklar.org
    </h1>
    
    <p style="margin: 20px 0; color: #333;">
      ${greeting}
    </p>
    
    <p style="margin: 20px 0; color: #333;">
      vielen Dank für Ihre Bestellung über bauklar.org.
    </p>
    
    <p style="margin: 20px 0; color: #333;">
      Hiermit bestätigen wir den Eingang Ihres Auftrags sowie die Beauftragung gemäß Ihrer Bestellung.
    </p>

    <div style="background-color: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h2 style="color: #2c3e50; margin-top: 0; font-size: 18px; font-weight: bold; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
        Auftragsübersicht
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666; width: 50%;">Bestellnummer:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #2c3e50;">${orderNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Datum der Bestellung:</td>
          <td style="padding: 8px 0; font-weight: bold;">${formattedOrderDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Beauftragte Leistung:</td>
          <td style="padding: 8px 0; font-weight: bold;">Bauschadensbewertung</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Preis:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #27ae60; font-size: 16px;">${formattedAmount} inkl. MwSt.</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Voraussichtliche Bearbeitungszeit:</td>
          <td style="padding: 8px 0; font-weight: bold;">zwei Werktage</td>
        </tr>
      </table>
    </div>

    <p style="margin: 20px 0; color: #333;">
      Mit dieser E-Mail erhalten Sie das kaufmännische Bestätigungsschreiben gemäß den von Ihnen übermittelten Angaben. Sollten wir innerhalb von 48 Stunden keinen Widerspruch Ihrerseits erhalten, gehen wir davon aus, dass alle Daten korrekt sind und der Auftrag wie beschrieben ausgeführt werden soll.
    </p>

    <div style="background-color: #f8f9fa; border-left: 4px solid #3498db; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <h3 style="color: #2c3e50; margin-top: 0; font-size: 16px; font-weight: bold; margin-bottom: 10px;">Nächste Schritte</h3>
      <ul style="color: #666; padding-left: 20px; margin: 10px 0; list-style-type: disc;">
        <li style="margin-bottom: 8px;">Wir beginnen nun mit der Vorbereitung und Durchführung Ihres Auftrags.</li>
        <li style="margin-bottom: 8px;">Sie werden von uns informiert, sobald weitere Schritte erforderlich sind oder das Ergebnis für Sie bereitsteht.</li>
      </ul>
    </div>

    <div style="background-color: #fff9e6; border-left: 4px solid #f39c12; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <h3 style="color: #2c3e50; margin-top: 0; font-size: 16px; font-weight: bold;">Hinweis zur Rechnungsstellung</h3>
      <p style="margin: 0; color: #666;">
        Die Rechnung erhalten Sie separat nach Abschluss bzw. gemäß den vereinbarten Modalitäten.
      </p>
    </div>

    <p style="margin: 20px 0; color: #333;">
      Bei Rückfragen stehen wir Ihnen jederzeit gerne zur Verfügung.
    </p>

    <p style="margin: 20px 0; color: #333;">
      Wir danken Ihnen für Ihr Vertrauen und freuen uns auf die Zusammenarbeit.
    </p>

    <p style="margin: 30px 0 10px 0; color: #333;">
      Mit freundlichen Grüßen<br>
      <strong>Ihr Team bauklar.org</strong>
    </p>

    <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
      <p style="margin: 5px 0;">
        <strong>Bauklar</strong><br>
        Gutachten & Bauschadensbewertung
      </p>
      <p style="margin: 5px 0;">
        Bei Fragen stehen wir Ihnen gerne zur Verfügung:<br>
        <a href="mailto:kontakt@bauklar.org" style="color: #3498db; text-decoration: none;">kontakt@bauklar.org</a><br>
        <a href="tel:+4932221804909" style="color: #3498db; text-decoration: none;">+49 322 21804909</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  // Plain text version for email clients that don't support HTML
  const textContent = `Auftragsbestätigung – Ihre Bestellung bei bauklar.org

${greeting}

vielen Dank für Ihre Bestellung über bauklar.org.

Hiermit bestätigen wir den Eingang Ihres Auftrags sowie die Beauftragung gemäß Ihrer Bestellung.

Auftragsübersicht

• Bestellnummer: ${orderNumber}
• Datum der Bestellung: ${formattedOrderDate}
• Beauftragte Leistung: Bauschadensbewertung
• Preis: ${formattedAmount} inkl. MwSt.
• Voraussichtliche Bearbeitungszeit: zwei Werktage

Mit dieser E-Mail erhalten Sie das kaufmännische Bestätigungsschreiben gemäß den von Ihnen übermittelten Angaben. Sollten wir innerhalb von 48 Stunden keinen Widerspruch Ihrerseits erhalten, gehen wir davon aus, dass alle Daten korrekt sind und der Auftrag wie beschrieben ausgeführt werden soll.

Nächste Schritte:

• Wir beginnen nun mit der Vorbereitung und Durchführung Ihres Auftrags.
• Sie werden von uns informiert, sobald weitere Schritte erforderlich sind oder das Ergebnis für Sie bereitsteht.

Hinweis zur Rechnungsstellung

Die Rechnung erhalten Sie separat nach Abschluss bzw. gemäß den vereinbarten Modalitäten.

Bei Rückfragen stehen wir Ihnen jederzeit gerne zur Verfügung.

Wir danken Ihnen für Ihr Vertrauen und freuen uns auf die Zusammenarbeit.

Mit freundlichen Grüßen

Ihr Team bauklar.org

---
Bauklar - Gutachten & Bauschadensbewertung
Bei Fragen: kontakt@bauklar.org oder +49 322 21804909
`.trim();

  // Get sender email from environment or use default
  const fromEmail = process.env.PAYMENT_CONFIRMATION_FROM_EMAIL || 'Bauklar <kontakt@bauklar.org>';

  try {
    const result = await resendClient.emails.send({
      from: fromEmail,
      to: customerEmail,
      subject: `Auftragsbestätigung – Ihre Bestellung bei bauklar.org`,
      html: htmlContent,
      text: textContent,
    });

    console.log(`✅ Payment confirmation email sent to ${customerEmail} (Order: ${orderNumber})`);
    return result;
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    throw error;
  }
}

