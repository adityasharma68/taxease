import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ThemeSwitcher } from "./ThemeToggle";
import {
  ShieldCheck, LayoutDashboard, Upload, FileText, Calendar,
  MessageCircle, CreditCard, User, Users, FolderOpen,
  Bell, BarChart2, CheckSquare, LogOut, ChevronLeft,
  ChevronRight, Menu, X,
} from "lucide-react";

const NAV_ITEMS = {
  client: [
    { to: "/client/dashboard",  label: "Dashboard",    icon: LayoutDashboard },
    { to: "/client/upload",     label: "Upload Docs",  icon: Upload          },
    { to: "/client/filings",    label: "Filings",      icon: FileText        },
    { to: "/client/calendar",   label: "Calendar",     icon: Calendar        },
    { to: "/client/chat",       label: "Chat with CA", icon: MessageCircle   },
    { to: "/client/payments",   label: "Payments",     icon: CreditCard      },
    { to: "/client/profile",    label: "Profile & KYC",icon: User            },
  ],
  admin: [
    { to: "/admin/dashboard",   label: "Overview",     icon: LayoutDashboard },
    { to: "/admin/clients",     label: "Clients",      icon: Users           },
    { to: "/admin/filings",     label: "Filings",      icon: FileText        },
    { to: "/admin/documents",   label: "Doc Inbox",    icon: FolderOpen      },
    { to: "/admin/tasks",       label: "Assign Tasks", icon: CheckSquare     },
    { to: "/admin/reminders",   label: "Reminders",    icon: Bell            },
    { to: "/admin/reports",     label: "Reports",      icon: BarChart2       },
  ],
  accountant: [
    { to: "/accountant/dashboard", label: "Dashboard",  icon: LayoutDashboard },
    { to: "/accountant/tasks",     label: "My Tasks",   icon: CheckSquare     },
    { to: "/accountant/documents", label: "Documents",  icon: FolderOpen      },
    { to: "/accountant/chat",      label: "Chat",       icon: MessageCircle   },
  ],
};

const ROLE_STYLE = {
  client:     { dot: "bg-indigo-500", badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/25" },
  admin:      { dot: "bg-violet-500", badge: "bg-violet-500/20 text-violet-300 border-violet-500/25" },
  accountant: { dot: "bg-teal-500",   badge: "bg-teal-500/20   text-teal-300   border-teal-500/25"   },
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const items    = NAV_ITEMS[user?.role] || [];
  const rc       = ROLE_STYLE[user?.role] || ROLE_STYLE.client;
  const initials = user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U";
  const handleLogout = () => { logout(); navigate("/login"); };

  const NavContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full bg-[#0a0a0f]">
      {/* Header */}
      <div className={`flex items-center py-4 border-b border-white/[0.07]
                       ${collapsed && !mobile ? "justify-center px-3" : "justify-between px-4"}`}>
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl
                            flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck size={14} color="white" />
            </div>
            <span className="font-bold text-white text-sm">TaxEase</span>
          </div>
        )}
        {collapsed && !mobile && (
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl
                          flex items-center justify-center">
            <ShieldCheck size={14} color="white" />
          </div>
        )}
        {mobile ? (
          <button onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[var(--bg-surface)]/10 transition">
            <X size={16} />
          </button>
        ) : (
          <button onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[var(--bg-surface)]/10 transition">
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}
            onClick={() => mobile && setMobileOpen(false)}
            title={collapsed && !mobile ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
               ${isActive
                 ? "bg-indigo-600/20 text-white border border-indigo-500/25"
                 : "text-gray-400 hover:text-white hover:bg-[var(--bg-surface)]/[0.06]"}
               ${collapsed && !mobile ? "justify-center" : ""}`}>
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? "text-indigo-400" : ""} />
                {(!collapsed || mobile) && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Theme switcher */}
      {(!collapsed || mobile) && (
        <div className="px-3 py-3 border-t border-white/[0.07]">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-2 px-1">Theme</p>
          <ThemeSwitcher />
        </div>
      )}

      {/* User + Logout */}
      <div className="p-3 border-t border-white/[0.07]">
        <div className={`flex items-center mb-2 ${collapsed && !mobile ? "justify-center" : "gap-2.5"}`}>
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl
                            flex items-center justify-center text-xs font-bold text-white">
              {initials}
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full
                              border-2 border-[#0a0a0f] ${rc.dot}`} />
          </div>
          {(!collapsed || mobile) && (
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate">{user?.name || "User"}</p>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border capitalize ${rc.badge}`}>
                {user?.role}
              </span>
            </div>
          )}
        </div>
        <button onClick={handleLogout}
          title={collapsed && !mobile ? "Logout" : undefined}
          className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm
                      text-gray-400 hover:text-red-400 hover:bg-red-500/[0.08] transition-all
                      ${collapsed && !mobile ? "justify-center" : ""}`}>
          <LogOut size={15} />
          {(!collapsed || mobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className={`hidden md:flex flex-col fixed left-0 top-0 h-screen z-30
                         border-r border-white/[0.06] transition-all duration-300
                         ${collapsed ? "w-[68px]" : "w-60"}`}>
        <NavContent />
      </aside>

      {/* Mobile hamburger */}
      <button onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl
                   bg-[#0a0a0f]/90 backdrop-blur-sm border border-white/[0.08]
                   text-gray-300 hover:text-white transition shadow-lg">
        <Menu size={18} />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div onClick={() => setMobileOpen(false)}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
          <aside className="md:hidden fixed left-0 top-0 h-screen w-64 z-50
                            border-r border-white/[0.08] shadow-2xl">
            <NavContent mobile />
          </aside>
        </>
      )}
    </>
  );
};
export default Sidebar;
