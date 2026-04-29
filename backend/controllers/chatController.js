// ─── controllers/chatController.js ───────────────────────────────────────────
// Send messages and retrieve chat history between two users
// ─────────────────────────────────────────────────────────────────────────────

const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");

// GET /api/chat/:userId — get all messages between logged-in user and another user
const getMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const myId = req.user._id;

  // Fetch messages where I am either the sender or receiver
  const messages = await Message.find({
    $or: [
      { sender: myId,   receiver: userId },
      { sender: userId, receiver: myId   },
    ],
  })
    .populate("sender",   "name role avatar")
    .populate("receiver", "name role avatar")
    .sort({ createdAt: 1 }); // Oldest first (chat order)

  // Mark all received messages as read
  await Message.updateMany(
    { sender: userId, receiver: myId, isRead: false },
    { isRead: true }
  );

  res.json({ success: true, count: messages.length, messages });
});

// POST /api/chat/send — send a message to another user
const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, text } = req.body;

  if (!receiverId || !text) {
    res.status(400);
    throw new Error("receiverId and text are required");
  }

  const message = await Message.create({
    sender:   req.user._id,
    receiver: receiverId,
    text:     text.trim(),
  });

  const populated = await Message.findById(message._id)
    .populate("sender",   "name role avatar")
    .populate("receiver", "name role avatar");

  res.status(201).json({ success: true, message: populated });
});

// GET /api/chat/unread — get count of unread messages for logged-in user
const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Message.countDocuments({
    receiver: req.user._id,
    isRead:   false,
  });

  res.json({ success: true, unreadCount: count });
});

module.exports = { getMessages, sendMessage, getUnreadCount };
