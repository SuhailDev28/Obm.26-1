import React, { useEffect, useState } from "react";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import HomePage from "./pages/HomePage.jsx";
import { defaultSettings, TOKEN_KEY } from "./config/siteData.js";
import { fetchSettings } from "./lib/api.js";
import { useRoute } from "./hooks/useRoute.js";

const THEME_KEY = "obm_theme_mode";

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return "dark";
}

export default function App() {
  const { route, navigate } = useRoute();

  const [settings, setSettings] = useState(defaultSettings);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [loading, setLoading] = useState(true);
  const [themeMode, setThemeMode] = useState(getInitialTheme);

  useEffect(() => {
    let active = true;

    fetchSettings()
      .then((nextSettings) => {
        if (!active) return;

        setSettings({
          ...defaultSettings,
          ...(nextSettings || {}),
        });
      })
      .catch((error) => {
        console.error("Failed to load settings", error);

        if (active) {
          setSettings(defaultSettings);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--obm-primary",
      settings.primaryColor || defaultSettings.primaryColor,
    );

    document.documentElement.style.setProperty(
      "--obm-secondary",
      settings.secondaryColor || defaultSettings.secondaryColor,
    );

    document.documentElement.style.setProperty(
      "--obm-accent",
      settings.accentColor || defaultSettings.accentColor,
    );
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, themeMode);

    document.documentElement.classList.toggle("obm-light", themeMode === "light");
    document.documentElement.classList.toggle("obm-dark", themeMode === "dark");
    document.documentElement.dataset.theme = themeMode;
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((current) => (current === "dark" ? "light" : "dark"));
  };

  const handleLogin = (nextToken) => {
    setToken(nextToken || localStorage.getItem(TOKEN_KEY) || "");
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    navigate("/admin");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-5 text-sm font-semibold text-slate-300">
          Loading OBM website...
        </div>
      </main>
    );
  }

  if (route === "admin") {
    if (!token) {
      return (
        <AdminLogin
          settings={settings}
          themeMode={themeMode}
          toggleTheme={toggleTheme}
          onLogin={handleLogin}
          navigate={navigate}
        />
      );
    }

    return (
      <AdminDashboard
        settings={settings}
        setSettings={setSettings}
        themeMode={themeMode}
        toggleTheme={toggleTheme}
        navigate={navigate}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <HomePage
      settings={settings}
      themeMode={themeMode}
      toggleTheme={toggleTheme}
      navigate={navigate}
    />
  );
}