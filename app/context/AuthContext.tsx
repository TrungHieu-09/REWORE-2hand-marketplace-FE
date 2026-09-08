"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "BUYER" | "SELLER" | "ADMIN";
  isVerified: boolean;
  reputation: number;
  totalSales: number;
  totalBids: number;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoggedIn: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    try {
      const storedToken = localStorage.getItem("rewore_token");
      const storedUser = localStorage.getItem("rewore_user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // corrupt data — clear it
      localStorage.removeItem("rewore_token");
      localStorage.removeItem("rewore_user");
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem("rewore_token", newToken);
    localStorage.setItem("rewore_user", JSON.stringify(newUser));
    // Keep backward compat key
    localStorage.setItem("rewore_authed", "true");
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("rewore_token");
    localStorage.removeItem("rewore_user");
    localStorage.removeItem("rewore_authed");
    setToken(null);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
