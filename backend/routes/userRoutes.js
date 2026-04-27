// backend/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const validateUserInput = require("../middleware/validateInput"); // Import validation middleware

const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

// Register user with input validation
router.post("/register", validateUserInput, async (req, res) => {
  const { name, email, password, phone, location } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      location,
    });

    const savedUser = await newUser.save();
    const token = createToken(savedUser._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        location: savedUser.location,
        profilePic: savedUser.profilePic,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login user (no validation needed)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("name email phone location profilePic createdAt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;