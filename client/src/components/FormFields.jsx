// client/src/components/FormFields.jsx

import React from "react";

const fallbackSettings = {
  primaryColor: "#22d3ee",
  lightPrimaryColor: "#2563eb",
  lightSurfaceColor: "#ffffff",
  lightTextColor: "#0f172a",
  lightMutedTextColor: "#475569",
  lightBorderColor: "#e2e8f0",
};

function getTheme(settings = {}, isLight = false) {
  const primaryColor = isLight
    ? settings?.lightPrimaryColor || settings?.primaryColor || fallbackSettings.lightPrimaryColor
    : settings?.primaryColor || fallbackSettings.primaryColor;

  return {
    primaryColor,
    labelColor: isLight ? "#334155" : "#cbd5e1",
    inputBg: isLight
      ? settings?.lightSurfaceColor || fallbackSettings.lightSurfaceColor
      : "#020617",
    inputText: isLight
      ? settings?.lightTextColor || fallbackSettings.lightTextColor
      : "#ffffff",
    placeholder: isLight ? "#94a3b8" : "#475569",
    border: isLight
      ? settings?.lightBorderColor || fallbackSettings.lightBorderColor
      : "rgba(255,255,255,0.1)",
    panelBg: isLight ? "#f8fafc" : "#020617",
    colorTextBg: isLight ? "#ffffff" : "#0f172a",
  };
}

function inputFocusHandlers(theme) {
  return {
    onFocus: (event) => {
      event.currentTarget.style.borderColor = theme.primaryColor;
      event.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primaryColor}22`;
    },
    onBlur: (event) => {
      event.currentTarget.style.borderColor = theme.border;
      event.currentTarget.style.boxShadow = "none";
    },
  };
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  settings = fallbackSettings,
  isLight = false,
  disabled = false,
}) {
  const theme = getTheme(settings, isLight);

  return (
    <label className="block">
      <span
        className="mb-2 block text-sm font-semibold"
        style={{ color: theme.labelColor }}
      >
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-2xl border px-4 py-3 outline-none transition disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          borderColor: theme.border,
          backgroundColor: theme.inputBg,
          color: theme.inputText,
          "--tw-placeholder-opacity": 1,
        }}
        onFocus={inputFocusHandlers(theme).onFocus}
        onBlur={inputFocusHandlers(theme).onBlur}
      />
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  settings = fallbackSettings,
  isLight = false,
  disabled = false,
}) {
  const theme = getTheme(settings, isLight);

  return (
    <label className="block">
      <span
        className="mb-2 block text-sm font-semibold"
        style={{ color: theme.labelColor }}
      >
        {label}
      </span>

      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full resize-y rounded-2xl border px-4 py-3 outline-none transition disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          borderColor: theme.border,
          backgroundColor: theme.inputBg,
          color: theme.inputText,
        }}
        onFocus={inputFocusHandlers(theme).onFocus}
        onBlur={inputFocusHandlers(theme).onBlur}
      />
    </label>
  );
}

export function ColorField({
  label,
  value,
  onChange,
  settings = fallbackSettings,
  isLight = false,
  disabled = false,
}) {
  const theme = getTheme(settings, isLight);

  return (
    <label
      className="block rounded-3xl border p-4"
      style={{
        borderColor: theme.border,
        backgroundColor: theme.panelBg,
      }}
    >
      <span
        className="mb-3 block text-sm font-semibold"
        style={{ color: theme.labelColor }}
      >
        {label}
      </span>

      <div className="flex items-center gap-4">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className="h-12 w-16 cursor-pointer rounded-2xl border bg-transparent disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            borderColor: theme.border,
          }}
        />

        <input
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className="min-w-0 flex-1 rounded-2xl border px-4 py-3 font-mono text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            borderColor: theme.border,
            backgroundColor: theme.colorTextBg,
            color: theme.inputText,
          }}
          onFocus={inputFocusHandlers(theme).onFocus}
          onBlur={inputFocusHandlers(theme).onBlur}
        />
      </div>
    </label>
  );
}