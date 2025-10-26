/**
 * API Client
 * Type-safe client for communicating with the backend API
 */

import { getApiBase } from '@/constants/config';

const API_BASE = getApiBase();

export interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  createdAt: string;
  error?: string;
}

export interface UpdateOrderRequest {
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  propertyType?: string;
  buildYear?: string;
  note?: string;
}

export interface UploadUrlResponse {
  success: boolean;
  uploadUrl: string;
  filePath: string;
  publicUrl: string;
  error?: string;
}

export interface RecordUploadRequest {
  orderId: string;
  area: string;
  filePath: string;
  mimeType: string;
  fileSize?: number;
}

export interface RecordUploadResponse {
  success: boolean;
  uploadId: string;
  createdAt: string;
  publicUrl: string;
  error?: string;
}

export interface SaveTextsRequest {
  orderId: string;
  area: string;
  content: string;
}

export interface SaveTextsResponse {
  success: boolean;
  textId: string;
  createdAt: string;
  updatedAt: string;
  error?: string;
}

export interface OrderDetailsResponse {
  success: boolean;
  order: {
    id: string;
    street: string;
    house_number: string;
    postal_code: string;
    city: string;
    property_type: string;
    build_year: string;
    note: string;
    created_at: string;
    updated_at: string;
    uploads: Array<{
      id: string;
      order_id: string;
      area: string;
      file_path: string;
      mime_type: string;
      file_size: number;
      created_at: string;
    }>;
    texts: Array<{
      id: string;
      order_id: string;
      area: string;
      content: string;
      created_at: string;
      updated_at: string;
    }>;
  };
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Create a new order
   */
  async createOrder(data?: Partial<UpdateOrderRequest>): Promise<CreateOrderResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data || {}),
      });

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        orderId: '',
        createdAt: '',
        error: 'Network error',
      };
    }
  }

  /**
   * Update an existing order
   */
  async updateOrder(orderId: string, data: UpdateOrderRequest): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/update-order/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error('Error updating order:', error);
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  /**
   * Get pre-signed upload URL for S3
   */
  async getUploadUrl(
    orderId: string,
    area: string,
    filename: string,
    mimeType: string
  ): Promise<UploadUrlResponse> {
    try {
      const params = new URLSearchParams({
        orderId,
        area,
        filename,
        mimeType,
      });

      const response = await fetch(`${this.baseUrl}/api/upload-url?${params}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting upload URL:', error);
      return {
        success: false,
        uploadUrl: '',
        filePath: '',
        publicUrl: '',
        error: 'Network error',
      };
    }
  }

  /**
   * Upload file directly to S3 using pre-signed URL
   */
  async uploadToS3(uploadUrl: string, file: File): Promise<boolean> {
    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      return false;
    }
  }

  /**
   * Record upload metadata in database
   */
  async recordUpload(data: RecordUploadRequest): Promise<RecordUploadResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/record-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error('Error recording upload:', error);
      return {
        success: false,
        uploadId: '',
        createdAt: '',
        publicUrl: '',
        error: 'Network error',
      };
    }
  }

  /**
   * Save area text description
   */
  async saveTexts(data: SaveTextsRequest): Promise<SaveTextsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/save-texts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error('Error saving texts:', error);
      return {
        success: false,
        textId: '',
        createdAt: '',
        updatedAt: '',
        error: 'Network error',
      };
    }
  }

  /**
   * Get order details with all uploads and texts
   */
  async getOrderDetails(orderId: string): Promise<OrderDetailsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/order/${orderId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching order details:', error);
      return {
        success: false,
        order: {} as any,
        error: 'Network error',
      };
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE);

