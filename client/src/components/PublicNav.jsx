import React, { useEffect, useState } from "react";
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

export default function PublicNav({
  settings,
  navigate,
  themeMode = "dark",
  toggleTheme,
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isLight = themeMode === "light";

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

  const closeMenu = () => setOpen(false);

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

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          isLight
            ? scrolled
              ? "border-slate-200 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-2xl"
              : "border-slate-200 bg-white/75 backdrop-blur-xl"
            : scrolled
              ? "border-white/10 bg-slate-950/88 shadow-2xl shadow-black/20 backdrop-blur-2xl"
              : "border-white/5 bg-slate-950/70 backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-5 lg:py-4">
          <button
            onClick={() => {
              closeMenu();
              navigate("/");
            }}
            className="group flex min-w-0 items-center gap-3 text-left sm:gap-4"
            aria-label="Go to home"
          >
            <div className="shrink-0 transition duration-300 group-hover:scale-105">
              <LogoMark settings={settings} variant="navbar" />
            </div>

            <div className="hidden min-w-0 sm:block">
              <p
                className={`truncate text-base font-black leading-none sm:text-lg ${
                  isLight ? "text-slate-950" : "text-white"
                }`}
              >
                {settings.siteName}
              </p>
              <p
                className={`mt-1 max-w-[220px] truncate text-xs lg:max-w-none ${
                  isLight ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {settings.tagline}
              </p>
            </div>
          </button>

          <nav
            className={`hidden items-center gap-1 rounded-full border px-2 py-2 lg:flex ${
              isLight
                ? "border-slate-200 bg-slate-950/[0.03]"
                : "border-white/10 bg-white/[0.035]"
            }`}
          >
            {navLinks.map((item) => (
              <a key={item.label} href={item.href} className={desktopLinkClass}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${iconButtonClass}`}
              aria-label="Toggle dark and light mode"
              title={isLight ? "Switch to dark mode" : "Switch to light mode"}
            >
              {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            <button
              onClick={() => navigate("/admin")}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                isLight
                  ? "border-slate-200 bg-white text-slate-950 hover:bg-slate-100"
                  : "border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </button>

            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-black text-slate-950 shadow-lg transition hover:-translate-y-0.5"
              style={{
                backgroundColor: settings.primaryColor,
                boxShadow: `0 16px 40px ${settings.primaryColor}24`,
              }}
            >
              Book Consultation
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition ${iconButtonClass}`}
              aria-label="Toggle dark and light mode"
              title={isLight ? "Switch to dark mode" : "Switch to light mode"}
            >
              {isLight ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setOpen((value) => !value)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition ${iconButtonClass}`}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className={`fixed inset-0 z-40 backdrop-blur-xl md:hidden ${
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
              className={`mx-4 mt-24 overflow-hidden rounded-[2rem] border p-5 shadow-2xl ${
                isLight
                  ? "border-slate-200 bg-white"
                  : "border-white/10 bg-slate-950"
              }`}
            >
              <div
                className="absolute left-6 top-28 h-40 w-40 rounded-full blur-3xl"
                style={{ backgroundColor: `${settings.primaryColor}18` }}
              />

              <div className="relative">
                <div
                  className={`mb-5 flex items-center gap-3 border-b pb-5 ${
                    isLight ? "border-slate-200" : "border-white/10"
                  }`}
                >
                  <LogoMark settings={settings} variant="navbar" />
                  <div className="min-w-0">
                    <p
                      className={`truncate text-lg font-black ${
                        isLight ? "text-slate-950" : "text-white"
                      }`}
                    >
                      {settings.siteName}
                    </p>
                    <p
                      className={`truncate text-xs ${
                        isLight ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {settings.tagline}
                    </p>
                  </div>
                </div>

                <nav className="grid gap-3">
                  {navLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={closeMenu}
                      className={mobileLinkClass}
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="h-4 w-4 text-slate-500" />
                    </a>
                  ))}
                </nav>

                <div className="mt-5 grid gap-3">
                  <a
                    href="#contact"
                    onClick={closeMenu}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black text-slate-950"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    <PhoneCall className="h-4 w-4" />
                    Book Consultation
                  </a>

                  <button
                    onClick={() => {
                      closeMenu();
                      navigate("/admin");
                    }}
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