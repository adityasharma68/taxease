// src/pages/admin/AdminProfile.jsx — Admin profile page
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { User, Phone, Save, Users, BarChart2, Settings } from "lucide-react";
import {
  AvatarSection, ChangeEmailSection, ChangePasswordSection,
  SectionCard, TInput, FieldLabel,
} from "../../components/profile/ProfileBase";

const AdminProfile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm]   = useState({ name: user?.name||"", phone: user?.phone||"" });
  const [loading, setLoading] = useState(false);

  const save = async () => {
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

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h2 className="text-xl font-bold" style={{ color:"var(--text-primary)" }}>Admin Profile</h2>
        <p className="text-sm mt-0.5" style={{ color:"var(--text-muted)" }}>Manage your admin account and security settings</p>
      </div>

      <AvatarSection/>

      {/* Admin stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Users,    label: "Total Clients",  val: "—", color: "indigo" },
          { icon: BarChart2, label: "Filings Managed",val: "—", color: "teal"   },
          { icon: Settings,  label: "Admin Since",    val: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN",{year:"numeric",month:"short"}) : "—", color: "violet" },
        ].map(({ icon:Icon, label, val, color }) => (
          <div key={label} className="rounded-2xl p-4 text-center"
            style={{ background:"var(--bg-surface)", border:"1px solid var(--border-subtle)" }}>
            <div className={`w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center
                             bg-${color}-500/10 border border-${color}-500/20 text-${color}-400`}>
              <Icon size={16}/>
            </div>
            <p className="text-lg font-bold" style={{ color:"var(--text-primary)" }}>{val}</p>
            <p className="text-xs" style={{ color:"var(--text-muted)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Personal */}
      <SectionCard icon={User} title="Personal Information" subtitle="Your name and contact details" accent="violet">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><FieldLabel icon={User} label="Full Name" required/>
              <TInput name="name" value={form.name}
                onChange={e => setForm(p=>({...p,name:e.target.value}))}
                placeholder="Admin Name" required/></div>
            <div><FieldLabel icon={Phone} label="Phone Number"/>
              <TInput name="phone" value={form.phone}
                onChange={e => setForm(p=>({...p,phone:e.target.value}))}
                placeholder="9876543210" type="tel"/></div>
          </div>
          <div><FieldLabel label="Email Address"/>
            <div className="relative">
              <TInput value={user?.email||""} disabled className="pr-28"/>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold
                               px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                Change below
              </span>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={save} disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                         bg-gradient-to-br from-violet-500 to-violet-600 hover:opacity-90
                         active:scale-[0.98] transition-all disabled:opacity-50">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving…</>
                : <><Save size={14}/>Save Changes</>}
            </button>
          </div>
        </div>
      </SectionCard>

      <ChangeEmailSection/>
      <ChangePasswordSection/>

      {/* Admin account info */}
      <div className="rounded-2xl p-5"
        style={{ background:"var(--bg-surface)", border:"1px solid var(--border-subtle)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color:"var(--text-muted)" }}>Admin Account Details</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            ["Role",       "Administrator"],
            ["Access Level","Full Platform Access"],
            ["Status",     "Active"],
            ["Member Since", user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN",{year:"numeric",month:"short"}) : "—"],
            ["User ID",    user?._id?.slice(-8).toUpperCase()||"—"],
            ["2FA",        "Not Configured"],
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
export default AdminProfile;
