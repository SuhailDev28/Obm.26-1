import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

import AdminUser from "./models/AdminUser.js";
import SiteSetting, { defaultSettings } from "./models/SiteSetting.js";

import authRoutes from "./routes/auth.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import contactRoutes from "./routes/contact.routes.js";

const app = express();

const PORT = Number(process.env.PORT || 5001);

/**
 * Allow multiple frontend domains.
 *
 * In Render env, you can also set:
 * CLIENT_ORIGIN=https://www.ostrichess.com,https://ostrichess.com
 */
const allowedOrigins = String(
  process.env.CLIENT_ORIGIN ||
    "http://localhost:5173,http://localhost:4173,https://www.ostrichess.com,https://ostrichess.com",
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

/**
 * Upload directory.
 * Your current code stores uploads in: server/src/uploads
 */
const uploadDir = path.join(process.cwd(), "src", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server, Postman, curl, health checks, and same-origin requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options("*", cors());

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/**
 * Serve uploaded files.
 *
 * Correct URL:
 * https://api.ostrichess.com/uploads/filename.png
 */
app.use(
  "/uploads",
  express.static(uploadDir, {
    maxAge: "7d",
    fallthrough: true,
  }),
);

/**
 * Temporary fallback for old/wrong saved logo paths.
 * Your screenshot showed:
 * /u_oads/obm-logo.png
 *
 * This redirects it to:
 * /uploads/obm-logo.png
 */
app.use("/u_oads", (req, res) => {
  return res.redirect(301, `/uploads${req.url}`);
});

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "OBM API running",
    health: "/api/health",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "OBM API running",
    environment: process.env.NODE_ENV || "development",
    allowedOrigins,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api", settingsRoutes);
app.use("/api/contact", contactRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((error, _req, res, _next) => {
  console.error(error);

  const status = error.status || error.statusCode || 500;

  res.status(status).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

async function seedAdmin() {
  const email = String(process.env.ADMIN_EMAIL || "admin@obm.qa")
    .trim()
    .toLowerCase();

  const password = String(process.env.ADMIN_PASSWORD || "Admin@12345");

  const existing = await AdminUser.findOne({ email });

  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 12);

  await AdminUser.create({
    name: "OBM Admin",
    email,
    passwordHash,
    role: "SUPER_ADMIN",
  });

  console.log(`Seeded admin login: ${email}`);
}

async function seedSettings() {
  await SiteSetting.findOneAndUpdate(
    { key: "main" },
    {
      $setOnInsert: {
        ...defaultSettings,
        key: "main",
      },
    },
    {
      upsert: true,
      new: true,
    },
  );
}

async function start() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET missing in environment variables");
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI missing in environment variables");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");

  await seedAdmin();
  await seedSettings();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`OBM API running on port ${PORT}`);
    console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
    console.log(`Uploads served from: ${uploadDir}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});