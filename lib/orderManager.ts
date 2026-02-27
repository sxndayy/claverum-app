/**
 * Order Manager
 * Manages order session and persistence in sessionStorage
 * Ensures one order per session, no duplicates on reload
 */

const ORDER_ID_KEY = 'claverum_order_id';
const ORDER_DATA_KEY = 'claverum_order_data';
const ORDER_SESSION_TOKEN_KEY = 'claverum_order_session_token';
const CURRENT_STEP_KEY = 'claverum_current_step';

// Auftrag funnel uses separate storage keys to avoid conflicts
export const AUFTRAG_ORDER_ID_KEY = 'bauklar_auftrag_order_id';
export const AUFTRAG_SESSION_TOKEN_KEY = 'bauklar_auftrag_session_token';
export const AUFTRAG_FORM_DATA_KEY = 'bauklar_auftrag_form_v1';

export interface OrderData {
  orderId: string;
  sessionToken: string;
  createdAt: string;
  lastUpdated: string;
}

/**
 * Get current order ID from session storage
 */
export function getCurrentOrderId(): string | null {
  if (typeof window === 'undefined') {
    return null; // Server-side: return null
  }
  try {
    return sessionStorage.getItem(ORDER_ID_KEY);
  } catch (error) {
    console.error('Error reading from sessionStorage:', error);
    return null;
  }
}

/**
 * Get current order session token
 */
export function getCurrentOrderSessionToken(): string | null {
  if (typeof window === 'undefined') {
    return null; // Server-side: return null
  }
  try {
    return sessionStorage.getItem(ORDER_SESSION_TOKEN_KEY);
  } catch (error) {
    console.error('Error reading session token:', error);
    return null;
  }
}

/**
 * Set order ID and session token in session storage
 */
export function setCurrentOrder(orderId: string, sessionToken: string): void {
  if (typeof window === 'undefined') {
    return; // Server-side: do nothing
  }
  try {
    sessionStorage.setItem(ORDER_ID_KEY, orderId);
    sessionStorage.setItem(ORDER_SESSION_TOKEN_KEY, sessionToken);
    
    // Also store order metadata
    const orderData: OrderData = {
      orderId,
      sessionToken,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    sessionStorage.setItem(ORDER_DATA_KEY, JSON.stringify(orderData));
  } catch (error) {
    console.error('Error writing to sessionStorage:', error);
  }
}

/**
 * Get order metadata
 */
export function getOrderData(): OrderData | null {
  if (typeof window === 'undefined') {
    return null; // Server-side: return null
  }
  try {
    const data = sessionStorage.getItem(ORDER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading order data:', error);
    return null;
  }
}

/**
 * Update last updated timestamp
 */
export function updateOrderTimestamp(): void {
  if (typeof window === 'undefined') {
    return; // Server-side: do nothing
  }
  try {
    const data = getOrderData();
    if (data) {
      data.lastUpdated = new Date().toISOString();
      sessionStorage.setItem(ORDER_DATA_KEY, JSON.stringify(data));
    }
  } catch (error) {
    console.error('Error updating order timestamp:', error);
  }
}

/**
 * Clear order session (e.g., after successful checkout)
 */
export function clearOrderSession(): void {
  if (typeof window === 'undefined') {
    return; // Server-side: do nothing
  }
  try {
    sessionStorage.removeItem(ORDER_ID_KEY);
    sessionStorage.removeItem(ORDER_DATA_KEY);
    sessionStorage.removeItem(ORDER_SESSION_TOKEN_KEY);
    clearCurrentStep(); // Also clear current step
  } catch (error) {
    console.error('Error clearing order session:', error);
  }
}

/**
 * Check if order session exists
 */
export function hasActiveOrder(): boolean {
  return getCurrentOrderId() !== null && getCurrentOrderSessionToken() !== null;
}

/**
 * Get current step from session storage
 */
export function getCurrentStep(): number {
  if (typeof window === 'undefined') {
    return 1; // Server-side: return default
  }
  try {
    const step = sessionStorage.getItem(CURRENT_STEP_KEY);
    return step ? parseInt(step, 10) : 1; // Return 1 as default instead of null
  } catch (error) {
    console.error('Error reading current step from sessionStorage:', error);
    return 1; // Return 1 as default on error
  }
}

/**
 * Set current step in session storage
 */
export function setCurrentStep(step: number): void {
  if (typeof window === 'undefined') {
    return; // Server-side: do nothing
  }
  try {
    // Validate step is between 1 and 4 (updated funnel)
    if (step >= 1 && step <= 4) {
      sessionStorage.setItem(CURRENT_STEP_KEY, step.toString());
    }
  } catch (error) {
    console.error('Error writing current step to sessionStorage:', error);
  }
}

/**
 * Clear current step from session storage
 */
export function clearCurrentStep(): void {
  if (typeof window === 'undefined') {
    return; // Server-side: do nothing
  }
  try {
    sessionStorage.removeItem(CURRENT_STEP_KEY);
  } catch (error) {
    console.error('Error clearing current step from sessionStorage:', error);
  }
}

