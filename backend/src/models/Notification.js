const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["success", "danger", "info", "warning"],
      default: "info",
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    read: {
      type: Boolean,
      default: false,
    },

    relatedMaterial: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      default: null,
    },
  },
  { timestamps: true }
);

// Fast lookup of a user's notifications, newest first — matches
// exactly how getMyNotifications queries this collection
notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);