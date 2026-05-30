// src/components/common/SessionWarning.jsx
// Modal shown 2 minutes before auto-logout
import { Clock, LogOut, RefreshCw } from "lucide-react";

const SessionWarning = ({ countdown, onStayActive, onLogout }) => {
  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;
  const pct  = Math.round((countdown / 120) * 100);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.70)", backdropFilter: "blur(6px)" }}>
      <div className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)" }}>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center">
          {/* Countdown ring */}
          <div className="relative w-20 h-20 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none"
                stroke="var(--border-subtle)" strokeWidth="6"/>
              <circle cx="40" cy="40" r="34" fill="none"
                stroke={countdown < 30 ? "#ef4444" : countdown < 60 ? "#f59e0b" : "#6366f1"}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`}
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock size={28} className={countdown < 30 ? "text-red-400" : "text-indigo-400"} />
            </div>
          </div>

          <h2 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Session Expiring Soon
          </h2>
          <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
            You've been inactive. Your session will end in:
          </p>
          <p className={`text-3xl font-bold tabular-nums mb-3
                         ${countdown < 30 ? "text-red-400" : countdown < 60 ? "text-amber-400" : "text-indigo-400"}`}>
            {mins > 0 ? `${mins}:${String(secs).padStart(2, "0")}` : `${secs}s`}
          </p>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full overflow-hidden mb-5"
            style={{ background: "var(--border-default)" }}>
            <div className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${pct}%`,
                background: countdown < 30 ? "#ef4444" : countdown < 60 ? "#f59e0b" : "#6366f1",
              }} />
          </div>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-6 flex flex-col gap-3">
          <button onClick={onStayActive}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                       text-sm font-semibold text-white transition-all active:scale-[0.98]
                       bg-gradient-to-br from-indigo-500 to-indigo-600 hover:opacity-90">
            <RefreshCw size={15} />
            Stay Logged In
          </button>
          <button onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                       text-sm font-medium transition-all"
            style={{ color: "var(--text-muted)", background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
            <LogOut size={14} />
            Sign Out Now
          </button>
        </div>

        {/* Footer note */}
        <div className="px-6 pb-5 text-center">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Any mouse movement or key press will keep you logged in automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionWarning;
