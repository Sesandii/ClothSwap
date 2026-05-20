const User = require("../models/User");
const Clothes = require("../models/Clothes");
const SwapRequest = require("../models/SwapRequest");
const Complaint = require("../models/Complaint");
const Review = require("../models/Review");
const Category = require("../models/Category");
const CollectionPoint = require("../models/CollectionPoint");
const AdminSetting = require("../models/AdminSetting");

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const DEFAULT_CATEGORY_SIZES = {
  Tops: ["XS", "S", "M", "L", "XL", "XXL"],
  Bottoms: ["XS", "S", "M", "L", "XL", "XXL"],
  Dresses: ["XS", "S", "M", "L", "XL", "XXL"],
  Outerwear: ["XS", "S", "M", "L", "XL", "XXL"],
  Shoes: ["4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
  Accessories: ["One Size"],
  Shirts: ["XS", "S", "M", "L", "XL", "XXL"],
  Pants: ["XS", "S", "M", "L", "XL", "XXL"],
  Jackets: ["XS", "S", "M", "L", "XL", "XXL"],
  Sweaters: ["XS", "S", "M", "L", "XL", "XXL"],
  Skirts: ["XS", "S", "M", "L", "XL", "XXL"],
};
const DEFAULT_CATEGORIES = Object.keys(DEFAULT_CATEGORY_SIZES);
const DASHBOARD_TIMEZONE = process.env.DASHBOARD_TIMEZONE || "Asia/Colombo";

const normalizeSizes = (sizes, categoryName) => {
  const source = Array.isArray(sizes) ? sizes : [];
  const normalized = source
    .map((size) => String(size).trim())
    .filter(Boolean);

  return Array.from(new Set(normalized.length > 0 ? normalized : DEFAULT_CATEGORY_SIZES[categoryName] || DEFAULT_SIZES));
};

const getDashboard = async (req, res) => {
  const todayKey = getDateKeyInTimezone(new Date(), DASHBOARD_TIMEZONE);
  const todayStart = dateKeyToUtcDate(todayKey);
  const sevenDaysAgoStart = addUtcDays(todayStart, -6);
  const tomorrowStart = addUtcDays(todayStart, 1);

  const [
    totalUsers,
    totalClothes,
    pendingListings,
    pendingSwaps,
    completedSwaps,
    complaints,
    deliveryIssues,
    swapActivity,
    recentSwaps,
  ] = await Promise.all([
    User.countDocuments(),
    Clothes.countDocuments(),
    Clothes.countDocuments({ approvalStatus: "pending" }),
    SwapRequest.countDocuments({ status: "pending" }),
    SwapRequest.countDocuments({ status: "completed" }),
    Complaint.countDocuments(),
    Complaint.countDocuments({
      type: { $in: ["delivery_not_received", "user_no_show"] },
      status: { $ne: "resolved" },
    }),
    SwapRequest.aggregate([
      {
        $match: {
          createdAt: {
            $gte: sevenDaysAgoStart,
            $lt: tomorrowStart,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: DASHBOARD_TIMEZONE,
            },
          },
          swaps: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    SwapRequest.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("requester", "name email profilePic")
      .populate("requestedOwner", "name email profilePic")
      .populate("offeredOwner", "name email profilePic")
      .populate("offeredClothes", "title images")
      .populate("requestedClothes", "title images"),
  ]);

  return res.json({
    stats: {
      totalUsers,
      totalClothes,
      pendingListings,
      pendingSwaps,
      completedSwaps,
      complaints,
      deliveryIssues,
    },
    chartData: buildLastSevenDaysChart(todayKey, swapActivity),
    recentSwaps,
  });
};

const getDateKeyInTimezone = (date, timeZone) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
};

const dateKeyToUtcDate = (dateKey) => {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day));
};

const addUtcDays = (date, days) => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);

  return result;
};

const formatDateKey = (date) => date.toISOString().slice(0, 10);

