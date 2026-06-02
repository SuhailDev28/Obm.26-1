import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Cpu,
  Database,
  ExternalLink,
  Globe2,
  Layers3,
  Mail,
  MapPin,
  MousePointer2,
  Phone,
  Rocket,
  Share2,
  ShieldCheck,
  WandSparkles,
  Workflow,
  Zap,
} from "lucide-react";
import {
  FaFacebookF,
  FaGoogle,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaSnapchatGhost,
  FaTelegramPlane,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaThreads, FaXTwitter } from "react-icons/fa6";

import PublicNav from "../components/PublicNav.jsx";
import LogoMark from "../components/LogoMark.jsx";
import { Badge, SectionTitle, ServiceCard } from "../components/Ui.jsx";
import * as api from "../lib/api.js";
import {
  automationServices,
  industries,
  packages,
  process,
  productServices,
} from "../config/siteData.js";

const FALLBACK_API_ORIGIN = "http://localhost:5001";

const FALLBACK_SETTINGS = {
  siteName: "OBM",
  logo: "",
  primaryColor: "#22d3ee",
  secondaryColor: "#2563eb",
  accentColor: "#a855f7",

  heroBadge: "AI Consultancy & Digital Transformation",
  heroTitle: "Build smarter digital systems for your business",
  heroText:
    "OBM helps businesses launch modern websites, automation systems, dashboards, and AI-ready digital platforms.",
  ctaPrimary: "Start Your Project",
  ctaSecondary: "View Services",

  email: "info@obm.qa",
  phone: "+974 0000 0000",
  location: "Doha, Qatar",
  websiteUrl: "https://obm.qa",

  whatsapp: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  xTwitter: "",
  youtube: "",
  tiktok: "",
  threads: "",
  snapchat: "",
  pinterest: "",
  telegram: "",
  googleBusiness: "",

  footerText: "Creative digital solutions for modern businesses.",
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const floatAnimation = {
  y: [0, -10, 0],
  rotate: [0, 1.2, 0],
  transition: {
    duration: 5.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const pulseAnimation = {
  scale: [1, 1.08, 1],
  opacity: [0.45, 0.9, 0.45],
  transition: {
    duration: 3.8,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const defaultContactForm = {
  name: "",
  email: "",
  companyName: "",
  serviceType: "Product Engineering",
  message: "",
};

const socialPlatforms = [
  {
    key: "facebook",
    label: "Facebook",
    icon: FaFacebookF,
    brandColor: "#1877F2",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: FaInstagram,
    brandColor: "#E4405F",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: FaLinkedinIn,
    brandColor: "#0A66C2",
  },
  {
    key: "xTwitter",
    label: "X",
    icon: FaXTwitter,
    brandColor: "#FFFFFF",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: FaYoutube,
    brandColor: "#FF0000",
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: FaTiktok,
    brandColor: "#FFFFFF",
  },
  {
    key: "threads",
    label: "Threads",
    icon: FaThreads,
    brandColor: "#FFFFFF",
  },
  {
    key: "snapchat",
    label: "Snapchat",
    icon: FaSnapchatGhost,
    brandColor: "#FFFC00",
  },
  {
    key: "pinterest",
    label: "Pinterest",
    icon: FaPinterestP,
    brandColor: "#E60023",
  },
  {
    key: "telegram",
    label: "Telegram",
    icon: FaTelegramPlane,
    brandColor: "#26A5E4",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: FaWhatsapp,
    brandColor: "#25D366",
  },
  {
    key: "googleBusiness",
    label: "Google Business",
    icon: FaGoogle,
    brandColor: "#4285F4",
  },
  {
    key: "websiteUrl",
    label: "Website",
    icon: Globe2,
    brandColor: "#FFFFFF",
  },
];

function getApiOrigin() {
  const apiBase = String(import.meta.env.VITE_API_BASE || "")
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");

  return apiBase || FALLBACK_API_ORIGIN;
}

function resolveAssetUrl(path) {
  const value = String(path || "").trim();

  if (!value) return "";

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  const apiOrigin = getApiOrigin();

  if (value.startsWith("/")) {
    return `${apiOrigin}${value}`;
  }

  return `${apiOrigin}/${value}`;
}

function resolveSocialUrl(value, key = "") {
  const raw = String(value || "").trim();

  if (!raw) return "#";

  if (key === "whatsapp") {
    const cleaned = raw.replace(/\s+/g, "");

    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
      return cleaned;
    }

    const phone = cleaned.replace(/[^\d+]/g, "").replace(/^\+/, "");
    return `https://wa.me/${phone}`;
  }

  if (key === "telegram") {
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    return raw.startsWith("@")
      ? `https://t.me/${raw.replace("@", "")}`
      : `https://t.me/${raw}`;
  }

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }

  return `https://${raw}`;
}

function normalizeHexColor(color) {
  const raw = String(color || "").trim();

  if (!raw.startsWith("#")) return "";

  let hex = raw.slice(1);

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => `${char}${char}`)
      .join("");
  }

  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return "";

  return `#${hex.toUpperCase()}`;
}

function hexToRgb(color) {
  const hex = normalizeHexColor(color);

  if (!hex) return null;

  const value = hex.slice(1);

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function getRelativeLuminance(color) {
  const rgb = hexToRgb(color);

  if (!rgb) return 0;

  const channel = (value) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return (
    0.2126 * channel(rgb.r) +
    0.7152 * channel(rgb.g) +
    0.0722 * channel(rgb.b)
  );
}

function getContrastRatio(colorA, colorB) {
  const light = Math.max(getRelativeLuminance(colorA), getRelativeLuminance(colorB));
  const dark = Math.min(getRelativeLuminance(colorA), getRelativeLuminance(colorB));

  return (light + 0.05) / (dark + 0.05);
}

function getReadableAccentColor(primaryColor, secondaryColor, isLightMode) {
  if (!isLightMode) return primaryColor;

  const lightPageColor = "#F8FAFC";
  const candidates = [
    primaryColor,
    secondaryColor,
    "#2563EB",
    "#0F172A",
    "#111827",
  ];

  const readable = candidates
    .map((color) => normalizeHexColor(color))
    .filter(Boolean)
    .find((color) => getContrastRatio(color, lightPageColor) >= 4.5);

  return readable || "#0F172A";
}

function getSolidButtonTextColor(backgroundColor) {
  return getContrastRatio(backgroundColor, "#020617") >= 4.5
    ? "#020617"
    : "#FFFFFF";
}

function getActiveSocialLinks(settings) {
  return socialPlatforms
    .map((platform) => ({
      ...platform,
      value: String(settings?.[platform.key] || "").trim(),
    }))
    .filter((platform) => Boolean(platform.value));
}

function SafeLogo({ settings, size = "lg", className = "" }) {
  const [logoFailed, setLogoFailed] = useState(false);

  const logoUrl = resolveAssetUrl(settings?.logo);
  const hasLogo = Boolean(logoUrl) && !logoFailed;

  if (hasLogo) {
    return (
      <img
        src={logoUrl}
        alt={settings?.siteName || "OBM"}
        className={`h-10 w-auto max-w-[150px] object-contain sm:h-12 ${className}`}
        loading="eager"
        onError={() => setLogoFailed(true)}
      />
    );
  }

  return <LogoMark settings={settings} size={size} />;
}

function SocialIconLink({
  platform,
  settings,
  showLabel = false,
  compact = false,
}) {
  const Icon = platform.icon;
  const href = resolveSocialUrl(platform.value, platform.key);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={platform.label}
      title={platform.label}
      whileHover={{ y: -4, scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className={`group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/10 hover:text-white ${
        compact ? "h-10 w-10" : showLabel ? "px-4 py-3 text-sm" : "h-11 w-11"
      }`}
    >
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 transition group-hover:scale-110"
        style={{
          color: settings.isLightMode
            ? settings.iconColor
            : platform.brandColor || settings.iconColor || settings.primaryColor,
        }}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>

      {showLabel && (
        <span className="font-bold">
          {platform.label}
        </span>
      )}
    </motion.a>
  );
}

function SocialLinksRow({
  settings,
  showLabel = false,
  compact = false,
  className = "",
}) {
  const activeSocialLinks = getActiveSocialLinks(settings);

  if (!activeSocialLinks.length) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {activeSocialLinks.map((platform) => (
        <SocialIconLink
          key={platform.key}
          platform={platform}
          settings={settings}
          showLabel={showLabel}
          compact={compact}
        />
      ))}
    </div>
  );
}

function GlowOrb({ className = "", color, delay = 0 }) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{ backgroundColor: color }}
      animate={{
        scale: [1, 1.18, 1],
        opacity: [0.08, 0.2, 0.08],
      }}
      transition={{
        duration: 7,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function AnimatedGrid({ settings }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.1] sm:opacity-[0.12]"
        style={{
          backgroundImage: `linear-gradient(${settings.primaryColor}22 1px, transparent 1px), linear-gradient(90deg, ${settings.primaryColor}22 1px, transparent 1px)`,
          backgroundSize: "42px 42px",
          maskImage:
            "radial-gradient(circle at center, black 22%, transparent 72%)",
        }}
      />
    </div>
  );
}

function HeroDashboard({ settings }) {
  const metrics = [
    {
      icon: BarChart3,
      title: "Growth Intelligence",
      value: "+38%",
      width: "w-28",
    },
    {
      icon: Bot,
      title: "AI Workflows",
      value: "24/7",
      width: "w-24",
    },
    {
      icon: Database,
      title: "Data Systems",
      value: "Live",
      width: "w-32",
    },
    {
      icon: ShieldCheck,
      title: "Secure Delivery",
      value: "99.9%",
      width: "w-20",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, rotateX: 6 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-[640px] min-w-0"
    >
      <GlowOrb
        className="-right-8 -top-8 h-48 w-48 sm:h-72 sm:w-72"
        color={settings.primaryColor}
        delay={0.3}
      />

      <GlowOrb
        className="-bottom-8 left-4 h-48 w-48 sm:h-64 sm:w-64"
        color={settings.secondaryColor}
        delay={1}
      />

      <motion.div
        animate={floatAnimation}
        className="obm-dashboard-shell relative w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-2.5 shadow-2xl backdrop-blur-xl sm:rounded-[2.2rem] sm:p-4"
        style={{ boxShadow: `0 30px 120px ${settings.primaryColor}14` }}
      >
        <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-white/10 via-transparent to-transparent sm:rounded-[2.2rem]" />

        <div className="obm-dashboard-inner relative overflow-hidden rounded-[1.1rem] border border-white/10 bg-slate-900/95 p-3 sm:rounded-[1.6rem] sm:p-5">
          <div
            className="absolute -right-20 -top-20 h-48 w-48 rounded-full blur-3xl sm:h-64 sm:w-64"
            style={{ backgroundColor: `${settings.primaryColor}18` }}
          />

          <div className="relative mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="obm-dashboard-logo-box flex min-h-14 min-w-24 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-950 p-2 sm:min-h-16 sm:min-w-28 sm:p-3">
                <SafeLogo settings={settings} size="lg" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs text-slate-400 sm:text-sm">
                  Business Control Center
                </p>
                <p className="text-base font-black leading-tight text-white sm:text-xl">
                  Digital Transformation Suite
                </p>
              </div>
            </div>

            <motion.div
              className="w-fit rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300"
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Live
            </motion.div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
          >
            {metrics.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="obm-dashboard-card group min-w-0 rounded-2xl border border-white/10 bg-slate-800/80 p-4 transition sm:p-5"
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <Icon
                      className="h-6 w-6 shrink-0 sm:h-7 sm:w-7"
                      style={{ color: settings.primaryColor }}
                    />

                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-white">
                      {item.value}
                    </span>
                  </div>

                  <div
                    className={`obm-dashboard-muted-line h-2 ${item.width} max-w-full rounded bg-white/25`}
                  />

                  <div className="obm-dashboard-muted-line-soft mt-3 h-2 w-16 max-w-full rounded bg-white/10" />

                  <p className="mt-4 text-xs font-semibold text-slate-400">
                    {item.title}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            className="obm-recommendation-box relative mt-5 overflow-hidden rounded-2xl border p-4 sm:p-5"
            style={{
              borderColor: `${settings.primaryColor}33`,
              backgroundColor: `${settings.primaryColor}14`,
            }}
            whileHover={{ scale: 1.01 }}
          >
            <div
              className="absolute inset-x-6 top-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${settings.primaryColor}, transparent)`,
              }}
            />

            <p
              className="flex flex-wrap items-center gap-2 text-sm font-bold"
              style={{ color: settings.primaryColor }}
            >
              <WandSparkles className="h-4 w-4 shrink-0" />
              OBM Recommendation
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Automate sales follow-ups, HR workflows, approval processes,
              customer support, reporting, and internal operations.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ value, label, settings, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay }}
      whileHover={{ y: -6 }}
      className="obm-stat-card min-w-0 rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur sm:p-5"
    >
      <p
        className="text-2xl font-black text-white sm:text-3xl"
        style={{ textShadow: `0 0 28px ${settings.primaryColor}66` }}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-400 sm:text-sm">{label}</p>
    </motion.div>
  );
}

