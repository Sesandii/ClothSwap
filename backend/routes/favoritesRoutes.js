const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    toggleFavorite,
    getUserFavorites,
    isFavorited,
    removeFavorite,
} = require("../controllers/favoritesController");

// Toggle favorite status
router.post("/:clothesId", authMiddleware, toggleFavorite);

// Get user's favorites
router.get("/", authMiddleware, getUserFavorites);

// Check if specific clothes is favorited
router.get("/check/:clothesId", authMiddleware, isFavorited);

// Remove from favorites
router.delete("/:clothesId", authMiddleware, removeFavorite);

module.exports = router;
