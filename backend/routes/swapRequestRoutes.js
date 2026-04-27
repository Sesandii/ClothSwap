const express = require("express");
const router = express.Router();
const SwapRequest = require("../models/SwapRequest");

// Create a new swap request
router.post("/", async (req, res) => {
  const { requester, offeredClothes, requestedClothes } = req.body;

  try {
    const newSwapRequest = new SwapRequest({
      requester,
      offeredClothes,
      requestedClothes,
    });

    await newSwapRequest.save();
    res.status(201).json({ message: "Swap request created" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all swap requests
router.get("/", async (req, res) => {
  try {
    const swapRequests = await SwapRequest.find();
    res.json(swapRequests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;