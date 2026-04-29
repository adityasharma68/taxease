// ─── config/cloudinary.js ────────────────────────────────────────────────────
// Configures Cloudinary for file uploads + multer-storage-cloudinary
// ─────────────────────────────────────────────────────────────────────────────

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Cloudinary Storage for Multer ───────────────────────────────────────────
// Files will be stored in Cloudinary under the "taxease/documents" folder
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "taxease/documents",
    // Use original filename (sanitised) as the public ID
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
    // Allow PDFs and common image/document formats
    allowed_formats: ["pdf", "jpg", "jpeg", "png", "xlsx", "xls", "docx", "doc"],
    resource_type: "auto", // Cloudinary auto-detects the type
  }),
});

// ─── File Filter ─────────────────────────────────────────────────────────────
// Reject files that are not in the allowed list
const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type. Only PDF, images, Excel and Word files are allowed."), false);
  }
};

// ─── Export configured multer upload middleware ───────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max per file
});

module.exports = { cloudinary, upload };
