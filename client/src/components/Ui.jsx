// client/src/components/Ui.jsx

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

function normalizeHexColor(color, fallback = "#22d3ee") {
  const raw = String(color || "").trim();

  if (!raw.startsWith("#")) return fallback;

  let hex = raw.slice(1);

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => `${char}${char}`)
      .join("");
  }

  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return fallback;

  return `#${hex}`;
}

function hexToRgba(hex, opacity = 1) {
  const safeHex = normalizeHexColor(hex).replace("#", "");

  const r = parseInt(safeHex.slice(0, 2), 16);
  const g = parseInt(safeHex.slice(2, 4), 16);
  const b = parseInt(safeHex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function getThemeColors(settings = {}, themeMode = "dark") {
  const isLight = themeMode === "light" || settings?.isLightMode === true;

  const primaryColor = isLight
    ? normalizeHexColor(
        settings.lightPrimaryColor || settings.primaryColor,
        "#2563eb",
      )
    : normalizeHexColor(settings.primaryColor, "#22d3ee");

  const secondaryColor = isLight
    ? normalizeHexColor(
        settings.lightSecondaryColor || settings.secondaryColor,
        "#7c3aed",
      )
    : normalizeHexColor(settings.secondaryColor, "#2563eb");

  const accentColor = isLight
    ? normalizeHexColor(
        settings.lightAccentColor || settings.accentColor,
        "#0891b2",
      )
    : normalizeHexColor(settings.accentColor, "#a855f7");

  const backgroundColor = isLight
    ? normalizeHexColor(settings.lightBackgroundColor, "#f8fafc")
    : "#020617";

  const surfaceColor = isLight
    ? normalizeHexColor(settings.lightSurfaceColor, "#ffffff")
    : "#0f172a";

  const textColor = isLight
    ? normalizeHexColor(settings.lightTextColor, "#0f172a")
    : "#ffffff";

  const mutedTextColor = isLight
    ? normalizeHexColor(settings.lightMutedTextColor, "#475569")
    : "#cbd5e1";

  const borderColor = isLight
    ? normalizeHexColor(settings.lightBorderColor, "#e2e8f0")
    : "rgba(255,255,255,0.10)";

  const iconColor = isLight
    ? normalizeHexColor(
        settings.lightIconColor || settings.lightPrimaryColor,
        "#1d4ed8",
      )
    : primaryColor;

  return {
    isLight,
    primaryColor,
    secondaryColor,
    accentColor,
    backgroundColor,
    surfaceColor,
    textColor,
    mutedTextColor,
    borderColor,
    iconColor,
  };
}

export function Badge({ settings = {}, children, themeMode = "dark" }) {
  const theme = getThemeColors(settings, themeMode);

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold"
      style={{
        borderColor: hexToRgba(theme.primaryColor, theme.isLight ? 0.22 : 0.28),
        backgroundColor: hexToRgba(
          theme.primaryColor,
          theme.isLight ? 0.1 : 0.08,
        ),
        color: theme.primaryColor,
      }}
    >
      <Sparkles className="h-4 w-4 shrink-0" />
      <span>{children}</span>
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
  const theme = getThemeColors(settings, themeMode);
  const Icon = service?.icon;

  const normalBackground = theme.isLight
    ? hexToRgba(theme.surfaceColor, 0.94)
    : "rgba(255,255,255,0.04)";

  const hoverBackground = theme.isLight
    ? "#ffffff"
    : "rgba(255,255,255,0.07)";

  const normalBorder = theme.borderColor;
  const hoverBorder = hexToRgba(
    theme.primaryColor,
    theme.isLight ? 0.25 : 0.22,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ delay: index * 0.05, duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="rounded-3xl border p-7 transition-colors duration-200"
      style={{
        borderColor: normalBorder,
        backgroundColor: normalBackground,
        boxShadow: theme.isLight
          ? `0 20px 60px ${hexToRgba(theme.primaryColor, 0.08)}`
          : "none",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.backgroundColor = hoverBackground;
        event.currentTarget.style.borderColor = hoverBorder;
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.backgroundColor = normalBackground;
        event.currentTarget.style.borderColor = normalBorder;
      }}
    >
      <div
        className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: hexToRgba(
            theme.iconColor,
            theme.isLight ? 0.12 : 0.08,
          ),
          color: theme.iconColor,
        }}
      >
        {Icon ? <Icon className="h-7 w-7" /> : <Sparkles className="h-7 w-7" />}
      </div>

      <h3 className="text-xl font-black" style={{ color: theme.textColor }}>
        {service?.title || "Service"}
      </h3>

      <p className="mt-4 leading-7" style={{ color: theme.mutedTextColor }}>
        {service?.text || ""}
      </p>
    </motion.div>
  );
}