// src/hooks/useSessionManager.js
// Handles:
//  1. Token expiry check on mount and every 60s
//  2. Idle timeout (default 30 min) with 2-min warning
//  3. Tab close / browser close cleanup via beforeunload
import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

const IDLE_TIMEOUT_MS  = 30 * 60 * 1000;  // 30 minutes idle → logout
const WARN_BEFORE_MS   =  2 * 60 * 1000;  // warn 2 min before logout
const CHECK_INTERVAL   = 60 * 1000;        // check token expiry every 60s
const ACTIVITY_EVENTS  = ["mousemove","mousedown","keydown","scroll","touchstart","click","wheel"];

// Decode JWT payload (no library needed — just base64)
export const decodeJWT = (token) => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g,"+").replace(/_/g,"/")));
    return decoded;
  } catch { return null; }
};

export const isTokenExpired = (token) => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
};

export const getTokenExpiresIn = (token) => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return 0;
  return Math.max(0, payload.exp * 1000 - Date.now());
};

// ── Main hook ─────────────────────────────────────────────────────────────────
export const useSessionManager = ({ onLogout }) => {
  const navigate     = useNavigate();
  const idleTimer    = useRef(null);
  const warnTimer    = useRef(null);
  const tokenChecker = useRef(null);
  const lastActivity = useRef(Date.now());
  const [warningVisible, setWarningVisible] = useState(false);
  const [countdown, setCountdown]           = useState(120); // seconds
  const countdownRef = useRef(null);

  const doLogout = useCallback((reason = "session_expired") => {
    clearTimeout(idleTimer.current);
    clearTimeout(warnTimer.current);
    clearInterval(tokenChecker.current);
    clearInterval(countdownRef.current);
    setWarningVisible(false);

    // Store reason for login page message
    sessionStorage.setItem("logout_reason", reason);

    // Clear all auth data
    localStorage.removeItem("taxease_token");
    localStorage.removeItem("taxease_user");

    if (onLogout) onLogout();
    navigate("/login", { replace: true });
  }, [navigate, onLogout]);

  const resetIdleTimer = useCallback(() => {
    lastActivity.current = Date.now();
    setWarningVisible(false);
    clearTimeout(idleTimer.current);
    clearTimeout(warnTimer.current);
    clearInterval(countdownRef.current);

    // Set warning timer (fires 2 min before logout)
    warnTimer.current = setTimeout(() => {
      setWarningVisible(true);
      setCountdown(120);
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, IDLE_TIMEOUT_MS - WARN_BEFORE_MS);

    // Set logout timer
    idleTimer.current = setTimeout(() => {
      doLogout("idle_timeout");
    }, IDLE_TIMEOUT_MS);
  }, [doLogout]);

  const stayActive = useCallback(() => {
    resetIdleTimer();
  }, [resetIdleTimer]);

  useEffect(() => {
    const token = localStorage.getItem("taxease_token");
    if (!token) return;

    // ── 1. Immediate token expiry check ──────────────────────────────────────
    if (isTokenExpired(token)) {
      doLogout("token_expired");
      return;
    }

    // ── 2. Periodic token expiry check every 60s ─────────────────────────────
    tokenChecker.current = setInterval(() => {
      const t = localStorage.getItem("taxease_token");
      if (!t || isTokenExpired(t)) {
        doLogout("token_expired");
      }
    }, CHECK_INTERVAL);

    // ── 3. Start idle timers ──────────────────────────────────────────────────
    resetIdleTimer();

    // ── 4. Activity event listeners ───────────────────────────────────────────
    const handleActivity = () => resetIdleTimer();
    ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, handleActivity, { passive: true }));

    // ── 5. Visibility change — when user comes back to tab ───────────────────
    const handleVisibility = () => {
      if (!document.hidden) {
        const t = localStorage.getItem("taxease_token");
        if (!t || isTokenExpired(t)) {
          doLogout("token_expired");
        } else {
          resetIdleTimer();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // ── 6. Storage change — detect logout in another tab ─────────────────────
    const handleStorage = (e) => {
      if (e.key === "taxease_token" && !e.newValue) {
        doLogout("logged_out_elsewhere");
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      clearTimeout(idleTimer.current);
      clearTimeout(warnTimer.current);
      clearInterval(tokenChecker.current);
      clearInterval(countdownRef.current);
      ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, handleActivity));
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("storage", handleStorage);
    };
  }, [doLogout, resetIdleTimer]);

  return { warningVisible, countdown, stayActive, doLogout };
};