function PillarCard({
  title,
  eyebrow,
  icon: Icon,
  children,
  settings,
  tone = "primary",
}) {
  const color =
    tone === "primary" ? settings.primaryColor : settings.secondaryColor;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8, scale: 1.01 }}
      className="group relative min-w-0 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 transition sm:rounded-[2rem] sm:p-6 md:p-8"
    >
      <div
        className="absolute -right-24 -top-24 h-48 w-48 rounded-full blur-3xl transition group-hover:opacity-80 sm:h-56 sm:w-56"
        style={{ backgroundColor: `${color}18` }}
      />

      <div className="relative mb-7 flex items-start gap-4 sm:mb-8 sm:items-center">
        <motion.div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${color}16`, color }}
          whileHover={{ rotate: 8, scale: 1.08 }}
        >
          <Icon className="h-6 w-6" />
        </motion.div>

        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400 sm:text-sm sm:tracking-[0.2em]">
            {eyebrow}
          </p>
          <h3 className="text-xl font-black text-white sm:text-2xl">
            {title}
          </h3>
        </div>
      </div>

      <div className="relative grid gap-5">{children}</div>
    </motion.div>
  );
}

function ProcessStep({ step, index, settings }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8 }}
      className="relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-5 sm:p-6"
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${settings.primaryColor}, transparent)`,
        }}
      />

      <motion.div
        className="mb-5 flex h-11 w-11 items-center justify-center rounded-full text-lg font-black text-slate-950"
        style={{ backgroundColor: settings.primaryColor }}
        whileHover={{ scale: 1.12, rotate: 8 }}
      >
        {index + 1}
      </motion.div>

      <h3 className="text-lg font-bold text-white">{step}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        Clear deliverables, measurable progress, and practical technical
        execution at every stage.
      </p>
    </motion.div>
  );
}

