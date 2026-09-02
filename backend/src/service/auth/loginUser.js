import crypto from "crypto";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { hashPassword , comparePassword} from "../../utils/password.js";
import { jsonServerClient } from "../../config/jsonServer.js";

export const loginUser = async ({ email, password }) => {
  const response = await jsonServerClient.get(
    `/users?email=${encodeURIComponent(email)}`
  );

  const users = response.data;

  if (!users.length) {
    throw new Error("Invalid email or password");
  }

  const user = users[0];

  const passwordValid = await comparePassword(
    password,
    user.passwordHash
  );

  if (!passwordValid) {
    throw new Error("Invalid email or password");
  }

  // Create a unique session
  const sessionId = crypto.randomUUID();

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, sessionId);

  // Hash refresh token before storing it
  const refreshTokenHash = await hashPassword(refreshToken);

  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + 30 * 24 * 60 * 60 * 1000
  );

  // Store only the HASH of the refresh token
  await jsonServerClient.post("/sessions", {
    id: sessionId,
    userId: user.id,
    refreshTokenHash,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    rotatedAt: null,
    revokedAt: null
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};