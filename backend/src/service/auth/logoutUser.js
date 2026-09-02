import { jsonServerClient } from "../../config/jsonServer.js";

export const logoutUser = async (refreshToken) => {
  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new Error("Invalid refresh token");
  }

  const { sid } = decoded;

  if (!sid) {
    throw new Error("Invalid refresh token");
  }

  const sessionResponse = await jsonServerClient.get(
    `/sessions/${sid}`
  );

  const session = sessionResponse.data;

  if (!session) {
    throw new Error("Session not found");
  }

  await jsonServerClient.patch(`/sessions/${sid}`, {
    revokedAt: new Date().toISOString()
  });

  return {
    success: true
  };
};