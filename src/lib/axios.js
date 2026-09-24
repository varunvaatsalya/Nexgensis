import axios from "axios";
import { getAuthToken, clearAuth } from "@/lib/auth";

/**
 * Custom normalized API Error class.
 */
export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Shared central Axios instance.
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://dummyjson.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

/**
 * Request Interceptor: inject Authorization Bearer token if available.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: centralized error normalization and 401 handling.
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If request was aborted/canceled, pass it through without converting to ApiError
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const status = error?.response?.status;
    const errorData = error?.response?.data;
    const url = error?.config?.url || "";

    // If 401 Unauthorized occurs on any non-login endpoint, clear auth and redirect
    const isLoginEndpoint = url.includes("/auth/login");
    if (status === 401 && !isLoginEndpoint) {
      clearAuth();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/login?session_expired=true";
      }
    }

    // Extract user-friendly error message
    let message = "An unexpected error occurred. Please try again.";
    if (errorData?.message) {
      message = errorData.message;
    } else if (error?.message) {
      message = error.message;
    }

    return Promise.reject(new ApiError(message, status || 500, errorData));
  }
);

export default apiClient;
