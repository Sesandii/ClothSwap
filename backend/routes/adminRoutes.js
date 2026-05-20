const express = require("express");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getDashboard,
  getUsers,
  updateUserStatus,
  deleteUser,
  getClothes,
  updateClothesApproval,
  deleteClothes,
  getSwaps,
  updateSwap,
  deleteSwap,
  getComplaints,
  updateComplaintStatus,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getReviews,
  deleteReview,
  getSettings,
  updateSettings,
  createCollectionPoint,
  updateCollectionPoint,
  deleteCollectionPoint,
} = require("../controllers/adminController");

const router = express.Router();

router.use(adminMiddleware);

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.patch("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);
router.get("/clothes", getClothes);
router.patch("/clothes/:id/approval", updateClothesApproval);
router.delete("/clothes/:id", deleteClothes);
router.get("/swaps", getSwaps);
router.patch("/swaps/:id", updateSwap);
router.delete("/swaps/:id", deleteSwap);
router.get("/complaints", getComplaints);
router.patch("/complaints/:id/status", updateComplaintStatus);
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);
router.get("/reviews", getReviews);
router.delete("/reviews/:id", deleteReview);
router.get("/settings", getSettings);
router.put("/settings", updateSettings);
router.post("/collection-points", createCollectionPoint);
router.put("/collection-points/:id", updateCollectionPoint);
router.delete("/collection-points/:id", deleteCollectionPoint);

module.exports = router;
