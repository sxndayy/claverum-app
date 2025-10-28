import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

// Initialize S3-compatible client (works with AWS S3, Cloudflare R2, etc.)
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'auto',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

/**
 * Generate a pre-signed URL for direct upload to S3
 * @param {string} orderId - Order UUID
 * @param {string} area - Area name (dach, fassade, keller, etc.)
 * @param {string} filename - Original filename
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<{uploadUrl: string, filePath: string}>}
 */
export async function generatePresignedUploadUrl(orderId, area, filename, mimeType) {
  // Create unique filename with timestamp to avoid duplicates
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `orders/${orderId}/${area}/${timestamp}-${sanitizedFilename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: mimeType,
  });

  try {
    // Generate pre-signed URL valid for 10 minutes
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });
    
    return {
      uploadUrl,
      filePath: key,
    };
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw new Error('Failed to generate upload URL');
  }
}

/**
 * Get the public URL for an uploaded file
 * @param {string} filePath - S3 key/path
 * @returns {string}
 */
export function getPublicUrl(filePath) {
  const publicUrl = process.env.S3_PUBLIC_URL;
  return `${publicUrl}/${filePath}`;
}

export default s3Client;

