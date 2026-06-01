import React from "react";
import { mediaUrl } from "../lib/api.js";

export default function LogoMark({ settings, size = "md", variant = "default" }) {
  const imgClass =
    size === "lg"
      ? "h-20 w-auto max-w-[240px]"
      : variant === "navbar"
        ? "h-11 w-auto max-w-[150px]"
        : "h-12 w-auto max-w-[160px]";

  const fallbackClass =
    size === "lg"
      ? "h-16 min-w-28 px-5 text-2xl"
      : "h-11 min-w-20 px-4 text-lg";

  if (settings.logo) {
    return (
      <img
        src={mediaUrl(settings.logo)}
        alt={`${settings.siteName} logo`}
        className={`${imgClass} object-contain`}
      />
    );
  }

  return (
    <div
      className={`${fallbackClass} flex items-center justify-center rounded-2xl shadow-lg`}
      style={{
        background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
        boxShadow: `0 18px 40px ${settings.primaryColor}33`,
      }}
    >
      <span className="font-black text-white">OBM</span>
    </div>
  );
}
