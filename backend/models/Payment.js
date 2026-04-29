// ─── models/Payment.js ───────────────────────────────────────────────────────
// Represents an invoice / payment record for a client
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    // Which client this invoice is for
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Human-readable invoice number e.g. "INV-2025-0042"
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    // What service was this invoice for
    description: {
      type: String,
      required: true,
    },

    // Amount in INR (stored in paise to avoid floating point issues)
    // e.g. ₹1200 is stored as 120000
    amount: {
      type: Number,
      required: true,
    },

    // Tax (GST) on the invoice amount — 18%
    tax: {
      type: Number,
      default: 0,
    },

    // Payment status
    status: {
      type: String,
      enum: ["Pending", "Paid", "Cancelled"],
      default: "Pending",
    },

    // When the invoice was paid
    paidAt: {
      type: Date,
    },

    // Payment method used
    paymentMethod: {
      type: String,
      enum: ["UPI", "Net Banking", "Credit Card", "Debit Card", "Cash", ""],
      default: "",
    },

    // Transaction ID from payment gateway (mock)
    transactionId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
