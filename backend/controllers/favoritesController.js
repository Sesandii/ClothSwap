const Favorites = require("../models/Favorites");
const Clothes = require("../models/Clothes");

// Toggle favorite - add or remove
const toggleFavorite = async (req, res) => {
    const { clothesId } = req.params;
    const userId = req.user;

    try {
        // Check if clothes exists
        const clothes = await Clothes.findById(clothesId);
        if (!clothes) {
            return res.status(404).json({ message: "Clothes not found" });
        }

        // Check if user is the owner of the item
        if (clothes.user.toString() === userId.toString()) {
            return res.status(403).json({
                message: "You cannot favorite your own items"
            });
        }

        // Check if already favorited
        const existingFavorite = await Favorites.findOne({
            user: userId,
            clothes: clothesId,
        });

        if (existingFavorite) {
            // Remove from favorites
            await Favorites.deleteOne({ _id: existingFavorite._id });
            return res.status(200).json({
                message: "Removed from favorites",
                isFavorite: false,
            });
        } else {
            // Add to favorites
            const newFavorite = new Favorites({
                user: userId,
                clothes: clothesId,
            });
            await newFavorite.save();
            return res.status(201).json({
                message: "Added to favorites",
                isFavorite: true,
            });
        }
    } catch (err) {
        console.error("Error toggling favorite:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Get user's favorite clothes
const getUserFavorites = async (req, res) => {
    const userId = req.user;

    try {
        const favorites = await Favorites.find({ user: userId })
            .populate({
                path: "clothes",
                populate: {
                    path: "user",
                    select: "name location profilePic",
                },
            })
            .sort({ createdAt: -1 });

        const clothesArray = favorites.map((fav) => fav.clothes);
        return res.status(200).json(clothesArray);
    } catch (err) {
        console.error("Error fetching favorites:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Check if specific clothes is favorited by user
const isFavorited = async (req, res) => {
    const { clothesId } = req.params;
    const userId = req.user;

    try {
        const favorite = await Favorites.findOne({
            user: userId,
            clothes: clothesId,
        });

        return res.status(200).json({
            isFavorite: !!favorite,
        });
    } catch (err) {
        console.error("Error checking favorite:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Remove from favorites
const removeFavorite = async (req, res) => {
    const { clothesId } = req.params;
    const userId = req.user;

    try {
        const result = await Favorites.deleteOne({
            user: userId,
            clothes: clothesId,
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Favorite not found" });
        }

        return res.status(200).json({ message: "Removed from favorites" });
    } catch (err) {
        console.error("Error removing favorite:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    toggleFavorite,
    getUserFavorites,
    isFavorited,
    removeFavorite,
};
