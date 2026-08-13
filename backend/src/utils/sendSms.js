const AfricasTalking = require("africastalking");

const africastalking = AfricasTalking({
  apiKey:   process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

const sms = africastalking.SMS;

// Converts local Kenyan format (07XXXXXXXX / 01XXXXXXXX) to the
// international E.164 format Africa's Talking requires (+2547XXXXXXXX)
const toInternationalFormat = (phone) => {
  if (phone.startsWith("+")) return phone;
  return `+254${phone.slice(1)}`;
};

const sendSms = async (phone, message) => {
  try {
    const recipient = toInternationalFormat(phone);

    const response = await sms.send({
      to:      [recipient],
      message,
    });

    console.log("📤 SMS sent:", JSON.stringify(response));
    return response;

  } catch (error) {
    // Don't let an SMS failure crash the whole request — log it and
    // let the calling code decide what to do (e.g. dev console fallback)
    console.error("❌ SMS send failed:", error.message);
    throw error;
  }
};

module.exports = sendSms;