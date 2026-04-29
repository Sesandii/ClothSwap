const SwapRequest = require("../models/SwapRequest");
const Clothes = require("../models/Clothes");
const User = require("../models/User");
const Review = require("../models/Review");
const createNotification = require("../utils/createNotification");

const swapRequestPopulation = [
  {
    path: "requester",
    select: "name location profilePic",
  },
  {
    path: "offeredOwner",
    select: "name location profilePic",
  },
  {
    path: "requestedOwner",
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

    const existingOffer = await SwapRequest.findOne({
      offeredClothes,
      status: { $in: ["pending", "accepted"] },
    });

    if (existingOffer) {
      return res.status(409).json({
        message:
          "This item is already offered in another active swap request. Please choose a different item.",
      });
    }

    const newSwapRequest = new SwapRequest({
      requester: req.user,
      offeredOwner: offeredItem.user,
      requestedOwner: requestedItem.user,
      offeredClothes,
      requestedClothes,
      message,
    });

    const savedSwapRequest = await newSwapRequest.save();
    const populatedSwapRequest = await SwapRequest.findById(savedSwapRequest._id)
      .populate(swapRequestPopulation)
      .exec();

    await createNotification({
      user: requestedItem.user,
      actor: req.user,
      type: "swap_request",
      title: "New Swap Request",
      message: `${requester.name || "Someone"} wants to swap for ${requestedItem.title}.`,
      link: "/my-swaps",
      metadata: {
        swapRequest: savedSwapRequest._id,
        offeredClothes,
        requestedClothes,
      },
    });

    return res.status(201).json(populatedSwapRequest || savedSwapRequest);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getMySwapRequests = async (req, res) => {
  try {
    const myClothes = await Clothes.find({ user: req.user }).select("_id");
    const myClothesIds = myClothes.map((item) => item._id);

    const swapRequests = await SwapRequest.find({
      $or: [
        { requester: req.user },
        { offeredOwner: req.user },
        { requestedOwner: req.user },
        { requestedClothes: { $in: myClothesIds } },
      ],
    })
      .populate(swapRequestPopulation)
      .sort({ createdAt: -1 });

    return res.json(swapRequests);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getSwapRequestById = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id)
      .populate(swapRequestPopulation)
      .exec();

    if (!swapRequest) {
      return res.status(404).json({ message: "Swap request not found" });
    }

    if (!isParticipant(swapRequest, req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    return res.json(swapRequest);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ message: "Swap request not found" });
    }

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

const updateSwapRequestStatus = async (req, res) => {
  const { status } = req.body;

  if (!["accepted", "rejected", "completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid swap status" });
  }

  try {
    const swapRequest = await SwapRequest.findById(req.params.id)
      .populate(swapRequestPopulation)
      .exec();

    if (!swapRequest) {
      return res.status(404).json({ message: "Swap request not found" });
    }

    if (!isParticipant(swapRequest, req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    ensureParticipantSnapshots(swapRequest);

    const requestedOwner = getRequestedOwnerId(swapRequest);
    const isRequestedOwner = requestedOwner === req.user.toString();

    if (["accepted", "rejected"].includes(status)) {
      if (!isRequestedOwner) {
        return res.status(403).json({
          message: "Only the requested item owner can accept or reject this swap",
        });
      }

      if (swapRequest.status !== "pending") {
        return res.status(400).json({ message: "Only pending swaps can be updated" });
      }

      swapRequest.status = status;
      await swapRequest.save();

      if (status === "accepted") {
        await SwapRequest.updateMany(
          {
            _id: { $ne: swapRequest._id },
            status: "pending",
            $or: [
              { offeredClothes: { $in: [swapRequest.offeredClothes._id, swapRequest.requestedClothes._id] } },
              { requestedClothes: { $in: [swapRequest.offeredClothes._id, swapRequest.requestedClothes._id] } },
            ],
          },
          { $set: { status: "rejected" } }
        );
      }

      await notifyStatusChange(swapRequest, req.user, status);
      return res.json(await populateSwapRequest(swapRequest._id));
    }

    if (swapRequest.status !== "accepted") {
      return res.status(400).json({ message: "Only accepted swaps can be completed" });
    }

    swapRequest.status = "completed";
    swapRequest.completedAt = new Date();
    const offeredItemId = swapRequest.offeredClothes._id;
    const requestedItemId = swapRequest.requestedClothes._id;
    const offeredOwnerId = getOfferedOwnerId(swapRequest);
    const requestedOwnerId = getRequestedOwnerId(swapRequest);

    await Promise.all([
      swapRequest.save(),
      Clothes.findByIdAndUpdate(offeredItemId, {
        $set: { user: requestedOwnerId, status: "swapped" },
      }),
      Clothes.findByIdAndUpdate(requestedItemId, {
        $set: { user: offeredOwnerId, status: "swapped" },
      }),
    ]);

    await notifyStatusChange(swapRequest, req.user, "completed");
    return res.json(await populateSwapRequest(swapRequest._id));
  } catch (err) {
    if (err.message === "Meetup date cannot be in the past") {
      return res.status(400).json({ message: err.message });
    }

    if (err.name === "CastError") {
      return res.status(404).json({ message: "Swap request not found" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

const updateExchangeMethod = async (req, res) => {
  const { method, details } = req.body;

  if (!["meetup", "delivery", "collection"].includes(method)) {
    return res.status(400).json({ message: "Invalid exchange method" });
  }

  try {
    const swapRequest = await SwapRequest.findById(req.params.id)
      .populate(swapRequestPopulation)
      .exec();

    if (!swapRequest) {
      return res.status(404).json({ message: "Swap request not found" });
    }

    if (!isParticipant(swapRequest, req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    ensureParticipantSnapshots(swapRequest);

    if (swapRequest.status !== "accepted") {
      return res.status(400).json({
        message: "Choose an exchange method after the swap is accepted",
      });
    }

    swapRequest.exchangeMethod = {
      method,
      details: sanitizeExchangeDetails(method, details || {}),
      confirmedAt: new Date(),
    };

    await swapRequest.save();
    await notifyStatusChange(swapRequest, req.user, "exchange_method");

    return res.json(await populateSwapRequest(swapRequest._id));
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ message: "Swap request not found" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.user })
      .populate("reviewee", "name location profilePic")
      .populate({
        path: "swapRequest",
        populate: swapRequestPopulation,
      })
      .sort({ createdAt: -1 });

    return res.json(reviews);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const numericRating = Number(rating);

  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const swapRequest = await SwapRequest.findById(req.params.id)
      .populate(swapRequestPopulation)
      .exec();

    if (!swapRequest) {
      return res.status(404).json({ message: "Swap request not found" });
    }

    if (!isParticipant(swapRequest, req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (swapRequest.status !== "completed") {
      return res.status(400).json({ message: "Only completed swaps can be reviewed" });
    }

    const reviewee = getOtherParticipantId(swapRequest, req.user);

    const review = await Review.create({
      swapRequest: swapRequest._id,
      reviewer: req.user,
      reviewee,
      rating: numericRating,
      comment,
    });

    await createNotification({
      user: reviewee,
      actor: req.user,
      type: "review_received",
      title: "New Review",
      message: "You received a review for a completed swap.",
      link: "/reviews",
      metadata: { swapRequest: swapRequest._id, review: review._id },
    });

    const populatedReview = await Review.findById(review._id)
      .populate("reviewee", "name location profilePic")
      .populate({
        path: "swapRequest",
        populate: swapRequestPopulation,
      });

    return res.status(201).json(populatedReview);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You already reviewed this swap" });
    }

    if (err.name === "CastError") {
      return res.status(404).json({ message: "Swap request not found" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

const populateSwapRequest = (id) =>
  SwapRequest.findById(id).populate(swapRequestPopulation).exec();

const isParticipant = (swapRequest, userId) => {
  const requesterId = getOfferedOwnerId(swapRequest);
  const requestedOwnerId = getRequestedOwnerId(swapRequest);

  return [requesterId, requestedOwnerId].includes(userId.toString());
};

const getOtherParticipantId = (swapRequest, userId) => {
  const requesterId = getOfferedOwnerId(swapRequest);
  const requestedOwnerId = getRequestedOwnerId(swapRequest);

  return requesterId === userId.toString() ? requestedOwnerId : requesterId;
};

const sanitizeExchangeDetails = (method, details) => {
  if (method === "meetup") {
    if (!details.date || isPastDate(details.date)) {
      throw new Error("Meetup date cannot be in the past");
    }

    return {
      location: details.location || "",
      date: details.date || "",
      time: details.time || "",
    };
  }

  if (method === "delivery") {
    return {
      address: details.address || "",
      courier: details.courier || "",
      trackingNumber: details.trackingNumber || "",
    };
  }

  return {
    collectionPoint: details.collectionPoint || "",
  };
};

const notifyStatusChange = async (swapRequest, actor, status) => {
  const recipient = getOtherParticipantId(swapRequest, actor);
  const titles = {
    accepted: "Swap Accepted",
    rejected: "Swap Rejected",
    completed: "Swap Completed",
    exchange_method: "Exchange Method Confirmed",
  };
  const types = {
    accepted: "request_accepted",
    rejected: "request_rejected",
    completed: "delivery_update",
    exchange_method: "exchange_selected",
  };

  await createNotification({
    user: recipient,
    actor,
    type: types[status] || "system",
    title: titles[status] || "Swap Updated",
    message: `Your swap request for ${swapRequest.requestedClothes.title} was updated.`,
    link: "/my-swaps",
    metadata: { swapRequest: swapRequest._id },
  });
};

const getOfferedOwnerId = (swapRequest) => {
  if (swapRequest.offeredOwner) {
    return swapRequest.offeredOwner._id
      ? swapRequest.offeredOwner._id.toString()
      : swapRequest.offeredOwner.toString();
  }

  return swapRequest.requester._id
    ? swapRequest.requester._id.toString()
    : swapRequest.requester.toString();
};

const getRequestedOwnerId = (swapRequest) => {
  if (swapRequest.requestedOwner) {
    return swapRequest.requestedOwner._id
      ? swapRequest.requestedOwner._id.toString()
      : swapRequest.requestedOwner.toString();
  }

  return swapRequest.requestedClothes.user._id
    ? swapRequest.requestedClothes.user._id.toString()
    : swapRequest.requestedClothes.user.toString();
};

const isPastDate = (dateValue) => {
  const selected = new Date(`${dateValue}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Number.isNaN(selected.getTime()) || selected < today;
};

const ensureParticipantSnapshots = (swapRequest) => {
  if (!swapRequest.offeredOwner) {
    swapRequest.offeredOwner = swapRequest.requester._id || swapRequest.requester;
  }

  if (!swapRequest.requestedOwner && swapRequest.requestedClothes?.user) {
    swapRequest.requestedOwner =
      swapRequest.requestedClothes.user._id || swapRequest.requestedClothes.user;
  }
};

module.exports = {
  createSwapRequest,
  getMySwapRequests,
  getSwapRequestById,
  getAllSwapRequests,
  updateSwapRequestStatus,
  updateExchangeMethod,
  getMyReviews,
  createReview,
};
