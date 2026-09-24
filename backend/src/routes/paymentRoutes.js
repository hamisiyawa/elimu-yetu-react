const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { initiatePayment, getPaymentStatus, mpesaCallback } = require("../controllers/paymentController");

router.post("/initiate",               protect, initiatePayment);
router.get ("/:purchaseId/status",     protect, getPaymentStatus);
router.post("/mpesa-callback",         mpesaCallback);

module.exports = router;