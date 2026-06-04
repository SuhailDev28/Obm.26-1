// client/src/pages/AdminLogin.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Palette,
  LayoutDashboard,
  Globe2,
} from "lucide-react";

import { loginAdmin } from "../lib/api.js";
import { TOKEN_KEY } from "../config/siteData.js";

const fallbackSettings = {
  siteName: "OBM",
  tagline: "Creative Digital Solutions",
  logo: "",
  primaryColor: "#22d3ee",
  secondaryColor: "#2563eb",
  accentColor: "#a855f7",
  themeMode: "dark",
};

function normalizeHex(hex, fallback = "#22d3ee") {
  const value = String(hex || "").trim();

  if (/^#[0-9a-fA-F]{6}$/.test(value)) {
    return value;
  }

  return fallback;
}

function hexToRgba(hex, opacity = 1) {
  const cleanHex = normalizeHex(hex).replace("#", "");

  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function getInitialThemeMode(settingsThemeMode) {
  const explicitMode = String(settingsThemeMode || "").toLowerCase();

  if (explicitMode === "light" || explicitMode === "dark") {
    return explicitMode;
  }

  if (typeof document !== "undefined") {
    const html = document.documentElement;

    if (
      html.classList.contains("light") ||
      html.classList.contains("obm-light") ||
      html.dataset.theme === "light"
    ) {
      return "light";
    }

    if (
      html.classList.contains("dark") ||
      html.classList.contains("obm-dark") ||
      html.dataset.theme === "dark"
    ) {
      return "dark";
    }
  }

  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: light)")?.matches
  ) {
    return "light";
  }

  return "dark";
}

function getLogoSrc(settings = {}) {
  return (
    settings.logoUrl ||
    settings.logo ||
    settings.siteLogo ||
    settings.brandLogo ||
    settings.headerLogo ||
    ""
  );
}

