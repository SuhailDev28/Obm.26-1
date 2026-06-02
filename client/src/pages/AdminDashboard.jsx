import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Cpu,
  ExternalLink,
  Eye,
  Globe2,
  Home,
  ImagePlus,
  LogOut,
  Mail,
  MapPin,
  Palette,
  Phone,
  RefreshCw,
  Save,
  Server,
  Settings,
  Share2,
  ShieldCheck,
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

  useEffect(() => {
    setDraft(settings || {});
  }, [settings]);

  const update = (key, value) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
    setSaved(false);
  };

  const showSaved = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      setError("");

      const nextSettings = await uploadLogoToApi(file);

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

      const nextSettings = await saveSettingsToApi(draft);

      setSettings(nextSettings);
      setDraft(nextSettings);
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

  const heroPreviewStyle = useMemo(
    () => ({
      background: `
        radial-gradient(circle at top left, ${primaryColor}45, transparent 32%),
        radial-gradient(circle at bottom right, ${secondaryColor}45, transparent 35%),
        linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(2, 6, 23, 0.98))
      `,
      boxShadow: `0 28px 90px ${primaryColor}22`,
    }),
    [primaryColor, secondaryColor],
  );

  const gradientButtonStyle = useMemo(
    () => ({
      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
      boxShadow: `0 16px 42px ${primaryColor}35`,
    }),
    [primaryColor, secondaryColor],
  );

  const menuItems = [
    [Settings, "Brand Settings", "Company name, tagline", "#brand"],
    [Palette, "Color Control", "Primary, secondary, accent", "#colors"],
    [ImagePlus, "Logo Upload", "Header and footer logo", "#logo"],
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
      brandColor: "#FFFFFF",
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
      brandColor: "#FFFFFF",
    },
    {
      key: "threads",
      label: "Threads URL",
      placeholder: "https://threads.net/@yourprofile",
      icon: FaThreads,
      brandColor: "#FFFFFF",
    },
    {
      key: "snapchat",
      label: "Snapchat URL",
      placeholder: "https://snapchat.com/add/yourprofile",
      icon: FaSnapchatGhost,
      brandColor: "#FFFC00",
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
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div
          className="absolute -left-32 top-10 h-80 w-80 rounded-full blur-3xl"
          style={{ backgroundColor: `${primaryColor}25` }}
        />

        <div
          className="absolute -right-32 top-80 h-96 w-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${secondaryColor}22` }}
        />

        <div
          className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}18` }}
        />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <AdminLogoBox settings={draft} />

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

              <p className="mt-1 truncate text-xs text-slate-400 sm:text-sm">
                Manage logo, colors, website content, contact and SMTP settings.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              <Home className="h-4 w-4" />
              Website
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
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
        <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-black/20 backdrop-blur-2xl lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10">
            <div className="p-5" style={heroPreviewStyle}>
              <div className="flex items-center justify-between gap-3">
                <AdminLogoBox settings={draft} size="lg" />

                <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur">
                  
                </div>
              </div>

              <p className="mt-5 line-clamp-2 text-2xl font-black text-white">
                {draft.siteName || "OBM"}
              </p>

              <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/75">
                {draft.tagline || "AI consultancy and digital solutions"}
              </p>
            </div>

            <div className="grid grid-cols-3 border-t border-white/10 bg-slate-950/80">
              <ColorDot label="Primary" value={primaryColor} />
              <ColorDot label="Secondary" value={secondaryColor} />
              <ColorDot label="Accent" value={accentColor} />
            </div>
          </div>

          <nav className="mt-5 space-y-2">
            {menuItems.map(([Icon, label, description, href]) => (
              <a
                key={label}
                href={href}
                className="group flex items-center gap-3 rounded-3xl border border-transparent px-4 py-3 text-slate-300 transition hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] transition group-hover:scale-105"
                  style={{ color: primaryColor }}
                >
                  <Icon className="h-4 w-4" />
                </span>

                <span className="min-w-0">
                  <span className="block truncate text-sm font-black">
                    {label}
                  </span>
                  <span className="block truncate text-xs text-slate-500">
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
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-3xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-black text-red-200 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Defaults
          </button>

          {saved && (
            <AlertBox
              type="success"
              icon={CheckCircle2}
              text="Settings saved successfully."
            />
          )}

          {error && <AlertBox type="error" icon={ShieldCheck} text={error} />}
        </aside>

        <div className="space-y-6">
          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/20 backdrop-blur-2xl">
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

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                  Update branding, logo, hero copy, contact information, email
                  notifications, SMTP configuration and social media links
                  without editing code.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${primaryColor}22` }}
                  >
                    <Eye className="h-5 w-5" style={{ color: primaryColor }} />
                  </div>

                  <div>
                    <p className="font-black">Preview Ready</p>
                    <p className="text-xs text-slate-400">
                      Save first, then check public website.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-black transition hover:bg-white/10"
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
            title="Color Control"
            text="Change primary, secondary and accent colors used across the website."
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
            id="logo"
            icon={ImagePlus}
            color={primaryColor}
            title="Logo Update"
            text="Upload a logo and instantly apply it to the public website header and footer."
          >
            <div className="grid gap-6 md:grid-cols-[1fr_280px] md:items-stretch">
              <label className="group flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-white/20 bg-slate-950/70 p-8 text-center transition hover:border-white/30 hover:bg-white/[0.04]">
                <span
                  className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl transition group-hover:scale-105"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <Upload className="h-8 w-8" style={{ color: primaryColor }} />
                </span>

                <span className="text-xl font-black">Upload Logo</span>

                <span className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                  PNG, JPG, SVG or WebP recommended. The uploaded logo will be
                  used across the public website.
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>

              <div className="flex flex-col justify-between rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5 text-center">
                <div>
                  <p className="mb-4 text-left text-sm font-black text-slate-300">
                    Current Logo
                  </p>

                  <div className="flex min-h-32 w-full items-center justify-center rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <AdminLogoBox settings={draft} size="preview" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => update("logo", "")}
                  className="mt-5 rounded-2xl border border-white/10 px-4 py-3 text-sm font-black text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  Remove Logo
                </button>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard
            id="hero"
            icon={Cpu}
            color={primaryColor}
            title="Hero Content"
            text="Edit headline, paragraph and call-to-action button text."
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
                  />
                ),
              )}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-black text-white">Active Social Links</p>
                  <p className="mt-1 text-sm text-slate-400">
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
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/10"
                    >
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10"
                        style={{ color: brandColor }}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      {label.replace(" URL", "")}
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
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
          >
            <div className="grid gap-5">
              <TogglePanel
                title="Enable Contact Email"
                text="Send an email when a visitor submits the contact form."
                checked={Boolean(draft.contactEmailEnabled)}
                onChange={(checked) => update("contactEmailEnabled", checked)}
                color={primaryColor}
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
          >
            <div className="grid gap-5">
              <TogglePanel
                title="Enable SMTP"
                text="Use these SMTP settings to send contact form emails."
                checked={Boolean(draft.smtpEnabled)}
                onChange={(checked) => update("smtpEnabled", checked)}
                color={primaryColor}
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

              <div className="rounded-[1.5rem] border border-amber-400/20 bg-amber-400/10 p-5 text-sm leading-6 text-amber-100">
                For Gmail, use a Gmail App Password, not your normal Gmail
                password. Do not expose SMTP password in the public settings API.
              </div>
            </div>
          </DashboardCard>

          <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl md:p-8">
            <div className="grid gap-6 md:grid-cols-[1fr_240px] md:items-center">
              <div>
                <h2 className="text-2xl font-black">Ready to publish?</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
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

