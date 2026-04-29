const SwapRequest = require("../models/SwapRequest");
const Clothes = require("../models/Clothes");
const User = require("../models/User");

const swapRequestPopulation = [
  {
    path: "requester",
    select: "name location profilePic",
  },
  {
    path: "offeredClothes",
    populate: {
      path: "user",
      select: "name location profilePic",
    },
  },
  {
    path: "requestedClothes",
    populate: {
      path: "user",
      select: "name location profilePic",
    },
  },
];

const createSwapRequest = async (req, res) => {
  const { offeredClothes, requestedClothes, message } = req.body;

  try {
    const [requester, offeredItem, requestedItem] = await Promise.all([
      User.findById(req.user),
      Clothes.findById(offeredClothes),
      Clothes.findById(requestedClothes),
    ]);

    if (!requester) {
      return res.status(401).json({ message: "Requester not found" });
    }

    if (!offeredItem || !requestedItem) {
      return res
        .status(404)
        .json({ message: "One or more clothes items were not found" });
    }

    if (offeredItem.user.toString() !== req.user.toString()) {
      return res.status(403).json({ message: "You can only offer your own clothes" });
    }

    if (requestedItem.user.toString() === req.user.toString()) {
      return res
        .status(403)
        .json({ message: "You cannot request a swap for your own item" });
    }

    if (offeredItem.status !== "available" || requestedItem.status !== "available") {
      return res.status(400).json({ message: "Only available items can be swapped" });
    }

    const newSwapRequest = new SwapRequest({
      requester: req.user,
      offeredClothes,
      requestedClothes,
      message,
    });

    const savedSwapRequest = await newSwapRequest.save();
    const populatedSwapRequest = await SwapRequest.findById(savedSwapRequest._id)
      .populate(swapRequestPopulation)
      .exec();

    return res.status(201).json(populatedSwapRequest || savedSwapRequest);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllSwapRequests = async (req, res) => {
  try {
    const swapRequests = await SwapRequest.find()
      .populate(swapRequestPopulation)
      .sort({ createdAt: -1 });

    return res.json(swapRequests);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createSwapRequest,
  getAllSwapRequests,
};
