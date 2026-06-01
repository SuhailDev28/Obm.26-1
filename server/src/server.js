import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import bcrypt from "bcryptjs";

import AdminUser from "./models/AdminUser.js";
import SiteSetting, { defaultSettings } from "./models/SiteSetting.js";

import authRoutes from "./routes/auth.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import contactRoutes from "./routes/contact.routes.js";

const app = express();

const PORT = Number(process.env.PORT || 5001);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "src", "uploads")),
);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "OBM API running",
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

  res.status(error.status || 500).json({
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
    throw new Error("JWT_SECRET missing in .env");
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI missing in .env");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");

  await seedAdmin();
  await seedSettings();

  app.listen(PORT, () => {
    console.log(`OBM API running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});