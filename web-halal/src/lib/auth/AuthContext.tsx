"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STORAGE_KEY = "halal_auth";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

interface AuthResult {
  error?: string;
}

interface AuthState {
  user: AuthUser | null;
  jwt: string | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<AuthResult>;
  register: (username: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed.user ?? null);
        setJwt(parsed.jwt ?? null);
      }
    } catch {
      // Corrupt/unavailable storage — treat as logged out.
    }
    setLoading(false);
  }, []);

  const persist = useCallback((nextUser: AuthUser | null, nextJwt: string | null) => {
    setUser(nextUser);
    setJwt(nextJwt);
    if (nextUser && nextJwt) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser, jwt: nextJwt }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(
    async (identifier: string, password: string): Promise<AuthResult> => {
      try {
        const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password }),
        });
        const json = await res.json();
        if (!res.ok) {
          return { error: json.error?.message || "Email hoặc mật khẩu không đúng." };
        }
        persist(json.user, json.jwt);
        return {};
      } catch {
        return { error: "Không thể kết nối đến server. Vui lòng thử lại sau." };
      }
    },
    [persist]
  );

  const register = useCallback(
    async (username: string, email: string, password: string): Promise<AuthResult> => {
      try {
        const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });
        const json = await res.json();
        if (!res.ok) {
          return { error: json.error?.message || "Đăng ký thất bại." };
        }
        persist(json.user, json.jwt);
        return {};
      } catch {
        return { error: "Không thể kết nối đến server. Vui lòng thử lại sau." };
      }
    },
    [persist]
  );

  const logout = useCallback(() => persist(null, null), [persist]);

  return (
    <AuthContext.Provider value={{ user, jwt, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
