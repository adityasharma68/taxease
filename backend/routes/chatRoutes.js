// ─── routes/chatRoutes.js ────────────────────────────────────────────────────

const express = require("express");
const router  = express.Router();
const { getMessages, sendMessage, getUnreadCount } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/unread",    getUnreadCount);          // GET  /api/chat/unread
router.get("/:userId",   getMessages);             // GET  /api/chat/:userId
router.post("/send",     sendMessage);             // POST /api/chat/send

module.exports = router;
