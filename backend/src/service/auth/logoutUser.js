import { jsonServerClient } from "../../config/jsonServer.js";
import { verifyRefreshToken } from "../../utils/jwt.js";

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    // Token is already invalid/expired.
    // The user's local auth state can still be cleared.
    return;
  }

  const { sid } = decoded;

  if (!sid) {
    return;
  }

  try {
    await jsonServerClient.delete(`/sessions/${sid}`);
  } catch (error) {
    // Session may already have been removed.
    // Logout should remain idempotent.
    if (error.response?.status !== 404) {
      throw error;
    }
  }
};