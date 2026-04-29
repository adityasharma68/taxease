// ─── models/Task.js ──────────────────────────────────────────────────────────
// Represents a work task assigned by admin to an accountant for a client
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    // The client this task is related to
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The accountant assigned to complete this task
    accountant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Short title describing the task
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },

    // Filing type this task is related to
    type: {
      type: String,
      enum: ["GST Filing", "ITR Filing", "TDS Return", "Business Registration", "Other"],
      required: true,
    },

    // Tax period e.g. "April 2025" or "Q4 FY25"
    period: {
      type: String,
      required: true,
    },

    // How urgent is this task
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },

    // Current progress state
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },

    // Hard deadline for the task
    deadline: {
      type: Date,
      required: true,
    },

    // Additional instructions from admin
    description: {
      type: String,
      default: "",
    },

    // Link to the related filing record
    filing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Filing",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
