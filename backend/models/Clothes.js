const mongoose = require("mongoose");

const clothesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "swapped", "hidden"],
    default: "available",
  },
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "approved",
  },
  receivedFromSwap: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SwapRequest",
    default: null,
  },
  gender: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  images: [String], // Array to hold URLs of images
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Clothes", clothesSchema);
