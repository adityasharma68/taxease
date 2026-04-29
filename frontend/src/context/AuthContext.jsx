// src/context/AuthContext.jsx
// Global authentication state using React Context
// Every component can access `user`, `login`, `logout` from here
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

// 1. Create the context object
const AuthContext = createContext(null);

// 2. Provider component — wraps the entire app in App.jsx
export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage (so user stays logged in on refresh)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("taxease_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  // ─── Login ───────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });

      // Save the JWT token and user object to localStorage
      localStorage.setItem("taxease_token", data.token);
      localStorage.setItem("taxease_user", JSON.stringify(data.user));

      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name.split(" ")[0]}! 👋`);
      return { success: true, role: data.user.role };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ─── Register ────────────────────────────────────────────────────────────
  const register = async (formData) => {
    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      toast.success("Account created! Please login.");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ─── Logout ──────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("taxease_token");
    localStorage.removeItem("taxease_user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  // ─── Update local user state (after profile edit) ────────────────────────
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("taxease_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook — shortcut to use the context
// Usage: const { user, login, logout } = useAuth();
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export default AuthContext;
