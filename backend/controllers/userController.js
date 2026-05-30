// backend/controllers/userController.js
const asyncHandler = require("express-async-handler");
const bcrypt       = require("bcryptjs");
const User         = require("../models/User");

// ── GET /api/users ────────────────────────────────────────────────────────────
const getAllUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;

  // Accountants can only see their own assigned clients
  if (req.user.role === "accountant") {
    filter.role               = "client";           // force client filter
    filter.assignedAccountant = req.user._id;       // only their clients
  }

  const users = await User.find(filter)
    .select("-password")
    .populate("assignedAccountant", "name email")
    .sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, users });
});

// ── GET /api/users/:id ────────────────────────────────────────────────────────
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("assignedAccountant", "name email phone");
  if (!user) { res.status(404); throw new Error("User not found"); }
  res.json({ success: true, user });
});

// ── PUT /api/users/:id ────────────────────────────────────────────────────────
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error("User not found"); }

  if (req.user.role === "client" && req.user._id.toString() !== req.params.id) {
    res.status(403); throw new Error("You can only update your own profile");
  }

  const { name, phone, pan, gstin, address, city, state, pincode, avatar } = req.body;
  if (name)    user.name    = name;
  if (phone)   user.phone   = phone;
  if (pan)     user.pan     = pan.toUpperCase();
  if (gstin)   user.gstin   = gstin.toUpperCase();
  if (address) user.address = address;
  if (city)    user.city    = city;
  if (state)   user.state   = state;
  if (pincode) user.pincode = pincode;
  if (avatar !== undefined) user.avatar = avatar;

  if (req.user.role === "admin") {
    if (req.body.role)     user.role     = req.body.role;
    if (req.body.plan)     user.plan     = req.body.plan;
    if (req.body.isActive !== undefined) user.isActive = req.body.isActive;
    if (req.body.assignedAccountant)     user.assignedAccountant = req.body.assignedAccountant;
  }

  const updated = await user.save();
  res.json({ success: true, message: "Profile updated", user: { ...updated.toObject(), password: undefined } });
});

// ── PUT /api/users/:id/avatar ─────────────────────────────────────────────────
// Uploads avatar to Cloudinary and saves URL on user document
const updateAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error("User not found"); }

  if (req.user._id.toString() !== req.params.id && req.user.role !== "admin") {
    res.status(403); throw new Error("Not authorized");
  }

  if (!req.file) { res.status(400); throw new Error("No image file provided"); }

  // Upload to Cloudinary using the helper from config
  const cloudinary = require("../config/cloudinary");
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.cloudinary.uploader.upload_stream(
      { folder: "taxease/avatars", resource_type: "image",
        transformation: [{ width: 200, height: 200, crop: "fill", gravity: "face" }] },
      (err, result) => err ? reject(err) : resolve(result)
    );
    stream.end(req.file.buffer);
  });

  // Delete old avatar from Cloudinary if exists
  if (user.avatarPublicId) {
    try { await cloudinary.cloudinary.uploader.destroy(user.avatarPublicId); } catch {}
  }

  user.avatar          = result.secure_url;
  user.avatarPublicId  = result.public_id;
  await user.save();

  res.json({ success: true, avatarUrl: result.secure_url });
});

// ── PUT /api/users/:id/email ──────────────────────────────────────────────────
const changeEmail = asyncHandler(async (req, res) => {
  const { newEmail, password } = req.body;

  if (!newEmail || !password) {
    res.status(400); throw new Error("New email and current password are required");
  }

  // Only owner can change their own email
  if (req.user._id.toString() !== req.params.id) {
    res.status(403); throw new Error("Not authorized to change another user's email");
  }

  const user = await User.findById(req.params.id).select("+password");
  if (!user) { res.status(404); throw new Error("User not found"); }

  // Verify current password
  const match = await bcrypt.compare(password, user.password);
  if (!match) { res.status(401); throw new Error("Current password is incorrect"); }

  // Check email not already in use
  const existing = await User.findOne({ email: newEmail.toLowerCase() });
  if (existing && existing._id.toString() !== req.params.id) {
    res.status(400); throw new Error("This email address is already in use");
  }

  user.email = newEmail.toLowerCase();
  await user.save();

  res.json({ success: true, message: "Email updated successfully" });
});

// ── PUT /api/users/:id/password ───────────────────────────────────────────────
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400); throw new Error("Both current and new password are required");
  }
  if (newPassword.length < 6) {
    res.status(400); throw new Error("New password must be at least 6 characters");
  }

  // Only owner can change their own password
  if (req.user._id.toString() !== req.params.id) {
    res.status(403); throw new Error("Not authorized to change another user's password");
  }

  const user = await User.findById(req.params.id).select("+password");
  if (!user) { res.status(404); throw new Error("User not found"); }

  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) { res.status(401); throw new Error("Current password is incorrect"); }

  // Setting password triggers the pre-save bcrypt hook
  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: "Password changed successfully" });
});

// ── DELETE /api/users/:id ─────────────────────────────────────────────────────
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error("User not found"); }
  user.isActive = false;
  await user.save();
  res.json({ success: true, message: "User deactivated successfully" });
});

// ── PUT /api/users/:id/assign ─────────────────────────────────────────────────
const assignAccountant = asyncHandler(async (req, res) => {
  const { accountantId } = req.body;
  const accountant = await User.findOne({ _id: accountantId, role: "accountant" });
  if (!accountant) { res.status(404); throw new Error("Accountant not found"); }

  const client = await User.findByIdAndUpdate(
    req.params.id, { assignedAccountant: accountantId }, { new: true }
  ).populate("assignedAccountant", "name email");
  if (!client) { res.status(404); throw new Error("Client not found"); }

  res.json({ success: true, message: "Accountant assigned", user: client });
});

module.exports = { getAllUsers, getUserById, updateUser, updateAvatar, changeEmail, changePassword, deleteUser, assignAccountant };
