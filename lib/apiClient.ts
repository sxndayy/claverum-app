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
  customerName?: string;
  customerEmail?: string;
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

export interface DeleteUploadResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface DownloadUrlResponse {
  success: boolean;
  downloadUrl?: string;
  expiresIn?: number;
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
  orderType?: string; // 'evaluation', 'auftrag', or undefined for all
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

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Login failed' }));
        return {
          success: false,
          error: errorData.error || `Login failed: ${response.status} ${response.statusText}`,
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error. Please check your connection.',
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
   * Create a new order with retry logic and timeout
   */
  async createOrder(data?: Partial<UpdateOrderRequest>, retries: number = 3): Promise<CreateOrderResponse> {
    const timeoutMs = 10000; // 10 seconds timeout
    
    for (let attempt = 1; attempt <= retries; attempt++) {
    try {
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(`${this.baseUrl}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data || {}),
          signal: controller.signal,
      });

        clearTimeout(timeoutId);

        // Check if response is ok
        if (!response.ok) {
          const errorText = await response.text();
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { error: `Server error: ${response.status} ${response.statusText}` };
          }

          // Retry on server errors (5xx), but not on client errors (4xx)
          if (response.status >= 500 && attempt < retries) {
            console.warn(`Order creation attempt ${attempt} failed with status ${response.status}, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
            continue;
          }

          return {
            success: false,
            orderId: '',
            sessionToken: '',
            createdAt: '',
            error: errorData.error || `Server error: ${response.status}`,
          };
        }

        const result = await response.json();
        
        // Validate response structure
        if (!result.orderId || !result.sessionToken) {
          throw new Error('Invalid response from server');
        }

        return result;
      } catch (error: any) {
        // Handle abort (timeout)
        if (error.name === 'AbortError') {
          if (attempt < retries) {
            console.warn(`Order creation attempt ${attempt} timed out, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
          return {
            success: false,
            orderId: '',
            sessionToken: '',
            createdAt: '',
            error: 'Request timeout - Bitte versuchen Sie es erneut',
          };
        }

        // Handle network errors
        if (error instanceof TypeError && error.message.includes('fetch')) {
          if (attempt < retries) {
            console.warn(`Order creation attempt ${attempt} failed with network error, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
          return {
            success: false,
            orderId: '',
            sessionToken: '',
            createdAt: '',
            error: 'Netzwerkfehler - Bitte überprüfen Sie Ihre Internetverbindung',
          };
        }

        // Other errors
        console.error(`Error creating order (attempt ${attempt}):`, error);
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }

      return {
        success: false,
        orderId: '',
        sessionToken: '',
        createdAt: '',
          error: error.message || 'Unbekannter Fehler beim Erstellen des Auftrags',
      };
    }
    }

    // Should never reach here, but TypeScript needs it
    return {
      success: false,
      orderId: '',
      sessionToken: '',
      createdAt: '',
      error: 'Fehler beim Erstellen des Auftrags',
    };
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
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          uploadUrl: '',
          filePath: '',
          publicUrl: '',
          error: errorData.error || `Server error: ${response.status} ${response.statusText}`,
        };
      }
      
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
  async createCheckoutSession(orderId: string): Promise<{ success: boolean; url?: string; error?: string; statusCode?: number; retryAfter?: number }> {
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

      // Check if response is ok (status 200-299)
      if (!response.ok) {
        // Handle rate limiting (429)
        if (response.status === 429) {
          const retryAfterHeader = response.headers.get('Retry-After');
          const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60;
          
          // Try to parse error message from response
          let errorMessage = 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.';
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch {
            // If JSON parsing fails, use default message
          }

          return {
            success: false,
            error: 'rate_limit',
            statusCode: 429,
            retryAfter,
          };
        }

        // Handle other HTTP errors
        let errorMessage = `Server error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, use default message
        }

        return {
          success: false,
          error: errorMessage,
          statusCode: response.status,
        };
      }

      // Success - parse JSON response
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
   * Create Stripe checkout session with explicit token (for upload page)
   */
  async createCheckoutSessionWithToken(
    orderId: string,
    sessionToken: string,
    productType: 'analyse' | 'intensiv' = 'analyse'
  ): Promise<{ success: boolean; url?: string; error?: string; statusCode?: number; retryAfter?: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Order-Session': sessionToken,
        },
        body: JSON.stringify({ orderId, productType }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfterHeader = response.headers.get('Retry-After');
          const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60;
          return { success: false, error: 'rate_limit', statusCode: 429, retryAfter };
        }

        let errorMessage = `Server error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {}

        return { success: false, error: errorMessage, statusCode: response.status };
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating checkout session with token:', error);
      return { success: false, error: 'Network error' };
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
    const controller = new AbortController();
    const timeout = 30000; // 30s für Bilder

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('S3 Upload failed:', response.status, response.statusText);
        return false;
      }

      return true;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        console.error('Upload timeout after', timeout / 1000, 'seconds');
      } else {
        console.error('S3 Upload error:', error);
      }

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
   * Delete an upload from database and S3
   */
  async deleteUpload(orderId: string, uploadId: string): Promise<DeleteUploadResponse> {
    try {
      const sessionToken = getCurrentOrderSessionToken();
      const response = await fetch(`${this.baseUrl}/api/delete-upload/${orderId}/${uploadId}`, {
        method: 'DELETE',
        headers: {
          'X-Order-Session': sessionToken || '',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `Server error: ${response.status} ${response.statusText}`,
        };
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting upload:', error);
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  /**
   * Get presigned download URL for an uploaded file
   */
  async getDownloadUrl(orderId: string, uploadId: string): Promise<DownloadUrlResponse> {
    try {
      const sessionToken = getCurrentOrderSessionToken();
      const response = await fetch(`${this.baseUrl}/api/download-url/${orderId}/${uploadId}`, {
        headers: {
          'X-Order-Session': sessionToken || '',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `Server error: ${response.status} ${response.statusText}`,
        };
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting download URL:', error);
      return {
        success: false,
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
   * Get order details with all uploads and texts (for normal users with session token)
   */
  async getOrderDetails(orderId: string): Promise<OrderDetailsResponse> {
    try {
      const sessionToken = getCurrentOrderSessionToken();
      const response = await fetch(`${this.baseUrl}/api/order/${orderId}`, {
        headers: {
          'X-Order-Session': sessionToken || '',
        },
      });
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
   * Get order details with all uploads and texts (for admins with JWT token)
   */
  async getAdminOrderDetails(orderId: string): Promise<OrderDetailsResponse> {
    try {
      const authHeader = authManager.getAuthHeader();
      const response = await fetch(`${this.baseUrl}/api/admin/order/${orderId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching admin order details:', error);
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
      if (params.orderType) searchParams.append('orderType', params.orderType);
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
  /**
   * Update order with explicit session token (for Auftrag funnel)
   */
  async updateOrderWithToken(
    orderId: string,
    data: UpdateOrderRequest,
    sessionToken: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/update-order/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Order-Session': sessionToken,
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error('Error updating order with token:', error);
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  /**
   * Submit Auftrag (finalize order + trigger email)
   */
  async submitAuftrag(
    orderId: string,
    data: {
      propertyType: string;
      buildYear?: string;
      customerName: string;
      customerEmail: string;
      street: string;
      postalCode: string;
      city: string;
    },
    sessionToken: string
  ): Promise<{ success: boolean; uploadToken?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auftrag/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Order-Session': sessionToken,
        },
        body: JSON.stringify({ orderId, ...data }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error submitting auftrag:', error);
      return {
        success: false,
        error: 'Netzwerkfehler. Bitte versuchen Sie es erneut.',
      };
    }
  }

  /**
   * Validate upload token from email link
   */
  async validateUploadToken(
    token: string
  ): Promise<{ success: boolean; orderId?: string; sessionToken?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auftrag/upload-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error validating upload token:', error);
      return {
        success: false,
        error: 'Netzwerkfehler. Bitte versuchen Sie es erneut.',
      };
    }
  }

  /**
   * Get upload URL with explicit session token (for upload page)
   */
  async getUploadUrlWithToken(
    sessionToken: string,
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

      const response = await fetch(`${this.baseUrl}/api/upload-url?${params}`, {
        headers: {
          'X-Order-Session': sessionToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          uploadUrl: '',
          filePath: '',
          publicUrl: '',
          error: errorData.error || `Server error: ${response.status} ${response.statusText}`,
        };
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting upload URL with token:', error);
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
   * Record upload with explicit session token (for upload page)
   */
  async recordUploadWithToken(
    data: RecordUploadRequest,
    sessionToken: string
  ): Promise<RecordUploadResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/record-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Order-Session': sessionToken,
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error('Error recording upload with token:', error);
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
   * Delete upload with explicit session token (for upload page)
   */
  async deleteUploadWithToken(
    orderId: string,
    uploadId: string,
    sessionToken: string
  ): Promise<DeleteUploadResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/delete-upload/${orderId}/${uploadId}`, {
        method: 'DELETE',
        headers: {
          'X-Order-Session': sessionToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `Server error: ${response.status} ${response.statusText}`,
        };
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting upload with token:', error);
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  /**
   * Save texts with explicit session token (for upload page)
   */
  async saveTextsWithToken(
    data: SaveTextsRequest,
    sessionToken: string
  ): Promise<SaveTextsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/save-texts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Order-Session': sessionToken,
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error('Error saving texts with token:', error);
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
