const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createClothesItem,
  getAllClothes,
  getCurrentUserClothes,
  getClothesById,
  updateClothesItem,
  updateClothesStatus,
  deleteClothesItem,
} = require("../controllers/clothesController");

router.post("/", authMiddleware, createClothesItem);
router.get("/", getAllClothes);
router.get("/me", authMiddleware, getCurrentUserClothes);
router.get("/:id", getClothesById);
router.put("/:id", authMiddleware, updateClothesItem);
router.patch("/:id/status", authMiddleware, updateClothesStatus);
router.delete("/:id", authMiddleware, deleteClothesItem);

module.exports = router;
