const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  swapRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SwapRequest",
    required: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "investigating", "resolved"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.model("Complaint", complaintSchema);
