const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    title: {
      type:     String,
      required: [true, "Title is required"],
      trim:     true,
    },

    type: {
      type:     String,
      enum:     ["Revision Materials", "Exam Paper", "Schemes of work", "Lesson Plans"],
      required: [true, "Material type is required"],
    },

    level: {
      type:     String,
      enum: ["Pre-Primary", "Primary", "Junior School"],
      required: [true, "Education level is required"],
    },

    grade: {
      type:     String,
      required: [true, "Grade is required"],
    },

    subject: {
      type:     String,
      required: [true, "Subject is required"],
    },

    term: {
      type:     String,
      enum:     ["Term 1", "Term 2", "Term 3"],
      required: [true, "Term is required"],
    },

    year: {
      type:     String,
      required: [true, "Year is required"],
    },

    // path to the uploaded file stored in /uploads
    fileUrl: {
      type:     String,
      required: [true, "File is required"],
    },

    // optional cover image path
    coverImage: {
      type:    String,
      default: null,
    },

    // the teacher who uploaded — references the User collection
    uploadedBy: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },

    // admin must approve before it appears publicly
    status: {
      type:    String,
      enum:    ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: {
      type:    String,
      default: null,
    },

    approvedBy: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     "User",
      default: null,
    },

    // ── Pricing ────────────────────────────────────────────────
    // isFree: true  → download immediately at no cost
    // isFree: false → user must pay price (KES) before downloading
    isFree: {
      type:    Boolean,
      default: true,
    },

    price: {
      type:    Number,
      default: 0,
      min:     [0, "Price cannot be negative"],
    },

    currency: {
      type:    String,
      default: "KES",
    },

    // ── Analytics ──────────────────────────────────────────────
    downloadCount: {
      type:    Number,
      default: 0,
    },

    viewCount: {
      type:    Number,
      default: 0,
    },

    // total revenue earned from paid downloads — used in V2 earnings
    totalRevenue: {
      type:    Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field — returns "free" or "paid"
// Appears in every JSON response automatically
materialSchema.virtual("downloadType").get(function () {
  return this.isFree ? "free" : "paid";
});

materialSchema.set("toJSON", { virtuals: true });

// Compound index — speeds up filter queries on the browse page
materialSchema.index({ level: 1, grade: 1, subject: 1, term: 1, status: 1 });

// Index for fetching paid materials (used in V2 payment flow)
materialSchema.index({ isFree: 1, status: 1 });

module.exports = mongoose.model("Material", materialSchema);