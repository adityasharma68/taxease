// ─── routes/filingRoutes.js ──────────────────────────────────────────────────

const express = require("express");
const router  = express.Router();
const { getFilings, createFiling, updateFiling, deleteFiling } = require("../controllers/filingController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/",     getFilings);
router.post("/",    authorizeRoles("admin"), createFiling);
router.put("/:id",  authorizeRoles("admin", "accountant"), updateFiling);
router.delete("/:id", authorizeRoles("admin"), deleteFiling);

module.exports = router;
