// src/pages/admin/AdminReminders.jsx
// Admin can view, toggle, and manually trigger compliance reminders
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { Card, CardHeader, PageHeader, Spinner, StatusBadge } from "../../components/common/UI";
import { Bell, Mail, MessageCircle, Phone, Send, CheckCircle, Settings } from "lucide-react";
import toast from "react-hot-toast";

// Static reminder schedule (in production save to DB)
const REMINDER_SCHEDULE = [
  { id:1, event:"GSTR-1",     dueDay:"11th",  channels:["email","whatsapp"], active:true,  daysBefore:3 },
  { id:2, event:"GSTR-3B",    dueDay:"20th",  channels:["email","sms"],      active:true,  daysBefore:3 },
  { id:3, event:"TDS Return", dueDay:"31 May", channels:["email"],           active:true,  daysBefore:7 },
  { id:4, event:"ITR Filing", dueDay:"31 Jul", channels:["email","whatsapp"],active:false, daysBefore:14 },
  { id:5, event:"Advance Tax",dueDay:"15 Jun", channels:["email"],           active:true,  daysBefore:5 },
];

const CHANNEL_ICONS = {
  email:     { icon:Mail,           label:"Email",     color:"bg-blue-100 text-blue-700" },
  whatsapp:  { icon:MessageCircle,  label:"WhatsApp",  color:"bg-emerald-100 text-emerald-700" },
  sms:       { icon:Phone,          label:"SMS",       color:"bg-purple-100 text-purple-700" },
};

const AdminReminders = () => {
  const [schedule, setSchedule] = useState(REMINDER_SCHEDULE);
  const [sending,  setSending]  = useState(null);

  // Global toggle for each channel
  const [globalSettings, setGlobalSettings] = useState({
    email:    true,
    whatsapp: true,
    sms:      false,
  });

  const { data: clientsData, loading } = useApi("/users", { role:"client" });
  const clients = clientsData?.users || [];

  // Toggle a reminder on/off
  const toggleReminder = (id) => {
    setSchedule(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    const r = schedule.find(x => x.id === id);
    toast.success(`${r.event} reminder ${r.active ? "disabled" : "enabled"}`);
  };

  // Simulate sending a manual reminder blast
  const sendManualReminder = async (eventName) => {
    setSending(eventName);
    await new Promise(r => setTimeout(r, 1800));
    setSending(null);
    toast.success(`Reminders sent to ${clients.length} clients for ${eventName}!`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reminder Control" subtitle="Manage automated compliance reminders for all clients" />

      {/* ── Stats Row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3"><Mail size={18} className="text-blue-600"/></div>
          <div className="text-2xl font-bold text-slate-900">{clients.length}</div>
          <div className="text-sm text-slate-600">Email Subscribers</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-3"><MessageCircle size={18} className="text-emerald-600"/></div>
          <div className="text-2xl font-bold text-slate-900">{Math.floor(clients.length * 0.7)}</div>
          <div className="text-sm text-slate-600">WhatsApp Opted-in</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-3"><Phone size={18} className="text-purple-600"/></div>
          <div className="text-2xl font-bold text-slate-900">{Math.floor(clients.length * 0.4)}</div>
          <div className="text-sm text-slate-600">SMS Opted-in</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-3"><Bell size={18} className="text-indigo-600"/></div>
          <div className="text-2xl font-bold text-slate-900">{schedule.filter(r=>r.active).length}</div>
          <div className="text-sm text-slate-600">Active Reminders</div>
        </div>
      </div>

      {/* ── Global Channel Settings ────────────────────────────────── */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Settings size={18} className="text-slate-600" />
          <h3 className="font-bold text-slate-900">Global Channel Settings</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          {Object.entries(globalSettings).map(([channel, enabled]) => {
            const cfg = CHANNEL_ICONS[channel];
            return (
              <div key={channel} className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all cursor-pointer
                ${enabled ? "border-indigo-300 bg-indigo-50" : "border-slate-200 bg-slate-50"}`}
                onClick={() => {
                  setGlobalSettings(p => ({ ...p, [channel]: !p[channel] }));
                  toast.success(`${cfg.label} reminders ${enabled ? "disabled" : "enabled"} globally`);
                }}>
                <div className={`w-8 h-8 ${cfg.color} rounded-lg flex items-center justify-center`}>
                  <cfg.icon size={15} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{cfg.label}</p>
                  <p className="text-xs text-slate-500">{enabled ? "Enabled" : "Disabled"}</p>
                </div>
                {/* Toggle switch */}
                <div className={`w-10 h-5 rounded-full transition-colors ml-2 relative ${enabled ? "bg-indigo-600" : "bg-slate-300"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Reminder Schedule ──────────────────────────────────────── */}
      <Card>
        <CardHeader title="Reminder Schedule" action={
          <span className="text-xs text-slate-400">Auto-sent {schedule.filter(r=>r.active).length} days before each deadline</span>
        } />
        <div className="divide-y divide-slate-50">
          {schedule.map(r => (
            <div key={r.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${r.active ? "bg-indigo-50" : "bg-slate-100"}`}>
                  <Bell size={18} className={r.active ? "text-indigo-600" : "text-slate-400"} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{r.event}</p>
                  <p className="text-xs text-slate-400">Due: {r.dueDay} • Send {r.daysBefore} days before</p>
                  <div className="flex gap-1.5 mt-1.5">
                    {r.channels.map(ch => {
                      const cfg = CHANNEL_ICONS[ch];
                      return (
                        <span key={ch} className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Active toggle */}
                <button onClick={() => toggleReminder(r.id)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${r.active ? "bg-indigo-600" : "bg-slate-300"}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${r.active ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
                {/* Manual send */}
                <button
                  onClick={() => sendManualReminder(r.event)}
                  disabled={sending === r.event || !r.active}
                  className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700 px-3 py-2 rounded-lg font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {sending === r.event
                    ? <><Spinner size={12} className="border-t-indigo-600" />Sending...</>
                    : <><Send size={12} />Send Now</>
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Recent Reminder Log ────────────────────────────────────── */}
      <Card className="p-6">
        <h3 className="font-bold text-slate-900 mb-4">Recent Reminder Log</h3>
        <div className="space-y-3">
          {[
            { msg:"GSTR-1 reminder sent to 47 clients",  time:"Today, 9:00 AM",  type:"email" },
            { msg:"GSTR-3B WhatsApp blast — 31 clients", time:"Yesterday, 9:00 AM",type:"whatsapp" },
            { msg:"TDS Return email — 52 clients",       time:"2 days ago",       type:"email" },
            { msg:"ITR reminder email — 47 clients",     time:"3 days ago",       type:"email" },
          ].map((log, i) => {
            const cfg = CHANNEL_ICONS[log.type];
            return (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className={`w-7 h-7 ${cfg.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <cfg.icon size={13} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800 font-medium">{log.msg}</p>
                  <p className="text-xs text-slate-400">{log.time}</p>
                </div>
                <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
export default AdminReminders;
