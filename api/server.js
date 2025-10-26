import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import archiver from 'archiver';
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

/**
 * GET /api/orders
 * List all orders with pagination, search, and filters
 * Query params: page, limit, search, propertyType, city, sortBy, sortOrder
 */
app.get('/api/orders', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      propertyType = '',
      city = '',
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const searchTerm = `%${search}%`;
    const propertyFilter = propertyType ? `AND property_type = '${propertyType}'` : '';
    const cityFilter = city ? `AND city ILIKE '%${city}%'` : '';
    const orderBy = `${sortBy} ${sortOrder.toUpperCase()}`;

    // Build search condition
    const searchCondition = search ? 
      `AND (street ILIKE $1 OR city ILIKE $1 OR id::text ILIKE $1)` : 
      '';

    // Get orders with upload counts
    const ordersQuery = `
      SELECT 
        o.*,
        COUNT(DISTINCT u.id) as upload_count,
        COUNT(DISTINCT at.id) as text_count
      FROM orders o
      LEFT JOIN uploads u ON o.id = u.order_id
      LEFT JOIN area_texts at ON o.id = at.order_id
      WHERE 1=1 ${searchCondition} ${propertyFilter} ${cityFilter}
      GROUP BY o.id
      ORDER BY ${orderBy}
      LIMIT $${search ? '2' : '1'} OFFSET $${search ? '3' : '2'}
    `;

    const queryParams = search ? [searchTerm, parseInt(limit), offset] : [parseInt(limit), offset];

    const ordersResult = await query(ordersQuery, queryParams);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(DISTINCT o.id) as total
      FROM orders o
      WHERE 1=1 ${searchCondition} ${propertyFilter} ${cityFilter}
    `;
    const countParams = search ? [searchTerm] : [];
    const countResult = await query(countQuery, countParams);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      orders: ordersResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
});

/**
 * DELETE /api/order/:orderId
 * Delete an order and all associated data
 */
app.delete('/api/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Verify order exists
    const orderCheck = await query('SELECT id FROM orders WHERE id = $1', [orderId]);
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Delete order (cascade will handle uploads and texts)
    await query('DELETE FROM orders WHERE id = $1', [orderId]);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete order'
    });
  }
});

/**
 * GET /api/export/:orderId
 * Generate ZIP export with all order data
 */
app.get('/api/export/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Get order details
    const orderResult = await query('SELECT * FROM orders WHERE id = $1', [orderId]);
    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    // Get all uploads
    const uploadsResult = await query(
      'SELECT * FROM uploads WHERE order_id = $1 ORDER BY area, created_at',
      [orderId]
    );

    // Get all area texts
    const textsResult = await query(
      'SELECT * FROM area_texts WHERE order_id = $1 ORDER BY area',
      [orderId]
    );

    // Set response headers for ZIP download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="order-${orderId}.zip"`);

    // Create ZIP archive
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    // Add order info file
    const orderInfo = `
Claverum Auftrag Export
======================

Auftrags-ID: ${order.id}
Erstellt am: ${new Date(order.created_at).toLocaleString('de-DE')}
Aktualisiert am: ${new Date(order.updated_at).toLocaleString('de-DE')}

Adresse:
${order.street || ''} ${order.house_number || ''}
${order.postal_code || ''} ${order.city || ''}

Immobilientyp: ${order.property_type || 'Nicht angegeben'}
Baujahr: ${order.build_year || 'Nicht angegeben'}

Notizen:
${order.note || 'Keine Notizen'}

Statistiken:
- Hochgeladene Bilder: ${uploadsResult.rows.length}
- Bereiche mit Texten: ${textsResult.rows.length}
`;

    archive.append(orderInfo, { name: 'order-info.txt' });

    // Group uploads by area
    const uploadsByArea = {};
    uploadsResult.rows.forEach(upload => {
      if (!uploadsByArea[upload.area]) {
        uploadsByArea[upload.area] = [];
      }
      uploadsByArea[upload.area].push(upload);
    });

    // Add photos organized by area
    for (const [area, uploads] of Object.entries(uploadsByArea)) {
      for (const upload of uploads) {
        const filename = upload.file_path.split('/').pop();
        archive.append(null, { name: `photos/${area}/${filename}` });
      }
    }

    // Add texts
    if (textsResult.rows.length > 0) {
      // Combined summary
      let summaryText = 'Bereichstexte Zusammenfassung\n============================\n\n';
      textsResult.rows.forEach(text => {
        summaryText += `${text.area.toUpperCase()}:\n${text.content}\n\n`;
      });
      archive.append(summaryText, { name: 'texts/summary.txt' });

      // Individual area texts
      textsResult.rows.forEach(text => {
        archive.append(text.content, { name: `texts/${text.area}.txt` });
      });
    }

    // Finalize archive
    await archive.finalize();

  } catch (error) {
    console.error('Error exporting order:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Failed to export order'
      });
    }
  }
});

/**
 * PUT /api/order/:orderId/note
 * Add/update admin notes
 */
app.put('/api/order/:orderId/note', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({
        success: false,
        error: 'Note content is required'
      });
    }

    const result = await query(
      'UPDATE orders SET note = $1, updated_at = NOW() WHERE id = $2 RETURNING id, updated_at',
      [note, orderId]
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
    console.error('Error updating order note:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order note'
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

