const express = require("express");
const router  = express.Router();


const {
  register,
  verifyOtp,
  resendOtp,
  login,
  getMe,
  updateMe,
  changePassword,
  deleteMe,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  getAdminStats, 
  uploadAvatar,
  getAllUsers,
  verifyUserManually,
  toggleUserSuspend,
  createAdminAccount,
} = require("../controllers/authController");

const upload = require("../middleware/uploadMiddleware");

const { protect, authorise } = require("../middleware/authMiddleware");

// ── Public routes ─────────────────────────────────────────────
// No token required — anyone can call these

router.post("/register",    register);
router.post("/verify-otp",  verifyOtp);
router.post("/resend-otp",  resendOtp);
router.post("/login",       login);
router.post("/forgot-password",    forgotPassword);
router.post("/verify-reset-otp",   verifyResetOtp);
router.post("/reset-password",     resetPassword);

// ── Private routes ────────────────────────────────────────────
// protect runs first — if token is missing or invalid it stops
// here and returns 401 before the controller function ever runs

router.get  ("/me",              protect, getMe);
router.patch("/me",              protect, updateMe);
router.patch("/change-password", protect, changePassword);
router.delete("/me",             protect, deleteMe);
router.get("/admin-stats", protect, authorise("admin"), getAdminStats);
router.get   ("/users",                  protect, authorise("admin"), getAllUsers);
router.patch ("/users/:id/verify",       protect, authorise("admin"), verifyUserManually);
router.patch ("/users/:id/suspend",      protect, authorise("admin"), toggleUserSuspend);
router.post  ("/users/create-admin",     protect, authorise("admin"), createAdminAccount);router.get   ("/users",                  protect, authorise("admin"), getAllUsers);
router.patch ("/users/:id/verify",       protect, authorise("admin"), verifyUserManually);
router.patch ("/users/:id/suspend",      protect, authorise("admin"), toggleUserSuspend);
router.post  ("/users/create-admin",     protect, authorise("admin"), createAdminAccount);
// profile image upload — separate from text field updates
router.post(
  "/upload-avatar",
  protect,
  upload.single("profileImage"),
  uploadAvatar
);

module.exports = router;

