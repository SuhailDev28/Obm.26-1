import { defaultSettings, TOKEN_KEY } from "../config/siteData.js";

export const API_BASE = String(
  import.meta.env.VITE_API_BASE || "http://localhost:5001/api",
).replace(/\/+$/, "");

export const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

export function mediaUrl(value) {
  if (!value) return "";
  if (String(value).startsWith("http") || String(value).startsWith("data:")) {
    return value;
  }

  return `${API_ORIGIN}${value}`;
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

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function fetchSettings() {
  const data = await apiRequest("/settings");
  return { ...defaultSettings, ...(data.settings || {}) };
}

export async function saveSettingsToApi(settings) {
  const data = await apiRequest("/admin/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });

  return { ...defaultSettings, ...(data.settings || {}) };
}

export async function resetSettingsOnApi() {
  const data = await apiRequest("/admin/reset-settings", { method: "POST" });
  return { ...defaultSettings, ...(data.settings || {}) };
}

export async function uploadLogoToApi(file) {
  const formData = new FormData();
  formData.append("logo", file);

  const data = await apiRequest("/admin/upload-logo", {
    method: "POST",
    body: formData,
  });

  return { ...defaultSettings, ...(data.settings || {}) };
}

export async function loginAdmin(email, password) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem(TOKEN_KEY, data.token);
  return data;
}
