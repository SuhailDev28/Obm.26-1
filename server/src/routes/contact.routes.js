// server/src/routes/contact.routes.js
import express from "express";

import ContactMessage from "../models/ContactMessage.js";
import SiteSetting from "../models/SiteSetting.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { sendContactInquiryEmail } from "../lib/mailer.js";

const router = express.Router();

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];

  if (forwarded) {
    return String(forwarded).split(",")[0].trim();
  }

  return req.socket?.remoteAddress || "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

/**
 * Public: submit contact form
 * POST /api/contact
 */
router.post("/", async (req, res, next) => {
  try {
    const { name, email, companyName, serviceType, message } = req.body;

    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanCompanyName = String(companyName || "").trim();
    const cleanServiceType = String(serviceType || "General Inquiry").trim();
    const cleanMessage = String(message || "").trim();

    if (!cleanName) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    if (!cleanEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (!cleanMessage) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const contactMessage = await ContactMessage.create({
      name: cleanName,
      email: cleanEmail,
      companyName: cleanCompanyName,
      serviceType: cleanServiceType,
      message: cleanMessage,
      ipAddress: getClientIp(req),
      userAgent: req.headers["user-agent"] || "",
    });

    let emailResult = {
      attempted: false,
      sent: false,
      reason: "EMAIL_DISABLED",
    };

    try {
      const settings = await SiteSetting.findOne({ key: "main" }).lean();

      const contactEmailEnabled = Boolean(settings?.contactEmailEnabled);
      const recipientEmail = String(settings?.contactRecipientEmail || "")
        .trim()
        .toLowerCase();

      const subjectPrefix = String(
        settings?.contactEmailSubjectPrefix || "New OBM Website Inquiry",
      ).trim();

      if (contactEmailEnabled && recipientEmail && isValidEmail(recipientEmail)) {
        emailResult = {
          attempted: true,
          sent: false,
          reason: "",
        };

        const result = await sendContactInquiryEmail({
          to: recipientEmail,
          subject: `${subjectPrefix} - ${contactMessage.name}`,
          contactMessage,
        });

        emailResult = {
          attempted: true,
          sent: Boolean(result?.sent),
          reason: result?.reason || "",
        };
      }
    } catch (emailError) {
      console.error("Contact inquiry email failed:", emailError);

      emailResult = {
        attempted: true,
        sent: false,
        reason: "EMAIL_SEND_FAILED",
      };
    }

    return res.status(201).json({
      success: true,
      message: "Your inquiry has been submitted successfully.",
      contactMessage: {
        id: contactMessage._id,
        name: contactMessage.name,
        email: contactMessage.email,
        serviceType: contactMessage.serviceType,
        status: contactMessage.status,
        createdAt: contactMessage.createdAt,
      },
      email: emailResult,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Admin: get all contact messages
 * GET /api/contact/admin
 */
router.get("/admin", requireAdmin, async (_req, res, next) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(300);

    return res.json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Admin: get single contact message
 * GET /api/contact/admin/:id
 */
router.get("/admin/:id", requireAdmin, async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Admin: update contact message status
 * PATCH /api/contact/admin/:id/status
 */
router.patch("/admin/:id/status", requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["NEW", "READ", "REPLIED", "ARCHIVED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status.",
      });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Admin: delete contact message
 * DELETE /api/contact/admin/:id
 */
router.delete("/admin/:id", requireAdmin, async (req, res, next) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.json({
      success: true,
      message: "Contact message deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;