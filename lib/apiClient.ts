/**
 * API Client
 * Type-safe client for communicating with the backend API
 */

import { getApiBase } from '@/lib/config';
import { authManager } from './authManager';
import { getCurrentOrderSessionToken } from './orderManager';

const API_BASE = getApiBase();

// Authentication interfaces
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    username: string;
    role: string;
  };
  error?: string;
}

export interface VerifyResponse {
  success: boolean;
  user?: {
    username: string;
    role: string;
  };
  error?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  sessionToken: string;
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

export interface OrdersListResponse {
  success: boolean;
  orders: Array<{
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
    upload_count: number;
    text_count: number;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error?: string;
}

export interface OrdersListParams {
  page?: number;
  limit?: number;
  search?: string;
  propertyType?: string;
  city?: string;
  paid?: string; // 'true', 'false', or undefined for all
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DeleteOrderResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface UpdateOrderNoteRequest {
  note: string;
}

export interface UpdateOrderNoteResponse {
  success: boolean;
  orderId: string;
  updatedAt: string;
  error?: string;
}

export interface AdminStatsResponse {
  success: boolean;
  stats?: {
    database: {
      pool: {
        totalCount: number;
        idleCount: number;
        waitingCount: number;
        utilization: string;
      };
      status: 'healthy' | 'warning';
    };
    orders: {
      total: number;
      today: number;
    };
    uploads: {
      total: number;
    };
    timestamp: string;
  };
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  private csrfToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Set CSRF token from response headers
   */
  setCSRFToken(token: string): void {
    this.csrfToken = token;
  }

  /**
   * Get CSRF token for requests
   */
  getCSRFToken(): string | null {
    return this.csrfToken;
  }

  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // Extract CSRF token from response headers
      const csrfToken = response.headers.get('X-CSRF-Token');
      if (csrfToken) {
        this.setCSRFToken(csrfToken);
      }

      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  /**
   * Verify current token
   */
  async verifyToken(): Promise<VerifyResponse> {
    try {
      const authHeader = authManager.getAuthHeader();
      const response = await fetch(`${this.baseUrl}/api/auth/verify`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
      });

      // Extract CSRF token from response headers
      const csrfToken = response.headers.get('X-CSRF-Token');
      if (csrfToken) {
        this.setCSRFToken(csrfToken);
      }

      return await response.json();
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  /**
   * Logout (client-side only)
   */
  async logout(): Promise<void> {
    try {
      const authHeader = authManager.getAuthHeader();
      await fetch(`${this.baseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authManager.logout();
    }
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
        sessionToken: '',
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
      const sessionToken = getCurrentOrderSessionToken();
      const response = await fetch(`${this.baseUrl}/api/update-order/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Order-Session': sessionToken || '',
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
      const sessionToken = getCurrentOrderSessionToken();
      const params = new URLSearchParams({
        orderId,
        area,
        filename,
        mimeType,
      });

      const response = await fetch(`${this.baseUrl}/api/upload-url?${params}`, {
        headers: {
          'X-Order-Session': sessionToken || '',
        },
      });
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
   * Create Stripe checkout session
   */
  async createCheckoutSession(orderId: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const sessionToken = getCurrentOrderSessionToken();
      const response = await fetch(`${this.baseUrl}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Order-Session': sessionToken || '',
        },
        body: JSON.stringify({ orderId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  /**
   * Get Stripe session details
   */
  async getStripeSession(sessionId: string): Promise<{ success: boolean; session?: any; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payments/session?session_id=${sessionId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching Stripe session:', error);
      return {
        success: false,
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
      const sessionToken = getCurrentOrderSessionToken();
      const response = await fetch(`${this.baseUrl}/api/record-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Order-Session': sessionToken || '',
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
      const sessionToken = getCurrentOrderSessionToken();
      const response = await fetch(`${this.baseUrl}/api/save-texts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Order-Session': sessionToken || '',
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

  /**
   * Get list of all orders with pagination and filters
   */
  async fetchOrders(params: OrdersListParams = {}): Promise<OrdersListResponse> {
    try {
      const authHeader = authManager.getAuthHeader();
      const searchParams = new URLSearchParams();
      
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.search) searchParams.append('search', params.search);
      if (params.propertyType) searchParams.append('propertyType', params.propertyType);
      if (params.city) searchParams.append('city', params.city);
      if (params.paid) searchParams.append('paid', params.paid);
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

      const response = await fetch(`${this.baseUrl}/api/orders?${searchParams}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      return {
        success: false,
        orders: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        error: 'Network error',
      };
    }
  }

  /**
   * Delete an order and all associated data
   */
  async deleteOrder(orderId: string): Promise<DeleteOrderResponse> {
    try {
      const authHeader = authManager.getAuthHeader();
      const csrfToken = this.getCSRFToken();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...authHeader,
      };
      
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }
      
      const response = await fetch(`${this.baseUrl}/api/order/${orderId}`, {
        method: 'DELETE',
        headers,
      });

      return await response.json();
    } catch (error) {
      console.error('Error deleting order:', error);
      return {
        success: false,
        message: '',
        error: 'Network error',
      };
    }
  }

  /**
   * Export order as ZIP file
   */
  async exportOrder(orderId: string): Promise<void> {
    try {
      const authHeader = authManager.getAuthHeader();
      const response = await fetch(`${this.baseUrl}/api/export/${orderId}`, {
        headers: {
          ...authHeader,
        },
      });
      
      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `order-${orderId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting order:', error);
      throw error;
    }
  }

  /**
   * Update admin notes for an order
   */
  async updateOrderNote(orderId: string, data: UpdateOrderNoteRequest): Promise<UpdateOrderNoteResponse> {
    try {
      const authHeader = authManager.getAuthHeader();
      const csrfToken = this.getCSRFToken();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...authHeader,
      };
      
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }
      
      const response = await fetch(`${this.baseUrl}/api/order/${orderId}/note`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error('Error updating order note:', error);
      return {
        success: false,
        orderId: '',
        updatedAt: '',
        error: 'Network error',
      };
    }
  }

  /**
   * Get admin statistics including database pool metrics
   */
  async fetchAdminStats(): Promise<AdminStatsResponse> {
    try {
      const authHeader = authManager.getAuthHeader();
      const response = await fetch(`${this.baseUrl}/api/admin/stats`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  /**
   * Send contact form message
   */
  async sendContactMessage(data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error('Error sending contact message:', error);
      return {
        success: false,
        error: 'Netzwerkfehler. Bitte versuchen Sie es später erneut.',
      };
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE);
