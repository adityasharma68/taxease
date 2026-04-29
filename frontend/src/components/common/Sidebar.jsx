// src/components/common/Sidebar.jsx — Updated with Profile & KYC link
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, Upload, FileText, CreditCard, Calendar,
  MessageCircle, Users, ClipboardList, BarChart2,
  CheckSquare, LogOut, Menu, ShieldCheck, UserCircle,
} from "lucide-react";

const NAV_ITEMS = {
  client: [
    { to:"/client/dashboard", label:"Overview",            icon:LayoutDashboard },
    { to:"/client/upload",    label:"Upload Documents",    icon:Upload },
    { to:"/client/filings",   label:"Filing History",      icon:FileText },
    { to:"/client/payments",  label:"Payments",            icon:CreditCard },
    { to:"/client/calendar",  label:"Compliance Calendar", icon:Calendar },
    { to:"/client/chat",      label:"Chat Support",        icon:MessageCircle },
    { to:"/client/profile",   label:"Profile & KYC",       icon:UserCircle },
  ],
  admin: [
    { to:"/admin/dashboard", label:"Overview",       icon:LayoutDashboard },
    { to:"/admin/clients",   label:"Manage Clients", icon:Users },
    { to:"/admin/filings",   label:"All Filings",    icon:FileText },
    { to:"/admin/tasks",     label:"Assign Tasks",   icon:ClipboardList },
    { to:"/admin/reports",   label:"Reports",        icon:BarChart2 },
  ],
  accountant: [
    { to:"/accountant/dashboard", label:"Overview",         icon:LayoutDashboard },
    { to:"/accountant/tasks",     label:"My Tasks",         icon:CheckSquare },
    { to:"/accountant/documents", label:"Client Documents", icon:FileText },
    { to:"/accountant/chat",      label:"Client Chat",      icon:MessageCircle },
  ],
};

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const items = NAV_ITEMS[user?.role] || [];

  return (
    <aside className={`bg-slate-900 text-white flex flex-col fixed left-0 top-0 bottom-0 z-30 transition-all duration-300 ${collapsed?"w-16":"w-64"}`}>
      <div className="h-16 flex items-center px-4 gap-3 border-b border-slate-800">
        <button onClick={() => setCollapsed(!collapsed)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0">
          <Menu size={18} />
        </button>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-indigo-400" />
            <span className="text-lg font-bold" style={{fontFamily:"serif"}}>TaxEase</span>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="px-4 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
              {user?.name?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role} • {user?.plan || ""}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive?"bg-indigo-600 text-white":"text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-red-400 text-sm font-medium transition-all">
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
