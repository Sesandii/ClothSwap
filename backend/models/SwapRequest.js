const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  offeredClothes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clothes",
    required: true,
  },
  requestedClothes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clothes",
    required: true,
  },
  message: {
    type: String,
    default: "",
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SwapRequest", swapRequestSchema);
