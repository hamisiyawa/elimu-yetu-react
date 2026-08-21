const {rateLimit, ipKeyGenerator} = require("express-rate-limit");

// Shared response shape — matches the { message } format your
// frontend's services already expect, plus a retryAfter (seconds)
// so the UI can tell the user exactly how long to wait, not just "later"
const limitHandler = (req, res) => {
  const retryAfterSeconds = Math.ceil(
    (req.rateLimit.resetTime - Date.now()) / 1000
  );

  res.status(429).json({
    message: `Too many requests. Please wait ${retryAfterSeconds}s before trying again.`,
    retryAfter: retryAfterSeconds,
  });
};

// Combines IP with a target identifier (phone/userId) so the limit
// tracks "this IP attacking this account" specifically — blocks both
// one IP spamming many numbers AND many IPs spamming one number,
// since each unique combination gets its own counter
const targetedKey = (field) => (req) =>
  `${ipKeyGenerator(req.ip)}-${req.body?.[field] || "unknown"}`;

// ── Triggers a brand-new OTP SMS: register, forgot-password ─────
// Keyed by phone number — the actual thing that costs money per send
const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  keyGenerator: targetedKey("phone"),
  handler: limitHandler,
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Resending an OTP for an existing pending registration ───────
// Keyed by userId — the single most abusable endpoint, since it's
// designed specifically to trigger repeat sends
const resendOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  keyGenerator: targetedKey("userId"),
  handler: limitHandler,
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Verifying an OTP code — guards against brute-forcing the
// 4-digit code itself within its expiry window ───────────────────
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  keyGenerator: targetedKey("userId"),
  handler: limitHandler,
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Login — brute-force password guessing protection ────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: limitHandler,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  otpRequestLimiter,
  resendOtpLimiter,
  otpVerifyLimiter,
  loginLimiter,
};