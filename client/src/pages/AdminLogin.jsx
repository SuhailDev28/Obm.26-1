import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { loginAdmin } from "../lib/api.js";
import { TOKEN_KEY } from "../config/siteData.js";

const fallbackSettings = {
  primaryColor: "#22d3ee",
  secondaryColor: "#2563eb",
  accentColor: "#a855f7",
};

function hexToRgba(hex, opacity = 1) {
  const cleanHex = String(hex || "").replace("#", "");

  if (cleanHex.length !== 6) {
    return `rgba(34, 211, 238, ${opacity})`;
  }

  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default function AdminLogin({ settings = fallbackSettings, onLogin, navigate }) {
  const theme = {
    ...fallbackSettings,
    ...(settings || {}),
  };

  const primary = theme.primaryColor;
  const secondary = theme.secondaryColor;
  const accent = theme.accentColor;

  const [email, setEmail] = useState("admin@obm.qa");
  const [password, setPassword] = useState("Admin@12345");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: Math.random() * 3,
        duration: 4 + Math.random() * 4,
      })),
    [],
  );

  const submit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await loginAdmin(email.trim(), password);
      onLogin(localStorage.getItem(TOKEN_KEY));
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-5 py-10 text-white">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.6, 0.35],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full blur-3xl"
          style={{
            backgroundColor: hexToRgba(primary, 0.2),
          }}
        />

        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full blur-3xl"
          style={{
            backgroundColor: hexToRgba(secondary, 0.22),
          }}
        />

        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            opacity: [0.18, 0.35, 0.18],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl"
          style={{
            backgroundColor: hexToRgba(accent, 0.2),
          }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />

        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              left: particle.left,
              top: particle.top,
              backgroundColor: hexToRgba(primary, 0.8),
              boxShadow: `0 0 18px ${hexToRgba(primary, 0.8)}`,
            }}
            animate={{
              y: [0, -24, 0],
              opacity: [0.15, 0.9, 0.15],
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

      <div className="relative mx-auto flex min-h-[82vh] max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_460px]">
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="hidden lg:block"
          >
            <div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold"
              style={{
                borderColor: hexToRgba(primary, 0.25),
                backgroundColor: hexToRgba(primary, 0.1),
                color: primary,
              }}
            >
              <Sparkles className="h-4 w-4" />
              OBM Secure Control Center
            </div>

            <h1 className="mt-7 max-w-2xl text-5xl font-black leading-tight tracking-tight xl:text-6xl">
              Manage your digital brand from one powerful dashboard.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Update logo, colors, hero content, contact details, and website settings instantly
              through a secure admin panel connected to your backend database.
            </p>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              {[
                ["Brand", "Logo & identity"],
                ["Theme", "Color control"],
                ["Content", "Live updates"],
              ].map(([title, text], index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
                >
                  <p className="text-xl font-black text-white">{title}</p>
                  <p className="mt-2 text-sm text-slate-400">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="relative w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-2xl"
            style={{
              boxShadow: `0 28px 90px ${hexToRgba(primary, 0.16)}`,
            }}
          >
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, transparent, ${hexToRgba(primary, 0.75)}, transparent)`,
              }}
            />

            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -right-20 -top-20 h-40 w-40 rounded-full border"
              style={{
                borderColor: hexToRgba(primary, 0.25),
              }}
            />

            <div className="relative mb-7 text-center">
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
                className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl text-slate-950"
                style={{
                  backgroundColor: primary,
                }}
              >
                <ShieldCheck className="h-10 w-10" />
              </motion.div>

              <h2 className="text-3xl font-black">OBM Admin Login</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Secure access for website settings, logo and brand controls.
              </p>
            </div>

            <div className="relative space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-300">
                  Email
                </span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-12 py-4 text-white outline-none transition placeholder:text-slate-600 focus:ring-2"
                    style={{
                      "--tw-ring-color": hexToRgba(primary, 0.24),
                    }}
                    onFocus={(event) => {
                      event.currentTarget.style.borderColor = primary;
                    }}
                    onBlur={(event) => {
                      event.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    }}
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-300">
                  Password
                </span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-12 py-4 pr-14 text-white outline-none transition placeholder:text-slate-600 focus:ring-2"
                    style={{
                      "--tw-ring-color": hexToRgba(primary, 0.24),
                    }}
                    onFocus={(event) => {
                      event.currentTarget.style.borderColor = primary;
                    }}
                    onBlur={(event) => {
                      event.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
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
                className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-200"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-black text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                backgroundColor: primary,
              }}
            >
              {loading ? "Signing in..." : "Login to Dashboard"}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </motion.button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Back to Website
            </button>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
              <p className="text-center text-xs leading-5 text-slate-500">
                Default credentials come from server .env. Change{" "}
                <span className="font-semibold text-slate-300">ADMIN_EMAIL</span> and{" "}
                <span className="font-semibold text-slate-300">ADMIN_PASSWORD</span> before
                production deployment.
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </main>
  );
}