"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export type UserRole = "admin" | "user";

export interface AuthUser {
  username: string;
  displayName: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

const SESSION_KEY = "jacqes_session";
const USER_KEY    = "jacqes_user";
const ROLE_KEY    = "jacqes_role";

export const USER_TOKEN  = process.env.NEXT_PUBLIC_SESSION_TOKEN  ?? "jacqes-bi-danilo-awq";
export const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN    ?? "jacqes-bi-admin-awq";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const token    = localStorage.getItem(SESSION_KEY);
    const username = localStorage.getItem(USER_KEY) || "";
    const role     = localStorage.getItem(ROLE_KEY) as UserRole | null;

    if (token === ADMIN_TOKEN || role === "admin") {
      setUser({ username: username || "admin", displayName: "Admin", role: "admin" });
    } else if (token === USER_TOKEN) {
      setUser({ username: username || "danilo", displayName: "Danilo", role: "user" });
    }
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROLE_KEY);
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
