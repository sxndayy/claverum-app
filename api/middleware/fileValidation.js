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
 * Check upload limits for an order
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