function AdminLogoBox({ settings, size = "header" }) {
  const [imageFailed, setImageFailed] = useState(false);

  const logoUrl = resolveAssetUrl(settings?.logo);

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
      <div className="flex h-full w-full items-center justify-center">
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

function DashboardCard({ id, icon: Icon, color, title, text, children }) {
  return (
    <section
      id={id}
      className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-6 md:p-8"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${color}20`, color }}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">{text}</p>
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
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4">
      <label className="mb-2 flex items-center gap-2 text-sm font-black text-slate-200">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]"
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
        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-white/20 focus:bg-white/[0.07]"
      />
    </div>
  );
}

function TogglePanel({ title, text, checked, onChange, color }) {
  return (
    <label className="flex cursor-pointer flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5 transition hover:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-black text-white">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-400">{text}</p>
      </div>

      <span
        className={`relative h-7 w-14 shrink-0 rounded-full border transition ${
          checked ? "border-transparent" : "border-white/10 bg-white/10"
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

function ColorDot({ label, value }) {
  return (
    <div className="border-r border-white/10 p-3 last:border-r-0">
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

function AlertBox({ type, icon: Icon, text }) {
  const isSuccess = type === "success";

  return (
    <div
      className={`mt-4 flex items-start gap-3 rounded-3xl border px-4 py-3 text-sm font-semibold ${
        isSuccess
          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
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