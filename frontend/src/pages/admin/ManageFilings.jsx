// src/pages/admin/ManageFilings.jsx
// Admin can create, view and update status of all filings
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useApi, useMutation } from "../../hooks/useApi";
import { Card, StatusBadge, PageHeader, Spinner, EmptyState, Button } from "../../components/common/UI";
import { FileText, Plus } from "lucide-react";
import toast from "react-hot-toast";

const FILING_TYPES = ["GSTR-1","GSTR-3B","GSTR-9","ITR-1","ITR-3","ITR-4","TDS Return","Other"];

const ManageFilings = () => {
  const [showForm, setShowForm] = useState(false);
  const [filter,   setFilter]   = useState("All");
  const [form, setForm] = useState({ client:"", type:"GSTR-1", period:"", dueDate:"", accountant:"" });

  const { data, loading, refetch }           = useApi("/filings");
  const { data: clientsData }                = useApi("/users", { role: "client" });
  const { data: accData }                    = useApi("/users", { role: "accountant" });
  const { mutate: createFiling, loading: creating } = useMutation("post", "/filings");
  const { mutate: updateFiling }             = useMutation("put", "");

  const filings     = data?.filings     || [];
  const clients     = clientsData?.users || [];
  const accountants = accData?.users     || [];

  const filtered = filter === "All" ? filings : filings.filter(f => f.status === filter);

  const handleCreate = async (e) => {
    e.preventDefault();
    const result = await createFiling(form);
    if (result.success) {
      toast.success("Filing created!"); setShowForm(false);
      setForm({ client:"", type:"GSTR-1", period:"", dueDate:"", accountant:"" });
      refetch();
    }
  };

  const handleStatusChange = async (id, status) => {
    const result = await updateFiling({ status }, `/filings/${id}`);
    if (result.success) { toast.success(`Status updated to ${status}`); refetch(); }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="All Filings"
        subtitle={`${filings.length} filings across all clients`}
        action={<Button onClick={() => setShowForm(!showForm)}><Plus size={16} /> New Filing</Button>}
      />

      {/* Create Form */}
      {showForm && (
        <Card className="p-6">
          <h3 className="font-bold text-[var(--text-primary)] mb-4">Create New Filing</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">Client *</label>
              <select value={form.client} onChange={e => setForm(p=>({...p,client:e.target.value}))} required
                className="w-full px-3 py-2 border border-[var(--border-subtle)] rounded-lg text-sm bg-[var(--bg-surface)] focus:border-indigo-500 outline-none">
                <option value="">Select client</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">Filing Type *</label>
              <select value={form.type} onChange={e => setForm(p=>({...p,type:e.target.value}))}
                className="w-full px-3 py-2 border border-[var(--border-subtle)] rounded-lg text-sm bg-[var(--bg-surface)] focus:border-indigo-500 outline-none">
                {FILING_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">Period *</label>
              <input type="text" placeholder="e.g. April 2025 or FY 2024-25" value={form.period}
                onChange={e => setForm(p=>({...p,period:e.target.value}))} required
                className="w-full px-3 py-2 border border-[var(--border-subtle)] rounded-lg text-sm focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">Due Date *</label>
              <input type="date" value={form.dueDate} onChange={e => setForm(p=>({...p,dueDate:e.target.value}))} required
                className="w-full px-3 py-2 border border-[var(--border-subtle)] rounded-lg text-sm focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">Assign Accountant</label>
              <select value={form.accountant} onChange={e => setForm(p=>({...p,accountant:e.target.value}))}
                className="w-full px-3 py-2 border border-[var(--border-subtle)] rounded-lg text-sm bg-[var(--bg-surface)] focus:border-indigo-500 outline-none">
                <option value="">Unassigned</option>
                {accountants.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
            </div>
            <div className="col-span-2 flex gap-3">
              <Button type="submit" disabled={creating}>{creating ? "Creating..." : "Create Filing"}</Button>
              <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {["All","Pending","In Process","Filed"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter===s?"bg-indigo-600 text-white":"bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)]"}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card>
        {loading ? <div className="flex justify-center py-12"><Spinner /></div>
        : filtered.length === 0 ? <EmptyState icon={FileText} title="No filings found" />
        : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--bg-surface-2)]">
                  {["Client","Type","Period","Due Date","Accountant","Status","Update Status"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--divide-color)]">
                {filtered.map(f => (
                  <tr key={f._id} className="hover:bg-[var(--bg-surface-2)] transition-colors">
                    <td className="px-4 py-3.5 text-sm font-semibold text-[var(--text-primary)]">{f.client?.name || "—"}</td>
                    <td className="px-4 py-3.5 text-sm text-[var(--text-secondary)]">{f.type}</td>
                    <td className="px-4 py-3.5 text-sm text-[var(--text-secondary)]">{f.period}</td>
                    <td className="px-4 py-3.5 text-sm text-[var(--text-secondary)] whitespace-nowrap">{new Date(f.dueDate).toLocaleDateString("en-IN")}</td>
                    <td className="px-4 py-3.5 text-sm text-[var(--text-secondary)]">{f.accountant?.name || <span className="text-slate-300">Unassigned</span>}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={f.status} /></td>
                    <td className="px-4 py-3.5">
                      <select value={f.status} onChange={e => handleStatusChange(f._id, e.target.value)}
                        className="text-xs border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 bg-[var(--bg-surface)] focus:border-indigo-500 outline-none">
                        <option>Pending</option>
                        <option>In Process</option>
                        <option>Filed</option>
                        <option>Rejected</option>
                      </select>
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

export default ManageFilings;
