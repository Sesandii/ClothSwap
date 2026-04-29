const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    getConversations,
    getConversationByUser,
    sendMessage,
} = require("../controllers/messageController");

router.get("/conversations", authMiddleware, getConversations);
router.get("/conversations/:userId", authMiddleware, getConversationByUser);
router.post("/conversations/:userId/messages", authMiddleware, sendMessage);

module.exports = router;