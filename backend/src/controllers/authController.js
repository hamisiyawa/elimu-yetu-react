const User         = require("../models/User");
const generateToken = require("../utils/generateToken");
const generateOTP  = require("../utils/generateOTP");
const bcrypt       = require("bcryptjs");

// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {

    // Step 1 — pull everything the frontend sent
    const { name, phone, username, email, password, role } = req.body;

    // Step 2 — check required fields are present
    if (!name || !phone || !password || !role) {
      res.status(400);
      throw new Error("Name, phone, password and role are required");
    }

    // Step 3 — teachers must also provide a username
    if (role === "teacher" && !username) {
      res.status(400);
      throw new Error("Teachers must provide a username");
    }

    // Step 4 — check no existing user has the same phone or username
    const orConditions = [{ phone }];
    if (username) orConditions.push({ username });
    if (email)    orConditions.push({ email });

    const existingUser = await User.findOne({ $or: orConditions });

    if (existingUser) {
      res.status(409);
      throw new Error("An account with these details already exists");
    }

    // Step 5 — generate OTP and set it to expire in 10 minutes
    const otp        = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Step 6 — hash the OTP before saving (same reason we hash passwords)
    const salt      = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    // Step 7 — create the user in MongoDB
    const user = await User.create({
      name,
      phone,
      username: username || undefined,
      email:    email    || undefined,
      password,
      role,
      otp:        hashedOtp,
      otpExpires,
      isVerified: false,
    });

    // Step 8 — in development, log the OTP to the terminal
    // In production this is replaced with an SMS API call
    if (process.env.NODE_ENV === "development") {
      console.log(`\n📱 OTP for ${name} (${phone}): ${otp}\n`);
    }

    // Step 9 — send back just enough for the frontend to proceed to /otp
    res.status(201).json({
      message:  "Registration successful. OTP sent to your phone.",
      userId:   user._id,
      name:     user.name,
      role:     user.role,
      phone:    user.phone,
    });

  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res, next) => {
  try {

    const { userId, otp } = req.body;

    if (!userId || !otp) {
      res.status(400);
      throw new Error("User ID and OTP are required");
    }

    // Find the user — include otp and otpExpires which are hidden by default
    const user = await User.findById(userId).select("+otp +otpExpires");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Check the OTP has not expired
    if (!user.otpExpires || user.otpExpires < new Date()) {
      res.status(400);
      throw new Error("OTP has expired. Please request a new one.");
    }

    // Compare the entered OTP against the stored hash
    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch) {
      res.status(400);
      throw new Error("Invalid OTP. Please try again.");
    }

    // OTP is correct — mark user as verified and clear the OTP fields
    user.isVerified = true;
    user.otp        = null;
    user.otpExpires = null;
    await user.save();

    // Generate JWT — the user is now fully authenticated
    const token = generateToken(user._id);

    res.status(200).json({
      message: "OTP verified successfully. Welcome!",
      token,
      user: {
        _id:        user._id,
        name:       user.name,
        role:       user.role,
        phone:      user.phone,
        username:   user.username   || null,
        email:      user.email      || null,
        isVerified: user.isVerified,
      },
    });

  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/resend-otp
// @access  Public
const resendOtp = async (req, res, next) => {
  try {

    const { userId } = req.body;

    if (!userId) {
      res.status(400);
      throw new Error("User ID is required");
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.isVerified) {
      res.status(400);
      throw new Error("This account is already verified");
    }

    // Generate a fresh OTP and reset the expiry window
    const otp        = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const salt      = await bcrypt.genSalt(10);
    user.otp        = await bcrypt.hash(otp, salt);
    user.otpExpires = otpExpires;
    await user.save();

    if (process.env.NODE_ENV === "development") {
      console.log(`\n📱 Resent OTP for ${user.name} (${user.phone}): ${otp}\n`);
    }

    res.status(200).json({ message: "OTP resent successfully" });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   POST /api/auth/forgot-password
// @desc    Find account by phone + role, generate OTP, return userId
// @access  Public
// ─────────────────────────────────────────────────────────────
const forgotPassword = async (req, res, next) => {
  try {
    const { phone, role } = req.body;

    if (!phone || !role) {
      res.status(400);
      throw new Error("Phone number and role are required");
    }

    const user = await User.findOne({ phone, role });

    if (!user) {
      res.status(404);
      throw new Error("No account found with this phone number and role");
    }

    if (!user.isVerified) {
      res.status(403);
      throw new Error("This account has not been verified yet");
    }

    // generate OTP and hash it — same pattern as registration
    const otp        = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const salt      = await bcrypt.genSalt(10);
    user.otp        = await bcrypt.hash(otp, salt);
    user.otpExpires = otpExpires;
    await user.save();

    if (process.env.NODE_ENV === "development") {
      console.log(`\n📱 Password reset OTP for ${user.name} (${phone}): ${otp}\n`);
    }

    res.status(200).json({
      message: "OTP sent to your phone number",
      userId:  user._id,
      phone:   user.phone,
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   POST /api/auth/verify-reset-otp
// @desc    Verify OTP for password reset — returns a reset token
// @access  Public
// ─────────────────────────────────────────────────────────────
const verifyResetOtp = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      res.status(400);
      throw new Error("User ID and OTP are required");
    }

    const user = await User.findById(userId).select("+otp +otpExpires");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      res.status(400);
      throw new Error("OTP has expired. Please request a new one.");
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      res.status(400);
      throw new Error("Invalid OTP. Please try again.");
    }

    // OTP verified — generate a short-lived reset token (15 minutes)
    // This token is passed to the reset password page
    const crypto     = require("crypto");
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken        = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);
    user.otp               = null;
    user.otpExpires        = null;
    await user.save();

    res.status(200).json({
      message:    "OTP verified. You can now reset your password.",
      resetToken,
      userId:     user._id,
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   POST /api/auth/reset-password
// @desc    Reset password using the reset token from OTP verification
// @access  Public
// ─────────────────────────────────────────────────────────────
const resetPassword = async (req, res, next) => {
  try {
    const { userId, resetToken, newPassword, confirmPassword } = req.body;

    if (!userId || !resetToken || !newPassword) {
      res.status(400);
      throw new Error("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      res.status(400);
      throw new Error("Passwords do not match");
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters");
    }

    const user = await User.findById(userId).select("+resetToken +resetTokenExpires");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (!user.resetToken || user.resetToken !== resetToken) {
      res.status(400);
      throw new Error("Invalid or expired reset token. Please start over.");
    }

    if (user.resetTokenExpires < new Date()) {
      res.status(400);
      throw new Error("Reset token has expired. Please start over.");
    }

    // set the new password — pre-save hook hashes it
    user.password          = newPassword;
    user.resetToken        = null;
    user.resetTokenExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully. You can now log in." });

  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {

    const { phone, username, password, role } = req.body;

    if (!password || !role) {
      res.status(400);
      throw new Error("Role and password are required");
    }

    // Find user — teachers log in with username, others with phone
    let user;

    if (role === "teacher" || role === "admin") {
      if (!username) {
        res.status(400);
        throw new Error("Username is required for teachers");
      }
      // .select("+password") overrides the select:false we set on the schema
      user = await User.findOne({ username, role }).select("+password");

    } else {
      if (!phone) {
        res.status(400);
        throw new Error("Phone number is required");
      }
      user = await User.findOne({ phone, role }).select("+password");
    }

    // Check credentials — we combine both checks into one condition
    // so we don't reveal whether the account exists or the password is wrong
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    // Block unverified accounts from logging in
    if (!user.isVerified) {
      res.status(403);
      throw new Error(
        "Account not verified. Please complete OTP verification."
      );
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        _id:        user._id,
        name:       user.name,
        role:       user.role,
        phone:      user.phone,
        username:   user.username   || null,
        email:      user.email      || null,
        isVerified: user.isVerified,
      },
    });

  } catch (error) {
    next(error);
  }
};

// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  // req.user is already attached by the protect middleware
  // No database call needed — it was fetched during token verification
  // re-fetch to ensure preferences are included
  const user = await User.findById(req.user._id);
  res.status(200).json({ user: req.user });
};


// @route   POST /api/auth/upload-avatar
// @access  Private
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("Please upload an image file");
    }

    const profileImageUrl = `/uploads/${req.file.filename}`;

    // save directly to the user document
    await User.findByIdAndUpdate(req.user._id, { profileImage: profileImageUrl });

    res.status(200).json({ profileImageUrl });

  } catch (error) {
    next(error);
  }
};


// @route   PATCH /api/auth/me
// @access  Private
const updateMe = async (req, res, next) => {
  try {

    const { name, email, profileImage, preferences } = req.body;

    const user = await User.findById(req.user._id);

    // Only update fields that were actually sent
    if (name)         user.name         = name;
    if (email)        user.email        = email;
    if (profileImage) user.profileImage = profileImage;
    if (preferences && typeof preferences === "object") {
      user.preferences = {
        ...user.preferences.toObject?.() || user.preferences,
        ...preferences,
      };
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id:          user._id,
        name:         user.name,
        role:         user.role,
        phone:        user.phone,
        username:     user.username     || null,
        email:        user.email        || null,
        profileImage: user.profileImage || null,
        isVerified:   user.isVerified,
        preferences:  user.preferences,
      },
    });

  } catch (error) {
    next(error);
  }
};


