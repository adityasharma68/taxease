// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/common/UI";

const ProtectedRoute = ({ allowedRoles = [], roles = [] }) => {
  const { user, loading } = useAuth();

  // Support both prop names: allowedRoles (App.jsx) and roles (legacy)
  const permitted = allowedRoles.length > 0 ? allowedRoles : roles;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-base)" }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (permitted.length > 0 && !permitted.includes(user.role)) {
    const map = {
      client:     "/client/dashboard",
      admin:      "/admin/dashboard",
      accountant: "/accountant/dashboard",
    };
    return <Navigate to={map[user.role] || "/"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
