// ─── routes/taskRoutes.js ────────────────────────────────────────────────────

const express = require("express");
const router  = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/",       authorizeRoles("admin", "accountant"), getTasks);
router.post("/",      authorizeRoles("admin"), createTask);
router.put("/:id",    authorizeRoles("admin", "accountant"), updateTask);
router.delete("/:id", authorizeRoles("admin"), deleteTask);

module.exports = router;
