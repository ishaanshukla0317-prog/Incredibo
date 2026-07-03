import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api, { setAccessToken } from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback((token, userData) => {
    setAccessToken(token);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try { await api.get("/api/auth/logout"); } catch {}
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const refreshRes = await api.get("/api/auth/refresh-token");
        setAccessToken(refreshRes.data.accessToken);
        const meRes = await api.get("/api/auth/me");
        setUser(meRes.data);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);