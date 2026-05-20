const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createClothesItem,
  getAllClothes,
  getPublicCategories,
  getCurrentUserClothes,
  getClothesById,
  updateClothesItem,
  updateClothesStatus,
  relistClothesItem,
  deleteClothesItem,
} = require("../controllers/clothesController");

router.post("/", authMiddleware, createClothesItem);
router.get("/categories", getPublicCategories);
router.get("/", getAllClothes);
router.get("/me", authMiddleware, getCurrentUserClothes);
router.get("/:id", getClothesById);
router.put("/:id", authMiddleware, updateClothesItem);
router.patch("/:id/status", authMiddleware, updateClothesStatus);
router.patch("/:id/relist", authMiddleware, relistClothesItem);
router.delete("/:id", authMiddleware, deleteClothesItem);

module.exports = router;
