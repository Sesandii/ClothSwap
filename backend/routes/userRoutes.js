// backend/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const validateUserInput = require("../middleware/validateInput");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUser,
} = require("../controllers/userController");

router.post("/register", validateUserInput, registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getCurrentUser);
router.put("/me", authMiddleware, updateUser);

module.exports = router;