const buildLastSevenDaysChart = (todayKey, activity) => {
  const countsByDate = new Map(activity.map((item) => [item._id, item.swaps]));
  const today = dateKeyToUtcDate(todayKey);
  const startDate = addUtcDays(today, -6);

  return Array.from({ length: 7 }, (_, index) => {
    const date = addUtcDays(startDate, index);
    const key = formatDateKey(date);

    return {
      date: key,
      name: date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
      swaps: countsByDate.get(key) || 0,
    };
  });
};

const getUsers = async (req, res) => {
  const users = await User.find()
    .select("name email phone location profilePic status role createdAt")
    .sort({ createdAt: -1 });

  const ratings = await Review.aggregate([
    { $group: { _id: "$reviewee", rating: { $avg: "$rating" }, reviewsCount: { $sum: 1 } } },
  ]);
  const ratingsByUser = new Map(ratings.map((rating) => [String(rating._id), rating]));

  return res.json(
    users.map((user) => {
      const userRating = ratingsByUser.get(String(user._id));

      return {
        ...user.toObject(),
        rating: userRating?.rating || 0,
        reviewsCount: userRating?.reviewsCount || 0,
      };
    })
  );
};

const updateUserStatus = async (req, res) => {
  const { status, role } = req.body;

  if (status !== undefined && !["active", "blocked"].includes(status)) {
    return res.status(400).json({ message: "Invalid user status" });
  }

  if (role !== undefined && !["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid user role" });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      ...(status !== undefined ? { status } : {}),
      ...(role !== undefined ? { role } : {}),
    },
    { new: true, runValidators: true }
  ).select("name email phone location profilePic status role createdAt");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json(user);
};

const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ message: "User deleted" });
};

const getClothes = async (req, res) => {
  const clothes = await Clothes.find()
    .sort({ createdAt: -1 })
    .populate("user", "name email profilePic");

  return res.json(clothes);
};

const updateClothesApproval = async (req, res) => {
  const { approvalStatus } = req.body;

  if (!["pending", "approved", "rejected"].includes(approvalStatus)) {
    return res.status(400).json({ message: "Invalid approval status" });
  }

  const clothes = await Clothes.findByIdAndUpdate(
    req.params.id,
    { approvalStatus },
    { new: true, runValidators: true }
  ).populate("user", "name email profilePic");

  if (!clothes) {
    return res.status(404).json({ message: "Listing not found" });
  }

  return res.json(clothes);
};

const deleteClothes = async (req, res) => {
  const clothes = await Clothes.findByIdAndDelete(req.params.id);

  if (!clothes) {
    return res.status(404).json({ message: "Listing not found" });
  }

  return res.json({ message: "Listing deleted" });
};

const getSwaps = async (req, res) => {
  const swaps = await SwapRequest.find()
    .sort({ createdAt: -1 })
    .populate("requester", "name email profilePic")
    .populate("requestedOwner", "name email profilePic")
    .populate("offeredOwner", "name email profilePic")
    .populate("offeredClothes", "title images")
    .populate("requestedClothes", "title images");

  return res.json(swaps);
};

