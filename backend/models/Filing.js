// ─── models/Filing.js ────────────────────────────────────────────────────────
// Represents a tax filing record (GSTR-1, ITR, TDS Return, etc.)
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");

const filingSchema = new mongoose.Schema(
  {
    // Client this filing belongs to
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Accountant handling this filing
    accountant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Type of tax return
    type: {
      type: String,
      enum: ["GSTR-1", "GSTR-3B", "GSTR-9", "ITR-1", "ITR-3", "ITR-4", "TDS Return", "Other"],
      required: true,
    },

    // Tax period e.g. "March 2025" or "FY 2024-25" or "Q4 FY25"
    period: {
      type: String,
      required: true,
    },

    // The statutory due date for this filing
    dueDate: {
      type: Date,
      required: true,
    },

    // When the filing was actually submitted
    filedDate: {
      type: Date,
    },

    // Current stage of the filing
    status: {
      type: String,
      enum: ["Pending", "In Process", "Filed", "Rejected"],
      default: "Pending",
    },

    // Government acknowledgement number after successful filing
    acknowledgementNumber: {
      type: String,
      default: "",
    },

    // Link to the acknowledgement document (Cloudinary URL)
    acknowledgementUrl: {
      type: String,
      default: "",
    },

    // Internal notes by the accountant
    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Filing", filingSchema);
