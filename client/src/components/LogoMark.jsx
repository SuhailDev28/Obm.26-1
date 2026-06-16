// client/src/components/LogoMark.jsx

import React, { useEffect, useMemo, useState } from "react";
import { mediaUrl } from "../lib/api.js";

const FALLBACK_DARK_LOGO = "/assets/obm-logo-dark.png";
const FALLBACK_LIGHT_LOGO = "/assets/obm-logo-light-blue.png";

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

    if (explicitLogo) return explicitLogo;

    if (isLight) {
      return settings?.lightLogo || settings?.logo || "";
    }

    return settings?.logo || "";
  }, [settings, logoField, isLight]);

  const fallbackLogo = isLight ? FALLBACK_LIGHT_LOGO : FALLBACK_DARK_LOGO;

  const logoUrl = useMemo(() => {
    if (selectedLogo) return mediaUrl(selectedLogo);
    return fallbackLogo;
  }, [selectedLogo, fallbackLogo]);

  useEffect(() => {
    setImageFailed(false);
  }, [logoUrl, themeMode, logoField]);

  const siteName = settings?.siteName || "OBM";

  const imgClass =
    variant === "navbar"
      ? "h-12 w-auto max-w-[210px] object-contain sm:h-14 sm:max-w-[240px]"
      : size === "lg"
        ? "h-24 w-auto max-w-[320px] object-contain"
        : size === "sm"
          ? "h-10 w-auto max-w-[150px] object-contain"
          : "h-14 w-auto max-w-[220px] object-contain";

  const textFallbackClass =
    variant === "navbar"
      ? "h-10 min-w-20 px-4 text-base"
      : size === "lg"
        ? "h-16 min-w-28 px-5 text-2xl"
        : size === "sm"
          ? "h-9 min-w-16 px-3 text-base"
          : "h-11 min-w-20 px-4 text-lg";

  if (!imageFailed) {
    return (
      <img
        key={`${themeMode}-${logoField || "auto"}-${logoUrl}`}
        src={logoUrl}
        alt={`${siteName} logo`}
        className={`${imgClass} ${className}`}
        loading="eager"
        decoding="async"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div
      className={`${textFallbackClass} flex items-center justify-center rounded-2xl bg-white text-black shadow-lg ${className}`}
    >
      <span className="font-black tracking-tight">
        {String(siteName || "OBM")
          .slice(0, 3)
          .toUpperCase()}
      </span>
    </div>
  );
}
