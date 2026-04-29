// src/hooks/useApi.js
// Generic reusable hook for API calls with loading/error state management
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

/**
 * useApi — fetches data from an API endpoint on mount
 *
 * @param {string} endpoint - The API path e.g. "/filings"
 * @param {Object} params   - Optional query params e.g. { status: "Pending" }
 *
 * @returns {{ data, loading, error, refetch }}
 */
export const useApi = (endpoint, params = {}) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await api.get(endpoint, { params });
      setData(res);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load data";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [endpoint, JSON.stringify(params)]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * useMutation — for POST/PUT/DELETE calls triggered by user action
 *
 * @param {string} method   - "post" | "put" | "delete"
 * @param {string} endpoint - API path
 *
 * @returns {{ mutate, loading, error }}
 *
 * Usage:
 *   const { mutate, loading } = useMutation("put", `/filings/${id}`);
 *   const result = await mutate({ status: "Filed" });
 */
export const useMutation = (method, endpoint) => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const mutate = async (body = {}, dynamicEndpoint = null) => {
    setLoading(true);
    setError(null);
    try {
      const url = dynamicEndpoint || endpoint;
      const { data } = await api[method](url, body);
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || "Operation failed";
      setError(msg);
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};
