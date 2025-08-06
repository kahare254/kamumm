/**
 * API client for Memorial Cards backend
 */

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

export interface CreateMemorialRequest {
  name: string;
  birth_date: string;
  death_date: string;
  memory_text: string;
  card_type: 'male' | 'female' | 'child';
  photo_path?: string;
  gps_latitude?: number;
  gps_longitude?: number;
  gps_location_name?: string;
}

export interface Memorial {
  id: string;
  name: string;
  birth_date: string;
  death_date: string;
  memory_text: string;
  card_type: 'male' | 'female' | 'child';
  photo_path: string;
  qr_code_data: string;
  nfc_data?: string;
  gps_latitude?: number;
  gps_longitude?: number;
  gps_location_name?: string;
  created_at: string;
  updated_at: string;
}

export interface MemorialView {
  memorial_id: string;
  view_type: 'card' | 'ar' | 'hologram' | 'qr_scan';
}

export interface AnalyticsData {
  total_views: number;
  view_stats: Array<{
    view_type: string;
    count: number;
  }>;
  recent_views: Array<{
    view_type: string;
    viewed_at: string;
    user_agent: string;
  }>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Memorial Management
  async createMemorial(data: CreateMemorialRequest): Promise<{ memorial: Memorial; qr_url: string }> {
    return this.request('/memorials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMemorial(id: string): Promise<{ memorial: Memorial }> {
    return this.request(`/memorials/${id}`);
  }

  async listMemorials(): Promise<{ memorials: Memorial[] }> {
    return this.request('/memorials');
  }

  async logMemorialView(memorialId: string, viewType: MemorialView['view_type']): Promise<{ message: string }> {
    return this.request(`/memorials/${memorialId}/view`, {
      method: 'POST',
      body: JSON.stringify({ view_type: viewType }),
    });
  }

  async getMemorialAnalytics(memorialId: string): Promise<AnalyticsData> {
    return this.request(`/memorials/${memorialId}/analytics`);
  }

  // File Upload
  async uploadPhoto(file: File): Promise<{ photo_path: string; message: string }> {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch(`${this.baseUrl}/upload/photo`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // NFC Integration
  async registerNFCTag(memorialId: string, tagData: string): Promise<{ nfc_tag: any }> {
    return this.request('/nfc/register', {
      method: 'POST',
      body: JSON.stringify({
        memorial_id: memorialId,
        tag_data: tagData,
      }),
    });
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; service: string }> {
    return this.request('/health');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Utility functions for frontend integration
export const memorialApi = {
  // Convert backend Memorial to frontend MemorialData format
  toMemorialData: (memorial: Memorial): any => ({
    id: memorial.id,
    name: memorial.name,
    birthDate: memorial.birth_date,
    deathDate: memorial.death_date,
    memoryText: memorial.memory_text,
    cardType: memorial.card_type,
    photo: memorial.photo_path?.startsWith('http') 
      ? memorial.photo_path 
      : `${API_BASE_URL.replace('/api', '')}${memorial.photo_path}`,
    qrCode: memorial.qr_code_data,
    nfcData: memorial.nfc_data,
    gpsLocation: memorial.gps_latitude && memorial.gps_longitude ? {
      lat: memorial.gps_latitude,
      lng: memorial.gps_longitude,
      name: memorial.gps_location_name || 'Memorial Location'
    } : undefined,
  }),

  // Convert frontend form data to backend format
  fromFormData: (data: any): CreateMemorialRequest => ({
    name: data.name,
    birth_date: data.birthDate,
    death_date: data.deathDate,
    memory_text: data.memoryText,
    card_type: data.cardType,
    photo_path: data.photoPath,
    gps_latitude: data.gpsLocation?.lat,
    gps_longitude: data.gpsLocation?.lng,
    gps_location_name: data.gpsLocation?.name,
  }),
};