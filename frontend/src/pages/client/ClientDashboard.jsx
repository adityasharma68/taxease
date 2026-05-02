// src/pages/client/ClientDashboard.jsx
// Main overview — stats, recent filings, deadlines, activity feed
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";
import { Link } from "react-router-dom";
import { StatCard, StatusBadge, Card, CardHeader, Spinner } from "../../components/common/UI";
import ActivityFeed from "../../components/common/ActivityFeed";
import { FileText, CheckCircle, Clock, Calendar, Download, AlertTriangle } from "lucide-react";

const DEADLINES = [
  { date:"May 11",  event:"GSTR-1 (Apr)",  type:"GST",         urgent:true  },
  { date:"May 20",  event:"GSTR-3B (Apr)", type:"GST",         urgent:true  },
  { date:"May 31",  event:"TDS Return Q4", type:"TDS",         urgent:true  },
  { date:"Jun 15",  event:"Advance Tax",   type:"Income Tax",  urgent:false },
  { date:"Jul 31",  event:"ITR Filing",    type:"Income Tax",  urgent:false },
];

const ClientDashboard = () => {
  const { user } = useAuth();
  const { data, loading } = useApi("/filings");
  const filings = data?.filings || [];

  const totalFiled   = filings.filter(f => f.status === "Filed").length;
  const totalPending = filings.filter(f => f.status === "Pending").length;
  const nextDue = filings
    .filter(f => f.status !== "Filed")
    .sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white">
        <p className="text-indigo-200 text-sm mb-1">Good morning 👋</p>
        <h2 className="text-2xl font-bold mb-4">{user?.name}</h2>
        <div className="flex flex-wrap gap-6 text-sm">
          <div><div className="text-indigo-300">GSTIN</div><div className="font-mono font-semibold">{user?.gstin || "Not set"}</div></div>
          <div><div className="text-indigo-300">PAN</div><div className="font-mono font-semibold">{user?.pan || "Not set"}</div></div>
          <div><div className="text-indigo-300">Plan</div><div className="font-semibold">{user?.plan} ✓</div></div>
          <div><div className="text-indigo-300">Assigned CA</div>
            <div className="font-semibold">{user?.assignedAccountant?.name || "Pending assignment"}</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Filings" value={filings.length}  sub="This financial year" icon={FileText}    color="indigo" />
        <StatCard label="Filed"         value={totalFiled}       sub="Successfully filed"  icon={CheckCircle} color="emerald" />
        <StatCard label="Pending"       value={totalPending}     sub="Action required"     icon={Clock}       color="amber" />
        <StatCard label="Next Due"
          value={nextDue ? new Date(nextDue.dueDate).toLocaleDateString("en-IN",{day:"numeric",month:"short"}) : "None"}
          sub={nextDue?.type || "All clear"} icon={Calendar} color="red" />
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Filings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Recent Filings" action={
              <Link to="/client/filings" className="text-xs text-indigo-600 font-medium hover:underline">View all →</Link>
            } />
            {loading ? <div className="flex justify-center py-10"><Spinner /></div> : (
              <div className="divide-y divide-slate-50">
                {filings.slice(0,5).map(f => (
                  <div key={f._id} className="flex items-center justify-between px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <FileText size={14} className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{f.type}</p>
                        <p className="text-xs text-slate-400">{f.period} • Due: {new Date(f.dueDate).toLocaleDateString("en-IN")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={f.status} />
                      {f.acknowledgementUrl && (
                        <a href={f.acknowledgementUrl} target="_blank" rel="noreferrer" className="text-indigo-500 hover:text-indigo-700">
                          <Download size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                {filings.length === 0 && <p className="text-center text-slate-400 text-sm py-8">No filings yet.</p>}
              </div>
            )}
          </Card>
        </div>

        {/* Deadlines */}
        <Card>
          <CardHeader title="Upcoming Deadlines" />
          <div className="divide-y divide-slate-50">
            {DEADLINES.map((item,i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.urgent ? "bg-red-500":"bg-slate-300"}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{item.event}</p>
                  <p className="text-xs text-slate-400">{item.date}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.type==="GST"?"bg-indigo-50 text-indigo-700":item.type==="TDS"?"bg-amber-50 text-amber-700":"bg-emerald-50 text-emerald-700"}`}>
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Activity Feed + Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Recent Activity" />
            <div className="px-5 py-4">
              <ActivityFeed />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {totalPending > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-900">{totalPending} pending filing(s)</p>
                  <p className="text-xs text-amber-700 mt-0.5">Upload documents to proceed.</p>
                  <Link to="/client/upload" className="inline-block mt-3 text-xs font-bold bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-700 transition-colors">
                    Upload Now →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Quick actions */}
          <Card className="p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { to:"/client/upload",   label:"Upload Documents",    color:"bg-indigo-600 hover:bg-indigo-700" },
                { to:"/client/filings",  label:"View Filing History", color:"bg-slate-100 hover:bg-slate-200 text-slate-700" },
                { to:"/client/chat",     label:"Chat with CA",        color:"bg-emerald-600 hover:bg-emerald-700" },
                { to:"/client/payments", label:"Pay Invoices",        color:"bg-purple-600 hover:bg-purple-700" },
              ].map(a => (
                <Link key={a.to} to={a.to}
                  className={`block w-full text-center text-xs font-semibold px-4 py-2.5 rounded-xl text-white transition-colors ${a.color}`}>
                  {a.label}
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default ClientDashboard;
