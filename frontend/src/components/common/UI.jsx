// src/components/common/UI.jsx — theme-aware, all exports preserved
import { AlertCircle, X } from "lucide-react";

// ── Spinner ───────────────────────────────────────────────────────────────────
export const Spinner = ({ size = "md", className = "" }) => {
  const sz = { sm: "w-4 h-4", md: "w-7 h-7", lg: "w-10 h-10" }[size] || "w-7 h-7";
  return (
    <div
      className={`${sz} border-2 rounded-full animate-spin ${className}`}
      style={{ borderColor: "var(--border-default)", borderTopColor: "#6366f1" }}
    />
  );
};

// ── Loading Screen ────────────────────────────────────────────────────────────
export const LoadingScreen = ({ message = "Loading…" }) => (
  <div className="flex items-center justify-center min-h-[300px] flex-col gap-3">
    <Spinner size="lg" />
    <p className="text-sm" style={{ color: "var(--text-muted)" }}>{message}</p>
  </div>
);

// ── Page Header ───────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-6 gap-4">
    <div>
      <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{title}</h2>
      {subtitle && (
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{subtitle}</p>
      )}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

// ── Card Header — separate named export ──────────────────────────────────────
export const CardHeader = ({ title, subtitle, action, children }) => (
  <div
    className="flex items-center justify-between px-5 py-4"
    style={{ borderBottom: "1px solid var(--border-subtle)" }}
  >
    <div>
      {title && (
        <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{subtitle}</p>
      )}
    </div>
    {(action || children) && (
      <div className="flex items-center gap-2">{action}{children}</div>
    )}
  </div>
);

// ── Card ──────────────────────────────────────────────────────────────────────
export const Card = ({ children, className = "", title, subtitle, action }) => (
  <div
    className={`rounded-2xl overflow-hidden transition-all duration-200 ${className}`}
    style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border-subtle)",
      boxShadow: "var(--shadow-card)",
    }}
  >
    {(title || action) && (
      <CardHeader title={title} subtitle={subtitle} action={action} />
    )}
    <div className="p-5">{children}</div>
  </div>
);

// ── Stat Card ─────────────────────────────────────────────────────────────────
export const StatCard = ({ icon: Icon, label, value, sub, color = "indigo", trend }) => {
  const colors = {
    indigo:  "bg-indigo-600/10  border-indigo-500/20  text-indigo-500",
    teal:    "bg-teal-600/10    border-teal-500/20    text-teal-500",
    emerald: "bg-emerald-600/10 border-emerald-500/20 text-emerald-500",
    green:   "bg-emerald-600/10 border-emerald-500/20 text-emerald-500",
    amber:   "bg-amber-600/10   border-amber-500/20   text-amber-500",
    red:     "bg-red-600/10     border-red-500/20     text-red-500",
    violet:  "bg-violet-600/10  border-violet-500/20  text-violet-500",
    blue:    "bg-blue-600/10    border-blue-500/20    text-blue-500",
  };
  return (
    <div
      className="rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {Icon && (
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${colors[color] || colors.indigo}`}>
          <Icon size={17} />
        </div>
      )}
      <div className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>{value}</div>
      <div className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{label}</div>
      {sub && <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{sub}</div>}
      {trend !== undefined && (
        <div className={`text-xs font-semibold mt-2 ${Number(trend) >= 0 ? "text-emerald-500" : "text-red-500"}`}>
          {Number(trend) >= 0 ? "↑" : "↓"} {Math.abs(trend)}% vs last month
        </div>
      )}
    </div>
  );
};

// ── Status Badge ──────────────────────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const styles = {
    "Filed":       "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "In Process":  "bg-blue-500/10    text-blue-600    dark:text-blue-400    border-blue-500/20",
    "Pending":     "bg-amber-500/10   text-amber-600   dark:text-amber-400   border-amber-500/20",
    "Rejected":    "bg-red-500/10     text-red-600     dark:text-red-400     border-red-500/20",
    "Verified":    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "Paid":        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "Unpaid":      "bg-amber-500/10   text-amber-600   dark:text-amber-400   border-amber-500/20",
    "Completed":   "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "In Progress": "bg-blue-500/10    text-blue-600    dark:text-blue-400    border-blue-500/20",
    "High":        "bg-red-500/10     text-red-600     dark:text-red-400     border-red-500/20",
    "Medium":      "bg-amber-500/10   text-amber-600   dark:text-amber-400   border-amber-500/20",
    "Low":         "bg-[var(--text-muted)]/10   text-[var(--text-muted)]                         border-slate-500/20",
    "Active":      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "Inactive":    "bg-red-500/10     text-red-600     dark:text-red-400     border-red-500/20",
    "Basic":       "bg-[var(--text-muted)]/10   text-[var(--text-muted)]                         border-slate-500/20",
    "Pro":         "bg-indigo-500/10  text-indigo-600  dark:text-indigo-400  border-indigo-500/20",
    "Enterprise":  "bg-violet-500/10  text-violet-600  dark:text-violet-400  border-violet-500/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border
                  ${styles[status] || "bg-gray-500/10 text-[var(--text-muted)] border-gray-500/20"}`}
    >
      {status}
    </span>
  );
};

