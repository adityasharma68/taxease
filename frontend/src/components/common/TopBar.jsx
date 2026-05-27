import { Bell, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggleIcon } from "./ThemeToggle";

const TopBar = ({ title = "Dashboard" }) => {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <header className="h-16 flex items-center justify-between px-5 md:px-7 sticky top-0 z-20 backdrop-blur-sm"
      style={{ background: "var(--bg-nav)", borderBottom: "1px solid var(--border-subtle)" }}>
      <div>
        <h1 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>{title}</h1>
        <p className="text-[11px] hidden sm:block" style={{ color: "var(--text-muted)" }}>
          {greeting}, {user?.name?.split(" ")[0] || "User"} 👋
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}>
          <Search size={13} /><span className="text-xs">Search…</span>
        </div>
        <ThemeToggleIcon />
        <button className="relative p-2 rounded-xl transition"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}>
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2"
            style={{ borderColor: "var(--bg-base)" }} />
        </button>
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl
                        flex items-center justify-center text-xs font-bold text-white cursor-pointer
                        shadow-lg shadow-indigo-500/20 select-none">
          {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
};
export default TopBar;
