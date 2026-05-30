// src/pages/LoginPage.jsx — shows session expiry reason
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Eye, EyeOff, ArrowRight, Zap, Clock, AlertTriangle } from "lucide-react";

const REASON_MESSAGES = {
  token_expired:       { icon: Clock,         color: "amber",  text: "Your session has expired. Please sign in again." },
  idle_timeout:        { icon: Clock,         color: "amber",  text: "You were signed out after 30 minutes of inactivity." },
  logged_out_elsewhere:{ icon: AlertTriangle, color: "red",    text: "You were signed out from another tab." },
  manual:              { icon: null,          color: "slate",  text: null },
};

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]         = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [sessionMsg, setSessionMsg] = useState(null);

  useEffect(() => {
    const reason = sessionStorage.getItem("logout_reason");
    if (reason && REASON_MESSAGES[reason]) {
      const m = REASON_MESSAGES[reason];
      if (m.text) setSessionMsg(m);
      sessionStorage.removeItem("logout_reason");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(form.email, form.password);
    if (result.success) {
      const routes = { client: "/client/dashboard", admin: "/admin/dashboard", accountant: "/accountant/dashboard" };
      navigate(routes[result.role] || "/");
    } else {
      setError(result.message || "Invalid email or password");
    }
  };

  const DEMOS = [
    { role: "Admin",      email: "adminuser@gmail.com",  color: "text-violet-500" },
    { role: "CA",         email: "ca@taxease.com",     color: "text-teal-500"   },
    { role: "Client",     email: "client@taxease.com", color: "text-indigo-500" },
  ];

  const colorMap = {
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    red:   "bg-red-500/10   border-red-500/20   text-red-400",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}>
      <div className="absolute -top-40 left-1/3 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none"/>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-600/5 rounded-full blur-3xl pointer-events-none"/>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl
                            flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <ShieldCheck size={17} color="white"/>
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: "var(--text-primary)" }}>TaxEase</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Welcome back</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Sign in to your compliance dashboard</p>
        </div>

        {/* Session expiry notice */}
        {sessionMsg && (
          <div className={`mb-5 px-4 py-3 rounded-xl text-sm border flex items-center gap-3
                           ${colorMap[sessionMsg.color] || colorMap.amber}`}>
            <Clock size={16} className="flex-shrink-0" />
            {sessionMsg.text}
          </div>
        )}

        {/* Card */}
        <div className="rounded-2xl p-8 shadow-2xl"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)" }}>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Email address</label>
              <input type="email" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@email.com" required autoComplete="email"
                className="t-input"/>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Password</label>
                <button type="button" className="text-xs text-indigo-500 hover:text-indigo-400 transition">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••" required autoComplete="current-password"
                  className="t-input pr-11"/>
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 transition"
                  style={{ color: "var(--text-muted)" }}>
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold
                         bg-gradient-to-br from-indigo-500 to-indigo-600 text-white
                         hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  Signing in…
                </span>
              ) : <>Sign In <ArrowRight size={15}/></>}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-500 hover:text-indigo-400 font-medium transition">
              Create one free
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-5 rounded-xl p-4"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={13} className="text-indigo-400"/>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Demo Accounts
            </span>
          </div>
          <div className="space-y-2">
            {DEMOS.map(d => (
              <button key={d.role} onClick={() => setForm({ email: d.email, password: "demo123" })}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition"
                style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
                <span className={`text-xs font-semibold ${d.color}`}>{d.role}</span>
                <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{d.email}</span>
              </button>
            ))}
            <p className="text-center text-[10px] mt-1.5" style={{ color: "var(--text-muted)" }}>
              Password: <span className="font-mono" style={{ color: "var(--text-secondary)" }}>demo123</span>
            </p>
          </div>
        </div>

        {/* Session info */}
        <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>
          🔒 Sessions expire after 30 min of inactivity or 30 days
        </p>
      </div>
    </div>
  );
};
export default LoginPage;
