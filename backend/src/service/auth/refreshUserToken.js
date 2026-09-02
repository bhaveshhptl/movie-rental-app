import bcrypt from "bcryptjs";
import { jsonServerClient } from "../../config/jsonServer.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";

export const refreshUserToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
    console.log("Decoded refresh token:", decoded);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }

  const { userId, sid } = decoded;

  if (!userId || !sid) {
    throw new Error("Invalid refresh token");
  }

  // --------------------------------------------------
  // Find the session
  // --------------------------------------------------

  const sessionResponse = await jsonServerClient.get(
    `/sessions/${sid}`
  );

  const session = sessionResponse.data;

  if (!session || session.userId !== userId) {
    throw new Error("Invalid session");
  }

  // --------------------------------------------------
  // Verify refresh token against stored hash
  // --------------------------------------------------

  const refreshTokenMatches = await bcrypt.compare(
    refreshToken,
    session.refreshToken
  );

  if (!refreshTokenMatches) {
    throw new Error("Invalid refresh token");
  }

  // --------------------------------------------------
  // Get user
  // --------------------------------------------------

  const userResponse = await jsonServerClient.get(
    `/users/${userId}`
  );

  const user = userResponse.data;

  if (!user) {
    throw new Error("User not found");
  }

  // --------------------------------------------------
  // Generate new tokens
  // --------------------------------------------------

  const newAccessToken = generateAccessToken(user);

  const newRefreshToken = generateRefreshToken(user, sid);

  // --------------------------------------------------
  // Rotate refresh token
  // --------------------------------------------------

  const hashedRefreshToken = await bcrypt.hash(
    newRefreshToken,
    10
  );

  await jsonServerClient.patch(`/sessions/${sid}`, {
    refreshToken: hashedRefreshToken,
    updatedAt: new Date().toISOString(),
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};