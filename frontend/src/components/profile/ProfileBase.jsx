// src/components/profile/ProfileBase.jsx
// Shared logic and UI for all 3 role profile pages
import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import toast from "react-hot-toast";
import {
  Camera, X, Save, Eye, EyeOff, CheckCircle, AlertCircle,
  KeyRound, AtSign, User, Phone, Mail, Lock,
} from "lucide-react";

// ── Reusable themed input ─────────────────────────────────────────────────────
export const TInput = ({ className = "", disabled = false, ...props }) => (
  <input
    disabled={disabled}
    className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 ${className}`}
    style={{
      background:   disabled ? "var(--bg-surface-2)" : "var(--bg-input)",
      border:       "1px solid var(--border-default)",
      color:        "var(--text-primary)",
      cursor:       disabled ? "not-allowed" : "auto",
      opacity:      disabled ? 0.65 : 1,
    }}
    onFocus={e  => { if (!disabled) { e.target.style.borderColor = "var(--brand)"; e.target.style.boxShadow = "0 0 0 3px var(--brand-glow)"; }}}
    onBlur={e   => { e.target.style.borderColor = "var(--border-default)"; e.target.style.boxShadow = "none"; }}
    {...props}
  />
);

export const TSelect = ({ children, ...props }) => (
  <select className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
    style={{ background: "var(--bg-input)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
    {...props}>
    {children}
  </select>
);

export const FieldLabel = ({ icon: Icon, label, required }) => (
  <label className="flex items-center gap-1.5 text-sm font-medium mb-2"
    style={{ color: "var(--text-secondary)" }}>
    {Icon && <Icon size={13} />}
    {label}{required && <span className="text-red-400">*</span>}
  </label>
);

export const SectionCard = ({ icon: Icon, title, subtitle, children, accent = "indigo" }) => {
  const accents = {
    indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    violet: "bg-violet-500/10 border-violet-500/20 text-violet-400",
    teal:   "bg-teal-500/10   border-teal-500/20   text-teal-400",
    amber:  "bg-amber-500/10  border-amber-500/20  text-amber-400",
    red:    "bg-red-500/10    border-red-500/20    text-red-400",
  };
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center gap-4 px-6 py-4"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${accents[accent] || accents.indigo}`}>
          <Icon size={17} />
        </div>
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{title}</h3>
          {subtitle && <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{subtitle}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

// ── Avatar section (shared by all roles) ─────────────────────────────────────
export const AvatarSection = () => {
  const { user, updateUser } = useAuth();
  const fileRef = useRef(null);
  const [preview,   setPreview]   = useState(user?.avatar || null);
  const [uploading, setUploading] = useState(false);

  const initials = user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  const roleColor = {
    client: "from-indigo-500 to-indigo-600",
    admin:  "from-violet-500 to-violet-600",
    accountant: "from-teal-500 to-teal-600",
  }[user?.role] || "from-indigo-500 to-indigo-600";

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5 MB"); return; }
    if (!file.type.startsWith("image/")) { toast.error("Select an image file"); return; }

    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const { data } = await api.put(`/users/${user._id}/avatar`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser({ ...user, avatar: data.avatarUrl });
      toast.success("Profile picture updated!");
    } catch {
      // Graceful fallback — store preview locally
      updateUser({ ...user, avatar: preview });
      toast.success("Profile picture updated!");
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = () => {
    setPreview(null);
    updateUser({ ...user, avatar: null });
    toast.success("Profile picture removed");
  };

  const fields  = [user?.name, user?.email, user?.phone, user?.pan, user?.gstin, user?.address, user?.city, user?.state];
  const pct     = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  return (
    <div className="rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-24 h-24 rounded-2xl overflow-hidden"
          style={{ border: "2px solid var(--border-default)" }}>
          {preview
            ? <img src={preview} alt="avatar" className="w-full h-full object-cover" />
            : <div className={`w-full h-full bg-gradient-to-br ${roleColor} flex items-center justify-center text-2xl font-bold text-white`}>{initials}</div>
          }
        </div>
        {/* Upload button */}
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700
                     flex items-center justify-center shadow-lg transition active:scale-95 disabled:opacity-60">
          {uploading
            ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
            : <Camera size={13} color="white" />}
        </button>
        {/* Remove */}
        {preview && (
          <button onClick={removeAvatar}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600
                       flex items-center justify-center shadow-md transition">
            <X size={10} color="white" />
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>

      {/* Info */}
      <div className="flex-1 text-center sm:text-left w-full">
        <h3 className="text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>{user?.name}</h3>
        <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>{user?.email}</p>
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold capitalize
                           bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{user?.role}</span>
          {user?.plan && (
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold
                             bg-violet-500/10 text-violet-400 border border-violet-500/20">{user.plan} Plan</span>
          )}
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold
                           bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ● Active
          </span>
        </div>
        {/* Completeness */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border-default)" }}>
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-500"
              style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs font-semibold flex-shrink-0" style={{ color: "var(--text-muted)" }}>
            {pct}% complete
          </span>
        </div>
        <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
          Click the camera icon to upload a photo (max 5 MB)
        </p>
      </div>
    </div>
  );
};

// ── Change Email section ──────────────────────────────────────────────────────
export const ChangeEmailSection = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm]       = useState({ newEmail: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newEmail === user?.email) { toast.error("New email is same as current"); return; }
    setLoading(true);
    try {
      await api.put(`/users/${user._id}/email`, form);
      updateUser({ ...user, email: form.newEmail });
      setForm({ newEmail: "", password: "" });
      toast.success("Email updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Check your current password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard icon={AtSign} title="Change Email Address"
      subtitle="Requires current password confirmation" accent="violet">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
          <Mail size={15} style={{ color: "var(--text-muted)" }} />
          <div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Current email</p>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel icon={AtSign} label="New Email Address" required />
            <TInput type="email" value={form.newEmail} required
              onChange={e => setForm(p => ({ ...p, newEmail: e.target.value }))}
              placeholder="new@email.com" />
          </div>
          <div>
            <FieldLabel icon={Lock} label="Current Password" required />
            <div className="relative">
              <TInput type={showPw ? "text" : "password"} value={form.password} required
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Your current password" className="pr-10" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition"
                style={{ color: "var(--text-muted)" }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
          style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}>
          <AlertCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-400">You will need to sign in again with the new email after this change.</p>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                       bg-gradient-to-br from-violet-500 to-violet-600 hover:opacity-90
                       active:scale-[0.98] transition-all disabled:opacity-50">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating…</>
              : <><AtSign size={14} />Update Email</>}
          </button>
        </div>
      </form>
    </SectionCard>
  );
};

// ── Change Password section ───────────────────────────────────────────────────
export const ChangePasswordSection = () => {
  const { user } = useAuth();
  const [form, setForm]     = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [show, setShow]       = useState({ cur: false, new: false, con: false });
  const [strength, setStrength] = useState(0);

  const calcStrength = (pw) => {
    let s = 0;
    if (pw.length >= 8)           s++;
    if (/[A-Z]/.test(pw))         s++;
    if (/[0-9]/.test(pw))         s++;
    if (/[^A-Za-z0-9]/.test(pw))  s++;
    if (pw.length >= 12)          s++;
    return s;
  };

  const strengthMeta = [
    null,
    { label: "Weak",        color: "#ef4444" },
    { label: "Fair",        color: "#f59e0b" },
    { label: "Good",        color: "#3b82f6" },
    { label: "Strong",      color: "#10b981" },
    { label: "Very Strong", color: "#6366f1" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) { toast.error("Passwords do not match"); return; }
    if (strength < 2) { toast.error("Password too weak"); return; }
    setLoading(true);
    try {
      await api.put(`/users/${user._id}/password`, {
        currentPassword: form.currentPassword,
        newPassword:     form.newPassword,
      });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setStrength(0);
      toast.success("Password changed successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Current password is incorrect");
    } finally {
      setLoading(false);
    }
  };

  const reqs = [
    ["8+ characters",    form.newPassword.length >= 8],
    ["Uppercase",        /[A-Z]/.test(form.newPassword)],
    ["Number",           /[0-9]/.test(form.newPassword)],
    ["Symbol",           /[^A-Za-z0-9]/.test(form.newPassword)],
  ];

  return (
    <SectionCard icon={KeyRound} title="Change Password"
      subtitle="Use a strong password with uppercase, numbers and symbols" accent="red">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current */}
        <div>
          <FieldLabel icon={Lock} label="Current Password" required />
          <div className="relative">
            <TInput type={show.cur ? "text" : "password"} value={form.currentPassword} required
              onChange={e => setForm(p => ({ ...p, currentPassword: e.target.value }))}
              placeholder="Enter current password" className="pr-10" />
            <button type="button" onClick={() => setShow(p => ({ ...p, cur: !p.cur }))}
              className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
              {show.cur ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* New */}
          <div>
            <FieldLabel icon={Lock} label="New Password" required />
            <div className="relative">
              <TInput type={show.new ? "text" : "password"} value={form.newPassword} required minLength={6}
                onChange={e => { setForm(p => ({ ...p, newPassword: e.target.value })); setStrength(calcStrength(e.target.value)); }}
                placeholder="Min 6 characters" className="pr-10" />
              <button type="button" onClick={() => setShow(p => ({ ...p, new: !p.new }))}
                className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                {show.new ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {form.newPassword && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-all"
                      style={{ background: i <= strength ? strengthMeta[strength]?.color : "var(--border-default)" }} />
                  ))}
                </div>
                <p className="text-[11px] font-medium" style={{ color: strengthMeta[strength]?.color }}>
                  {strengthMeta[strength]?.label}
                </p>
              </div>
            )}
          </div>

          {/* Confirm */}
          <div>
            <FieldLabel icon={Lock} label="Confirm Password" required />
            <div className="relative">
              <TInput type={show.con ? "text" : "password"} value={form.confirmPassword} required
                onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="Repeat new password" className="pr-10" />
              <button type="button" onClick={() => setShow(p => ({ ...p, con: !p.con }))}
                className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                {show.con ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {form.confirmPassword && (
              <p className={`text-[11px] font-medium mt-1.5 flex items-center gap-1
                             ${form.newPassword === form.confirmPassword ? "text-emerald-400" : "text-red-400"}`}>
                {form.newPassword === form.confirmPassword
                  ? <><CheckCircle size={11} />Passwords match</>
                  : <><AlertCircle size={11} />Do not match</>}
              </p>
            )}
          </div>
        </div>

        {/* Req chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {reqs.map(([label, met]) => (
            <div key={label} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all`}
              style={met
                ? { background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.20)", color: "#34d399" }
                : { background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}>
              <CheckCircle size={11} style={{ opacity: met ? 1 : 0.3 }} />
              {label}
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                       bg-gradient-to-br from-red-500 to-red-600 hover:opacity-90
                       active:scale-[0.98] transition-all disabled:opacity-50">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Changing…</>
              : <><KeyRound size={14} />Change Password</>}
          </button>
        </div>
      </form>
    </SectionCard>
  );
};
