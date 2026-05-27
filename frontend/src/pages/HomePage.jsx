// src/pages/HomePage.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  ShieldCheck, FileText, BarChart2, Building2, CreditCard,
  CheckCircle, Clock, Users, Star, ArrowRight, Briefcase,
  Award, TrendingUp, Phone, ChevronDown, Zap, Menu, X,
  Upload, Bell, MessageCircle, Calendar, LayoutDashboard,
  BadgeCheck, Globe, Lock, Sun, Moon,
} from "lucide-react";

// ── Inline theme toggle (no separate file import needed) ─────────────────────
const ThemeToggleIcon = () => {
  const { resolved, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="p-2 rounded-xl transition-all duration-200 border"
      style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
      {resolved === "dark"
        ? <Sun size={15} className="text-amber-400" />
        : <Moon size={15} className="text-indigo-500" />}
    </button>
  );
};

// ── Scroll fade-up hook ───────────────────────────────────────────────────────
function useFadeUp() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: FileText,    title: "GST Filing",            desc: "GSTR-1, GSTR-3B, CMP-08 & annual returns filed on time.",   tab: "tax" },
  { icon: BarChart2,   title: "Income Tax (ITR)",      desc: "ITR-1 to ITR-7 for individuals, firms and companies.",       tab: "tax" },
  { icon: Clock,       title: "TDS / TCS Filing",      desc: "Quarterly TDS returns — 24Q, 26Q, 27Q with challan support.",tab: "tax" },
  { icon: ShieldCheck, title: "Tax Audit",             desc: "Section 44AB audit by qualified Chartered Accountants.",    tab: "tax" },
  { icon: TrendingUp,  title: "Accounting & Books",    desc: "Monthly ledgers, P&L statements and bookkeeping.",           tab: "tax" },
  { icon: Globe,       title: "ROC / MCA Compliance",  desc: "Annual filings, AOC-4, MGT-7 and board resolutions.",        tab: "tax" },
  { icon: Building2,   title: "Company Registration",  desc: "Pvt Ltd, OPC, Section 8 — complete incorporation.",          tab: "business" },
  { icon: Briefcase,   title: "LLP Registration",      desc: "Limited Liability Partnership formed end-to-end.",           tab: "business" },
  { icon: BadgeCheck,  title: "MSME / Udyam",          desc: "Udyam registration for MSMEs and small businesses.",         tab: "business" },
  { icon: Globe,       title: "Trademark",             desc: "Protect your brand name, logo and intellectual property.",   tab: "business" },
  { icon: Award,       title: "FSSAI Licence",         desc: "Food business registration and annual renewal.",             tab: "business" },
  { icon: FileText,    title: "IEC / Import-Export",   desc: "IE Code for international trade & customs clearance.",       tab: "business" },
  { icon: BarChart2,   title: "CFO Services",          desc: "Virtual CFO advisory for growing businesses.",               tab: "advanced" },
  { icon: ShieldCheck, title: "GST Litigation",        desc: "Expert representation at notices, appeals & hearings.",      tab: "advanced" },
  { icon: TrendingUp,  title: "Tax Advisory",          desc: "Strategic tax planning to minimise your tax liability.",     tab: "advanced" },
  { icon: Lock,        title: "Compliance Automation", desc: "Automated deadline tracking and workflow management.",        tab: "advanced" },
  { icon: Globe,       title: "Internal Audit",        desc: "Risk-based audit covering finance, operations and IT.",      tab: "advanced" },
  { icon: Users,       title: "Payroll Processing",    desc: "Salary slips, PF, ESI, PT and professional tax.",            tab: "advanced" },
];

