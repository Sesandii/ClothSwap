const express = require("express");
const router = express.Router();
const Clothes = require("../models/Clothes");
const authMiddleware = require("../middleware/authMiddleware");

const toObjectId = (value) => value && value.toString();

// Add new clothes item
router.post("/", authMiddleware, async (req, res) => {
  const {
    title,
    brand,
    description,
    size,
    category,
    condition,
    gender,
    color,
    location,
    images,
  } = req.body;

  try {
    const newClothes = new Clothes({
      title,
      brand,
      description,
      size,
      category,
      condition,
      gender,
      color,
      location,
      images,
      user: req.user,
    });

    const savedClothes = await newClothes.save();
    const populatedClothes = await Clothes.findById(savedClothes._id).populate(
      "user",
      "name location profilePic"
    );

    res.status(201).json(populatedClothes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all clothes items
router.get("/", async (req, res) => {
  try {
    const clothes = await Clothes.find()
      .populate("user", "name location profilePic")
      .sort({ createdAt: -1 });
    res.json(clothes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get current user's clothes
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const clothes = await Clothes.find({ user: req.user })
      .populate("user", "name location profilePic")
      .sort({ createdAt: -1 });

    res.json(clothes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single clothes item by ID
router.get("/:id", async (req, res) => {
  try {
    const clothesItem = await Clothes.findById(req.params.id).populate(
      "user",
      "name location profilePic"
    );

    if (!clothesItem) {
      return res.status(404).json({ message: "Clothes item not found" });
    }

    res.json(clothesItem);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ message: "Clothes item not found" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

// Update clothes status
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const clothesItem = await Clothes.findById(req.params.id);

    if (!clothesItem) {
      return res.status(404).json({ message: "Clothes item not found" });
    }

    if (toObjectId(clothesItem.user) !== toObjectId(req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    clothesItem.status = req.body.status;
    await clothesItem.save();

    res.json(clothesItem);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a clothes item
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const clothesItem = await Clothes.findById(req.params.id);

    if (!clothesItem) {
      return res.status(404).json({ message: "Clothes item not found" });
    }

    if (toObjectId(clothesItem.user) !== toObjectId(req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await clothesItem.deleteOne();
    res.json({ message: "Clothes item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;