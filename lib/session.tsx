"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { ApiError, apiFetch, clearToken, getToken, setToken } from "@/lib/api";

export type RoleRef = {
  id: number;
  name: string;
};

export type User = {
  id: number;
  username: string;
  email?: string | null;
  role: RoleRef;
  permissions: string[];
  email_verified?: boolean;
  birth_date?: string | null;
  age?: number | null;
  avatar?: string | null;
  must_change_password?: boolean;
  created_at: string;
};

type SessionValue = {
  user: User | null;
  loading: boolean;
  loadError: boolean;
  retry: () => void;
  isAdmin: boolean;
  hasPermission: (module: string, action: string) => boolean;
  login: (token: string, user: User) => void;
  updateUser: (patch: Partial<User>) => void;
  logout: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const loadUser = useCallback(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(false);
    return apiFetch<User>("/me")
      .then(setUser)
      .catch((error) => {
        if (error instanceof ApiError && error.status === 401) {
          clearToken();
        } else {
          setLoadError(true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleUnauthorized() {
      setUser(null);
      setLoading(false);
    }

    window.addEventListener("taskflow:unauthorized", handleUnauthorized);
    void Promise.resolve().then(loadUser);

    return () => window.removeEventListener("taskflow:unauthorized", handleUnauthorized);
  }, [loadUser]);

  const login = useCallback((token: string, nextUser: User) => {
    setToken(token);
    setUser(nextUser);
  }, []);

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/logout", { method: "POST" });
    } catch {
    }
    clearToken();
    setUser(null);
  }, []);

  const resendVerificationEmail = useCallback(async () => {
    await apiFetch("/email/verification-notification", { method: "POST" });
  }, []);

  const hasPermission = useCallback(
    (module: string, action: string) => {
      if (!user) return false;
      if (user.role?.name === "admin") return true;
      return user.permissions?.includes(`${module}.${action}`) ?? false;
    },
    [user],
  );

  return (
    <SessionContext.Provider
      value={{
        user,
        loading,
        loadError,
        retry: loadUser,
        isAdmin: user?.role?.name === "admin",
        hasPermission,
        login,
        updateUser,
        logout,
        resendVerificationEmail,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession debe usarse dentro de un <SessionProvider>.");
  }
  return ctx;
}
