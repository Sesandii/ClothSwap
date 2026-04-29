const Clothes = require("../models/Clothes");

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
    const clothes = await Clothes.find()
      .populate("user", "name location profilePic")
      .sort({ createdAt: -1 });

    return res.json(clothes);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getCurrentUserClothes = async (req, res) => {
  try {
    const clothes = await Clothes.find({ user: req.user })
      .populate("user", "name location profilePic")
      .sort({ createdAt: -1 });

    return res.json(clothes);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
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
