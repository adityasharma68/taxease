// src/pages/HomePage.jsx  — Full updated homepage with all PDF requirements
import { useState } from "react";
import { ThemeToggleButton } from "../components/common/ThemeToggle";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck, FileText, BarChart2, Building2, CreditCard,
  CheckCircle, Clock, Users, Star, ChevronDown, ChevronUp,
  ArrowRight, Briefcase, Award, TrendingUp, Phone,
} from "lucide-react";

// ── All 20+ services from PDF ────────────────────────────────────────────────
const TAX_SERVICES = [
  { title:"GST Registration",          desc:"Get your business GST registered quickly.",          color:"bg-indigo-50 text-indigo-600" },
  { title:"GST Filing",                desc:"GSTR-1, GSTR-3B, CMP-08 & annual returns.",         color:"bg-indigo-50 text-indigo-600" },
  { title:"Income Tax Filing",         desc:"ITR-1 to ITR-7 for all categories.",                color:"bg-emerald-50 text-emerald-600" },
  { title:"TDS / TCS Filing",          desc:"Quarterly TDS returns — 24Q, 26Q, 27Q.",            color:"bg-amber-50 text-amber-600" },
  { title:"Accounting & Bookkeeping",  desc:"Monthly books, ledgers and P&L statements.",        color:"bg-rose-50 text-rose-600" },
  { title:"Tax Audit",                 desc:"Section 44AB tax audit by qualified CAs.",           color:"bg-purple-50 text-purple-600" },
  { title:"ROC / MCA Compliances",     desc:"Annual filings, AOC-4, MGT-7 and more.",            color:"bg-blue-50 text-blue-600" },
  { title:"Payroll Processing",        desc:"Salary slips, PF, ESI and professional tax.",       color:"bg-teal-50 text-teal-600" },
  { title:"PAN / TAN Services",        desc:"Apply or correct PAN and TAN online.",              color:"bg-orange-50 text-orange-600" },
  { title:"Professional Tax",          desc:"State professional tax registration & filing.",     color:"bg-pink-50 text-pink-600" },
];

const BUSINESS_SERVICES = [
  { title:"Company Registration",     desc:"Pvt Ltd, OPC, Section 8 company formation." },
  { title:"LLP Registration",         desc:"Limited Liability Partnership incorporation." },
  { title:"MSME Registration",        desc:"Udyam registration for small businesses." },
  { title:"Startup India",            desc:"DPIIT recognition and startup benefits." },
  { title:"Trademark Registration",   desc:"Protect your brand name and logo." },
  { title:"FSSAI Registration",       desc:"Food licence for restaurants & food businesses." },
  { title:"IEC Code",                 desc:"Import Export Code for international trade." },
];

const ADVANCED_SERVICES = [
  { title:"Business Consulting",  icon:Briefcase },
  { title:"Tax Advisory",         icon:FileText },
  { title:"Internal Audit",       icon:Award },
  { title:"GST Litigation",       icon:ShieldCheck },
  { title:"CFO Services",         icon:BarChart2 },
  { title:"Compliance Automation",icon:CheckCircle },
];

const PLANS = [
  { name:"GST Filing",  price:"₹999",  period:"/month", features:["GSTR-1 Filing","GSTR-3B Filing","Email Support","Filing History"], highlighted:false },
  { name:"ITR Filing",  price:"₹1,499",period:"/year",  features:["ITR-1 to ITR-4","CA Assisted","Document Upload","Acknowledgement"], highlighted:true },
  { name:"Full Compliance",price:"₹4,999",period:"/year",features:["GST + ITR + TDS","Dedicated CA","Priority Support","All Features","WhatsApp Alerts"], highlighted:false },
];

const FAQS = [
  { q:"What documents are needed for ITR filing?", a:"Form 16, bank statements, investment proofs, and any other income documents. Our platform guides you step by step." },
  { q:"How long does GST registration take?",      a:"Typically 3–7 working days after submitting all required documents. We handle the entire process." },
  { q:"Can I track my filing status in real-time?",a:"Yes! Your dashboard shows live updates on all filings — from submission to acknowledgement." },
  { q:"Is my data safe on WhiteCircle TaxEase?",   a:"Absolutely. We use 256-bit SSL encryption and comply with all Indian data protection regulations." },
  { q:"Do you handle GST notices and litigation?",  a:"Yes, our experts handle GST department notices, appeals, and litigation at all levels." },
  { q:"What if I miss a filing deadline?",          a:"Our system sends reminders before every deadline. If you miss one, we help you file with minimum penalties." },
];

