// Auth API URLs
export const AUTH_URLS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  GET_CURRENT_USER: '/users/me',
  UPDATE_PROFILE: '/auth/profile',
  UPDATE_PASSWORD: '/auth/password',
  RESET_PASSWORD: '/auth/reset-password',
};

// Products API URLs
export const PRODUCT_URLS = {
  GET_ALL: '/products',
  GET_BY_ID: (id: string) => `/products/${id}`,
  // Admin routes
  GET_ALL_ADMIN: '/products',
  CREATE: '/products',
  UPDATE: (id: string) => `/products/${id}`,
  DELETE: (id: string) => `/products/${id}`,
};

// Orders API URLs
export const ORDER_URLS = {
  GET_ALL: '/orders',
  GET_BY_ID: (id: string) => `/orders/${id}`,
  CREATE: '/orders',
  PROCEED: (id: string) => `/orders/${id}/proceed`,
  CANCEL: (id: string) => `/orders/${id}/cancel`,
};

// Users API URLs
export const USER_URLS = {
  GET_ALL: '/users',
  GET_BY_ID: (id: string) => `/users/${id}`,
  CREATE: '/users',
  UPDATE: (id: string) => `/users/${id}`,
  DELETE: (id: string) => `/users/${id}`,
};

// Dashboard API URLs
export const DASHBOARD_URLS = {
  SUMMARY: '/dashboard/summary',
  CHARTS: '/dashboard/charts',
};

// Notifications API URLs
export const NOTIFICATION_URLS = {
  GET_ALL: '/notifications',
  MARK_AS_READ: (id: string) => `/notifications/${id}/read`,
};
