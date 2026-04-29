// ─── middleware/authMiddleware.js ─────────────────────────────────────────────
// Middleware to protect routes — verifies JWT and checks user roles
// ─────────────────────────────────────────────────────────────────────────────

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// ─── protect ─────────────────────────────────────────────────────────────────
// Verifies the JWT in the Authorization header
// If valid, attaches the user object to req.user for use in controllers
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check that the Authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract the token (format: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the full user from DB (excluding password)
      // We attach it to req so controllers can access logged-in user info
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }

      next(); // Token is valid — continue to the route handler
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized — invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized — no token provided");
  }
});

// ─── authorizeRoles ───────────────────────────────────────────────────────────
// Factory function — returns middleware that restricts access to specific roles
// Usage: authorizeRoles("admin"), authorizeRoles("admin", "accountant")
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Access denied: Role '${req.user.role}' is not authorized`);
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
