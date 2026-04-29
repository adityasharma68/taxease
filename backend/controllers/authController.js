// ─── controllers/authController.js ───────────────────────────────────────────
// Handles user registration and login
// ─────────────────────────────────────────────────────────────────────────────

const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ─── @route  POST /api/auth/register ─────────────────────────────────────────
// @desc    Register a new user (client or accountant)
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email and password");
  }

  // Check if a user with this email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("A user with this email already exists");
  }

  // Only allow clients and accountants to self-register
  // Admins must be created directly in the database
  const allowedRoles = ["client", "accountant"];
  const userRole = allowedRoles.includes(role) ? role : "client";

  // Create the user — password hashing happens automatically in the model pre-save hook
  const user = await User.create({
    name,
    email,
    password,
    phone: phone || "",
    role: userRole,
  });

  // Send back the user data + a JWT token
  res.status(201).json({
    success: true,
    message: "Account created successfully",
    user: {
      _id:   user._id,
      name:  user.name,
      email: user.email,
      phone: user.phone,
      role:  user.role,
      plan:  user.plan,
    },
    token: generateToken(user._id),
  });
});

// ─── @route  POST /api/auth/login ────────────────────────────────────────────
// @desc    Authenticate user and return JWT token
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // Find the user by email — we need to explicitly select password
  // because it's set to select: false in the schema
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Use the model's matchPassword method to compare hashed passwords
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Check if the account is still active
  if (!user.isActive) {
    res.status(403);
    throw new Error("Your account has been deactivated. Contact support.");
  }

  // Send back user info + JWT
  res.json({
    success: true,
    message: "Login successful",
    user: {
      _id:               user._id,
      name:              user.name,
      email:             user.email,
      phone:             user.phone,
      role:              user.role,
      plan:              user.plan,
      pan:               user.pan,
      gstin:             user.gstin,
      assignedAccountant: user.assignedAccountant,
      avatar:            user.avatar,
    },
    token: generateToken(user._id),
  });
});

// ─── @route  GET /api/auth/me ─────────────────────────────────────────────────
// @desc    Get the currently logged-in user's profile
// @access  Private (requires JWT)
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by the protect middleware
  const user = await User.findById(req.user._id).populate("assignedAccountant", "name email phone");

  res.json({
    success: true,
    user,
  });
});

module.exports = { registerUser, loginUser, getMe };
