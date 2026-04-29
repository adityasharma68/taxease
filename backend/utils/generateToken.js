// ─── utils/generateToken.js ──────────────────────────────────────────────────
// Helper to create a signed JWT token for a given user ID
// ─────────────────────────────────────────────────────────────────────────────

const jwt = require("jsonwebtoken");

/**
 * Generates a JWT token containing the user's MongoDB _id
 * @param {string} id  - MongoDB ObjectId of the user
 * @returns {string}   - Signed JWT token string
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },                             // Payload: just the user's ID
    process.env.JWT_SECRET,             // Secret key from .env
    { expiresIn: process.env.JWT_EXPIRE || "30d" } // Token validity
  );
};

module.exports = generateToken;
