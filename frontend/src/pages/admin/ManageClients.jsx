// src/pages/admin/ManageClients.jsx
// Admin can view, search, add and assign accountants to clients
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useApi, useMutation } from "../../hooks/useApi";
import { Card, StatusBadge, PageHeader, Spinner, EmptyState, Button } from "../../components/common/UI";
import { Users, Plus, Eye } from "lucide-react";
import toast from "react-hot-toast";

const ManageClients = () => {
  const [search,   setSearch]   = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newUser,  setNewUser]  = useState({ name: "", email: "", password: "demo123", phone: "", pan: "", gstin: "", plan: "Basic", role: "client" });

  const { data, loading, refetch }     = useApi("/users", { role: "client" });
  const { data: accData }               = useApi("/users", { role: "accountant" });
  const { mutate: createUser, loading: creating } = useMutation("post", "/auth/register");
  const { mutate: assignAcc }           = useMutation("put", "");

  const clients     = data?.users     || [];
  const accountants = accData?.users  || [];

  // Client-side search filter
  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.gstin || "").toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    const result = await createUser(newUser);
    if (result.success) {
      toast.success("Client account created!");
      setShowForm(false);
      setNewUser({ name:"",email:"",password:"demo123",phone:"",pan:"",gstin:"",plan:"Basic",role:"client" });
      refetch();
    }
  };

  const handleAssign = async (clientId, accountantId) => {
    const result = await assignAcc({ accountantId }, `/users/${clientId}/assign`);
    if (result.success) { toast.success("Accountant assigned!"); refetch(); }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Manage Clients"
        subtitle={`${clients.length} registered clients`}
        action={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus size={16} /> Add Client
          </Button>
        }
      />

      {/* ── Add Client Form ──────────────────────────────────────── */}
      {showForm && (
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-4">Add New Client</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            {[
              ["Full Name",     "name",     "text",  "Rahul Sharma"],
              ["Email",         "email",    "email", "rahul@email.com"],
              ["Phone",         "phone",    "tel",   "9876543210"],
              ["PAN",           "pan",      "text",  "ABCDE1234F"],
              ["GSTIN",         "gstin",    "text",  "27ABCDE1234F1Z5"],
            ].map(([label, name, type, ph]) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
                <input type={type} placeholder={ph} value={newUser[name]}
                  onChange={e => setNewUser(p => ({ ...p, [name]: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 outline-none" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Plan</label>
              <select value={newUser.plan} onChange={e => setNewUser(p => ({ ...p, plan: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:border-indigo-500 outline-none">
                <option>Basic</option><option>Pro</option><option>Enterprise</option>
              </select>
            </div>
            <div className="col-span-2 flex gap-3">
              <Button type="submit" disabled={creating}>{creating ? "Creating..." : "Create Client"}</Button>
              <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* ── Search ──────────────────────────────────────────────── */}
      <input
        value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search by name, email or GSTIN..."
        className="w-full max-w-sm px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 outline-none"
      />

      {/* ── Table ───────────────────────────────────────────────── */}
      <Card>
        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} title="No clients found" subtitle="Add a client or adjust your search." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left">
                  {["Client","GSTIN","Plan","Status","Assigned CA","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(c => (
                  <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-700">
                          {c.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                          <p className="text-xs text-slate-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-600">{c.gstin || "—"}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={c.plan} /></td>
                    <td className="px-4 py-3.5"><StatusBadge status={c.isActive ? "Active" : "Inactive"} /></td>
                    <td className="px-4 py-3.5">
                      <select
                        defaultValue={c.assignedAccountant?._id || ""}
                        onChange={e => handleAssign(c._id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:border-indigo-500 outline-none"
                      >
                        <option value="">Unassigned</option>
                        {accountants.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3.5">
                      <button className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1">
                        <Eye size={12} /> View
                      </button>
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

export default ManageClients;
