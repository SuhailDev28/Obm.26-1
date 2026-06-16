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

  const uploadedLogo = useMemo(() => {
    const explicitLogo = logoField ? settings?.[logoField] : "";

    if (explicitLogo) return String(explicitLogo).trim();

    if (isLight) {
      return String(settings?.lightLogo || settings?.logo || "").trim();
    }

    return String(settings?.logo || "").trim();
  }, [settings, logoField, isLight]);

  const fallbackLogo = isLight ? FALLBACK_LIGHT_LOGO : FALLBACK_DARK_LOGO;

  const logoUrl = useMemo(() => {
    if (uploadedLogo) {
      return mediaUrl(uploadedLogo);
    }

    return fallbackLogo;
  }, [uploadedLogo, fallbackLogo]);

  useEffect(() => {
    setImageFailed(false);
  }, [logoUrl, themeMode, logoField]);

  const siteName = settings?.siteName || "OBM";

  const imgClass =
    variant === "navbar"
      ? "h-10 w-auto max-w-[165px] object-contain sm:h-11 sm:max-w-[185px]"
      : size === "lg"
        ? "h-20 w-auto max-w-[280px] object-contain"
        : size === "sm"
          ? "h-9 w-auto max-w-[130px] object-contain"
          : "h-12 w-auto max-w-[180px] object-contain";

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
    <img
      src={fallbackLogo}
      alt={`${siteName} logo`}
      className={`${imgClass} ${className}`}
      loading="eager"
      decoding="async"
    />
  );
}
