// src/pages/accountant/AccountantDashboard.jsx
// Accountant sees their assigned tasks and recent client documents
// ─────────────────────────────────────────────────────────────────────────────

import { useApi } from "../../hooks/useApi";
import { StatCard, Card, CardHeader, StatusBadge, Spinner } from "../../components/common/UI";
import { CheckSquare, Clock, AlertCircle, Users } from "lucide-react";

const AccountantDashboard = () => {
  const { data: taskData, loading: loadTasks } = useApi("/tasks");
  const { data: docData,  loading: loadDocs  } = useApi("/documents");

  const tasks = taskData?.tasks || [];
  const docs  = docData?.documents || [];

  const pending    = tasks.filter(t => t.status === "Pending").length;
  const inProgress = tasks.filter(t => t.status === "In Progress").length;
  const completed  = tasks.filter(t => t.status === "Completed").length;
  const overdue    = tasks.filter(t => t.status !== "Completed" && new Date(t.deadline) < new Date()).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tasks"    value={tasks.length} sub="Assigned to me"   icon={CheckSquare} color="indigo" />
        <StatCard label="In Progress"    value={inProgress}   sub="Currently working" icon={Clock}       color="blue" />
        <StatCard label="Completed"      value={completed}    sub="Finished tasks"   icon={Users}       color="emerald" />
        <StatCard label="Overdue"        value={overdue}      sub="Need attention"   icon={AlertCircle} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task queue */}
        <Card>
          <CardHeader title="My Task Queue" />
          {loadTasks ? <div className="flex justify-center py-10"><Spinner /></div> : (
            <div className="divide-y divide-slate-50">
              {tasks.slice(0, 6).map(t => (
                <div key={t._id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.title}</p>
                    <p className="text-xs text-slate-400">{t.client?.name} • {t.period}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={t.priority} />
                    <StatusBadge status={t.status} />
                  </div>
                </div>
              ))}
              {tasks.length === 0 && <p className="text-center text-slate-400 text-sm py-6">No tasks assigned yet.</p>}
            </div>
          )}
        </Card>

        {/* Recent client documents */}
        <Card>
          <CardHeader title="Recent Client Documents" />
          {loadDocs ? <div className="flex justify-center py-10"><Spinner /></div> : (
            <div className="divide-y divide-slate-50">
              {docs.slice(0, 6).map(doc => (
                <div key={doc._id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{doc.name}</p>
                    <p className="text-xs text-slate-400">{doc.category} • {doc.client?.name}</p>
                  </div>
                  <StatusBadge status={doc.status} />
                </div>
              ))}
              {docs.length === 0 && <p className="text-center text-slate-400 text-sm py-6">No documents uploaded yet.</p>}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AccountantDashboard;
