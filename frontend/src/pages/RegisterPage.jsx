// src/pages/RegisterPage.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck } from "lucide-react";

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "client" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    const result = await register(form);
    if (result.success) navigate("/login");
    else setError(result.message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={22} color="white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif">Create Account</h2>
            <p className="text-slate-500 text-sm mt-1">Join 50,000+ businesses on TaxEase</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Full Name",     name: "name",     type: "text",     placeholder: "Rahul Sharma" },
              { label: "Email Address", name: "email",    type: "email",    placeholder: "you@email.com" },
              { label: "Phone Number",  name: "phone",    type: "tel",      placeholder: "9876543210" },
              { label: "Password",      name: "password", type: "password", placeholder: "Min. 6 characters" },
            ].map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{field.label}</label>
                <input {...field} value={form[field.name]} onChange={handleChange} required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none" />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Register As</label>
              <select name="role" value={form.role} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:border-indigo-500 outline-none">
                <option value="client">Client (I need tax services)</option>
                <option value="accountant">Accountant (I provide tax services)</option>
              </select>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60 text-sm mt-2">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