// @route   PATCH /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error("Current password and new password are required");
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error("New password must be at least 6 characters");
    }

    // Fetch the user including the hidden password field
    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      res.status(401);
      throw new Error("Current password is incorrect");
    }

    // Assign plain password — the pre-save hook will hash it automatically
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────────────────────
// @route   GET /api/auth/admin-stats
// @desc    Platform-wide stats for the admin dashboard
// @access  Private — admin only
// ─────────────────────────────────────────────────────────────
const getAdminStats = async (req, res, next) => {
  try {
    const Material = require("../models/Material");

    // run all queries in parallel for speed
    const [
      totalUsers,
      totalMaterials,
      approvedMaterials,
      pendingMaterials,
      rejectedMaterials,
    ] = await Promise.all([
      User.countDocuments({ isVerified: true }),
      Material.countDocuments({}),
      Material.countDocuments({ status: "approved" }),
      Material.countDocuments({ status: "pending"  }),
      Material.countDocuments({ status: "rejected" }),
    ]);

    res.status(200).json({
      totalUsers,
      totalMaterials,
      approvedMaterials,
      pendingMaterials,
      rejectedMaterials,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyOtp,
  resendOtp,
  login,
  getMe,
  updateMe,
  changePassword,
  forgotPassword,
  verifyResetOtp,    
  resetPassword, 
  getAdminStats,
  uploadAvatar, 
};