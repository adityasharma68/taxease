// src/pages/accountant/AccountantProfile.jsx — CA profile page
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { User, Phone, Save, Briefcase, Award, CheckSquare, FileText } from "lucide-react";
import {
  AvatarSection, ChangeEmailSection, ChangePasswordSection,
  SectionCard, TInput, TSelect, FieldLabel,
} from "../../components/profile/ProfileBase";

const QUALIFICATIONS = ["CA (Chartered Accountant)","CPA","CS (Company Secretary)","CMA","B.Com","M.Com","MBA Finance","Other"];
const SPECIALIZATIONS = ["GST & Indirect Tax","Income Tax & ITR","TDS / TCS","Company Law & ROC","Audit & Assurance","Payroll & HR Compliance","International Taxation","All Areas"];

const AccountantProfile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name:           user?.name           || "",
    phone:          user?.phone          || "",
    qualification:  user?.qualification  || "",
    specialization: user?.specialization || "",
    experience:     user?.experience     || "",
    licenseNumber:  user?.licenseNumber  || "",
    bio:            user?.bio            || "",
  });
  const [loading, setLoading] = useState(false);

  const h = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

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
        <h2 className="text-xl font-bold" style={{ color:"var(--text-primary)" }}>Accountant Profile</h2>
        <p className="text-sm mt-0.5" style={{ color:"var(--text-muted)" }}>Your professional profile visible to clients</p>
      </div>

      <AvatarSection/>

      {/* CA stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: CheckSquare, label: "Tasks Completed", val: "—", color: "teal"   },
          { icon: FileText,    label: "Filings Done",    val: "—", color: "indigo" },
          { icon: Award,       label: "Experience",      val: form.experience ? `${form.experience} yrs` : "—", color: "amber"  },
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
      <SectionCard icon={User} title="Personal Information" subtitle="Your name and contact details" accent="teal">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><FieldLabel icon={User} label="Full Name" required/>
              <TInput name="name" value={form.name} onChange={h} placeholder="CA Priya Mehta" required/></div>
            <div><FieldLabel icon={Phone} label="Phone Number"/>
              <TInput name="phone" value={form.phone} onChange={h} placeholder="9876543210" type="tel"/></div>
          </div>
          <div><FieldLabel label="Email Address"/>
            <div className="relative">
              <TInput value={user?.email||""} disabled className="pr-28"/>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold
                               px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                Change below
              </span>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={save} disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                         bg-gradient-to-br from-teal-500 to-teal-600 hover:opacity-90
                         active:scale-[0.98] transition-all disabled:opacity-50">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving…</>
                : <><Save size={14}/>Save Changes</>}
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Professional details */}
      <SectionCard icon={Briefcase} title="Professional Details"
        subtitle="Qualifications and specialization visible to clients" accent="indigo">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><FieldLabel label="Qualification"/>
              <TSelect name="qualification" value={form.qualification} onChange={h}>
                <option value="">Select qualification…</option>
                {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
              </TSelect>
            </div>
            <div><FieldLabel label="Specialization"/>
              <TSelect name="specialization" value={form.specialization} onChange={h}>
                <option value="">Select specialization…</option>
                {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </TSelect>
            </div>
            <div><FieldLabel icon={Award} label="Years of Experience"/>
              <TInput name="experience" value={form.experience} onChange={h}
                placeholder="e.g. 5" type="number" min="0" max="50"/></div>
            <div><FieldLabel label="License / ICAI Membership No."/>
              <TInput name="licenseNumber" value={form.licenseNumber} onChange={h}
                placeholder="e.g. 123456" style={{ fontFamily:"monospace" }}/></div>
          </div>
          <div>
            <FieldLabel label="Professional Bio (shown to clients)"/>
            <textarea name="bio" value={form.bio} onChange={h} rows={3}
              placeholder="Brief description of your expertise and services…"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none transition-all duration-200"
              style={{ background:"var(--bg-input)", border:"1px solid var(--border-default)", color:"var(--text-primary)" }}
              onFocus={e => { e.target.style.borderColor="var(--brand)"; e.target.style.boxShadow="0 0 0 3px var(--brand-glow)"; }}
              onBlur={e  => { e.target.style.borderColor="var(--border-default)"; e.target.style.boxShadow="none"; }}/>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={save} disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                         bg-gradient-to-br from-indigo-500 to-indigo-600 hover:opacity-90
                         active:scale-[0.98] transition-all disabled:opacity-50">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving…</>
                : <><Save size={14}/>Save Profile</>}
            </button>
          </div>
        </div>
      </SectionCard>

      <ChangeEmailSection/>
      <ChangePasswordSection/>

      {/* Account info */}
      <div className="rounded-2xl p-5"
        style={{ background:"var(--bg-surface)", border:"1px solid var(--border-subtle)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color:"var(--text-muted)" }}>Account Details</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            ["Role",         "Accountant / CA"],
            ["Status",       "Active"],
            ["Member Since", user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN",{year:"numeric",month:"short"}) : "—"],
            ["Qualification",form.qualification||"Not set"],
            ["Specialization",form.specialization||"Not set"],
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
export default AccountantProfile;
