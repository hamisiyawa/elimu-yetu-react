const Material = require("../models/Material");
const Purchase = require("../models/Purchase");
const { splitAmount } = require("../config/paymentConfig");

// ─────────────────────────────────────────────────────────────
// @route   POST /api/payments/initiate
// @desc    Start a payment for a paid material.
//
//          ⚠️ MOCK IMPLEMENTATION — Phase 2 will replace the
//          setTimeout block below with a real Safaricom Daraja
//          STK Push call. Everything else (the Purchase record,
//          the response shape, the status endpoint) stays the
//          same either way — the frontend never needs to change.
// @access  Private
// ─────────────────────────────────────────────────────────────
const initiatePayment = async (req, res, next) => {
  try {
    const { materialId, phone } = req.body;

    if (!materialId || !phone) {
      res.status(400);
      throw new Error("materialId and phone are required");
    }

    if (!/^(07|01)\d{8}$/.test(phone)) {
      res.status(400);
      throw new Error("Enter a valid phone number");
    }

    const material = await Material.findById(materialId);
    if (!material || material.status !== "approved") {
      res.status(404);
      throw new Error("Material not found");
    }

    if (material.isFree) {
      res.status(400);
      throw new Error("This material is free — no payment needed");
    }

    const existing = await Purchase.findOne({
      buyer: req.user._id, material: material._id, status: "completed",
    });
    if (existing) {
      res.status(409);
      throw new Error("You already own this material");
    }

    const { teacherEarning, platformFee } = splitAmount(material.price);

    const purchase = await Purchase.create({
      buyer:      req.user._id,
      material:   material._id,
      amountPaid: material.price,
      teacherEarning,
      platformFee,
      paymentMethod: "mpesa",
      status: "pending",
    });

    // ── MOCK: simulate Safaricom's async callback ──────────────
    // Real STK Push returns immediately (just a checkoutRequestId)
    // and Safaricom calls YOUR server back seconds later once the
    // user enters their PIN. We fake that same async shape here
    // with a delay, so the frontend polling logic built against
    // this mock will work unchanged against the real thing later.
    setTimeout(async () => {
      try {
        await Purchase.findByIdAndUpdate(purchase._id, { status: "completed" });
      } catch (err) {
        console.error("Mock payment completion failed:", err.message);
      }
    }, 4000);

    res.status(201).json({
      message: "Payment request sent — check your phone",
      purchaseId: purchase._id,
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   GET /api/payments/:purchaseId/status
// @desc    Poll the status of a pending payment
// @access  Private
// ─────────────────────────────────────────────────────────────
const getPaymentStatus = async (req, res, next) => {
  try {
    const purchase = await Purchase.findOne({
      _id: req.params.purchaseId,
      buyer: req.user._id, // can only check your own purchase
    });

    if (!purchase) {
      res.status(404);
      throw new Error("Purchase not found");
    }

    res.status(200).json({ status: purchase.status });

  } catch (error) {
    next(error);
  }
};

module.exports = { initiatePayment, getPaymentStatus };