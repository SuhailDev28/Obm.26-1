import React from "react";

const fallbackSettings = {
  primaryColor: "#22d3ee",
};

function getPrimary(settings) {
  return settings?.primaryColor || fallbackSettings.primaryColor;
}

function inputFocusHandlers(primaryColor) {
  return {
    onFocus: (event) => {
      event.currentTarget.style.borderColor = primaryColor;
      event.currentTarget.style.boxShadow = `0 0 0 2px ${primaryColor}22`;
    },
    onBlur: (event) => {
      event.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
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
}) {
  const primaryColor = getPrimary(settings);

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600"
        {...inputFocusHandlers(primaryColor)}
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
}) {
  const primaryColor = getPrimary(settings);

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </span>

      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600"
        {...inputFocusHandlers(primaryColor)}
      />
    </label>
  );
}

export function ColorField({ label, value, onChange, settings = fallbackSettings }) {
  const primaryColor = getPrimary(settings);

  return (
    <label className="block rounded-3xl border border-white/10 bg-slate-950 p-4">
      <span className="mb-3 block text-sm font-semibold text-slate-300">
        {label}
      </span>

      <div className="flex items-center gap-4">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-16 cursor-pointer rounded-2xl border border-white/10 bg-transparent"
        />

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 font-mono text-sm text-white outline-none transition"
          {...inputFocusHandlers(primaryColor)}
        />
      </div>
    </label>
  );
}