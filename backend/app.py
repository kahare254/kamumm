"""
Flask Backend for Digital Memorial Cards (Gate of Memory)
This demonstrates the backend structure for the memorial card system.
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import uuid
import os
import base64
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database configuration
DATABASE_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'memorial_cards'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'root'),
    'port': os.getenv('DB_PORT', '5432')
}

def get_db_connection():
    """Get database connection"""
    try:
        conn = psycopg2.connect(**DATABASE_CONFIG)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def init_database():
    """Initialize database tables"""
    conn = get_db_connection()
    if not conn:
        return False
    
    try:
        cur = conn.cursor()
        
        # Create memorials table
        cur.execute('''
            CREATE TABLE IF NOT EXISTS memorials (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(255) NOT NULL,
                birth_date DATE NOT NULL,
                death_date DATE NOT NULL,
                memory_text TEXT,
                card_type VARCHAR(10) CHECK (card_type IN ('male', 'female', 'child')),
                photo_path VARCHAR(500),
                qr_code_data TEXT,
                nfc_data TEXT,
                gps_latitude DECIMAL(10, 8),
                gps_longitude DECIMAL(11, 8),
                gps_location_name VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create memorial_views table for analytics
        cur.execute('''
            CREATE TABLE IF NOT EXISTS memorial_views (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE,
                view_type VARCHAR(20) CHECK (view_type IN ('card', 'ar', 'hologram', 'qr_scan')),
                user_agent TEXT,
                ip_address INET,
                viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create nfc_tags table
        cur.execute('''
            CREATE TABLE IF NOT EXISTS nfc_tags (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE,
                tag_data TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        cur.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"Database initialization error: {e}")
        return False

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'memorial-cards-api'})

@app.route('/api/memorials', methods=['POST'])
def create_memorial():
    """Create a new memorial card"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'birth_date', 'death_date', 'card_type']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Generate unique ID
        memorial_id = str(uuid.uuid4())
        
        # Generate QR code data
        qr_data = f"{request.host_url}memorial/{memorial_id}"
        
        # Insert memorial
        cur.execute('''
            INSERT INTO memorials (
                id, name, birth_date, death_date, memory_text, card_type,
                photo_path, qr_code_data, gps_latitude, gps_longitude, gps_location_name
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        ''', (
            memorial_id,
            data['name'],
            data['birth_date'],
            data['death_date'],
            data.get('memory_text', ''),
            data['card_type'],
            data.get('photo_path', ''),
            qr_data,
            data.get('gps_latitude'),
            data.get('gps_longitude'),
            data.get('gps_location_name')
        ))
        
        memorial = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            'memorial': dict(memorial),
            'qr_url': qr_data
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/memorials/<memorial_id>', methods=['GET'])
def get_memorial(memorial_id):
    """Get a specific memorial by ID"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute('SELECT * FROM memorials WHERE id = %s', (memorial_id,))
        memorial = cur.fetchone()
        
        if not memorial:
            return jsonify({'error': 'Memorial not found'}), 404
        
        # Log the view
        cur.execute('''
            INSERT INTO memorial_views (memorial_id, view_type, user_agent, ip_address)
            VALUES (%s, %s, %s, %s)
        ''', (
            memorial_id,
            'card',
            request.headers.get('User-Agent', ''),
            request.remote_addr
        ))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({'memorial': dict(memorial)})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/memorials/<memorial_id>/view', methods=['POST'])
def log_memorial_view(memorial_id):
    """Log a memorial view (AR, hologram, etc.)"""
    try:
        data = request.get_json()
        view_type = data.get('view_type', 'card')
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cur = conn.cursor()
        
        cur.execute('''
            INSERT INTO memorial_views (memorial_id, view_type, user_agent, ip_address)
            VALUES (%s, %s, %s, %s)
        ''', (
            memorial_id,
            view_type,
            request.headers.get('User-Agent', ''),
            request.remote_addr
        ))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({'message': 'View logged successfully'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/memorials/<memorial_id>/analytics', methods=['GET'])
def get_memorial_analytics(memorial_id):
    """Get analytics for a memorial"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get view counts by type
        cur.execute('''
            SELECT view_type, COUNT(*) as count
            FROM memorial_views
            WHERE memorial_id = %s
            GROUP BY view_type
            ORDER BY count DESC
        ''', (memorial_id,))
        
        view_stats = cur.fetchall()
        
        # Get total views
        cur.execute('''
            SELECT COUNT(*) as total_views
            FROM memorial_views
            WHERE memorial_id = %s
        ''', (memorial_id,))
        
        total_views = cur.fetchone()['total_views']
        
        # Get recent views
        cur.execute('''
            SELECT view_type, viewed_at, user_agent
            FROM memorial_views
            WHERE memorial_id = %s
            ORDER BY viewed_at DESC
            LIMIT 10
        ''', (memorial_id,))
        
        recent_views = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return jsonify({
            'total_views': total_views,
            'view_stats': [dict(stat) for stat in view_stats],
            'recent_views': [dict(view) for view in recent_views]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/memorials', methods=['GET'])
def list_memorials():
    """List all memorials (for admin/family access)"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute('''
            SELECT m.*, COUNT(mv.id) as view_count
            FROM memorials m
            LEFT JOIN memorial_views mv ON m.id = mv.memorial_id
            GROUP BY m.id
            ORDER BY m.created_at DESC
        ''')
        
        memorials = cur.fetchall()
        cur.close()
        conn.close()
        
        return jsonify({
            'memorials': [dict(memorial) for memorial in memorials]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/nfc/register', methods=['POST'])
def register_nfc_tag():
    """Register an NFC tag for a memorial"""
    try:
        data = request.get_json()
        memorial_id = data.get('memorial_id')
        tag_data = data.get('tag_data')
        
        if not memorial_id or not tag_data:
            return jsonify({'error': 'Memorial ID and tag data required'}), 400
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute('''
            INSERT INTO nfc_tags (memorial_id, tag_data)
            VALUES (%s, %s)
            RETURNING *
        ''', (memorial_id, tag_data))
        
        nfc_tag = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({'nfc_tag': dict(nfc_tag)}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload/photo', methods=['POST'])
def upload_photo():
    """Handle photo upload for memorial cards"""
    try:
        if 'photo' not in request.files:
            return jsonify({'error': 'No photo file provided'}), 400
        
        file = request.files['photo']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Create uploads directory if it doesn't exist
        upload_dir = 'uploads/photos'
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(upload_dir, filename)
        
        file.save(file_path)
        
        return jsonify({
            'photo_path': f"/uploads/photos/{filename}",
            'message': 'Photo uploaded successfully'
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/uploads/photos/<filename>')
def serve_photo(filename):
    """Serve uploaded photos"""
    return send_from_directory('uploads/photos', filename)

if __name__ == '__main__':
    print("Initializing database...")
    if init_database():
        print("Database initialized successfully!")
    else:
        print("Database initialization failed!")
    
    print("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5000)