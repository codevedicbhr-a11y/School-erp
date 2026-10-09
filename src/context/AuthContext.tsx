"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, Role } from "@/lib/types";
import { DEMO_USERS } from "@/lib/mock-data";

interface AuthContextType {
  user: User | null;
  login: (email: string, role?: Role) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("school-erp-user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("school-erp-user");
      }
    }
  }, []);

  const login = (email: string, role?: Role) => {
    let found = DEMO_USERS.find((u) => u.email === email);
    if (!found && role) {
      found = DEMO_USERS.find((u) => u.role === role);
    }
    if (found) {
      setUser(found);
      localStorage.setItem("school-erp-user", JSON.stringify(found));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("school-erp-user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
