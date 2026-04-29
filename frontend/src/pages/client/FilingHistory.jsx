// src/pages/client/FilingHistory.jsx
// Shows all tax filings for the logged-in client with filter tabs
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { Card, StatusBadge, PageHeader, Spinner, EmptyState } from "../../components/common/UI";
import { FileText, Download } from "lucide-react";

const FILTERS = ["All", "Filed", "In Process", "Pending"];

const FilingHistory = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const { data, loading } = useApi("/filings");
  const filings = data?.filings || [];

  // Apply selected status filter
  const filtered = activeFilter === "All"
    ? filings
    : filings.filter(f => f.status === activeFilter);

  return (
    <div className="space-y-4">
      <PageHeader title="Filing History" subtitle="All your tax filings in one place" />

      <Card>
        {/* ── Filter Tabs ──────────────────────────────────────────── */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all
                ${activeFilter === f ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {f}
              {/* Show count badge */}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${activeFilter === f ? "bg-indigo-500" : "bg-slate-200"}`}>
                {f === "All" ? filings.length : filings.filter(x => x.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {/* ── Table ────────────────────────────────────────────────── */}
        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={FileText} title="No filings found" subtitle="No filings match the selected filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left">
                  {["Type", "Period", "Due Date", "Filed Date", "Status", "Acknowledgement"].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(f => (
                  <tr key={f._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText size={13} className="text-indigo-600" />
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{f.type}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{f.period}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                      {new Date(f.dueDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                      {f.filedDate ? new Date(f.filedDate).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={f.status} /></td>
                    <td className="px-5 py-3.5">
                      {f.acknowledgementNumber ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-600">{f.acknowledgementNumber}</span>
                          {f.acknowledgementUrl && (
                            <a href={f.acknowledgementUrl} target="_blank" rel="noreferrer"
                              className="text-indigo-500 hover:text-indigo-700 flex items-center gap-1 text-xs font-medium">
                              <Download size={12} /> Download
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FilingHistory;