function IndustryCard({ item, settings }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ x: 6, scale: 1.02 }}
      className="group flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-110"
        style={{ backgroundColor: `${settings.primaryColor}12` }}
      >
        <CheckCircle2
          className="h-5 w-5"
          style={{ color: settings.primaryColor }}
        />
      </div>

      <span className="min-w-0 break-words font-medium text-slate-200">
        {item}
      </span>
    </motion.div>
  );
}

function PricingCard({ pkg, settings }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -10, scale: 1.015 }}
      className="relative min-w-0 overflow-hidden rounded-3xl border p-5 sm:p-7"
      style={
        pkg.featured
          ? {
              borderColor: settings.primaryColor,
              backgroundColor: settings.primaryColor,
              color: "#020617",
              boxShadow: `0 24px 90px ${settings.primaryColor}2b`,
            }
          : {
              borderColor: "rgba(255,255,255,.1)",
              backgroundColor: "#020617",
              color: "white",
            }
      }
    >
      {pkg.featured && (
        <motion.div
          className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/25 blur-3xl"
          animate={pulseAnimation}
        />
      )}

      <div className="relative">
        {pkg.featured && (
          <div className="mb-5 inline-flex rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">
            Most Popular
          </div>
        )}

        <h3 className="text-2xl font-black">{pkg.name}</h3>

        <p
          className={`mt-3 text-sm leading-6 ${
            pkg.featured ? "text-slate-800" : "text-slate-400"
          }`}
        >
          {pkg.desc}
        </p>

        <p className="mt-6 break-words text-3xl font-black">{pkg.price}</p>

        <ul className="mt-7 space-y-4">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <span className="min-w-0 font-medium">{feature}</span>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-center font-bold sm:px-6 ${
            pkg.featured ? "bg-slate-950 text-white" : "bg-white text-slate-950"
          }`}
        >
          Request Proposal <ArrowRight className="h-5 w-5 shrink-0" />
        </a>
      </div>
    </motion.div>
  );
}

function WowStrip({ settings }) {
  const items = [
    ["AI Strategy", Cpu],
    ["Product Engineering", Layers3],
    ["CRM Automation", Workflow],
    ["Cloud Delivery", Globe2],
    ["MVP Launch", Rocket],
    ["UX Systems", MousePointer2],
  ];

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-white/[0.025] py-4 sm:py-5">
      <motion.div
        className="flex w-max min-w-max gap-3 sm:gap-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items, ...items].map(([label, Icon], index) => (
          <div
            key={`${label}-${index}`}
            className="mx-1 inline-flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/70 px-4 py-2.5 text-xs font-bold text-slate-200 sm:mx-2 sm:px-5 sm:py-3 sm:text-sm"
          >
            <Icon
              className="h-4 w-4 shrink-0"
              style={{ color: settings.primaryColor }}
            />
            {label}
          </div>
        ))}
      </motion.div>
    </section>
  );
}

export default function HomePage({
  settings,
  navigate,
  themeMode = "dark",
  toggleTheme,
}) {
  const safeSettings = useMemo(
    () => ({
      ...FALLBACK_SETTINGS,
      ...(settings || {}),
      primaryColor: settings?.primaryColor || FALLBACK_SETTINGS.primaryColor,
      secondaryColor:
        settings?.secondaryColor || FALLBACK_SETTINGS.secondaryColor,
      accentColor: settings?.accentColor || FALLBACK_SETTINGS.accentColor,
      siteName: settings?.siteName || FALLBACK_SETTINGS.siteName,
      heroBadge: settings?.heroBadge || FALLBACK_SETTINGS.heroBadge,
      heroTitle: settings?.heroTitle || FALLBACK_SETTINGS.heroTitle,
      heroText: settings?.heroText || FALLBACK_SETTINGS.heroText,
      ctaPrimary: settings?.ctaPrimary || FALLBACK_SETTINGS.ctaPrimary,
      ctaSecondary: settings?.ctaSecondary || FALLBACK_SETTINGS.ctaSecondary,
      email: settings?.email || FALLBACK_SETTINGS.email,
      phone: settings?.phone || FALLBACK_SETTINGS.phone,
      location: settings?.location || FALLBACK_SETTINGS.location,
      websiteUrl: settings?.websiteUrl || FALLBACK_SETTINGS.websiteUrl,
      whatsapp: settings?.whatsapp || FALLBACK_SETTINGS.whatsapp,
      facebook: settings?.facebook || FALLBACK_SETTINGS.facebook,
      instagram: settings?.instagram || FALLBACK_SETTINGS.instagram,
      linkedin: settings?.linkedin || FALLBACK_SETTINGS.linkedin,
      xTwitter: settings?.xTwitter || FALLBACK_SETTINGS.xTwitter,
      youtube: settings?.youtube || FALLBACK_SETTINGS.youtube,
      tiktok: settings?.tiktok || FALLBACK_SETTINGS.tiktok,
      threads: settings?.threads || FALLBACK_SETTINGS.threads,
      snapchat: settings?.snapchat || FALLBACK_SETTINGS.snapchat,
      pinterest: settings?.pinterest || FALLBACK_SETTINGS.pinterest,
      telegram: settings?.telegram || FALLBACK_SETTINGS.telegram,
      googleBusiness:
        settings?.googleBusiness || FALLBACK_SETTINGS.googleBusiness,
      footerText: settings?.footerText || FALLBACK_SETTINGS.footerText,
    }),
    [settings],
  );

  const isLightMode = themeMode === "light";

  const contrastAccentColor = useMemo(
    () =>
      getReadableAccentColor(
        safeSettings.primaryColor,
        safeSettings.secondaryColor,
        isLightMode,
      ),
    [safeSettings.primaryColor, safeSettings.secondaryColor, isLightMode],
  );

  const solidButtonTextColor = useMemo(
    () => getSolidButtonTextColor(contrastAccentColor),
    [contrastAccentColor],
  );

  const visualSettings = useMemo(
    () => ({
      ...safeSettings,
      isLightMode,
      brandPrimaryColor: safeSettings.primaryColor,
      brandSecondaryColor: safeSettings.secondaryColor,
      primaryColor: isLightMode ? contrastAccentColor : safeSettings.primaryColor,
      secondaryColor: isLightMode
        ? contrastAccentColor
        : safeSettings.secondaryColor,
      accentColor: isLightMode ? contrastAccentColor : safeSettings.accentColor,
      iconColor: isLightMode ? contrastAccentColor : safeSettings.primaryColor,
      solidButtonTextColor,
    }),
    [safeSettings, isLightMode, contrastAccentColor, solidButtonTextColor],
  );

  const activeSocialLinks = useMemo(
    () => getActiveSocialLinks(visualSettings),
    [visualSettings],
  );

  const [contactForm, setContactForm] = useState(defaultContactForm);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState("");
  const [contactError, setContactError] = useState("");

  const updateContactForm = (key, value) => {
    setContactForm((current) => ({
      ...current,
      [key]: value,
    }));
    setContactSuccess("");
    setContactError("");
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();

    try {
      setContactSubmitting(true);
      setContactSuccess("");
      setContactError("");

      await api.sendContactMessage(contactForm);

      setContactSuccess(
        "Thank you. Your inquiry has been submitted successfully.",
      );
      setContactForm(defaultContactForm);
    } catch (error) {
      setContactError(error.message || "Failed to submit inquiry.");
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <main
      className={`obm-home-page ${
        isLightMode ? "obm-home-light" : "obm-home-dark"
      } min-h-screen w-full overflow-x-clip bg-slate-950 text-white`}
      style={{
        "--obm-contrast-icon": visualSettings.iconColor,
        "--obm-solid-button-text": visualSettings.solidButtonTextColor,
      }}
    >
      {isLightMode && (
        <style>{`
          .obm-home-light {
            background: linear-gradient(180deg, #f8fafc 0%, #ffffff 42%, #f8fafc 100%) !important;
            color: #0f172a !important;
          }

          .obm-home-light [class*="bg-slate-950"],
          .obm-home-light [class*="bg-slate-900"],
          .obm-home-light [class*="bg-slate-800"],
          .obm-home-light [class*="bg-white/"],
          .obm-home-light [class*="bg-white\\/"] {
            background-color: rgba(255, 255, 255, 0.92) !important;
          }

          .obm-home-light [class*="from-slate-900"],
          .obm-home-light [class*="to-slate-950"],
          .obm-home-light [class*="bg-gradient-to-br"] {
            background-image: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
          }

          .obm-home-light [class*="border-white/"],
          .obm-home-light [class*="border-white\\/"] {
            border-color: rgba(15, 23, 42, 0.12) !important;
          }

          .obm-home-light .text-white,
          .obm-home-light [class*="text-white"] {
            color: #0f172a !important;
          }

          .obm-home-light [class*="text-slate-200"],
          .obm-home-light [class*="text-slate-300"],
          .obm-home-light [class*="text-slate-400"],
          .obm-home-light [class*="text-slate-500"] {
            color: #334155 !important;
          }

          .obm-home-light input,
          .obm-home-light select,
          .obm-home-light textarea {
            background-color: #ffffff !important;
            color: #0f172a !important;
            border-color: rgba(15, 23, 42, 0.14) !important;
          }

          .obm-home-light input::placeholder,
          .obm-home-light textarea::placeholder {
            color: #64748b !important;
          }

          .obm-home-light .obm-dashboard-shell,
          .obm-home-light .obm-dashboard-inner,
          .obm-home-light .obm-dashboard-card,
          .obm-home-light .obm-recommendation-box,
          .obm-home-light .obm-stat-card {
            background: rgba(255, 255, 255, 0.94) !important;
            border-color: rgba(15, 23, 42, 0.12) !important;
            color: #0f172a !important;
          }

          .obm-home-light .obm-dashboard-logo-box {
            background: #ffffff !important;
            border-color: rgba(15, 23, 42, 0.12) !important;
          }

          .obm-home-light .obm-dashboard-muted-line {
            background-color: rgba(15, 23, 42, 0.18) !important;
          }

          .obm-home-light .obm-dashboard-muted-line-soft {
            background-color: rgba(15, 23, 42, 0.1) !important;
          }

          .obm-home-light a[style*="background-color"],
          .obm-home-light button[style*="background-color"] {
            color: var(--obm-solid-button-text) !important;
          }

          .obm-home-light a[style*="background-color"] svg,
          .obm-home-light button[style*="background-color"] svg {
            color: var(--obm-solid-button-text) !important;
            stroke: currentColor !important;
          }
        `}</style>
      )}

      <PublicNav
        settings={visualSettings}
        navigate={navigate}
        themeMode={themeMode}
        toggleTheme={toggleTheme}
      />

      <section className="relative overflow-hidden">
        <AnimatedGrid settings={visualSettings} />

        <GlowOrb
          className="-left-20 top-10 h-56 w-56 sm:-left-24 sm:h-96 sm:w-96"
          color={visualSettings.primaryColor}
        />

        <GlowOrb
          className="-right-20 top-44 h-56 w-56 sm:-right-24 sm:h-96 sm:w-96"
          color={visualSettings.secondaryColor}
          delay={1.2}
        />

        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at top left, ${visualSettings.primaryColor}33, transparent 35%), radial-gradient(circle at top right, ${visualSettings.secondaryColor}2e, transparent 35%)`,
          }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-5 sm:py-16 md:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:py-24 xl:py-28">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-3xl min-w-0 text-center sm:text-left"
          >
            <motion.div variants={fadeUp}>
              <Badge settings={visualSettings}>{visualSettings.heroBadge}</Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-6 break-words text-[clamp(2.35rem,11vw,4.5rem)] font-black leading-[0.96] tracking-tight sm:mt-7 md:text-6xl xl:text-7xl"
            >
              {visualSettings.heroTitle}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-300 sm:mx-0 sm:mt-6 sm:text-lg sm:leading-8"
            >
              {visualSettings.heroText}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:gap-4"
            >
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-center font-bold text-slate-950 shadow-lg transition sm:w-auto sm:px-7"
                style={{
                  backgroundColor: visualSettings.primaryColor,
                  boxShadow: `0 18px 50px ${visualSettings.primaryColor}2e`,
                  color: visualSettings.solidButtonTextColor,
                }}
              >
                {visualSettings.ctaPrimary}
                <ArrowRight
                  className="h-5 w-5 shrink-0 transition group-hover:translate-x-1"
                  style={{ color: visualSettings.solidButtonTextColor }}
                />
              </motion.a>

              <motion.a
                href="#services"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex w-full items-center justify-center rounded-full border border-white/15 px-6 py-4 text-center font-semibold text-white transition hover:bg-white/10 sm:w-auto sm:px-7"
                style={{
                  color: isLightMode ? "#0f172a" : "#ffffff",
                  borderColor: isLightMode
                    ? "rgba(15, 23, 42, 0.16)"
                    : "rgba(255, 255, 255, 0.15)",
                }}
              >
                {visualSettings.ctaSecondary}
              </motion.a>
            </motion.div>

            {activeSocialLinks.length > 0 && (
              <motion.div
                variants={fadeUp}
                className="mt-6 flex flex-col items-center gap-3 sm:items-start"
              >
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                  Connect with OBM
                </p>

                <SocialLinksRow
                  settings={visualSettings}
                  compact
                  className="justify-center sm:justify-start"
                />
              </motion.div>
            )}

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mt-9 grid grid-cols-1 gap-3 border-t border-white/10 pt-7 sm:mt-10 sm:grid-cols-3 sm:gap-4 sm:pt-8"
            >
              <StatCard
                value="360°"
                label="Tech partner"
                settings={visualSettings}
                delay={0.4}
              />
              <StatCard
                value="MVP"
                label="Fast launch"
                settings={visualSettings}
                delay={0.5}
              />
              <StatCard
                value="AI"
                label="Automation ready"
                settings={visualSettings}
                delay={0.6}
              />
            </motion.div>
          </motion.div>

          <div className="min-w-0">
            <HeroDashboard settings={visualSettings} />
          </div>
        </div>
      </section>

      <WowStrip settings={visualSettings} />

      <section
        id="services"
        className="relative px-4 py-16 sm:px-5 sm:py-20 lg:py-24"
      >
        <GlowOrb
          className="left-1/2 top-20 h-56 w-56 -translate-x-1/2 sm:h-72 sm:w-72"
          color={visualSettings.primaryColor}
        />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <SectionTitle
              settings={visualSettings}
              eyebrow="What We Do"
              title="Product engineering, digital transformation, and enterprise automation"
              text="We act as a complete technology partner for businesses looking to modernize operations and scale digitally."
            />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.16 }}
            className="mt-10 grid min-w-0 gap-5 lg:mt-14 lg:grid-cols-2 lg:gap-8"
          >
            <PillarCard
              settings={visualSettings}
              eyebrow="Pillar 01"
              title="Product Engineering & Digital Transformation"
              icon={Rocket}
            >
              {productServices.map((service, index) => (
                <ServiceCard
                  key={service.title}
                  service={service}
                  index={index}
                  settings={visualSettings}
                />
              ))}
            </PillarCard>

            <PillarCard
              settings={visualSettings}
              eyebrow="Pillar 02"
              title="Enterprise Solutions & Automation"
              icon={Workflow}
              tone="secondary"
            >
              {automationServices.map((service, index) => (
                <ServiceCard
                  key={service.title}
                  service={service}
                  index={index}
                  settings={visualSettings}
                />
              ))}
            </PillarCard>
          </motion.div>
        </div>
      </section>

      <section
        id="process"
        className="relative overflow-hidden border-y border-white/10 bg-white/[0.03] px-4 py-16 sm:px-5 sm:py-20 lg:py-24"
      >
        <AnimatedGrid settings={visualSettings} />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <SectionTitle
              settings={visualSettings}
              eyebrow="Our Process"
              title="From idea to deployed business system"
              text="A structured delivery model for startups, SMEs, and enterprises that need clarity, speed, and production quality."
            />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.16 }}
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3"
          >
            {process.map((step, index) => (
              <ProcessStep
                key={step}
                step={step}
                index={index}
                settings={visualSettings}
              />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 py-16 sm:px-5 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center lg:gap-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="min-w-0"
          >
            <p
              className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] sm:tracking-[0.25em]"
              style={{ color: visualSettings.primaryColor }}
            >
              Industries
            </p>

            <h2 className="break-words text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Digital systems for growing businesses
            </h2>

            <p className="mt-5 leading-8 text-slate-300">
              OBM specializes in business systems where automation, dashboards,
              customer communication, secure portals, and scalable software
              create immediate operational value.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                ["Faster workflows", Zap],
                ["Cleaner systems", Layers3],
              ].map(([label, Icon]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <Icon
                    className="h-6 w-6"
                    style={{ color: visualSettings.primaryColor }}
                  />
                  <p className="mt-3 font-bold text-white">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.16 }}
            className="grid min-w-0 gap-4 sm:grid-cols-2"
          >
            {industries.map((item) => (
              <IndustryCard key={item} item={item} settings={visualSettings} />
            ))}
          </motion.div>
        </div>
      </section>

      <section
        id="pricing"
        className="relative overflow-hidden bg-slate-900/60 px-4 py-16 sm:px-5 sm:py-20 lg:py-24"
      >
        <GlowOrb
          className="right-0 top-10 h-56 w-56 sm:h-72 sm:w-72"
          color={visualSettings.secondaryColor}
        />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <SectionTitle
              settings={visualSettings}
              eyebrow="Packages"
              title="Flexible development and automation plans"
              text="Start with a focused audit or move directly into a complete product build."
            />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.16 }}
            className="mt-10 grid gap-5 md:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6"
          >
            {packages.map((pkg) => (
              <PricingCard
                key={pkg.name}
                pkg={pkg}
                settings={visualSettings}
              />
            ))}
          </motion.div>
        </div>
      </section>

      <section
        id="contact"
        className="relative px-4 py-16 sm:px-5 sm:py-20 lg:py-24"
      >
        <div className="relative mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-5 sm:rounded-[2rem] sm:p-6 md:grid-cols-2 md:p-10">
          <div
            className="absolute -left-24 -top-24 h-56 w-56 rounded-full blur-3xl sm:h-64 sm:w-64"
            style={{ backgroundColor: `${visualSettings.primaryColor}18` }}
          />

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="relative min-w-0"
          >
            <p
              className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] sm:tracking-[0.25em]"
              style={{ color: visualSettings.primaryColor }}
            >
              Contact
            </p>

            <h2 className="break-words text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              Ready to modernize your business?
            </h2>

            <p className="mt-5 leading-8 text-slate-300">
              Tell us about your business process, current software, and the
              systems you want to build or automate. OBM will recommend the best
              technical approach.
            </p>

            <div className="mt-8 space-y-4 text-slate-300">
              <a
                href={`mailto:${visualSettings.email}`}
                className="flex min-w-0 items-start gap-3 transition hover:text-white"
              >
                <Mail
                  className="mt-0.5 h-5 w-5 shrink-0"
                  style={{ color: visualSettings.primaryColor }}
                />
                <span className="min-w-0 break-words">
                  {visualSettings.email}
                </span>
              </a>

              <a
                href={`tel:${String(visualSettings.phone || "").replace(/\s+/g, "")}`}
                className="flex min-w-0 items-start gap-3 transition hover:text-white"
              >
                <Phone
                  className="mt-0.5 h-5 w-5 shrink-0"
                  style={{ color: visualSettings.primaryColor }}
                />
                <span className="min-w-0 break-words">
                  {visualSettings.phone}
                </span>
              </a>

              <p className="flex min-w-0 items-start gap-3">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0"
                  style={{ color: visualSettings.primaryColor }}
                />
                <span className="min-w-0 break-words">
                  {visualSettings.location}
                </span>
              </p>
            </div>

            {activeSocialLinks.length > 0 && (
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor: `${visualSettings.primaryColor}18`,
                      color: visualSettings.primaryColor,
                    }}
                  >
                    <Share2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-black text-white">Social Media</p>
                    <p className="text-xs text-slate-500">
                      Follow and connect with OBM
                    </p>
                  </div>
                </div>

                <SocialLinksRow settings={visualSettings} showLabel />
              </div>
            )}
          </motion.div>

          <motion.form
            onSubmit={handleContactSubmit}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="relative min-w-0 rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur sm:p-5 md:p-7"
          >
            <div className="grid gap-4">
              <input
                value={contactForm.name}
                onChange={(event) =>
                  updateContactForm("name", event.target.value)
                }
                className="w-full min-w-0 rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 outline-none placeholder:text-slate-500 focus:ring-2"
                style={{ "--tw-ring-color": visualSettings.primaryColor }}
                placeholder="Your Name"
                required
              />

              <input
                type="email"
                value={contactForm.email}
                onChange={(event) =>
                  updateContactForm("email", event.target.value)
                }
                className="w-full min-w-0 rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 outline-none placeholder:text-slate-500 focus:ring-2"
                style={{ "--tw-ring-color": visualSettings.primaryColor }}
                placeholder="Email Address"
                required
              />

              <input
                value={contactForm.companyName}
                onChange={(event) =>
                  updateContactForm("companyName", event.target.value)
                }
                className="w-full min-w-0 rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 outline-none placeholder:text-slate-500 focus:ring-2"
                style={{ "--tw-ring-color": visualSettings.primaryColor }}
                placeholder="Company Name"
              />

              <select
                value={contactForm.serviceType}
                onChange={(event) =>
                  updateContactForm("serviceType", event.target.value)
                }
                className="w-full min-w-0 rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 outline-none focus:ring-2"
                style={{ "--tw-ring-color": visualSettings.primaryColor }}
              >
                <option>Product Engineering</option>
                <option>Digital Transformation</option>
                <option>Custom Software Development</option>
                <option>HRMS / CRM System</option>
                <option>AI Automation</option>
                <option>General Inquiry</option>
              </select>

              <textarea
                value={contactForm.message}
                onChange={(event) =>
                  updateContactForm("message", event.target.value)
                }
                className="min-h-32 w-full min-w-0 resize-y rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 outline-none placeholder:text-slate-500 focus:ring-2"
                style={{ "--tw-ring-color": visualSettings.primaryColor }}
                placeholder="Tell us about your project"
                required
              />

              {contactSuccess && (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300">
                  {contactSuccess}
                </div>
              )}

              {contactError && (
                <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-200">
                  {contactError}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={contactSubmitting}
                whileHover={{
                  scale: contactSubmitting ? 1 : 1.03,
                  y: contactSubmitting ? 0 : -2,
                }}
                whileTap={{ scale: contactSubmitting ? 1 : 0.98 }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-center font-black text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-60 sm:px-7"
                style={{
                  backgroundColor: visualSettings.primaryColor,
                  color: visualSettings.solidButtonTextColor,
                }}
              >
                {contactSubmitting ? "Sending..." : "Send Inquiry"}
                <Rocket
                  className="h-5 w-5 shrink-0"
                  style={{ color: visualSettings.solidButtonTextColor }}
                />
              </motion.button>
            </div>
          </motion.form>
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-8 sm:px-5">
        <div className="mx-auto grid max-w-7xl gap-6 text-center text-sm text-slate-400 md:grid-cols-[1fr_auto_1fr] md:items-center md:text-left">
          <p className="break-words">
            © {new Date().getFullYear()} {visualSettings.siteName}. All rights
            reserved.
          </p>

          <SocialLinksRow
            settings={visualSettings}
            compact
            className="justify-center"
          />

          <p className="break-words md:text-right">{visualSettings.footerText}</p>
        </div>
      </footer>
    </main>
  );
} git 