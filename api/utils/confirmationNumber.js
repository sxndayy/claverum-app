/**
 * Generate unique confirmation number
 * Format: GUT-YYYY-MM-DD-XXXXX
 * Example: GUT-2025-01-17-A1B2C
 * 
 * @param {Date} date - Date to use for the confirmation number (defaults to now)
 * @returns {string} Confirmation number in format GUT-YYYY-MM-DD-XXXXX
 */
export function generateConfirmationNumber(date = new Date()) {
  // Format date as YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const datePart = `${year}-${month}-${day}`;
  
  // Generate random alphanumeric suffix (5 characters)
  // Using uppercase letters and numbers
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding I, O, 0, 1 for clarity
  let suffix = '';
  for (let i = 0; i < 5; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `GUT-${datePart}-${suffix}`;
}

/**
 * Format date for display in German format
 * @param {Date} date - Date to format
 * @returns {string} Formatted date (e.g., "17. Januar 2025")
 */
export function formatDateGerman(date) {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'Europe/Berlin'
  };
  return new Intl.DateTimeFormat('de-DE', options).format(date);
}

/**
 * Format currency amount (from cents to euros)
 * @param {number} amountInCents - Amount in cents
 * @returns {string} Formatted amount (e.g., "125,00 €")
 */
export function formatCurrency(amountInCents) {
  const euros = (amountInCents / 100).toFixed(2);
  return `${euros.replace('.', ',')} €`;
}

