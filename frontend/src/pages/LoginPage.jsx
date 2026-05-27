// src/pages/LoginPage.jsx — Pixel.io dark redesign
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Eye, EyeOff, ArrowRight, Zap } from "lucide-react";

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(form.email, form.password);
    if (result.success) {
      const routes = { client: "/client/dashboard", admin: "/admin/dashboard", accountant: "/accountant/dashboard" };
      navigate(routes[result.role] || "/");
    } else {
      setError(result.message);
    }
  };

  const DEMOS = [
    { role: "Admin",      email: "admin@taxease.com",  color: "text-violet-400" },
    { role: "CA",         email: "ca@taxease.com",     color: "text-teal-400"   },
    { role: "Client",     email: "client@taxease.com", color: "text-indigo-400" },
  ];

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute -top-40 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl
                            flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <ShieldCheck size={17} color="white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">TaxEase</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-500 text-sm">Sign in to your compliance dashboard</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 shadow-2xl">
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@email.com" required autoComplete="email"
                className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl
                           text-white text-sm placeholder-gray-600 outline-none
                           focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15
                           transition-all duration-200"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 transition">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} name="password"
                  value={form.password} onChange={handleChange}
                  placeholder="••••••••" required autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 bg-white/[0.05] border border-white/[0.08] rounded-xl
                             text-white text-sm placeholder-gray-600 outline-none
                             focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15
                             transition-all duration-200"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition p-0.5">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold
                         bg-gradient-to-br from-indigo-500 to-indigo-600
                         hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
              Create one free
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={13} className="text-indigo-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Demo Accounts</span>
          </div>
          <div className="space-y-2">
            {DEMOS.map(d => (
              <button key={d.role}
                onClick={() => setForm({ email: d.email, password: "demo123" })}
                className="w-full flex items-center justify-between px-3 py-2
                           rounded-lg bg-white/[0.03] hover:bg-white/[0.07]
                           border border-white/[0.05] transition-all group">
                <span className={`text-xs font-semibold ${d.color}`}>{d.role}</span>
                <span className="text-[11px] text-gray-600 group-hover:text-gray-400 transition font-mono">{d.email}</span>
              </button>
            ))}
            <p className="text-center text-[10px] text-gray-600 mt-1.5">All passwords: <span className="font-mono text-gray-500">demo123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
