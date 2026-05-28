// src/pages/accountant/ClientDocuments.jsx
// Accountant reviews and verifies documents uploaded by clients
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useApi, useMutation } from "../../hooks/useApi";
import { Card, StatusBadge, PageHeader, Spinner, EmptyState } from "../../components/common/UI";
import { FileText, Download, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const ClientDocuments = () => {
  const [categoryFilter, setCategoryFilter] = useState("All");

  const { data, loading, refetch }     = useApi("/documents");
  const { mutate: updateStatus }       = useMutation("put", "");

  const docs = data?.documents || [];
  const filtered = categoryFilter === "All" ? docs : docs.filter(d => d.category === categoryFilter);

  const handleVerify = async (id, status) => {
    const result = await updateStatus({ status }, `/documents/${id}/status`);
    if (result.success) { toast.success(`Document marked as ${status}`); refetch(); }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Client Documents" subtitle="Review and verify uploaded files" />

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {["All", "GST", "ITR", "TDS", "Business Registration", "Other"].map(cat => (
          <button key={cat} onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${categoryFilter === cat ? "bg-indigo-600 text-white" : "bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)]"}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Documents table */}
      <Card>
        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={FileText} title="No documents found" subtitle="Documents uploaded by clients will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--bg-surface-2)]">
                  {["Document", "Client", "Category", "Period", "Size", "Uploaded", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--divide-color)]">
                {filtered.map(doc => (
                  <tr key={doc._id} className="hover:bg-[var(--bg-surface-2)] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-[var(--bg-surface-2)] rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText size={13} className="text-[var(--text-muted)]" />
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)] max-w-[140px] truncate">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[var(--text-secondary)]">{doc.client?.name || "—"}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${doc.category === "GST" ? "bg-indigo-100 text-indigo-800" : doc.category === "ITR" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
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
                            <button onClick={() => handleVerify(doc._id, "Verified")}
                              className="text-emerald-500 hover:text-emerald-700 transition-colors" title="Verify">
                              <CheckCircle size={16} />
                            </button>
                            <button onClick={() => handleVerify(doc._id, "Rejected")}
                              className="text-red-400 hover:text-red-600 transition-colors" title="Reject">
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

export default ClientDocuments;
