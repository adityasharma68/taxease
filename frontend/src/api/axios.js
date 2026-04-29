// src/api/axios.js
// Configured Axios instance — automatically attaches JWT to every request
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";

// Create an axios instance with a base URL
// During development, Vite's proxy redirects /api → http://localhost:5000/api
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Before every request, check if we have a JWT stored in localStorage
// and automatically add it to the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("taxease_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// If the server returns 401 (Unauthorized), clear local storage and redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("taxease_token");
      localStorage.removeItem("taxease_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
