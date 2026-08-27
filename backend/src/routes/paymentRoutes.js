const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { initiatePayment, getPaymentStatus } = require("../controllers/paymentController");

router.post("/initiate",               protect, initiatePayment);
router.get ("/:purchaseId/status",     protect, getPaymentStatus);

module.exports = router;