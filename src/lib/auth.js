import Cookies from "js-cookie";

export const AUTH_TOKEN_KEY = "auth_token";
export const AUTH_USER_KEY = "auth_user";

/**
 * Retrieve the access token from cookies or localStorage.
 */
export function getAuthToken() {
  if (typeof window === "undefined") return null;
  const cookieToken = Cookies.get(AUTH_TOKEN_KEY);
  if (cookieToken) return cookieToken;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Save access token into both cookie and localStorage.
 */
export function setAuthToken(token, days = 7) {
  if (!token) return;
  Cookies.set(AUTH_TOKEN_KEY, token, {
    expires: days,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

/**
 * Retrieve stored user metadata from localStorage.
 */
export function getAuthUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Store user metadata in localStorage.
 */
export function setAuthUser(user) {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(AUTH_USER_KEY);
    return;
  }
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

/**
 * Clear authentication credentials and user profile.
 */
export function clearAuth() {
  Cookies.remove(AUTH_TOKEN_KEY, { path: "/" });
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }
}

/**
 * Check if the user is authenticated.
 */
export function isAuthenticated() {
  return Boolean(getAuthToken());
}
