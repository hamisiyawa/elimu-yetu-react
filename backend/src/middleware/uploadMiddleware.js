const multer = require("multer");
const path   = require("path");
const fs     = require("fs");// Import the fs module for file system operations

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

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

module.exports = upload;