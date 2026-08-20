const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getMyNotifications,
  markAllRead,
  markOneRead,
} = require("../controllers/notificationController");

router.get   ("/",               protect, getMyNotifications);
router.patch ("/mark-all-read",  protect, markAllRead);
router.patch ("/:id/read",       protect, markOneRead);

module.exports = router;