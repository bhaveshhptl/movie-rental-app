import bcrypt from "bcryptjs";
import { jsonServerClient } from "../../config/jsonServer.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt.js";

export const loginUser = async ({ email, password }) => {
  const response = await jsonServerClient.get("/users", {
    params: {
      email,
    },
  });

  const users = response.data;

  if (!users.length) {
    throw new Error("Invalid email or password");
  }

  const user = users[0];

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  // --------------------------------------------------
  // Remove all existing sessions for this user
  // --------------------------------------------------

  const sessionsResponse = await jsonServerClient.get("/sessions", {
    params: {
      userId: user.id,
    },
  });

  const existingSessions = sessionsResponse.data;

  await Promise.all(
    existingSessions.map((session) =>
      jsonServerClient.delete(`/sessions/${session.id}`)
    )
  );

  // --------------------------------------------------
  // Create a new session
  // --------------------------------------------------

  const sessionResponse = await jsonServerClient.post("/sessions", {
    userId: user.id,
    refreshToken: null,
    createdAt: new Date().toISOString(),
  });

  const session = sessionResponse.data;
  
  // --------------------------------------------------
  // Generate tokens
  // --------------------------------------------------

  const accessToken = generateAccessToken(user);

  const refreshToken = generateRefreshToken(user, session.id);

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  // --------------------------------------------------
  // Store refresh token in session
  // --------------------------------------------------

  await jsonServerClient.patch(`/sessions/${session.id}`, {
    refreshToken : hashedRefreshToken,
    updatedAt: new Date().toISOString(),
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};