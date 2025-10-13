const rawBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.CLOUD_API_ROUTE ?? "";

export const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");

export const API_AUTH_ENDPOINTS = {
  login: "/auth/login",
  register: "/auth/register",
} as const;
