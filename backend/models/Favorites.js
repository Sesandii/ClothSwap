const mongoose = require("mongoose");

const favoritesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    clothes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clothes",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Ensure a user can only favorite an item once
favoritesSchema.index({ user: 1, clothes: 1 }, { unique: true });

module.exports = mongoose.model("Favorites", favoritesSchema);
