import apiClient from "@/lib/axios";

/**
 * Service for authentication API endpoints.
 */
export const authService = {
  /**
   * Log in user with username and password.
   * 
   * @param {object} credentials - { username, password, expiresInMins }
   * @param {object} [options] - Optional config e.g. { signal }
   * @returns {Promise<object>} Auth payload containing accessToken and user details
   */
  async login({ username, password, expiresInMins = 60 }, options = {}) {
    const response = await apiClient.post(
      "/auth/login",
      { username, password, expiresInMins },
      { signal: options.signal }
    );
    return response.data;
  },

  /**
   * Fetch current authenticated user profile.
   * 
   * @param {object} [options] - Optional config e.g. { signal }
   * @returns {Promise<object>} User profile
   */
  async getCurrentUser(options = {}) {
    const response = await apiClient.get("/auth/me", {
      signal: options.signal,
    });
    return response.data;
  },
};
