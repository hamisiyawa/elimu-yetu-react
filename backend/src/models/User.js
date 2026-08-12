const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      unique: true,
    },

    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["student", "parent", "teacher", "admin"],
      required: [true, "Role is required"],
      default: "student",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    profileImage: {
      type: String,
      default: null,
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpires: {
      type: Date,
      default: null,
    },

    resetToken: {
      type:    String,
      default: null,
    },

    resetTokenExpires: {
      type:    Date,
      default: null,
    },

    earnings: {
      balance:     { type: Number, default: 0 },
      totalEarned: { type: Number, default: 0 },
    },

    preferences: {
    emailNotifications: { type: Boolean, default: true  },
    smsNotifications:   { type: Boolean, default: false },
    materialApproved:   { type: Boolean, default: true  },
    materialRejected:   { type: Boolean, default: true  },
    newMaterials:       { type: Boolean, default: false },
  },
  },
  {
    timestamps: true,
  }
);

// Before saving, hash the password if it was changed
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare a plain password against the stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);