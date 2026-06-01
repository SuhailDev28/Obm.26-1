import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import SiteSetting, { defaultSettings } from "../models/SiteSetting.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const uploadDir = path.join(process.cwd(), "src", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || ".png").toLowerCase();
    cb(null, `logo-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    cb(null, true);
  },
});

async function getSettingsDocument() {
  return SiteSetting.findOneAndUpdate(
    { key: "main" },
    { $setOnInsert: { ...defaultSettings, key: "main" } },
    { new: true, upsert: true },
  ).lean();
}

function sanitizeSettings(input = {}) {
  const allowed = Object.keys(defaultSettings);
  const output = {};

  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      output[key] = String(input[key] ?? "").trim();
    }
  }

  return output;
}

router.get("/settings", async (_req, res, next) => {
  try {
    const settings = await getSettingsDocument();
    res.json({ success: true, settings: { ...defaultSettings, ...settings } });
  } catch (error) {
    next(error);
  }
});

router.put("/admin/settings", requireAdmin, async (req, res, next) => {
  try {
    const payload = sanitizeSettings(req.body);
    const settings = await SiteSetting.findOneAndUpdate(
      { key: "main" },
      { $set: { ...payload, updatedBy: req.admin._id }, $setOnInsert: { key: "main" } },
      { new: true, upsert: true },
    ).lean();

    res.json({ success: true, settings: { ...defaultSettings, ...settings } });
  } catch (error) {
    next(error);
  }
});

router.post("/admin/upload-logo", requireAdmin, upload.single("logo"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Logo image is required" });
    }

    const logo = `/uploads/${req.file.filename}`;
    const settings = await SiteSetting.findOneAndUpdate(
      { key: "main" },
      { $set: { logo, updatedBy: req.admin._id }, $setOnInsert: { key: "main" } },
      { new: true, upsert: true },
    ).lean();

    res.json({ success: true, logo, settings: { ...defaultSettings, ...settings } });
  } catch (error) {
    next(error);
  }
});

router.post("/admin/reset-settings", requireAdmin, async (req, res, next) => {
  try {
    const settings = await SiteSetting.findOneAndUpdate(
      { key: "main" },
      { $set: { ...defaultSettings, updatedBy: req.admin._id }, $setOnInsert: { key: "main" } },
      { new: true, upsert: true },
    ).lean();

    res.json({ success: true, settings: { ...defaultSettings, ...settings } });
  } catch (error) {
    next(error);
  }
});

export default router;
