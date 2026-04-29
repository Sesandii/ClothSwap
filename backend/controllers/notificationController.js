const Notification = require("../models/Notification");

const notificationPopulation = {
  path: "actor",
  select: "name location profilePic",
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user })
      .populate(notificationPopulation)
      .sort({ createdAt: -1 });

    return res.json(notifications);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getUnreadNotificationCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user,
      read: false,
    });

    return res.json({ count });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user,
      },
      { read: true },
      { new: true }
    ).populate(notificationPopulation);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json(notification);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user,
        read: false,
      },
      { read: true }
    );

    return res.json({ message: "Notifications marked as read" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
};
