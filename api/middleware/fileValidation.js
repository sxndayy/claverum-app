import {
  isValidImageMimeType,
  isValidUploadMimeType,
  isValidFileSize,
  sanitizeFilename
} from '../utils/validation.js';

/**
 * Magic byte signatures for allowed file types.
 * Each entry maps a MIME type to an array of possible magic byte prefixes.
 */
const MAGIC_BYTES = {
  'image/jpeg': [Buffer.from([0xFF, 0xD8, 0xFF])],
  'image/jpg':  [Buffer.from([0xFF, 0xD8, 0xFF])],
  'image/png':  [Buffer.from([0x89, 0x50, 0x4E, 0x47])],
  'application/pdf': [Buffer.from([0x25, 0x50, 0x44, 0x46])], // %PDF
};

/**
 * Validate file content against its declared MIME type using magic bytes.
 * Returns true if the magic bytes match OR if the MIME type has no magic byte check
 * (e.g. WebP, GIF, HEIC — which are validated by MIME type only).
 * @param {Buffer} headBytes - First few bytes of the file
 * @param {string} mimeType - Declared MIME type
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateMagicBytes(headBytes, mimeType) {
  const signatures = MAGIC_BYTES[mimeType];

  // No magic byte check for this type — allow (e.g. webp, gif, heic)
  if (!signatures) {
    return { valid: true };
  }

  if (!headBytes || headBytes.length === 0) {
    return { valid: false, error: 'File is empty or unreadable' };
  }

  const matches = signatures.some(sig =>
    headBytes.length >= sig.length && headBytes.subarray(0, sig.length).equals(sig)
  );

  if (!matches) {
    return { valid: false, error: `File content does not match declared type (${mimeType})` };
  }

  return { valid: true };
}

/**
 * Validate file upload parameters
 */
export function validateFileUpload(mimeType, fileSize, filename) {
  const errors = [];

  // Validate MIME type (images and PDFs)
  if (!isValidUploadMimeType(mimeType)) {
    errors.push('Invalid file type. Only images (JPG, PNG, WebP, GIF, HEIC) and PDFs are allowed.');
  }

  // Validate file size (max 10MB)
  if (!isValidFileSize(fileSize, 10)) {
    errors.push('File size too large. Maximum size is 10MB.');
  }

  // Validate filename
  if (!filename || filename.trim().length === 0) {
    errors.push('Filename is required.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedFilename: sanitizeFilename(filename)
  };
}

/**
 * Check upload limits for an order (non-atomic, for quick validation)
 * Use checkAndReserveUploadSlot for atomic operations
 */
export async function checkUploadLimits(query, orderId, maxUploads = 100) {
  try {
    const uploadCount = await query(
      'SELECT COUNT(*) as count FROM uploads WHERE order_id = $1',
      [orderId]
    );

    const currentCount = parseInt(uploadCount.rows[0].count);
    
    if (currentCount >= maxUploads) {
      return {
        allowed: false,
        error: `Maximum number of uploads (${maxUploads}) reached for this order.`
      };
    }

    return {
      allowed: true,
      currentCount
    };
  } catch (error) {
    console.error('Error checking upload limits:', error);
    return {
      allowed: false,
      error: 'Failed to check upload limits.'
    };
  }
}

/**
 * Atomically check and reserve upload slot using SELECT FOR UPDATE
 * This prevents race conditions when multiple uploads happen simultaneously
 * @param {Function} client - Database client (from transaction)
 * @param {string} orderId - Order UUID
 * @param {number} maxUploads - Maximum uploads allowed
 * @returns {Promise<{allowed: boolean, currentCount?: number, error?: string}>}
 */
export async function checkAndReserveUploadSlot(client, orderId, maxUploads = 100) {
  try {
    // First, verify order exists and lock it to prevent concurrent modifications
    const orderCheck = await client.query(
      'SELECT id FROM orders WHERE id = $1 FOR UPDATE',
      [orderId]
    );
    
    if (orderCheck.rows.length === 0) {
      return {
        allowed: false,
        error: 'Order not found'
      };
    }

    // Now check upload count with lock on the order to ensure atomicity
    const uploadCount = await client.query(
      'SELECT COUNT(*) as count FROM uploads WHERE order_id = $1',
      [orderId]
    );

    const currentCount = parseInt(uploadCount.rows[0].count);
    
    if (currentCount >= maxUploads) {
      return {
        allowed: false,
        error: `Maximum number of uploads (${maxUploads}) reached for this order.`
      };
    }

    return {
      allowed: true,
      currentCount
    };
  } catch (error) {
    console.error('Error checking and reserving upload slot:', error);
    return {
      allowed: false,
      error: 'Failed to check upload limits.'
    };
  }
}
