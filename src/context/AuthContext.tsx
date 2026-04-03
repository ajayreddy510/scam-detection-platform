'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLocalUsers, saveLocalUser, findLocalUser, userExists } from '@/lib/localAuth';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: 'user' | 'admin') => Promise<{ success: boolean; error?: string }>;
  register: (email: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasRole: (role: 'user' | 'admin') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials
const ADMIN_EMAIL = 'reddyajay510@gmail.com';
const ADMIN_PASSWORD = 'Ajay#2004';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Ensure we're on client side
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('safehire_auth_token');
          const userData = localStorage.getItem('safehire_user_data');
          
          console.log('🔐 Auth check - Token:', !!token, 'UserData:', !!userData);
          
          if (token && userData) {
            try {
              const parsedUser = JSON.parse(userData);
              setUser(parsedUser);
              console.log('✅ User restored from localStorage:', parsedUser);
            } catch (parseError) {
              console.error('❌ Error parsing user data:', parseError);
              localStorage.removeItem('safehire_user_data');
              localStorage.removeItem('safehire_auth_token');
            }
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    // Small delay to ensure localStorage is ready
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string, role: 'user' | 'admin' = 'user') => {
    try {
      // Check for admin login
      if (role === 'admin') {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          const adminUser: User = {
            id: 'admin-001',
            email: email,
            name: 'REDDYAJAY510',
            role: 'admin',
          };
          
          setUser(adminUser);
          localStorage.setItem('safehire_auth_token', 'admin-token-' + Date.now());
          localStorage.setItem('safehire_user_data', JSON.stringify(adminUser));
          
          return { success: true };
        } else {
          return { success: false, error: 'Invalid admin credentials' };
        }
      } else {
        // Regular user login using local auth
        const localUser = findLocalUser(email, password);
        
        if (localUser) {
          const userData: User = {
            id: localUser.id,
            email: localUser.email,
            name: localUser.name,
            role: 'user',
          };
          
          setUser(userData);
          localStorage.setItem('safehire_auth_token', 'user-token-' + Date.now());
          localStorage.setItem('safehire_user_data', JSON.stringify(userData));
          
          return { success: true };
        } else {
          return { success: false, error: 'Invalid email or password' };
        }
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (email: string, name: string, password: string) => {
    try {
      // Check if user already exists
      if (userExists(email)) {
        return { success: false, error: 'Email already registered' };
      }

      // Validate input
      if (!email || !name || !password) {
        return { success: false, error: 'All fields are required' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      // Save user locally
      const newUser = saveLocalUser({
        email: email,
        name: name,
        password: password,
        role: 'user',
      });

      // Log them in automatically
      const userData: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: 'user',
      };

      setUser(userData);
      localStorage.setItem('safehire_auth_token', 'user-token-' + Date.now());
      localStorage.setItem('safehire_user_data', JSON.stringify(userData));

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('safehire_auth_token');
      localStorage.removeItem('safehire_user_data');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const hasRole = (role: 'user' | 'admin') => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
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
