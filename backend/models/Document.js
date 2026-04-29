// ─── models/Document.js ──────────────────────────────────────────────────────
// Represents a file uploaded by a client (PDF, Excel, etc.)
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    // Which client uploaded this document
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Original file name
    name: {
      type: String,
      required: true,
    },

    // Cloudinary URL (or local path for demo)
    fileUrl: {
      type: String,
      required: true,
    },

    // Cloudinary public ID (needed to delete from Cloudinary)
    publicId: {
      type: String,
    },

    // Tax category this document belongs to
    category: {
      type: String,
      enum: ["GST", "ITR", "TDS", "Business Registration", "Other"],
      required: true,
    },

    // The period this document covers e.g. "March 2025" or "FY 2024-25"
    period: {
      type: String,
      required: true,
    },

    // File size in human-readable format e.g. "2.4 MB"
    size: {
      type: String,
    },

    // Optional notes from the client to their CA
    notes: {
      type: String,
      default: "",
    },

    // Accountant review status
    status: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
