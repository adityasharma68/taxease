// src/pages/admin/AdminDashboard.jsx
// Admin overview — platform-wide stats and quick summaries
// ─────────────────────────────────────────────────────────────────────────────

import { Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { StatCard, Card, CardHeader, StatusBadge, Spinner } from "../../components/common/UI";
import { Users, FileText, AlertCircle, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const { data: usersData,   loading: loadUsers   } = useApi("/users",   { role: "client" });
  const { data: filingsData, loading: loadFilings } = useApi("/filings");
  const { data: tasksData,   loading: loadTasks   } = useApi("/tasks");

  const clients = usersData?.users    || [];
  const filings = filingsData?.filings || [];
  const tasks   = tasksData?.tasks    || [];

  const filed      = filings.filter(f => f.status === "Filed").length;
  const inProcess  = filings.filter(f => f.status === "In Process").length;
  const pending    = filings.filter(f => f.status === "Pending").length;
  const overdue    = tasks.filter(t => t.status !== "Completed" && new Date(t.deadline) < new Date()).length;

  return (
    <div className="space-y-6">
      {/* ── Stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Clients"   value={loadUsers   ? "—" : clients.length}  sub="Active accounts"     icon={Users}      color="indigo"  trend={12} />
        <StatCard label="Total Filings"   value={loadFilings ? "—" : filings.length}  sub="All time"            icon={FileText}   color="emerald" />
        <StatCard label="Pending Tasks"   value={loadTasks   ? "—" : tasks.filter(t=>t.status==="Pending").length} sub={`${overdue} overdue`} icon={AlertCircle} color="red" />
        <StatCard label="Filed This Month" value={loadFilings ? "—" : filed}          sub="Successfully submitted" icon={TrendingUp} color="blue" trend={5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent clients */}
        <Card>
          <CardHeader
            title="Recent Clients"
            action={<Link to="/admin/clients" className="text-xs text-indigo-600 font-medium hover:underline">View all →</Link>}
          />
          {loadUsers ? <div className="flex justify-center py-10"><Spinner /></div> : (
            <div className="divide-y divide-slate-50">
              {clients.slice(0, 6).map(c => (
                <div key={c._id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-700">
                      {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.plan} Plan</p>
                    </div>
                  </div>
                  <StatusBadge status={c.isActive ? "Active" : "Inactive"} />
                </div>
              ))}
              {clients.length === 0 && <p className="text-center text-slate-400 text-sm py-6">No clients found.</p>}
            </div>
          )}
        </Card>

        {/* Filing status breakdown */}
        <Card className="p-5">
          <h3 className="font-bold text-slate-900 mb-5">Filing Status Breakdown</h3>
          {loadFilings ? <div className="flex justify-center py-6"><Spinner /></div> : (
            <div className="space-y-4">
              {[
                { label: "Filed",      count: filed,     total: filings.length, color: "bg-emerald-500" },
                { label: "In Process", count: inProcess, total: filings.length, color: "bg-blue-500" },
                { label: "Pending",    count: pending,   total: filings.length, color: "bg-amber-500" },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-slate-700">{s.label}</span>
                    <span className="text-slate-500">{s.count} / {s.total || 1}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`${s.color} h-2 rounded-full transition-all`}
                      style={{ width: `${s.total ? ((s.count / s.total) * 100).toFixed(0) : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Type breakdown */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: "GST",  val: filings.filter(f=>f.type.startsWith("GSTR")).length },
              { label: "ITR",  val: filings.filter(f=>f.type.startsWith("ITR")).length  },
              { label: "TDS",  val: filings.filter(f=>f.type==="TDS Return").length     },
            ].map(t => (
              <div key={t.label} className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="text-xl font-black text-slate-900">{t.val}</div>
                <div className="text-xs text-slate-500 font-medium">{t.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
