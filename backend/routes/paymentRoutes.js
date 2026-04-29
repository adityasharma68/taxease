// ─── routes/paymentRoutes.js ─────────────────────────────────────────────────

const express = require("express");
const router  = express.Router();
const { getPayments, createInvoice, markAsPaid } = require("../controllers/paymentController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/",           getPayments);                          // GET  /api/payments
router.post("/",          authorizeRoles("admin"), createInvoice); // POST /api/payments
router.put("/:id/pay",    markAsPaid);                           // PUT  /api/payments/:id/pay

module.exports = router;
