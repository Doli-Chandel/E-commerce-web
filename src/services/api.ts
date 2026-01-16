import axios from 'axios';
import type { User, Product, Order, CartItem } from '@/types';
import { AUTH_URLS, PRODUCT_URLS, ORDER_URLS, USER_URLS, DASHBOARD_URLS, NOTIFICATION_URLS } from './apiUrls';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await api.post(AUTH_URLS.LOGIN, { email, password });
    const { user, token } = response.data.data;
    localStorage.setItem('token', token);
    return { user, token };
  },

  register: async (email: string, password: string, name: string): Promise<{ user: User; token: string }> => {
    const response = await api.post(AUTH_URLS.REGISTER, { email, password, name });
    // Handle different response formats
    const data = response.data?.data || response.data;
    const { user, token } = data;
    localStorage.setItem('token', token);
    return { user, token };
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get(AUTH_URLS.GET_CURRENT_USER);
    return response.data.data;
  },

  updateProfile: async (data: { name?: string; email?: string }): Promise<User> => {
    const response = await api.put(AUTH_URLS.UPDATE_PROFILE, data);
    // Handle different response formats
    if (response.data && response.data.data) {
      return response.data.data.user || response.data.data;
    }
    return response.data;
  },

  updatePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.put(AUTH_URLS.UPDATE_PASSWORD, { oldPassword, newPassword });
  },

  resetPassword: async (email: string, newPassword: string): Promise<void> => {
    await api.post(AUTH_URLS.RESET_PASSWORD, { email, newPassword });
  },
};

// Products API
export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get(PRODUCT_URLS.GET_ALL);
    // Handle different response formats
    console.log(response.data);
    return response.data.data.products;
  },

  getAllAdmin: async (): Promise<Product[]> => {
    const response = await api.get(PRODUCT_URLS.GET_ALL_ADMIN);
    return response.data.data.products;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get(PRODUCT_URLS.GET_BY_ID(id));
    console.log('Product getById response:', response.data);
    // Handle different response formats
    if (response.data && response.data.data) {
      return response.data.data;
    } else if (response.data && response.data.product) {
      return response.data.product;
    } else if (response.data && response.data.data?.product) {
      return response.data.data.product;
    }
    return response.data;
  },

  create: async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'margin'>): Promise<Product> => {
    const response = await api.post(PRODUCT_URLS.CREATE, data);
    // Handle different response formats
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    const response = await api.put(PRODUCT_URLS.UPDATE(id), data);
    // Handle different response formats
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(PRODUCT_URLS.DELETE(id));
  },
};

// Orders API
export const ordersAPI = {
  getAll: async (): Promise<Order[]> => {
    const response = await api.get(ORDER_URLS.GET_ALL);
    // Handle different response formats
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (response.data && Array.isArray(response.data.data?.orders)) {
      return response.data.data.orders;
    } else if (response.data && Array.isArray(response.data.orders)) {
      return response.data.orders;
    }
    console.warn('Unexpected orders API response format:', response.data);
    return [];
  },

  getById: async (id: string): Promise<Order> => {
    const response = await api.get(ORDER_URLS.GET_BY_ID(id));
    // Handle different response formats
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  create: async (items: CartItem[], shippingInfo?: any): Promise<Order> => {
    // Transform cart items to backend format: [{ productId, quantity }]
    const orderItems = items.map((item) => {
      if (!item.product || !item.product.id) {
        throw new Error(`Invalid cart item: product ID is missing`);
      }
      return {
        productId: item.product.id,
        quantity: item.quantity,
      };
    });
    
    // Log for debugging (remove in production)
    console.log('Creating order with items:', orderItems);
    
    const response = await api.post(ORDER_URLS.CREATE, { items: orderItems });
    // Handle different response formats
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  proceed: async (id: string): Promise<Order> => {
    const response = await api.patch(ORDER_URLS.PROCEED(id));
    // Handle different response formats
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  cancel: async (id: string): Promise<Order> => {
    const response = await api.patch(ORDER_URLS.CANCEL(id));
    // Handle different response formats
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get(USER_URLS.GET_ALL);
    return response.data.data.users;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(USER_URLS.GET_BY_ID(id));
    return response.data.data;
  },

  create: async (data: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const response = await api.post(USER_URLS.CREATE, data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put(USER_URLS.UPDATE(id), data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(USER_URLS.DELETE(id));
  },
};

// Dashboard API
export const dashboardAPI = {
  getSummary: async (): Promise<{
    totalOrders: number;
    totalRevenue: number;
    totalProfit: number;
    totalLoss: number;
  }> => {
    const response = await api.get(DASHBOARD_URLS.SUMMARY);
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  getCharts: async (days: number = 30): Promise<{
    ordersPerDay: any[];
    revenuePerDay: any[];
    profitPerDay: any[];
  }> => {
    const response = await api.get(DASHBOARD_URLS.CHARTS, { params: { days } });
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },
};

// Notifications API
export const notificationsAPI = {
  getAll: async (params?: { page?: number; limit?: number; isRead?: boolean }): Promise<any[]> => {
    const response = await api.get(NOTIFICATION_URLS.GET_ALL, { params });
    if (response.data && response.data.data) {
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data.data.notifications) {
        return response.data.data.notifications;
      }
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.patch(NOTIFICATION_URLS.MARK_AS_READ(id));
  },
};

export default api;
