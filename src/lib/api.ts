/**
 * Utility functions for making API requests with consistent auth and error handling.
 */

import { API_BASE_URL } from "./config";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type QueryValue = string | number | boolean | null | undefined;
export type ApiHeaders = Record<string, string>;

export interface ApiRequestOptions {
  method?: HttpMethod;
  data?: unknown;
  headers?: ApiHeaders;
  auth?: boolean;
  signal?: AbortSignal;
  query?: Record<string, QueryValue>;
}

const JSON_CONTENT_TYPE = "application/json";

function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("token");
}

/**
 * Build a headers object, optionally including the bearer token.
 */
export function getAuthHeaders(includeAuth = true): ApiHeaders {
  const headers: ApiHeaders = {
    "Content-Type": JSON_CONTENT_TYPE,
  };

  if (!includeAuth) {
    return headers;
  }

  const token = getStoredToken();

  if (!token) {
    throw new Error("Geen authenticatie token gevonden");
  }

  headers.Authorization = `Bearer ${token}`;
  return headers;
}

function mergeHeaders(base: ApiHeaders, extra?: ApiHeaders): ApiHeaders {
  return extra ? { ...base, ...extra } : base;
}

function resolveEndpoint(endpoint: string, query?: ApiRequestOptions["query"]): string {
  if (!query) {
    return endpoint;
  }

  return `${endpoint}${buildQueryString(query)}`;
}

async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = "GET", data, headers, auth = true, signal, query } = options;

  const url = `${API_BASE_URL}${resolveEndpoint(endpoint, query)}`;
  const finalHeaders = mergeHeaders(getAuthHeaders(auth), headers);

  const requestInit: RequestInit = {
    method,
    headers: finalHeaders,
    signal,
  };

  if (data !== undefined) {
    if (data instanceof FormData) {
      delete finalHeaders["Content-Type"];
      requestInit.body = data;
    } else {
      requestInit.body = JSON.stringify(data);
    }
  }

  const response = await fetch(url, requestInit);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      (errorBody && typeof errorBody === "object" && "message" in errorBody && errorBody.message) ||
      (errorBody && typeof errorBody === "object" && "error" in errorBody && (errorBody as { error?: unknown }).error);
    throw new Error(
      typeof message === "string" && message.trim().length > 0 ? message : `HTTP ${response.status}`
    );
  }

  if (response.status === 204 || response.status === 205) {
    return undefined as T;
  }

  const contentType = response.headers.get("Content-Type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function apiGet<T>(endpoint: string, options?: Omit<ApiRequestOptions, "method" | "data">): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: "GET" });
}

export async function apiPost<T>(endpoint: string, data?: unknown, options?: Omit<ApiRequestOptions, "method" | "data">): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: "POST", data });
}

export async function apiPut<T>(endpoint: string, data: unknown, options?: Omit<ApiRequestOptions, "method" | "data">): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: "PUT", data });
}

export async function apiDelete<T>(endpoint: string, options?: Omit<ApiRequestOptions, "method" | "data">): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: "DELETE" });
}

/**
 * Build query string from object
 */
export function buildQueryString(params: Record<string, QueryValue>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

// =============================================================================
// ADMIN API FUNCTIONS
// =============================================================================

/**
 * Admin: Get all VKMs (with optional filters)
 */
export async function adminGetVKMs<T>(query?: Record<string, QueryValue>): Promise<T> {
  return apiGet<T>("/vkm");
}

/**
 * Admin: Create a new VKM
 */
export async function adminCreateVKM<T>(data: unknown): Promise<T> {
  return apiPost<T>("/vkm", data);
}

/**
 * Admin: Update a VKM
 */
export async function adminUpdateVKM<T>(id: string, data: unknown): Promise<T> {
  return apiPut<T>(`/vkm/${id}`, data);
}

/**
 * Admin: Delete a VKM
 */
export async function adminDeleteVKM<T>(id: string): Promise<T> {
  return apiDelete<T>(`/vkm/${id}`);
}

/**
 * Admin: Get all users
 */
export async function adminGetUsers<T>(): Promise<T> {
  return apiGet<T>("/auth/users");
}

/**
 * Admin: Get a specific user by ID
 */
export async function adminGetUser<T>(id: string): Promise<T> {
  return apiGet<T>(`/auth/users/${id}`);
}

/**
 * Admin: Update a user
 */
export async function adminUpdateUser<T>(id: string, data: unknown): Promise<T> {
  return apiPut<T>(`/auth/users/${id}`, data);
}

/**
 * Admin: Delete a user
 */
export async function adminDeleteUser<T>(id: string): Promise<T> {
  return apiDelete<T>(`/auth/users/${id}`);
}
