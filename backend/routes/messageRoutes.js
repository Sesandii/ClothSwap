const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    getConversations,
    getUnreadMessageCount,
    getConversationByUser,
    markMessagesReadByUser,
    sendMessage,
} = require("../controllers/messageController");

router.get("/unread-count", authMiddleware, getUnreadMessageCount);
router.get("/conversations", authMiddleware, getConversations);
router.get("/conversations/:userId", authMiddleware, getConversationByUser);
router.patch("/conversations/:userId/read", authMiddleware, markMessagesReadByUser);
router.post("/conversations/:userId/messages", authMiddleware, sendMessage);

module.exports = router;
