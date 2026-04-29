// ─── routes/documentRoutes.js ────────────────────────────────────────────────

const express = require("express");
const router  = express.Router();
const { uploadDocuments, getDocuments, updateDocumentStatus, deleteDocument } = require("../controllers/documentController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

router.use(protect);

// POST /api/documents/upload — upload files (up to 5 at once)
router.post("/upload", upload.array("files", 5), uploadDocuments);

// GET  /api/documents        — fetch documents
router.get("/", getDocuments);

// PUT  /api/documents/:id/status — change verification status (admin/accountant)
router.put("/:id/status", authorizeRoles("admin", "accountant"), updateDocumentStatus);

// DELETE /api/documents/:id  — delete a document
router.delete("/:id", deleteDocument);

module.exports = router;
