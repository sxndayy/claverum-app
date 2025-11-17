import { Resend } from 'resend';
import { generateConfirmationNumber, formatDateGerman, formatCurrency } from './confirmationNumber.js';

/**
 * Send payment confirmation email to customer
 * 
 * @param {Object} params
 * @param {Resend} params.resendClient - Resend client instance
 * @param {string} params.customerEmail - Customer email address
 * @param {string} params.confirmationNumber - Confirmation number (GUT-YYYY-MM-DD-XXXXX)
 * @param {Date} params.paymentDate - Payment date
 * @param {number} params.amountInCents - Payment amount in cents
 * @param {string} params.orderId - Order UUID
 * @returns {Promise<Object>} Resend API response
 */
export async function sendPaymentConfirmationEmail({
  resendClient,
  customerEmail,
  confirmationNumber,
  paymentDate,
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
  const formattedAmount = formatCurrency(amountInCents);

  // HTML Email Template
  const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zahlungsbestätigung - ${confirmationNumber}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h1 style="color: #2c3e50; margin-top: 0;">Zahlungsbestätigung</h1>
    <p style="margin: 0; color: #666;">Vielen Dank für Ihre Zahlung!</p>
  </div>

  <div style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
    <h2 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
      Ihre Bestätigungsnummer
    </h2>
    <p style="font-size: 24px; font-weight: bold; color: #3498db; letter-spacing: 2px; margin: 20px 0;">
      ${confirmationNumber}
    </p>
    <p style="color: #666; font-size: 14px;">
      Bitte bewahren Sie diese Nummer für Ihre Unterlagen auf.
    </p>
  </div>

  <div style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
    <h2 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
      Zahlungsdetails
    </h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #666; width: 40%;">Zahlungsdatum:</td>
        <td style="padding: 8px 0; font-weight: bold;">${formattedDate}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">Betrag:</td>
        <td style="padding: 8px 0; font-weight: bold; color: #27ae60; font-size: 18px;">${formattedAmount}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">Auftragsnummer:</td>
        <td style="padding: 8px 0; font-family: monospace; font-size: 12px;">${orderId}</td>
      </tr>
    </table>
  </div>

  <div style="background-color: #e8f5e9; border-left: 4px solid #27ae60; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
    <p style="margin: 0; color: #2c3e50;">
      <strong>✅ Zahlung erfolgreich erhalten</strong><br>
      Wir haben Ihre Zahlung erhalten und werden nun mit der Bearbeitung Ihres Auftrags beginnen.
    </p>
  </div>

  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="color: #2c3e50; margin-top: 0;">Nächste Schritte</h3>
    <ul style="color: #666; padding-left: 20px;">
      <li>Sie erhalten in Kürze eine Bestätigung mit weiteren Details</li>
      <li>Unser Team beginnt mit der Analyse Ihres Objekts</li>
      <li>Das Gutachten wird innerhalb von 48 Stunden erstellt</li>
    </ul>
  </div>

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
</body>
</html>
  `.trim();

  // Plain text version for email clients that don't support HTML
  const textContent = `
Zahlungsbestätigung

Vielen Dank für Ihre Zahlung!

Ihre Bestätigungsnummer: ${confirmationNumber}
Bitte bewahren Sie diese Nummer für Ihre Unterlagen auf.

Zahlungsdetails:
- Zahlungsdatum: ${formattedDate}
- Betrag: ${formattedAmount}
- Auftragsnummer: ${orderId}

✅ Zahlung erfolgreich erhalten
Wir haben Ihre Zahlung erhalten und werden nun mit der Bearbeitung Ihres Auftrags beginnen.

Nächste Schritte:
- Sie erhalten in Kürze eine Bestätigung mit weiteren Details
- Unser Team beginnt mit der Analyse Ihres Objekts
- Das Gutachten wird innerhalb von 48 Stunden erstellt

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
      subject: `Zahlungsbestätigung - ${confirmationNumber}`,
      html: htmlContent,
      text: textContent,
    });

    console.log(`✅ Payment confirmation email sent to ${customerEmail} (Confirmation: ${confirmationNumber})`);
    return result;
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    throw error;
  }
}

