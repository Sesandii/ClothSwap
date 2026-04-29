const Complaint = require("../models/Complaint");
const SwapRequest = require("../models/SwapRequest");
const createNotification = require("../utils/createNotification");

const swapRequestPopulation = [
  {
    path: "offeredClothes",
    select: "title images",
  },
  {
    path: "requestedClothes",
    select: "title images",
  },
];

const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user })
      .populate({ path: "swapRequest", populate: swapRequestPopulation })
      .sort({ createdAt: -1 });

    return res.json(complaints);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const createComplaint = async (req, res) => {
  const { swapRequest, type, description } = req.body;

  if (!swapRequest || !type || !description) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    const swap = await SwapRequest.findById(swapRequest).populate("requestedClothes", "user");

    if (!swap) {
      return res.status(404).json({ message: "Swap request not found" });
    }

    const participantIds = [
      swap.offeredOwner || swap.requester,
      swap.requestedOwner || swap.requestedClothes?.user,
    ]
      .filter(Boolean)
      .map((id) => id.toString());

    if (!participantIds.includes(req.user.toString())) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const complaint = await Complaint.create({
      user: req.user,
      swapRequest,
      type,
      description,
    });

    await createNotification({
      user: req.user,
      actor: req.user,
      type: "system",
      title: "Report Received",
      message: "Your report was submitted and is pending review.",
      link: "/complaints",
      metadata: { complaint: complaint._id, swapRequest },
    });

    const populatedComplaint = await Complaint.findById(complaint._id).populate({
      path: "swapRequest",
      populate: swapRequestPopulation,
    });

    return res.status(201).json(populatedComplaint);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ message: "Swap request not found" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getMyComplaints,
  createComplaint,
};
