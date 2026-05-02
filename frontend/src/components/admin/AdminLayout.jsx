// src/components/admin/AdminLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import TopBar  from "../common/TopBar";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: collapsed ? "4rem" : "16rem" }}
      >
        <TopBar />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
