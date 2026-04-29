// src/routes/ProtectedRoute.jsx
// Route guard — redirects unauthenticated users to login
// Also checks role so a client can't access /admin routes
// ─────────────────────────────────────────────────────────────────────────────

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute
 * @param {string[]} allowedRoles  - Roles that may access this route
 *                                   e.g. ["admin"] or ["client", "accountant"]
 *                                   If empty/omitted, any logged-in user is allowed
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user } = useAuth();

  // Not logged in → redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role → redirect to their own dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const dashMap = {
      client:     "/client/dashboard",
      admin:      "/admin/dashboard",
      accountant: "/accountant/dashboard",
    };
    return <Navigate to={dashMap[user.role] || "/"} replace />;
  }

  // All good — render the child route
  return <Outlet />;
};

export default ProtectedRoute;
