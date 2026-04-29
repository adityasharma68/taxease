// ─── models/Message.js ───────────────────────────────────────────────────────
// Stores chat messages between clients and accountants/support
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // Who sent the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Who receives the message
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The message text content
    text: {
      type: String,
      required: [true, "Message text cannot be empty"],
      trim: true,
    },

    // Has the receiver read this message?
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
