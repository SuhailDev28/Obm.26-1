// client/src/pages/AdminDashboard.jsx

import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Cpu,
  ExternalLink,
  Eye,
  Home,
  ImagePlus,
  LogOut,
  Mail,
  Moon,
  Palette,
  Phone,
  RefreshCw,
  Save,
  Server,
  Settings,
  Share2,
  ShieldCheck,
  Sun,
  Upload,
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

import LogoMark from "../components/LogoMark.jsx";
import { ColorField, Field, TextAreaField } from "../components/FormFields.jsx";
import {
  resetSettingsOnApi,
  saveSettingsToApi,
  uploadLogoToApi,
} from "../lib/api.js";

const FALLBACK_API_ORIGIN = "http://localhost:5001";

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

function getInitialAdminThemeMode(settings = {}) {
  const savedMode = String(settings.adminThemeMode || "").toLowerCase();

  if (savedMode === "light" || savedMode === "dark") {
    return savedMode;
  }

  if (typeof document !== "undefined") {
    const html = document.documentElement;

    if (
      html.classList.contains("light") ||
      html.classList.contains("obm-light") ||
      html.dataset.theme === "light"
    ) {
      return "light";
    }

    if (
      html.classList.contains("dark") ||
      html.classList.contains("obm-dark") ||
      html.dataset.theme === "dark"
    ) {
      return "dark";
    }
  }

  return "dark";
}

function hexToRgba(hex, opacity = 1) {
  const value = String(hex || "#22d3ee").replace("#", "");

  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    return `rgba(34, 211, 238, ${opacity})`;
  }

  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function getAdminTheme(isLight) {
  return {
    page: isLight ? "bg-slate-50 text-slate-950" : "bg-slate-950 text-white",
    header: isLight
      ? "border-slate-200 bg-white/90"
      : "border-white/10 bg-slate-950/85",
    panel: isLight
      ? "border-slate-200 bg-white/85 shadow-slate-200/70"
      : "border-white/10 bg-white/[0.055] shadow-black/20",
    solidPanel: isLight
      ? "border-slate-200 bg-white shadow-slate-200/70"
      : "border-white/10 bg-slate-950/70 shadow-black/20",
    innerPanel: isLight
      ? "border-slate-200 bg-slate-50"
      : "border-white/10 bg-slate-950/70",
    softPanel: isLight
      ? "border-slate-200 bg-slate-100"
      : "border-white/10 bg-white/[0.04]",
    muted: isLight ? "text-slate-600" : "text-slate-400",
    faint: isLight ? "text-slate-500" : "text-slate-500",
    border: isLight ? "border-slate-200" : "border-white/10",
    navItem: isLight
      ? "text-slate-600 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-950"
      : "text-slate-300 hover:border-white/10 hover:bg-white/[0.06] hover:text-white",
    secondaryButton: isLight
      ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
      : "border-white/10 bg-white/[0.04] text-white hover:bg-white/10",
    dangerButton: isLight
      ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
      : "border-red-400/20 bg-red-400/10 text-red-200 hover:bg-red-400/20",
  };
}

