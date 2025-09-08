// lib/auth.ts
import axios, { AxiosInstance } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create axios instance with base configuration
export const authApi: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      clearAuthData();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication utility functions
export const authUtils = {
  // Store authentication data
  setAuthData: (token: string, user: any) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
  },

  // Get authentication data
  getAuthData: () => {
    if (typeof window === 'undefined') return null; // SSR safety
    
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (token && userStr && isLoggedIn) {
      try {
        const user = JSON.parse(userStr);
        return { token, user, isLoggedIn };
      } catch (error) {
        console.error('Error parsing user data:', error);
        clearAuthData();
        return null;
      }
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false; // SSR safety
    
    const authData = authUtils.getAuthData();
    return authData !== null && authData.isLoggedIn;
  },

  // Get current user
  getCurrentUser: () => {
    const authData = authUtils.getAuthData();
    return authData?.user || null;
  },

  // Get auth token
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null; // SSR safety
    return localStorage.getItem('authToken');
  },

  // Login function
  login: async (email: string, password: string) => {
    try {
      const response = await authApi.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      authUtils.setAuthData(token, user);

      return { success: true, user, token };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Login failed';
        return { success: false, error: message };
      }
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  // Logout function
  logout: async () => {
    try {
      // Call backend logout endpoint if available
      await authApi.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local auth data
      clearAuthData();
      window.location.href = '/login';
    }
  },

  // Register function
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    try {
      const response = await authApi.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Registration failed';
        const errors = error.response?.data?.errors || null;
        return { success: false, error: message, errors };
      }
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  // Refresh token function (if your backend supports it)
  refreshToken: async () => {
    try {
      const response = await authApi.post('/auth/refresh');
      const { token } = response.data;
      
      // Update token in localStorage
      localStorage.setItem('authToken', token);
      
      return { success: true, token };
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuthData();
      return { success: false };
    }
  },

  // Password reset request
  requestPasswordReset: async (email: string) => {
    try {
      await authApi.post('/auth/forgot-password', { email });
      return { success: true };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Password reset request failed';
        return { success: false, error: message };
      }
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  // Password reset
  resetPassword: async (token: string, newPassword: string) => {
    try {
      await authApi.post('/auth/reset-password', {
        token,
        password: newPassword,
      });
      return { success: true };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Password reset failed';
        return { success: false, error: message };
      }
      return { success: false, error: 'An unexpected error occurred' };
    }
  },
};

// Helper function to clear authentication data
export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
};
