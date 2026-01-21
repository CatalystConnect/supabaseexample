import axios from "axios";
import { supabase } from "@/lib/supabaseClient";
import { supabaseBrowser } from "./supabase/browser";

export const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
});

// ✅ prevent multiple logout calls
let isLoggingOut = false;

api.interceptors.request.use(async (config) => {
  const supabase = supabaseBrowser();
  const { data } = await supabase.auth.getSession();

  const token = data?.session?.access_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";

    // ✅ Never auto logout for auth endpoints
    const ignoreUrls = ["/auth/login", "/auth/refresh", "/auth/google"];

    const shouldIgnore = ignoreUrls.some((u) => url.includes(u));
    if (shouldIgnore) return Promise.reject(error);

    if (status === 401 && !isLoggingOut) {
      isLoggingOut = true;

      console.warn("401 -> Supabase signOut");
      await supabase.auth.signOut();

      // unlock
      setTimeout(() => {
        isLoggingOut = false;
      }, 3000);

      // optional redirect
      if (typeof window !== "undefined") window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;
