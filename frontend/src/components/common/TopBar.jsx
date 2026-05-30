// src/components/common/TopBar.jsx — with profile dropdown
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggleIcon } from "./ThemeToggle";
import { Bell, Search, User, Settings, LogOut, ChevronDown } from "lucide-react";

const TopBar = ({ title = "Dashboard" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const profileRoute = {
    client:     "/client/profile",
    admin:      "/admin/profile",
    accountant: "/accountant/profile",
  }[user?.role] || "/";

  const initials = user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  const menuItems = [
    { icon: User,     label: "View Profile",     action: () => { navigate(profileRoute); setDropOpen(false); } },
    { icon: Settings, label: "Account Settings", action: () => { navigate(profileRoute); setDropOpen(false); } },
    { divider: true },
    { icon: LogOut,   label: "Sign out",          action: handleLogout, danger: true },
  ];

  return (
    <header className="h-16 flex items-center justify-between px-5 md:px-7 sticky top-0 z-20 backdrop-blur-sm"
      style={{ background: "var(--bg-nav)", borderBottom: "1px solid var(--border-subtle)" }}>

      {/* Left — title */}
      <div className="pl-10 md:pl-0">
        <h1 className="text-base font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
          {title}
        </h1>
        <p className="text-[11px] hidden sm:block" style={{ color: "var(--text-muted)" }}>
          {greeting}, {user?.name?.split(" ")[0] || "User"} 👋
        </p>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-subtle)"}>
          <Search size={13} />
          <span className="text-xs">Search…</span>
        </div>

        {/* Theme toggle */}
        <ThemeToggleIcon />

        {/* Notification bell */}
        <button className="relative p-2 rounded-xl transition-all"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-subtle)"}>
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500"
            style={{ border: "1.5px solid var(--bg-base)" }} />
        </button>

        {/* Profile avatar + dropdown */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setDropOpen(!dropOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all"
            style={{
              background: dropOpen ? "var(--bg-hover)" : "transparent",
              border: "1px solid transparent",
            }}
            onMouseEnter={e => { if (!dropOpen) e.currentTarget.style.background = "var(--bg-hover)"; }}
            onMouseLeave={e => { if (!dropOpen) e.currentTarget.style.background = "transparent"; }}>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0"
              style={{ border: "2px solid var(--border-default)" }}>
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-600
                                flex items-center justify-center text-xs font-bold text-white">
                  {initials}
                </div>
              )}
            </div>

            {/* Name — desktop only */}
            <div className="hidden md:block text-left min-w-0">
              <p className="text-xs font-semibold truncate max-w-[100px]" style={{ color: "var(--text-primary)" }}>
                {user?.name?.split(" ")[0] || "User"}
              </p>
              <p className="text-[10px] capitalize" style={{ color: "var(--text-muted)" }}>{user?.role}</p>
            </div>

            <ChevronDown size={13} className={`transition-transform duration-200 hidden md:block
                                               ${dropOpen ? "rotate-180" : ""}`}
              style={{ color: "var(--text-muted)" }} />
          </button>

          {/* Dropdown menu */}
          {dropOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl shadow-2xl overflow-hidden z-50"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)" }}>

              {/* Header */}
              <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-600
                                      flex items-center justify-center text-sm font-bold text-white">
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                      {user?.email || ""}
                    </p>
                  </div>
                </div>
                {/* Role badge */}
                <div className="mt-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize
                                   bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {user?.role} · {user?.plan || "Basic"} Plan
                  </span>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1.5">
                {menuItems.map((item, i) => {
                  if (item.divider) return (
                    <div key={i} className="my-1" style={{ borderTop: "1px solid var(--border-subtle)" }} />
                  );
                  return (
                    <button key={i} onClick={item.action}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150"
                      style={{ color: item.danger ? "#f87171" : "var(--text-secondary)", background: "transparent" }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = item.danger ? "rgba(239,68,68,0.08)" : "var(--bg-hover)";
                        e.currentTarget.style.color      = item.danger ? "#f87171" : "var(--text-primary)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color      = item.danger ? "#f87171" : "var(--text-secondary)";
                      }}>
                      <item.icon size={15} style={{ flexShrink: 0 }} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
