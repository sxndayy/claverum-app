import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import archiver from 'archiver';
import helmet from 'helmet';
import { query, transaction, getPoolStats, isPoolExhaustionError } from './db.js';
import { generatePresignedUploadUrl, getPublicUrl, downloadFileFromS3 } from './s3-client.js';
import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payments.js';
import stripeWebhookRoutes from './routes/stripe-webhook.js';
import { requireAuth, optionalAuth } from './middleware/auth.js';
import { requireOrderOwnership } from './middleware/orderOwnership.js';
import { requireCSRF, generateCSRFForUser } from './middleware/csrf.js';
import { 
  publicLimiter, 
  loginLimiter, 
  adminLimiter, 
  uploadLimiter, 
  orderCreationLimiter 
} from './middleware/rateLimiter.js';
import { 
  sanitizeString, 
  isValidUUID, 
  isValidPropertyType, 
  isValidBuildYear,
  isValidPostalCode,
  isValidArea,
  isValidSortField,
  isValidSortOrder
} from './utils/validation.js';
import { validateFileUpload, checkUploadLimits, checkAndReserveUploadSlot } from './middleware/fileValidation.js';
import { generateOrderSessionToken } from './middleware/orderOwnership.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy headers for Railway/Netlify
app.set('trust proxy', 1);

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for S3 uploads
}));

app.use(cors({
  origin: [
    'https://test-johannes.netlify.app',
    'http://localhost:3000',
    'http://localhost:8080'
  ],
  credentials: true
}));

// Stripe webhook must be registered BEFORE express.json() middleware
// because it needs raw body for signature verification
app.use('/api/stripe', stripeWebhookRoutes);

app.use(express.json({ limit: '10mb' })); // Limit request body size

// Auth routes
app.use('/api/auth', loginLimiter, authRoutes);

// Payment routes
app.use('/api/payments', paymentRoutes);

// Add CSRF token generation for authenticated requests
app.use(generateCSRFForUser);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * GET /api/admin/stats
 * Get system statistics including database pool metrics
 * Admin only
 */
