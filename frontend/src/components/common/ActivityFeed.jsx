// src/components/common/ActivityFeed.jsx
// Shows recent activity timeline for the client dashboard
// ─────────────────────────────────────────────────────────────────────────────

import { useApi } from "../../hooks/useApi";
import { Spinner } from "./UI";
import { FileText, Upload, CheckCircle, MessageCircle, CreditCard, Clock } from "lucide-react";

// Map event types to icon + colour
const EVENT_CONFIG = {
  filing_filed:    { icon:CheckCircle,    color:"bg-emerald-100 text-emerald-600", label:"Filing Completed" },
  filing_pending:  { icon:Clock,          color:"bg-amber-100 text-amber-600",     label:"Filing Pending" },
  doc_uploaded:    { icon:Upload,         color:"bg-blue-100 text-blue-600",       label:"Document Uploaded" },
  doc_verified:    { icon:FileText,       color:"bg-indigo-100 text-indigo-600",   label:"Document Verified" },
  payment_paid:    { icon:CreditCard,     color:"bg-purple-100 text-purple-600",   label:"Payment Received" },
  message_received:{ icon:MessageCircle, color:"bg-rose-100 text-rose-600",        label:"New Message" },
};

const ActivityFeed = () => {
  const { data: filingsData, loading: lf } = useApi("/filings");
  const { data: docsData,    loading: ld } = useApi("/documents");

  const filings = filingsData?.filings || [];
  const docs    = docsData?.documents  || [];

  // Build unified activity list from real data
  const activities = [
    ...filings.map(f => ({
      id:    `filing-${f._id}`,
      type:  f.status === "Filed" ? "filing_filed" : "filing_pending",
      title: `${f.type} — ${f.period}`,
      desc:  f.status === "Filed"
               ? `Acknowledgement: ${f.acknowledgementNumber || "Pending"}`
               : `Due: ${new Date(f.dueDate).toLocaleDateString("en-IN")}`,
      time:  f.updatedAt || f.createdAt,
    })),
    ...docs.map(d => ({
      id:    `doc-${d._id}`,
      type:  d.status === "Verified" ? "doc_verified" : "doc_uploaded",
      title: d.name,
      desc:  `${d.category} • ${d.period} • ${d.size}`,
      time:  d.createdAt,
    })),
  ]
  .sort((a, b) => new Date(b.time) - new Date(a.time))
  .slice(0, 8); // Show last 8 activities

  if (lf || ld) return <div className="flex justify-center py-6"><Spinner /></div>;

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-muted)]">
        <Clock size={28} className="mx-auto mb-2 opacity-40" />
        <p className="text-sm">No recent activity yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activities.map((act, i) => {
        const cfg = EVENT_CONFIG[act.type] || EVENT_CONFIG["doc_uploaded"];
        return (
          <div key={act.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--bg-surface-2)] transition-colors">
            {/* Icon + vertical line */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 ${cfg.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <cfg.icon size={14} />
              </div>
              {i < activities.length - 1 && (
                <div className="w-px h-4 bg-[var(--bg-hover)] mt-1" />
              )}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{act.title}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">{act.desc}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {new Date(act.time).toLocaleDateString("en-IN", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ActivityFeed;
