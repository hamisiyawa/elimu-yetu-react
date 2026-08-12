const mongoose = require("mongoose");

// One Download document is created every time a material is downloaded.
// This powers analytics — download counts, popular materials, teacher earnings.
// Guest downloads are allowed — downloadedBy is null for unauthenticated users.

const downloadSchema = new mongoose.Schema(
  {
    material: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "Material",
      required: true,
    },

    // null means a guest downloaded it — no account required
    downloadedBy: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     "User",
      default: null,
    },

    ipAddress: {
      type:    String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Download", downloadSchema);