const PLANS = [
  { name: "Starter",    price: "₹999",   period: "/ month", popular: false, desc: "Best for freelancers & sole proprietors.",
    features: ["GSTR-1 & GSTR-3B Filing", "ITR-1 Basic Filing", "Document Upload", "Email Support", "Filing History"] },
  { name: "Growth",     price: "₹1,499", period: "/ year",  popular: true,  desc: "For small businesses with complete needs.",
    features: ["Everything in Starter", "CA-Assisted ITR Filing", "TDS Return (1 quarter)", "WhatsApp Reminders", "Priority Support", "Acknowledgement Downloads"] },
  { name: "Enterprise", price: "₹4,999", period: "/ year",  popular: false, desc: "Full-service compliance for growing firms.",
    features: ["Everything in Growth", "GST + ITR + TDS All Filings", "Dedicated CA", "Tax Advisory Sessions", "ROC / MCA Filings", "Chat + Email + WhatsApp"] },
];

const FAQS = [
  { q: "What documents are needed for ITR filing?",    a: "Form 16, bank statements, investment proofs (80C, 80D), capital gain statements and any other income documents. Our platform guides you at every step." },
  { q: "How long does GST registration take?",         a: "Typically 3–7 working days after submitting all required documents. We manage the entire ARN tracking and notify you when your GSTIN is issued." },
  { q: "Can I track my filing status in real-time?",   a: "Yes — your dashboard shows live status for every filing from document upload through to the government acknowledgement number." },
  { q: "Is my financial data safe on TaxEase?",        a: "All documents are stored on Cloudinary CDN with AES-256 encryption. We comply with Indian data protection norms and never share your data." },
  { q: "Do you handle GST notices and litigation?",    a: "Yes — our Enterprise plan includes expert representation at SCN notices, GST hearings and appeals. We have handled 500+ litigation cases." },
  { q: "What if I miss a filing deadline?",            a: "Our automated reminder system sends alerts 14, 7 and 3 days before every statutory deadline via email, WhatsApp and SMS." },
];

const TESTIMONIALS = [
  { name: "Ankit Verma",  company: "Verma Exports Pvt Ltd", text: "TaxEase transformed our GST compliance. Filing is effortless and we have not missed a single deadline in 2 years.", rating: 5 },
  { name: "Deepika Nair", company: "DN Consultants",        text: "The dashboard is intuitive and our dedicated CA responds within hours. The best platform for tax compliance.", rating: 5 },
  { name: "Rajan Patel",  company: "Patel & Sons",          text: "From GST to ITR to TDS — everything in one place. The acknowledgement downloads alone save us hours every month.", rating: 5 },
  { name: "Sunita Gupta", company: "Gupta Traders",         text: "The compliance calendar and WhatsApp reminders are a game-changer. Our accountant loves the document verification workflow.", rating: 5 },
];

const MARQUEE = ["GST Filing","Income Tax","TDS Returns","Company Registration","Trademark","MSME / Udyam","ROC Compliances","Tax Audit","CFO Services","GST Litigation","FSSAI Licence","IEC Code"];

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Features", href: "#features" },
  { label: "Pricing",  href: "#pricing"  },
  { label: "FAQ",      href: "#faq"      },
  { label: "Careers",  href: "#careers"  },
];

const COL = {
  indigo:  "bg-indigo-600/10  border-indigo-500/20  text-indigo-500",
  violet:  "bg-violet-600/10  border-violet-500/20  text-violet-500",
  teal:    "bg-teal-600/10    border-teal-500/20    text-teal-500",
  amber:   "bg-amber-600/10   border-amber-500/20   text-amber-500",
  pink:    "bg-pink-600/10    border-pink-500/20    text-pink-500",
  emerald: "bg-emerald-600/10 border-emerald-500/20 text-emerald-500",
  blue:    "bg-blue-600/10    border-blue-500/20    text-blue-500",
};

