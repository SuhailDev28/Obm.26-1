import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import SiteSetting, { defaultSettings } from "../models/SiteSetting.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "src", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const lightModeDefaultSettings = {
  lightPrimaryColor: "#2563eb",
  lightSecondaryColor: "#7c3aed",
  lightAccentColor: "#0891b2",
  lightBackgroundColor: "#f8fafc",
  lightSurfaceColor: "#ffffff",
  lightTextColor: "#0f172a",
  lightMutedTextColor: "#475569",
  lightIconColor: "#1d4ed8",
  lightBorderColor: "#e2e8f0",
};

const effectiveDefaultSettings = {
  ...effectiveDefaultSettings,
  ...lightModeDefaultSettings,
};

const BOOLEAN_FIELDS = new Set(["contactEmailEnabled", "smtpEnabled"]);

const PROTECTED_FIELDS = new Set(["key", "_id", "__v", "createdAt", "updatedAt", "updatedBy"]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),

  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || ".png").toLowerCase();
    cb(null, `logo-${Date.now()}${ext || ".png"}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype?.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }

    cb(null, true);
  },
});

async function getSettingsDocument() {
  return SiteSetting.findOneAndUpdate(
    { key: "main" },
    {
      $setOnInsert: {
        ...effectiveDefaultSettings,
        key: "main",
      },
    },
    {
      new: true,
      upsert: true,
    },
  ).lean();
}

function mergeSettings(settings = {}) {
  return {
    ...effectiveDefaultSettings,
    ...settings,
    smtpPass: settings.smtpPass || "",
  };
}

function normalizeBoolean(value) {
  if (typeof value === "boolean") return value;

  if (typeof value === "number") return value === 1;

  const text = String(value || "").trim().toLowerCase();

  return ["true", "1", "yes", "on"].includes(text);
}

function sanitizeSettings(input = {}) {
  const allowed = Object.keys(effectiveDefaultSettings);
  const output = {};

  for (const key of allowed) {
    if (PROTECTED_FIELDS.has(key)) continue;

    if (Object.prototype.hasOwnProperty.call(input, key)) {
      if (BOOLEAN_FIELDS.has(key)) {
        output[key] = normalizeBoolean(input[key]);
      } else {
        output[key] = String(input[key] ?? "").trim();
      }
    }
  }

  return output;
}

function deleteOldLogoFile(logoPath = "") {
  const value = String(logoPath || "").trim();

  if (!value.startsWith("/uploads/logo-")) return;

  const filename = path.basename(value);
  const filePath = path.join(uploadDir, filename);

  fs.promises.unlink(filePath).catch(() => {});
}

router.get("/settings", async (_req, res, next) => {
  try {
    const settings = await getSettingsDocument();

    res.json({
      success: true,
      settings: mergeSettings(settings),
    });
  } catch (error) {
    next(error);
  }
});

router.put("/admin/settings", requireAdmin, async (req, res, next) => {
  try {
    const payload = sanitizeSettings(req.body);

    const settings = await SiteSetting.findOneAndUpdate(
      { key: "main" },
      {
        $set: {
          ...payload,
          updatedBy: req.admin?._id || null,
        },
        $setOnInsert: {
          key: "main",
        },
      },
      {
        new: true,
        upsert: true,
      },
    ).lean();

    res.json({
      success: true,
      settings: mergeSettings(settings),
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/admin/upload-logo",
  requireAdmin,
  (req, res, next) => {
    upload.single("logo")(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "Logo image must be less than 3MB",
          });
        }

        return res.status(400).json({
          success: false,
          message: error.message || "Logo upload failed",
        });
      }

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Logo upload failed",
        });
      }

      next();
    });
  },
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Logo image is required",
        });
      }

      const existingSettings = await getSettingsDocument();

      const logo = `/uploads/${req.file.filename}`;

      const settings = await SiteSetting.findOneAndUpdate(
        { key: "main" },
        {
          $set: {
            logo,
            updatedBy: req.admin?._id || null,
          },
          $setOnInsert: {
            key: "main",
          },
        },
        {
          new: true,
          upsert: true,
        },
      ).lean();

      if (existingSettings?.logo && existingSettings.logo !== logo) {
        deleteOldLogoFile(existingSettings.logo);
      }

      res.json({
        success: true,
        logo,
        settings: mergeSettings(settings),
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post("/admin/reset-settings", requireAdmin, async (req, res, next) => {
  try {
    const existingSettings = await getSettingsDocument();

    const settings = await SiteSetting.findOneAndUpdate(
      { key: "main" },
      {
        $set: {
          ...effectiveDefaultSettings,
          updatedBy: req.admin?._id || null,
        },
        $setOnInsert: {
          key: "main",
        },
      },
      {
        new: true,
        upsert: true,
      },
    ).lean();

    if (
      existingSettings?.logo &&
      existingSettings.logo !== effectiveDefaultSettings.logo
    ) {
      deleteOldLogoFile(existingSettings.logo);
    }

    res.json({
      success: true,
      settings: mergeSettings(settings),
    });
  } catch (error) {
    next(error);
  }
});

export default router;