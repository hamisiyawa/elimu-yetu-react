const Notification = require("../models/Notification");

// Creates a notification but never lets a failure here break the
// actual request that triggered it (e.g. approving a material should
// still succeed even if the notification write somehow fails)
const notify = async ({ recipient, type = "info", message, relatedMaterial = null }) => {
  try {
    await Notification.create({ recipient, type, message, relatedMaterial });
  } catch (error) {
    console.error("⚠️  Failed to create notification:", error.message);
  }
};

module.exports = notify;