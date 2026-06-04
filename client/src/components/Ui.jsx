import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

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

function getThemeColors(settings = {}, themeMode = "dark") {
  const isLight = themeMode === "light";

  return {
    isLight,

    primaryColor: isLight
      ? settings.lightPrimaryColor || settings.primaryColor || "#2563eb"
      : settings.primaryColor || "#22d3ee",

    secondaryColor: isLight
      ? settings.lightSecondaryColor || settings.secondaryColor || "#7c3aed"
      : settings.secondaryColor || "#2563eb",

    accentColor: isLight
      ? settings.lightAccentColor || settings.accentColor || "#0891b2"
      : settings.accentColor || "#a855f7",

    backgroundColor: isLight
      ? settings.lightBackgroundColor || "#f8fafc"
      : "#020617",

    surfaceColor: isLight
      ? settings.lightSurfaceColor || "#ffffff"
      : "rgba(255,255,255,0.04)",

    textColor: isLight
      ? settings.lightTextColor || "#0f172a"
      : "#ffffff",

    mutedTextColor: isLight
      ? settings.lightMutedTextColor || "#475569"
      : "#cbd5e1",

    borderColor: isLight
      ? settings.lightBorderColor || "#e2e8f0"
      : "rgba(255,255,255,0.10)",

    iconColor: isLight
      ? settings.lightIconColor || settings.lightPrimaryColor || "#1d4ed8"
      : settings.primaryColor || "#22d3ee",
  };
}

export function Badge({ settings = {}, children, themeMode = "dark" }) {
  const theme = getThemeColors(settings, themeMode);

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold"
      style={{
        borderColor: hexToRgba(theme.primaryColor, theme.isLight ? 0.22 : 0.28),
        backgroundColor: hexToRgba(theme.primaryColor, theme.isLight ? 0.1 : 0.08),
        color: theme.primaryColor,
      }}
    >
      <Sparkles className="h-4 w-4" />
      {children}
    </span>
  );
}

export function SectionTitle({
  settings = {},
  eyebrow,
  title,
  text,
  themeMode = "dark",
}) {
  const theme = getThemeColors(settings, themeMode);

  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && (
        <p
          className="mb-3 text-sm font-black uppercase tracking-[0.25em]"
          style={{ color: theme.primaryColor }}
        >
          {eyebrow}
        </p>
      )}

      <h2
        className="text-3xl font-black tracking-tight md:text-5xl"
        style={{ color: theme.textColor }}
      >
        {title}
      </h2>

      {text && (
        <p
          className="mt-5 text-base leading-8 md:text-lg"
          style={{ color: theme.mutedTextColor }}
        >
          {text}
        </p>
      )}
    </div>
  );
}

export function ServiceCard({
  service,
  index = 0,
  settings = {},
  themeMode = "dark",
}) {
  const Icon = service.icon;
  const theme = getThemeColors(settings, themeMode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="rounded-3xl border p-7 transition hover:-translate-y-1"
      style={{
        borderColor: theme.borderColor,
        backgroundColor: theme.isLight
          ? hexToRgba(theme.surfaceColor, 0.92)
          : "rgba(255,255,255,0.04)",
        boxShadow: theme.isLight
          ? `0 20px 60px ${hexToRgba(theme.primaryColor, 0.08)}`
          : "none",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.backgroundColor = theme.isLight
          ? "#ffffff"
          : "rgba(255,255,255,0.07)";
        event.currentTarget.style.borderColor = hexToRgba(
          theme.primaryColor,
          theme.isLight ? 0.25 : 0.22,
        );
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.backgroundColor = theme.isLight
          ? hexToRgba(theme.surfaceColor, 0.92)
          : "rgba(255,255,255,0.04)";
        event.currentTarget.style.borderColor = theme.borderColor;
      }}
    >
      <div
        className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: hexToRgba(theme.iconColor, theme.isLight ? 0.12 : 0.08),
          color: theme.iconColor,
        }}
      >
        <Icon className="h-7 w-7" />
      </div>

      <h3
        className="text-xl font-black"
        style={{ color: theme.textColor }}
      >
        {service.title}
      </h3>

      <p
        className="mt-4 leading-7"
        style={{ color: theme.mutedTextColor }}
      >
        {service.text}
      </p>
    </motion.div>
  );
}