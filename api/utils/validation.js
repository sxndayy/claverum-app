import validator from 'validator';

/**
 * Sanitize and validate input strings
 */
export function sanitizeString(input, maxLength = 255) {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous characters
  let sanitized = input.trim();
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid) {
  return validator.isUUID(uuid);
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  return validator.isEmail(email);
}

/**
 * Validate property type against whitelist
 */
export function isValidPropertyType(propertyType) {
  const allowedTypes = [
    'Einfamilienhaus',
    'Reihenhaus', 
    'Bungalow',
    'Mehrfamilienhaus',
    'Doppelhaushälfte',
    'Eigentumswohnung'
  ];
  
  return allowedTypes.includes(propertyType);
}

/**
 * Validate build year (reasonable range)
 */
export function isValidBuildYear(year) {
  const currentYear = new Date().getFullYear();
  const minYear = 1800;
  
  return year >= minYear && year <= currentYear + 5;
}

/**
 * Validate postal code (German format)
 */
export function isValidPostalCode(postalCode) {
  // German postal codes: 5 digits
  return /^\d{5}$/.test(postalCode);
}

/**
 * Validate area name against whitelist
 */
export function isValidArea(area) {
  const allowedAreas = [
    'Dach',
    'Fassade', 
    'Keller',
    'Heizung',
    'Elektro',
    'Innenräume'
  ];
  
  return allowedAreas.includes(area);
}

/**
 * Validate MIME type for images
 */
export function isValidImageMimeType(mimeType) {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png', 
    'image/webp',
    'image/gif'
  ];
  
  return allowedTypes.includes(mimeType);
}

/**
 * Validate MIME type for uploads (images and PDFs)
 */
export function isValidUploadMimeType(mimeType) {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png', 
    'image/webp',
    'image/gif',
    'image/heic',
    'image/heif',
    'application/pdf'
  ];
  
  return allowedTypes.includes(mimeType);
}

/**
 * Validate file size (in bytes)
 */
export function isValidFileSize(size, maxSizeMB = 10) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return size <= maxSizeBytes;
}

/**
 * Sanitize filename for safe storage
 */
export function sanitizeFilename(filename) {
  if (typeof filename !== 'string') {
    return 'unknown';
  }
  
  // Remove path separators and dangerous characters
  let sanitized = filename.replace(/[\/\\:*?"<>|]/g, '_');
  
  // Remove multiple consecutive underscores
  sanitized = sanitized.replace(/_+/g, '_');
  
  // Remove leading/trailing underscores
  sanitized = sanitized.replace(/^_+|_+$/g, '');
  
  // Limit length
  if (sanitized.length > 100) {
    const ext = sanitized.split('.').pop();
    const name = sanitized.substring(0, 100 - ext.length - 1);
    sanitized = `${name}.${ext}`;
  }
  
  return sanitized || 'file';
}

/**
 * Validate sort field against whitelist
 */
export function isValidSortField(sortField) {
  const allowedFields = [
    'created_at',
    'city', 
    'street',
    'property_type',
    'build_year',
    'updated_at'
  ];
  
  return allowedFields.includes(sortField);
}

/**
 * Validate sort order
 */
export function isValidSortOrder(sortOrder) {
  return ['asc', 'desc'].includes(sortOrder.toLowerCase());
}
