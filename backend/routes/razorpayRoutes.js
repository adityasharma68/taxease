// backend/routes/razorpayRoutes.js
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const router  = express.Router();
const { createRazorpayOrder, verifyRazorpayPayment } = require("../controllers/razorpayController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

// POST /api/payments/:id/create-order  — create Razorpay order
router.post("/:id/create-order", createRazorpayOrder);

// POST /api/payments/:id/verify  — verify payment after success
router.post("/:id/verify", verifyRazorpayPayment);

module.exports = router;
