const Notification = require("../models/Notification");

// @route   GET /api/notifications
// @desc    Get the logged-in user's most recent notifications
// @access  Private
const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    res.status(200).json({ notifications, unreadCount });

  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/notifications/mark-all-read
// @access  Private
const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: "All notifications marked as read" });

  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/notifications/:id/read
// @access  Private
const markOneRead = async (req, res, next) => {
  try {
    // Scoped to req.user._id — a user can only mark their OWN
    // notifications as read, never someone else's by guessing an id
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      res.status(404);
      throw new Error("Notification not found");
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ message: "Marked as read" });

  } catch (error) {
    next(error);
  }
};

module.exports = { getMyNotifications, markAllRead, markOneRead };