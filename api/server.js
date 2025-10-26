import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './db.js';
import { generatePresignedUploadUrl, getPublicUrl } from './s3-client.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'https://test-johannes.netlify.app',
    'http://localhost:3000',
    'http://localhost:8080'
  ],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * POST /api/create-order
 * Creates a new order and returns order_id
 * Body: { street?, houseNumber?, postalCode?, city?, propertyType?, buildYear?, note? }
 */
app.post('/api/create-order', async (req, res) => {
  try {
    const {
      street,
      houseNumber,
      postalCode,
      city,
      propertyType,
      buildYear,
      note
    } = req.body;

    const result = await query(
      `INSERT INTO orders (street, house_number, postal_code, city, property_type, build_year, note)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [street || null, houseNumber || null, postalCode || null, city || null, propertyType || null, buildYear || null, note || null]
    );

    const order = result.rows[0];

    res.status(201).json({
      success: true,
      orderId: order.id,
      createdAt: order.created_at
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
});

/**
 * PUT /api/update-order/:orderId
 * Updates order details (address, property info, etc.)
 */
app.put('/api/update-order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const {
      street,
      houseNumber,
      postalCode,
      city,
      propertyType,
      buildYear,
      note
    } = req.body;

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (street !== undefined) {
      updates.push(`street = $${paramCount++}`);
      values.push(street);
    }
    if (houseNumber !== undefined) {
      updates.push(`house_number = $${paramCount++}`);
      values.push(houseNumber);
    }
    if (postalCode !== undefined) {
      updates.push(`postal_code = $${paramCount++}`);
      values.push(postalCode);
    }
    if (city !== undefined) {
      updates.push(`city = $${paramCount++}`);
      values.push(city);
    }
    if (propertyType !== undefined) {
      updates.push(`property_type = $${paramCount++}`);
      values.push(propertyType);
    }
    if (buildYear !== undefined) {
      updates.push(`build_year = $${paramCount++}`);
      values.push(buildYear);
    }
    if (note !== undefined) {
      updates.push(`note = $${paramCount++}`);
      values.push(note);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    values.push(orderId);

    const result = await query(
      `UPDATE orders SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, updated_at`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      orderId: result.rows[0].id,
      updatedAt: result.rows[0].updated_at
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order'
    });
  }
});

/**
 * GET /api/upload-url
 * Generates pre-signed URL for direct S3 upload
 * Query params: orderId, area, filename, mimeType
 */
app.get('/api/upload-url', async (req, res) => {
  try {
    const { orderId, area, filename, mimeType } = req.query;

    if (!orderId || !area || !filename || !mimeType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: orderId, area, filename, mimeType'
      });
    }

    // Verify order exists
    const orderCheck = await query('SELECT id FROM orders WHERE id = $1', [orderId]);
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const { uploadUrl, filePath } = await generatePresignedUploadUrl(
      orderId,
      area,
      filename,
      mimeType
    );

    res.json({
      success: true,
      uploadUrl,
      filePath,
      publicUrl: getPublicUrl(filePath)
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate upload URL'
    });
  }
});

/**
 * POST /api/record-upload
 * Records successful upload metadata in database
 * Body: { orderId, area, filePath, mimeType, fileSize }
 */
app.post('/api/record-upload', async (req, res) => {
  try {
    const { orderId, area, filePath, mimeType, fileSize } = req.body;

    if (!orderId || !area || !filePath || !mimeType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: orderId, area, filePath, mimeType'
      });
    }

    const result = await query(
      `INSERT INTO uploads (order_id, area, file_path, mime_type, file_size)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, created_at`,
      [orderId, area, filePath, mimeType, fileSize || null]
    );

    const upload = result.rows[0];

    res.status(201).json({
      success: true,
      uploadId: upload.id,
      createdAt: upload.created_at,
      publicUrl: getPublicUrl(filePath)
    });
  } catch (error) {
    console.error('Error recording upload:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record upload'
    });
  }
});

/**
 * POST /api/save-texts
 * Saves area text description
 * Body: { orderId, area, content }
 */
app.post('/api/save-texts', async (req, res) => {
  try {
    const { orderId, area, content } = req.body;

    if (!orderId || !area || !content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: orderId, area, content'
      });
    }

    // Use INSERT ... ON CONFLICT to handle updates
    const result = await query(
      `INSERT INTO area_texts (order_id, area, content)
       VALUES ($1, $2, $3)
       ON CONFLICT (order_id, area)
       DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()
       RETURNING id, created_at, updated_at`,
      [orderId, area, content]
    );

    const areaText = result.rows[0];

    res.status(201).json({
      success: true,
      textId: areaText.id,
      createdAt: areaText.created_at,
      updatedAt: areaText.updated_at
    });
  } catch (error) {
    console.error('Error saving text:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save text'
    });
  }
});

/**
 * GET /api/order/:orderId
 * Get order details with all uploads and texts
 */
app.get('/api/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Get order details
    const orderResult = await query(
      'SELECT * FROM orders WHERE id = $1',
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Get all uploads
    const uploadsResult = await query(
      'SELECT * FROM uploads WHERE order_id = $1 ORDER BY created_at',
      [orderId]
    );

    // Get all area texts
    const textsResult = await query(
      'SELECT * FROM area_texts WHERE order_id = $1',
      [orderId]
    );

    const order = orderResult.rows[0];

    res.json({
      success: true,
      order: {
        ...order,
        uploads: uploadsResult.rows,
        texts: textsResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Claverum API server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

