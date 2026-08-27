const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      required: true,
      index: true,
    },

    amountPaid: {
      type: Number,
      required: true,
    },

    // Snapshotted at purchase time — NOT recalculated later, so a
    // change to TEACHER_SHARE_PERCENT never rewrites past earnings
    teacherEarning: {
      type: Number,
      required: true,
    },
    platformFee: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["mpesa", "admin_grant"],
      default: "mpesa",
    },

    // M-Pesa receipt number — populated once we wire up Daraja in
    // Phase 2. Nullable for now, and for admin-granted access.
    transactionRef: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// A buyer can only hold ONE completed purchase per material —
// but this only applies to completed ones, so a failed/retried
// payment attempt never blocks a genuine repeat purchase attempt
purchaseSchema.index(
  { buyer: 1, material: 1 },
  { unique: true, partialFilterExpression: { status: "completed" } }
);

module.exports = mongoose.model("Purchase", purchaseSchema);