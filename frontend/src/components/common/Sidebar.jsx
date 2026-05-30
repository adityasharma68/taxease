// src/components/common/Sidebar.jsx — full dark/light theme support
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ThemeSwitcher } from "./ThemeToggle";
import {
  ShieldCheck, LayoutDashboard, Upload, FileText, Calendar,
  MessageCircle, CreditCard, User, Users, FolderOpen,
  Bell, BarChart2, CheckSquare, LogOut, ChevronLeft,
  ChevronRight, Menu, X, Settings,
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
    { to: "/admin/profile",     label: "My Profile",   icon: Settings        },
  ],
  accountant: [
    { to: "/accountant/dashboard", label: "Dashboard",  icon: LayoutDashboard },
    { to: "/accountant/tasks",     label: "My Tasks",   icon: CheckSquare     },
    { to: "/accountant/documents", label: "Documents",  icon: FolderOpen      },
    { to: "/accountant/chat",      label: "Chat",       icon: MessageCircle   },
    { to: "/accountant/profile",   label: "My Profile", icon: Settings        },
  ],
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const items    = NAV_ITEMS[user?.role] || [];
  const initials = user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U";
  const profileRoute = {
    client:     "/client/profile",
    admin:      "/admin/profile",
    accountant: "/accountant/profile",
  }[user?.role] || "/";

  const handleLogout = () => { logout(); navigate("/login"); };

  /* ── Role accent colors ──────────────────────────────────────────────────── */
  const roleAccent = {
    client:     { dot: "bg-indigo-500", badge: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25" },
    admin:      { dot: "bg-violet-500", badge: "bg-violet-500/15 text-violet-400 border-violet-500/25" },
    accountant: { dot: "bg-teal-500",   badge: "bg-teal-500/15   text-teal-400   border-teal-500/25"   },
  }[user?.role] || { dot: "bg-indigo-500", badge: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25" };

  /* ── Shared nav content ──────────────────────────────────────────────────── */
  const NavContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full"
      style={{ background: "var(--bg-sidebar)", color: "var(--sidebar-text)" }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className={`flex items-center py-4
                       ${collapsed && !mobile ? "justify-center px-3" : "justify-between px-4"}`}
        style={{ borderBottom: "1px solid var(--sidebar-border)" }}>

        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl
                            flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
              <ShieldCheck size={14} color="white" />
            </div>
            <span className="font-bold text-sm tracking-tight truncate"
              style={{ color: "var(--sidebar-text-primary)" }}>TaxEase</span>
          </div>
        )}

        {collapsed && !mobile && (
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl
                          flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck size={14} color="white" />
          </div>
        )}

        {mobile ? (
          <button onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg transition-colors ml-auto"
            style={{ color: "var(--sidebar-icon)", background: "transparent" }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--sidebar-hover)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <X size={16} />
          </button>
        ) : (
          <button onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--sidebar-icon)", background: "transparent" }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--sidebar-hover)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        )}
      </div>

      {/* ── Navigation links ───────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}
            onClick={() => mobile && setMobileOpen(false)}
            title={collapsed && !mobile ? label : undefined}>
            {({ isActive }) => (
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                               transition-all duration-200 cursor-pointer
                               ${collapsed && !mobile ? "justify-center" : ""}`}
                style={{
                  background:  isActive ? "var(--sidebar-active-bg)"   : "transparent",
                  color:       isActive ? "var(--sidebar-active-text)"  : "var(--sidebar-text)",
                  border:      isActive ? "1px solid var(--sidebar-active-border)" : "1px solid transparent",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--sidebar-hover)"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                <Icon size={17}
                  style={{ color: isActive ? "var(--sidebar-active-icon)" : "var(--sidebar-icon)", flexShrink: 0 }} />
                {(!collapsed || mobile) && <span className="truncate">{label}</span>}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Theme switcher ─────────────────────────────────────────────────── */}
      {(!collapsed || mobile) && (
        <div className="px-3 py-3" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-2 px-1"
            style={{ color: "var(--sidebar-icon)" }}>Theme</p>
          <ThemeSwitcher />
        </div>
      )}

      {/* ── User info + logout ─────────────────────────────────────────────── */}
      <div className="p-3" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
        {/* Avatar + name */}
        <button
          onClick={() => { navigate(profileRoute); mobile && setMobileOpen(false); }}
          className={`flex items-center w-full rounded-xl p-2 mb-2 transition-all duration-200
                      ${collapsed && !mobile ? "justify-center" : "gap-2.5"}`}
          style={{ background: "transparent" }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--sidebar-hover)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          title={collapsed && !mobile ? `${user?.name} — View Profile` : undefined}>
          <div className="relative flex-shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar"
                className="w-9 h-9 rounded-xl object-cover"
                style={{ border: "2px solid var(--sidebar-border)" }} />
            ) : (
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl
                              flex items-center justify-center text-xs font-bold text-white">
                {initials}
              </div>
            )}
            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full
                              border-2 ${roleAccent.dot}`}
              style={{ borderColor: "var(--bg-sidebar)" }} />
          </div>

          {(!collapsed || mobile) && (
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-semibold truncate"
                style={{ color: "var(--sidebar-text-primary)" }}>{user?.name || "User"}</p>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border capitalize ${roleAccent.badge}`}>
                {user?.role}
              </span>
            </div>
          )}
        </button>

        {/* Logout */}
        <button onClick={handleLogout}
          title={collapsed && !mobile ? "Sign out" : undefined}
          className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm
                      transition-all duration-200
                      ${collapsed && !mobile ? "justify-center" : ""}`}
          style={{ color: "var(--sidebar-text)", background: "transparent" }}
          onMouseEnter={e => {
            e.currentTarget.style.color      = "#f87171";
            e.currentTarget.style.background = "rgba(239,68,68,0.08)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color      = "var(--sidebar-text)";
            e.currentTarget.style.background = "transparent";
          }}>
          <LogOut size={15} style={{ flexShrink: 0 }} />
          {(!collapsed || mobile) && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className={`hidden md:flex flex-col fixed left-0 top-0 h-screen z-30
                         transition-all duration-300 ease-in-out
                         ${collapsed ? "w-[68px]" : "w-60"}`}
        style={{ borderRight: "1px solid var(--sidebar-border)" }}>
        <NavContent />
      </aside>

      {/* Mobile hamburger */}
      <button onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl
                   backdrop-blur-sm shadow-lg transition"
        style={{
          background: "var(--bg-sidebar)",
          border: "1px solid var(--sidebar-border)",
          color: "var(--sidebar-text)",
        }}>
        <Menu size={18} />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div onClick={() => setMobileOpen(false)}
            className="md:hidden fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }} />
          <aside className="md:hidden fixed left-0 top-0 h-screen w-64 z-50 shadow-2xl"
            style={{ borderRight: "1px solid var(--sidebar-border)" }}>
            <NavContent mobile />
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;