export default function AdminDashboard({
  settings,
  setSettings,
  navigate,
  onLogout,
}) {
  const [draft, setDraft] = useState(settings || {});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [adminThemeMode, setAdminThemeMode] = useState(() =>
    getInitialAdminThemeMode(settings || {}),
  );

  const isLight = adminThemeMode === "light";
  const ui = getAdminTheme(isLight);

  useEffect(() => {
    setDraft(settings || {});
    setAdminThemeMode(getInitialAdminThemeMode(settings || {}));
  }, [settings]);

  useEffect(() => {
    document.documentElement.classList.toggle("obm-admin-light", isLight);
    document.documentElement.classList.toggle("obm-admin-dark", !isLight);
  }, [isLight]);

  const update = (key, value) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
    setSaved(false);
  };

  const toggleAdminTheme = () => {
    const nextMode = isLight ? "dark" : "light";

    setAdminThemeMode(nextMode);
    setDraft((current) => ({
      ...current,
      adminThemeMode: nextMode,
    }));
    setSaved(false);
  };

  const showSaved = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const handleLogoUpload = async (event, logoField = "logo") => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      setError("");

      const nextSettings = await uploadLogoToApi(file, logoField);

      setDraft(nextSettings);
      setSettings(nextSettings);
      showSaved();
    } catch (err) {
      setError(err?.message || "Logo upload failed");
    } finally {
      setSaving(false);
      event.target.value = "";
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const payload = {
        ...draft,
        adminThemeMode,
      };

      const nextSettings = await saveSettingsToApi(payload);

      setSettings(nextSettings);
      setDraft(nextSettings);
      setAdminThemeMode(getInitialAdminThemeMode(nextSettings));
      showSaved();
    } catch (err) {
      setError(err?.message || "Settings save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setSaving(true);
      setError("");

      const nextSettings = await resetSettingsOnApi();

      setDraft(nextSettings);
      setSettings(nextSettings);
      setAdminThemeMode(getInitialAdminThemeMode(nextSettings));
      showSaved();
    } catch (err) {
      setError(err?.message || "Reset failed");
    } finally {
      setSaving(false);
    }
  };

  const primaryColor = draft.primaryColor || "#22d3ee";
  const secondaryColor = draft.secondaryColor || "#2563eb";
  const accentColor = draft.accentColor || "#a855f7";

  const lightPrimaryColor = draft.lightPrimaryColor || "#2563eb";
  const lightSecondaryColor = draft.lightSecondaryColor || "#7c3aed";
  const lightAccentColor = draft.lightAccentColor || "#0891b2";
  const lightBackgroundColor = draft.lightBackgroundColor || "#f8fafc";
  const lightSurfaceColor = draft.lightSurfaceColor || "#ffffff";
  const lightTextColor = draft.lightTextColor || "#0f172a";
  const lightMutedTextColor = draft.lightMutedTextColor || "#475569";
  const lightIconColor = draft.lightIconColor || "#1d4ed8";
  const lightBorderColor = draft.lightBorderColor || "#e2e8f0";

  const heroPreviewStyle = useMemo(
    () => ({
      background: isLight
        ? `
          radial-gradient(circle at top left, ${primaryColor}18, transparent 32%),
          radial-gradient(circle at bottom right, ${secondaryColor}14, transparent 35%),
          linear-gradient(135deg, #ffffff, #f8fafc)
        `
        : `
          radial-gradient(circle at top left, ${primaryColor}45, transparent 32%),
          radial-gradient(circle at bottom right, ${secondaryColor}45, transparent 35%),
          linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(2, 6, 23, 0.98))
        `,
      boxShadow: `0 28px 90px ${primaryColor}${isLight ? "14" : "22"}`,
    }),
    [primaryColor, secondaryColor, isLight],
  );

  const gradientButtonStyle = useMemo(
    () => ({
      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
      boxShadow: `0 16px 42px ${primaryColor}35`,
    }),
    [primaryColor, secondaryColor],
  );

  const lightModePreviewStyle = useMemo(
    () => ({
      background: `
        radial-gradient(circle at top left, ${lightPrimaryColor}18, transparent 32%),
        radial-gradient(circle at bottom right, ${lightSecondaryColor}14, transparent 36%),
        linear-gradient(135deg, ${lightBackgroundColor}, ${lightSurfaceColor})
      `,
      color: lightTextColor,
      borderColor: lightBorderColor,
      boxShadow: `0 24px 80px ${lightPrimaryColor}12`,
    }),
    [
      lightPrimaryColor,
      lightSecondaryColor,
      lightBackgroundColor,
      lightSurfaceColor,
      lightTextColor,
      lightBorderColor,
    ],
  );

  const menuItems = [
    [Settings, "Brand Settings", "Company name, tagline", "#brand"],
    [Palette, "Brand Colors", "Primary, secondary, accent", "#colors"],
    [Palette, "Light Mode Colors", "Background, text, icons", "#light-colors"],
    [ImagePlus, "Logo Upload", "Dark and light logos", "#logo"],
    [Cpu, "Hero Content", "Landing page content", "#hero"],
    [Phone, "Contact Details", "Phone, email, location", "#contact-settings"],
    [Share2, "Social Media", "Social links and integrations", "#social-settings"],
    [Mail, "Email Notifications", "Contact form alerts", "#contact-email-settings"],
    [Server, "SMTP Settings", "Mail server setup", "#smtp-settings"],
  ];

  const socialItems = [
    {
      key: "facebook",
      label: "Facebook URL",
      placeholder: "https://facebook.com/yourpage",
      icon: FaFacebookF,
      brandColor: "#1877F2",
    },
    {
      key: "instagram",
      label: "Instagram URL",
      placeholder: "https://instagram.com/yourprofile",
      icon: FaInstagram,
      brandColor: "#E4405F",
    },
    {
      key: "linkedin",
      label: "LinkedIn URL",
      placeholder: "https://linkedin.com/company/yourcompany",
      icon: FaLinkedinIn,
      brandColor: "#0A66C2",
    },
    {
      key: "xTwitter",
      label: "X / Twitter URL",
      placeholder: "https://x.com/yourprofile",
      icon: FaXTwitter,
      brandColor: isLight ? "#111827" : "#FFFFFF",
    },
    {
      key: "youtube",
      label: "YouTube URL",
      placeholder: "https://youtube.com/@yourchannel",
      icon: FaYoutube,
      brandColor: "#FF0000",
    },
    {
      key: "tiktok",
      label: "TikTok URL",
      placeholder: "https://tiktok.com/@yourprofile",
      icon: FaTiktok,
      brandColor: isLight ? "#111827" : "#FFFFFF",
    },
    {
      key: "threads",
      label: "Threads URL",
      placeholder: "https://threads.net/@yourprofile",
      icon: FaThreads,
      brandColor: isLight ? "#111827" : "#FFFFFF",
    },
    {
      key: "snapchat",
      label: "Snapchat URL",
      placeholder: "https://snapchat.com/add/yourprofile",
      icon: FaSnapchatGhost,
      brandColor: isLight ? "#ca8a04" : "#FFFC00",
    },
    {
      key: "pinterest",
      label: "Pinterest URL",
      placeholder: "https://pinterest.com/yourprofile",
      icon: FaPinterestP,
      brandColor: "#E60023",
    },
    {
      key: "telegram",
      label: "Telegram URL",
      placeholder: "https://t.me/yourchannel",
      icon: FaTelegramPlane,
      brandColor: "#26A5E4",
    },
    {
      key: "whatsapp",
      label: "WhatsApp Number / Link",
      placeholder: "+974XXXXXXXX or https://wa.me/974XXXXXXXX",
      icon: FaWhatsapp,
      brandColor: "#25D366",
    },
    {
      key: "googleBusiness",
      label: "Google Business Profile",
      placeholder: "https://g.page/your-business",
      icon: FaGoogle,
      brandColor: "#4285F4",
    },
  ];

  const activeSocialLinks = socialItems.filter((item) =>
    String(draft[item.key] || "").trim(),
  );

  return (
    <main className={`min-h-screen overflow-hidden ${ui.page}`}>
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div
          className="absolute -left-32 top-10 h-80 w-80 rounded-full blur-3xl"
          style={{
            backgroundColor: hexToRgba(primaryColor, isLight ? 0.13 : 0.15),
          }}
        />

        <div
          className="absolute -right-32 top-80 h-96 w-96 rounded-full blur-3xl"
          style={{
            backgroundColor: hexToRgba(secondaryColor, isLight ? 0.1 : 0.13),
          }}
        />

        <div
          className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl"
          style={{
            backgroundColor: hexToRgba(accentColor, isLight ? 0.08 : 0.1),
          }}
        />
      </div>

      <header className={`sticky top-0 z-50 border-b backdrop-blur-2xl ${ui.header}`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <AdminLogoBox
              settings={draft}
              isLight={isLight}
              logoField={isLight ? "lightLogo" : "logo"}
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-lg font-black leading-none sm:text-xl">
                  OBM Admin Dashboard
                </p>

                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-slate-950"
                  style={{ backgroundColor: primaryColor }}
                >
                  Control
                </span>
              </div>

              <p className={`mt-1 truncate text-xs sm:text-sm ${ui.muted}`}>
                Manage logo, colors, website content, contact and SMTP settings.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleAdminTheme}
              className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-bold transition hover:-translate-y-0.5 ${ui.secondaryButton}`}
            >
              {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {isLight ? "Dark Mode" : "Light Mode"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-bold transition hover:-translate-y-0.5 ${ui.secondaryButton}`}
            >
              <Home className="h-4 w-4" />
              Website
            </button>

            <button
              type="button"
              onClick={onLogout}
              className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-bold transition hover:-translate-y-0.5 ${ui.secondaryButton}`}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              style={gradientButtonStyle}
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[320px_1fr] lg:py-8">
        <aside
          className={`h-fit rounded-[2rem] border p-4 shadow-2xl backdrop-blur-2xl lg:sticky lg:top-24 ${ui.panel}`}
        >
          <div className={`overflow-hidden rounded-[1.75rem] border ${ui.border}`}>
            <div className="p-5" style={heroPreviewStyle}>
              <div className="flex items-center justify-between gap-3">
                <AdminLogoBox
                  settings={draft}
                  size="lg"
                  isLight={isLight}
                  logoField={isLight ? "lightLogo" : "logo"}
                />

                <div
                  className={`rounded-full border px-3 py-1 text-xs font-bold backdrop-blur ${
                    isLight
                      ? "border-slate-200 bg-white/80 text-slate-700"
                      : "border-white/15 bg-white/10 text-white/90"
                  }`}
                >
                  {isLight ? "Light" : "Dark"}
                </div>
              </div>

              <p
                className={`mt-5 line-clamp-2 text-2xl font-black ${
                  isLight ? "text-slate-950" : "text-white"
                }`}
              >
                {draft.siteName || "OBM"}
              </p>

              <p
                className={`mt-2 line-clamp-2 text-sm leading-6 ${
                  isLight ? "text-slate-600" : "text-white/75"
                }`}
              >
                {draft.tagline || "AI consultancy and digital solutions"}
              </p>
            </div>

            <div
              className={`grid grid-cols-3 border-t ${
                isLight
                  ? "border-slate-200 bg-slate-50"
                  : "border-white/10 bg-slate-950/80"
              }`}
            >
              <ColorDot label="Primary" value={primaryColor} isLight={isLight} />
              <ColorDot label="Secondary" value={secondaryColor} isLight={isLight} />
              <ColorDot label="Accent" value={accentColor} isLight={isLight} />
            </div>
          </div>

          <nav className="mt-5 space-y-2">
            {menuItems.map(([Icon, label, description, href]) => (
              <a
                key={label}
                href={href}
                className={`group flex items-center gap-3 rounded-3xl border border-transparent px-4 py-3 transition ${ui.navItem}`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition group-hover:scale-105 ${ui.softPanel}`}
                  style={{ color: primaryColor }}
                >
                  <Icon className="h-4 w-4" />
                </span>

                <span className="min-w-0">
                  <span className="block truncate text-sm font-black">
                    {label}
                  </span>
                  <span className={`block truncate text-xs ${ui.faint}`}>
                    {description}
                  </span>
                </span>
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-3xl border px-4 py-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${ui.dangerButton}`}
          >
            <RefreshCw className="h-4 w-4" />
            Reset Defaults
          </button>

          {saved && (
            <AlertBox
              type="success"
              icon={CheckCircle2}
              text="Settings saved successfully."
              isLight={isLight}
            />
          )}

          {error && (
            <AlertBox
              type="error"
              icon={ShieldCheck}
              text={error}
              isLight={isLight}
            />
          )}
        </aside>

        <div className="space-y-6">
          <section
            className={`overflow-hidden rounded-[2rem] border shadow-2xl backdrop-blur-2xl ${ui.panel}`}
          >
            <div className="grid gap-6 p-6 md:grid-cols-[1fr_300px] md:p-8">
              <div>
                <p
                  className="mb-3 inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-slate-950"
                  style={{ backgroundColor: primaryColor }}
                >
                  Website Control Center
                </p>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Manage your complete OBM landing page from one place.
                </h1>

                <p className={`mt-3 max-w-2xl text-sm leading-7 sm:text-base ${ui.muted}`}>
                  Update branding, logo, hero copy, contact information, email
                  notifications, SMTP configuration and social media links
                  without editing code.
                </p>
              </div>

              <div className={`rounded-[1.75rem] border p-5 ${ui.innerPanel}`}>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: hexToRgba(primaryColor, 0.14) }}
                  >
                    <Eye className="h-5 w-5" style={{ color: primaryColor }} />
                  </div>

                  <div>
                    <p className="font-black">Preview Ready</p>
                    <p className={`text-xs ${ui.muted}`}>
                      Save first, then check public website.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black transition ${ui.secondaryButton}`}
                >
                  <Home className="h-4 w-4" />
                  View Website
                </button>
              </div>
            </div>
          </section>

          <DashboardCard
            id="brand"
            icon={Settings}
            color={primaryColor}
            title="Brand Settings"
            text="Control company name, tagline and footer text."
            isLight={isLight}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Company Name"
                value={draft.siteName || ""}
                onChange={(value) => update("siteName", value)}
              />

              <Field
                label="Tagline"
                value={draft.tagline || ""}
                onChange={(value) => update("tagline", value)}
              />

              <div className="md:col-span-2">
                <Field
                  label="Footer Text"
                  value={draft.footerText || ""}
                  onChange={(value) => update("footerText", value)}
                />
              </div>
            </div>
          </DashboardCard>

          <DashboardCard
            id="colors"
            icon={Palette}
            color={primaryColor}
            title="Brand Color Control"
            text="Change primary, secondary and accent colors used across brand elements and the dark website theme."
            isLight={isLight}
          >
            <div className="grid gap-5 md:grid-cols-3">
              <ColorField
                label="Primary Color"
                value={primaryColor}
                onChange={(value) => update("primaryColor", value)}
              />

              <ColorField
                label="Secondary Color"
                value={secondaryColor}
                onChange={(value) => update("secondaryColor", value)}
              />

              <ColorField
                label="Accent Color"
                value={accentColor}
                onChange={(value) => update("accentColor", value)}
              />
            </div>
          </DashboardCard>

          <DashboardCard
            id="light-colors"
            icon={Palette}
            color={lightIconColor}
            title="Light Mode Color Settings"
            text="Control the public website light theme colors separately from the dark theme."
            isLight={isLight}
          >
            <div className="grid gap-6">
              <div
                className="rounded-[1.75rem] border p-5"
                style={lightModePreviewStyle}
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p
                      className="text-xs font-black uppercase tracking-[0.2em]"
                      style={{ color: lightPrimaryColor }}
                    >
                      Light Mode Preview
                    </p>

                    <h3
                      className="mt-3 text-2xl font-black tracking-tight"
                      style={{ color: lightTextColor }}
                    >
                      Website light theme
                    </h3>

                    <p
                      className="mt-2 max-w-xl text-sm leading-6"
                      style={{ color: lightMutedTextColor }}
                    >
                      These colors are used when visitors switch the public
                      website to light mode.
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <PreviewDot label="Primary" value={lightPrimaryColor} />
                    <PreviewDot label="Surface" value={lightSurfaceColor} />
                    <PreviewDot label="Text" value={lightTextColor} />
                    <PreviewDot label="Icon" value={lightIconColor} />
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Icon", Eye],
                    ["Contact", Phone],
                    ["Social", Share2],
                  ].map(([label, Icon]) => (
                    <div
                      key={label}
                      className="rounded-2xl border p-4"
                      style={{
                        backgroundColor: lightSurfaceColor,
                        borderColor: lightBorderColor,
                      }}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: lightIconColor }}
                      />
                      <p
                        className="mt-3 text-sm font-black"
                        style={{ color: lightTextColor }}
                      >
                        {label}
                      </p>
                      <p
                        className="mt-1 text-xs"
                        style={{ color: lightMutedTextColor }}
                      >
                        Contrast checked preview
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <ColorField
                  label="Light Primary Color"
                  value={lightPrimaryColor}
                  onChange={(value) => update("lightPrimaryColor", value)}
                />

                <ColorField
                  label="Light Secondary Color"
                  value={lightSecondaryColor}
                  onChange={(value) => update("lightSecondaryColor", value)}
                />

                <ColorField
                  label="Light Accent Color"
                  value={lightAccentColor}
                  onChange={(value) => update("lightAccentColor", value)}
                />

                <ColorField
                  label="Light Background Color"
                  value={lightBackgroundColor}
                  onChange={(value) => update("lightBackgroundColor", value)}
                />

                <ColorField
                  label="Light Surface / Card Color"
                  value={lightSurfaceColor}
                  onChange={(value) => update("lightSurfaceColor", value)}
                />

                <ColorField
                  label="Light Border Color"
                  value={lightBorderColor}
                  onChange={(value) => update("lightBorderColor", value)}
                />

                <ColorField
                  label="Light Text Color"
                  value={lightTextColor}
                  onChange={(value) => update("lightTextColor", value)}
                />

                <ColorField
                  label="Light Muted Text Color"
                  value={lightMutedTextColor}
                  onChange={(value) => update("lightMutedTextColor", value)}
                />

                <ColorField
                  label="Light Icon / Contrast Color"
                  value={lightIconColor}
                  onChange={(value) => update("lightIconColor", value)}
                />
              </div>
            </div>
          </DashboardCard>

          <DashboardCard
            id="logo"
            icon={ImagePlus}
            color={primaryColor}
            title="Logo Settings"
            text="Upload separate logos for dark and light website modes."
            isLight={isLight}
          >
            <div className="grid gap-6 xl:grid-cols-2">
              <LogoUploadPanel
                title="Dark Mode Logo"
                description="Used on dark backgrounds and dark website mode."
                logoField="logo"
                settings={draft}
                isLight={isLight}
                ui={ui}
                color={primaryColor}
                onUpload={handleLogoUpload}
                onRemove={() => update("logo", "")}
              />

              <LogoUploadPanel
                title="Light Mode Logo"
                description="Used on white/light backgrounds and light website mode."
                logoField="lightLogo"
                settings={draft}
                isLight={isLight}
                ui={ui}
                color={lightIconColor}
                onUpload={handleLogoUpload}
                onRemove={() => update("lightLogo", "")}
              />
            </div>
          </DashboardCard>

          <DashboardCard
            id="hero"
            icon={Cpu}
            color={primaryColor}
            title="Hero Content"
            text="Edit headline, paragraph and call-to-action button text."
            isLight={isLight}
          >
            <div className="grid gap-5">
              <Field
                label="Hero Badge"
                value={draft.heroBadge || ""}
                onChange={(value) => update("heroBadge", value)}
              />

              <TextAreaField
                label="Hero Title"
                rows={2}
                value={draft.heroTitle || ""}
                onChange={(value) => update("heroTitle", value)}
              />

              <TextAreaField
                label="Hero Paragraph"
                rows={4}
                value={draft.heroText || ""}
                onChange={(value) => update("heroText", value)}
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Primary Button Text"
                  value={draft.ctaPrimary || ""}
                  onChange={(value) => update("ctaPrimary", value)}
                />

                <Field
                  label="Secondary Button Text"
                  value={draft.ctaSecondary || ""}
                  onChange={(value) => update("ctaSecondary", value)}
                />
              </div>
            </div>
          </DashboardCard>

          <DashboardCard
            id="contact-settings"
            icon={Phone}
            color={primaryColor}
            title="Contact Details"
            text="Update business contact information displayed on the website."
            isLight={isLight}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Email"
                value={draft.email || ""}
                onChange={(value) => update("email", value)}
              />

              <Field
                label="Phone"
                value={draft.phone || ""}
                onChange={(value) => update("phone", value)}
              />

              <Field
                label="Location"
                value={draft.location || ""}
                onChange={(value) => update("location", value)}
              />

              <Field
                label="Website URL"
                value={draft.websiteUrl || ""}
                onChange={(value) => update("websiteUrl", value)}
                placeholder="https://obm.qa"
              />
            </div>
          </DashboardCard>

          <DashboardCard
            id="social-settings"
            icon={Share2}
            color={primaryColor}
            title="Social Media Integration"
            text="Add all social media links used on the website header, footer and contact sections."
            isLight={isLight}
          >
            <div className="grid gap-5 md:grid-cols-2">
              {socialItems.map(
                ({ key, label, placeholder, icon: Icon, brandColor }) => (
                  <SocialField
                    key={key}
                    icon={Icon}
                    color={primaryColor}
                    brandColor={brandColor}
                    label={label}
                    value={draft[key] || ""}
                    placeholder={placeholder}
                    onChange={(value) => update(key, value)}
                    isLight={isLight}
                  />
                ),
              )}
            </div>

            <div className={`mt-6 rounded-[1.5rem] border p-5 ${ui.innerPanel}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-black">Active Social Links</p>
                  <p className={`mt-1 text-sm ${ui.muted}`}>
                    These links will be available for frontend social icons.
                  </p>
                </div>

                <span
                  className="w-fit rounded-full px-3 py-1 text-xs font-black text-slate-950"
                  style={{ backgroundColor: primaryColor }}
                >
                  {activeSocialLinks.length} Active
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {activeSocialLinks.length > 0 ? (
                  activeSocialLinks.map(({ key, label, icon: Icon, brandColor }) => (
                    <a
                      key={key}
                      href={resolveSocialUrl(draft[key], key)}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition hover:-translate-y-0.5 ${ui.secondaryButton}`}
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          isLight ? "bg-slate-100" : "bg-white/10"
                        }`}
                        style={{ color: brandColor }}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      {label.replace(" URL", "")}
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  ))
                ) : (
                  <p className={`text-sm ${ui.faint}`}>
                    No social links added yet.
                  </p>
                )}
              </div>
            </div>
          </DashboardCard>

          <DashboardCard
            id="contact-email-settings"
            icon={Mail}
            color={primaryColor}
            title="Contact Email Notifications"
            text="Control whether contact form inquiries are sent to email."
            isLight={isLight}
          >
            <div className="grid gap-5">
              <TogglePanel
                title="Enable Contact Email"
                text="Send an email when a visitor submits the contact form."
                checked={Boolean(draft.contactEmailEnabled)}
                onChange={(checked) => update("contactEmailEnabled", checked)}
                color={primaryColor}
                isLight={isLight}
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Recipient Email"
                  value={draft.contactRecipientEmail || ""}
                  onChange={(value) => update("contactRecipientEmail", value)}
                  placeholder="hello@obm.qa"
                />

                <Field
                  label="Email Subject Prefix"
                  value={draft.contactEmailSubjectPrefix || ""}
                  onChange={(value) =>
                    update("contactEmailSubjectPrefix", value)
                  }
                  placeholder="New OBM Website Inquiry"
                />
              </div>
            </div>
          </DashboardCard>

          <DashboardCard
            id="smtp-settings"
            icon={Server}
            color={primaryColor}
            title="SMTP Settings"
            text="Configure SMTP server settings for sending website inquiry emails."
            isLight={isLight}
          >
            <div className="grid gap-5">
              <TogglePanel
                title="Enable SMTP"
                text="Use these SMTP settings to send contact form emails."
                checked={Boolean(draft.smtpEnabled)}
                onChange={(checked) => update("smtpEnabled", checked)}
                color={primaryColor}
                isLight={isLight}
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="SMTP Host"
                  value={draft.smtpHost || ""}
                  onChange={(value) => update("smtpHost", value)}
                  placeholder="smtp.gmail.com"
                />

                <Field
                  label="SMTP Port"
                  type="number"
                  value={draft.smtpPort || ""}
                  onChange={(value) => update("smtpPort", value)}
                  placeholder="587"
                />

                <Field
                  label="SMTP Username"
                  value={draft.smtpUser || ""}
                  onChange={(value) => update("smtpUser", value)}
                  placeholder="your-email@gmail.com"
                />

                <Field
                  label="SMTP Password / App Password"
                  type="password"
                  value={draft.smtpPass || ""}
                  onChange={(value) => update("smtpPass", value)}
                  placeholder="Gmail app password"
                />

                <div className="md:col-span-2">
                  <Field
                    label="From Email"
                    value={draft.smtpFrom || ""}
                    onChange={(value) => update("smtpFrom", value)}
                    placeholder="OBM Website <your-email@gmail.com>"
                  />
                </div>
              </div>

              <div
                className={`rounded-[1.5rem] border p-5 text-sm leading-6 ${
                  isLight
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-amber-400/20 bg-amber-400/10 text-amber-100"
                }`}
              >
                For Gmail, use a Gmail App Password, not your normal Gmail
                password. Do not expose SMTP password in the public settings API.
              </div>
            </div>
          </DashboardCard>

          <section
            className={`rounded-[2rem] border p-6 shadow-2xl backdrop-blur-2xl md:p-8 ${ui.solidPanel}`}
          >
            <div className="grid gap-6 md:grid-cols-[1fr_240px] md:items-center">
              <div>
                <h2 className="text-2xl font-black">Ready to publish?</h2>
                <p className={`mt-2 text-sm leading-6 ${ui.muted}`}>
                  Save all changes and open the public website to verify your
                  updated branding, content and social media links.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-black text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                style={gradientButtonStyle}
              >
                <Save className="h-5 w-5" />
                {saving ? "Saving..." : "Save All Changes"}
              </button>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function LogoUploadPanel({
  title,
  description,
  logoField,
  settings,
  isLight,
  ui,
  color,
  onUpload,
  onRemove,
}) {
  return (
    <div className={`rounded-[1.75rem] border p-5 ${ui.innerPanel}`}>
      <div className="mb-5">
        <p className="text-lg font-black">{title}</p>
        <p className={`mt-1 text-sm leading-6 ${ui.muted}`}>{description}</p>
      </div>

      <label
        className={`group flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed p-6 text-center transition ${
          isLight
            ? "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-100"
            : "border-white/20 bg-slate-950/70 hover:border-white/30 hover:bg-white/[0.04]"
        }`}
      >
        <span
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl transition group-hover:scale-105"
          style={{ backgroundColor: hexToRgba(color, 0.14) }}
        >
          <Upload className="h-7 w-7" style={{ color }} />
        </span>

        <span className="text-lg font-black">Upload {title}</span>

        <span className={`mt-2 max-w-sm text-sm leading-6 ${ui.muted}`}>
          PNG, JPG, SVG or WebP. Transparent PNG/SVG is recommended.
        </span>

        <input
          type="file"
          accept="image/*"
          onChange={(event) => onUpload(event, logoField)}
          className="hidden"
        />
      </label>

      <div className="mt-5">
        <p className={`mb-3 text-sm font-black ${ui.muted}`}>Current Preview</p>

        <div
          className={`flex min-h-32 w-full items-center justify-center rounded-3xl border p-5 ${ui.innerPanel}`}
        >
          <AdminLogoBox
            settings={settings}
            size="preview"
            isLight={isLight}
            logoField={logoField}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className={`mt-5 w-full rounded-2xl border px-4 py-3 text-sm font-black transition ${ui.secondaryButton}`}
      >
        Remove {title}
      </button>
    </div>
  );
}

function AdminLogoBox({
  settings,
  size = "header",
  isLight = false,
  logoField = "logo",
}) {
  const [imageFailed, setImageFailed] = useState(false);

  const selectedLogo = settings?.[logoField] || settings?.logo || "";
  const logoUrl = resolveAssetUrl(selectedLogo);

  useEffect(() => {
    setImageFailed(false);
  }, [logoUrl]);

  const boxClass =
    size === "lg"
      ? "h-20 w-52 rounded-3xl"
      : size === "preview"
        ? "h-24 w-full rounded-3xl"
        : "h-12 w-32 rounded-2xl";

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden ${boxClass}`}
    >
      <div
        className={`flex h-full w-full items-center justify-center ${
          isLight ? "bg-white/40" : "bg-transparent"
        }`}
      >
        {logoUrl && !imageFailed ? (
          <img
            src={logoUrl}
            alt={settings?.siteName || "OBM Logo"}
            className="block h-full w-full object-contain"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <LogoMark settings={settings} />
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardCard({ id, icon: Icon, color, title, text, children, isLight }) {
  return (
    <section
      id={id}
      className={`rounded-[2rem] border p-5 shadow-2xl backdrop-blur-2xl sm:p-6 md:p-8 ${
        isLight
          ? "border-slate-200 bg-white/85 shadow-slate-200/70"
          : "border-white/10 bg-white/[0.055] shadow-black/20"
      }`}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: hexToRgba(color, 0.14), color }}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight">{title}</h2>
            <p
              className={`mt-1 text-sm leading-6 ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              {text}
            </p>
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}

function SocialField({
  icon: Icon,
  color,
  brandColor,
  label,
  value,
  onChange,
  placeholder,
  isLight,
}) {
  return (
    <div
      className={`rounded-[1.5rem] border p-4 ${
        isLight
          ? "border-slate-200 bg-slate-50"
          : "border-white/10 bg-slate-950/70"
      }`}
    >
      <label
        className={`mb-2 flex items-center gap-2 text-sm font-black ${
          isLight ? "text-slate-700" : "text-slate-200"
        }`}
      >
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
            isLight
              ? "border-slate-200 bg-white"
              : "border-white/10 bg-white/[0.06]"
          }`}
          style={{ color: brandColor || color }}
        >
          <Icon className="h-4 w-4" />
        </span>
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
          isLight
            ? "border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus:border-slate-300"
            : "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-600 focus:border-white/20 focus:bg-white/[0.07]"
        }`}
      />
    </div>
  );
}

function TogglePanel({ title, text, checked, onChange, color, isLight }) {
  return (
    <label
      className={`flex cursor-pointer flex-col gap-4 rounded-[1.5rem] border p-5 transition sm:flex-row sm:items-center sm:justify-between ${
        isLight
          ? "border-slate-200 bg-slate-50 hover:bg-slate-100"
          : "border-white/10 bg-slate-950/70 hover:bg-white/[0.04]"
      }`}
    >
      <div>
        <p className={isLight ? "font-black text-slate-950" : "font-black text-white"}>
          {title}
        </p>
        <p
          className={`mt-1 text-sm leading-6 ${
            isLight ? "text-slate-600" : "text-slate-400"
          }`}
        >
          {text}
        </p>
      </div>

      <span
        className={`relative h-7 w-14 shrink-0 rounded-full border transition ${
          checked
            ? "border-transparent"
            : isLight
              ? "border-slate-300 bg-slate-200"
              : "border-white/10 bg-white/10"
        }`}
        style={checked ? { backgroundColor: color } : undefined}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="sr-only"
        />

        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-lg transition ${
            checked ? "left-8" : "left-1"
          }`}
        />
      </span>
    </label>
  );
}

function PreviewDot({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-2 text-center shadow-sm">
      <div
        className="mx-auto h-7 w-7 rounded-full border border-slate-200"
        style={{ backgroundColor: value }}
      />

      <p className="mt-2 text-[9px] font-black uppercase tracking-wide text-slate-500">
        {label}
      </p>
    </div>
  );
}

function ColorDot({ label, value, isLight }) {
  return (
    <div
      className={`border-r p-3 last:border-r-0 ${
        isLight ? "border-slate-200" : "border-white/10"
      }`}
    >
      <div
        className="mx-auto h-6 w-6 rounded-full"
        style={{ backgroundColor: value }}
      />

      <p className="mt-2 truncate text-center text-[10px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
    </div>
  );
}

function AlertBox({ type, icon: Icon, text, isLight }) {
  const isSuccess = type === "success";

  return (
    <div
      className={`mt-4 flex items-start gap-3 rounded-3xl border px-4 py-3 text-sm font-semibold ${
        isSuccess
          ? isLight
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
          : isLight
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-red-400/20 bg-red-400/10 text-red-200"
      }`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{text}</span>
    </div>
  );
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

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }

  return `https://${raw}`;
}