"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  authApi,
  clearStoredAuth,
  getStoredToken,
  getStoredUser,
  setStoredAuth,
  type AuthUser,
  type User,
} from "@/app/lib/api";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: AuthUser | User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (payload: {
    email: string;
    password: string;
    name: string;
  }) => Promise<AuthUser>;
  refreshMe: () => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  user: null,
  token: null,
  login: async () => {
    throw new Error("AuthProvider is not mounted");
  },
  register: async () => {
    throw new Error("AuthProvider is not mounted");
  },
  refreshMe: async () => null,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<AuthUser | User | null>(() => getStoredUser());
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getStoredToken()));
  const [isLoading, setIsLoading] = useState(() => Boolean(getStoredToken()));

  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken) {
      authApi
        .me()
        .then((res) => {
          setUser(res.user);
          setStoredAuth(storedToken, res.user);
        })
        .catch(() => {
          clearStoredAuth();
          setToken(null);
          setUser(null);
          setIsLoggedIn(false);
        })
        .finally(() => setIsLoading(false));
    }

    const handler = () => {
      const nextToken = getStoredToken();
      setToken(nextToken);
      setUser(getStoredUser());
      setIsLoggedIn(Boolean(nextToken));
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    setStoredAuth(res.token, res.user);
    setToken(res.token);
    setUser(res.user);
    setIsLoggedIn(true);
    return res.user;
  };

  const register = async (payload: {
    email: string;
    password: string;
    name: string;
  }) => {
    const res = await authApi.register(payload);
    setStoredAuth(res.token, res.user);
    setToken(res.token);
    setUser(res.user);
    setIsLoggedIn(true);
    return res.user;
  };

  const refreshMe = async () => {
    if (!getStoredToken()) return null;
    const res = await authApi.me();
    const currentToken = getStoredToken();
    if (currentToken) setStoredAuth(currentToken, res.user);
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    try {
      if (getStoredToken()) await authApi.logout();
    } catch {
      // Backend does not blacklist tokens, so client cleanup is enough.
    }
    clearStoredAuth();
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        token,
        login,
        register,
        refreshMe,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