const updateSwap = async (req, res) => {
  const { status, exchangeStatus, trackingNumber, courier } = req.body;
  const swap = await SwapRequest.findById(req.params.id);

  if (!swap) {
    return res.status(404).json({ message: "Swap request not found" });
  }

  if (status !== undefined) {
    if (!["pending", "accepted", "rejected", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid swap status" });
    }

    swap.status = status;
    if (status === "completed" && !swap.completedAt) {
      swap.completedAt = new Date();
    }
  }

  if (exchangeStatus !== undefined) {
    if (!["pending", "accepted", "rejected"].includes(exchangeStatus)) {
      return res.status(400).json({ message: "Invalid exchange status" });
    }

    swap.exchangeMethod = {
      ...(swap.exchangeMethod || {}),
      status: exchangeStatus,
      respondedAt: new Date(),
      confirmedAt: exchangeStatus === "accepted" ? new Date() : swap.exchangeMethod?.confirmedAt,
    };
  }

  if (courier !== undefined || trackingNumber !== undefined) {
    swap.exchangeMethod = {
      ...(swap.exchangeMethod || {}),
      details: {
        ...(swap.exchangeMethod?.details || {}),
        ...(courier !== undefined ? { courier } : {}),
        ...(trackingNumber !== undefined ? { trackingNumber } : {}),
      },
    };
  }

  await swap.save();
  const populated = await SwapRequest.findById(swap._id)
    .populate("requester", "name email profilePic")
    .populate("requestedOwner", "name email profilePic")
    .populate("offeredOwner", "name email profilePic")
    .populate("offeredClothes", "title images")
    .populate("requestedClothes", "title images");

  return res.json(populated);
};

const deleteSwap = async (req, res) => {
  const swap = await SwapRequest.findByIdAndDelete(req.params.id);

  if (!swap) {
    return res.status(404).json({ message: "Swap request not found" });
  }

  return res.json({ message: "Swap request deleted" });
};

const getComplaints = async (req, res) => {
  const complaints = await Complaint.find()
    .sort({ createdAt: -1 })
    .populate("user", "name email profilePic")
    .populate("swapRequest");

  return res.json(complaints);
};

const updateComplaintStatus = async (req, res) => {
  const { status } = req.body;

  if (!["pending", "investigating", "resolved"].includes(status)) {
    return res.status(400).json({ message: "Invalid complaint status" });
  }

  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  )
    .populate("user", "name email profilePic")
    .populate("swapRequest");

  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  return res.json(complaint);
};

const getCategories = async (req, res) => {
  const distinctCategories = await Clothes.distinct("category");
  const categoryNames = Array.from(new Set([...DEFAULT_CATEGORIES, ...distinctCategories.filter(Boolean)]));
  const existingCategories = await Category.find({
    name: { $in: categoryNames },
  }).select("name");
  const existingNames = new Set(existingCategories.map((category) => category.name));
  const missingCategories = categoryNames
    .filter((name) => name && !existingNames.has(name))
    .map((name) => ({ name, sizes: normalizeSizes(undefined, name) }));

  if (missingCategories.length > 0) {
    await Category.insertMany(missingCategories, { ordered: false }).catch((error) => {
      if (error.code !== 11000) {
        throw error;
      }
    });
  }

  const [savedCategories, clothesCounts] = await Promise.all([
    Category.find().sort({ name: 1 }),
    Clothes.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
  ]);
  const countByCategory = new Map(clothesCounts.map((item) => [item._id, item.count]));

  return res.json(
    savedCategories.map((category) => ({
      ...category.toObject(),
      sizes: normalizeSizes(category.sizes, category.name),
      itemsCount: countByCategory.get(category.name) || 0,
    }))
  );
};

const createCategory = async (req, res) => {
  const name = req.body.name?.trim();
  const sizes = normalizeSizes(req.body.sizes, name);

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const category = await Category.create({ name, sizes });
  return res.status(201).json({ ...category.toObject(), itemsCount: 0 });
};

const updateCategory = async (req, res) => {
  const name = req.body.name?.trim();

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const existing = await Category.findById(req.params.id);

  if (!existing) {
    return res.status(404).json({ message: "Category not found" });
  }

  const oldName = existing.name;
  existing.name = name;
  existing.sizes = normalizeSizes(req.body.sizes, name);
  await existing.save();
  await Clothes.updateMany({ category: oldName }, { $set: { category: name } });

  const itemsCount = await Clothes.countDocuments({ category: name });
  return res.json({ ...existing.toObject(), itemsCount });
};

const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const itemsCount = await Clothes.countDocuments({ category: category.name });

  if (itemsCount > 0) {
    return res.status(400).json({ message: "Move or delete listings in this category first" });
  }

  await category.deleteOne();
  return res.json({ message: "Category deleted" });
};

