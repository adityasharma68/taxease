// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── Attach JWT to every request ───────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("taxease_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// ── Handle 401 — clear session and redirect ───────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("taxease_token");
      localStorage.removeItem("taxease_user");
      localStorage.removeItem("taxease_login_at");
      sessionStorage.setItem("logout_reason", "token_expired");
      // Only redirect if not already on auth pages
      const authPages = ["/login", "/register", "/"];
      if (!authPages.some(p => window.location.pathname === p)) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
