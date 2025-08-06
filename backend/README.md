# Digital Memorial Cards Backend

Flask backend for the Gate of Memory digital memorial card system.

## Features

- **Memorial Management**: Create, read, update memorial cards
- **Photo Upload**: Handle memorial photo uploads
- **Analytics**: Track memorial views and interactions
- **NFC Integration**: Register and manage NFC tags
- **QR Code Generation**: Automatic QR code creation for memorials
- **GPS Location**: Store memorial location data

## Database Schema

### Memorials Table
- `id`: UUID primary key
- `name`: Full name of the deceased
- `birth_date`: Date of birth
- `death_date`: Date of passing
- `memory_text`: Memorial message
- `card_type`: Type (male, female, child)
- `photo_path`: Path to memorial photo
- `qr_code_data`: QR code URL
- `nfc_data`: NFC tag data
- `gps_latitude`: GPS latitude
- `gps_longitude`: GPS longitude
- `gps_location_name`: Location name
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Memorial Views Table
- `id`: UUID primary key
- `memorial_id`: Foreign key to memorials
- `view_type`: Type of view (card, ar, hologram, qr_scan)
- `user_agent`: Browser/device info
- `ip_address`: Viewer IP address
- `viewed_at`: View timestamp

### NFC Tags Table
- `id`: UUID primary key
- `memorial_id`: Foreign key to memorials
- `tag_data`: NFC tag data
- `is_active`: Tag status
- `created_at`: Creation timestamp

## API Endpoints

### Memorial Management
- `POST /api/memorials` - Create new memorial
- `GET /api/memorials/<id>` - Get memorial by ID
- `GET /api/memorials` - List all memorials
- `POST /api/memorials/<id>/view` - Log memorial view

### Analytics
- `GET /api/memorials/<id>/analytics` - Get memorial analytics

### File Upload
- `POST /api/upload/photo` - Upload memorial photo
- `GET /uploads/photos/<filename>` - Serve uploaded photos

### NFC Integration
- `POST /api/nfc/register` - Register NFC tag

### Health Check
- `GET /api/health` - Service health check

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up PostgreSQL database and configure environment variables:
```bash
export DB_HOST=localhost
export DB_NAME=memorial_cards
export DB_USER=postgres
export DB_PASSWORD=your_password
export DB_PORT=5432
```

3. Run the application:
```bash
python app.py
```

## Environment Variables

- `DB_HOST`: PostgreSQL host (default: localhost)
- `DB_NAME`: Database name (default: memorial_cards)
- `DB_USER`: Database user (default: postgres)
- `DB_PASSWORD`: Database password (default: password)
- `DB_PORT`: Database port (default: 5432)

## Usage Examples

### Create Memorial
```bash
curl -X POST http://localhost:5000/api/memorials \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "birth_date": "1950-01-01",
    "death_date": "2024-01-01",
    "memory_text": "Loving father and friend",
    "card_type": "male",
    "gps_latitude": 40.7589,
    "gps_longitude": -73.9851,
    "gps_location_name": "Central Park, NYC"
  }'
```

### Upload Photo
```bash
curl -X POST http://localhost:5000/api/upload/photo \
  -F "photo=@memorial_photo.jpg"
```

### Get Memorial
```bash
curl http://localhost:5000/api/memorials/<memorial_id>
```

### Log View
```bash
curl -X POST http://localhost:5000/api/memorials/<memorial_id>/view \
  -H "Content-Type: application/json" \
  -d '{"view_type": "ar"}'
```

## Integration with Frontend

The React frontend should:

1. Use the API endpoints to create and manage memorials
2. Upload photos using the photo upload endpoint
3. Log views when users interact with AR/hologram features
4. Display analytics for family members

## Future Enhancements

- NFT integration for blockchain memorials
- AI-powered memory suggestions
- Voice recording support
- Video memorial support
- Social sharing features
- Advanced analytics dashboard