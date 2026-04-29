// ─── controllers/documentController.js ──────────────────────────────────────
// Handles file uploads, retrieval and management
// ─────────────────────────────────────────────────────────────────────────────

const asyncHandler = require("express-async-handler");
const Document = require("../models/Document");
const { cloudinary } = require("../config/cloudinary");

// ─── @route  POST /api/documents/upload ──────────────────────────────────────
// @desc    Upload one or more documents (client uploads their own)
// @access  Private/Client
const uploadDocuments = asyncHandler(async (req, res) => {
  // req.files is populated by multer after successful upload to Cloudinary
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("Please select at least one file to upload");
  }

  const { category, period, notes } = req.body;

  if (!category || !period) {
    res.status(400);
    throw new Error("Category and period are required");
  }

  // Create a Document record in MongoDB for each uploaded file
  const savedDocs = await Promise.all(
    req.files.map((file) =>
      Document.create({
        client:   req.user._id,
        name:     file.originalname,
        fileUrl:  file.path,          // Cloudinary URL
        publicId: file.filename,      // Cloudinary public ID
        size:     `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        category,
        period,
        notes: notes || "",
      })
    )
  );

  res.status(201).json({
    success: true,
    message: `${savedDocs.length} document(s) uploaded successfully`,
    documents: savedDocs,
  });
});

// ─── @route  GET /api/documents ──────────────────────────────────────────────
// @desc    Get documents — clients see own, admins/accountants see all/filtered
// @access  Private
const getDocuments = asyncHandler(async (req, res) => {
  let query = {};

  if (req.user.role === "client") {
    // Clients can only see their own documents
    query.client = req.user._id;
  } else if (req.query.clientId) {
    // Admins/accountants can filter by a specific client
    query.client = req.query.clientId;
  }

  // Optional filters
  if (req.query.category) query.category = req.query.category;
  if (req.query.status)   query.status   = req.query.status;

  const documents = await Document.find(query)
    .populate("client", "name email gstin")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: documents.length, documents });
});

// ─── @route  PUT /api/documents/:id/status ───────────────────────────────────
// @desc    Update document verification status (accountant/admin only)
// @access  Private/Accountant/Admin
const updateDocumentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const allowed = ["Pending", "Verified", "Rejected"];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  const doc = await Document.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!doc) {
    res.status(404);
    throw new Error("Document not found");
  }

  res.json({ success: true, message: "Document status updated", document: doc });
});

// ─── @route  DELETE /api/documents/:id ───────────────────────────────────────
// @desc    Delete a document (client deletes own, admin deletes any)
// @access  Private
const deleteDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findById(req.params.id);

  if (!doc) {
    res.status(404);
    throw new Error("Document not found");
  }

  // Ensure client can only delete their own documents
  if (req.user.role === "client" && doc.client.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this document");
  }

  // Delete from Cloudinary if we have the public ID
  if (doc.publicId) {
    await cloudinary.uploader.destroy(doc.publicId, { resource_type: "auto" });
  }

  await doc.deleteOne();

  res.json({ success: true, message: "Document deleted successfully" });
});

module.exports = { uploadDocuments, getDocuments, updateDocumentStatus, deleteDocument };
