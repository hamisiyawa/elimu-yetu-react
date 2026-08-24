const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Documents accepted for the "file" field (the material itself)
const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Images accepted for "coverImage" and "profileImage" —
// SVG is deliberately excluded: it can carry embedded <script> tags.
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Cloudinary needs to know, per file, which folder to put it in and
// whether it's an "image" (gets thumbnails/transformations) or a
// "raw" file (PDFs/Word docs — stored as-is, no image processing)
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {

    if (file.fieldname === "file") {
      // Raw resources on Cloudinary don't auto-preserve the original
      // extension — without it, browsers can't tell it's a PDF/DOCX
      // and just download a random-named blob instead of previewing it.
      // Building the public_id ourselves, WITH the extension included,
      // fixes both the broken preview and the ugly random filename.
      const ext = file.originalname.split(".").pop();
      const safeName = file.originalname
        .replace(/\.[^/.]+$/, "")           // strip the original extension
        .replace(/[^a-zA-Z0-9-_]/g, "_");   // strip spaces/special chars

      return {
        folder: "elimu-yetu/materials",
        resource_type: "raw",
        public_id: `${Date.now()}-${safeName}.${ext}`,
      };
    }

    if (file.fieldname === "coverImage") {
      return {
        folder: "elimu-yetu/covers",
        resource_type: "image",
      };
    }

    if (file.fieldname === "profileImage") {
      return {
        folder: "elimu-yetu/avatars",
        resource_type: "image",
      };
    }

    return { folder: "elimu-yetu/misc" };
  },
});

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