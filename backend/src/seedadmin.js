// ── One-time script to create the first admin account ─────────
// Run this ONCE from the backend folder with: node src/seedAdmin.js
// It connects directly to MongoDB, bypassing the public register/OTP
// flow entirely, and inserts a single pre-verified admin user.
//
// SAFE TO RUN MULTIPLE TIMES — it checks if an admin with this
// username already exists and skips creation if so.

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

// ── Edit these three values before running ──────────────────────
const ADMIN_NAME     = "Hamisi Admin";
const ADMIN_USERNAME = "admin";          // used to log in — must be unique
const ADMIN_PHONE    = "0750810781";     // any unused number — required by schema
const ADMIN_PASSWORD = "Admin123!";   // change this immediately after first login
// ──────────────────────────────────────────────────────────────

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await User.findOne({ username: ADMIN_USERNAME });

    if (existing) {
      console.log(`⚠️  An account with username "${ADMIN_USERNAME}" already exists — skipping.`);
      process.exit(0);
    }

    // User.create triggers the pre-save hook which hashes the password
    // automatically — we never store the plain password
    const admin = await User.create({
      name:       ADMIN_NAME,
      username:   ADMIN_USERNAME,
      phone:      ADMIN_PHONE,
      password:   ADMIN_PASSWORD,
      role:       "admin",
      isVerified: true, // skip OTP entirely — this account is trusted immediately
    });

    console.log("✅ Admin account created successfully:");
    console.log(`   Username: ${ADMIN_USERNAME}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Login at: /login?admin=true`);
    console.log("\n⚠️  Change this password after your first login.\n");

    process.exit(0);

  } catch (error) {
    console.error("❌ Failed to seed admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();