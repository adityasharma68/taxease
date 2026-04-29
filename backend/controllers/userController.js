// ─── controllers/userController.js ───────────────────────────────────────────
// Admin-level user management — list, update, assign accountants
// ─────────────────────────────────────────────────────────────────────────────

const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// ─── @route  GET /api/users ───────────────────────────────────────────────────
// @desc    Get all users (admin only)
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  // Support filtering by role via query param e.g. ?role=client
  const filter = {};
  if (req.query.role) filter.role = req.query.role;

  const users = await User.find(filter)
    .select("-password")
    .populate("assignedAccountant", "name email")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: users.length, users });
});

// ─── @route  GET /api/users/:id ───────────────────────────────────────────────
// @desc    Get a single user by ID (admin only)
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("assignedAccountant", "name email phone");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({ success: true, user });
});

// ─── @route  PUT /api/users/:id ───────────────────────────────────────────────
// @desc    Update user profile or role (admin can update all, client updates own)
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Clients can only update their own profile
  if (req.user.role === "client" && req.user._id.toString() !== req.params.id) {
    res.status(403);
    throw new Error("You can only update your own profile");
  }

  // Update allowed fields
  user.name   = req.body.name   || user.name;
  user.phone  = req.body.phone  || user.phone;
  user.pan    = req.body.pan    || user.pan;
  user.gstin  = req.body.gstin  || user.gstin;
  user.avatar = req.body.avatar || user.avatar;

  // Only admins can change roles, plan, and assigned accountant
  if (req.user.role === "admin") {
    user.role               = req.body.role               || user.role;
    user.plan               = req.body.plan               || user.plan;
    user.isActive           = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
    user.assignedAccountant = req.body.assignedAccountant || user.assignedAccountant;
  }

  const updated = await user.save();

  res.json({
    success: true,
    message: "Profile updated",
    user: { ...updated.toObject(), password: undefined },
  });
});

// ─── @route  DELETE /api/users/:id ───────────────────────────────────────────
// @desc    Deactivate a user (soft delete — admin only)
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Soft delete — just mark inactive, don't actually remove from DB
  user.isActive = false;
  await user.save();

  res.json({ success: true, message: "User deactivated successfully" });
});

// ─── @route  PUT /api/users/:id/assign ───────────────────────────────────────
// @desc    Assign an accountant to a client (admin only)
// @access  Private/Admin
const assignAccountant = asyncHandler(async (req, res) => {
  const { accountantId } = req.body;

  // Verify the accountant exists and has the correct role
  const accountant = await User.findOne({ _id: accountantId, role: "accountant" });
  if (!accountant) {
    res.status(404);
    throw new Error("Accountant not found");
  }

  const client = await User.findByIdAndUpdate(
    req.params.id,
    { assignedAccountant: accountantId },
    { new: true }
  ).populate("assignedAccountant", "name email");

  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }

  res.json({ success: true, message: "Accountant assigned successfully", user: client });
});

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, assignAccountant };
