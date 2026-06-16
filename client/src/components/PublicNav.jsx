// client/src/components/PublicNav.jsx

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  LayoutDashboard,
  Menu,
  Moon,
  PhoneCall,
  Sun,
  X,
} from "lucide-react";

import LogoMark from "./LogoMark.jsx";

const FALLBACK_SETTINGS = {
  siteName: "OBM",
  tagline: "AI Consultancy & Digital Transformation",
  logo: "",
  lightLogo: "",
  primaryColor: "#22d3ee",
  secondaryColor: "#2563eb",
  lightPrimaryColor: "#2563eb",
  lightSecondaryColor: "#7c3aed",
};

export default function PublicNav({
  settings,
  navigate,
  themeMode = "dark",
  toggleTheme,
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const safeSettings = useMemo(() => {
    const currentSettings = settings || {};

    return {
      ...FALLBACK_SETTINGS,
      ...currentSettings,

      siteName: currentSettings.siteName || FALLBACK_SETTINGS.siteName,
      tagline: currentSettings.tagline || FALLBACK_SETTINGS.tagline,

      // Keep admin upload active.
      // If these values exist from backend/admin settings, LogoMark will use them.
      logo: currentSettings.logo || "",
      lightLogo: currentSettings.lightLogo || "",

      primaryColor:
        currentSettings.primaryColor || FALLBACK_SETTINGS.primaryColor,

      secondaryColor:
        currentSettings.secondaryColor || FALLBACK_SETTINGS.secondaryColor,

      lightPrimaryColor:
        currentSettings.lightPrimaryColor ||
        currentSettings.primaryColor ||
        FALLBACK_SETTINGS.lightPrimaryColor,

      lightSecondaryColor:
        currentSettings.lightSecondaryColor ||
        currentSettings.secondaryColor ||
        FALLBACK_SETTINGS.lightSecondaryColor,
    };
  }, [settings]);

  const isLight = themeMode === "light";

  const ctaColor = isLight
    ? safeSettings.lightPrimaryColor || safeSettings.primaryColor
    : safeSettings.primaryColor;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [themeMode]);

  const closeMenu = () => setOpen(false);

  const goHome = () => {
    closeMenu();

    if (typeof navigate === "function") {
      navigate("/");
      return;
    }

    window.location.href = "/";
  };

  const goAdmin = () => {
    closeMenu();

    if (typeof navigate === "function") {
      navigate("/admin");
      return;
    }

    window.location.href = "/admin";
  };

  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "Packages", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ];

  const desktopLinkClass = isLight
    ? "rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-900/10 hover:text-slate-950"
    : "rounded-full px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white";

  const mobileLinkClass = isLight
    ? "flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base font-bold text-slate-950 transition hover:bg-slate-100"
    : "flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-base font-bold text-white transition hover:bg-white/[0.08]";

  const iconButtonClass = isLight
    ? "border-slate-200 bg-white text-slate-950 hover:bg-slate-100"
    : "border-white/10 bg-white/[0.04] text-white hover:bg-white/10";

  const adminButtonClass = isLight
    ? "border-slate-200 bg-white text-slate-950 hover:bg-slate-100"
    : "border-white/10 bg-white/[0.03] text-white hover:bg-white/10";

  const headerClass = isLight
    ? scrolled
      ? "border-slate-200 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-2xl"
      : "border-slate-200 bg-white/75 backdrop-blur-xl"
    : scrolled
      ? "border-white/10 bg-slate-950/90 shadow-2xl shadow-black/20 backdrop-blur-2xl"
      : "border-white/5 bg-slate-950/70 backdrop-blur-xl";

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${headerClass}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:py-4">
          <button
            type="button"
            onClick={goHome}
            className="group flex min-w-0 flex-1 items-center gap-3 text-left sm:gap-4 md:flex-none"
            aria-label="Go to home"
          >
            <div className="shrink-0 transition duration-300 group-hover:scale-105">
              <LogoMark
                settings={safeSettings}
                variant="navbar"
                themeMode={themeMode}
                className="block"
              />
            </div>

            <div className="min-w-0">
              <p
                className={`max-w-[130px] truncate text-base font-black leading-none sm:max-w-[220px] sm:text-lg lg:max-w-none ${
                  isLight ? "text-slate-950" : "text-white"
                }`}
              >
                {safeSettings.siteName}
              </p>

              <p
                className={`mt-1 hidden max-w-[190px] truncate text-xs sm:block lg:max-w-[260px] xl:max-w-none ${
                  isLight ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {safeSettings.tagline}
              </p>
            </div>
          </button>

          <nav
            className={`hidden items-center gap-1 rounded-full border px-2 py-2 lg:flex ${
              isLight
                ? "border-slate-200 bg-slate-950/[0.03]"
                : "border-white/10 bg-white/[0.035]"
            }`}
            aria-label="Main navigation"
          >
            {navLinks.map((item) => (
              <a key={item.label} href={item.href} className={desktopLinkClass}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${iconButtonClass}`}
              aria-label="Toggle dark and light mode"
              title={isLight ? "Switch to dark mode" : "Switch to light mode"}
            >
              {isLight ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>

            <button
              type="button"
              onClick={goAdmin}
              className={`hidden items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition xl:inline-flex ${adminButtonClass}`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </button>

            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-black text-slate-950 shadow-lg transition hover:-translate-y-0.5 xl:px-5"
              style={{
                backgroundColor: ctaColor,
                boxShadow: `0 16px 40px ${ctaColor}24`,
              }}
            >
              <span className="hidden lg:inline">Book Consultation</span>
              <span className="lg:hidden">Consult</span>
              <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition ${iconButtonClass}`}
              aria-label="Toggle dark and light mode"
              title={isLight ? "Switch to dark mode" : "Switch to light mode"}
            >
              {isLight ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition ${iconButtonClass}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className={`fixed inset-0 z-40 overflow-y-auto px-4 pb-6 pt-24 backdrop-blur-xl md:hidden ${
              isLight ? "bg-white/85" : "bg-slate-950/80"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={`relative mx-auto w-full max-w-md overflow-hidden rounded-[1.75rem] border p-5 shadow-2xl ${
                isLight
                  ? "border-slate-200 bg-white"
                  : "border-white/10 bg-slate-950"
              }`}
            >
              <div
                className="absolute -left-10 -top-10 h-40 w-40 rounded-full blur-3xl"
                style={{ backgroundColor: `${ctaColor}18` }}
              />

              <div className="relative">
                <div
                  className={`mb-5 flex min-w-0 items-center gap-3 border-b pb-5 ${
                    isLight ? "border-slate-200" : "border-white/10"
                  }`}
                >
                  <div className="shrink-0">
                    <LogoMark
                      settings={safeSettings}
                      variant="navbar"
                      themeMode={themeMode}
                      className="block"
                    />
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`truncate text-lg font-black ${
                        isLight ? "text-slate-950" : "text-white"
                      }`}
                    >
                      {safeSettings.siteName}
                    </p>

                    <p
                      className={`truncate text-xs ${
                        isLight ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {safeSettings.tagline}
                    </p>
                  </div>
                </div>

                <nav className="grid gap-3" aria-label="Mobile navigation">
                  {navLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={closeMenu}
                      className={mobileLinkClass}
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-500" />
                    </a>
                  ))}
                </nav>

                <div className="mt-5 grid gap-3">
                  <a
                    href="#contact"
                    onClick={closeMenu}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black text-slate-950"
                    style={{ backgroundColor: ctaColor }}
                  >
                    <PhoneCall className="h-4 w-4" />
                    Book Consultation
                  </a>

                  <button
                    type="button"
                    onClick={goAdmin}
                    className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-4 text-sm font-bold transition ${
                      isLight
                        ? "border-slate-200 text-slate-950 hover:bg-slate-100"
                        : "border-white/10 text-white hover:bg-white/10"
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Admin Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
