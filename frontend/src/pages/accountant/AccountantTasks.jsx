// src/pages/accountant/AccountantTasks.jsx
// Kanban board with Upload Proof modal
import { useState, useRef } from "react";
import { useApi, useMutation } from "../../hooks/useApi";
import { PageHeader, StatusBadge, Spinner, EmptyState } from "../../components/common/UI";
import { ClipboardList, Upload, X, CheckCircle } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const UploadProofModal = ({ task, onClose, onSuccess }) => {
  const [file, setFile]         = useState(null);
  const [ackNumber, setAckNumber] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const handleSubmit = async () => {
    if (!ackNumber.trim()) { toast.error("Acknowledgement number is required"); return; }
    setUploading(true);
    try {
      if (task.filing) {
        await api.put(`/filings/${task.filing}`, {
          status: "Filed", acknowledgementNumber: ackNumber, filedDate: new Date(),
        });
      }
      if (file) {
        const fd = new FormData();
        fd.append("files", file);
        fd.append("category", task.type.includes("GST") ? "GST" : task.type.includes("ITR") ? "ITR" : "TDS");
        fd.append("period", task.period);
        fd.append("notes", `Acknowledgement for ${task.title}`);
        await api.post("/documents/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      await api.put(`/tasks/${task._id}`, { status: "Completed" });
      toast.success("Proof uploaded! Filing marked as Filed.");
      onSuccess(); onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally { setUploading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <h3 className="font-bold text-[var(--text-primary)]">Upload Filing Proof</h3>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-indigo-50 rounded-xl p-3">
            <p className="text-sm font-semibold text-indigo-900">{task.title}</p>
            <p className="text-xs text-indigo-600">{task.client?.name} • {task.period}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Acknowledgement Number <span className="text-red-500">*</span></label>
            <input value={ackNumber} onChange={e => setAckNumber(e.target.value)} placeholder="e.g. ACK20250511001"
              className="w-full px-4 py-2.5 border border-[var(--border-subtle)] rounded-xl text-sm font-mono focus:border-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Upload Proof PDF (optional)</label>
            <div onClick={() => inputRef.current.click()}
              className="border-2 border-dashed border-[var(--border-subtle)] rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-[var(--bg-surface-2)] transition-all">
              <input ref={inputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFile(e.target.files[0])} />
              {file ? (
                <div className="flex items-center justify-center gap-2 text-sm text-indigo-700"><CheckCircle size={16} />{file.name}</div>
              ) : (
                <div><Upload size={20} className="text-[var(--text-muted)] mx-auto mb-2" /><p className="text-sm text-[var(--text-muted)]">Click to upload acknowledgement</p></div>
              )}
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={handleSubmit} disabled={uploading}
            className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 text-sm flex items-center justify-center gap-2">
            {uploading ? "Uploading..." : <><Upload size={14} />Submit Proof</>}
          </button>
          <button onClick={onClose} className="px-5 py-3 bg-[var(--bg-surface-2)] text-[var(--text-secondary)] font-semibold rounded-xl text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const AccountantTasks = () => {
  const { data, loading, refetch } = useApi("/tasks");
  const { mutate: updateTask }     = useMutation("put", "");
  const [proofModal, setProofModal] = useState(null);
  const tasks = data?.tasks || [];

  const handleStatus = async (id, status) => {
    const result = await updateTask({ status }, `/tasks/${id}`);
    if (result.success) { toast.success(`Task marked as ${status}`); refetch(); }
  };

  const columns = [
    { label:"Pending",     status:"Pending",     bg:"bg-amber-50 border-amber-200",    badge:"bg-amber-100 text-amber-800" },
    { label:"In Progress", status:"In Progress", bg:"bg-blue-50 border-blue-200",      badge:"bg-blue-100 text-blue-800" },
    { label:"Completed",   status:"Completed",   bg:"bg-emerald-50 border-emerald-200",badge:"bg-emerald-100 text-emerald-800" },
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="My Tasks" subtitle="Manage assigned filing work" />
      {proofModal && <UploadProofModal task={proofModal} onClose={() => setProofModal(null)} onSuccess={refetch} />}
      {loading ? <div className="flex justify-center py-12"><Spinner /></div>
      : tasks.length === 0 ? <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-8"><EmptyState icon={ClipboardList} title="No tasks assigned" subtitle="Tasks assigned by admin will appear here." /></div>
      : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(col => {
            const items = tasks.filter(t => t.status === col.status);
            return (
              <div key={col.label} className={`${col.bg} border rounded-2xl p-4`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[var(--text-primary)] text-sm">{col.label}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badge}`}>{items.length}</span>
                </div>
                <div className="space-y-3">
                  {items.map(t => (
                    <div key={t._id} className="bg-[var(--bg-surface)] rounded-xl p-4 border border-[var(--border-subtle)] shadow-[var(--shadow-card)]">
                      <p className="text-sm font-bold text-[var(--text-primary)] mb-0.5">{t.title}</p>
                      <p className="text-xs text-[var(--text-muted)] mb-3">{t.client?.name} • {t.period}</p>
                      <div className="flex gap-1.5 mb-3 flex-wrap"><StatusBadge status={t.priority} /></div>
                      <p className="text-xs text-[var(--text-muted)] mb-3">
                        📅 Due: <span className={new Date(t.deadline) < new Date() && t.status !== "Completed" ? "text-red-600 font-semibold" : "text-[var(--text-secondary)]"}>
                          {new Date(t.deadline).toLocaleDateString("en-IN")}
                        </span>
                      </p>
                      <div className="flex flex-col gap-2">
                        {t.status === "Pending" && (
                          <button onClick={() => handleStatus(t._id,"In Progress")}
                            className="w-full text-xs bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-blue-700">Start Working</button>
                        )}
                        {t.status === "In Progress" && (
                          <>
                            <button onClick={() => setProofModal(t)}
                              className="w-full text-xs bg-indigo-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center gap-1.5">
                              <Upload size={12} />Upload Proof & Complete
                            </button>
                            <button onClick={() => handleStatus(t._id,"Completed")}
                              className="w-full text-xs border border-emerald-300 text-emerald-700 px-3 py-2 rounded-lg font-semibold hover:bg-emerald-50">
                              Mark Complete (no proof)
                            </button>
                          </>
                        )}
                        {t.status === "Completed" && (
                          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle size={12} />Completed</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="text-center text-xs text-[var(--text-muted)] py-6 bg-[var(--bg-surface)]/50 rounded-xl border border-dashed border-[var(--border-subtle)]">No tasks here</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default AccountantTasks;
