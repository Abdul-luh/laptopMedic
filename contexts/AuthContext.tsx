// contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authUtils } from "@/lib/auth";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "engineer" | "admin";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    userData: RegisterData
  ) => Promise<{ success: boolean; error?: string; errors?: Record<string, string> }>;
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
          // Verify with backend
          try {
            const refreshedUser = await authUtils.getCurrentUser();
            if (refreshedUser) {
              setUser(refreshedUser);
              localStorage.setItem("user", JSON.stringify(refreshedUser));
            }
          } catch (error) {
            console.log("Token validation failed, clearing auth data");
            authUtils.logout();
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
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
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const result = await authUtils.register(userData);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    authUtils.logout();
    window.location.href = "/";
  };

  const refreshUser = async () => {
    try {
      const refreshedUser = await authUtils.getCurrentUser();
      if (refreshedUser) {
        setUser(refreshedUser);
        localStorage.setItem("user", JSON.stringify(refreshedUser));
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
