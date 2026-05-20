const Clothes = require("../models/Clothes");
const SwapRequest = require("../models/SwapRequest");
const AdminSetting = require("../models/AdminSetting");
const Category = require("../models/Category");
const { transferCompletedSwapOwnership } = require("../utils/completeSwapOwnership");

const toObjectId = (value) => value && value.toString();
const DEFAULT_CATEGORY_SIZES = {
  Tops: ["XS", "S", "M", "L", "XL", "XXL"],
  Bottoms: ["XS", "S", "M", "L", "XL", "XXL"],
  Dresses: ["XS", "S", "M", "L", "XL", "XXL"],
  Outerwear: ["XS", "S", "M", "L", "XL", "XXL"],
  Shoes: ["4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
  Accessories: ["One Size"],
  Shirts: ["XS", "S", "M", "L", "XL", "XXL"],
  Pants: ["XS", "S", "M", "L", "XL", "XXL"],
  Jackets: ["XS", "S", "M", "L", "XL", "XXL"],
  Sweaters: ["XS", "S", "M", "L", "XL", "XXL"],
  Skirts: ["XS", "S", "M", "L", "XL", "XXL"],
};
const DEFAULT_CATEGORIES = Object.keys(DEFAULT_CATEGORY_SIZES);
const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];

const normalizeSizes = (sizes, categoryName) => {
  const source = Array.isArray(sizes) ? sizes : [];
  const normalized = source.map((size) => String(size).trim()).filter(Boolean);

  return Array.from(new Set(normalized.length > 0 ? normalized : DEFAULT_CATEGORY_SIZES[categoryName] || DEFAULT_SIZES));
};

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
    const settings = await AdminSetting.findOne({ key: "main" });
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
      approvalStatus: settings?.autoApproveListings === false ? "pending" : "approved",
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
      approvalStatus: "approved",
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

    if (clothesItem.status === "swapped") {
      return res.status(400).json({
        message: "Swapped items cannot be changed",
      });
    }

    clothesItem.status = status;

    await clothesItem.save();

    return res.json(clothesItem);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const relistClothesItem = async (req, res) => {
  try {
    const clothesItem = await Clothes.findById(req.params.id);

    if (!clothesItem) {
      return res.status(404).json({ message: "Clothes item not found" });
    }

    if (toObjectId(clothesItem.user) !== toObjectId(req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (clothesItem.status !== "swapped") {
      return res.status(400).json({
        message: "Only swapped items can be relisted",
      });
    }

    if (!Array.isArray(clothesItem.images) || clothesItem.images.length === 0) {
      return res.status(400).json({
        message: "Add at least one photo before relisting this item",
      });
    }

    clothesItem.status = "available";
    clothesItem.createdAt = new Date();

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

const getPublicCategories = async (req, res) => {
  try {
    const distinctCategories = await Clothes.distinct("category");
    const existingCategories = await Category.find({
      name: { $in: [...DEFAULT_CATEGORIES, ...distinctCategories.filter(Boolean)] },
    }).select("name");
    const existingNames = new Set(existingCategories.map((category) => category.name));
    const missingCategories = [...DEFAULT_CATEGORIES, ...distinctCategories.filter(Boolean)]
      .filter((name, index, names) => names.indexOf(name) === index)
      .filter((name) => !existingNames.has(name))
      .map((name) => ({ name, sizes: normalizeSizes(undefined, name) }));

    if (missingCategories.length > 0) {
      await Category.insertMany(missingCategories, { ordered: false }).catch((error) => {
        if (error.code !== 11000) {
          throw error;
        }
      });
    }

    const categories = await Category.find().sort({ name: 1 }).select("name sizes");

    return res.json(
      categories.map((category) => ({
        _id: category._id,
        name: category.name,
        sizes: normalizeSizes(category.sizes, category.name),
      }))
    );
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
  getPublicCategories,
  getCurrentUserClothes,
  getClothesById,
  updateClothesItem,
  updateClothesStatus,
  relistClothesItem,
  deleteClothesItem,
};
