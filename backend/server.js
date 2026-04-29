// ─── server.js ────────────────────────────────────────────────────────────────
const express = require("express");
const cors    = require("cors");
const dotenv  = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── API Routes ─────────────────────────────────────────────────────────────
app.use("/api/auth",      require("./routes/authRoutes"));
app.use("/api/users",     require("./routes/userRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/filings",   require("./routes/filingRoutes"));
app.use("/api/tasks",     require("./routes/taskRoutes"));
app.use("/api/chat",      require("./routes/chatRoutes"));
app.use("/api/payments",  require("./routes/paymentRoutes"));
app.use("/api/payments",  require("./routes/razorpayRoutes")); // Razorpay endpoints

// ── Health Check ────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status:"OK", message:"TaxEase API is running", timestamp: new Date() });
});

// ── 404 ────────────────────────────────────────────────────────────────────
app.use((req, res) => { res.status(404).json({ success:false, message:"Route not found" }); });

// ── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("🔴 ERROR:", err.message);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack:   process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 TaxEase Server running on http://localhost:${PORT}`);
  console.log(`📂 Environment: ${process.env.NODE_ENV || "development"}\n`);
});
