const Notification = require("../models/Notification");

const createNotification = async ({
  user,
  actor = null,
  type = "system",
  title,
  message,
  link = "",
  metadata = {},
}) => {
  if (!user || !title || !message) {
    return null;
  }

  if (actor && String(user) === String(actor)) {
    return null;
  }

  return Notification.create({
    user,
    actor,
    type,
    title,
    message,
    link,
    metadata,
  });
};

module.exports = createNotification;
