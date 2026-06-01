import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.js";

export async function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await AdminUser.findById(payload.id).select("_id name email role isActive");

    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: "Invalid admin account" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}
