// src/components/common/UI.jsx
// Reusable UI building blocks used across all pages
// ─────────────────────────────────────────────────────────────────────────────

// ─── Button ──────────────────────────────────────────────────────────────────
export const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const styles = {
    primary:   "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    danger:    "bg-red-600 text-white hover:bg-red-700",
    ghost:     "text-indigo-600 hover:bg-indigo-50",
    outline:   "border border-indigo-600 text-indigo-600 hover:bg-indigo-50",
  };
  return (
    <button
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// ─── Input ───────────────────────────────────────────────────────────────────
export const Input = ({ label, error, className = "", ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
    <input
      className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all
        ${error ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}
        ${className}`}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

// ─── Select ──────────────────────────────────────────────────────────────────
export const Select = ({ label, options, className = "", ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
    <select
      className={`w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:border-indigo-500 outline-none ${className}`}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value ?? opt} value={opt.value ?? opt}>
          {opt.label ?? opt}
        </option>
      ))}
    </select>
  </div>
);

// ─── StatusBadge ─────────────────────────────────────────────────────────────
// Maps status strings to colour classes
export const StatusBadge = ({ status }) => {
  const colours = {
    Filed:        "bg-green-100 text-green-800",
    "In Process": "bg-blue-100 text-blue-800",
    "In Progress":"bg-blue-100 text-blue-800",
    Pending:      "bg-amber-100 text-amber-800",
    Verified:     "bg-green-100 text-green-800",
    Rejected:     "bg-red-100 text-red-800",
    Active:       "bg-green-100 text-green-800",
    Inactive:     "bg-red-100 text-red-800",
    Completed:    "bg-green-100 text-green-800",
    Cancelled:    "bg-red-100 text-red-800",
    High:         "bg-red-100 text-red-800",
    Medium:       "bg-amber-100 text-amber-800",
    Low:          "bg-slate-100 text-slate-700",
    Paid:         "bg-green-100 text-green-800",
    Basic:        "bg-slate-100 text-slate-700",
    Pro:          "bg-indigo-100 text-indigo-800",
    Enterprise:   "bg-purple-100 text-purple-800",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colours[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}>
    {children}
  </div>
);

// ─── CardHeader ──────────────────────────────────────────────────────────────
export const CardHeader = ({ title, action, className = "" }) => (
  <div className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between ${className}`}>
    <h3 className="font-bold text-slate-900">{title}</h3>
    {action && <div>{action}</div>}
  </div>
);

// ─── StatCard ─────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, sub, icon: Icon, color = "indigo", trend }) => {
  const bg = {
    indigo:  "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber:   "bg-amber-50 text-amber-600",
    red:     "bg-red-50 text-red-600",
    blue:    "bg-blue-50 text-blue-600",
  };
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${bg[color]} rounded-xl flex items-center justify-center`}>
          <Icon size={18} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {trend >= 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-sm font-medium text-slate-700 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
  );
};

// ─── Spinner ─────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 24, className = "" }) => (
  <div
    className={`border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin ${className}`}
    style={{ width: size, height: size }}
  />
);

// ─── PageHeader ──────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h1 className="text-xl font-bold text-slate-900">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

// ─── EmptyState ──────────────────────────────────────────────────────────────
export const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
      <Icon size={24} className="text-slate-400" />
    </div>
    <h3 className="font-semibold text-slate-700 mb-1">{title}</h3>
    {subtitle && <p className="text-sm text-slate-400 max-w-xs">{subtitle}</p>}
  </div>
);
