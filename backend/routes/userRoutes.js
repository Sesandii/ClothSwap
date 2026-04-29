// backend/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const validateUserInput = require("../middleware/validateInput");
const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/userController");

router.post("/register", validateUserInput, registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
