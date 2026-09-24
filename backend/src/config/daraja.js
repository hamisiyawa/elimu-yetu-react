// ── Daraja (M-Pesa) helper utilities ────────────────────────────
// Isolated here so swapping sandbox → production later only means
// changing env vars, not touching any calling code.

const getAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const response = await fetch(
    `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` } }
  );

  if (!response.ok) {
    throw new Error("Failed to authenticate with Daraja");
  }

  const data = await response.json();
  return data.access_token;
};

// Daraja expects the timestamp in East Africa Time (UTC+3),
// regardless of what timezone the server itself runs in
const generateTimestamp = () => {
  const now = new Date();
  const eat = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, "0");

  return (
    eat.getUTCFullYear() +
    pad(eat.getUTCMonth() + 1) +
    pad(eat.getUTCDate()) +
    pad(eat.getUTCHours()) +
    pad(eat.getUTCMinutes()) +
    pad(eat.getUTCSeconds())
  );
};

const generatePassword = (timestamp) => {
  return Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString("base64");
};

// Converts local Kenyan format (07XXXXXXXX / 01XXXXXXXX) to the
// 2547XXXXXXXX format Daraja requires — no "+" prefix, unlike
// Africa's Talking's format
const formatPhoneForMpesa = (phone) => {
  if (phone.startsWith("254")) return phone;
  return `254${phone.slice(1)}`;
};

module.exports = {
  getAccessToken,
  generateTimestamp,
  generatePassword,
  formatPhoneForMpesa,
};