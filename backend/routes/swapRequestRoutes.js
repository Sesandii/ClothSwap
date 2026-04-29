const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createSwapRequest,
  getAllSwapRequests,
} = require("../controllers/swapRequestController");

router.post("/", authMiddleware, createSwapRequest);
router.get("/", getAllSwapRequests);

module.exports = router;
