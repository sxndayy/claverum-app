# Claverum Backend API

Express.js API für die Claverum Datenpipeline.

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp env.example .env
# Edit .env with your credentials

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

Siehe `env.example` für alle benötigten Variablen.

## API Documentation

### Health Check
```bash
GET /health
```

### Create Order
```bash
POST /api/create-order
Content-Type: application/json

{
  "street": "Musterstraße",
  "houseNumber": "123",
  "postalCode": "12345",
  "city": "Musterstadt",
  "propertyType": "Einfamilienhaus",
  "buildYear": "1995"
}
```

### Get Upload URL
```bash
GET /api/upload-url?orderId=xxx&area=Dach&filename=photo.jpg&mimeType=image/jpeg
```

### Record Upload
```bash
POST /api/record-upload
Content-Type: application/json

{
  "orderId": "uuid",
  "area": "Dach",
  "filePath": "orders/uuid/Dach/123-photo.jpg",
  "mimeType": "image/jpeg",
  "fileSize": 1048576
}
```

### Save Texts
```bash
POST /api/save-texts
Content-Type: application/json

{
  "orderId": "uuid",
  "area": "Dach",
  "content": "Beschreibung..."
}
```

### Get Order Details
```bash
GET /api/order/:orderId
```

## Testing

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test create order
curl -X POST http://localhost:3001/api/create-order \
  -H "Content-Type: application/json" \
  -d '{"street":"Test","city":"Berlin"}'
```

## Database Migrations

Run migrations in order:
```bash
psql $DATABASE_URL -f ../supabase/migrations/001_create_orders_table.sql
psql $DATABASE_URL -f ../supabase/migrations/002_create_uploads_table.sql
psql $DATABASE_URL -f ../supabase/migrations/003_create_area_texts_table.sql
```

## Deployment

### Railway
```bash
railway init
railway add
railway up
```

### Render
1. Connect GitHub repo
2. Set environment variables
3. Deploy

### Fly.io
```bash
fly launch
fly secrets set DATABASE_URL=...
fly deploy
```

