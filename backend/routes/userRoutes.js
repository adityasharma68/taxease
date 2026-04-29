// ─── routes/userRoutes.js ─────────────────────────────────────────────────────

const express = require("express");
const router  = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser, assignAccountant } = require("../controllers/userController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// All user routes require authentication
router.use(protect);

// GET    /api/users          — list all users (admin only)
router.get("/", authorizeRoles("admin"), getAllUsers);

// GET    /api/users/:id      — get one user
router.get("/:id", getUserById);

// PUT    /api/users/:id      — update user
router.put("/:id", updateUser);

// DELETE /api/users/:id      — deactivate user (admin only)
router.delete("/:id", authorizeRoles("admin"), deleteUser);

// PUT    /api/users/:id/assign — assign accountant to client (admin only)
router.put("/:id/assign", authorizeRoles("admin"), assignAccountant);

module.exports = router;
