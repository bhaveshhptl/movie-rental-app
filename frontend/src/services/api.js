import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// AUTH HANDLERS
// =====================================================
//
// These are configured from main.jsx after Redux store
// has been created.
//
// This avoids importing the Redux store directly here
// and prevents a circular dependency:
//
// store → authSlice → authAPI → api → store
// =====================================================

let authHandlers = {
  getAccessToken: () => null,
  getRefreshToken: () =>
    localStorage.getItem("refreshToken"),

  setAccessToken: () => {},
  setRefreshToken: () => {},

  clearAuth: () => {},
};

export const configureAuthHandlers = (handlers) => {
  authHandlers = {
    ...authHandlers,
    ...handlers,
  };
};

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
  (config) => {
    const accessToken =
      authHandlers.getAccessToken();

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =====================================================
// REFRESH STATE
// =====================================================
//
// If multiple requests receive 401 at the same time,
// we don't want to send multiple refresh requests.
//
// Example:
//
// Request A → 401 ─┐
// Request B → 401 ─┼→ ONE refresh request
// Request C → 401 ─┘
//
// All requests wait for that same refresh.
// =====================================================

let refreshPromise = null;

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    const isUnauthorized =
      error.response.status === 401;

    const isRefreshRequest =
      originalRequest?.url?.includes(
        "/auth/refresh-token"
      );

    const alreadyRetried =
      originalRequest?._retry;

    // --------------------------------------------------
    // Do not refresh when:
    //
    // 1. Request wasn't 401
    // 2. Request is already the refresh request
    // 3. Request has already been retried
    // --------------------------------------------------

    if (
      !isUnauthorized ||
      isRefreshRequest ||
      alreadyRetried
    ) {
      return Promise.reject(error);
    }

    const refreshToken =
      authHandlers.getRefreshToken();

    if (!refreshToken) {
      authHandlers.clearAuth();

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // --------------------------------------------------
    // Reuse an existing refresh request if one is
    // already running.
    // --------------------------------------------------

    if (!refreshPromise) {
      refreshPromise = axios
        .post(
          "http://localhost:5000/api/auth/refresh-token",
          {
            refreshToken,
          },
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        )
        .then((response) => {
          const {
            accessToken,
            refreshToken: newRefreshToken,
          } = response.data;

          authHandlers.setAccessToken(
            accessToken
          );

          if (newRefreshToken) {
            authHandlers.setRefreshToken(
              newRefreshToken
            );
          }

          return accessToken;
        })
        .catch((refreshError) => {
          authHandlers.clearAuth();

          throw refreshError;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    try {
      const newAccessToken =
        await refreshPromise;

      // ------------------------------------------------
      // Retry original request with new token
      // ------------------------------------------------

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default api;