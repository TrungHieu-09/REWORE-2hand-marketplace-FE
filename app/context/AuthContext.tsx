"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Read initial state from localStorage
    setIsLoggedIn(localStorage.getItem("rewore_authed") === "true");

    // Listen for storage changes across tabs
    const handler = () =>
      setIsLoggedIn(localStorage.getItem("rewore_authed") === "true");
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const logout = () => {
    localStorage.removeItem("rewore_authed");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
