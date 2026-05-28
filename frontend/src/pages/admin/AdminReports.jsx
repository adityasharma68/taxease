// src/pages/admin/AdminReports.jsx
// Full analytics: filing stats, delay reports, clients without uploads, plan distribution
import { useApi } from "../../hooks/useApi";
import { StatCard, Card, PageHeader, Spinner } from "../../components/common/UI";
import { BarChart2, TrendingUp, Users, AlertTriangle, FileText, Clock } from "lucide-react";

const MONTHLY = [
  { month:"Oct", count:42 }, { month:"Nov", count:55 }, { month:"Dec", count:48 },
  { month:"Jan", count:61 }, { month:"Feb", count:58 }, { month:"Mar", count:73 },
  { month:"Apr", count:89 },
];
const MAX = Math.max(...MONTHLY.map(m => m.count));

const AdminReports = () => {
  const { data: filingsData, loading: loadFilings } = useApi("/filings");
  const { data: clientsData, loading: loadClients } = useApi("/users", { role:"client" });
  const { data: tasksData,   loading: loadTasks   } = useApi("/tasks");
  const { data: docsData                          } = useApi("/documents");

  const filings = filingsData?.filings || [];
  const clients = clientsData?.users   || [];
  const tasks   = tasksData?.tasks     || [];
  const docs    = docsData?.documents  || [];

  const gstCount   = filings.filter(f => f.type.startsWith("GSTR")).length;
  const itrCount   = filings.filter(f => f.type.startsWith("ITR")).length;
  const tdsCount   = filings.filter(f => f.type === "TDS Return").length;
  const otherCount = filings.length - gstCount - itrCount - tdsCount;

  const filed     = filings.filter(f => f.status === "Filed").length;
  const pending   = filings.filter(f => f.status === "Pending").length;
  const inProcess = filings.filter(f => f.status === "In Process").length;

  // Clients who have NEVER uploaded a document
  const clientsWithDocs = [...new Set(docs.map(d => d.client?._id || d.client))];
  const clientsWithoutUploads = clients.filter(c => !clientsWithDocs.includes(c._id));

  // Overdue tasks (deadline passed, not completed)
  const overdueTasks = tasks.filter(t => t.status !== "Completed" && new Date(t.deadline) < new Date());

  // Pending filings past due date
  const overdueFilings = filings.filter(f => f.status !== "Filed" && new Date(f.dueDate) < new Date());

  const planCounts = {
    Basic:      clients.filter(c => c.plan === "Basic").length,
    Pro:        clients.filter(c => c.plan === "Pro").length,
    Enterprise: clients.filter(c => c.plan === "Enterprise").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Analytics" subtitle="Platform performance at a glance" />

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Filings"   value={loadFilings ? "—" : filings.length}     sub="All time"           icon={BarChart2}     color="indigo" />
        <StatCard label="Total Clients"   value={loadClients ? "—" : clients.length}     sub="Registered"         icon={Users}         color="emerald" />
        <StatCard label="Overdue Filings" value={loadFilings ? "—" : overdueFilings.length} sub="Past due date"   icon={AlertTriangle} color="red" />
        <StatCard label="Filed Rate"      value={loadFilings ? "—" : `${filings.length ? Math.round((filed/filings.length)*100) : 0}%`} sub="Success rate" icon={TrendingUp} color="blue" />
      </div>

      {/* ── Monthly bar chart ──────────────────────────────────────── */}
      <Card className="p-6">
        <h3 className="font-bold text-[var(--text-primary)] mb-6">Monthly Filings (FY 2025-26)</h3>
        <div className="flex items-end gap-3 h-48">
          {MONTHLY.map(({ month, count }) => (
            <div key={month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-semibold text-[var(--text-secondary)]">{count}</span>
              <div className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-t-lg transition-all cursor-pointer"
                style={{ height:`${(count/MAX)*160}px` }} title={`${month}: ${count} filings`} />
              <span className="text-xs text-[var(--text-muted)] font-medium">{month}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Filing status breakdown */}
        <Card className="p-6">
          <h3 className="font-bold text-[var(--text-primary)] mb-4">Filing Status Breakdown</h3>
          {loadFilings ? <Spinner className="mx-auto" /> : (
            <div className="space-y-3">
              {[
                { label:"Filed",      count:filed,     color:"bg-emerald-500" },
                { label:"In Process", count:inProcess, color:"bg-blue-500" },
                { label:"Pending",    count:pending,   color:"bg-amber-500" },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-[var(--text-secondary)]">{s.label}</span>
                    <span className="text-[var(--text-muted)]">{s.count} / {filings.length || 1}</span>
                  </div>
                  <div className="w-full bg-[var(--bg-surface-2)] rounded-full h-2">
                    <div className={`${s.color} h-2 rounded-full`}
                      style={{ width:`${filings.length ? ((s.count/filings.length)*100).toFixed(0) : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Mini type cards */}
          <div className="mt-6 grid grid-cols-4 gap-2">
            {[{label:"GST",val:gstCount},{label:"ITR",val:itrCount},{label:"TDS",val:tdsCount},{label:"Other",val:otherCount}].map(t => (
              <div key={t.label} className="bg-[var(--bg-surface-2)] rounded-xl p-2.5 text-center">
                <div className="text-lg font-black text-[var(--text-primary)]">{t.val}</div>
                <div className="text-xs text-[var(--text-muted)]">{t.label}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Plan distribution */}
        <Card className="p-6">
          <h3 className="font-bold text-[var(--text-primary)] mb-4">Client Plan Distribution</h3>
          {loadClients ? <Spinner className="mx-auto" /> : (
            <div className="space-y-4">
              {[
                { plan:"Enterprise", color:"bg-purple-500", text:"text-purple-700" },
                { plan:"Pro",        color:"bg-indigo-500", text:"text-indigo-700" },
                { plan:"Basic",      color:"bg-[var(--text-muted)]",  text:"text-[var(--text-secondary)]"  },
              ].map(({ plan, color, text }) => (
                <div key={plan} className="flex items-center gap-4">
                  <div className={`w-3 h-3 ${color} rounded-full flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm font-semibold ${text}`}>{plan}</span>
                      <span className="text-sm text-[var(--text-muted)]">{planCounts[plan]} clients</span>
                    </div>
                    <div className="w-full bg-[var(--bg-surface-2)] rounded-full h-1.5">
                      <div className={`${color} h-1.5 rounded-full`}
                        style={{ width:`${clients.length ? (planCounts[plan]/clients.length*100).toFixed(0) : 0}%` }} />
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] text-center">
                <span className="text-3xl font-black text-[var(--text-primary)]">{clients.length}</span>
                <span className="text-sm text-[var(--text-muted)] ml-2">Total Clients</span>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ── Delay Report ──────────────────────────────────────────── */}
      <Card>
        <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-500" />
          <h3 className="font-bold text-[var(--text-primary)]">Delay Report — Overdue Filings</h3>
          <span className="ml-auto text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-semibold">{overdueFilings.length} overdue</span>
        </div>
        {loadFilings ? <div className="flex justify-center py-8"><Spinner /></div>
        : overdueFilings.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-[var(--text-muted)]">
            <FileText size={32} className="mb-2 opacity-40" />
            <p className="text-sm font-medium">No overdue filings 🎉</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-50">
                  {["Client","Filing Type","Period","Due Date","Days Overdue","Status"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-red-700 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--divide-color)]">
                {overdueFilings.map(f => {
                  const daysOver = Math.floor((new Date() - new Date(f.dueDate)) / (1000*60*60*24));
                  return (
                    <tr key={f._id} className="hover:bg-red-50/30">
                      <td className="px-4 py-3 text-sm font-semibold text-[var(--text-primary)]">{f.client?.name || "—"}</td>
                      <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{f.type}</td>
                      <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{f.period}</td>
                      <td className="px-4 py-3 text-sm text-red-600 font-medium">{new Date(f.dueDate).toLocaleDateString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-full">{daysOver}d late</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">{f.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ── Clients Without Uploads ───────────────────────────────── */}
      <Card>
        <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center gap-2">
          <Clock size={16} className="text-amber-500" />
          <h3 className="font-bold text-[var(--text-primary)]">Clients Without Document Uploads</h3>
          <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold">{clientsWithoutUploads.length} clients</span>
        </div>
        {loadClients ? <div className="flex justify-center py-8"><Spinner /></div>
        : clientsWithoutUploads.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-[var(--text-muted)]">
            <Users size={32} className="mb-2 opacity-40" />
            <p className="text-sm font-medium">All clients have uploaded documents!</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--divide-color)]">
            {clientsWithoutUploads.map(c => (
              <div key={c._id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-xs font-bold text-amber-700">
                    {c.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{c.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{c.email} • {c.plan} Plan</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold">No uploads</span>
                  <button className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    Send Reminder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
export default AdminReports;
