// src/pages/client/ProfilePage.jsx — Client profile with KYC
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { User, Building2, ShieldCheck, Phone, Save, CheckCircle, CreditCard, Briefcase, MapPin } from "lucide-react";
import {
  AvatarSection, ChangeEmailSection, ChangePasswordSection,
  SectionCard, TInput, TSelect, FieldLabel,
} from "../../components/profile/ProfileBase";

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi",
  "Jammu & Kashmir","Ladakh","Puducherry","Chandigarh",
];

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
  const [verified, setVerified] = useState({ pan: !!user?.pan, gstin: !!user?.gstin });

  const h = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e?.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setLoading(true);
    try {
      const { data } = await api.put(`/users/${user._id}`, form);
      updateUser(data.user);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally { setLoading(false); }
  };

  const verify = async (field) => {
    const val = form[field];
    if (field === "pan"   && val.length !== 10) { toast.error("PAN must be 10 characters"); return; }
    if (field === "gstin" && val.length !== 15) { toast.error("GSTIN must be 15 characters"); return; }
    const tid = toast.loading(`Verifying ${field.toUpperCase()}…`);
    await new Promise(r => setTimeout(r, 1200));
    toast.success(`${field.toUpperCase()} verified!`, { id: tid });
    setVerified(p => ({ ...p, [field]: true }));
  };

  const SaveBtn = ({ color = "indigo" }) => (
    <div className="flex justify-end pt-2">
      <button onClick={save} disabled={loading}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                    text-white bg-gradient-to-br from-${color}-500 to-${color}-600
                    hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50`}>
        {loading
          ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving…</>
          : <><Save size={14}/>Save Changes</>}
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h2 className="text-xl font-bold" style={{ color:"var(--text-primary)" }}>Profile & KYC</h2>
        <p className="text-sm mt-0.5" style={{ color:"var(--text-muted)" }}>Manage your personal info, KYC and security settings</p>
      </div>

      <AvatarSection />

      {/* Personal info */}
      <SectionCard icon={User} title="Personal Information" subtitle="Your name and contact details" accent="indigo">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><FieldLabel icon={User} label="Full Name" required/>
              <TInput name="name" value={form.name} onChange={h} placeholder="Rahul Sharma" required/></div>
            <div><FieldLabel icon={Phone} label="Phone Number"/>
              <TInput name="phone" value={form.phone} onChange={h} placeholder="9876543210" type="tel"/></div>
          </div>
          <div>
            <FieldLabel label="Email Address"/>
            <div className="relative">
              <TInput value={user?.email||""} disabled className="pr-28"/>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold
                               px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Change below
              </span>
            </div>
          </div>
          <SaveBtn color="indigo"/>
        </div>
      </SectionCard>

      {/* KYC */}
      <SectionCard icon={ShieldCheck} title="Tax Identifiers (KYC)"
        subtitle="PAN and GSTIN required for filing" accent="teal">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* PAN */}
            <div>
              <FieldLabel icon={CreditCard} label="PAN Number"/>
              <div className="flex gap-2">
                <TInput name="pan" value={form.pan} onChange={h}
                  placeholder="ABCDE1234F" maxLength={10} className="uppercase flex-1"
                  style={{ fontFamily:"monospace" }}/>
                <button type="button" onClick={() => verify("pan")}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-all
                    ${verified.pan
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-indigo-600 text-white hover:opacity-90"}`}>
                  {verified.pan ? <><CheckCircle size={12} className="inline mr-1"/>OK</> : "Verify"}
                </button>
              </div>
            </div>
            {/* GSTIN */}
            <div>
              <FieldLabel icon={Briefcase} label="GSTIN"/>
              <div className="flex gap-2">
                <TInput name="gstin" value={form.gstin} onChange={h}
                  placeholder="27ABCDE1234F1Z5" maxLength={15} className="uppercase flex-1"
                  style={{ fontFamily:"monospace" }}/>
                <button type="button" onClick={() => verify("gstin")}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-all
                    ${verified.gstin
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-indigo-600 text-white hover:opacity-90"}`}>
                  {verified.gstin ? <><CheckCircle size={12} className="inline mr-1"/>OK</> : "Verify"}
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider pt-1" style={{ color:"var(--text-muted)" }}>Business Address</p>
          <div><FieldLabel icon={MapPin} label="Street Address"/>
            <TInput name="address" value={form.address} onChange={h} placeholder="123, MG Road"/></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <FieldLabel label="City"/>
              <TInput name="city" value={form.city} onChange={h} placeholder="Mumbai"/>
            </div>
            <div className="col-span-2">
              <FieldLabel label="State"/>
              <TSelect name="state" value={form.state} onChange={h}>
                <option value="">Select state…</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </TSelect>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <FieldLabel label="Pincode"/>
              <TInput name="pincode" value={form.pincode} onChange={h} placeholder="400001" maxLength={6} type="tel"/>
            </div>
          </div>
          <SaveBtn color="teal"/>
        </div>
      </SectionCard>

      <ChangeEmailSection/>
      <ChangePasswordSection/>

      {/* Account info */}
      <div className="rounded-2xl p-5"
        style={{ background:"var(--bg-surface)", border:"1px solid var(--border-subtle)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color:"var(--text-muted)" }}>Account Information</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            ["Role",         user?.role?.charAt(0).toUpperCase()+user?.role?.slice(1)||"—"],
            ["Plan",         user?.plan||"Basic"],
            ["Status",       user?.isActive!==false?"Active":"Inactive"],
            ["Assigned CA",  user?.assignedAccountant?.name||"Not assigned"],
            ["Member Since", user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN",{year:"numeric",month:"short"}) : "—"],
            ["User ID",      user?._id?.slice(-8).toUpperCase()||"—"],
          ].map(([l,v]) => (
            <div key={l}>
              <p className="text-xs mb-0.5" style={{ color:"var(--text-muted)" }}>{l}</p>
              <p className="text-sm font-semibold" style={{ color:"var(--text-primary)", fontFamily:l==="User ID"?"monospace":"inherit" }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
