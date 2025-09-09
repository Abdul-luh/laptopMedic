// contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authUtils, authApi } from '@/lib/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'engineer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string; errors?: Record<string, string> }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authData = authUtils.getAuthData();
        if (authData && authData.isLoggedIn && authData.user) {
          // Verify the token is still valid by making a test request
          try {
            const response = await authApi.get('/user/me');
            if (response.data.user) {
              setUser(response.data.user);
              // Update localStorage with fresh user data
              localStorage.setItem('user', JSON.stringify(response.data.user));
            }
          } catch (error) {
            // Token is invalid, clear auth data
            console.log('Token validation failed, clearing auth data');
            authUtils.logout();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        authUtils.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authUtils.login(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const result = await authUtils.register(userData);
      
      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: result.error, errors: result.errors };
      }
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    authUtils.logout();
    // Optionally redirect to home page
    window.location.href = '/';
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.get('/user/me');
      const updatedUser = response.data.user;
      setUser(updatedUser);
      
      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // If refresh fails, logout user
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}