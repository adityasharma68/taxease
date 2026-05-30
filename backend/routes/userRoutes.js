const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getAllUsers, getUserById, updateUser, updateAvatar,
  changeEmail, changePassword, deleteUser, assignAccountant,
} = require("../controllers/userController");

router.use(protect);

// Avatar multer
const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Images only"), false);
  },
}).single("avatar");

// ── GET /api/users
// Admin → all users
// Accountant → only their assigned clients (filtered in controller)
// Client/others → 403
router.get("/",
  authorizeRoles("admin", "accountant"),
  getAllUsers
);

router.get   ("/:id",         getUserById);
router.put   ("/:id",         updateUser);
router.put   ("/:id/avatar",  (req, res, next) => { avatarUpload(req, res, err => { if (err) return res.status(400).json({ success:false, message:err.message }); next(); }); }, updateAvatar);
router.put   ("/:id/email",   changeEmail);
router.put   ("/:id/password",changePassword);
router.delete("/:id",         authorizeRoles("admin"), deleteUser);
router.put   ("/:id/assign",  authorizeRoles("admin"), assignAccountant);

module.exports = router;
