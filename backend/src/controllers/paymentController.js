const Material = require("../models/Material");
const Purchase = require("../models/Purchase");
const { splitAmount } = require("../config/paymentConfig");
const {
  getAccessToken,
  generateTimestamp,
  generatePassword,
  formatPhoneForMpesa,
} = require("../config/daraja");

// ─────────────────────────────────────────────────────────────
// @route   POST /api/payments/initiate
// @desc    Start a real M-Pesa STK Push payment for a material.
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

    // ── Real Daraja STK Push ────────────────────────────────────
    const accessToken = await getAccessToken();
    const timestamp    = generateTimestamp();
    const password     = generatePassword(timestamp);

    const stkResponse = await fetch(
      `${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.round(material.price),
          PartyA: formatPhoneForMpesa(phone),
          PartyB: process.env.MPESA_SHORTCODE,
          PhoneNumber: formatPhoneForMpesa(phone),
          CallBackURL: process.env.MPESA_CALLBACK_URL,
          AccountReference: material.title.slice(0, 20),
          TransactionDesc: "Elimu Yetu material purchase",
        }),
      }
    );

    const stkData = await stkResponse.json();

    if (!stkResponse.ok || stkData.ResponseCode !== "0") {
      await Purchase.findByIdAndUpdate(purchase._id, { status: "failed" });
      res.status(502);
      throw new Error(stkData.errorMessage || "Failed to initiate M-Pesa payment");
    }

    await Purchase.findByIdAndUpdate(purchase._id, {
      checkoutRequestId: stkData.CheckoutRequestID,
      merchantRequestId: stkData.MerchantRequestID,
    });

    res.status(201).json({
      message: "Payment request sent — check your phone",
      purchaseId: purchase._id,
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   POST /api/payments/mpesa-callback
// @desc    Safaricom calls this once the customer enters their
//          PIN (or cancels/times out). Must always respond 200,
//          or Safaricom retries 3x then quarantines this app.
// @access  Public — Safaricom's own servers call this, not a
//          logged-in user, so it can't require a JWT
// ─────────────────────────────────────────────────────────────
const mpesaCallback = async (req, res) => {
  try {
    const callback = req.body?.Body?.stkCallback;

    if (!callback) {
      return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const purchase = await Purchase.findOne({
      checkoutRequestId: callback.CheckoutRequestID,
    });

    if (!purchase) {
      return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    if (callback.ResultCode === 0) {
      const items = callback.CallbackMetadata?.Item || [];
      const receipt = items.find((i) => i.Name === "MpesaReceiptNumber")?.Value;

      purchase.status = "completed";
      purchase.transactionRef = receipt || null;
      await purchase.save();
    } else {
      purchase.status = "failed";
      await purchase.save();
    }

    res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });

  } catch (error) {
    console.error("M-Pesa callback error:", error.message);
    res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
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

module.exports = { initiatePayment, getPaymentStatus, mpesaCallback };