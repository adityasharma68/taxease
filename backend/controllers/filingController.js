// ─── controllers/filingController.js ─────────────────────────────────────────
// CRUD for tax filing records
// ─────────────────────────────────────────────────────────────────────────────

const asyncHandler = require("express-async-handler");
const Filing = require("../models/Filing");

// GET /api/filings — client sees own, admin/accountant see all or filtered
const getFilings = asyncHandler(async (req, res) => {
  let query = {};
  if (req.user.role === "client") query.client = req.user._id;
  else if (req.query.clientId)    query.client = req.query.clientId;
  if (req.query.status) query.status = req.query.status;
  if (req.query.type)   query.type   = req.query.type;

  const filings = await Filing.find(query)
    .populate("client",     "name email gstin")
    .populate("accountant", "name email")
    .sort({ dueDate: 1 });

  res.json({ success: true, count: filings.length, filings });
});

// POST /api/filings — admin creates a new filing record
const createFiling = asyncHandler(async (req, res) => {
  const { client, type, period, dueDate, accountant } = req.body;

  if (!client || !type || !period || !dueDate) {
    res.status(400);
    throw new Error("client, type, period and dueDate are required");
  }

  const filing = await Filing.create({ client, type, period, dueDate, accountant });
  res.status(201).json({ success: true, message: "Filing created", filing });
});

// PUT /api/filings/:id — update filing status or upload acknowledgement
const updateFiling = asyncHandler(async (req, res) => {
  const filing = await Filing.findById(req.params.id);
  if (!filing) { res.status(404); throw new Error("Filing not found"); }

  // Update whichever fields are sent
  const fields = ["status", "filedDate", "acknowledgementNumber", "acknowledgementUrl", "remarks", "accountant"];
  fields.forEach((f) => { if (req.body[f] !== undefined) filing[f] = req.body[f]; });

  // If marking as Filed, set filedDate automatically if not provided
  if (req.body.status === "Filed" && !filing.filedDate) {
    filing.filedDate = new Date();
  }

  const updated = await filing.save();
  res.json({ success: true, message: "Filing updated", filing: updated });
});

// DELETE /api/filings/:id — admin only
const deleteFiling = asyncHandler(async (req, res) => {
  const filing = await Filing.findById(req.params.id);
  if (!filing) { res.status(404); throw new Error("Filing not found"); }
  await filing.deleteOne();
  res.json({ success: true, message: "Filing deleted" });
});

module.exports = { getFilings, createFiling, updateFiling, deleteFiling };
