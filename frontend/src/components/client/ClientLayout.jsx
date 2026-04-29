// src/components/client/ClientLayout.jsx
// Shell layout for the Client dashboard — sidebar + topbar + page content
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import TopBar  from "../common/TopBar";

const ClientLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar navigation */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main content area — shifts right to make room for sidebar */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
        <TopBar collapsed={collapsed} />
        {/* Outlet renders the matched child route page */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
