// src/components/chat/ChatBox.jsx
// Reusable chat UI — fetches messages from /api/chat/:userId and sends new ones
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { Spinner } from "../common/UI";
import { Send } from "lucide-react";

const ChatBox = ({ otherUserId, otherUserName }) => {
  const { user }           = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(true);
  const [sending, setSending]   = useState(false);
  const bottomRef               = useRef(null);

  // Fetch message history on mount
  useEffect(() => {
    if (!otherUserId) return;
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/chat/${otherUserId}`);
        setMessages(data.messages);
      } catch {
        // Silently fail — user sees empty chat
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
    // Poll for new messages every 5 seconds (simple approach — use Socket.io for real-time)
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [otherUserId]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !otherUserId) return;
    setSending(true);
    try {
      const { data } = await api.post("/chat/send", { receiverId: otherUserId, text: input.trim() });
      setMessages(prev => [...prev, data.message]);
      setInput("");
    } catch {
      // Toast is handled by axios interceptor
    } finally {
      setSending(false);
    }
  };

  const isOwn = (msg) => msg.sender?._id === user?._id || msg.sender === user?._id;

  if (!otherUserId) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--text-muted)] text-sm">
        Select a contact to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Chat Header ──────────────────────────────────────────── */}
      <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center gap-3 bg-[var(--bg-surface)] rounded-t-2xl">
        <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {otherUserName?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--text-primary)]">{otherUserName}</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Online
          </div>
        </div>
      </div>

      {/* ── Message List ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-[var(--bg-surface-2)]">
        {loading ? (
          <div className="flex justify-center pt-8"><Spinner /></div>
        ) : messages.length === 0 ? (
          <p className="text-center text-[var(--text-muted)] text-sm pt-8">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg, i) => (
            <div key={msg._id || i} className={`flex ${isOwn(msg) ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm
                ${isOwn(msg)
                  ? "bg-indigo-600 text-white rounded-br-md"
                  : "bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-bl-md"}`}
              >
                {/* Show sender name for received messages */}
                {!isOwn(msg) && (
                  <p className="text-xs font-semibold text-indigo-600 mb-1">
                    {msg.sender?.name || otherUserName}
                  </p>
                )}
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${isOwn(msg) ? "text-indigo-300" : "text-[var(--text-muted)]"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input Bar ────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-t border-[var(--border-subtle)] flex gap-3 bg-[var(--bg-surface)] rounded-b-2xl">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Type a message... (Enter to send)"
          className="flex-1 px-4 py-2.5 border border-[var(--border-subtle)] rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
        />
        <button
          onClick={handleSend}
          disabled={sending || !input.trim()}
          className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
        >
          {sending ? <Spinner size={14} className="border-t-white" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
