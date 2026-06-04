// client/src/components/LogoMark.jsx

import React, { useEffect, useMemo, useState } from "react";
import { mediaUrl } from "../lib/api.js";

export default function LogoMark({
  settings = {},
  size = "md",
  variant = "default",
  themeMode = "dark",
  logoField = "",
  className = "",
}) {
  const [imageFailed, setImageFailed] = useState(false);

  const isLight = themeMode === "light";

  const selectedLogo = useMemo(() => {
    const explicitLogo = logoField ? settings?.[logoField] : "";

    if (explicitLogo) {
      return explicitLogo;
    }

    if (isLight) {
      return settings?.lightLogo || settings?.logo || "";
    }

    return settings?.logo || "";
  }, [settings, logoField, isLight]);

  const logoUrl = useMemo(() => mediaUrl(selectedLogo), [selectedLogo]);

  useEffect(() => {
    setImageFailed(false);
  }, [logoUrl, themeMode, logoField]);

  const imgClass =
    size === "lg"
      ? "h-20 w-auto max-w-[240px]"
      : variant === "navbar"
        ? "h-10 w-auto max-w-[150px] sm:h-11"
        : size === "sm"
          ? "h-9 w-auto max-w-[120px]"
          : "h-12 w-auto max-w-[160px]";

  const fallbackClass =
    size === "lg"
      ? "h-16 min-w-28 px-5 text-2xl"
      : size === "sm"
        ? "h-9 min-w-16 px-3 text-base"
        : "h-11 min-w-20 px-4 text-lg";

  const siteName = settings?.siteName || "OBM";

  const primaryColor = isLight
    ? settings?.lightPrimaryColor || settings?.primaryColor || "#2563eb"
    : settings?.primaryColor || "#22d3ee";

  const secondaryColor = isLight
    ? settings?.lightSecondaryColor || settings?.secondaryColor || "#7c3aed"
    : settings?.secondaryColor || "#2563eb";

  if (logoUrl && !imageFailed) {
    return (
      <img
        key={`${themeMode}-${logoField || "auto"}-${logoUrl}`}
        src={logoUrl}
        alt={`${siteName} logo`}
        className={`${imgClass} object-contain ${className}`}
        loading="eager"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div
      className={`${fallbackClass} flex items-center justify-center rounded-2xl shadow-lg ${className}`}
      style={{
        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
        boxShadow: `0 18px 40px ${primaryColor}33`,
      }}
    >
      <span className="font-black text-white">
        {String(siteName || "OBM").slice(0, 3).toUpperCase()}
      </span>
    </div>
  );
}