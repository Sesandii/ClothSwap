const mongoose = require("mongoose");

const adminSettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: "main",
  },
  platformName: {
    type: String,
    default: "ClothSwap",
  },
  contactEmail: {
    type: String,
    default: "support@clothswap.com",
  },
  maxImagesPerListing: {
    type: Number,
    default: 5,
  },
  autoApproveListings: {
    type: Boolean,
    default: true,
  },
  notifications: {
    emailNotifications: { type: Boolean, default: true },
    newSwapAlerts: { type: Boolean, default: false },
    complaintAlerts: { type: Boolean, default: true },
    newUserAlerts: { type: Boolean, default: false },
  },
});

module.exports = mongoose.model("AdminSetting", adminSettingSchema);
