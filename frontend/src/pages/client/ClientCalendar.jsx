// src/pages/client/ClientCalendar.jsx
// Shows upcoming compliance deadlines with urgency highlighting
// ─────────────────────────────────────────────────────────────────────────────

import { PageHeader, Card } from "../../components/common/UI";
import { AlertTriangle } from "lucide-react";

const DEADLINES = [
  { date: "11", month: "May", event: "GSTR-1 (Apr 2025)",          type: "GST",          urgent: true,  desc: "Upload April sales invoices and outward supply details." },
  { date: "20", month: "May", event: "GSTR-3B (Apr 2025)",         type: "GST",          urgent: true,  desc: "Summary return of inward and outward supplies." },
  { date: "31", month: "May", event: "TDS Return Q4 FY25",         type: "TDS",          urgent: true,  desc: "Prepare TDS certificates and deductee details." },
  { date: "11", month: "Jun", event: "GSTR-1 (May 2025)",          type: "GST",          urgent: false, desc: "Upload May sales invoices." },
  { date: "15", month: "Jun", event: "Advance Tax — 1st Instalment", type: "Income Tax", urgent: false, desc: "15% of estimated annual tax liability due." },
  { date: "20", month: "Jun", event: "GSTR-3B (May 2025)",         type: "GST",          urgent: false, desc: "Summary return for May." },
  { date: "31", month: "Jul", event: "ITR Filing FY 2024-25",      type: "Income Tax",   urgent: false, desc: "File your annual Income Tax Return." },
  { date: "11", month: "Jul", event: "GSTR-1 (Jun 2025)",          type: "GST",          urgent: false, desc: "Upload June sales invoices." },
];

const TYPE_COLORS = {
  GST:          "bg-indigo-50 text-indigo-700",
  TDS:          "bg-amber-50 text-amber-700",
  "Income Tax": "bg-emerald-50 text-emerald-700",
};

const ClientCalendar = () => {
  const urgentCount = DEADLINES.filter(d => d.urgent).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Compliance Calendar" subtitle="Never miss a tax deadline" />

      {/* Urgent alert banner */}
      {urgentCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <span className="font-bold">{urgentCount} deadline{urgentCount > 1 ? "s" : ""}</span> approaching in the next 30 days.
            File early to avoid late fees and penalties.
          </p>
        </div>
      )}

      {/* Deadlines list */}
      <Card>
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">May – July 2025</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {DEADLINES.map((item, i) => (
            <div key={i} className={`flex items-center gap-5 px-5 py-4 ${item.urgent ? "bg-red-50/40" : ""}`}>
              {/* Date block */}
              <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center flex-shrink-0
                ${item.urgent ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-700"}`}>
                <span className="text-xs font-bold uppercase">{item.month}</span>
                <span className="text-3xl font-black leading-none">{item.date}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="text-sm font-bold text-slate-900">{item.event}</p>
                  {item.urgent && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">Urgent</span>
                  )}
                </div>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>

              {/* Type badge */}
              <span className={`text-xs px-3 py-1 rounded-full font-semibold flex-shrink-0 ${TYPE_COLORS[item.type]}`}>
                {item.type}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ClientCalendar;
