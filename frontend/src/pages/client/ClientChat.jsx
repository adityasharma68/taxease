// src/pages/client/ClientChat.jsx
// Client chat with their assigned accountant
// ─────────────────────────────────────────────────────────────────────────────

import { useAuth } from "../../context/AuthContext";
import { Card, PageHeader } from "../../components/common/UI";
import ChatBox from "../../components/chat/ChatBox";

const ClientChat = () => {
  const { user } = useAuth();
  // The client's assigned accountant comes from their user profile
  const accountant = user?.assignedAccountant;

  return (
    <div className="space-y-4">
      <PageHeader title="Chat Support" subtitle="Message your assigned CA directly" />
      <Card className="overflow-hidden" style={{ height: "70vh" }}>
        {accountant ? (
          <ChatBox
            otherUserId={accountant._id || accountant}
            otherUserName={accountant.name || "Your CA"}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-14 h-14 bg-[var(--bg-surface-2)] rounded-2xl flex items-center justify-center mb-4 text-2xl">💬</div>
            <h3 className="font-semibold text-[var(--text-secondary)] mb-2">No Accountant Assigned Yet</h3>
            <p className="text-sm text-[var(--text-muted)] max-w-xs">
              An accountant will be assigned to your account soon.
              You'll be able to chat with them here.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ClientChat;
