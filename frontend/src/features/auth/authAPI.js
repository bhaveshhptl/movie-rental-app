import api from "../../services/api.js";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);

  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  return response.data;
};

export const getCurrentUser = async (accessToken) => {
  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const refreshAccessToken = async (refreshToken) => {
  const response = await api.post("/auth/refresh-token", {
    refreshToken,
  });

  return response.data;
};

export const logoutUser = async (refreshToken) => {
  const response = await api.post("/auth/logout", {
    refreshToken,
  });

  return response.data;
};