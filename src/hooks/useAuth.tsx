'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (data: any) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (roles: ('supporter' | 'creator' | 'admin')[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const localToken = localStorage.getItem('token');
        const localUser = localStorage.getItem('user');

        if (localToken && localUser) {
          setToken(localToken);
          setUser(JSON.parse(localUser));
        }

        // Fetch fresh user profile from API (essential for Google OAuth redirect)
        const data = await authService.getCurrentUser();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          const freshToken = localStorage.getItem('token');
          if (freshToken) setToken(freshToken);
        }
      } catch (err) {
        // Safe check: Only clear if they had some local credentials previously
        if (localStorage.getItem('token') || localStorage.getItem('user')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (data: any) => {
    setLoading(true);
    try {
      const res = await authService.login(data);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const res = await authService.register(data);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      setUser(null);
      setToken(null);
      setLoading(false);
      router.push('/');
    }
  };

  const refreshUser = async () => {
    try {
      const data = await authService.getCurrentUser();
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (err) {
      console.error('Failed to refresh user details:', err);
    }
  };

  const hasRole = (roles: ('supporter' | 'creator' | 'admin')[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        login,
        register,
        logout,
        refreshUser,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
