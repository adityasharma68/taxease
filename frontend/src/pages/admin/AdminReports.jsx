// src/pages/admin/AdminReports.jsx
// Analytics: filing stats, plan distribution, monthly bar chart
// ─────────────────────────────────────────────────────────────────────────────

import { useApi } from "../../hooks/useApi";
import { StatCard, Card, PageHeader, Spinner } from "../../components/common/UI";
import { BarChart2, TrendingUp, Users, DollarSign } from "lucide-react";

// Static monthly data — in production fetch from a /api/analytics endpoint
const MONTHLY = [
  { month: "Oct", count: 42 },
  { month: "Nov", count: 55 },
  { month: "Dec", count: 48 },
  { month: "Jan", count: 61 },
  { month: "Feb", count: 58 },
  { month: "Mar", count: 73 },
  { month: "Apr", count: 89 },
];
const MAX = Math.max(...MONTHLY.map(m => m.count));

const AdminReports = () => {
  const { data: filingsData, loading: loadFilings } = useApi("/filings");
  const { data: clientsData, loading: loadClients } = useApi("/users", { role: "client" });

  const filings = filingsData?.filings || [];
  const clients = clientsData?.users   || [];

  const gstCount  = filings.filter(f => f.type.startsWith("GSTR")).length;
  const itrCount  = filings.filter(f => f.type.startsWith("ITR")).length;
  const tdsCount  = filings.filter(f => f.type === "TDS Return").length;
  const otherCount = filings.length - gstCount - itrCount - tdsCount;

  const planCounts = {
    Basic:      clients.filter(c => c.plan === "Basic").length,
    Pro:        clients.filter(c => c.plan === "Pro").length,
    Enterprise: clients.filter(c => c.plan === "Enterprise").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Analytics" subtitle="Platform performance at a glance" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Filings"  value={loadFilings ? "—" : filings.length} sub="All time"            icon={BarChart2}  color="indigo" />
        <StatCard label="Total Clients"  value={loadClients ? "—" : clients.length} sub="Registered"         icon={Users}      color="emerald" />
        <StatCard label="Filed Rate"     value={loadFilings ? "—" : `${filings.length ? Math.round((filings.filter(f=>f.status==="Filed").length/filings.length)*100) : 0}%`} sub="Success rate" icon={TrendingUp} color="blue" />
        <StatCard label="Monthly Revenue" value="₹2.4L" sub="April 2025"            icon={DollarSign}  color="amber" trend={26} />
      </div>

      {/* Monthly filings bar chart */}
      <Card className="p-6">
        <h3 className="font-bold text-slate-900 mb-6">Monthly Filings (FY 2025-26)</h3>
        <div className="flex items-end gap-3 h-48">
          {MONTHLY.map(({ month, count }) => (
            <div key={month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">{count}</span>
              <div
                className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-t-lg transition-all cursor-pointer"
                style={{ height: `${(count / MAX) * 160}px` }}
                title={`${month}: ${count} filings`}
              />
              <span className="text-xs text-slate-400 font-medium">{month}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Filing type breakdown */}
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-4">Filing Type Breakdown</h3>
          {loadFilings ? <Spinner className="mx-auto" /> : (
            <div className="space-y-3">
              {[
                { label: "GST Filing",          count: gstCount,   pct: filings.length ? Math.round(gstCount/filings.length*100)   : 0, color: "bg-indigo-500" },
                { label: "ITR Filing",           count: itrCount,   pct: filings.length ? Math.round(itrCount/filings.length*100)   : 0, color: "bg-emerald-500" },
                { label: "TDS Return",           count: tdsCount,   pct: filings.length ? Math.round(tdsCount/filings.length*100)   : 0, color: "bg-amber-500" },
                { label: "Other",                count: otherCount, pct: filings.length ? Math.round(otherCount/filings.length*100) : 0, color: "bg-rose-400" },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 font-medium">{s.label}</span>
                    <span className="text-slate-500">{s.count} ({s.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`${s.color} h-2 rounded-full`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Plan distribution */}
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-4">Client Plan Distribution</h3>
          {loadClients ? <Spinner className="mx-auto" /> : (
            <div className="space-y-4">
              {[
                { plan:"Enterprise", color:"bg-purple-500", text:"text-purple-700" },
                { plan:"Pro",        color:"bg-indigo-500", text:"text-indigo-700" },
                { plan:"Basic",      color:"bg-slate-400",  text:"text-slate-700"  },
              ].map(({ plan, color, text }) => (
                <div key={plan} className="flex items-center gap-4">
                  <div className={`w-3 h-3 ${color} rounded-full flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm font-semibold ${text}`}>{plan}</span>
                      <span className="text-sm text-slate-500">{planCounts[plan]} clients</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className={`${color} h-1.5 rounded-full`}
                        style={{ width: `${clients.length ? (planCounts[plan]/clients.length*100).toFixed(0) : 0}%` }} />
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                <span className="text-3xl font-black text-slate-900">{clients.length}</span>
                <span className="text-sm text-slate-400 ml-2">Total Clients</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;
