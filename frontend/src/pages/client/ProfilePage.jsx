// src/pages/client/ProfilePage.jsx
// Client profile & KYC — update name, phone, PAN, GSTIN, business details
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { PageHeader, Card, Spinner } from "../../components/common/UI";
import { User, Building2, ShieldCheck, Phone, Mail, Save, CheckCircle } from "lucide-react";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name:    user?.name    || "",
    phone:   user?.phone   || "",
    pan:     user?.pan     || "",
    gstin:   user?.gstin   || "",
    address: user?.address || "",
    city:    user?.city    || "",
    state:   user?.state   || "",
    pincode: user?.pincode || "",
  });

  const [loading,  setLoading]  = useState(false);
  const [verified, setVerified] = useState({ pan: false, gstin: false });

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  // ── Save profile ─────────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put(`/users/${user._id}`, form);
      updateUser(data.user);          // Update global auth state
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Mock GSTIN verification (replace with real API in production) ─────────
  const verifyGSTIN = async () => {
    if (!form.gstin || form.gstin.length !== 15) {
      toast.error("Please enter a valid 15-digit GSTIN"); return;
    }
    toast.loading("Verifying GSTIN...", { id: "gstin" });
    await new Promise(r => setTimeout(r, 1500));   // simulate API call
    toast.success("GSTIN verified successfully!", { id: "gstin" });
    setVerified(p => ({ ...p, gstin: true }));
  };

  // ── Mock PAN verification ─────────────────────────────────────────────────
  const verifyPAN = async () => {
    if (!form.pan || form.pan.length !== 10) {
      toast.error("Please enter a valid 10-character PAN"); return;
    }
    toast.loading("Verifying PAN...", { id: "pan" });
    await new Promise(r => setTimeout(r, 1200));
    toast.success("PAN verified successfully!", { id: "pan" });
    setVerified(p => ({ ...p, pan: true }));
  };

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="Profile & KYC"
        subtitle="Keep your business details and tax identifiers up to date"
      />

      {/* ── Account Summary Card ───────────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
            {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-indigo-200 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{user?.plan} Plan</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* ── Personal Information ───────────────────────────────────── */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
              <User size={16} className="text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-900">Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                placeholder="Rahul Sharma" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number *</label>
              <input name="phone" value={form.phone} onChange={handleChange} required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                placeholder="9876543210" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <div className="flex items-center gap-2 px-4 py-2.5 border border-slate-100 bg-slate-50 rounded-xl text-sm text-slate-500">
                <Mail size={14} />
                {user?.email}
                <span className="ml-auto text-xs text-slate-400">(cannot change)</span>
              </div>
            </div>
          </div>
        </Card>

        {/* ── Tax Identifiers (KYC) ──────────────────────────────────── */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <ShieldCheck size={16} className="text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900">Tax Identifiers (KYC)</h3>
          </div>

          {/* PAN */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">PAN Number</label>
            <div className="flex gap-2">
              <input name="pan" value={form.pan} onChange={handleChange}
                maxLength={10}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-mono uppercase focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                placeholder="ABCDE1234F" />
              <button type="button" onClick={verifyPAN}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all flex-shrink-0
                  ${verified.pan ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
                {verified.pan ? <><CheckCircle size={14} /> Verified</> : "Verify"}
              </button>
            </div>
          </div>

          {/* GSTIN */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">GSTIN</label>
            <div className="flex gap-2">
              <input name="gstin" value={form.gstin} onChange={handleChange}
                maxLength={15}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-mono uppercase focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                placeholder="27ABCDE1234F1Z5" />
              <button type="button" onClick={verifyGSTIN}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all flex-shrink-0
                  ${verified.gstin ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
                {verified.gstin ? <><CheckCircle size={14} /> Verified</> : "Verify"}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">15-digit GST Identification Number</p>
          </div>
        </Card>

        {/* ── Business Address ───────────────────────────────────────── */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <Building2 size={16} className="text-amber-600" />
            </div>
            <h3 className="font-bold text-slate-900">Business Address</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Street Address</label>
              <input name="address" value={form.address} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                placeholder="123, MG Road, Sector 5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
              <input name="city" value={form.city} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                placeholder="Mumbai" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
              <select name="state" value={form.state} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:border-indigo-500 outline-none">
                <option value="">Select state</option>
                {["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">PIN Code</label>
              <input name="pincode" value={form.pincode} onChange={handleChange}
                maxLength={6}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                placeholder="400001" />
            </div>
          </div>
        </Card>

        {/* ── Save Button ────────────────────────────────────────────── */}
        <button type="submit" disabled={loading}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors disabled:opacity-60 text-sm flex items-center justify-center gap-2">
          {loading ? <><Spinner size={16} className="border-t-white" /> Saving...</> : <><Save size={16} /> Save Profile</>}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