export default function AdminLogin({
  settings = fallbackSettings,
  onLogin,
  navigate,
}) {
  const theme = useMemo(
    () => ({
      ...fallbackSettings,
      ...(settings || {}),
      primaryColor: normalizeHex(settings?.primaryColor, fallbackSettings.primaryColor),
      secondaryColor: normalizeHex(
        settings?.secondaryColor,
        fallbackSettings.secondaryColor,
      ),
      accentColor: normalizeHex(settings?.accentColor, fallbackSettings.accentColor),
    }),
    [settings],
  );

  const [mode, setMode] = useState(() => getInitialThemeMode(theme.themeMode));
  const [logoFailed, setLogoFailed] = useState(false);

  const primary = theme.primaryColor;
  const secondary = theme.secondaryColor;
  const accent = theme.accentColor;
  const siteName = theme.siteName || "OBM";
  const tagline = theme.tagline || "Creative Digital Solutions";
  const logoSrc = getLogoSrc(theme);

  const isLight = mode === "light";

  const pageStyles = {
    "--obm-primary": primary,
    "--obm-secondary": secondary,
    "--obm-accent": accent,
    "--obm-primary-soft": hexToRgba(primary, isLight ? 0.13 : 0.2),
    "--obm-secondary-soft": hexToRgba(secondary, isLight ? 0.12 : 0.22),
    "--obm-accent-soft": hexToRgba(accent, isLight ? 0.11 : 0.2),
    "--obm-primary-ring": hexToRgba(primary, 0.28),
  };

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: Math.random() * 3,
        duration: 4 + Math.random() * 4,
      })),
    [],
  );

  useEffect(() => {
    setMode(getInitialThemeMode(theme.themeMode));
  }, [theme.themeMode]);

  useEffect(() => {
    setLogoFailed(false);
  }, [logoSrc]);

  const [email, setEmail] = useState("admin@obm.qa");
  const [password, setPassword] = useState("Admin@12345");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await loginAdmin(email.trim(), password);

      const token = localStorage.getItem(TOKEN_KEY);

      if (typeof onLogin === "function") {
        onLogin(token);
      }
    } catch (err) {
      setError(err?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToWebsite = () => {
    if (typeof navigate === "function") {
      navigate("/");
      return;
    }

    window.location.href = "/";
  };

  return (
    <main
      className={[
        "relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8",
        isLight
          ? "bg-slate-50 text-slate-950"
          : "bg-slate-950 text-white",
      ].join(" ")}
      style={pageStyles}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.18, 1],
            opacity: isLight ? [0.55, 0.85, 0.55] : [0.3, 0.55, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-40 -top-40 h-[26rem] w-[26rem] rounded-full blur-3xl"
          style={{
            backgroundColor: "var(--obm-primary-soft)",
          }}
        />

        <motion.div
          animate={{
            scale: [1.12, 1, 1.12],
            opacity: isLight ? [0.45, 0.75, 0.45] : [0.25, 0.48, 0.25],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-44 -right-40 h-[28rem] w-[28rem] rounded-full blur-3xl"
          style={{
            backgroundColor: "var(--obm-secondary-soft)",
          }}
        />

        <motion.div
          animate={{
            x: [0, 36, 0],
            y: [0, -28, 0],
            opacity: isLight ? [0.35, 0.65, 0.35] : [0.16, 0.34, 0.16],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl"
          style={{
            backgroundColor: "var(--obm-accent-soft)",
          }}
        />

        <div
          className={[
            "absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.16)_1px,transparent_1px)] bg-[size:56px_56px]",
            isLight ? "opacity-40" : "opacity-20",
          ].join(" ")}
        />

        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              left: particle.left,
              top: particle.top,
              backgroundColor: hexToRgba(primary, isLight ? 0.75 : 0.9),
              boxShadow: `0 0 18px ${hexToRgba(primary, 0.75)}`,
            }}
            animate={{
              y: [0, -24, 0],
              opacity: isLight ? [0.18, 0.7, 0.18] : [0.15, 0.9, 0.15],
              scale: [1, 1.6, 1],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl items-center justify-center">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] xl:gap-12">
          <motion.section
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="hidden lg:block"
          >
            <div
              className={[
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold shadow-sm backdrop-blur-xl",
                isLight
                  ? "border-slate-200 bg-white/70"
                  : "border-white/10 bg-white/[0.05]",
              ].join(" ")}
              style={{
                color: primary,
              }}
            >
              <Sparkles className="h-4 w-4" />
              Secure Brand Control Center
            </div>

            <h1 className="mt-7 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">
              Manage your website, brand, and digital content from one dashboard.
            </h1>

            <p
              className={[
                "mt-6 max-w-2xl text-lg leading-8",
                isLight ? "text-slate-600" : "text-slate-300",
              ].join(" ")}
            >
              Update logo, colors, hero sections, contact details, social links,
              and website settings instantly through a secure admin interface.
            </p>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-4">
              {[
                {
                  title: "Brand",
                  text: "Logo & identity",
                  icon: Palette,
                  color: primary,
                },
                {
                  title: "Theme",
                  text: "Dark & light colors",
                  icon: Sparkles,
                  color: secondary,
                },
                {
                  title: "Content",
                  text: "Live website updates",
                  icon: LayoutDashboard,
                  color: accent,
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className={[
                      "rounded-3xl border p-5 shadow-sm backdrop-blur-xl",
                      isLight
                        ? "border-slate-200 bg-white/75"
                        : "border-white/10 bg-white/[0.045]",
                    ].join(" ")}
                  >
                    <div
                      className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl"
                      style={{
                        backgroundColor: hexToRgba(item.color, isLight ? 0.14 : 0.16),
                        color: item.color,
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <p className="text-xl font-black">{item.title}</p>
                    <p
                      className={[
                        "mt-2 text-sm",
                        isLight ? "text-slate-500" : "text-slate-400",
                      ].join(" ")}
                    >
                      {item.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 35, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="mx-auto w-full max-w-[31rem]"
          >
            <form
              onSubmit={submit}
              className={[
                "relative overflow-hidden rounded-[2rem] border p-5 shadow-2xl backdrop-blur-2xl sm:p-7",
                isLight
                  ? "border-slate-200 bg-white/85 shadow-slate-200/70"
                  : "border-white/10 bg-white/[0.065]",
              ].join(" ")}
              style={{
                boxShadow: isLight
                  ? `0 28px 90px ${hexToRgba(primary, 0.14)}`
                  : `0 28px 90px ${hexToRgba(primary, 0.16)}`,
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  backgroundImage: `linear-gradient(to right, transparent, ${hexToRgba(
                    primary,
                    0.8,
                  )}, transparent)`,
                }}
              />

              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -right-20 -top-20 h-44 w-44 rounded-full border"
                style={{
                  borderColor: hexToRgba(primary, isLight ? 0.18 : 0.25),
                }}
              />

              <div className="relative mb-7 text-center">
                <div className="mx-auto mb-5 flex justify-center">
                  {logoSrc && !logoFailed ? (
                    <motion.div
                      animate={{
                        y: [0, -5, 0],
                        boxShadow: [
                          `0 0 0 ${hexToRgba(primary, 0)}`,
                          `0 0 42px ${hexToRgba(primary, 0.28)}`,
                          `0 0 0 ${hexToRgba(primary, 0)}`,
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className={[
                        "flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border p-3",
                        isLight
                          ? "border-slate-200 bg-white"
                          : "border-white/10 bg-slate-950/60",
                      ].join(" ")}
                    >
                      <img
                        src={logoSrc}
                        alt={`${siteName} logo`}
                        className="h-full w-full object-contain"
                        onError={() => setLogoFailed(true)}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{
                        y: [0, -6, 0],
                        boxShadow: [
                          `0 0 0 ${hexToRgba(primary, 0)}`,
                          `0 0 42px ${hexToRgba(primary, 0.35)}`,
                          `0 0 0 ${hexToRgba(primary, 0)}`,
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="flex h-20 w-20 items-center justify-center rounded-3xl text-slate-950"
                      style={{
                        backgroundColor: primary,
                      }}
                    >
                      <ShieldCheck className="h-10 w-10" />
                    </motion.div>
                  )}
                </div>

                <div
                  className={[
                    "mx-auto mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold lg:hidden",
                    isLight
                      ? "border-slate-200 bg-slate-50"
                      : "border-white/10 bg-white/[0.05]",
                  ].join(" ")}
                  style={{
                    color: primary,
                  }}
                >
                  <Globe2 className="h-3.5 w-3.5" />
                  Secure Admin Access
                </div>

                <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                  {siteName} Admin Login
                </h2>

                <p
                  className={[
                    "mx-auto mt-2 max-w-sm text-sm leading-6",
                    isLight ? "text-slate-500" : "text-slate-400",
                  ].join(" ")}
                >
                  {tagline}. Sign in to manage website settings, logo, colors,
                  and content.
                </p>
              </div>

              <div className="relative space-y-4">
                <label className="block">
                  <span
                    className={[
                      "mb-2 block text-sm font-bold",
                      isLight ? "text-slate-700" : "text-slate-300",
                    ].join(" ")}
                  >
                    Email
                  </span>

                  <div className="relative">
                    <Mail
                      className={[
                        "pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2",
                        isLight ? "text-slate-400" : "text-slate-500",
                      ].join(" ")}
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      className={[
                        "w-full rounded-2xl border px-12 py-4 outline-none transition placeholder:text-slate-400 focus:ring-4",
                        isLight
                          ? "border-slate-200 bg-white text-slate-950"
                          : "border-white/10 bg-slate-950/80 text-white",
                      ].join(" ")}
                      style={{
                        "--tw-ring-color": "var(--obm-primary-ring)",
                      }}
                      onFocus={(event) => {
                        event.currentTarget.style.borderColor = primary;
                      }}
                      onBlur={(event) => {
                        event.currentTarget.style.borderColor = isLight
                          ? "rgb(226 232 240)"
                          : "rgba(255,255,255,0.1)";
                      }}
                      required
                    />
                  </div>
                </label>

                <label className="block">
                  <span
                    className={[
                      "mb-2 block text-sm font-bold",
                      isLight ? "text-slate-700" : "text-slate-300",
                    ].join(" ")}
                  >
                    Password
                  </span>

                  <div className="relative">
                    <Lock
                      className={[
                        "pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2",
                        isLight ? "text-slate-400" : "text-slate-500",
                      ].join(" ")}
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      className={[
                        "w-full rounded-2xl border px-12 py-4 pr-14 outline-none transition placeholder:text-slate-400 focus:ring-4",
                        isLight
                          ? "border-slate-200 bg-white text-slate-950"
                          : "border-white/10 bg-slate-950/80 text-white",
                      ].join(" ")}
                      style={{
                        "--tw-ring-color": "var(--obm-primary-ring)",
                      }}
                      onFocus={(event) => {
                        event.currentTarget.style.borderColor = primary;
                      }}
                      onBlur={(event) => {
                        event.currentTarget.style.borderColor = isLight
                          ? "rgb(226 232 240)"
                          : "rgba(255,255,255,0.1)";
                      }}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className={[
                        "absolute right-4 top-1/2 -translate-y-1/2 rounded-xl p-1.5 transition",
                        isLight
                          ? "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                          : "text-slate-400 hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </label>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-500 dark:text-red-200"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.015 }}
                whileTap={{ scale: loading ? 1 : 0.985 }}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-black text-slate-950 shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor: primary,
                  boxShadow: `0 16px 36px ${hexToRgba(primary, 0.28)}`,
                }}
              >
                {loading ? "Signing in..." : "Login to Dashboard"}
                {!loading && <ArrowRight className="h-5 w-5" />}
              </motion.button>

              <button
                type="button"
                onClick={handleBackToWebsite}
                className={[
                  "mt-4 inline-flex w-full items-center justify-center rounded-full border px-6 py-3 font-bold transition",
                  isLight
                    ? "border-slate-200 text-slate-700 hover:bg-slate-100"
                    : "border-white/10 text-white hover:bg-white/10",
                ].join(" ")}
              >
                Back to Website
              </button>

            
            </form>
          </motion.section>
        </div>
      </div>
    </main>
  );
}