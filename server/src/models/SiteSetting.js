import mongoose from "mongoose";

export const defaultSettings = {
  siteName: "OBM",
  tagline: "AI Consultancy & Software Development",

  // Make sure this file exists inside backend /uploads folder.
  // If your actual file name is "ogo-1780319743876.png", keep it as below.
  logo: "/uploads/ogo-1780319743876.png",

  primaryColor: "#22d3ee",
  secondaryColor: "#2563eb",
  accentColor: "#a855f7",

  lightPrimaryColor: "#2563eb",
  lightSecondaryColor: "#7c3aed",
  lightAccentColor: "#0891b2",
  lightBackgroundColor: "#f8fafc",
  lightSurfaceColor: "#ffffff",
  lightTextColor: "#0f172a",
  lightMutedTextColor: "#475569",
  lightIconColor: "#1d4ed8",
  lightBorderColor: "#e2e8f0",

  heroBadge: "Complete technology partner for startups and enterprises",
  heroTitle: "Build smarter digital products with AI, software, and automation.",
  heroText:
    "OBM helps businesses design, build, automate, and scale high-performance digital products, enterprise systems, web platforms, mobile apps, CRM, HRMS, CMS, e-commerce, and AI-enabled workflows.",

  ctaPrimary: "Start Your Project",
  ctaSecondary: "Explore Services",

  email: "hello@obm.qa",
  phone: "+974 0000 0000",
  location: "Doha, Qatar",
  websiteUrl: "https://obm.qa",

  whatsapp: "+97400000000",
  facebook: "",
  instagram: "",
  linkedin: "https://www.linkedin.com/company/obm",
  xTwitter: "",
  youtube: "",
  tiktok: "",
  threads: "",
  snapchat: "",
  pinterest: "",
  telegram: "",
  googleBusiness: "",

  footerText: "AI Consultancy • Product Engineering • Enterprise Automation",

  contactEmailEnabled: true,
  contactRecipientEmail: "hello@obm.qa",
  contactEmailSubjectPrefix: "New OBM Website Inquiry",

  smtpEnabled: false,
  smtpHost: "",
  smtpPort: "587",
  smtpUser: "",
  smtpPass: "",
  smtpFrom: "",
};

const siteSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "main",
      trim: true,
    },

    siteName: {
      type: String,
      default: defaultSettings.siteName,
      trim: true,
    },

    tagline: {
      type: String,
      default: defaultSettings.tagline,
      trim: true,
    },

    logo: {
      type: String,
      default: defaultSettings.logo,
      trim: true,
    },

    primaryColor: {
      type: String,
      default: defaultSettings.primaryColor,
      trim: true,
    },

    secondaryColor: {
      type: String,
      default: defaultSettings.secondaryColor,
      trim: true,
    },

    accentColor: {
      type: String,
      default: defaultSettings.accentColor,
      trim: true,
    },

    lightPrimaryColor: {
      type: String,
      default: defaultSettings.lightPrimaryColor,
      trim: true,
    },

    lightSecondaryColor: {
      type: String,
      default: defaultSettings.lightSecondaryColor,
      trim: true,
    },

    lightAccentColor: {
      type: String,
      default: defaultSettings.lightAccentColor,
      trim: true,
    },

    lightBackgroundColor: {
      type: String,
      default: defaultSettings.lightBackgroundColor,
      trim: true,
    },

    lightSurfaceColor: {
      type: String,
      default: defaultSettings.lightSurfaceColor,
      trim: true,
    },

    lightTextColor: {
      type: String,
      default: defaultSettings.lightTextColor,
      trim: true,
    },

    lightMutedTextColor: {
      type: String,
      default: defaultSettings.lightMutedTextColor,
      trim: true,
    },

    lightIconColor: {
      type: String,
      default: defaultSettings.lightIconColor,
      trim: true,
    },

    lightBorderColor: {
      type: String,
      default: defaultSettings.lightBorderColor,
      trim: true,
    },

    heroBadge: {
      type: String,
      default: defaultSettings.heroBadge,
      trim: true,
    },

    heroTitle: {
      type: String,
      default: defaultSettings.heroTitle,
      trim: true,
    },

    heroText: {
      type: String,
      default: defaultSettings.heroText,
      trim: true,
    },

    ctaPrimary: {
      type: String,
      default: defaultSettings.ctaPrimary,
      trim: true,
    },

    ctaSecondary: {
      type: String,
      default: defaultSettings.ctaSecondary,
      trim: true,
    },

    email: {
      type: String,
      default: defaultSettings.email,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: defaultSettings.phone,
      trim: true,
    },

    location: {
      type: String,
      default: defaultSettings.location,
      trim: true,
    },

    websiteUrl: {
      type: String,
      default: defaultSettings.websiteUrl,
      trim: true,
    },

    whatsapp: {
      type: String,
      default: defaultSettings.whatsapp,
      trim: true,
    },

    facebook: {
      type: String,
      default: defaultSettings.facebook,
      trim: true,
    },

    instagram: {
      type: String,
      default: defaultSettings.instagram,
      trim: true,
    },

    linkedin: {
      type: String,
      default: defaultSettings.linkedin,
      trim: true,
    },

    xTwitter: {
      type: String,
      default: defaultSettings.xTwitter,
      trim: true,
    },

    youtube: {
      type: String,
      default: defaultSettings.youtube,
      trim: true,
    },

    tiktok: {
      type: String,
      default: defaultSettings.tiktok,
      trim: true,
    },

    threads: {
      type: String,
      default: defaultSettings.threads,
      trim: true,
    },

    snapchat: {
      type: String,
      default: defaultSettings.snapchat,
      trim: true,
    },

    pinterest: {
      type: String,
      default: defaultSettings.pinterest,
      trim: true,
    },

    telegram: {
      type: String,
      default: defaultSettings.telegram,
      trim: true,
    },

    googleBusiness: {
      type: String,
      default: defaultSettings.googleBusiness,
      trim: true,
    },

    footerText: {
      type: String,
      default: defaultSettings.footerText,
      trim: true,
    },

    contactEmailEnabled: {
      type: Boolean,
      default: defaultSettings.contactEmailEnabled,
    },

    contactRecipientEmail: {
      type: String,
      default: defaultSettings.contactRecipientEmail,
      trim: true,
      lowercase: true,
    },

    contactEmailSubjectPrefix: {
      type: String,
      default: defaultSettings.contactEmailSubjectPrefix,
      trim: true,
    },

    smtpEnabled: {
      type: Boolean,
      default: defaultSettings.smtpEnabled,
    },

    smtpHost: {
      type: String,
      default: defaultSettings.smtpHost,
      trim: true,
    },

    smtpPort: {
      type: String,
      default: defaultSettings.smtpPort,
      trim: true,
    },

    smtpUser: {
      type: String,
      default: defaultSettings.smtpUser,
      trim: true,
    },

    smtpPass: {
      type: String,
      default: defaultSettings.smtpPass,
      trim: true,
      select: false,
    },

    smtpFrom: {
      type: String,
      default: defaultSettings.smtpFrom,
      trim: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("SiteSetting", siteSettingSchema);