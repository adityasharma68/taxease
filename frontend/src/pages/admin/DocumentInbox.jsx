// src/pages/admin/DocumentInbox.jsx
// Admin inbox — all recent client document uploads sorted by date
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useApi, useMutation } from "../../hooks/useApi";
import { Card, StatusBadge, PageHeader, Spinner, EmptyState } from "../../components/common/UI";
import { Inbox, FileText, Download, CheckCircle, XCircle, Filter } from "lucide-react";
import toast from "react-hot-toast";

const DocumentInbox = () => {
  const [filter, setFilter] = useState("All");
  const { data, loading, refetch } = useApi("/documents");
  const { mutate: updateStatus }   = useMutation("put", "");

  const docs = data?.documents || [];
  const filtered = filter === "All" ? docs : docs.filter(d => d.status === filter);

  // Counts for badge
  const pendingCount  = docs.filter(d => d.status === "Pending").length;
  const verifiedCount = docs.filter(d => d.status === "Verified").length;
  const rejectedCount = docs.filter(d => d.status === "Rejected").length;

  const handleStatus = async (id, status) => {
    const result = await updateStatus({ status }, `/documents/${id}/status`);
    if (result.success) {
      toast.success(`Document marked as ${status}`);
      refetch();
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Document Inbox"
        subtitle="All client-uploaded documents — review and verify"
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5">
              <Inbox size={12} /> {pendingCount} pending review
            </span>
          </div>
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label:"All",      count:docs.length },
          { label:"Pending",  count:pendingCount },
          { label:"Verified", count:verifiedCount },
          { label:"Rejected", count:rejectedCount },
        ].map(({ label, count }) => (
          <button key={label} onClick={() => setFilter(label)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5
              ${filter === label ? "bg-indigo-600 text-white" : "bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)]"}`}>
            {label}
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${filter === label ? "bg-indigo-500" : "bg-[var(--bg-surface-2)] text-[var(--text-muted)]"}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Documents table */}
      <Card>
        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Inbox} title="No documents found" subtitle="Client-uploaded documents will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--bg-surface-2)]">
                  {["Document","Client","Category","Period","Size","Uploaded","Status","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--divide-color)]">
                {filtered.map(doc => (
                  <tr key={doc._id} className={`hover:bg-[var(--bg-surface-2)] transition-colors ${doc.status === "Pending" ? "bg-amber-50/20" : ""}`}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-[var(--bg-surface-2)] rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText size={13} className="text-[var(--text-muted)]" />
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)] max-w-[130px] truncate">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{doc.client?.name || "—"}</p>
                        <p className="text-xs text-[var(--text-muted)]">{doc.client?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                        ${doc.category === "GST" ? "bg-indigo-100 text-indigo-800"
                        : doc.category === "ITR" ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"}`}>
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[var(--text-secondary)] whitespace-nowrap">{doc.period}</td>
                    <td className="px-4 py-3.5 text-sm text-[var(--text-muted)]">{doc.size}</td>
                    <td className="px-4 py-3.5 text-sm text-[var(--text-muted)] whitespace-nowrap">
                      {new Date(doc.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={doc.status} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer"
                          className="text-[var(--text-muted)] hover:text-indigo-600 transition-colors" title="Download">
                          <Download size={14} />
                        </a>
                        {doc.status === "Pending" && (
                          <>
                            <button onClick={() => handleStatus(doc._id, "Verified")}
                              className="text-emerald-500 hover:text-emerald-700" title="Verify">
                              <CheckCircle size={16} />
                            </button>
                            <button onClick={() => handleStatus(doc._id, "Rejected")}
                              className="text-red-400 hover:text-red-600" title="Reject">
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
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
export default DocumentInbox;
