// lib/auth.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create axios instance with base configuration
export const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
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
      // Token expired or invalid, logout user
      authUtils.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'engineer' | 'admin';
}

// Removed unused LoginResponse interface

interface AuthData {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

export const authUtils = {
  // Get current auth data from localStorage
  getAuthData(): AuthData {
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('authToken');
      
      return {
        isLoggedIn,
        user: userStr ? JSON.parse(userStr) : null,
        token,
      };
    } catch (error) {
      console.error('Error getting auth data:', error);
      return {
        isLoggedIn: false,
        user: null,
        token: null,
      };
    }
  },

 // Login function
async login(email: string, password: string) {
  try {
    const response = await authApi.post<{ access_token: string; token_type: string }>(
      "/auth/login",
      { email, password }
    );

    if (response.status === 200 || response.status === 201) {
      const { access_token, token_type } = response.data;

      // Store token
      localStorage.setItem("authToken", access_token);
      localStorage.setItem("isLoggedIn", "true");

      // Fetch user profile with Authorization header
      try {
        const userResponse = await authApi.get("/auth/me", {
          headers: {
            Authorization: `${token_type} ${access_token}`,
          },
        });

        const userData = userResponse.data; // backend returns full user object
        localStorage.setItem("user", JSON.stringify(userData));

        return {
          success: true,
          user: userData,
          token: access_token,
        };
      } catch (userError) {
        console.error("Failed to fetch user profile:", userError);
        return {
          success: true,
          user: null,
          token: access_token,
        };
      }
    }

    return { success: false, error: "Login failed" };
  } catch (error) {
    console.error("Login error:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        const result = error.response.data;

        if (result.message) {
          return { success: false, error: result.message };
        } else {
          switch (error.response.status) {
            case 401:
              return { success: false, error: "Invalid email or password" };
            case 403:
              return { success: false, error: "Account access denied" };
            case 429:
              return {
                success: false,
                error: "Too many login attempts. Please try again later.",
              };
            default:
              return {
                success: false,
                error: "Login failed. Please try again.",
              };
          }
        }
      } else if (error.request) {
        return {
          success: false,
          error: "Network error. Please check your connection.",
        };
      }
    }

    return { success: false, error: "Login failed. Please try again." };
  }
},


  // Register function
  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) {
    try {
      const response = await authApi.post('/auth/register', userData);
      
      if (response.status === 200 || response.status === 201) {
        return { success: true };
      }
      
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const result = error.response.data;
          
          if (result.message) {
            return { success: false, error: result.message, errors: result.errors };
          } else if (result.errors) {
            return { success: false, error: 'Registration failed', errors: result.errors };
          }
        }
      }
      
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  },

  // Logout function
  logout() {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getAuthData().isLoggedIn && !!this.getAuthData().token;
  },

  // Get current user
  getCurrentUser(): User | null {
    return this.getAuthData().user;
  },

  // Get auth token
  getToken(): string | null {
    return this.getAuthData().token;
  },
};