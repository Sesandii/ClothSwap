const Clothes = require("../models/Clothes");
const SwapRequest = require("../models/SwapRequest");
const { transferCompletedSwapOwnership } = require("../utils/completeSwapOwnership");

const toObjectId = (value) => value && value.toString();

const createClothesItem = async (req, res) => {
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

    return res.status(201).json(populatedClothes);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllClothes = async (req, res) => {
  try {
    const clothes = await Clothes.find({
      status: "available",
      "images.0": { $exists: true },
    })
      .populate("user", "name location profilePic")
      .sort({ createdAt: -1 });

    return res.json(clothes);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getCurrentUserClothes = async (req, res) => {
  try {
    await reconcileCompletedSwapOwnership(req.user);

    const clothes = await Clothes.find({ user: req.user })
      .populate("user", "name location profilePic")
      .sort({ createdAt: -1 });

    return res.json(clothes);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const reconcileCompletedSwapOwnership = async (userId) => {
  const ownedClothes = await Clothes.find({ user: userId }).select("_id");
  const ownedClothesIds = ownedClothes.map((item) => item._id);

  const completedSwaps = await SwapRequest.find({
    status: "completed",
    $or: [
      { requester: userId },
      { offeredOwner: userId },
      { requestedOwner: userId },
      { offeredClothes: { $in: ownedClothesIds } },
      { requestedClothes: { $in: ownedClothesIds } },
    ],
  })
    .populate("offeredClothes", "user")
    .populate("requestedClothes", "user");

  await Promise.all(
    completedSwaps.map((swapRequest) => transferCompletedSwapOwnership(swapRequest))
  );
};

const getClothesById = async (req, res) => {
  try {
    const clothesItem = await Clothes.findById(req.params.id).populate(
      "user",
      "name location profilePic"
    );

    if (!clothesItem) {
      return res.status(404).json({ message: "Clothes item not found" });
    }

    return res.json(clothesItem);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ message: "Clothes item not found" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

const updateClothesItem = async (req, res) => {
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
    const clothesItem = await Clothes.findById(req.params.id);

    if (!clothesItem) {
      return res.status(404).json({ message: "Clothes item not found" });
    }

    if (toObjectId(clothesItem.user) !== toObjectId(req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    clothesItem.title = title;
    clothesItem.brand = brand;
    clothesItem.description = description;
    clothesItem.size = size;
    clothesItem.category = category;
    clothesItem.condition = condition;
    clothesItem.gender = gender;
    clothesItem.color = color;
    clothesItem.location = location;
    clothesItem.images = Array.isArray(images) ? images : clothesItem.images;

    await clothesItem.save();

    const populatedClothes = await Clothes.findById(clothesItem._id).populate(
      "user",
      "name location profilePic"
    );

    return res.json(populatedClothes);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ message: "Clothes item not found" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

const updateClothesStatus = async (req, res) => {
  const { status } = req.body;

  if (!["available", "hidden"].includes(status)) {
    return res.status(400).json({
      message: "Items can only be marked available or hidden from your wardrobe",
    });
  }

  try {
    const clothesItem = await Clothes.findById(req.params.id);

    if (!clothesItem) {
      return res.status(404).json({ message: "Clothes item not found" });
    }

    if (toObjectId(clothesItem.user) !== toObjectId(req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const wasReceivedFromSwap = clothesItem.status === "swapped";

    clothesItem.status = status;

    if (wasReceivedFromSwap && status === "available") {
      clothesItem.relistedAt = new Date();
    }

    await clothesItem.save();

    return res.json(clothesItem);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteClothesItem = async (req, res) => {
  try {
    const clothesItem = await Clothes.findById(req.params.id);

    if (!clothesItem) {
      return res.status(404).json({ message: "Clothes item not found" });
    }

    if (toObjectId(clothesItem.user) !== toObjectId(req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await clothesItem.deleteOne();

    return res.json({ message: "Clothes item deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createClothesItem,
  getAllClothes,
  getCurrentUserClothes,
  getClothesById,
  updateClothesItem,
  updateClothesStatus,
  deleteClothesItem,
};
