require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const path    = require("path");
const fs      = require("fs");// Import the fs module for file system operations

const connectDB    = require("./config/db");
const authRoutes   = require("./routes/authRoutes");
const materialsRoutes = require("./routes/materialsRoutes");
const errorHandler = require("./middleware/errorHandler");
const notificationRoutes = require("./routes/notificationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
// Connect to MongoDB
connectDB();

const app = express();

// ── Global middleware ──────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  exposedHeaders: ["Content-Disposition"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ── Mount routes ───────────────────────────────────────────────
// Every request to /api/auth/... is handled by authRoutes
app.use("/api/auth", authRoutes);
app.use("/api/materials", materialsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);
// ── Health check ───────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status:      "ok",
    message:     "Elimu Yetu API is running",
    environment: process.env.NODE_ENV,
  });
});

// ── 404 — no route matched ─────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler — must be last ───────────────────────
app.use(errorHandler);

// ── Start listening ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health\n`);
});