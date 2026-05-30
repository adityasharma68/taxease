// src/components/common/ThemeToggle.jsx
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

// ── Small icon toggle — NavBar, TopBar ────────────────────────────────────────
export const ThemeToggleIcon = () => {
  const { resolved, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      title={resolved === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="p-2 rounded-xl transition-all duration-200 flex-shrink-0"
      style={{
        background:   "var(--bg-surface)",
        border:       "1px solid var(--border-subtle)",
        color:        "var(--text-muted)",
      }}>
      {resolved === "dark"
        ? <Sun  size={16} className="text-amber-400" />
        : <Moon size={16} className="text-indigo-500" />}
    </button>
  );
};

// ── Full 3-way pill — Sidebar ─────────────────────────────────────────────────
export const ThemeSwitcher = ({ className = "" }) => {
  const { mode, setTheme } = useTheme();
  const options = [
    { value: "system", icon: Monitor, label: "System" },
    { value: "light",  icon: Sun,     label: "Light"  },
    { value: "dark",   icon: Moon,    label: "Dark"   },
  ];
  return (
    <div className={`inline-flex items-center gap-1 p-1 rounded-xl w-full ${className}`}
      style={{ background: "var(--bg-surface-2)", border: "1px solid var(--sidebar-border)" }}>
      {options.map(({ value, icon: Icon, label }) => {
        const active = mode === value;
        return (
          <button key={value} onClick={() => setTheme(value)}
            aria-label={`${label} theme`}
            className={`flex items-center justify-center gap-1.5 flex-1 py-1.5 rounded-lg
                        text-xs font-medium transition-all duration-200`}
            style={active
              ? { background: "#6366f1", color: "#ffffff", boxShadow: "0 2px 8px rgba(99,102,241,0.35)" }
              : { color: "var(--sidebar-text)" }}>
            <Icon size={12} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ── Inline toggle with label — for Homepage navbar ────────────────────────────
export const ThemeToggleButton = () => {
  const { resolved, mode, setTheme } = useTheme();
  const cycle = () => {
    const order = ["light", "dark", "system"];
    const next = order[(order.indexOf(mode) + 1) % 3];
    setTheme(next);
  };
  return (
    <button onClick={cycle} aria-label="Toggle theme"
      className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 text-sm font-medium"
      style={{
        background: "var(--bg-surface)",
        border:     "1px solid var(--border-subtle)",
        color:      "var(--text-secondary)",
      }}>
      {resolved === "dark"
        ? <Sun  size={15} className="text-amber-400" />
        : <Moon size={15} className="text-indigo-500" />}
      <span className="hidden sm:inline" style={{ color: "var(--text-secondary)" }}>
        {mode === "system" ? "Auto" : mode === "dark" ? "Dark" : "Light"}
      </span>
    </button>
  );
};

export default ThemeSwitcher;