// ── Section title ─────────────────────────────────────────────────────────────
const SectionTitle = ({ tag, heading, sub }) => (
  <div className="text-center mb-12">
    {tag && (
      <span className="inline-block text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-3
                       px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
        {tag}
      </span>
    )}
    <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>{heading}</h2>
    {sub && <p className="max-w-xl mx-auto text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>{sub}</p>}
  </div>
);

// ── Inquiry Modal ─────────────────────────────────────────────────────────────
const InquiryModal = ({ service, onClose }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent]  = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)" }}>
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Enquire: {service}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/[0.08] transition"
            style={{ color: "var(--text-muted)" }}><X size={16}/></button>
        </div>
        {sent ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20
                            flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-emerald-400"/>
            </div>
            <h3 className="font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>Request Received!</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Our team will contact you within 24 hours.</p>
            <button onClick={onClose}
              className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold
                         bg-gradient-to-br from-indigo-500 to-indigo-600 text-white hover:opacity-90 transition">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="p-6 space-y-4">
            {[["Full Name","name","text","Rahul Sharma"],["Email","email","email","you@email.com"],["Phone","phone","tel","9876543210"]].map(([lbl,nm,tp,ph]) => (
              <div key={nm}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{lbl} *</label>
                <input type={tp} placeholder={ph} required value={form[nm]}
                  onChange={e => setForm(p => ({ ...p, [nm]: e.target.value }))}
                  className="t-input"/>
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Message (optional)</label>
              <textarea rows={3} placeholder="Tell us about your requirements…" value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                className="t-input resize-none"/>
            </div>
            <button type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold
                         bg-gradient-to-br from-indigo-500 to-indigo-600 text-white hover:opacity-90 transition">
              Send Request <ArrowRight size={14}/>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
const HomePage = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [serviceTab,  setServiceTab]  = useState("tax");
  const [activeFaq,   setActiveFaq]   = useState(null);
  const [inquiryFor,  setInquiryFor]  = useState(null);

  const r1 = useFadeUp(), r2 = useFadeUp(), r3 = useFadeUp();
  const r4 = useFadeUp(), r5 = useFadeUp(), r6 = useFadeUp();
  const r7 = useFadeUp(), r8 = useFadeUp();

  const filteredServices = SERVICES.filter(s => s.tab === serviceTab);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-4 left-0 right-0 z-50 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between rounded-2xl px-4 py-3"
          style={{ background: "var(--bg-nav)", border: "1px solid var(--border-subtle)", backdropFilter: "blur(12px)" }}>
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl
                            flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck size={14} color="white"/>
            </div>
            <span className="font-bold text-sm tracking-tight" style={{ color: "var(--text-primary)" }}>TaxEase</span>
          </a>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href}
                className="hover:text-indigo-400 transition-colors">{l.label}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggleIcon />
            <button onClick={() => navigate("/login")}
              className="text-sm font-medium px-3 py-2 rounded-xl transition hover:bg-white/[0.06]"
              style={{ color: "var(--text-muted)" }}>
              Sign in
            </button>
            <button onClick={() => navigate("/register")}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white
                         bg-gradient-to-br from-indigo-500 to-indigo-600 hover:opacity-90 active:scale-95 transition-all">
              Get Started
            </button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggleIcon />
            <button onClick={() => setMobileOpen(true)} style={{ color: "var(--text-muted)" }}>
              <Menu size={22}/>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 text-lg font-semibold"
            style={{ background: "rgba(3,7,18,0.95)", backdropFilter: "blur(12px)" }}>
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                className="hover:text-indigo-400 transition" style={{ color: "var(--text-primary)" }}>
                {l.label}
              </a>
            ))}
            <button onClick={() => { setMobileOpen(false); navigate("/login"); }} style={{ color: "var(--text-muted)" }}>
              Sign in
            </button>
            <button onClick={() => { setMobileOpen(false); navigate("/register"); }}
              className="rounded-full px-8 py-3 text-sm font-semibold text-white
                         bg-gradient-to-br from-indigo-500 to-indigo-600">
              Get Started
            </button>
            <button onClick={() => setMobileOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 transition" style={{ color: "var(--text-muted)" }}>
              <X size={20}/>
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-28 pb-16 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo-600/8 rounded-full blur-3xl"/>
          <div className="absolute top-60 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl"/>
        </div>
        <div className="relative max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full mb-6"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                <div className="flex -space-x-2">
                  {["AV","DN","RP"].map((t,i) => (
                    <div key={i} className="w-6 h-6 rounded-full border border-black/30 flex items-center justify-center
                                           text-[9px] font-bold bg-indigo-600 text-white">{t}</div>
                  ))}
                </div>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Trusted by 50,000+ businesses across India</span>
              </div>

              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight mb-6">
                India's most trusted{" "}
                <span className="block mt-1 bg-clip-text text-transparent
                                 bg-gradient-to-r from-indigo-400 via-indigo-500 to-violet-400">
                  tax & compliance platform
                </span>
              </h1>

              <p className="text-base leading-relaxed mb-8 max-w-lg" style={{ color: "var(--text-muted)" }}>
                From GST and ITR filing to company registration — TaxEase connects you with
                expert CAs, automated reminders, and a powerful compliance dashboard.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button onClick={() => navigate("/register")}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-base
                             font-semibold text-white bg-gradient-to-br from-indigo-500 to-indigo-600
                             hover:opacity-90 active:scale-95 transition-all">
                  Start for Free <ArrowRight size={16}/>
                </button>
                <button onClick={() => navigate("/login")}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base
                             font-semibold transition-all hover:bg-white/[0.06]"
                  style={{ border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
                  Login to Dashboard
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Zap,         label: "Automated Reminders",  sub: "Email · WhatsApp · SMS" },
                  { icon: ShieldCheck, label: "Secure Cloud Storage", sub: "AES-256 encrypted" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition"
                    style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                    <p.icon size={14} className="text-indigo-400"/>
                    <div>
                      <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{p.label}</div>
                      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{p.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — dashboard card */}
            <div className="hidden md:block">
              <div className="rounded-3xl overflow-hidden border animate-float"
                style={{ borderColor: "var(--border-subtle)", background: "var(--bg-surface)", boxShadow: "var(--shadow-card)" }}>
                <div className="px-5 pt-5 pb-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <LayoutDashboard size={13} color="white"/>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Client Dashboard</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20
                                     px-2 py-0.5 rounded-full font-medium">● Live</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[{l:"Filings",v:"12",c:"text-indigo-400"},{l:"Filed",v:"9",c:"text-emerald-400"},{l:"Pending",v:"3",c:"text-amber-400"}].map(s => (
                      <div key={s.l} className="rounded-xl p-3 text-center"
                        style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
                        <div className={`text-xl font-bold ${s.c}`}>{s.v}</div>
                        <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { t:"GSTR-1",  p:"May 2025",   s:"Filed",      c:"text-emerald-400 bg-emerald-500/10" },
                    { t:"GSTR-3B", p:"May 2025",   s:"In Process", c:"text-blue-400 bg-blue-500/10" },
                    { t:"ITR-1",   p:"FY 2024-25", s:"Pending",    c:"text-amber-400 bg-amber-500/10" },
                  ].map(f => (
                    <div key={f.t} className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                      style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
                      <div>
                        <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{f.t}</div>
                        <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{f.p}</div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${f.c}`}>{f.s}</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 pb-5 grid grid-cols-4 gap-2">
                  {[{i:Upload,l:"Upload"},{i:MessageCircle,l:"Chat"},{i:Calendar,l:"Calendar"},{i:CreditCard,l:"Pay"}].map(a => (
                    <div key={a.l} className="flex flex-col items-center gap-1 py-2 rounded-xl"
                      style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
                      <a.i size={14} className="text-indigo-400"/>
                      <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>{a.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────────────────── */}
      <div ref={r1} className="fade-up py-5 overflow-hidden"
        style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="animate-marquee whitespace-nowrap">
          {[...MARQUEE,...MARQUEE].map((item, i) => (
            <span key={i} className="mx-8 text-sm font-semibold tracking-wide inline-flex items-center gap-2"
              style={{ color: "var(--text-muted)" }}>
              <span className="w-1 h-1 rounded-full bg-indigo-500 inline-block"/>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── SERVICES ────────────────────────────────────────────────────────── */}
      <section id="services" className="py-24 px-4">
        <div ref={r2} className="fade-up max-w-6xl mx-auto">
          <SectionTitle tag="Services" heading="Everything your business needs to stay compliant"
            sub="From tax filings to company registration — we handle the complexity so you can focus on growth."/>
          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            {[{k:"tax",l:"Tax & Compliance"},{k:"business",l:"Business Services"},{k:"advanced",l:"Advanced Services"}].map(tab => (
              <button key={tab.k} onClick={() => setServiceTab(tab.k)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${serviceTab===tab.k ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "hover:opacity-80"}`}
                style={serviceTab!==tab.k ? { background:"var(--bg-surface)", border:"1px solid var(--border-default)", color:"var(--text-muted)" } : {}}>
                {tab.l}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map(svc => (
              <div key={svc.title} onClick={() => setInquiryFor(svc.title)}
                className="glass-card p-6 cursor-pointer"
                style={{ background:"var(--bg-surface)", border:"1px solid var(--border-subtle)" }}>
                <div className="w-11 h-11 rounded-xl bg-indigo-600/10 border border-indigo-500/20
                                flex items-center justify-center mb-4">
                  <svc.icon size={18} className="text-indigo-400"/>
                </div>
                <h3 className="font-semibold text-sm mb-2" style={{ color:"var(--text-primary)" }}>{svc.title}</h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color:"var(--text-muted)" }}>{svc.desc}</p>
                <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1">
                  Enquire <ArrowRight size={11}/>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4"
        style={{ background:"var(--bg-surface-2)", borderTop:"1px solid var(--border-subtle)", borderBottom:"1px solid var(--border-subtle)" }}>
        <div ref={r3} className="fade-up max-w-6xl mx-auto">
          <SectionTitle tag="Platform Features" heading="Built for India's compliance landscape"
            sub="Every feature designed around how real CA firms work with their clients."/>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {icon:LayoutDashboard,title:"Multi-Role Dashboards",  desc:"Separate Client, Admin & CA views with role-based access control.",  col:"indigo"},
              {icon:Upload,         title:"Cloud Document Upload",  desc:"Drag-and-drop to Cloudinary CDN. PDF, Excel, Word & images.",         col:"violet"},
              {icon:Calendar,       title:"Compliance Calendar",    desc:"Live GST (11th, 20th), ITR (31 Jul) & TDS quarterly deadlines.",       col:"teal"},
              {icon:Bell,           title:"Auto Reminders",         desc:"Email, WhatsApp & SMS alerts 14, 7 and 3 days before deadline.",       col:"amber"},
              {icon:MessageCircle,  title:"Client–CA Chat",         desc:"Direct messaging between clients and their assigned accountant.",      col:"pink"},
              {icon:CreditCard,     title:"Razorpay Payments",      desc:"Pay via UPI, PhonePe, Cards & Net Banking with HMAC verification.",   col:"emerald"},
              {icon:BarChart2,      title:"Admin Analytics",        desc:"Delay reports, plan charts and clients-without-uploads alerts.",       col:"blue"},
              {icon:ShieldCheck,    title:"Secure & Encrypted",     desc:"JWT auth, bcrypt passwords, role guards and AES-256 encryption.",      col:"indigo"},
            ].map(f => (
              <div key={f.title} className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
                style={{ background:"var(--bg-surface)", border:"1px solid var(--border-subtle)" }}>
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${COL[f.col]}`}>
                  <f.icon size={17}/>
                </div>
                <h3 className="font-semibold text-sm mb-2" style={{ color:"var(--text-primary)" }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4">
        <div ref={r4} className="fade-up max-w-6xl mx-auto">
          <SectionTitle tag="Pricing" heading="Simple, transparent pricing" sub="No hidden fees. No contracts. Cancel anytime."/>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map(plan => (
              <div key={plan.name}
                className={`relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]
                  ${plan.popular ? "border-indigo-500/40 shadow-xl shadow-indigo-500/10" : ""}`}
                style={{ background:"var(--bg-surface)", border:plan.popular?"1px solid rgba(99,102,241,0.4)":"1px solid var(--border-subtle)" }}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600
                                   rounded-full text-[11px] font-semibold text-white shadow-lg">
                    Most Popular
                  </span>
                )}
                <p className="text-sm font-semibold mb-2" style={{ color:"var(--text-secondary)" }}>{plan.name}</p>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-extrabold" style={{ color:"var(--text-primary)" }}>{plan.price}</span>
                  <span className="text-sm mb-1" style={{ color:"var(--text-muted)" }}>{plan.period}</span>
                </div>
                <p className="text-xs leading-relaxed mb-5" style={{ color:"var(--text-muted)" }}>{plan.desc}</p>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map(feat => (
                    <li key={feat} className="flex items-center gap-2 text-sm" style={{ color:"var(--text-secondary)" }}>
                      <CheckCircle size={14} className="text-indigo-400 flex-shrink-0"/>
                      {feat}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setInquiryFor(`${plan.name} Plan`)}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-all
                    ${plan.popular
                      ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white hover:opacity-90"
                      : "hover:bg-white/[0.06]"}`}
                  style={!plan.popular ? { border:"1px solid var(--border-default)", color:"var(--text-secondary)" } : {}}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────────── */}
      <section className="py-24 px-4"
        style={{ background:"var(--bg-surface-2)", borderTop:"1px solid var(--border-subtle)", borderBottom:"1px solid var(--border-subtle)" }}>
        <div className="max-w-6xl mx-auto">
          <SectionTitle tag="Testimonials" heading="Trusted by businesses across India"
            sub="Real results from real clients who use TaxEase every month."/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{ background:"var(--bg-surface)", border:"1px solid var(--border-subtle)" }}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_,j) => <Star key={j} size={13} fill="#f59e0b" className="text-amber-400"/>)}
                </div>
                <p className="text-sm leading-relaxed mb-5 italic" style={{ color:"var(--text-secondary)" }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full
                                  flex items-center justify-center text-xs font-bold text-white">
                    {t.name.split(" ").map(n=>n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>{t.name}</p>
                    <p className="text-xs" style={{ color:"var(--text-muted)" }}>{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-4">
        <div ref={r5} className="fade-up max-w-3xl mx-auto">
          <SectionTitle tag="FAQ" heading="Frequently asked questions"
            sub="Everything you need to know. Can't find an answer? Reach out to our team."/>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-xl overflow-hidden transition-all duration-300"
                style={{ border: activeFaq===i ? "1px solid rgba(99,102,241,0.35)" : "1px solid var(--border-subtle)",
                         background: activeFaq===i ? "rgba(99,102,241,0.06)" : "var(--bg-surface)" }}>
                <button onClick={() => setActiveFaq(activeFaq===i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-medium text-sm pr-4" style={{ color:"var(--text-primary)" }}>{faq.q}</span>
                  <ChevronDown size={16} style={{ color:"var(--text-muted)" }}
                    className={`flex-shrink-0 transition-transform duration-300 ${activeFaq===i?"rotate-180 !text-indigo-400":""}`}/>
                </button>
                {activeFaq===i && (
                  <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color:"var(--text-muted)", borderTop:"1px solid var(--border-subtle)", paddingTop:"1rem" }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAREERS ─────────────────────────────────────────────────────────── */}
      <section id="careers" className="py-24 px-4"
        style={{ background:"var(--bg-surface-2)", borderTop:"1px solid var(--border-subtle)", borderBottom:"1px solid var(--border-subtle)" }}>
        <div ref={r6} className="fade-up max-w-6xl mx-auto">
          <SectionTitle tag="Careers" heading="Join the WhiteCircle team"
            sub="Work with India's best tax professionals in a fully remote-first environment."/>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              {title:"Chartered Accountant",type:"Full Time",location:"Remote / Delhi",  desc:"Manage 30+ clients — GST, ITR, TDS filings and advisory."},
              {title:"React Developer",      type:"Full Time",location:"Remote",          desc:"Build and maintain TaxEase dashboards and internal CA tools."},
              {title:"Client Success",       type:"Full Time",location:"Delhi / Mumbai",  desc:"Onboard new clients and ensure exceptional service quality."},
            ].map(job => (
              <div key={job.title} className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{ background:"var(--bg-surface)", border:"1px solid var(--border-subtle)" }}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-sm" style={{ color:"var(--text-primary)" }}>{job.title}</h3>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20
                                   px-2 py-0.5 rounded-full font-medium ml-2 flex-shrink-0">{job.type}</span>
                </div>
                <p className="text-[11px] mb-3" style={{ color:"var(--text-muted)" }}>📍 {job.location}</p>
                <p className="text-xs leading-relaxed mb-5" style={{ color:"var(--text-muted)" }}>{job.desc}</p>
                <button onClick={() => setInquiryFor(`Job Application: ${job.title}`)}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-full py-2.5 text-xs
                             font-semibold text-white bg-gradient-to-br from-indigo-500 to-indigo-600
                             hover:opacity-90 active:scale-95 transition-all">
                  Apply Now <ArrowRight size={12}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div ref={r7} className="fade-up max-w-3xl mx-auto">
          <div className="rounded-3xl p-12 md:p-16 text-center overflow-hidden relative"
            style={{ border:"1px solid rgba(124,58,237,0.25)", background:"linear-gradient(to bottom, rgba(124,58,237,0.12), rgba(124,58,237,0.04))" }}>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 bg-indigo-600/8 rounded-full blur-3xl"/>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-5" style={{ color:"var(--text-primary)" }}>
                Ready to simplify your taxes?
              </h2>
              <p className="text-base mb-8 max-w-lg mx-auto leading-relaxed" style={{ color:"var(--text-muted)" }}>
                Join 50,000+ Indian businesses. No setup fees. No contracts. Your first filing is free.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => navigate("/register")}
                  className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-base font-semibold text-white
                             bg-gradient-to-br from-indigo-500 to-indigo-600 hover:opacity-90 active:scale-95 transition-all">
                  Start for Free <ArrowRight size={16}/>
                </button>
                <button onClick={() => setInquiryFor("Free Consultation")}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition"
                  style={{ border:"1px solid var(--border-default)", color:"var(--text-secondary)" }}>
                  <Phone size={15}/> Book Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer ref={r8} className="fade-up pt-14 pb-6 px-4"
        style={{ background:"var(--bg-surface-2)", borderTop:"1px solid var(--border-subtle)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 pb-10" style={{ borderBottom:"1px solid var(--border-subtle)" }}>
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl
                                flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <ShieldCheck size={14} color="white"/>
                </div>
                <span className="font-bold text-sm" style={{ color:"var(--text-primary)" }}>TaxEase</span>
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color:"var(--text-muted)" }}>
                WhiteCircle Group's tax & compliance platform — trusted by 50,000+ businesses across India since 2020.
              </p>
              <p className="text-xs" style={{ color:"var(--text-muted)" }}>📧 support@whitecircle.in</p>
              <p className="text-xs mt-1" style={{ color:"var(--text-muted)" }}>📞 +91 98765 43210</p>
            </div>
            <div className="flex flex-wrap justify-between flex-1 gap-8">
              {[
                {title:"Tax Services",links:["GST Filing","ITR Filing","TDS Filing","Tax Audit","ROC Compliances"]},
                {title:"Business",    links:["Company Reg.","LLP Registration","MSME / Udyam","Trademark","FSSAI"]},
                {title:"Company",     links:["About Us","Careers","Blog","Contact"]},
                {title:"Legal",       links:["Privacy Policy","Terms of Service","Refund Policy"]},
              ].map(col => (
                <div key={col.title}>
                  <h4 className="font-semibold text-sm mb-4" style={{ color:"var(--text-primary)" }}>{col.title}</h4>
                  <ul className="space-y-2">
                    {col.links.map(l => (
                      <li key={l}>
                        <button className="text-sm transition hover:text-indigo-400" style={{ color:"var(--text-muted)" }}>{l}</button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
            <p>© {new Date().getFullYear()} WhiteCircle Group — TaxEase. All rights reserved.</p>
            <p>Made with ❤️ in India 🇮🇳</p>
          </div>
        </div>
      </footer>

      {inquiryFor && <InquiryModal service={inquiryFor} onClose={() => setInquiryFor(null)}/>}
    </div>
  );
};

export default HomePage;
