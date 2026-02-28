import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
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

/**
 * Generate a presigned URL for downloading a file from S3
 * @param {string} filePath - S3 key/path
 * @param {number} expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns {Promise<string>} Presigned URL
 */
export async function generatePresignedDownloadUrl(filePath, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filePath,
  });

  try {
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return presignedUrl;
  } catch (error) {
    console.error('Error generating presigned download URL:', error);
    throw new Error('Failed to generate download URL');
  }
}

/**
 * Download a file from S3 storage
 * @param {string} filePath - S3 key/path
 * @returns {Promise<Buffer>} - File content as Buffer
 */
export async function downloadFileFromS3(filePath) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filePath,
  });

  try {
    const response = await s3Client.send(command);
    
    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    
    return Buffer.concat(chunks);
  } catch (error) {
    console.error(`Error downloading file from S3: ${filePath}`, error);
    throw error;
  }
}

/**
 * Delete a file from S3 storage
 * @param {string} filePath - S3 key/path
 * @returns {Promise<void>}
 */
export async function deleteFileFromS3(filePath) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filePath,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error(`Error deleting file from S3: ${filePath}`, error);
    throw error;
  }
}

/**
 * Read the first N bytes of a file from S3 (for magic byte validation)
 * @param {string} filePath - S3 key/path
 * @param {number} bytes - Number of bytes to read (default: 8)
 * @returns {Promise<Buffer>} First N bytes
 */
export async function readFileHeadFromS3(filePath, bytes = 8) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filePath,
    Range: `bytes=0-${bytes - 1}`,
  });

  try {
    const response = await s3Client.send(command);
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  } catch (error) {
    console.error(`Error reading file head from S3: ${filePath}`, error);
    throw error;
  }
}

export default s3Client;

