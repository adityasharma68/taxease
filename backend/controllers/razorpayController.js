// backend/controllers/razorpayController.js
// Razorpay payment gateway integration
// ─────────────────────────────────────────────────────────────────────────────

const asyncHandler = require("express-async-handler");
const Payment = require("../models/Payment");

// NOTE: Install razorpay first: npm install razorpay
// Then add to .env:
//   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
//   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx

let Razorpay;
try {
  Razorpay = require("razorpay");
} catch {
  console.log("⚠️  Razorpay not installed. Run: npm install razorpay");
}

// Initialize Razorpay instance
const getRazorpay = () => {
  if (!Razorpay) throw new Error("Razorpay package not installed. Run: npm install razorpay");
  return new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// ─── POST /api/payments/:id/create-order ─────────────────────────────────────
// Creates a Razorpay order for a given invoice
// @access Private/Client
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) { res.status(404); throw new Error("Invoice not found"); }

  if (payment.client.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error("Not authorized");
  }

  if (payment.status === "Paid") {
    res.status(400); throw new Error("Invoice already paid");
  }

  const razorpay = getRazorpay();

  // Amount must be in paise (₹1 = 100 paise)
  const totalAmount = payment.amount + payment.tax;

  const order = await razorpay.orders.create({
    amount:   totalAmount,          // already in paise from our model
    currency: "INR",
    receipt:  payment.invoiceNumber,
    notes: {
      invoiceId:   payment._id.toString(),
      clientId:    req.user._id.toString(),
      description: payment.description,
    },
  });

  res.json({
    success: true,
    order: {
      id:       order.id,
      amount:   order.amount,
      currency: order.currency,
    },
    key:  process.env.RAZORPAY_KEY_ID,
    name: "TaxEase",
    description: payment.description,
    prefill: {
      name:  req.user.name,
      email: req.user.email,
      contact: req.user.phone || "",
    },
  });
});

// ─── POST /api/payments/:id/verify ───────────────────────────────────────────
// Verifies Razorpay payment signature after successful payment
// @access Private/Client
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const crypto = require("crypto");
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // Verify signature to ensure payment is genuine
  const body      = razorpay_order_id + "|" + razorpay_payment_id;
  const expected  = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expected !== razorpay_signature) {
    res.status(400);
    throw new Error("Payment verification failed — invalid signature");
  }

  // Mark invoice as paid in our database
  const payment = await Payment.findById(req.params.id);
  if (!payment) { res.status(404); throw new Error("Invoice not found"); }

  payment.status        = "Paid";
  payment.paidAt        = new Date();
  payment.paymentMethod = "Razorpay";
  payment.transactionId = razorpay_payment_id;
  await payment.save();

  res.json({
    success: true,
    message: "Payment verified and recorded successfully!",
    payment,
  });
});

module.exports = { createRazorpayOrder, verifyRazorpayPayment };
