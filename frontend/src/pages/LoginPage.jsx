// src/pages/LoginPage.jsx
// Login form — sends credentials to /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(form.email, form.password);
    if (result.success) {
      // Redirect to the correct dashboard based on role
      const routes = { client: "/client/dashboard", admin: "/admin/dashboard", accountant: "/accountant/dashboard" };
      navigate(routes[result.role] || "/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={22} color="white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif">Welcome Back</h2>
            <p className="text-slate-500 text-sm mt-1">Sign in to your TaxEase account</p>
          </div>

          {/* Demo credentials hint */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 mb-6 text-xs text-indigo-700 space-y-0.5">
            <p><strong>Client:</strong> client@demo.com / demo123</p>
            <p><strong>Admin:</strong> admin@demo.com / demo123</p>
            <p><strong>Accountant:</strong> accountant@demo.com / demo123</p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required
                placeholder="you@email.com"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input name="password" type={showPass ? "text" : "password"} value={form.password} onChange={handleChange} required
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60 text-sm mt-2">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