const getReviews = async (req, res) => {
  const reviews = await Review.find()
    .sort({ createdAt: -1 })
    .populate("reviewer", "name email profilePic")
    .populate("reviewee", "name email profilePic");

  return res.json(reviews);
};

const deleteReview = async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  return res.json({ message: "Review deleted" });
};

const getSettings = async (req, res) => {
  const [settings, collectionPoints] = await Promise.all([
    AdminSetting.findOneAndUpdate(
      { key: "main" },
      {
        $setOnInsert: {
          platformName: "ClothSwap",
          contactEmail: "support@clothswap.com",
          maxImagesPerListing: 5,
          autoApproveListings: true,
          notifications: {
            emailNotifications: true,
            newSwapAlerts: false,
            complaintAlerts: true,
            newUserAlerts: false,
          },
        },
      },
      { new: true, upsert: true }
    ),
    CollectionPoint.find().sort({ name: 1 }),
  ]);

  return res.json({ settings, collectionPoints });
};

const getPublicSettings = async (req, res) => {
  const settings = await AdminSetting.findOneAndUpdate(
    { key: "main" },
    {
      $setOnInsert: {
        platformName: "ClothSwap",
        contactEmail: "support@clothswap.com",
        maxImagesPerListing: 5,
        autoApproveListings: true,
      },
    },
    { new: true, upsert: true }
  );

  return res.json({
    platformName: settings.platformName,
    contactEmail: settings.contactEmail,
    maxImagesPerListing: settings.maxImagesPerListing,
  });
};

const getCollectionPoints = async (req, res) => {
  const collectionPoints = await CollectionPoint.find().sort({ name: 1 });

  return res.json(collectionPoints);
};

const updateSettings = async (req, res) => {
  const { platformName, contactEmail, maxImagesPerListing, autoApproveListings, notifications } = req.body;
  const settings = await AdminSetting.findOneAndUpdate(
    { key: "main" },
    {
      platformName,
      contactEmail,
      maxImagesPerListing,
      autoApproveListings,
      notifications,
    },
    { new: true, upsert: true, runValidators: true }
  );

  return res.json(settings);
};

const createCollectionPoint = async (req, res) => {
  const name = req.body.name?.trim();
  const address = req.body.address?.trim();
  const hours = req.body.hours?.trim();

  if (!name || !address || !hours) {
    return res.status(400).json({ message: "Name, address, and hours are required" });
  }

  const point = await CollectionPoint.create({ name, address, hours });

  return res.status(201).json(point);
};

const updateCollectionPoint = async (req, res) => {
  const name = req.body.name?.trim();
  const address = req.body.address?.trim();
  const hours = req.body.hours?.trim();

  if (!name || !address || !hours) {
    return res.status(400).json({ message: "Name, address, and hours are required" });
  }

  const point = await CollectionPoint.findByIdAndUpdate(req.params.id, { name, address, hours }, {
    new: true,
    runValidators: true,
  });

  if (!point) {
    return res.status(404).json({ message: "Collection point not found" });
  }

  return res.json(point);
};

const deleteCollectionPoint = async (req, res) => {
  const point = await CollectionPoint.findByIdAndDelete(req.params.id);

  if (!point) {
    return res.status(404).json({ message: "Collection point not found" });
  }

  return res.json({ message: "Collection point deleted" });
};

module.exports = {
  getDashboard,
  getUsers,
  updateUserStatus,
  deleteUser,
  getClothes,
  updateClothesApproval,
  deleteClothes,
  getSwaps,
  updateSwap,
  deleteSwap,
  getComplaints,
  updateComplaintStatus,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getReviews,
  deleteReview,
  getSettings,
  getPublicSettings,
  updateSettings,
  getCollectionPoints,
  createCollectionPoint,
  updateCollectionPoint,
  deleteCollectionPoint,
};
