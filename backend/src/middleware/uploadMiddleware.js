const multer = require("multer");
const path   = require("path");
const fs     = require("fs");// Import the fs module for file system operations


// Documents accepted for the "file" field (the material itself)
const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Images accepted for "coverImage" and "profileImage" —
// SVG is deliberately excluded: it can carry embedded <script> tags
// and would otherwise be served directly from your own domain.
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },

  filename: (req, file, cb) => {
    let prefix;
    if (file.fieldname === "file")          prefix = "material";
    else if (file.fieldname === "coverImage") prefix = "cover";
    else if (file.fieldname === "profileImage") prefix = "profile";
    else prefix = "upload";

    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${prefix}-${Date.now()}${ext}`);
  },
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "file" && !ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
    const err = new Error("Only PDF and Word documents are allowed");
    err.statusCode = 400;
    return cb(err);
  }

  if (
    (file.fieldname === "coverImage" || file.fieldname === "profileImage") &&
    !ALLOWED_IMAGE_TYPES.includes(file.mimetype)
  ) {
    const err = new Error("Only JPG, PNG, or WEBP images are allowed");
    err.statusCode = 400;
    return cb(err);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

module.exports = upload;