// ── Badge (generic — any label + color key) ───────────────────────────────────
export const Badge = ({ label, color = "default" }) => {
  const colors = {
    default: "bg-[var(--text-muted)]/10  text-[var(--text-muted)]  border-slate-500/20",
    indigo:  "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    amber:   "bg-amber-500/10  text-amber-500  border-amber-500/20",
    red:     "bg-red-500/10    text-red-500    border-red-500/20",
    blue:    "bg-blue-500/10   text-blue-500   border-blue-500/20",
    violet:  "bg-violet-500/10 text-violet-500 border-violet-500/20",
    teal:    "bg-teal-500/10   text-teal-500   border-teal-500/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border
                  ${colors[color] || colors.default}`}
    >
      {label}
    </span>
  );
};

// ── Button ────────────────────────────────────────────────────────────────────
export const Button = ({ children, variant = "primary", className = "", size = "md", ...props }) => {
  const base = {
    primary:   "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-indigo-500/20",
    secondary: "font-semibold transition hover:opacity-80",
    danger:    "bg-gradient-to-br from-red-500 to-red-600 text-white hover:opacity-90",
    success:   "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:opacity-90",
    ghost:     "hover:opacity-80 transition",
    outline:   "border transition hover:opacity-80",
  };
  const sizes = {
    xs: "px-2.5 py-1   text-xs",
    sm: "px-3    py-1.5 text-xs",
    md: "px-4    py-2.5 text-sm",
    lg: "px-6    py-3   text-base",
  };
  const inlineStyles = {
    secondary: {
      background: "var(--bg-surface-2)",
      color: "var(--text-secondary)",
      border: "1px solid var(--border-default)",
    },
    ghost:   { color: "var(--text-secondary)" },
    outline: { borderColor: "var(--border-default)", color: "var(--text-primary)" },
  };
  return (
    <button
      style={inlineStyles[variant] || {}}
      className={`inline-flex items-center gap-2 rounded-xl font-semibold transition-all
                  active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                  ${base[variant] || base.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// ── Input ─────────────────────────────────────────────────────────────────────
export const Input = ({ label, error, className = "", ...props }) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
    )}
    <input
      className={`t-input ${error ? "!border-red-500/60" : ""} ${className}`}
      {...props}
    />
    {error && (
      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

// ── Textarea ──────────────────────────────────────────────────────────────────
export const Textarea = ({ label, error, rows = 3, className = "", ...props }) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
    )}
    <textarea
      rows={rows}
      className={`t-input resize-none ${error ? "!border-red-500/60" : ""} ${className}`}
      {...props}
    />
    {error && (
      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

// ── Select ────────────────────────────────────────────────────────────────────
export const Select = ({ label, options = [], error, className = "", ...props }) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
    )}
    <select
      className={`t-input ${error ? "!border-red-500/60" : ""} ${className}`}
      {...props}
    >
      {options.map(o =>
        typeof o === "string"
          ? <option key={o} value={o} style={{ background: "var(--bg-sidebar)" }}>{o}</option>
          : <option key={o.value} value={o.value} style={{ background: "var(--bg-sidebar)" }}>{o.label}</option>
      )}
    </select>
    {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
  </div>
);

// ── Alert ─────────────────────────────────────────────────────────────────────
export const Alert = ({ type = "info", message, className = "" }) => {
  const styles = {
    info:    "bg-blue-500/10    border-blue-500/20    text-blue-600 dark:text-blue-400",
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-500/10   border-amber-500/20   text-amber-600 dark:text-amber-400",
    error:   "bg-red-500/10     border-red-500/20     text-red-600 dark:text-red-400",
  };
  return (
    <div className={`px-4 py-3 rounded-xl text-sm border ${styles[type] || styles.info} ${className}`}>
      {message}
    </div>
  );
};

// ── Empty State ───────────────────────────────────────────────────────────────
export const EmptyState = ({ icon: Icon, title, subtitle, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {Icon && (
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}
      >
        <Icon size={22} style={{ color: "var(--text-muted)" }} />
      </div>
    )}
    <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{title}</h3>
    {subtitle && (
      <p className="text-sm max-w-xs" style={{ color: "var(--text-muted)" }}>{subtitle}</p>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

// ── Table helpers ─────────────────────────────────────────────────────────────
export const Table = ({ children, className = "" }) => (
  <div
    className={`w-full overflow-x-auto rounded-xl ${className}`}
    style={{ border: "1px solid var(--border-subtle)" }}
  >
    <table className="w-full text-sm border-collapse">{children}</table>
  </div>
);

export const Th = ({ children, className = "" }) => (
  <th
    className={`px-4 py-3 text-left text-xs font-semibold tracking-wide whitespace-nowrap ${className}`}
    style={{
      background: "var(--bg-surface-2)",
      color: "var(--text-muted)",
      borderBottom: "1px solid var(--border-subtle)",
    }}
  >
    {children}
  </th>
);

export const Td = ({ children, className = "" }) => (
  <td
    className={`px-4 py-3 ${className}`}
    style={{ color: "var(--text-primary)", borderBottom: "1px solid var(--border-subtle)" }}
  >
    {children}
  </td>
);

export const Tr = ({ children, className = "", onClick }) => (
  <tr
    onClick={onClick}
    className={`transition-colors duration-150 ${onClick ? "cursor-pointer hover:bg-[var(--bg-surface)]/[0.03]" : ""} ${className}`}
  >
    {children}
  </tr>
);

// ── Modal ─────────────────────────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, children, maxWidth = "max-w-md" }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
    >
      <div
        className={`w-full ${maxWidth} rounded-2xl shadow-2xl overflow-hidden`}
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)" }}
      >
        {title && (
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors hover:bg-[var(--bg-surface)]/[0.08]"
              style={{ color: "var(--text-muted)" }}
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};
