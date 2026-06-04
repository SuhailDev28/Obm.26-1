// client/src/lib/api.js

import { defaultSettings, TOKEN_KEY } from "../config/siteData.js";

export const API_BASE = String(
  import.meta.env.VITE_API_BASE || "http://localhost:5001/api",
).replace(/\/+$/, "");

export const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

export function mediaUrl(value) {
  const raw = String(value || "").trim();

  if (!raw) return "";

  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("data:") ||
    raw.startsWith("blob:")
  ) {
    return raw;
  }

  if (raw.startsWith("/")) {
    return `${API_ORIGIN}${raw}`;
  }

  return `${API_ORIGIN}/${raw}`;
}

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = { ...(options.headers || {}) };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function fetchSettings() {
  const data = await apiRequest("/settings");

  return {
    ...defaultSettings,
    ...(data.settings || {}),
  };
}

export async function saveSettingsToApi(settings) {
  const data = await apiRequest("/admin/settings", {
    method: "PUT",
    body: JSON.stringify(settings || {}),
  });

  return {
    ...defaultSettings,
    ...(data.settings || {}),
  };
}

export async function resetSettingsOnApi() {
  const data = await apiRequest("/admin/reset-settings", {
    method: "POST",
  });

  return {
    ...defaultSettings,
    ...(data.settings || {}),
  };
}

export async function uploadLogoToApi(file, logoField = "logo") {
  const formData = new FormData();

  const safeLogoField = logoField === "lightLogo" ? "lightLogo" : "logo";

  formData.append("logo", file);
  formData.append("logoField", safeLogoField);

  const data = await apiRequest("/admin/upload-logo", {
    method: "POST",
    body: formData,
  });

  return {
    ...defaultSettings,
    ...(data.settings || {}),
  };
}

export async function loginAdmin(email, password) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  localStorage.setItem(TOKEN_KEY, data.token);

  return data;
}

export function logoutAdmin() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAdminLoggedIn() {
  return Boolean(getAdminToken());
}