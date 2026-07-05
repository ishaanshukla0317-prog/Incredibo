import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api, { setAccessToken } from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [loading, setLoading] = useState(true);


  const login = useCallback((token, userData) => {
    setAccessToken(token);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isAuthenticated", "true");
  }, []);

  const logout = useCallback(async () => {
    try { await api.get("/api/auth/logout"); } catch {}
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken"); 
    localStorage.removeItem("isAuthenticated");
  }, []);

  useEffect(() => {
    const bootstrap = async () => {

      const isAuth = localStorage.getItem("isAuthenticated");


      if (!isAuth) {
        setLoading(false);
        return;
      }

      try {
        const refreshRes = await api.get("/api/auth/refresh-token");
        setAccessToken(refreshRes.data.accessToken);
        
        const meRes = await api.get("/api/auth/me");
        setUser(meRes.data);
        localStorage.setItem("user", JSON.stringify(meRes.data));
      } catch {

        setAccessToken(null);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("isAuthenticated");
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