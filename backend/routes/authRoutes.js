// ─── routes/authRoutes.js ─────────────────────────────────────────────────────
// Public auth endpoints: register, login, get profile
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const router  = express.Router();
const { registerUser, loginUser, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/register  — create a new account
router.post("/register", registerUser);

// POST /api/auth/login     — sign in and get token
router.post("/login", loginUser);

// GET  /api/auth/me        — get currently logged-in user (requires token)
router.get("/me", protect, getMe);

module.exports = router;
