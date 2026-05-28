// src/pages/RegisterPage.jsx — fully theme-aware
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    const result = await register(form);
    if (result.success) {
      const routes = { client: "/client/dashboard", admin: "/admin/dashboard", accountant: "/accountant/dashboard" };
      navigate(routes[result.role] || "/");
    } else {
      setError(result.message || "Registration failed");
    }
  };

  const perks = [
    "Free first GST or ITR filing",
    "Dedicated CA assigned within 24 hours",
    "Automated deadline reminders",
    "Secure cloud document storage",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}>
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none"/>
      <div className="absolute bottom-10 left-1/4 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none"/>

      <div className="w-full max-w-4xl relative z-10 grid md:grid-cols-2 gap-10 items-center">
        {/* Left — value prop */}
        <div className="hidden md:block">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl
                            flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <ShieldCheck size={17} color="white"/>
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: "var(--text-primary)" }}>TaxEase</span>
          </Link>
          <h2 className="text-3xl font-bold mb-4 leading-snug" style={{ color: "var(--text-primary)" }}>
            Your compliance journey{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
              starts here
            </span>
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
            Join 50,000+ businesses that trust TaxEase for GST, ITR, TDS and more. Set up in under 2 minutes.
          </p>
          <ul className="space-y-3">
            {perks.map((perk, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-600/15 border border-indigo-500/25
                                flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={13} className="text-indigo-400"/>
                </div>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{perk}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 p-5 rounded-2xl" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
            <p className="text-sm italic leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
              "TaxEase made our GST compliance completely stress-free. Setup took 5 minutes and our CA was assigned the same day."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold text-white">AV</div>
              <div>
                <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Ankit Verma</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Verma Exports Pvt Ltd</p>
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
                <ShieldCheck size={17} color="white"/>
              </div>
              <span className="font-bold text-lg tracking-tight" style={{ color: "var(--text-primary)" }}>TaxEase</span>
            </Link>
          </div>

          <div className="rounded-2xl p-7 shadow-2xl"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)" }}>
            <h1 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Create your account</h1>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Free to start — no credit card required.</p>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-500">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                ["Full Name *", "name", "text", "Rahul Sharma"],
                ["Email Address *", "email", "email", "you@email.com"],
                ["Phone Number", "phone", "tel", "9876543210"],
              ].map(([lbl, nm, tp, ph]) => (
                <div key={nm}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{lbl}</label>
                  <input type={tp} placeholder={ph} value={form[nm]}
                    onChange={e => setForm(p => ({ ...p, [nm]: e.target.value }))}
                    required={nm !== "phone"}
                    className="t-input"/>
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Password *</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} placeholder="Min 6 characters"
                    value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    required minLength={6} className="t-input pr-11"/>
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 transition"
                    style={{ color: "var(--text-muted)" }}>
                    {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Register as *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: "client",     label: "Client",     desc: "I need tax help" },
                    { val: "accountant", label: "Accountant", desc: "I am a CA / Tax Pro" },
                  ].map(r => (
                    <button key={r.val} type="button"
                      onClick={() => setForm(p => ({ ...p, role: r.val }))}
                      className="p-3 rounded-xl text-left transition-all"
                      style={{
                        border: form.role === r.val ? "1px solid rgba(99,102,241,0.5)" : "1px solid var(--border-subtle)",
                        background: form.role === r.val ? "rgba(99,102,241,0.10)" : "var(--bg-surface-2)",
                      }}>
                      <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{r.label}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold
                           bg-gradient-to-br from-indigo-500 to-indigo-600 text-white
                           hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 mt-1">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                    Creating account…
                  </span>
                ) : <>Create Free Account <ArrowRight size={15}/></>}
              </button>
            </form>

            <p className="text-center text-sm mt-5" style={{ color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-500 hover:text-indigo-400 font-medium transition">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
