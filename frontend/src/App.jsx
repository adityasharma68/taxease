// src/App.jsx — Root component with all routes
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import HomePage     from "./pages/HomePage";
import LoginPage    from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Client
import ClientLayout    from "./components/client/ClientLayout";
import ClientDashboard from "./pages/client/ClientDashboard";
import UploadDocuments from "./pages/client/UploadDocuments";
import FilingHistory   from "./pages/client/FilingHistory";
import PaymentsPage    from "./pages/client/PaymentsPage";
import ClientCalendar  from "./pages/client/ClientCalendar";
import ClientChat      from "./pages/client/ClientChat";
import ProfilePage     from "./pages/client/ProfilePage";

// Admin
import AdminLayout     from "./components/admin/AdminLayout";
import AdminDashboard  from "./pages/admin/AdminDashboard";
import ManageClients   from "./pages/admin/ManageClients";
import ManageFilings   from "./pages/admin/ManageFilings";
import ManageTasks     from "./pages/admin/ManageTasks";
import AdminReports    from "./pages/admin/AdminReports";
import AdminReminders  from "./pages/admin/AdminReminders";
import DocumentInbox   from "./pages/admin/DocumentInbox";

// Accountant
import AccountantLayout    from "./components/accountant/AccountantLayout";
import AccountantDashboard from "./pages/accountant/AccountantDashboard";
import AccountantTasks     from "./pages/accountant/AccountantTasks";
import ClientDocuments     from "./pages/accountant/ClientDocuments";
import AccountantChat      from "./pages/accountant/AccountantChat";

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <HomePage />;
  const map = { client:"/client/dashboard", admin:"/admin/dashboard", accountant:"/accountant/dashboard" };
  return <Navigate to={map[user.role] || "/"} replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{
        duration:3000,
        style:{ fontFamily:"DM Sans, sans-serif", fontSize:"14px" },
        success:{ iconTheme:{ primary:"#4f46e5", secondary:"#fff" } },
      }} />
      <Routes>
        <Route path="/"         element={<HomeRedirect />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ── Client ─────────────────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
          <Route element={<ClientLayout />}>
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/upload"    element={<UploadDocuments />} />
            <Route path="/client/filings"   element={<FilingHistory />} />
            <Route path="/client/payments"  element={<PaymentsPage />} />
            <Route path="/client/calendar"  element={<ClientCalendar />} />
            <Route path="/client/chat"      element={<ClientChat />} />
            <Route path="/client/profile"   element={<ProfilePage />} />
          </Route>
        </Route>

        {/* ── Admin ──────────────────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/clients"   element={<ManageClients />} />
            <Route path="/admin/filings"   element={<ManageFilings />} />
            <Route path="/admin/tasks"     element={<ManageTasks />} />
            <Route path="/admin/reports"   element={<AdminReports />} />
            <Route path="/admin/reminders" element={<AdminReminders />} />
            <Route path="/admin/inbox"     element={<DocumentInbox />} />
          </Route>
        </Route>

        {/* ── Accountant ─────────────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={["accountant"]} />}>
          <Route element={<AccountantLayout />}>
            <Route path="/accountant/dashboard" element={<AccountantDashboard />} />
            <Route path="/accountant/tasks"     element={<AccountantTasks />} />
            <Route path="/accountant/documents" element={<ClientDocuments />} />
            <Route path="/accountant/chat"      element={<AccountantChat />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
