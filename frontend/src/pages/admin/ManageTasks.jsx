// src/pages/admin/ManageTasks.jsx
// Admin creates tasks and assigns them to accountants
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useApi, useMutation } from "../../hooks/useApi";
import { Card, StatusBadge, PageHeader, Spinner, EmptyState, Button } from "../../components/common/UI";
import { ClipboardList, Plus } from "lucide-react";
import toast from "react-hot-toast";

const ManageTasks = () => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ client:"", accountant:"", title:"", type:"GST Filing", period:"", priority:"Medium", deadline:"", description:"" });

  const { data, loading, refetch }          = useApi("/tasks");
  const { data: clientsData }               = useApi("/users", { role: "client" });
  const { data: accData }                   = useApi("/users", { role: "accountant" });
  const { mutate: createTask, loading: creating } = useMutation("post", "/tasks");
  const { mutate: updateTask }              = useMutation("put", "");

  const tasks       = data?.tasks        || [];
  const clients     = clientsData?.users || [];
  const accountants = accData?.users     || [];

  const handleCreate = async (e) => {
    e.preventDefault();
    const result = await createTask(form);
    if (result.success) {
      toast.success("Task assigned!"); setShowForm(false);
      setForm({ client:"",accountant:"",title:"",type:"GST Filing",period:"",priority:"Medium",deadline:"",description:"" });
      refetch();
    }
  };

  const handleStatusChange = async (id, status) => {
    const result = await updateTask({ status }, `/tasks/${id}`);
    if (result.success) { toast.success(`Task marked ${status}`); refetch(); }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Assign Tasks" subtitle="Delegate filing work to accountants"
        action={<Button onClick={() => setShowForm(!showForm)}><Plus size={16}/> New Task</Button>} />

      {showForm && (
        <Card className="p-6">
          <h3 className="font-bold text-[var(--text-primary)] mb-4">Create & Assign Task</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">Client *</label>
              <select value={form.client} onChange={e=>setForm(p=>({...p,client:e.target.value}))} required
                className="w-full px-3 py-2 border border-[var(--border-subtle)] rounded-lg text-sm bg-[var(--bg-surface)] focus:border-indigo-500 outline-none">
                <option value="">Select client</option>
                {clients.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">Assign To</label>
              <select value={form.accountant} onChange={e=>setForm(p=>({...p,accountant:e.target.value}))}
                className="w-full px-3 py-2 border border-[var(--border-subtle)] rounded-lg text-sm bg-[var(--bg-surface)] focus:border-indigo-500 outline-none">
                <option value="">Select accountant</option>
                {accountants.map(a=><option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">Task Title *</label>
              <input type="text" placeholder="e.g. File GSTR-1 for April 2025" value={form.title}
                onChange={e=>setForm(p=>({...p,title:e.target.value}))} required
                className="w-full px-3 py-2 border border-[var(--border-subtle)] rounded-lg text-sm focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">Type *</label>
              <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}
                className="w-full px-3 py-2 border border-[var(--border-subtle)] rounded-lg text-sm bg-[var(--bg-surface)] focus:border-indigo-500 outline-none">
                {["GST Filing","ITR Filing","TDS Return","Business Registration","Other"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">Period *</label>
              <input type="text" placeholder="e.g. April 2025 or Q4 FY25" value={form.period}
                onChange={e=>setForm(p=>({...p,period:e.target.value}))} required
                className="w-full px-3 py-2 border border-[var(--border-subtle)] rounded-lg text-sm focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">Priority</label>
              <select value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))}
                className="w-full px-3 py-2 border border-[var(--border-subtle)] rounded-lg text-sm bg-[var(--bg-surface)] focus:border-indigo-500 outline-none">
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">Deadline *</label>
              <input type="date" value={form.deadline} onChange={e=>setForm(p=>({...p,deadline:e.target.value}))} required
                className="w-full px-3 py-2 border border-[var(--border-subtle)] rounded-lg text-sm focus:border-indigo-500 outline-none" />
            </div>
            <div className="col-span-2 flex gap-3">
              <Button type="submit" disabled={creating}>{creating?"Creating...":"Create Task"}</Button>
              <Button variant="secondary" type="button" onClick={()=>setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Kanban-style board */}
      {loading ? <div className="flex justify-center py-12"><Spinner /></div>
      : tasks.length === 0 ? <Card><EmptyState icon={ClipboardList} title="No tasks yet" subtitle="Create a task and assign it to an accountant." /></Card>
      : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label:"Pending",     items: tasks.filter(t=>t.status==="Pending"),     bg:"bg-amber-50 border-amber-200" },
            { label:"In Progress", items: tasks.filter(t=>t.status==="In Progress"), bg:"bg-blue-50 border-blue-200" },
            { label:"Completed",   items: tasks.filter(t=>t.status==="Completed"),   bg:"bg-emerald-50 border-emerald-200" },
          ].map(col => (
            <div key={col.label} className={`${col.bg} border rounded-2xl p-4`}>
              <h3 className="font-bold text-[var(--text-primary)] mb-3 text-sm">{col.label} ({col.items.length})</h3>
              <div className="space-y-3">
                {col.items.map(t => (
                  <div key={t._id} className="bg-[var(--bg-surface)] rounded-xl p-3.5 border border-[var(--border-subtle)] shadow-[var(--shadow-card)]">
                    <p className="text-sm font-bold text-[var(--text-primary)] mb-0.5">{t.title}</p>
                    <p className="text-xs text-[var(--text-muted)] mb-2">{t.client?.name} • {t.period}</p>
                    <div className="flex items-center justify-between">
                      <StatusBadge status={t.priority} />
                      <div className="flex gap-1.5">
                        {t.status === "Pending" && (
                          <button onClick={()=>handleStatusChange(t._id,"In Progress")} className="text-xs text-blue-600 font-semibold hover:underline">Start</button>
                        )}
                        {t.status === "In Progress" && (
                          <button onClick={()=>handleStatusChange(t._id,"Completed")} className="text-xs text-emerald-600 font-semibold hover:underline">Complete</button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-2">Due: {new Date(t.deadline).toLocaleDateString("en-IN")}</p>
                    {t.accountant && <p className="text-xs text-indigo-600 mt-1">→ {t.accountant.name}</p>}
                  </div>
                ))}
                {col.items.length === 0 && <p className="text-center text-xs text-[var(--text-muted)] py-4">No tasks</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTasks;
