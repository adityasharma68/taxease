// src/pages/RegisterPage.jsx — Pixel.io dark redesign
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]         = useState({ name: "", email: "", phone: "", password: "", role: "client" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    const result = await register(form);
    if (result.success) {
      const routes = { client: "/client/dashboard", admin: "/admin/dashboard", accountant: "/accountant/dashboard" };
      navigate(routes[result.role] || "/");
    } else {
      setError(result.message);
    }
  };

  const perks = [
    "Free first GST or ITR filing",
    "Dedicated CA assigned within 24 hours",
    "Automated deadline reminders",
    "Secure cloud document storage",
  ];

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Glows */}
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-64 h-64 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 grid md:grid-cols-2 gap-10 items-center">

        {/* Left — value prop */}
        <div className="hidden md:block">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl
                            flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <ShieldCheck size={17} color="white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">TaxEase</span>
          </Link>

          <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
            Your compliance journey{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-violet-400">
              starts here
            </span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Join 50,000+ businesses that trust TaxEase for GST, ITR, TDS and more.
            Set up your account in under 2 minutes.
          </p>

          <ul className="space-y-3">
            {perks.map((perk, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/30
                                flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={13} className="text-indigo-400" />
                </div>
                <span className="text-gray-300 text-sm">{perk}</span>
              </li>
            ))}
          </ul>

          {/* Mini testimonial */}
          <div className="mt-10 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
            <p className="text-gray-400 text-sm italic leading-relaxed mb-4">
              "TaxEase made our GST compliance completely stress-free. Setup took 5 minutes
              and our CA was assigned the same day."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold text-white">AV</div>
              <div>
                <p className="text-white text-xs font-semibold">Ankit Verma</p>
                <p className="text-gray-600 text-xs">Verma Exports Pvt Ltd</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div>
          <div className="md:hidden text-center mb-7">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl
                              flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <ShieldCheck size={17} color="white" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">TaxEase</span>
            </Link>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-7 shadow-2xl">
            <h1 className="text-xl font-bold text-white mb-1">Create your account</h1>
            <p className="text-gray-500 text-sm mb-6">Free to start — no credit card required.</p>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Rahul Sharma" required
                  className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl
                             text-white text-sm placeholder-gray-600 outline-none
                             focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 transition-all" />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@email.com" required
                  className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl
                             text-white text-sm placeholder-gray-600 outline-none
                             focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 transition-all" />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl
                             text-white text-sm placeholder-gray-600 outline-none
                             focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 transition-all" />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Password *</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} name="password"
                    value={form.password} onChange={handleChange}
                    placeholder="Min 6 characters" required minLength={6}
                    className="w-full px-4 py-2.5 pr-11 bg-white/[0.05] border border-white/[0.08] rounded-xl
                               text-white text-sm placeholder-gray-600 outline-none
                               focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 transition-all" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition p-0.5">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Register as *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: "client",     label: "Client",      desc: "I need tax help" },
                    { val: "accountant", label: "Accountant",  desc: "I am a CA / Tax Pro" },
                  ].map(r => (
                    <button key={r.val} type="button"
                      onClick={() => setForm(p => ({ ...p, role: r.val }))}
                      className={`p-3 rounded-xl border text-left transition-all
                        ${form.role === r.val
                          ? "border-indigo-500/50 bg-indigo-600/10"
                          : "border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06]"}`}>
                      <div className="text-xs font-semibold text-white">{r.label}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold
                           bg-gradient-to-br from-indigo-500 to-indigo-600
                           hover:opacity-90 active:scale-[0.98] transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed mt-1">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </span>
                ) : (
                  <>Create Free Account <ArrowRight size={15} /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
