// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { isTokenExpired } from "../hooks/useSessionManager";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session on load — expire stale tokens immediately ────────────
  useEffect(() => {
    const token  = localStorage.getItem("taxease_token");
    const stored = localStorage.getItem("taxease_user");

    if (token && stored) {
      // Check if JWT is expired before restoring
      if (isTokenExpired(token)) {
        clearSession();           // wipe stale data silently
        sessionStorage.setItem("logout_reason", "token_expired");
      } else {
        try { setUser(JSON.parse(stored)); }
        catch { clearSession(); }
      }
    }
    setLoading(false);
  }, []);

  const clearSession = () => {
    localStorage.removeItem("taxease_token");
    localStorage.removeItem("taxease_user");
    setUser(null);
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("taxease_token", data.token);
      localStorage.setItem("taxease_user",  JSON.stringify(data.user));
      // Store login timestamp
      localStorage.setItem("taxease_login_at", Date.now().toString());
      sessionStorage.removeItem("logout_reason");
      setUser(data.user);
      return { success: true, role: data.user.role };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await api.post("/auth/register", formData);
      localStorage.setItem("taxease_token", data.token);
      localStorage.setItem("taxease_user",  JSON.stringify(data.user));
      localStorage.setItem("taxease_login_at", Date.now().toString());
      sessionStorage.removeItem("logout_reason");
      setUser(data.user);
      return { success: true, role: data.user.role };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Registration failed" };
    }
  };

  const logout = () => {
    clearSession();
    localStorage.removeItem("taxease_login_at");
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem("taxease_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

export default AuthContext;
