import React, { useEffect, useMemo, useState } from "react";
import {
  Cpu,
  Home,
  ImagePlus,
  Mail,
  Palette,
  Phone,
  RefreshCw,
  Save,
  Server,
  Settings,
  Upload,
} from "lucide-react";

import LogoMark from "../components/LogoMark.jsx";
import { ColorField, Field, TextAreaField } from "../components/FormFields.jsx";
import {
  resetSettingsOnApi,
  saveSettingsToApi,
  uploadLogoToApi,
} from "../lib/api.js";

export default function AdminDashboard({ settings, setSettings, navigate, onLogout }) {
  const [draft, setDraft] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDraft(settings);
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
    setTimeout(() => setSaved(false), 2200);
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
      setError(err.message || "Logo upload failed");
    } finally {
      setSaving(false);
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
      setError(err.message || "Settings save failed");
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
      setError(err.message || "Reset failed");
    } finally {
      setSaving(false);
    }
  };

  const previewStyle = useMemo(
    () => ({
      background: `linear-gradient(135deg, ${draft.primaryColor}, ${draft.secondaryColor})`,
      boxShadow: `0 18px 50px ${draft.primaryColor}30`,
    }),
    [draft.primaryColor, draft.secondaryColor],
  );

  const menuItems = [
    [Settings, "Brand Settings", "#brand"],
    [Palette, "Color Control", "#colors"],
    [ImagePlus, "Logo Upload", "#logo"],
    [Cpu, "Hero Content", "#hero"],
    [Phone, "Contact Details", "#contact-settings"],
    [Mail, "Email Notifications", "#contact-email-settings"],
    [Server, "SMTP Settings", "#smtp-settings"],
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <LogoMark settings={draft} variant="navbar" />
            <div className="min-w-0">
              <p className="truncate text-lg font-bold leading-none">
                OBM Admin Dashboard
              </p>
              <p className="mt-1 truncate text-xs text-slate-400">
                Logo, colors, website content, contact and SMTP controls
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Home className="h-4 w-4" />
              View Website
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Logout
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: draft.primaryColor }}
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 lg:sticky lg:top-24">
          <div className="mb-5 rounded-3xl p-5" style={previewStyle}>
            <div className="rounded-2xl bg-white p-3">
              <LogoMark settings={draft} size="lg" />
            </div>

            <p className="mt-4 text-2xl font-black text-white">
              {draft.siteName}
            </p>
            <p className="mt-1 text-sm text-white/80">{draft.tagline}</p>
          </div>

          <nav className="space-y-2 text-sm">
            {menuItems.map(([Icon, label, href]) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
          </nav>

          <button
            onClick={handleReset}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-200 transition hover:bg-red-400/20"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Defaults
          </button>

          {saved && (
            <p className="mt-4 rounded-2xl bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300">
              Settings saved successfully.
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-2xl bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-200">
              {error}
            </p>
          )}
        </aside>

        <div className="space-y-6">
          <section
            id="brand"
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8"
          >
            <SectionHeader
              icon={Settings}
              color={draft.primaryColor}
              title="Brand Settings"
              text="Control company name, tagline and footer text."
            />

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
          </section>

          <section
            id="colors"
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8"
          >
            <SectionHeader
              icon={Palette}
              color={draft.primaryColor}
              title="Color Control"
              text="Change primary, secondary and accent colors used across the website."
            />

            <div className="grid gap-5 md:grid-cols-3">
              <ColorField
                label="Primary Color"
                value={draft.primaryColor || "#22d3ee"}
                onChange={(value) => update("primaryColor", value)}
              />

              <ColorField
                label="Secondary Color"
                value={draft.secondaryColor || "#2563eb"}
                onChange={(value) => update("secondaryColor", value)}
              />

              <ColorField
                label="Accent Color"
                value={draft.accentColor || "#a855f7"}
                onChange={(value) => update("accentColor", value)}
              />
            </div>
          </section>

          <section
            id="logo"
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8"
          >
            <SectionHeader
              icon={ImagePlus}
              color={draft.primaryColor}
              title="Logo Update"
              text="Upload a logo and instantly apply it to the public website header and footer sections."
            />

            <div className="grid gap-6 md:grid-cols-[1fr_260px] md:items-center">
              <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-slate-950 p-8 text-center transition hover:bg-white/[0.04]">
                <Upload
                  className="mb-4 h-10 w-10"
                  style={{ color: draft.primaryColor }}
                />
                <span className="text-lg font-bold">Upload Logo</span>
                <span className="mt-2 text-sm text-slate-400">
                  PNG, JPG, SVG or WebP recommended
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>

              <div className="rounded-3xl border border-white/10 bg-slate-950 p-6 text-center">
                <div className="mx-auto flex min-h-28 w-full items-center justify-center rounded-3xl bg-white p-4">
                  <LogoMark settings={draft} size="lg" />
                </div>

                <button
                  onClick={() => update("logo", "")}
                  className="mt-5 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-white/10"
                >
                  Remove Logo
                </button>
              </div>
            </div>
          </section>

          <section
            id="hero"
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8"
          >
            <SectionHeader
              icon={Cpu}
              color={draft.primaryColor}
              title="Hero Content"
              text="Edit headline, paragraph and call-to-action button text."
            />

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
          </section>

          <section
            id="contact-settings"
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8"
          >
            <SectionHeader
              icon={Phone}
              color={draft.primaryColor}
              title="Contact & Social Details"
              text="Update business contact information displayed on the website."
            />

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
                label="WhatsApp"
                value={draft.whatsapp || ""}
                onChange={(value) => update("whatsapp", value)}
              />

              <div className="md:col-span-2">
                <Field
                  label="LinkedIn URL"
                  value={draft.linkedin || ""}
                  onChange={(value) => update("linkedin", value)}
                />
              </div>
            </div>
          </section>

          <section
            id="contact-email-settings"
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8"
          >
            <SectionHeader
              icon={Mail}
              color={draft.primaryColor}
              title="Contact Email Notifications"
              text="Control whether contact form inquiries are sent to email."
            />

            <div className="grid gap-5">
              <label className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-white">Enable Contact Email</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Send an email when a visitor submits the contact form.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={Boolean(draft.contactEmailEnabled)}
                  onChange={(event) =>
                    update("contactEmailEnabled", event.target.checked)
                  }
                  className="h-5 w-5"
                />
              </label>

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
          </section>

          <section
            id="smtp-settings"
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8"
          >
            <SectionHeader
              icon={Server}
              color={draft.primaryColor}
              title="SMTP Settings"
              text="Configure SMTP server settings for sending website inquiry emails."
            />

            <div className="grid gap-5">
              <label className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-white">Enable SMTP</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Use these SMTP settings to send contact form emails.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={Boolean(draft.smtpEnabled)}
                  onChange={(event) => update("smtpEnabled", event.target.checked)}
                  className="h-5 w-5"
                />
              </label>

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

              <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm leading-6 text-amber-100">
                For Gmail, use a Gmail App Password, not your normal Gmail
                password. Do not expose SMTP password in the public settings API.
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-slate-900 p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-[1fr_220px] md:items-center">
              <div>
                <h2 className="text-2xl font-black">Live Preview</h2>
                <p className="mt-2 text-slate-400">
                  Save changes, then click View Website to confirm the public
                  landing page updates.
                </p>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ backgroundColor: draft.primaryColor }}
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

function SectionHeader({ icon: Icon, color, title, text }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <Icon className="h-6 w-6" style={{ color }} />
      <div>
        <h2 className="text-2xl font-black">{title}</h2>
        <p className="text-sm text-slate-400">{text}</p>
      </div>
    </div>
  );
}