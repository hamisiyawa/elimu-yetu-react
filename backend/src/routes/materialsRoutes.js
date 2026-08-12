const express = require("express");
const router  = express.Router();
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");

const {
  getMaterials,
  getMyMaterials,
  getMaterialById,
  uploadMaterial,
  updateMaterial,  
  downloadMaterial,
  updateMaterialStatus,
  deleteMaterial,
  getPendingMaterials,
} = require("../controllers/materialsController");

const { protect, authorise } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ── Optional auth ─────────────────────────────────────────────
// Attaches req.user if a valid token is present.
// Does NOT block the request if there is no token.
// Used for download so guests can still download free materials
// but logged-in users get their download logged with their userId.
const optionalAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    try {
      const token   = header.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user      = await User.findById(decoded.id).select("-password");
    } catch {
      // invalid token — treat as guest, continue
    }
  }
  next();
};

// ── Public routes ─────────────────────────────────────────────
router.get("/",          getMaterials);
router.get("/pending",   protect, authorise("admin"), getPendingMaterials);
router.get("/my",        protect, authorise("teacher"), getMyMaterials);
router.get("/:id",       getMaterialById);

// Download — public but logs user if token present
router.post("/:id/download", optionalAuth, downloadMaterial);

// ── Teacher routes ────────────────────────────────────────────
// upload.fields handles multiple file fields in one request
// "file" is the document, "coverImage" is optional
router.post(
  "/",
  protect,
  authorise("teacher"),
  upload.fields([
    { name: "file",       maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  uploadMaterial
);

// ── Admin routes ──────────────────────────────────────────────
router.patch(
  "/:id/status",
  protect,
  authorise("admin"),
  updateMaterialStatus
);

// Teacher can update their own pending materials
router.patch(
  "/:id", 
  protect, 
  authorise("teacher"), 
  updateMaterial
);

router.delete("/:id", protect, authorise("teacher"), deleteMaterial);



module.exports = router;