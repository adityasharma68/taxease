// src/pages/accountant/AccountantChat.jsx
// Accountant selects a client from their list and chats with them
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { Card, PageHeader, Spinner } from "../../components/common/UI";
import ChatBox from "../../components/chat/ChatBox";

const AccountantChat = () => {
  const [selectedClient, setSelectedClient] = useState(null);

  // Fetch accountant's assigned clients
  const { data, loading } = useApi("/users", { role: "client" });
  const clients = data?.users || [];

  return (
    <div className="space-y-4">
      <PageHeader title="Client Chat" subtitle="Communicate directly with your clients" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ height: "70vh" }}>
        {/* Client list sidebar */}
        <Card className="overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">My Clients</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center pt-6"><Spinner /></div>
            ) : clients.length === 0 ? (
              <p className="text-center text-slate-400 text-sm p-6">No clients assigned yet.</p>
            ) : (
              clients.map(c => (
                <button
                  key={c._id}
                  onClick={() => setSelectedClient(c)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors border-b border-slate-50
                    ${selectedClient?._id === c._id ? "bg-indigo-50 border-l-2 border-l-indigo-600" : "hover:bg-slate-50"}`}
                >
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-700 flex-shrink-0">
                    {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-slate-900 truncate">{c.name}</p>
                    <p className="text-xs text-slate-400 truncate">{c.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Chat area */}
        <div className="lg:col-span-2">
          <Card className="h-full overflow-hidden flex flex-col">
            <ChatBox
              otherUserId={selectedClient?._id}
              otherUserName={selectedClient?.name}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountantChat;