const TESTIMONIALS = [
  { name:"Ankit Verma",   company:"Verma Exports Pvt Ltd", text:"WhiteCircle TaxEase transformed how we handle GST compliance. Filing is now a breeze and we never miss deadlines!", rating:5 },
  { name:"Deepika Nair",  company:"DN Consultants",        text:"The dashboard makes tracking due dates so simple. The CA team is responsive and very professional.", rating:5 },
  { name:"Rajan Patel",   company:"Patel & Sons",          text:"Excellent service! The accountants are prompt and the platform is very user-friendly. Highly recommended.", rating:4 },
  { name:"Sunita Gupta",  company:"Gupta Traders",         text:"Best tax compliance platform in India. We use it for GST, ITR, and TDS — all in one place!", rating:5 },
];

// ── Navbar ────────────────────────────────────────────────────────────────────
const Navbar = ({ navigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-[var(--shadow-card)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"><ShieldCheck size={16} color="white" /></div>
          <div>
            <span className="text-lg font-bold text-[var(--text-primary)]" style={{fontFamily:"serif"}}>TaxEase</span>
            <span className="text-xs text-[var(--text-muted)] ml-1">by WhiteCircle Group</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-[var(--text-secondary)]">
          {["Services","Pricing","About","Careers"].map(item => <button key={item} className="hover:text-indigo-600 transition-colors">{item}</button>)}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggleButton />
          <button onClick={() => navigate("/login")} className="text-sm font-semibold text-[var(--text-secondary)] hover:text-indigo-600 px-4 py-2">Login</button>
          <button onClick={() => navigate("/register")} className="text-sm font-semibold bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">Get Started</button>
        </div>
      </div>
    </nav>
  );
};

// ── Service Inquiry Form Modal ────────────────────────────────────────────────
const ServiceForm = ({ service, onClose }) => {
  const [form, setForm] = useState({ name:"", email:"", phone:"", message:"" });
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); setSent(true); };
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <h3 className="font-bold text-[var(--text-primary)]">Enquire: {service}</h3>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] text-xl">×</button>
        </div>
        {sent ? (
          <div className="p-10 text-center">
            <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
            <h3 className="font-bold text-[var(--text-primary)] text-lg mb-2">Request Sent!</h3>
            <p className="text-[var(--text-muted)] text-sm">Our team will contact you within 24 hours.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {[["Full Name","name","text","Rahul Sharma"],["Email","email","email","you@email.com"],["Phone","phone","tel","9876543210"]].map(([label,name,type,ph]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{label} *</label>
                <input type={type} placeholder={ph} value={form[name]} required
                  onChange={e => setForm(p=>({...p,[name]:e.target.value}))}
                  className="w-full px-4 py-2.5 border border-[var(--border-subtle)] rounded-xl text-sm focus:border-indigo-500 outline-none" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Message (optional)</label>
              <textarea rows={3} placeholder="Any specific requirements..."
                className="w-full px-4 py-3 border border-[var(--border-subtle)] rounded-xl text-sm resize-none focus:border-indigo-500 outline-none"
                onChange={e => setForm(p=>({...p,message:e.target.value}))} />
            </div>
            <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-sm">
              Submit Enquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// ── Main HomePage ─────────────────────────────────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();
  const [activeFaq,       setActiveFaq]       = useState(null);
  const [testimonialIdx,  setTestimonialIdx]  = useState(0);
  const [serviceForm,     setServiceForm]     = useState(null);
  const [activeServiceTab,setActiveServiceTab]= useState("tax");

  return (
    <div className="overflow-x-hidden">
      <Navbar navigate={navigate} />
      {serviceForm && <ServiceForm service={serviceForm} onClose={() => setServiceForm(null)} />}

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white pt-16">
        <div className="text-center max-w-5xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            India's Most Trusted Tax & Compliance Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{fontFamily:"serif"}}>
            Tax Compliance,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Simplified.</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            GST • ITR • TDS • Business Registration — handled by expert CAs from one powerful dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button onClick={() => navigate("/register")} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl transition-all hover:scale-105 text-lg flex items-center gap-2">
              Get Started Free <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate("/login")} className="px-8 py-4 bg-[var(--bg-surface)]/10 hover:bg-[var(--bg-surface)]/20 text-white font-semibold rounded-2xl border border-white/20 text-lg">
              Login to Dashboard
            </button>
            <button onClick={() => setServiceForm("Book Consultation")} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-2xl text-lg flex items-center gap-2">
              <Phone size={18} /> Book Consultation
            </button>
          </div>
          {/* Quick links bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {["GST Filing","ITR Filing","TDS Filing","Business Registration","Trademark","MSME"].map(s => (
              <button key={s} onClick={() => setServiceForm(s)}
                className="px-4 py-2 bg-[var(--bg-surface)]/10 hover:bg-[var(--bg-surface)]/20 rounded-xl border border-white/20 transition-all text-white/80 hover:text-white">
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center gap-10 mt-16 text-[var(--text-muted)] text-sm">
            {[["50K+","Clients"],["₹200Cr+","Tax Filed"],["99.8%","Accuracy"],["4.9/5","Rating"]].map(([num,label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-white">{num}</div><div>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────── */}
      <section className="py-24 bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4" style={{fontFamily:"serif"}}>Our Services</h2>
            <p className="text-[var(--text-muted)] text-lg">Complete tax and business compliance — all under one roof.</p>
          </div>
          {/* Tab switcher */}
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {[["tax","Tax & Compliance"],["business","Business Services"],["advanced","Advanced Services"]].map(([key,label]) => (
              <button key={key} onClick={() => setActiveServiceTab(key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeServiceTab===key?"bg-indigo-600 text-white":"bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"}`}>
                {label}
              </button>
            ))}
          </div>

          {activeServiceTab === "tax" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {TAX_SERVICES.map(svc => (
                <div key={svc.title} className="group p-5 border border-[var(--border-subtle)] rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-10 h-10 ${svc.color} rounded-xl flex items-center justify-center mb-3`}><FileText size={18} /></div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">{svc.title}</h3>
                  <p className="text-[var(--text-muted)] text-xs leading-relaxed">{svc.desc}</p>
                  <button onClick={() => setServiceForm(svc.title)} className="mt-3 text-xs font-semibold text-indigo-600 flex items-center gap-1">
                    Enquire <ArrowRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeServiceTab === "business" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {BUSINESS_SERVICES.map(svc => (
                <div key={svc.title} className="p-5 border border-[var(--border-subtle)] rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3"><Building2 size={18} /></div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">{svc.title}</h3>
                  <p className="text-[var(--text-muted)] text-xs leading-relaxed">{svc.desc}</p>
                  <button onClick={() => setServiceForm(svc.title)} className="mt-3 text-xs font-semibold text-indigo-600 flex items-center gap-1">Enquire <ArrowRight size={12} /></button>
                </div>
              ))}
            </div>
          )}

          {activeServiceTab === "advanced" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ADVANCED_SERVICES.map(svc => (
                <div key={svc.title} className="p-6 border border-[var(--border-subtle)] rounded-2xl hover:shadow-lg transition-all bg-gradient-to-br from-white to-indigo-50/30">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mb-3"><svc.icon size={18} color="white" /></div>
                  <h3 className="font-bold text-[var(--text-primary)] mb-2">{svc.title}</h3>
                  <p className="text-[var(--text-muted)] text-sm">Enterprise-grade {svc.title.toLowerCase()} by our expert team.</p>
                  <button onClick={() => setServiceForm(svc.title)} className="mt-4 text-xs font-semibold text-indigo-600 flex items-center gap-1">Learn more <ArrowRight size={12} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ─────────────────────────────────────── */}
      <section className="py-20 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4" style={{fontFamily:"serif"}}>Smart Dashboard Preview</h2>
            <p className="text-[var(--text-muted)] text-lg">Everything you need — visible at a glance.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {label:"Filing Status",    icon:FileText,   color:"bg-indigo-500"},
              {label:"Monthly Upload",   icon:TrendingUp, color:"bg-emerald-500"},
              {label:"Due Date Alerts",  icon:Clock,      color:"bg-amber-500"},
              {label:"Acknowledgements", icon:CheckCircle,color:"bg-blue-500"},
              {label:"Payment History",  icon:CreditCard, color:"bg-purple-500"},
              {label:"Chat with CA",     icon:Users,      color:"bg-rose-500"},
            ].map(item => (
              <div key={item.label} className="bg-[var(--bg-surface-2)] rounded-2xl p-5 text-center border border-slate-700 hover:border-indigo-500 transition-all group">
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <item.icon size={20} color="white" />
                </div>
                <p className="text-white text-xs font-semibold">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button onClick={() => navigate("/register")} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl transition-all text-lg">
              Access Your Dashboard →
            </button>
          </div>
        </div>
      </section>

      {/* ── KEY FEATURES ──────────────────────────────────────────── */}
      <section className="py-24 bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4" style={{fontFamily:"serif"}}>Why Choose WhiteCircle TaxEase?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {icon:CheckCircle,title:"100% Digital Workflow",    desc:"Completely paperless — upload, track and download online."},
              {icon:TrendingUp, title:"Auto Document Upload",     desc:"Smart upload system with category and period tagging."},
              {icon:Clock,      title:"Due Date Reminders",       desc:"Email, WhatsApp & SMS alerts before every deadline."},
              {icon:FileText,   title:"Filing History & Proofs",  desc:"All acknowledgements stored and downloadable anytime."},
              {icon:Users,      title:"CA Support",               desc:"Dedicated chartered accountant for every client."},
              {icon:ShieldCheck,title:"Secure Cloud Storage",     desc:"Bank-grade 256-bit encryption for all your documents."},
              {icon:BarChart2,  title:"GSTN-Style Compliance",    desc:"Compliance panel inspired by GSTN and EY dashboards."},
              {icon:Award,      title:"Same-Day Response",        desc:"Our team responds to every query within 24 hours."},
            ].map(f => (
              <div key={f.title} className="flex gap-3 p-5 bg-[var(--bg-surface-2)] rounded-2xl hover:bg-indigo-50 transition-colors">
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <f.icon size={16} color="white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-1">{f.title}</h3>
                  <p className="text-[var(--text-muted)] text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────── */}
      <section className="py-24 bg-[var(--bg-surface-2)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4" style={{fontFamily:"serif"}}>Simple, Transparent Pricing</h2>
            <p className="text-[var(--text-muted)] text-lg">No hidden fees. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PLANS.map(plan => (
              <div key={plan.name} className={`p-8 rounded-3xl border ${plan.highlighted?"border-indigo-600 bg-indigo-600 text-white shadow-xl scale-105":"border-[var(--border-subtle)] bg-[var(--bg-surface)]"}`}>
                {plan.highlighted && <div className="text-xs font-bold bg-[var(--bg-surface)] text-indigo-600 px-3 py-1 rounded-full inline-block mb-4">MOST POPULAR</div>}
                <h3 className={`text-xl font-bold mb-2 ${plan.highlighted?"text-white":"text-[var(--text-primary)]"}`}>{plan.name}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className={`text-4xl font-black ${plan.highlighted?"text-white":"text-[var(--text-primary)]"}`}>{plan.price}</span>
                  <span className={`text-sm mb-1.5 ${plan.highlighted?"text-indigo-200":"text-[var(--text-muted)]"}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-center gap-2.5 text-sm ${plan.highlighted?"text-indigo-100":"text-[var(--text-secondary)]"}`}>
                      <CheckCircle size={14} className={plan.highlighted?"text-white":"text-indigo-500"} />{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setServiceForm(`${plan.name} — Enquiry`)}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${plan.highlighted?"bg-[var(--bg-surface)] text-indigo-600 hover:bg-indigo-50":"bg-indigo-600 text-white hover:bg-indigo-700"}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <section className="py-24 bg-[#0f172a] text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4" style={{fontFamily:"serif"}}>What Our Clients Say</h2>
          <p className="text-[var(--text-muted)] mb-12">Trusted by 50,000+ businesses across India.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-[var(--bg-surface-2)] rounded-2xl p-6 text-left border border-slate-700">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_,j) => <Star key={j} size={14} fill="#f59e0b" className="text-amber-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {t.name.split(" ").map(n=>n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-[var(--bg-surface)]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-12 text-center" style={{fontFamily:"serif"}}>Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq,i) => (
              <div key={i} className="border border-[var(--border-subtle)] rounded-xl overflow-hidden">
                <button onClick={() => setActiveFaq(activeFaq===i?null:i)}
                  className="w-full flex items-center justify-between p-5 text-left bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-2)] transition-colors">
                  <span className="font-semibold text-[var(--text-primary)] text-sm">{faq.q}</span>
                  {activeFaq===i ? <ChevronUp size={16} className="text-indigo-600 flex-shrink-0"/> : <ChevronDown size={16} className="text-[var(--text-muted)] flex-shrink-0"/>}
                </button>
                {activeFaq===i && <div className="px-5 pb-5 text-[var(--text-secondary)] text-sm leading-relaxed border-t border-[var(--border-subtle)] pt-4">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAREERS ───────────────────────────────────────────────── */}
      <section className="py-20 bg-indigo-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4" style={{fontFamily:"serif"}}>Careers at WhiteCircle</h2>
            <p className="text-[var(--text-muted)] text-lg">Join our growing team of tax professionals and technology experts.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {title:"Chartered Accountant", type:"Full Time", location:"Remote / Delhi", desc:"Handle client filings, advisories and compliance for a portfolio of 30+ clients."},
              {title:"React Developer",       type:"Full Time", location:"Remote",         desc:"Build and maintain our client-facing dashboard and internal tools."},
              {title:"Client Success",        type:"Full Time", location:"Delhi / Mumbai", desc:"Onboard new clients, handle queries and ensure satisfaction."},
            ].map(job => (
              <div key={job.title} className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border-subtle)] hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-[var(--text-primary)]">{job.title}</h3>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full font-semibold">{job.type}</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-3">📍 {job.location}</p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{job.desc}</p>
                <button onClick={() => setServiceForm(`Job Application: ${job.title}`)}
                  className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────── */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4" style={{fontFamily:"serif"}}>Ready to simplify your taxes?</h2>
          <p className="text-indigo-200 text-lg mb-10">Join 50,000+ businesses. No setup fee. Cancel anytime.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate("/register")} className="px-10 py-5 bg-[var(--bg-surface)] text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all text-lg hover:scale-105">
              Start for Free Today →
            </button>
            <button onClick={() => setServiceForm("Book Consultation")} className="px-10 py-5 bg-indigo-700 text-white font-bold rounded-2xl hover:bg-indigo-800 transition-all text-lg flex items-center gap-2">
              <Phone size={18} /> Book a Free Consultation
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="bg-[#0f172a] text-[var(--text-muted)] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"><ShieldCheck size={16} color="white" /></div>
                <span className="text-xl font-bold text-white" style={{fontFamily:"serif"}}>TaxEase</span>
              </div>
              <p className="text-sm leading-relaxed mb-4">WhiteCircle Group's tax compliance platform — trusted by 50,000+ businesses since 2020.</p>
              <p className="text-xs">📧 support@whitecircle.in</p>
              <p className="text-xs mt-1">📞 +91 98765 43210</p>
            </div>
            {[
              {title:"Tax Services",    links:["GST Filing","ITR Filing","TDS Filing","Tax Audit","ROC Compliances"]},
              {title:"Business",        links:["Company Registration","LLP Registration","MSME","Trademark","FSSAI"]},
              {title:"Company",         links:["About Us","Careers","Blog","Contact","Partner With Us"]},
              {title:"Legal",           links:["Privacy Policy","Terms of Service","Refund Policy","Disclaimer"]},
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-white font-semibold mb-4 text-sm">{col.title}</h4>
                <ul className="space-y-2">{col.links.map(l=><li key={l}><button className="text-sm hover:text-white transition-colors">{l}</button></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between text-sm">
            <p>© 2025 WhiteCircle Group — TaxEase. All rights reserved.</p>
            <p>Made with ❤️ in India 🇮🇳</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default HomePage;
