const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createSwapRequest,
  getMySwapRequests,
  getSwapRequestById,
  getAllSwapRequests,
  updateSwapRequestStatus,
  updateExchangeMethod,
  getMyReviews,
  createReview,
} = require("../controllers/swapRequestController");

router.post("/", authMiddleware, createSwapRequest);
router.get("/mine", authMiddleware, getMySwapRequests);
router.get("/reviews/mine", authMiddleware, getMyReviews);
router.get("/", getAllSwapRequests);
router.get("/:id", authMiddleware, getSwapRequestById);
router.patch("/:id/status", authMiddleware, updateSwapRequestStatus);
router.patch("/:id/exchange-method", authMiddleware, updateExchangeMethod);
router.post("/:id/reviews", authMiddleware, createReview);

module.exports = router;
