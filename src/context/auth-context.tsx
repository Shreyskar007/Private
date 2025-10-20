"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import users from '@/data/users.json';

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted.
    try {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else if (pathname !== '/login') {
        router.push('/login');
      }
    } catch (error) {
      // If sessionStorage is not available (e.g., during SSR), we assume not logged in.
      if (pathname !== '/login') {
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [pathname, router]);

  const login = (username: string, password: string): boolean => {
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const userData = { username: foundUser.username };
      try {
        sessionStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        // sessionStorage not available
      }
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    try {
      sessionStorage.removeItem('user');
    } catch (error) {
      // sessionStorage not available
    }
    setUser(null);
    router.push('/login');
  };

  const value = { user, login, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
