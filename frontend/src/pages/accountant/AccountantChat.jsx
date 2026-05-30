// src/pages/accountant/AccountantChat.jsx
import { useState } from "react";
import { useApi }   from "../../hooks/useApi";
import { Spinner }  from "../../components/common/UI";
import ChatBox      from "../../components/chat/ChatBox";
import { MessageCircle, Users } from "lucide-react";

const AccountantChat = () => {
  const [selectedClient, setSelectedClient] = useState(null);

  // accountant role → backend now returns only their assigned clients
  const { data, loading, error } = useApi("/users", { role: "client" });
  const clients = data?.users || [];

  return (
    <div className="space-y-4 h-full">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Client Chat</h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          Communicate directly with your assigned clients
        </p>
      </div>

      {/* Error banner (non-403) */}
      {error && !error.includes("403") && (
        <div className="px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ height: "calc(100vh - 220px)", minHeight: "480px" }}>

        {/* ── Client list ─────────────────────────────────────────────────── */}
        <div className="flex flex-col rounded-2xl overflow-hidden"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>

          {/* List header */}
          <div className="flex items-center gap-2.5 px-4 py-3.5 flex-shrink-0"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20
                            flex items-center justify-center">
              <Users size={13} className="text-teal-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>My Clients</h3>
              {!loading && (
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {clients.length} {clients.length === 1 ? "client" : "clients"} assigned
                </p>
              )}
            </div>
          </div>

          {/* List body */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full pt-8">
                <Spinner size="md" />
              </div>
            ) : clients.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                  style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
                  <Users size={20} style={{ color: "var(--text-muted)" }} />
                </div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>No clients assigned</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  Ask your admin to assign clients to your account
                </p>
              </div>
            ) : (
              clients.map(c => {
                const isSelected = selectedClient?._id === c._id;
                const initials   = c.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <button key={c._id} onClick={() => setSelectedClient(c)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-150"
                    style={{
                      background:   isSelected ? "rgba(99,102,241,0.10)" : "transparent",
                      borderBottom: "1px solid var(--border-subtle)",
                      borderLeft:   isSelected ? "3px solid #6366f1" : "3px solid transparent",
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "var(--bg-hover)"; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}>
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                                     text-xs font-bold flex-shrink-0
                                     ${isSelected
                                       ? "bg-indigo-600 text-white"
                                       : "bg-indigo-500/15 text-indigo-400"}`}>
                      {initials}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="text-sm font-semibold truncate"
                        style={{ color: "var(--text-primary)" }}>{c.name}</p>
                      <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{c.email}</p>
                    </div>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── Chat area ───────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col rounded-2xl overflow-hidden"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>

          {selectedClient ? (
            <ChatBox
              otherUserId={selectedClient._id}
              otherUserName={selectedClient.name}
            />
          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
                <MessageCircle size={26} style={{ color: "var(--text-muted)" }} />
              </div>
              <h3 className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                Select a client to start chatting
              </h3>
              <p className="text-sm max-w-xs" style={{ color: "var(--text-muted)" }}>
                Choose a client from the list on the left to open the conversation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountantChat;
