import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'CHEF' | 'ADMIN';
  phoneNumber?: string;
  verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, userToken: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isTokenExpired: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Decode JWT token to get expiration time
const decodeToken = (token: string): { exp?: number } => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return {};
  }
};

// Check if token is expired
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded.exp) return false;
  
  // Check if token expires in less than 1 minute
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  return expirationTime < currentTime;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');
    
    if (storedToken && storedUser) {
      // Check if token is expired
      if (isTokenExpired(storedToken)) {
        // Token expired, clear storage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        console.warn('Stored token has expired');
      } else {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  // Set up token expiration check interval
  useEffect(() => {
    if (!token) return;

    const checkTokenExpiration = setInterval(() => {
      if (isTokenExpired(token)) {
        console.warn('Token has expired, logging out');
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkTokenExpiration);
  }, [token]);

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    sessionStorage.setItem('token', userToken);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    // Redirect to home page
    window.location.href = '/';
  };

  const refreshUser = async () => {
    if (!token) return;
    
    // Check if token is expired before making request
    if (isTokenExpired(token)) {
      console.warn('Token expired, logging out');
      logout();
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 401) {
        // Unauthorized - token invalid
        console.warn('Token invalid, logging out');
        logout();
        return;
      }
      
      const data = await response.json();
      if (data.success && data.data) {
        const updatedUser = data.data;
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUser, isTokenExpired: () => isTokenExpired(token) }}>
      {children}
    </AuthContext.Provider>
  );
};