app.get('/api/admin/stats', adminLimiter, requireAuth, async (req, res) => {
  try {
    const poolStats = getPoolStats();
    
    // Get total orders count
    const ordersResult = await query('SELECT COUNT(*) as count FROM orders');
    const totalOrders = parseInt(ordersResult.rows[0].count);
    
    // Get total uploads count
    const uploadsResult = await query('SELECT COUNT(*) as count FROM uploads');
    const totalUploads = parseInt(uploadsResult.rows[0].count);
    
    // Get orders created today
    const todayResult = await query(
      'SELECT COUNT(*) as count FROM orders WHERE created_at::date = CURRENT_DATE'
    );
    const ordersToday = parseInt(todayResult.rows[0].count);
    
    res.json({
      success: true,
      stats: {
        database: {
          pool: poolStats,
          status: poolStats.utilization > 80 ? 'warning' : 'healthy'
        },
        orders: {
          total: totalOrders,
          today: ordersToday
        },
        uploads: {
          total: totalUploads
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

/**
 * POST /api/create-order
 * Creates a new order and returns order_id
 * Body: { street?, houseNumber?, postalCode?, city?, propertyType?, buildYear?, note? }
 */
app.post('/api/create-order', orderCreationLimiter, async (req, res) => {
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

    // Validate and sanitize inputs
    const sanitizedStreet = sanitizeString(street, 255);
    const sanitizedHouseNumber = sanitizeString(houseNumber, 50);
    const sanitizedCity = sanitizeString(city, 100);
    const sanitizedNote = sanitizeString(note, 1000);

    // Validate postal code if provided
    if (postalCode && !isValidPostalCode(postalCode)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid postal code format'
      });
    }

    // Validate property type if provided
    if (propertyType && !isValidPropertyType(propertyType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid property type'
      });
    }

    // Validate build year if provided
    if (buildYear && !isValidBuildYear(buildYear)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid build year'
      });
    }

    // Use transaction to atomically create order and session token
    // This ensures data consistency - if token creation fails, order is rolled back
    const { order, sessionToken } = await transaction(async (client) => {
      // Create order
      const result = await client.query(
        `INSERT INTO orders (street, house_number, postal_code, city, property_type, build_year, note)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, created_at`,
        [
          sanitizedStreet || null, 
          sanitizedHouseNumber || null, 
          postalCode || null, 
          sanitizedCity || null, 
          propertyType || null, 
          buildYear || null, 
          sanitizedNote || null
        ]
      );

      const order = result.rows[0];

      // Generate session token within the same transaction
      const sessionToken = await generateOrderSessionToken(order.id, client);

      return { order, sessionToken };
    });

    res.status(201).json({
      success: true,
      orderId: order.id,
      sessionToken: sessionToken,
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
app.put('/api/update-order/:orderId', publicLimiter, requireOrderOwnership, async (req, res) => {
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
app.get('/api/upload-url', uploadLimiter, requireOrderOwnership, async (req, res) => {
  try {
    const { orderId, area, filename, mimeType } = req.query;

    if (!orderId || !area || !filename || !mimeType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: orderId, area, filename, mimeType'
      });
    }

    // Validate UUID
    if (!isValidUUID(orderId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID format'
      });
    }

    // Validate area
    if (!isValidArea(area)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid area specified'
      });
    }

    // Validate file upload
    const fileValidation = validateFileUpload(mimeType, 0, filename); // Size will be validated on actual upload
    if (!fileValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: fileValidation.errors.join('; ')
      });
    }

    // Check upload limits for this order
    const uploadLimits = await checkUploadLimits(query, orderId);
    if (!uploadLimits.allowed) {
      return res.status(400).json({
        success: false,
        error: uploadLimits.error
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
      fileValidation.sanitizedFilename,
      mimeType
    );

    res.json({
      success: true,
      uploadUrl,
      filePath,
      remainingUploads: 100 - uploadLimits.currentCount
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
app.post('/api/record-upload', uploadLimiter, requireOrderOwnership, async (req, res) => {
  try {
    const { orderId, area, filePath, mimeType, fileSize } = req.body;

    if (!orderId || !area || !filePath || !mimeType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: orderId, area, filePath, mimeType'
      });
    }

    // Validate inputs
    if (!isValidUUID(orderId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID format'
      });
    }

    if (!isValidArea(area)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid area'
      });
    }

    // Validate MIME type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(mimeType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid MIME type'
      });
    }

    // Sanitize file path to prevent path traversal
    const sanitizedFilePath = sanitizeString(filePath, 500);
    if (!sanitizedFilePath || sanitizedFilePath.includes('..') || sanitizedFilePath.includes('//')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file path'
      });
    }

    // Use transaction to atomically check upload limits and record upload
    // This prevents race conditions when multiple uploads happen simultaneously
    const upload = await transaction(async (client) => {
      // Atomically check and reserve upload slot
      const limitCheck = await checkAndReserveUploadSlot(client, orderId);
      if (!limitCheck.allowed) {
        throw new Error(limitCheck.error);
      }

      // Record upload within the same transaction
      const result = await client.query(
        `INSERT INTO uploads (order_id, area, file_path, mime_type, file_size)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, created_at`,
        [orderId, area, sanitizedFilePath, mimeType, fileSize || null]
      );

      return result.rows[0];
    });

    res.status(201).json({
      success: true,
      uploadId: upload.id,
      createdAt: upload.created_at,
      publicUrl: getPublicUrl(sanitizedFilePath)
    });
  } catch (error) {
    console.error('Error recording upload:', error);
    
    // Check if it's a limit error
    if (error.message && error.message.includes('Maximum number of uploads')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
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
app.post('/api/save-texts', publicLimiter, requireOrderOwnership, async (req, res) => {
  try {
    const { orderId, area, content } = req.body;

    if (!orderId || !area || !content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: orderId, area, content'
      });
    }

    // Validate inputs
    if (!isValidUUID(orderId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID format'
      });
    }

    if (!isValidArea(area)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid area'
      });
    }

    // Sanitize content
    const sanitizedContent = sanitizeString(content, 5000);
    if (!sanitizedContent) {
      return res.status(400).json({
        success: false,
        error: 'Invalid content'
      });
    }

    // Use INSERT ... ON CONFLICT to handle updates
    const result = await query(
      `INSERT INTO area_texts (order_id, area, content)
       VALUES ($1, $2, $3)
       ON CONFLICT (order_id, area)
       DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()
       RETURNING id, created_at, updated_at`,
      [orderId, area, sanitizedContent]
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
app.get('/api/order/:orderId', adminLimiter, requireAuth, async (req, res) => {
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

    // Add public URLs to uploads
    const uploadsWithPublicUrls = uploadsResult.rows.map(upload => ({
      ...upload,
      publicUrl: getPublicUrl(upload.file_path)
    }));

    res.json({
      success: true,
      order: {
        ...order,
        uploads: uploadsWithPublicUrls,
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
app.get('/api/orders', adminLimiter, requireAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      propertyType = '',
      city = '',
      paid = '', // 'true', 'false', or empty for all
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    // Validate and sanitize inputs
    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 20)); // Max 100 per page
    const safeSearch = sanitizeString(search, 100);
    const safeCity = sanitizeString(city, 100);

    // Validate sort parameters
    const safeSortBy = isValidSortField(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = isValidSortOrder(sortOrder) ? sortOrder.toUpperCase() : 'DESC';

    // Validate property type
    if (propertyType && !isValidPropertyType(propertyType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid property type'
      });
    }

    const offset = (safePage - 1) * safeLimit;

    // Build filters with parameterized queries
    const filters = [];
    const params = [];
    let paramCount = 1;

    if (safeSearch) {
      filters.push(`(street ILIKE $${paramCount} OR city ILIKE $${paramCount} OR id::text ILIKE $${paramCount})`);
      params.push(`%${safeSearch}%`);
      paramCount++;
    }

    if (propertyType) {
      filters.push(`property_type = $${paramCount}`);
      params.push(propertyType);
      paramCount++;
    }

    if (safeCity) {
      filters.push(`city ILIKE $${paramCount}`);
      params.push(`%${safeCity}%`);
      paramCount++;
    }

    // Filter by payment status
    if (paid === 'true') {
      filters.push(`paid = true`);
    } else if (paid === 'false') {
      filters.push(`(paid = false OR paid IS NULL)`);
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    // Get orders with upload counts
    const ordersQuery = `
      SELECT 
        o.*,
        COUNT(DISTINCT u.id) as upload_count,
        COUNT(DISTINCT at.id) as text_count
      FROM orders o
      LEFT JOIN uploads u ON o.id = u.order_id
      LEFT JOIN area_texts at ON o.id = at.order_id
      ${whereClause}
      GROUP BY o.id
      ORDER BY ${safeSortBy} ${safeSortOrder}
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    params.push(safeLimit, offset);
    const ordersResult = await query(ordersQuery, params);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(DISTINCT o.id) as total
      FROM orders o
      ${whereClause}
    `;
    const countParams = params.slice(0, -2); // Remove limit and offset
    const countResult = await query(countQuery, countParams);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / safeLimit);

    res.json({
      success: true,
      orders: ordersResult.rows,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
        hasNext: safePage < totalPages,
        hasPrev: safePage > 1
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
app.delete('/api/order/:orderId', adminLimiter, requireAuth, requireCSRF, async (req, res) => {
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
app.get('/api/export/:orderId', adminLimiter, requireAuth, async (req, res) => {
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
        
        try {
          // Download file from S3
          const fileContent = await downloadFileFromS3(upload.file_path);
          
          // Add file content to ZIP
          archive.append(fileContent, { name: `photos/${area}/${filename}` });
        } catch (error) {
          // Log error but continue with other files
          console.warn(`Failed to download file ${upload.file_path} from S3:`, error.message);
          // Add empty file with error note (optional - or skip entirely)
          archive.append(`Error: File could not be retrieved from storage (${error.message})`, { 
            name: `photos/${area}/${filename}.error.txt` 
          });
        }
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
app.put('/api/order/:orderId/note', adminLimiter, requireAuth, requireCSRF, async (req, res) => {
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
  
  // Check if it's a database pool exhaustion error
  if (isPoolExhaustionError(err)) {
    const poolStats = getPoolStats();
    console.error('Database pool exhaustion detected:', poolStats);
    
    return res.status(503).json({
      success: false,
      error: 'Service temporarily unavailable. Please try again in a moment.',
      retryAfter: 5 // seconds
    });
  }
  
  // Default error response
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

