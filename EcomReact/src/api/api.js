import axios from "axios";


const BASE = import.meta.env.VITE_BACKEND_URL?.trim();
const FORCE_MOCK =
  import.meta.env.VITE_NO_BACKEND?.toString() === "true" || !BASE;

const api = axios.create({
  baseURL: `${BASE || ""}/api`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const rawToken = localStorage.getItem("access_token");
  const rawAuth = localStorage.getItem("auth");
  let token = null;

  if (rawToken) token = rawToken;
  else if (rawAuth) {
    try {
      const a = JSON.parse(rawAuth);
      token = a?.jwtToken || a?.accessToken || a?.token || null;
    } catch {}
  }
  if (token) {
    if (!/^Bearer\s/i.test(token)) token = `Bearer ${token}`;
    config.headers.Authorization = token;
  }
  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

function seedDefaultUser() {
  
  let username = "user2";
  try {
    const auth = JSON.parse(localStorage.getItem("auth") || "null");
    if (auth?.username) username = auth.username;
  } catch {}
  const u = {
    id: 4,
    username,
    name: username,
    email: "",
    phone: "",
    gender: "",
    avatar: "",
  };
  localStorage.setItem("user", JSON.stringify(u));
  return u;
}


export async function getProfile() {
  
  if (FORCE_MOCK) {
    try {
      const cached = JSON.parse(localStorage.getItem("user") || "null");
      if (cached && typeof cached === "object") return cached;
    } catch {}
    return seedDefaultUser();
  }

  
  try {
    const { data } = await api.get("/profile");
    const normalized = {
      id: data?.id ?? data?.userId ?? 0,
      email: data?.email ?? "",
      username: data?.username ?? "",
      name: data?.name ?? data?.fullName ?? data?.username ?? "",
      phone: data?.phone ?? "",
      gender: data?.gender ?? "",
      avatar: data?.avatar ?? data?.avatarUrl ?? "",
    };
    const looksEmpty =
      !normalized.id || (!normalized.email && !normalized.username);
    if (looksEmpty) {
      const cached = localStorage.getItem("user");
      if (cached) return JSON.parse(cached);
      return seedDefaultUser();
    }
    localStorage.setItem("user", JSON.stringify(normalized));
    return normalized;
  } catch {
    try {
      const cached = JSON.parse(localStorage.getItem("user") || "null");
      if (cached && typeof cached === "object") return cached;
    } catch {}
    return seedDefaultUser();
  }
}

const UPDATE_PATH =
  import.meta.env.VITE_PROFILE_UPDATE_PATH?.trim() || "/profile";


export async function updateProfile(payload) {
  if (FORCE_MOCK) {
    const cached = JSON.parse(localStorage.getItem("user") || "null") || {};
    const merged = { ...cached, ...payload };
    localStorage.setItem("user", JSON.stringify(merged));
    return merged;
  }
  try {
    const { data } = await api.put(UPDATE_PATH, payload);
    const cached = JSON.parse(localStorage.getItem("user") || "null");
    const merged = { ...(cached || {}), ...(data || {}), ...payload };
    localStorage.setItem("user", JSON.stringify(merged));
    return merged;
  } catch {
    const cached = JSON.parse(localStorage.getItem("user") || "null") || {};
    const merged = { ...cached, ...payload };
    localStorage.setItem("user", JSON.stringify(merged));
    return merged;
  }
}

export default api;
