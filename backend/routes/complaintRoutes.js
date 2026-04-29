const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getMyComplaints,
  createComplaint,
} = require("../controllers/complaintController");

router.get("/mine", authMiddleware, getMyComplaints);
router.post("/", authMiddleware, createComplaint);

module.exports = router;
