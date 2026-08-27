const Material = require("../models/Material");
const Download = require("../models/Download");
const path     = require("path");
const fs       = require("fs");
const notify = require("../utils/notify");
const User   = require("../models/User");
const cloudinary = require("../config/cloudinary");
const Purchase = require("../models/Purchase");

// ─────────────────────────────────────────────────────────────
// @route   GET /api/materials
// @desc    Get all approved materials — supports filtering and pagination
// @access  Public
// ─────────────────────────────────────────────────────────────
const getMaterials = async (req, res, next) => {
  try {
    const {
      level, grade, subject, term,
      year, type, search,
      sort,          // ← new param: "downloads" | "new" | default newest
      page  = 1,
      limit = 10,
    } = req.query;

    const filter = { status: "approved" };

    if (level)   filter.level   = level;
    if (grade)   filter.grade   = grade;
    if (subject) filter.subject = subject;
    if (term)    filter.term    = term;
    if (year)    filter.year    = year;
    if (type)    filter.type    = type;
    if (search)  filter.title   = { $regex: search, $options: "i" };

    // ── Sort-specific filters ─────────────────────────────────
    if (sort === "downloads") {
      // only return materials that have been downloaded at least once
      // this ensures the "Most Downloaded" section is meaningful
      filter.downloadCount = { $gt: 0 };
    }

    if (sort === "new") {
      // only return materials uploaded within the last 7 days
      const sevenDaysAgo  = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filter.createdAt = { $gte: sevenDaysAgo };
    }

    // ── Sort order ────────────────────────────────────────────
    let sortOrder;
    if (sort === "downloads") {
      sortOrder = { downloadCount: -1 }; // highest downloads first
    } else {
      sortOrder = { createdAt: -1 };     // newest first for all other cases
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [total, materials] = await Promise.all([
      Material.countDocuments(filter),
      Material.find(filter)
        .populate("uploadedBy", "name username")
        .sort(sortOrder)
        .skip(skip)
        .limit(Number(limit)),
    ]);

    res.status(200).json({
      materials,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   GET /api/materials/my
// @desc    Get all materials uploaded by the logged-in teacher
// @access  Private — teacher only
// ─────────────────────────────────────────────────────────────
const getMyMaterials = async (req, res, next) => {
  try {
    const materials = await Material.find({ uploadedBy: req.user._id })
      .sort(req.query.sort === "downloads"
        ? { downloadCount: -1 }
        : { createdAt: -1 }
      );

    res.status(200).json({ materials });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   GET /api/materials/:id
// @desc    Get a single material by ID — increments view count
// @access  Public
// ─────────────────────────────────────────────────────────────
const getMaterialById = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate("uploadedBy", "name username");

    if (!material || material.status !== "approved") {
      res.status(404);
      throw new Error("Material not found");
    }

    // Increment view count — $inc is atomic, no race condition risk
    await Material.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

    res.status(200).json({ material });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   POST /api/materials
// @desc    Upload a new material — teacher only
//          Accepts multipart/form-data with file and optional coverImage
// @access  Private — teacher only
// ─────────────────────────────────────────────────────────────
const uploadMaterial = async (req, res, next) => {
  try {
    const {
      title, type, level, grade,
      subject, term, year,
      isFree, price,
    } = req.body;

    // multer attaches uploaded files to req.files
    // req.files.file[0] is the document
    // req.files.coverImage is optional
    if (!req.files || !req.files.file) {
      res.status(400);
      throw new Error("Please upload a document file");
    }

    const fileUrl      = req.files.file[0].path;
    const filePublicId = req.files.file[0].filename;

    const coverImage         = req.files.coverImage ? req.files.coverImage[0].path     : null;
    const coverImagePublicId = req.files.coverImage ? req.files.coverImage[0].filename  : null;

    // isFree comes as a string from form-data — convert to boolean
    const isFreeBoolean = isFree === "true" || isFree === true;

    // Validate price for paid materials
    if (!isFreeBoolean && (!price || Number(price) < 10)) {
      res.status(400);
      throw new Error("Paid materials must have a price of at least KES 10");
    }

    const material = await Material.create({
      title,
      type,
      level,
      grade,
      subject,
      term,
      year,
      fileUrl,
      filePublicId,
      coverImage,
      coverImagePublicId,
      uploadedBy: req.user._id,
      isFree:     isFreeBoolean,
      price:      isFreeBoolean ? 0 : Number(price),
      status:     "pending", // every upload waits for admin approval
    });

    // Notify every admin — a new material is waiting for review
    const admins = await User.find({ role: "admin" }).select("_id");
    await Promise.all(admins.map((admin) =>
      notify({
        recipient: admin._id,
        type:      "info",
        message:   `New material "${material.title}" was uploaded and is awaiting review`,
        relatedMaterial: material._id,
      })
    )); 
     
    // Respond with the newly created material
    res.status(201).json({
      message:  "Material uploaded successfully. It will be reviewed before publishing.",
      material,
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   PATCH /api/materials/:id
// @desc    Update a pending material — teacher only
// @access  Private — teacher only
// ─────────────────────────────────────────────────────────────
const updateMaterial = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      res.status(404);
      throw new Error("Material not found");
    }

    if (material.uploadedBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You can only update your own materials");
    }

    if (material.status !== "pending") {
      res.status(400);
      throw new Error(`Cannot update a material that is ${material.status}`);
    }

    const { title, type, level, grade, subject, term, year, isFree, price } = req.body;

    if (title)   material.title   = title;
    if (type)    material.type    = type;
    if (level)   material.level   = level;
    if (grade)   material.grade   = grade;
    if (subject) material.subject = subject;
    if (term)    material.term    = term;
    if (year)    material.year    = year;

    if (isFree !== undefined) {
      material.isFree = isFree === "true" || isFree === true;
      material.price  = material.isFree ? 0 : Number(price) || material.price;
    }

    await material.save();
    res.status(200).json({
      message: "Material updated successfully",
      material,
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   POST /api/materials/:id/download
// @desc    Verify access (free, or a completed Purchase for paid
//          materials), log the download, and stream the file back
//          directly — the raw Cloudinary URL is never sent to the
//          client, so it can't be shared/reused to bypass payment.
// @access  Public — guests and logged-in users
// ─────────────────────────────────────────────────────────────
const downloadMaterial = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material || material.status !== "approved") {
      res.status(404);
      throw new Error("Material not found");
    }

    if (!material.isFree) {
      if (!req.user) {
        return res.status(401).json({
          message: "Please log in to purchase this material",
        });
      }

      const purchase = await Purchase.findOne({
        buyer:    req.user._id,
        material: material._id,
        status:   "completed",
      });

      if (!purchase) {
        return res.status(402).json({
          message:  "This material requires payment before download",
          price:    material.price,
          currency: material.currency,
          materialId: material._id,
        });
      }
    }

    // Access confirmed (free, or a real completed purchase) —
    // log the download and count it
    await Material.findByIdAndUpdate(req.params.id, { $inc: { downloadCount: 1 } });

    await Download.create({
      material:     material._id,
      downloadedBy: req.user?._id || null,
      ipAddress:    req.ip,
    });

    // Fetch the actual file from Cloudinary server-side and stream
    // it straight through — the client only ever sees THIS server's
    // URL, never the underlying Cloudinary one
    const cloudinaryResponse = await fetch(material.fileUrl);

    if (!cloudinaryResponse.ok) {
      res.status(502);
      throw new Error("Failed to retrieve the file — please try again");
    }

    const ext = material.fileUrl.split(".").pop();
    const safeTitle = material.title.replace(/[^a-zA-Z0-9-_ ]/g, "").trim();

    res.setHeader("Content-Type", cloudinaryResponse.headers.get("content-type") || "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.${ext}"`);

    const reader = cloudinaryResponse.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();

  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────────────────────
// @route   POST /api/materials/:id/grant-access
// @desc    Manually grant a user access to a paid material —
//          for support cases, or for testing before Phase 2
//          (real M-Pesa integration) exists.
// @access  Private — admin only
// ─────────────────────────────────────────────────────────────
const grantMaterialAccess = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400);
      throw new Error("userId is required");
    }

    const material = await Material.findById(req.params.id);
    if (!material) {
      res.status(404);
      throw new Error("Material not found");
    }

    const existing = await Purchase.findOne({
      buyer: userId, material: material._id, status: "completed",
    });
    if (existing) {
      res.status(409);
      throw new Error("This user already has access to this material");
    }

    const { splitAmount } = require("../config/paymentConfig");
    const { teacherEarning, platformFee } = splitAmount(material.price);

    const purchase = await Purchase.create({
      buyer:      userId,
      material:   material._id,
      amountPaid: material.price,
      teacherEarning,
      platformFee,
      paymentMethod: "admin_grant",
      status: "completed",
    });

    res.status(201).json({ message: "Access granted", purchase });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   PATCH /api/materials/:id/status
// @desc    Approve or reject a pending material
// @access  Private — admin only
// ─────────────────────────────────────────────────────────────
const updateMaterialStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      res.status(400);
      throw new Error("Status must be 'approved' or 'rejected'");
    }

    if (status === "rejected" && !rejectionReason) {
      res.status(400);
      throw new Error("Please provide a reason for rejection");
    }

    const material = await Material.findById(req.params.id);

    if (!material) {
      res.status(404);
      throw new Error("Material not found");
    }

    material.status          = status;
    material.approvedBy      = req.user._id;
    material.rejectionReason = status === "rejected" ? rejectionReason : null;

    await material.save();

        // Notify the uploader — but only if they haven't opted out of
    // this specific notification type in their settings
    const uploader = await User.findById(material.uploadedBy);

    const prefKey = status === "approved" ? "materialApproved" : "materialRejected";
    const wantsThisNotification = uploader?.preferences?.[prefKey] !== false;

    if (uploader && wantsThisNotification) {
      await notify({
        recipient: uploader._id,
        type:      status === "approved" ? "success" : "danger",
        message:   status === "approved"
          ? `Your material "${material.title}" was approved and is now live`
          : `Your material "${material.title}" was rejected: ${rejectionReason}`,
        relatedMaterial: material._id,
      });
    }

    res.status(200).json({
      message:  `Material ${status} successfully`,
      material,
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   DELETE /api/materials/:id
// @desc    Delete a material and its files from disk
// @access  Private — teacher (own materials only)
// ─────────────────────────────────────────────────────────────
const deleteMaterial = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      res.status(404);
      throw new Error("Material not found");
    }

    // Only the uploader can delete their own material
    if (material.uploadedBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You can only delete your own materials");
    }

    // Delete the file from Cloudinary
    if (material.filePublicId) {
      await cloudinary.uploader.destroy(material.filePublicId, { resource_type: "raw" });
    }

    // Delete cover image from Cloudinary if it exists
    if (material.coverImagePublicId) {
      await cloudinary.uploader.destroy(material.coverImagePublicId, { resource_type: "image" });
    }

    await material.deleteOne();

    res.status(200).json({ message: "Material deleted successfully" });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   GET /api/materials/pending
// @desc    Get all pending materials — admin approval queue
// @access  Private — admin only
// ─────────────────────────────────────────────────────────────
const getPendingMaterials = async (req, res, next) => {
  try {
    const materials = await Material.find({ status: "pending" })
      .populate("uploadedBy", "name username phone")
      .sort({ createdAt: 1 }); // oldest first — approve in order

    res.status(200).json({ materials, total: materials.length });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMaterials,
  getMyMaterials,
  getMaterialById,
  uploadMaterial,
  updateMaterial,  
  downloadMaterial,
  updateMaterialStatus,
  deleteMaterial,
  getPendingMaterials,
  grantMaterialAccess,
};