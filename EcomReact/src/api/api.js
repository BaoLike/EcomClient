import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    withCredentials: true
});


api.interceptors.request.use((config) => {
  const rawToken = localStorage.getItem("access_token");
  const rawAuth = localStorage.getItem("auth");
  let token = null;

  if (rawToken) {
    token = rawToken;
  } else if (rawAuth) {
    try {
      const a = JSON.parse(rawAuth);
      token = a?.jwtToken || a?.accessToken || a?.token || null;
    } catch {}
  }

  if (token) {
    if (!/^Bearer\s/i.test(token)) token = `Bearer ${token}`;
    config.headers.Authorization = token;
  }
  return config;
});


api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);


export async function getProfile() {
  let data;
  try {
    ({ data } = await api.get("/profile"));
  } catch (e) {
   
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  }

  const normalized = {
    id: data?.id ?? 0,
    email: data?.email ?? "",
    username: data?.username ?? "",
    name: data?.name ?? data?.fullName ?? "",
    phone: data?.phone ?? "",
    role: data?.role ?? "USER",
    avatar: data?.avatar ?? data?.avatarUrl ?? "",
  };

 
  const looksEmpty =
    !normalized.id || normalized.id === 0 ||
    (!normalized.email && !normalized.username);

  if (looksEmpty) {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : normalized;
  }

  localStorage.setItem("user", JSON.stringify(normalized));
  return normalized;
}

export default api;