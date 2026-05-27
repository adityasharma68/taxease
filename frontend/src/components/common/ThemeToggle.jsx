// src/components/common/ThemeToggle.jsx
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

// ── Small icon toggle — used in TopBar and HomePage navbar ───────────────────
export const ThemeToggleIcon = () => {
  const { resolved, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="p-2 rounded-xl transition-all duration-200"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        color: "var(--text-muted)",
      }}
    >
      {resolved === "dark"
        ? <Sun size={15} className="text-amber-400" />
        : <Moon size={15} className="text-indigo-500" />}
    </button>
  );
};

// ── Full 3-way pill — used in Sidebar ────────────────────────────────────────
export const ThemeSwitcher = ({ className = "" }) => {
  const { mode, setTheme } = useTheme();
  const options = [
    { value: "system", icon: Monitor, label: "System" },
    { value: "light",  icon: Sun,     label: "Light"  },
    { value: "dark",   icon: Moon,    label: "Dark"   },
  ];
  return (
    <div
      className={`inline-flex items-center gap-1 p-1 rounded-xl w-full ${className}`}
      style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}
    >
      {options.map(({ value, icon: Icon, label }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            aria-label={`${label} theme`}
            className={`flex items-center justify-center gap-1.5 flex-1 py-1.5 rounded-lg
                        text-xs font-medium transition-all duration-200
                        ${active ? "bg-indigo-600 text-white shadow-md" : ""}`}
            style={!active ? { color: "var(--text-muted)" } : {}}
          >
            <Icon size={12} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;
