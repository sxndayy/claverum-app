import { 
  isValidImageMimeType, 
  isValidFileSize, 
  sanitizeFilename 
} from '../utils/validation.js';

/**
 * Validate file upload parameters
 */
export function validateFileUpload(mimeType, fileSize, filename) {
  const errors = [];

  // Validate MIME type
  if (!isValidImageMimeType(mimeType)) {
    errors.push('Invalid file type. Only images (JPG, PNG, WebP, GIF) are allowed.');
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
