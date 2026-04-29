// ─── controllers/paymentController.js ────────────────────────────────────────
// Invoice generation and payment status management (mock payment gateway)
// ─────────────────────────────────────────────────────────────────────────────

const asyncHandler = require("express-async-handler");
const Payment = require("../models/Payment");

// Helper — generate a sequential invoice number like INV-2025-0042
const generateInvoiceNumber = async () => {
  const year  = new Date().getFullYear();
  const count = await Payment.countDocuments();
  return `INV-${year}-${String(count + 1).padStart(4, "0")}`;
};

// GET /api/payments — client sees own invoices, admin sees all
const getPayments = asyncHandler(async (req, res) => {
  let query = {};
  if (req.user.role === "client") query.client = req.user._id;
  else if (req.query.clientId)    query.client = req.query.clientId;
  if (req.query.status) query.status = req.query.status;

  const payments = await Payment.find(query)
    .populate("client", "name email")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: payments.length, payments });
});

// POST /api/payments — admin creates an invoice for a client
const createInvoice = asyncHandler(async (req, res) => {
  const { clientId, description, amount } = req.body;

  if (!clientId || !description || !amount) {
    res.status(400);
    throw new Error("clientId, description and amount are required");
  }

  const invoiceNumber = await generateInvoiceNumber();

  // Calculate 18% GST on the service charge
  const tax = Math.round(amount * 0.18);

  const payment = await Payment.create({
    client:        clientId,
    invoiceNumber,
    description,
    amount:        Number(amount),
    tax,
  });

  res.status(201).json({ success: true, message: "Invoice created", payment });
});

// PUT /api/payments/:id/pay — mock payment — mark an invoice as paid
const markAsPaid = asyncHandler(async (req, res) => {
  const { paymentMethod } = req.body;

  const payment = await Payment.findById(req.params.id);
  if (!payment) { res.status(404); throw new Error("Invoice not found"); }

  // Only the client who owns the invoice can pay it
  if (payment.client.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403); throw new Error("Not authorized");
  }

  payment.status        = "Paid";
  payment.paidAt        = new Date();
  payment.paymentMethod = paymentMethod || "UPI";
  // Generate a fake transaction ID
  payment.transactionId = `TXN${Date.now()}`;

  const updated = await payment.save();
  res.json({ success: true, message: "Payment successful", payment: updated });
});

module.exports = { getPayments, createInvoice, markAsPaid };
