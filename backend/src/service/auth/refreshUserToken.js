import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../../utils/jwt.js";

import {
  hashPassword,
  comparePassword
} from "../../utils/password.js";

import { jsonServerClient } from "../../config/jsonServer.js";

export const refreshAccessToken = async (refreshToken) => {
  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }

  const { userId, sid } = decoded;

  if (!userId || !sid) {
    throw new Error("Invalid refresh token");
  }

  // Find the session
  const sessionResponse = await jsonServerClient.get(
    `/sessions/${sid}`
  );

  const session = sessionResponse.data;

  if (!session) {
    throw new Error("Session not found");
  }

  // Verify session belongs to this user
  if (session.userId !== userId) {
    throw new Error("Invalid refresh session");
  }

  // Check revocation
  if (session.revokedAt) {
    throw new Error("Session has been revoked");
  }

  // Check expiration
  if (new Date(session.expiresAt) <= new Date()) {
    throw new Error("Refresh session has expired");
  }

  // Compare supplied token with stored hash
  const validToken = await comparePassword(
    refreshToken,
    session.refreshTokenHash
  );

  if (!validToken) {
    throw new Error("Invalid refresh token");
  }

  // Get current user
  const userResponse = await jsonServerClient.get(
    `/users/${userId}`
  );

  const user = userResponse.data;

  if (!user) {
    throw new Error("User not found");
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user, sid);

  // Hash new refresh token
  const newRefreshTokenHash =
    await hashPassword(newRefreshToken);

  // Rotate refresh token
  await jsonServerClient.patch(`/sessions/${sid}`, {
    refreshTokenHash: newRefreshTokenHash,
    rotatedAt: new Date().toISOString()
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};